const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Update account info
router.post("/", async (req, res) => {
    const { userId } = req.session; // get logged-in user
    const { bio, major, school, grade, timezone } = req.body;

    if (!userId) {
        return res.status(401).json({ error: "Not logged in" });
    }

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        // Update fields if provided
        user.bio = bio || user.bio;
        user.major = major || user.major;
        user.school = school || user.school;
        user.grade = grade || user.grade;
        user.timezone = timezone || user.timezone;

        await user.save();

        res.json({
            message: "Account setup complete",
            user: {
                id: user._id,
                username: user.username,
                name: user.name,
                bio: user.bio,
                major: user.major,
                school: user.school,
                grade: user.grade,
                timezone: user.timezone
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// Delete account
router.delete("/account", async (req, res) => {
    const { userId } = req.session;
    if (!userId) {
        return res.status(401).json({ error: "Not logged in" });
    }

    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        // Optionally destroy session
        req.session.destroy();

        res.json({ success: true, message: "Account deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
