const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({
  title: { type: String, default: "New Goal" },
  description: { type: String, default: "Describe your goal..." },
  completed: { type: Boolean, default: false },
  dueDate: { type: Date }
}, { _id: true }); // Each goal automatically gets a unique _id

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  bio: { type: String, default: "" },
  major: { type: String, default: "" },
  school: { type: String, default: "" },
  grade: { type: String, default: "" },
  timezone: { type: String, default: "" },
  goals: { type: [goalSchema], default: [] }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
