const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");

// Profile pics
const profilePics = Array.from({ length: 10 }, (_, i) => `pic${i + 1}.jpeg`);

// ---------------------------------------------
// Validation Rules for Registration
// ---------------------------------------------
const registerValidation = [
  body("username")
    .trim()
    .notEmpty().withMessage("Username is required")
    .isLength({ max: 15 }).withMessage("Username cannot exceed 15 characters"),

  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ max: 20 }).withMessage("Name cannot exceed 20 characters"),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ max: 15 }).withMessage("Password cannot exceed 15 characters"),
];

// ---------------------------------------------
// Validation Error Handler
// ---------------------------------------------
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  console.log("Validation errors:", errors.array());
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array()[0].msg
    });
  }
  next();
};

// ---------------------------------------------
// POST /register
// Creates a new user
// ---------------------------------------------
router.post("/", registerValidation, handleValidationErrors, async (req, res) => {
  const { username, name, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already taken" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const randomPic = profilePics[Math.floor(Math.random() * profilePics.length)];

    const newUser = new User({
      username,
      name,
      password: hashed,
      photo: randomPic,
    });

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.setHeader("Authorization", `Bearer ${token}`);
    res.setHeader("Access-Control-Expose-Headers", "Authorization");

    res.json({
      message: "User registered",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        name: newUser.name,
        photo: newUser.photo,
      },
    });
  } catch (err) {
    console.error(err);

    if (err.name === "ValidationError") {
      return res.status(400).json({
        error: Object.values(err.errors).map(e => e.message)[0]
      });
    }

    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
