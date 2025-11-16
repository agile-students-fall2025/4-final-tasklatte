import './Goals.css'
/*import logo from './logo.png'*/
import HeaderBar from "../components/HeaderBar.jsx";
import BottomNav from "../components/BottomNav.jsx";
import { useState, useEffect } from "react";
import MenuOverlay from "../components/MenuOverlay.jsx";
import { useNavigate } from "react-router-dom";
import EditGoal from "./EditGoal.jsx";

const Goals = () => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [editingGoal, setEditingGoal] = useState(null);
    const [goals, setGoals] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5001/api/settings/goals").then(res => res.json()).then(data => setGoals(Array.isArray(data) ? data : [])).catch(err => console.error("Error getting goals:", err))
    }, [])

    const handleSave = async (updatedGoal) => {
        await fetch(`http://localhost:5001/api/settings/goals/${updatedGoal.id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(updatedGoal)
        });
        setGoals(goals.map(g => g.id === updatedGoal.id ? updatedGoal : g));    
        setEditingGoal(null);
    }
    const handleDelete = async (id) => {
        await fetch(`http://localhost:5001/api/settings/goals/${id}`, {
            method: "DELETE",
        });
        setGoals(goals.filter(g => g.id !== id));
        setEditingGoal(null);
    }
    const handleAdd = async () => {
        const res = await fetch("http://localhost:5001/api/settings/goals", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({title: "", description:""})
        });
        const newGoal = await res.json();
        setGoals([...goals, newGoal]);
        setEditingGoal(newGoal);
    }

    return(
        <div className = "Goals">
            <HeaderBar title="Goals" onHamburger={() => setMenuOpen(true)} onLogo={() => {}} />

            <div className = "goal-content">
                <h1>Goals</h1>
                {goals.map(goal => ( 
                <label key={goal.id}>
                    <input name="myInput" defaultValue={goal.title} readOnly/>
                     <button className="edit-button" onClick={() => setEditingGoal(goal)}>
                    Edit
                    </button> 
                </label>
                ))}
                <button className="add-button" onClick={handleAdd}>
                    Add More
                </button>   
            </div>
              
            <button className="save-button" type="button">Save</button>
            <button className="back-button" onClick={() => navigate("/settings")}>
            Back
            </button>

            <BottomNav />
            {menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} />}
            {editingGoal && <EditGoal goal={editingGoal} onClose={() => setEditingGoal(null)} onSave={handleSave} onDelete={()=>handleDelete(editingGoal.id)} />}
        </div>
    );
};

export default Goals