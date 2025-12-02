const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const Class = require("../models/Class");
const auth = require("../middleware/auth");
// ----------------------------
// GET /api/ai/daily/:date
// Fetch all tasks for a user on a specific date
// ----------------------------
router.get("/daily/:date", auth, async (req, res) => {
  const { date } = req.params;
  // const { userId } = req.query;
  const userId = req.user.userId;
  if (!userId) return res.status(400).json({ error: "Missing userId" });

  try {
    const tasks = await Task.find({ date, userId }).sort({ createdAt: 1 });

    const dailyTasks = tasks.map((t) => ({
      id: t._id,
      task: t.title,
      duration: t.duration || 60, // default 1 hour if not set
    }));

    res.json(dailyTasks);
  } catch (err) {
    console.error("Error fetching daily tasks:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ----------------------------
// PUT /api/ai/task/:id
// Update task duration or other fields
// ----------------------------
router.put("/task/:id", auth, async (req, res) => {
  const { id } = req.params;
  const { duration, title, details, date, course, priority, completed } = req.body;

  try {
    const task = await Task.findById(id);
    if (!task || task.userId.toString() !== req.user.userId) return res.status(404).json({ error: "Task not found" });

    if (duration !== undefined) task.duration = duration;
    if (title !== undefined) task.title = title;
    if (details !== undefined) task.details = details;
    if (date !== undefined) task.date = date;
    if (course !== undefined) task.course = course;
    if (priority !== undefined) task.priority = priority;
    if (completed !== undefined) task.completed = completed;

    await task.save();

    res.json({ success: true, task });
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ----------------------------
// GET /api/ai/classes
// Fetch all classes for a user
// ----------------------------
router.get("/classes", async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: "Missing userId" });

  try {
    const classes = await Class.find({ userId }).sort({ startTime: 1 });
    res.json(classes);
  } catch (err) {
    console.error("Error fetching classes:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
