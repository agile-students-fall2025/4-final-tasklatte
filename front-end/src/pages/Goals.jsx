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
    const userId = localStorage.getItem("userId")

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }
        fetch(`http://localhost:5001/api/settings/goals`, {
            headers: {Authorization: `Bearer ${token}`}
        })
            .then(res => res.json())
            .then(data => setGoals(Array.isArray(data) ? data : []))
            .catch(err => console.error("Error getting goals:", err))
    }, [navigate])

    const handleSave = async (updatedGoal) => {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5001/api/settings/goals/${updatedGoal.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(updatedGoal)
        });
        const saved = await res.json();
        setGoals((prev) => prev.map((g) => (g.id === saved.id ? saved : g)));    
        setEditingGoal(null);
    }
    const handleDelete = async (id) => {
        const token = localStorage.getItem("token");
        await fetch(`http://localhost:5001/api/settings/goals/${id}`, {
            method: "DELETE",
            headers: {Authorization: `Bearer ${token}`}
        });
        setGoals((prev) => prev.filter((g) => g.id !== id));
        setEditingGoal(null);
    }
    const handleAdd = async () => {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5001/api/settings/goals`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({})
        });
        const newGoal = await res.json();
        setGoals((prev) => [...prev, newGoal]);
        setEditingGoal(newGoal);
    }

    return(
        <div className = "Goals">
            <HeaderBar title="Goals" onHamburger={() => setMenuOpen(true)} onLogo={() => {}} />

            <div className = "goal-content">
                <h1>Goals</h1>
                {goals.map(goal => ( 
                <label key={goal.id}>
                    <input name="myInput" value={goal.title} readOnly/>
                     <button className="edit-button" onClick={() => setEditingGoal(goal)}>
                    Edit
                    </button> 
                </label>
                ))}
                <button className="add-button" onClick={handleAdd}>
                    Add More
                </button>   
            </div>
              
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