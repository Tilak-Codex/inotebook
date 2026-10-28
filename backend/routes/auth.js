const express = require("express");
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const fetchuser = require('../middleware/fetchuser');

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

module.exports = router;
