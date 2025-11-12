const express = require ("express");
const bcrypt = require ("bcrypt");
const router = express.Router();
let { users } = require("../data/user");

router.post("/", async (req, res) => {
    const { username, name, password } = req.body;

    if (!username || !name || !password) {
        return res.status(400).json({error: "All fields are required"});
    }

    const doesExist = users.find(u => u.name === name);
    if (doesExist) {
        return res.status(400).json({error: "Name already registered"});
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser = {
        id: users.length + 1,
        username,
        name,
        password: hashed,
    };
    users.push(newUser);

    req.session.userId = newUser.id;
    res.status(200).json({message: "User Registered", user: {username, name}});
});

module.exports = router;
