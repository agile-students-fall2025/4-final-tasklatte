const express = require("express");
const router = express.Router();
let tasks = require("../data/tasksData");

// GET /api/tasks with optional query filters
router.get("/", (req, res) => {
  const { q, course, priority, date } = req.query;
  let result = [...tasks];

  if (q) {
    result = result.filter(
      (t) =>
        t.title.toLowerCase().includes(q.toLowerCase()) ||
        t.details.toLowerCase().includes(q.toLowerCase())
    );
  }
  if (course)
    result = result.filter((t) =>
      t.course.toLowerCase().includes(course.toLowerCase())
    );
  if (priority) result = result.filter((t) => t.priority === priority);
  if (date) result = result.filter((t) => t.date && t.date.startsWith(date));

  if (typeof req.query.completed !== "undefined") {
    const completedQuery = req.query.completed;
    const wantCompleted = completedQuery === "true" || completedQuery === "1";
    result = result.filter((t) => Boolean(t.completed) === wantCompleted);
  }

  res.json(result);
});

// GET /api/ai/daily/:date
router.get("/daily/:date", (req, res) => {
  const { date } = req.params;

  // filter tasks for this date and map duration correctly
  const dailyTasks = tasks
    .filter((t) => t.date && t.date.startsWith(date))
    .map((t) => ({
      id: t.id,
      task: t.title,
      duration: typeof t.duration === "number" ? t.duration : 60,
    }));

  res.json(dailyTasks);
});

// GET /api/tasks/:id
router.get("/:id", (req, res) => {
  const task = tasks.find((t) => t.id === req.params.id);
  task ? res.json(task) : res.status(404).json({ error: "Task not found" });
});

// POST /api/tasks
router.post("/", (req, res) => {
  const {
    title = "",
    details = "",
    course = "",
    date,
    due,
    priority = "Medium",
    completed = false,
    duration,
  } = req.body;

  console.log("📝 POST /api/tasks - req.body:", req.body);
  console.log("📝 Extracted duration:", duration, "Type:", typeof duration);

  const finalDate = date || due || "";
  const newTask = {
    id: "t" + (tasks.length + 1),
    title,
    details,
    course,
    date: finalDate,
    priority,
    completed: Boolean(completed),
    ...(typeof duration !== 'undefined' && { duration }),
  };

  console.log("📝 New task created:", newTask);
  tasks.push(newTask);
  res.status(201).json({ success: true, task: newTask });
});

// PUT /api/tasks/:id
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const taskIndex = tasks.findIndex((t) => t.id === id);
  if (taskIndex === -1) return res.status(404).json({ error: "Task not found" });

  const updates = { ...req.body };
  if (updates.due) {
    updates.date = updates.due;
    delete updates.due;
  }
  if (typeof updates.completed !== "undefined") {
    if (typeof updates.completed === "string") {
      updates.completed = updates.completed === "true" || updates.completed === "1";
    } else {
      updates.completed = Boolean(updates.completed);
    }
  }
  delete updates.id;

  tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
  res.json({ success: true, task: tasks[taskIndex] });
});

// DELETE /api/tasks/:id
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: "Task not found" });
  }

  const deletedTask = tasks.splice(index, 1)[0];
  console.log("🗑️ Deleted task:", deletedTask);
  res.json({ success: true, deleted: deletedTask });
});

module.exports = router;