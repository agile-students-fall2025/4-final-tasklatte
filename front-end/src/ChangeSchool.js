import './ChangeSchool.css'
/*import logo from './logo.png'*/
import HeaderBar from "./components/HeaderBar.jsx";
import BottomNav from "./components/BottomNav.jsx";
import { useState } from "react";
import MenuOverlay from "./components/MenuOverlay.jsx";
import { useNavigate } from "react-router-dom";

const ChangeSchool = () => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    
    return(
        <div className = "ChangeSchool">
            <HeaderBar title="Change School" onHamburger={() => setMenuOpen(true)} onLogo={() => {}} />

            <div className = "school-content">
                <h1>Settings</h1>
                <h4>School:</h4>
                <label>
                    <input name="myInput" defaultValue="School"/>
                </label>
                <button class="save-button" type="button">Save</button>
                <button className="back-button" onClick={() => navigate("/settings")}>
                Back
                </button>
            </div>

            <BottomNav />
            {menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} />}
        </div>
    );
};

export default ChangeSchool