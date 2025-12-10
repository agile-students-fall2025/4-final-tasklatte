import './ChangeTimezone.css';
import HeaderBar from "../components/HeaderBar.jsx";
import BottomNav from "../components/BottomNav.jsx";
import { useState, useEffect } from "react";
import MenuOverlay from "../components/MenuOverlay.jsx";
import { useNavigate, useLocation } from "react-router-dom";

const ChangeTimezone = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { userId: stateUserId } = location.state || {};
    const userId = stateUserId || localStorage.getItem("userId");

    const [menuOpen, setMenuOpen] = useState(false);
    const [timezone, setTimezone] = useState("America/Los_Angeles");
    const API_BASE = process.env.REACT_APP_API_URL || "";

    useEffect(() => {
        if (!userId) return navigate("/login");
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");
        
        fetch(`${API_BASE}/api/settings/timezone`, {
            headers: {"Authorization": `Bearer ${token}`}
        })
            .then(res => res.json())
            .then(data => setTimezone(data.timezone || "America/Los_Angeles"))
            .catch(err => console.error(err));
    }, [userId, navigate]);

    const handleSave = async () => {
        const token = localStorage.getItem("token");
        await fetch(`${API_BASE}/api/settings/timezone`, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ value: timezone }),
        });
        navigate("/settings", { state: { userId } });
    };

    return (
        <div className="ChangeTimezone">

            <HeaderBar title="Change Timezone" 
                onHamburger={() => setMenuOpen(true)} 
                onLogo={() => navigate("/dashboard")} 
            />
           
            <div className="timezone-content">

                <h1>Settings</h1>
                <h4>Timezone:</h4>

                <select value={timezone} onChange={e => setTimezone(e.target.value)}>
                    <option value="America/Los_Angeles">Pacific Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/New_York">Eastern Time</option>
                    <option value="UTC">UTC</option>
                </select>

                <button className="save-button" onClick={handleSave}>
                    Save
                </button>

                <button className="back-button" onClick={() => navigate("/settings", { state: { userId } })}>
                    Back
                </button>

            </div>

            <BottomNav />
            {menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} />}

        </div>
    );
};

export default ChangeTimezone;
