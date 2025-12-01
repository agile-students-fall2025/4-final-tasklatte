// routes/register.js
const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/User");

router.post("/", async (req, res) => {
    const { username, name, password } = req.body;

    if (!username || !name || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ error: "Username already taken" });

        const hashed = await bcrypt.hash(password, 10);
        const newUser = new User({ username, name, password: hashed });
        await newUser.save();

        res.status(200).json({
            message: "User registered",
            user: { id: newUser._id, username: newUser.username, name: newUser.name }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
