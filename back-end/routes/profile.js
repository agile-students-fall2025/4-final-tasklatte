const express = require("express");
const router = express.Router();
const User = require("../models/User"); // MongoDB User model
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(400).json({ error: "Missing userId" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      id: user._id,
      name: user.name,
      username: user.username,
      bio: user.bio || "",
      major: user.major || "",
      school: user.school || "",
      grade: user.grade || "",
      timezone: user.timezone || "America/Los_Angeles",
      goals: user.goals || [],
    });
  } catch (err) {
    console.error("Profile error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
