const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Task = require("../models/Task");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  const userId = req.userId;

  try {
    // Find the user in MongoDB
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Get today's date
    const today = new Date();
    const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000);
    const todayStr = localToday.toISOString().split("T")[0];

    // Week boundaries (Monday-Sunday)
    const dayOfWeek = localToday.getDay();
    const diffToMonday = (dayOfWeek + 6) % 7;
    const monday = new Date(localToday);
    monday.setDate(localToday.getDate() - diffToMonday);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const mondayStr = monday.toISOString().split("T")[0];
    const sundayStr = sunday.toISOString().split("T")[0];

    // Fetch tasks for this user
    const allUserTasks = await Task.find({ userId });

    // Daily tasks
    const dailyTasks = allUserTasks.filter(t => t.date && t.date.startsWith(todayStr));

    // Weekly tasks
    const weeklyTasks = allUserTasks.filter(t => {
      if (!t.date) return false;
      const d = t.date.substring(0, 10);
      return d >= mondayStr && d <= sundayStr;
    });

    res.json({
      user: { username: user.username, name: user.name },
      dailyTasks: {
        total: dailyTasks.length,
        completed: dailyTasks.filter(t => t.completed).length,
      },
      weeklyTasks: {
        total: weeklyTasks.length,
        completed: weeklyTasks.filter(t => t.completed).length,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
