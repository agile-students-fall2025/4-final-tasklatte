import './Goals.css'
/*import logo from './logo.png'*/
import HeaderBar from "./components/HeaderBar.jsx";
import BottomNav from "./components/BottomNav.jsx";
import { useState } from "react";
import MenuOverlay from "./components/MenuOverlay.jsx";
import { useNavigate } from "react-router-dom";

const Goals = () => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    
    return(
        <div className = "Goals">
            <HeaderBar title="Goals" onHamburger={() => setMenuOpen(true)} onLogo={() => {}} />

            <div className = "goal-content">
                <h1>Goals</h1>
                <label>
                    <input name="myInput" defaultValue="Goal 1"/>
                     <button className="edit-button" onClick={() => navigate("/settings/goals/edit")}>
                    Edit
                    </button> 
                </label>
                <label>
                    <input name="myInput" defaultValue="Goal 2"/>
                    <button className="edit-button" onClick={() => navigate("/settings/goals/edit")}>
                    Edit
                    </button> 
                </label>
                <button className="add-button" onClick={() => navigate("/settings/goals/edit")}>
                    Add More
                </button>   
            </div>
              
            <button className="save-button" type="button">Save</button>

            <BottomNav />
            {menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} />}
        </div>
    );
};

export default Goals