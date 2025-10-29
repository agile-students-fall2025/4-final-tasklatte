import './ChangeMajor.css'
/*import logo from './logo.png'*/
import HeaderBar from "./components/HeaderBar.jsx";
import BottomNav from "./components/BottomNav.jsx";
import { useState } from "react";
import MenuOverlay from "./components/MenuOverlay.jsx";
import { useNavigate } from "react-router-dom";

const ChangeMajor = () => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    
    return(
        <div className = "ChangeMajor">
            <HeaderBar title="Change Major" onHamburger={() => setMenuOpen(true)} onLogo={() => {}} />

            <div className = "major-content">
                <h1>Settings</h1>
                <h4>Major:</h4>
                <label>
                    <input name="myInput" defaultValue="Major"/>
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

export default ChangeMajor