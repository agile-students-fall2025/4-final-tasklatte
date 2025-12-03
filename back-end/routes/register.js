const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// Profile pics
const profilePics = Array.from({ length: 10 }, (_, i) => `pic${i + 1}.jpeg`);

router.post("/", async (req, res) => {
  const { username, name, password } = req.body;

  if (!username || !name || !password)
    return res.status(400).json({ error: "All fields are required" });

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ error: "Username already taken" });

    const hashed = await bcrypt.hash(password, 10);
    const randomPic = profilePics[Math.floor(Math.random() * profilePics.length)];

    const newUser = new User({
      username,
      name,
      password: hashed,
      photo: randomPic,
    });

    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id },
       process.env.JWT_SECRET, 
       { expiresIn: "7d" }
      );

    res.setHeader("Authorization", `Bearer ${token}`);
    res.setHeader("Access-Control-Expose-Headers", "Authorization");

    res.json({
      message: "User registered",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        name: newUser.name,
        photo: newUser.photo,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
