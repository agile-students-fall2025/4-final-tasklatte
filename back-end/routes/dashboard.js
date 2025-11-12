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

    const allUserTasks = tasks.map(t => ({
        ...t,
        completed: false,
    }));
    
    const dailyTasks = allUserTasks;
    const weeklyTasks = allUserTasks;

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
