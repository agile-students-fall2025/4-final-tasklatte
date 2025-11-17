const express = require("express");
const router = express.Router();
let profileSettings = require('../data/profileSettings');

router.get("/", (req, res) => {
    res.json(profileSettings);
})

router.get("/goals", (req, res) => {
    res.json(profileSettings.goals);
})

router.post("/goals", (req, res) => {
    const newGoal = {id: Date.now(), ...req.body}
    profileSettings.goals.push(newGoal)
    res.json(newGoal);
})

router.put("/goals/:id", (req, res) => {
    const id = parseInt(req.params.id)
    const idx = profileSettings.goals.findIndex(g => g.id === id)
    if(idx !== -1){
        profileSettings.goals[idx] = {...profileSettings.goals[idx], ...req.body}
        res.json(profileSettings.goals[idx])
    }else{
        res.status(404).json({error : 'Goal not found'})
    }
})

router.delete("/goals/:id", (req, res) => {
    const id = parseInt(req.params.id)
    profileSettings.goals = profileSettings.goals.filter(g => g.id !== id)
    res.json({success: true})
})

router.get("/:option", (req, res) => {
    const option = req.params.option;
    if(profileSettings[option] !== undefined){
        res.json({ [option]: profileSettings[option] })
    }else{
        res.status(404).json({error : 'Field not found'})
    }
});

router.put("/:option", (req, res) => {
    const option = req.params.option;
    const value = req.body.value;
    if(profileSettings[option] !== undefined){
        profileSettings[option] = value
        res.json({success : true, [option] : value})
    }else{
        res.status(404).json({error : 'Field not found'})
    }
});

router.delete("/account", (req,res) => {
    profileSettings = {
        bio: "",
        major: "",
        school: "",
        grade: "",
        timezone: "",
        goals: []
    };
    res.json({success : true, message: 'Account deleted'})
})

module.exports = router;