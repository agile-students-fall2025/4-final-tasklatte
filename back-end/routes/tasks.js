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
  if (date) result = result.filter((t) => t.date.startsWith(date));

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
  const { title, details, course, date, priority } = req.body;
  const newTask = {
    id: "t" + (tasks.length + 1),
    title,
    details,
    course,
    date,
    priority,
  };
  tasks.push(newTask);
  res.status(201).json({ success: true, task: newTask });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const taskIndex = tasks.findIndex((t) => t.id === id);
  if (taskIndex === -1) return res.status(404).json({ error: "Task not found" });

  tasks[taskIndex] = { ...tasks[taskIndex], ...req.body };
  res.json({ success: true, task: tasks[taskIndex] });
});

module.exports = router;
