// routes/login.js
const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/User");

router.post("/", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password){
        return res.status(400).json({ error: "Username and password required" });
    }

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ error: "Incorrect password" });
        }

        req.session.userId = user._id;

        res.status(200).json({
            message: "Login successful",
            user: { username: user.username, name: user.name }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
