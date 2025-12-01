const express = require ("express");
const router = express.Router();
let { users } = require("../data/user");

router.post("/", (req, res) => {
    const {name, bio, major, school, grade, timezone} = req.body;
    const user = users.find(u => u.name === name);

    if (!user) {
        return res.status(404).json({error: "User not found"});
    }

    user.bio = bio || user.bio;
    user.major = major || user.major;
    user.school = school || user.school;
    user.grade = grade || user.grade;
    user.timezone = timezone || user.timezone;

    res.json({
        message: "Account setup complete",
        user: {
            id: user.id,
            username: user.username,
            name: user.name,
            bio: user.bio,
            major: user.major,
            school: user.school,
            grade: user.grade,
            timezone: user.timezone
        }
    });
});

module.exports = router;