import './Settings.css'
/*import logo from './logo.png'*/
import HeaderBar from "./components/HeaderBar.jsx";
import BottomNav from "./components/BottomNav.jsx";
import { useState } from "react";
import MenuOverlay from "./components/MenuOverlay.jsx";
import { useNavigate } from "react-router-dom";

const Settings = () => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    
    return(
        <div className = "Settings">
            <HeaderBar title="Settings" onHamburger={() => setMenuOpen(true)} onLogo={() => {}} />
            <h1>Settings</h1>
            <h4>Profile:</h4>
            <label>
                <input name="myInput" defaultValue="Bio"/>
                 <button className="edit-button" onClick={() => navigate("/settings/bio")}>
                    Edit
                </button>
            </label>
            <label>
                <input name="myInput" defaultValue="Major"/>
                 <button className="edit-button" onClick={() => navigate("/settings/major")}>
                    Edit
                </button>
            </label>
            <label>
                <input name="myInput" defaultValue="School"/>
                <button className="edit-button" onClick={() => navigate("/settings/school")}>
                    Edit
                </button>            
            </label>
            <label>
                <input name="myInput" defaultValue="Time-zone"/>
                <button className="edit-button" onClick={() => navigate("/settings/time")}>
                    Edit
                </button>            
            </label>
            <label>
                <input name="myInput" defaultValue="Goals"/>
                <button class="edit-button" type="button">Edit</button>
            </label>
            
            <h4>Other:</h4>
            <button class="logout-button" type="button">Log Out</button>
            <button class="delete-button" type="button">Delete Account</button>

            <div className="bottom-nav">
                <BottomNav />
                {menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} />}
            </div>
        </div>
    );
};

export default Settings