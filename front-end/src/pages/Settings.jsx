import './Settings.css'
/*import logo from './logo.png'*/
import HeaderBar from "../components/HeaderBar.jsx";
import BottomNav from "../components/BottomNav.jsx";
import { useEffect, useState } from "react";
import MenuOverlay from "../components/MenuOverlay.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import DeleteConfirmOverlay from "../components/DeleteConfirmOverlay.jsx";

const Settings = () => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [profile, setProfile] = useState({});
    const location = useLocation();
    const {userId: stateUserId} = location.state || {};
    const userId = stateUserId || localStorage.getItem("userId");

    useEffect(() => {
        fetch(`http://localhost:5001/api/settings?userId=${userId}`).then(res => res.json()).then(data => setProfile(data))
    }, [location.pathname])

    const handleDeleteAccount = async() => {
        await fetch(`http://localhost:5001/api/settings/account?userId=${userId}`, {method: "DELETE"})
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
                    <input
                        name = {option}
                        value = {
                            option === 'goals' 
                            ? (profile.goals || [])
                                .map(goal => goal.title)
                                .join(', ')
                            : (profile[option] || "")
                        }
                        readOnly
                    />
        
                    <button className="edit-button" onClick={() => navigate(`/settings/${option}`, {state : {userId: profile.id}})}>
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