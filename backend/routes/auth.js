const express=require("express");

const router=express.Router();

const User=require('../models/User');

const { body, validationResult } = require("express-validator");

const bcrypt = require('bcryptjs'); // for hashing the password before saving it to the database

const jwt = require('jsonwebtoken'); // for generating a token for the user after successful login

const JWT_SECRET = "TilakIsAGood$Boy"; // secret key for signing the JWT token, should be kept in env variable in production

const fetchuser=require('../middleware/fetchuser');

// Route:1 Create a User using: POST "/api/auth/createUser".. Doesnt require Auth
router.post('/createUser',

  // Validation rules
  [
    body("name", "Name must be at least 3 characters").isLength({ min: 3 }),
    body("email", "Enter valid email").isEmail(),
    body("password")
  .isLength({ min: 5 }).withMessage("Minimum 5 characters")
  .matches(/[A-Z]/).withMessage("At least one uppercase letter")
  .matches(/[a-z]/).withMessage("At least one lowercase letter")
  .matches(/[0-9]/).withMessage("At least one number"),
  ],
 async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }    
    try {
      // Create user if not exists
      const existingUserEmail = await User.findOne({ email: req.body.email });
       if (existingUserEmail) {
    return res.status(400).json({ error: "User already exists give unique email" });
  }
      const existingUserName = await User.findOne({ name: req.body.name });
       if (existingUserName) {
    return res.status(400).json({ error: "User already exists give unique UserName" });
  }
   const user = new User(req.body);
   const salt = await bcrypt.genSalt(10);
   user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  const data={
    user:{
      id:user.id
    }
  }
  const authToken = jwt.sign(data, JWT_SECRET);
  res.json({ token: authToken });

} catch (err) {
  console.error(err.message);
  res.status(500).send("Internal Server Error");
}
});

//Route:2 Authenticate a User using: POST "/api/auth/loginUser".
router.post('/loginUser',

  // Validation rules
  [
    body("email", "Enter valid email").isEmail(),
    body("password","Password cannot be blank").exists()
  ],
 async(req,res)=>{
 
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }
  try{
    let {email,password}=req.body;
    console.log(email)
    let user= await User.findOne({email:email});
    //If the email entered by the user doesnn't exits in the db
    if(!user){
      return res.status(400).json({error:"Please try again with correct credentials"});
    }

    const passwordCompare=await bcrypt.compare(password,user.password);
    // if the password entered by the user does not match with the user password in the db
    if(!passwordCompare){
      return res.status(400).json({error:"Please try again with correct credentials"});
    }
    // if user enters correct credentials
    const data={
    user:{
      id:user.id
    }
  }
  const authToken = jwt.sign(data, JWT_SECRET);
  res.json({ token: authToken });
    }
    catch (err) {
  console.error(err.message);
  res.status(500).send("Internal Server Error....");
}

  });

// Route:3 Get logged in User Details using: POST "/api/auth/getUser". Login required
router.post('/getUser',fetchuser,
 async(req,res)=>{
  try {
    const userId=req.user.id;
    const user=await User.findById(userId).select("-password");
    res.send(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal Server Error....");
  }


});









module.exports = router;

/*
Routes in express.js decidewhat to do when a client (browser/app) hits a specific URL with a specific HTTP method

router.method(path, callback) is used to define a route in Express.js

where method is the HTTP method (like GET, POST, etc.), 
path is the URL path,  
callback is the function that will be executed when the route is hit.

In Express.js, every route handler gets two important objects:

req = request object
It contains everything the client sends to your server

res = response object
Used to send data back to client

If you don’t send res, the request will hang (browser keeps loading)


*/