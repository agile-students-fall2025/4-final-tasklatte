const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// GET all tasks
router.get("/", async (req, res) => {
  try {
    const { q, course, priority, date, completed } = req.query;

    let filter = {};

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { details: { $regex: q, $options: "i" } },
      ];
    }

    if (course) filter.course = new RegExp(course, "i");
    if (priority) filter.priority = priority;
    if (date) filter.date = new RegExp(`^${date}`);
    if (typeof completed !== "undefined") {
      filter.completed = completed === "true" || completed === "1";
    }

    const tasks = await Task.find(filter).sort({ date: 1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET daily tasks
router.get("/daily/:date", async (req, res) => {
  try {
    const tasks = await Task.find({ date: { $regex: `^${req.params.date}` } });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single task
router.get("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create task
router.post("/", async (req, res) => {
  try {
    const { title, details, course, date, priority, completed, duration } = req.body;

    const task = await Task.create({
      title,
      details,
      course,
      date,
      priority,
      completed: Boolean(completed),
      duration,
    });

    res.status(201).json({ success: true, task });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update task
router.put("/:id", async (req, res) => {
  try {
    const updates = { ...req.body };

    // convert to boolean
    if (typeof updates.completed !== "undefined") {
      updates.completed = Boolean(updates.completed);
    }

    const task = await Task.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    if (!task) return res.status(404).json({ error: "Task not found" });

    res.json({ success: true, task });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE task
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, error: "Task not found" });

    res.json({ success: true, deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
