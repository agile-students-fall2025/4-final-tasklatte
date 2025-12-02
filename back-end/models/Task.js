const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    details: { type: String, default: "" },
    course: { type: String, required: true },
    date: { type: String, required: true },
    priority: { type: String, default: "Medium" },
    completed: { type: Boolean, default: false },
    duration: { type: Number }
  },
  { timestamps: true }
);

taskSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
taskSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Task", taskSchema);
