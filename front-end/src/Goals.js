import './Goals.css'
/*import logo from './logo.png'*/
import HeaderBar from "./components/HeaderBar.jsx";
import BottomNav from "./components/BottomNav.jsx";
import { useState } from "react";
import MenuOverlay from "./components/MenuOverlay.jsx";
import { useNavigate } from "react-router-dom";
import EditGoal from "./EditGoal.jsx";

const Goals = () => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [editingGoal, setEditingGoal] = useState(null);
    const [goals, setGoals] = useState([
        {id: 1, title: "Goal 1", descritpion: "XXX"},
        {id: 2, title: "Goal 2", descritpion: "XXX"}
    ]);
    const handleSave = (updatedGoal) => {
        setGoals(goals.map(g => g.id === editingGoal.id ? {...g, ...updatedGoal} : g));
        setEditingGoal(null);
    }
    const handleDelete = () => {
        setGoals(goals.filter(g => g.id !== editingGoal.id));
        setEditingGoal(null);
    }

    
    return(
        <div className = "Goals">
            <HeaderBar title="Goals" onHamburger={() => setMenuOpen(true)} onLogo={() => {}} />

            <div className = "goal-content">
                <h1>Goals</h1>
                {goals.map(goal => ( 
                <label key={goal.id}>
                    <input name="myInput" defaultValue={goal.title}/>
                     <button className="edit-button" onClick={() => setEditingGoal(goal)}>
                    Edit
                    </button> 
                </label>
                ))}
                <button className="add-button" onClick={() => setEditingGoal({id: Date.now(), title: "", descritpion: ""})}>
                    Add More
                </button>   
            </div>
              
            <button className="save-button" type="button">Save</button>
            <button className="back-button" onClick={() => navigate("/settings")}>
            Back
            </button>

            <BottomNav />
            {menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} />}
            {editingGoal && <EditGoal goal={editingGoal} onClose={() => setEditingGoal(null)} onSave={handleSave} onDelete={handleDelete} />}
        </div>
    );
};

export default Goals