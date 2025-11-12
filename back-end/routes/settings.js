const express = require("express");
const router = express.Router();
let profileSettings = require('../data/profileSettings');

router.get("/", (req, res) => {
    res.json(profileSettings);
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
    profileSettings = {}
    res.json({success : true, message: 'Account deleted'})
})

module.exports = router;