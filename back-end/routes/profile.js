const express = require("express");
const router = express.Router();
let { users } = require("../data/user");

router.get("/", (req, res) => {
  const userId = req.query.userId || (req.session && req.session.userId);

  if (!userId) {
    return res.status(401).json({ error: "Not logged in" });
  }

  const user = users.find(u => u.id === parseInt(userId));
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json({
    name: user.name,
    username: user.username,
    grade: user.grade || "",
    major: user.major || "",
    school: user.school || "",
    bio: user.bio || "",
    timezone: user.timezone || "",
    avatar: user.avatar || "https://picsum.photos/id/237/200/300",
    goals: user.goals || [],
    stats:
      user.stats ||
      [
        { label: "📚study streak", value: 0 },
        { label: "🧘‍♀️longest focus", value: 0 },
        { label: "☕coffees drank", value: 0 },
        { label: "🍪snack breaks", value: 0 },
      ],
  });
});

module.exports = router;
