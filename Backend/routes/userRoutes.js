const express = require("express");
const bcrypt = require("bcryptjs");
const User  = require("../models/userModel");
const { generateToken } = require("../utils/generateToken.js");
const router = express.Router();

router.get("/check/:email", async (req, res) => {
  console.log('Checking user for email:', req.params.email); 
  try {
    const user = await User.findOne({ email: req.params.email });
    if (user) {
      res.json({ exists: true },user);
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    console.error('Error checking user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/allusers',async(req,res)=>{
   try {
    const data=await User.find({role:'student'})
    res.status(200).json({
        data
    })
   } catch (error) {
 res.json({
    message:error.message
 })   
   }
})

router.post('/', async (req,res) => {
    try {
        const { name, email, role, photoUrl } = req.body;
      
        let user = await User.findOne({ email });

        if(user) {
            return res.status(400).json({ message: 'User already exists' });
        } 

        user = new User({
            name,
            email,
            role,
            photoUrl
          });
          
          await user.save();
          
          res.json({ success: true, user });

    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
})

//without clerk
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        console.log("Request body:", req.body);

        if (!name || !email || !password) {
            console.log("Missing fields");
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        const user = await User.findOne({ email });
        console.log("User lookup:", user);

        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exists with this email."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Password hashed successfully");

        await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        return res.status(201).json({
            success: true,
            message: "Account created successfully."
        });
    } catch (error) {
        console.log("Error in register:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to register"
        });
    }
};



const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Incorrect email or password"
            });
        }

        // Log the password and user.password for debugging
        console.log("Provided password:", password);
        console.log("Stored password hash:", user.password);

        // Check if user.password is defined
        if (!user.password) {
            return res.status(400).json({
                success: false,
                message: "User password is missing"
            });
        }

        // Compare the provided password with the stored hash
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Incorrect email or password"
            });
        }

        // Generate token and send response
        generateToken(res, user, `Welcome back ${user.name}`);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to login"
        });
    }
};
const logout = async (_, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to logout"
        });
    }
};
router.get("/course/:userId/", async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId).populate("enrolledCourses");
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({ enrolledCourses: user.enrolledCourses });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;


module.exports = router;