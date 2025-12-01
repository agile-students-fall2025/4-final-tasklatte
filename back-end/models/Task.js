const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    details: { type: String, default: "" },
    course: { type: String, required: true },
    date: { type: String, required: true }, 
    priority: { type: String, default: "Medium" },
    completed: { type: Boolean, default: false },
    duration: { type: Number }, // optional
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);