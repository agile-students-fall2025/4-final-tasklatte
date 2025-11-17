const express = require("express");
const router = express.Router();
let tasks = require("../data/tasksData");

// GET /api/ai/daily/:date
router.get("/daily/:date", (req, res) => {
  const { date } = req.params;
  const dailyTasks = tasks
    .filter((t) => t.date.startsWith(date))
    .map((t) => ({
      id: t.id,
      task: t.title,
      duration: t.duration || 60, // fallback duration if not specified
    }));
  res.json(dailyTasks);
});

module.exports = router;
