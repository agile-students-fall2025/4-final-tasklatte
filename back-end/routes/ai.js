const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const Class = require("../models/Class");
const auth = require("../middleware/auth");
const { validationResult, body, param } = require("express-validator");

const validateDate = [
  param("date")
    .isISO8601()
    .withMessage("Date must be a valid ISO 8601 string")
    .toDate()
]

const handleValidationErrors = (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    next();
}

// ----------------------------
// GET /api/ai/daily/:date
// Fetch all tasks for a user on a specific date
// ----------------------------
router.get("/daily/:date", auth, validateDate, handleValidationErrors, async (req, res) => {
  const { date } = req.params;
  // const { userId } = req.query;
  const userId = req.userId;
  
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

const validateTask = [
  body("duration")
    .optional()
    .isInt({ min: 1})
    .withMessage("Duration must be a positive integer"),
  body("title")
    .optional()
    .trim()
    .isLength({ max: 100})
    .withMessage("Title can not exceed 100 characters"),
  body("details")
    .optional()
    .trim()
    .isLength({ max: 500})
    .withMessage("Details can not exceed 500 characters"),
  body("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be a valid ISO 8601 string"),
  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be low, medium, or high"),
  body("completed")
    .optional()
    .isBoolean()
    .withMessage("Completed must be true or false"),
]

// ----------------------------
// PUT /api/ai/task/:id
// Update task duration or other fields
// ----------------------------
router.put("/task/:id", auth, validateTask, handleValidationErrors, async (req, res) => {
  const { id } = req.params;
  const { duration, title, details, date, course, priority, completed } = req.body;

  try {
    const task = await Task.findById(id);
    if (!task || task.userId.toString() !== req.userId) return res.status(404).json({ error: "Task not found" });

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
router.get("/classes", auth, async (req, res) => {
  const userId = req.userId;
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
