import './Settings.css'
import logo from './logo.svg'
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
                <button class="edit-button" type="button">Edit</button>
            </label>
            <label>
                <input name="myInput" defaultValue="Major"/>
                <button class="edit-button" type="button">Edit</button>
            </label>
            <label>
                <input name="myInput" defaultValue="School"/>
                <button class="edit-button" type="button">Edit</button>
            </label>
            <label>
                <input name="myInput" defaultValue="Time-zone"/>
                <button class="edit-button" type="button">Edit</button>
            </label>
            <label>
                <input name="myInput" defaultValue="Goals"/>
                <button class="edit-button" type="button">Edit</button>
            </label>
            
            <h4>Other:</h4>
            <button class="logout-button" type="button">Log Out</button>
            <button class="delete-button" type="button">Delete Account</button>

            <BottomNav />
            {menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} />}
        </div>
    );
};

export default Settings