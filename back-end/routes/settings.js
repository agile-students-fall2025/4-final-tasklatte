const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");
const { validationResult, body } = require("express-validator");

const validateSettings = [
  body("bio")
    .trim()
    .optional()
    .isLength({ max: 200 })
    .withMessage("Bio cannot exceed 200 characters"),
  body("major")
    .trim()
    .optional()
    .isLength({ max: 100 })
    .withMessage("Major cannot exceed 100 characters"),
  body("school")
    .trim()
    .optional()
    .isLength({ max: 100 })
    .withMessage("School cannot exceed 100 characters"),
  body("grade")
    .optional()
    .isIn(["Freshman", "Sophomore", "Junior", "Senior", "Graduate"])
    .withMessage("Grade must be valid"),
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
];

const handleValidationErrors = (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    next();
}
// -------------------------
// Goals CRUD (must be first)
// -------------------------

// Get all goals for a user
router.get("/goals", auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ error: "User not found" });
        const goals = user.goals.map((g) => ({
          id: g._id.toString(),
          title: g.title,
          description: g.description,
          completed: g.completed,
          dueDate: g.dueDate,
        }));
        res.json(goals);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// Add a new goal
router.post("/goals", auth, async (req, res) => {
  const { title, description } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const newGoal = { title: title || "New Goal", description: description || "Describe your goal..." };
    user.goals.push(newGoal);
    await user.save();
    const g = user.goals[user.goals.length - 1];
    res.json({
      id: g._id.toString(),
      title: g.title,
      description: g.description,
      completed: g.completed,
      dueDate: g.dueDate,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update goal
router.put("/goals/:goalId", auth, async (req, res) => {
  const { goalId } = req.params;
  const { title, description } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const goal = user.goals.id(goalId);
    if (!goal) return res.status(404).json({ error: "Goal not found" });

    goal.title = title;
    goal.description = description;
    goal.completed = req.body.completed ?? goal.completed;
    goal.dueDate = req.body.dueDate ?? goal.dueDate;
    await user.save();
    res.json({
      id: goal._id.toString(),
      title: goal.title,
      description: goal.description,
      completed: goal.completed,
      dueDate: goal.dueDate,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete goal
router.delete("/goals/:goalId", auth, async (req, res) => {
  const { goalId } = req.params;

  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const goal = user.goals.id(goalId);
    if (!goal) return res.status(404).json({ error: "Goal not found" });

    goal.deleteOne();
    await user.save();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


// -------------------------
// Delete account
// -------------------------
router.delete("/account", auth, async (req, res) => {
    const userId = req.userId;
    try {
        await User.findByIdAndDelete(userId);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// -------------------------
// Get all settings for a user
// -------------------------
router.get("/", auth, async (req, res) => {
    const userId = req.userId;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        res.json({
            id: user._id,
            bio: user.bio || "",
            major: user.major || "",
            school: user.school || "",
            grade: user.grade || "",
            timezone: user.timezone || "America/Los_Angeles",
            goals: user.goals || [],
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// -------------------------
// Dynamic GET / PUT for profile fields (catch-all, LAST)
// -------------------------
router.get("/:field", auth, async (req, res) => {
    const userId = req.userId;
    const { field } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        if (!(field in user)) return res.status(400).json({ error: "Invalid field" });

        res.json({ [field]: user[field] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

router.put("/settings", auth, validateSettings, handleValidationErrors, async (req, res) => {
    const userId = req.userId;

    try {
        const user = await User.findByIdAndUpdate(userId, req.body, { new: true });
        if (!user) return res.status(404).json({ error: "User not found" });

        res.json({ 
            bio: user.bio,
            major: user.major,
            school: user.school,
            grade: user.grade,
            timezone: user.timezone,
         });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
