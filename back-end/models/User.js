const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema(
  {
    title: { type: String, default: "New Goal" },
    description: { type: String, default: "Describe your goal..." }
  },
  { _id: true }
);

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, maxlength: 15 },
    name: { type: String, required: true, maxlength: 20 },
    password: { type: String, required: true },
    bio: { type: String, default: "" },
    major: { type: String, default: "" },
    school: { type: String, default: "" },
    grade: { type: String, default: "" },
    photo: { type: String, default: "" },
    timezone: { type: String, default: "" },
    photo: { type: String, default: "" },
    goals: [goalSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
module.exports.goalSchema = goalSchema;