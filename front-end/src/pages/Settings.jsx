import './Settings.css'
/*import logo from './logo.png'*/
import HeaderBar from "../components/HeaderBar.jsx";
import BottomNav from "../components/BottomNav.jsx";
import { useEffect, useState } from "react";
import MenuOverlay from "../components/MenuOverlay.jsx";
import { useNavigate } from "react-router-dom";
import DeleteConfirmOverlay from "../components/DeleteConfirmOverlay.jsx";

const Settings = () => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [profileSettings, setProfile] = useState({});

    useEffect(() => {
        fetch('/api/settings').then(res => res.json()).then(data => setProfile(data))
    }, [])

    const handleDeleteAccount = async() => {
        await fetch("/api/settings/account", {method: "DELETE"})
        setConfirmOpen(false)
        navigate("/")
    };
    
    return(
        <div className = "Settings">
            <HeaderBar 
                title="Settings" 
                onHamburger={() => setMenuOpen(true)} 
                onLogo={() => navigate("/")} 
            />
            <h1>Settings</h1>
            <h4>Profile:</h4>
            {['bio','major','school','timezone', 'goals'].map(option => (
                <label key={option}>
                    <input name={option} value={profileSettings[option]} readOnly/>
                    <button className="edit-button" onClick={() => navigate(`/settings/${option}`)}>
                        Edit
                    </button>
                </label>
            ))}
    
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