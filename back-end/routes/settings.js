const express = require("express");
const router = express.Router();
let { users } = require('../data/user');

function getUser(req){
  const userId = req.query.userId || (req.session && req.session.userId);

  if (!userId) {
    return null;
  }

  return users.find(u => u.id === parseInt(userId));

}

router.get("/", (req, res) => {
    const user = getUser(req);
    if(!user){
        return res.status(404).json({error: "User not found"});
    }
    res.json(user);
})

router.get("/goals", (req, res) => {
    const user = getUser(req);
    if(!user){
        return res.status(404).json({error: "User not found"});
    }
    res.json(user.goals || []);
})

router.post("/goals", (req, res) => {
     const user = getUser(req);
    if(!user){
        return res.status(404).json({error: "User not found"});
    }
    const newGoal = {id: Date.now(), ...req.body}
    user.goals = user.goals || []
    user.goals.push(newGoal)
    res.json(newGoal);
})

router.put("/goals/:id", (req, res) => {
     const user = getUser(req);
    if(!user){
        return res.status(404).json({error: "User not found"});
    }
    const id = parseInt(req.params.id)
    const idx = user.goals.findIndex(g => g.id === id)
    if(idx !== -1){
        user.goals[idx] = {...user.goals[idx], ...req.body}
        res.json(user.goals[idx])
    }else{
        res.status(404).json({error : 'Goal not found'})
    }
})

router.delete("/goals/:id", (req, res) => {
     const user = getUser(req);
    if(!user){
        return res.status(404).json({error: "User not found"});
    }
    const id = parseInt(req.params.id)
    user.goals = user.goals.filter(g => g.id !== id)
    res.json({success: true})
})

router.get("/:option", (req, res) => {
     const user = getUser(req);
    if(!user){
        return res.status(404).json({error: "User not found"});
    }
    const option = req.params.option;
    if(user[option] !== undefined){
        res.json({ [option]: user[option] })
    }else{
        res.status(404).json({error : 'Field not found'})
    }
});

router.put("/:option", (req, res) => {
     const user = getUser(req);
    if(!user){
        return res.status(404).json({error: "User not found"});
    }
    const option = req.params.option;
    const value = req.body.value;
    if(user[option] !== undefined){
        user[option] = value
        res.json({success : true, [option] : value})
    }else{
        res.status(404).json({error : 'Field not found'})
    }
});

router.delete("/account", (req,res) => {
    const userId = req.query.userId || (req.session && req.session.userId);
    const idx = user.findIndex(u => u.id === parseInt(userId))
    if(idx !== -1){
        return res.status(404).json({error: "User not found"});
    }
    users.splice(idx, 1)
    res.json({success : true, message: 'Account deleted'})
})

module.exports = router;