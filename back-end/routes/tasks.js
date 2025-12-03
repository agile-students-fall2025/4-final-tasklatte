const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const auth = require("../middleware/auth");
const { validationResult, body } = require("express-validator");

const validateTask = [
  body("title")
    .trim()
    .optional()
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters"),
  body("details")
    .trim()
    .optional()
    .isLength({ max: 500 })
    .withMessage("Details cannot exceed 500 characters"),
  body("course")
    .trim()
    .optional()
    .isLength({ max: 100 })
    .withMessage("Course cannot exceed 100 characters"),
  body("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be a valid ISO 8601 string"),
  body("priority")
    .trim()
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority can only be low, medium, or high"),
  body("completed")
    .optional()
    .isBoolean()
    .withMessage("Completed must be true or false"),
  body("duration")
    .optional()
    .isInt({min: 1})
    .withMessage("Duration must be a positive integer"),
];

const handleValidationErrors = (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    next();
}


router.get("/", auth, async (req, res) => {
  try {
    const userId = req.userId;
    const { q, course, priority, date, completed } = req.query;

    let filter = { userId };

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { details: { $regex: q, $options: "i" } }
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
router.get("/daily/:date", auth, async (req, res) => {
  try {
    const userId = req.userId;

    const tasks = await Task.find({
      userId,
      date: { $regex: `^${req.params.date}` }
    });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single task
router.get("/:id", auth, async (req, res) => {
  try {
    const userId = req.userId;

    const task = await Task.findOne({
      _id: req.params.id,
      userId
    });

    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE new task
router.post("/", auth, validateTask, handleValidationErrors, async (req, res) => {
  try {
    const userId = req.userId;
    const { title, details, course, date, priority, completed, duration } = req.body;

    const task = await Task.create({
      userId,
      title,
      details,
      course,
      date,
      priority,
      completed: Boolean(completed),
      duration
    });

    res.status(201).json({ success: true, task });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE task
router.put("/:id", auth, validateTask, handleValidationErrors, async (req, res) => {
  try {
    const userId = req.userId;
    const updates = { ...req.body };

    if (typeof updates.completed !== "undefined") {
      updates.completed = Boolean(updates.completed);
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId },
      updates,
      { new: true }
    );

    if (!task) return res.status(404).json({ error: "Task not found" });

    res.json({ success: true, task });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE task
router.delete("/:id", auth, async (req, res) => {
  try {
    const userId = req.userId;

    const deleted = await Task.findOneAndDelete({
      _id: req.params.id,
      userId
    });

    if (!deleted)
      return res.status(404).json({ success: false, error: "Task not found" });

    res.json({ success: true, deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
