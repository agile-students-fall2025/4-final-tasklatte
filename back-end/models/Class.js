const mongoose = require("mongoose");

const classSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: {
      type: String,
      required: [true, "Class title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    location: {
      type: String,
      trim: true,
      maxlength: [100, "Location cannot exceed 100 characters"],
    },
    instructor: {
      type: String,
      trim: true,
      maxlength: [100, "Instructor name cannot exceed 100 characters"],
    },
    days: {
      type: [Number], // Array of day indices: 0=Sun, 1=Mon, ..., 6=Sat
      required: [true, "At least one day of the week must be selected"],
      validate: {
        validator: function (arr) {
          return arr.length > 0 && arr.every((d) => d >= 0 && d <= 6);
        },
        message: "Days must be valid weekday indices (0-6)",
      },
    },
    startTime: {
      type: String, // HH:mm format
      required: [true, "Start time is required"],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Start time must be in HH:mm format"],
    },
    endTime: {
      type: String, // HH:mm format
      required: [true, "End time is required"],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "End time must be in HH:mm format"],
    },
    startDate: {
      type: String, // YYYY-MM-DD format
      required: [true, "Start date is required"],
      match: [/^\d{4}-\d{2}-\d{2}$/, "Start date must be in YYYY-MM-DD format"],
    },
    endDate: {
      type: String, // YYYY-MM-DD format
      required: [true, "End date is required"],
      match: [/^\d{4}-\d{2}-\d{2}$/, "End date must be in YYYY-MM-DD format"],
    },
    timezone: {
      type: String,
      default: "America/Los_Angeles",
      enum: [
        "America/Los_Angeles",
        "America/Denver",
        "America/Chicago",
        "America/New_York",
        "UTC",
      ],
    },
    color: {
      type: String,
      default: "#8b5e3c",
      match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Color must be a valid hex code"],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Class", classSchema);
