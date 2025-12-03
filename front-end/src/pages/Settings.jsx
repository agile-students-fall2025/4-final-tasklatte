import './Settings.css';
import HeaderBar from "../components/HeaderBar.jsx";
import BottomNav from "../components/BottomNav.jsx";
import { useEffect, useState } from "react";
import MenuOverlay from "../components/MenuOverlay.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import DeleteConfirmOverlay from "../components/DeleteConfirmOverlay.jsx";

const Settings = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { userId: stateUserId } = location.state || {};
    const userId = stateUserId || localStorage.getItem("userId");

    const [menuOpen, setMenuOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [profile, setProfile] = useState({});

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        navigate("/login", { replace: true });
    };

    useEffect(() => {
        if (!userId) return navigate("/login");
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");
        
        fetch(`http://localhost:5001/api/settings`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch settings");
                return res.json();
            })
            .then(data => setProfile(data))
            .catch(err => console.error(err));
    }, [userId, location.pathname, navigate]);

    const handleDeleteAccount = async () => {
        const token = localStorage.getItem("token");
        await fetch(`http://localhost:5001/api/settings/account`, { 
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        setConfirmOpen(false);
        localStorage.removeItem("userId");
        localStorage.removeItem("token");
        navigate("/login");
    };

    const settingsOptions = ['bio','major','school','timezone', 'goals'];

    return (
        <div className="Settings">
            <HeaderBar 
                title="Settings" 
                onHamburger={() => setMenuOpen(true)} 
                onLogo={() => navigate("/")} 
            />

            <h1>Settings</h1>
            <h4>Profile:</h4>

            {settingsOptions.map(option => (
                <label key={option}>
                    <input
                        name={option}
                        value={
                            option === 'goals' 
                                ? (profile.goals || []).map(goal => goal.title).join(', ')
                                : (profile[option] || "")
                        }
                        readOnly
                    />
                    <button
                        className="edit-button"
                        onClick={() => navigate(`/settings/${option}`, { state: { userId: profile.id || userId } })}
                    >
                        Edit
                    </button>
                </label>
            ))}

            <h4>Other:</h4>
            <div className="button-row">
                <button className="action-button" type="button" onClick={handleLogout}>
                    Log Out
                </button>
                <button className="action-button" type="button" onClick={() => setConfirmOpen(true)}>
                    Delete Account
                </button>
            </div>

            <BottomNav /> 

            {menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} />}
            {confirmOpen && <DeleteConfirmOverlay onClose={() => setConfirmOpen(false)} onConfirm={handleDeleteAccount} />}
        </div>
    );
};

export default Settings;
