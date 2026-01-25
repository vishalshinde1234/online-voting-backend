console.log("AUTH ROUTES FILE LOADED");


const express = require("express");


const bcrypt = require("bcryptjs");


const jwt = require("jsonwebtoken");

const User = require("../models/user");


const router = express.Router();


router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully"
    });

  } catch (error) {
  console.error("SIGNUP ERROR FULL:", error);

  res.status(500).json({
    message: error.message
  });
}

});


router.post("/make-admin", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOneAndUpdate(
      { email },
      { role: "admin" },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json({
      message: "User promoted to admin",
      user
    });

  } catch (error) {
    console.error("MAKE ADMIN ERROR:", error);
    res.status(500).json({
      message: "Server error"
    });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: "JWT secret not configured"
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({
      message: "Server error"
    });
  }
});

module.exports = router;
