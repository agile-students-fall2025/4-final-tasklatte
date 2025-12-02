const express = require("express");
const { validationResult, body } = require("express-validator");
const router = express.Router();
const Class = require("../models/Class");
const auth = require("../middleware/auth");

/**
 * Validation middleware for class data
 */
const validateClass = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Class title is required")
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters"),
  body("days")
    .isArray({ min: 1 })
    .withMessage("At least one day must be selected")
    .custom((days) => {
      if (!days.every((d) => Number.isInteger(d) && d >= 0 && d <= 6)) {
        throw new Error("Days must be valid weekday indices (0-6)");
      }
      return true;
    }),
  body("startTime")
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Start time must be in HH:mm format"),
  body("endTime")
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("End time must be in HH:mm format")
    .custom((endTime, { req }) => {
      if (endTime <= req.body.startTime) {
        throw new Error("End time must be after start time");
      }
      return true;
    }),
  body("startDate")
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("Start date must be in YYYY-MM-DD format"),
  body("endDate")
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("End date must be in YYYY-MM-DD format")
    .custom((endDate, { req }) => {
      if (endDate < req.body.startDate) {
        throw new Error("End date must be on or after start date");
      }
      return true;
    }),
  body("timezone")
    .optional()
    .isIn([
      "America/Los_Angeles",
      "America/Denver",
      "America/Chicago",
      "America/New_York",
      "UTC",
    ])
    .withMessage("Invalid timezone"),
  body("color")
    .optional()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage("Color must be a valid hex code"),
  body("location")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Location cannot exceed 100 characters"),
  body("instructor")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Instructor name cannot exceed 100 characters"),
  body("notes")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Notes cannot exceed 500 characters"),
];

/**
 * Middleware to handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

/**
 * Helper: expand class occurrences for a given date range
 * Returns array of occurrence objects with source: "class"
 */
function expandClassOccurrences(classList, startDate, endDate) {
  const occurrences = [];

  // Parse YYYY-MM-DD into a local Date at midnight to avoid TZ shifts
  const ymdToLocal = (ymd) => {
    const [y, m, d] = ymd.split("-");
    return new Date(Number(y), Number(m) - 1, Number(d));
  };

  const start = ymdToLocal(startDate);
  const end = ymdToLocal(endDate);

  classList.forEach((cls) => {
    const classStart = cls.startDate ? ymdToLocal(cls.startDate) : start;
    const classEnd = cls.endDate ? ymdToLocal(cls.endDate) : end;

    // Clamp to query range
    const rangeStart = new Date(Math.max(start.getTime(), classStart.getTime()));
    const rangeEnd = new Date(Math.min(end.getTime(), classEnd.getTime()));

    // Iterate through each day in range
    const current = new Date(rangeStart);
    while (current <= rangeEnd) {
      const dayOfWeek = current.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat

      // If this class occurs on this day of week
      if (cls.days.includes(dayOfWeek)) {
        // Format date as local YYYY-MM-DD (avoid toISOString which uses UTC)
        const pad = (n) => (n < 10 ? `0${n}` : `${n}`);
        const dateStr = `${current.getFullYear()}-${pad(current.getMonth() + 1)}-${pad(current.getDate())}`;
        const startDateTime = `${dateStr}T${cls.startTime}`;
        const endDateTime = `${dateStr}T${cls.endTime}`;

        occurrences.push({
          occurrenceId: `${cls._id}-${dateStr}`,
          classId: cls._id.toString(),
          title: cls.title,
          location: cls.location,
          instructor: cls.instructor,
          start: startDateTime,
          end: endDateTime,
          allDay: false,
          source: "class",
          color: cls.color,
          notes: cls.notes,
        });
      }

      // Move to next day
      current.setDate(current.getDate() + 1);
    }
  });

  return occurrences.sort((a, b) => a.start.localeCompare(b.start));
}

/**
 * GET /api/classes
 * Returns all class definitions (not expanded)
 */
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.userId;
    const classes = await Class.find({ userId });
    res.json(classes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch classes" });
  }
});

/**
 * GET /api/classes/daily/:date
 * Returns expanded occurrences for a specific date
 * Date format: YYYY-MM-DD
 */
router.get("/daily/:date", auth, async (req, res) => {
  try {
    const userId = req.userId;
    const { date } = req.params;
    const classes = await Class.find({ userId });
    const occurrences = expandClassOccurrences(classes, date, date);
    res.json(occurrences);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch daily classes" });
  }
});

/**
 * GET /api/classes/range
 * Returns expanded occurrences for a date range
 * Query params: start=YYYY-MM-DD, end=YYYY-MM-DD
 */
router.get("/range", auth, async (req, res) => {
  try {
    const userId = req.userId;
    const { start, end } = req.query;
    if (!start || !end) {
      return res.status(400).json({ error: "Missing start or end date" });
    }
    const classes = await Class.find({ userId });
    const occurrences = expandClassOccurrences(classes, start, end);
    res.json(occurrences);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch class range" });
  }
});

/**
 * GET /api/classes/:id
 * Returns a single class definition
 */
router.get("/:id", auth, async (req, res) => {
  try {
    const userId = req.userId;
    const cls = await Class.findOne({
      _id: req.params.id,
      userId
    });
    if (!cls) {
      return res.status(404).json({ error: "Class not found" });
    }
    res.json(cls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch class" });
  }
});

/**
 * POST /api/classes
 * Create a new class with validation
 */
router.post("/", auth, validateClass, handleValidationErrors, async (req, res) => {
  try {
    const userId = req.userId;
    const {
      title,
      location = "",
      instructor = "",
      days,
      startTime,
      endTime,
      startDate,
      endDate,
      timezone = "America/Los_Angeles",
      color = "#8b5e3c",
      notes = "",
    } = req.body;

    const newClass = new Class({
      userId,
      title,
      location,
      instructor,
      days,
      startTime,
      endTime,
      startDate,
      endDate,
      timezone,
      color,
      notes,
    });

    await newClass.save();
    res.status(201).json({ success: true, class: newClass });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create class" });
  }
});

/**
 * PUT /api/classes/:id
 * Update an existing class with validation
 */
router.put("/:id", auth, validateClass, handleValidationErrors, async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const updates = req.body;

    const updatedClass = await Class.findOneAndUpdate(
      { _id: id, userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedClass) {
      return res.status(404).json({ error: "Class not found" });
    }

    res.json({ success: true, class: updatedClass });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update class" });
  }
});

/**
 * DELETE /api/classes/:id
 * Delete a class
 */
router.delete("/:id", auth, async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const deletedClass = await Class.findOneAndDelete({
      _id: id,
      userId
    });

    if (!deletedClass) {
      return res.status(404).json({ error: "Class not found" });
    }

    res.json({ success: true, deleted: deletedClass });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete class" });
  }
});

module.exports = router;
