// // routes/login.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");

const loginValidation = [
    body("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required")
        .isLength({ max: 15 })
        .withMessage("Username cannot exceed 15 characters"),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ max: 15 })
        .withMessage("Password cannot exceed 15 characters"),
];

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

router.post("/", loginValidation, handleValidationErrors, async (req, res) => {
    const { username, password } = req.body;
  
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Incorrect password" });
        }
  
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
  
        res.setHeader("Authorization", `Bearer ${token}`);
        res.setHeader("Access-Control-Expose-Headers", "Authorization");
  
        return res.json({
            message: "Login successful",
            token,
            user: {
            id: user._id,
            username: user.username,
            name: user.name,
            },
        });
  
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
});
  
module.exports = router;
