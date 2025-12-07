const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");
const { validationResult, body } = require("express-validator");

const validateAccount = [
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

router.post("/", auth, validateAccount, handleValidationErrors, async (req, res) => {
    const userId = req.userId;
    const { bio, major, school, grade, timezone } = req.body;

    if (!userId) {
        return res.status(401).json({ error: "Not logged in" });
    }

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        user.bio = bio || user.bio;
        user.major = major || user.major;
        user.school = school || user.school;
        user.grade = grade || user.grade;
        user.timezone = timezone || user.timezone;

        await user.save();

        res.json({
            message: "Account setup complete",
            user: {
                id: user._id,
                username: user.username,
                name: user.name,
                bio: user.bio,
                major: user.major,
                school: user.school,
                grade: user.grade,
                timezone: user.timezone
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

router.delete("/account", auth, async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ error: "Not logged in" });
    }

    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        req.session.destroy();

        res.json({ success: true, message: "Account deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
