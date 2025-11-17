const express = require("express");
const router = express.Router();
let { users } = require("../data/user");
let tasks = require("../data/tasksData");

router.get("/:userId", (req, res) => {
    const userId = parseInt(req.params.userId);
    const user = users.find(u => u.id === userId);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    const today = new Date();
    const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000);
    const todayStr = localToday.toISOString().split("T")[0];

    const dayOfWeek = localToday.getDay();
    const diffToMonday = (dayOfWeek + 6) % 7;
    const monday = new Date(localToday);
    monday.setDate(localToday.getDate() - diffToMonday);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const mondayStr = monday.toISOString().split("T")[0];
    const sundayStr = sunday.toISOString().split("T")[0];

    const allUserTasks = tasks.map(t => ({
        ...t,
        completed: Boolean(t.completed),
    }));

    const dailyTasks = allUserTasks.filter(t =>
        t.date && t.date.startsWith(todayStr)
    );

    const weeklyTasks = allUserTasks.filter(t => {
        if (!t.date) {
            return false;
        }
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
});

module.exports = router;
