const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");

// -------------------------
// Goals CRUD (must be first)
// -------------------------

// Get all goals for a user
router.get("/goals", auth, async (req, res) => {
    const userId = req.userId;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user.goals || []);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// Add a new goal
router.post("/goals", auth, async (req, res) => {
  const userId = req.userId;
  const { title, description } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const newGoal = { title: title || "New Goal", description: description || "Describe your goal..." };
    user.goals.push(newGoal);
    await user.save();

    res.json(user.goals[user.goals.length - 1]); // return goal with _id
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update goal
router.put("/goals/:goalId", auth, async (req, res) => {
  const userId = req.userId;
  const { goalId } = req.params;
  const { title, description } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const goal = user.goals.id(goalId);
    if (!goal) return res.status(404).json({ error: "Goal not found" });

    goal.title = title;
    goal.description = description;

    await user.save();
    res.json(goal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete goal
router.delete("/goals/:goalId", auth, async (req, res) => {
  const userId = req.userId;
  const { goalId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const goal = user.goals.id(goalId);
    if (!goal) return res.status(404).json({ error: "Goal not found" });

    goal.remove();
    await user.save();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});



// Update a goal
router.put("/goals/:goalId", auth, async (req, res) => {
    const userId = req.userId;
    const { goalId } = req.params;
    const { title, description } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        const goal = user.goals.find(g => g.id === goalId);
        if (!goal) return res.status(404).json({ error: "Goal not found" });

        goal.title = title;
        goal.description = description;
        await user.save();
        res.json(goal);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// Delete a goal
router.delete("/goals/:goalId", auth, async (req, res) => {
    const userId = req.userId;
    const { goalId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        user.goals = user.goals.filter(g => g.id !== goalId);
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

router.put("/:field", auth, async (req, res) => {
    const userId = req.userId;
    const { field } = req.params;
    const { value } = req.body;

    try {
        const user = await User.findByIdAndUpdate(userId, { [field]: value }, { new: true });
        if (!user) return res.status(404).json({ error: "User not found" });

        res.json({ [field]: user[field] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
