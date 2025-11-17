const express = require("express");
const router = express.Router();
let tasks = require("../data/tasksData");

router.get("/", (req, res) => {
  const { q, course, priority, date } = req.query;
  let result = [...tasks];
  console.log(result)
  if (q) {
    result = result.filter(
      (t) =>
        t.title.toLowerCase().includes(q.toLowerCase()) ||
        t.details.toLowerCase().includes(q.toLowerCase())
    );
  }
  if (course) result = result.filter((t) => t.course.toLowerCase().includes(course.toLowerCase()));
  if (priority) result = result.filter((t) => t.priority === priority);
  if (date) result = result.filter((t) => t.date && t.date.startsWith(date));

<<<<<<< HEAD
  // support filtering by completion status: ?completed=true or ?completed=false
=======
>>>>>>> dfbc325b907f140511cf9cb9f246fb93f36e0a15
  if (typeof req.query.completed !== "undefined") {
    const completedQuery = req.query.completed;
    const wantCompleted = completedQuery === "true" || completedQuery === "1";
    result = result.filter((t) => Boolean(t.completed) === wantCompleted);
  }

  res.json(result);
});

router.get("/daily/:date", (req, res) => {
  const { date } = req.params;
  const dailyTasks = tasks.filter((t) => t.date.startsWith(date));
  res.json(dailyTasks);
});

router.get("/:id", (req, res) => {
  const task = tasks.find((t) => t.id === req.params.id);
  task ? res.json(task) : res.status(404).json({ error: "Task not found" });
});

router.post("/", (req, res) => {
  // Accept either `date` or `due` from the frontend and allow all fields including completed
  const {
    title = "",
    details = "",
    course = "",
    date,
    due,
    priority = "Medium",
    completed = false,
  } = req.body;
  const finalDate = date || due || "";
  const newTask = {
    id: "t" + (tasks.length + 1),
    title,
    details,
    course,
    date: finalDate,
    priority,
    completed: Boolean(completed),
  };
  tasks.push(newTask);
  res.status(201).json({ success: true, task: newTask });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const taskIndex = tasks.findIndex((t) => t.id === id);
  if (taskIndex === -1) return res.status(404).json({ error: "Task not found" });

  const updates = { ...req.body };
  if (updates.due) {
    updates.date = updates.due;
    delete updates.due;
  }
<<<<<<< HEAD
  // Ensure completed is boolean if provided
  if (typeof updates.completed !== "undefined") {
    // If string values are sent ("true"/"false"), interpret them correctly.
=======
  if (typeof updates.completed !== "undefined") {
>>>>>>> dfbc325b907f140511cf9cb9f246fb93f36e0a15
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
