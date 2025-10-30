import './Settings.css'
/*import logo from './logo.png'*/
import HeaderBar from "./components/HeaderBar.jsx";
import BottomNav from "./components/BottomNav.jsx";
import { useState } from "react";
import MenuOverlay from "./components/MenuOverlay.jsx";
import { useNavigate } from "react-router-dom";
import DeleteConfirmOverlay from "./components/DeleteConfirmOverlay.jsx";

const Settings = () => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const handleDeleteAccount = () => {
        console.log("Account deleted");
        setConfirmOpen(false)
        navigate("/")
    };
    
    return(
        <div className = "Settings">
            <HeaderBar 
                title="Settings" 
                onHamburger={() => setMenuOpen(true)} 
                onLogo={() => navigate("/")} />
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
                <button className="edit-button" onClick={() => navigate("/settings/goals")}>
                    Edit
                </button>             
            </label>
            
            <h4>Other:</h4>
            <div className="button-row">
                <button className="action-button" type="button" onClick={() => navigate("/")}>
                    Log Out
                </button>
                <button 
                    className="action-button" 
                    type="button" 
                    onClick={() => setConfirmOpen(true)}>
                    Delete Account
                </button>
            </div>

        <BottomNav /> 
        
        {menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} />}
        {confirmOpen && (
            <DeleteConfirmOverlay
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleDeleteAccount}
            />
        )}

        </div>
    );
};

export default Settings