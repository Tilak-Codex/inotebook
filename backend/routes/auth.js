const express = require("express");
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const fetchuser = require('../middleware/fetchuser');

const sendResetPasswordEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS
    }
  });

  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  const url = `${frontendUrl}/reset-password/${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "Reset your password - iNoteBook",
    html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #0f172a; color: #f8fafc;">
             <h2 style="color: #f43f5e; text-align: center;">Reset Your Password</h2>
             <p style="color: #94a3b8; font-size: 1rem; line-height: 1.5;">We received a request to reset your password. Click the button below to set a new password:</p>
             <div style="text-align: center; margin: 30px 0;">
               <a href="${url}" style="padding: 12px 24px; background-color: #6366f1; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);">Reset Password</a>
             </div>
             <p style="color: #64748b; font-size: 0.85rem; text-align: center;">This link will expire in 15 minutes.</p>
             <p style="color: #64748b; font-size: 0.85rem; text-align: center;">If you did not request a password reset, you can safely ignore this email.</p>
           </div>`
  });
};

// Route 1: Create a User using: POST "/api/auth/createUser". Doesn't require Auth
router.post(
  '/createUser',
  [
    body("name", "Name must be at least 3 characters").isLength({ min: 3 }),
    body("email", "Enter valid email").isEmail(),
    body("password")
      .isLength({ min: 5 }).withMessage("Minimum 5 characters")
      .matches(/[A-Z]/).withMessage("At least one uppercase letter")
      .matches(/[a-z]/).withMessage("At least one lowercase letter")
      .matches(/[0-9]/).withMessage("At least one number"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Check duplicates
      const existingUserEmail = await User.findOne({ email: req.body.email });
      if (existingUserEmail) {
        return res.status(400).json({ error: "User already exists with this email" });
      }

      const existingUserName = await User.findOne({ name: req.body.name });
      if (existingUserName) {
        return res.status(400).json({ error: "Username already taken, please choose another" });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const securePassword = await bcrypt.hash(req.body.password, salt);

      // Create user (immediately active, no email verification needed)
      const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: securePassword,
        isVerified: true
      });

      // Generate auth token
      const data = {
        user: {
          id: user.id
        }
      };
      const authToken = jwt.sign(data, JWT_SECRET);

      return res.status(200).json({
        success: true,
        token: authToken,
        message: "User registered successfully."
      });

    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Internal Server Error");
    }
  }
);

// Route 2: Authenticate a User using: POST "/api/auth/loginUser"
router.post(
  '/loginUser',
  [
    body("email", "Enter valid email").isEmail(),
    body("password", "Password cannot be blank").exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "Please try again with correct credentials" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({ error: "Please try again with correct credentials" });
      }

      const data = {
        user: {
          id: user.id
        }
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      return res.json({ success: true, token: authToken });

    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Internal Server Error");
    }
  }
);

// Route 3: Get logged-in User Details using: POST "/api/auth/getUser". Login required
router.post('/getUser', fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal Server Error");
  }
});

// Route 4: Send password reset link using: POST "/api/auth/forgotPassword". Doesn't require Auth
router.post(
  "/forgotPassword",
  [body("email", "Enter a valid email").isEmail()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: "User with this email does not exist." });
      }

      // Generate a short-lived reset token (15 minutes)
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
      );

      // Send the reset email
      await sendResetPasswordEmail(user.email, token);

      res.status(200).json({ message: "Password reset link sent to your email." });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Route 5: Reset password using: POST "/api/auth/resetPassword/:token". Doesn't require Auth
router.post(
  "/resetPassword/:token",
  [
    body("password")
      .isLength({ min: 5 }).withMessage("Minimum 5 characters")
      .matches(/[A-Z]/).withMessage("At least one uppercase letter")
      .matches(/[a-z]/).withMessage("At least one lowercase letter")
      .matches(/[0-9]/).withMessage("At least one number"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { password } = req.body;
      const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      user.isVerified = true;

      await user.save();

      res.status(200).json({ message: "Password updated successfully." });
    } catch (err) {
      console.error(err.message);
      res.status(400).json({ error: "Invalid or expired reset token" });
    }
  }
);

module.exports = router;
