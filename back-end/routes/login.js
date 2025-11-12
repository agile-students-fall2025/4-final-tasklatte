const express = require ("express");
const bcrypt = require ("bcrypt");
const router = express.Router();
let { users } = require("../data/user");

router.post("/", async (req, res) => {
    const {username, password} = req.body;

    if (!username || !password) {
        return res.status(400).json({error: "All fields are required"});
    }

    const user = users.find(u => u.username === username);
    if (!user) {
        return res.status(400).json({error: "User not found"});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({error: "Incorrect password"});
    }

    if (req.session) {
        req.session.userId = user.id;
    }

    res.status(200).json({message: "Login Successful", user: {username: user.username}});
});

module.exports = router;
