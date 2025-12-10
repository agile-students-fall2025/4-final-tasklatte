import './ChangeSchool.css';
import HeaderBar from "../components/HeaderBar.jsx";
import BottomNav from "../components/BottomNav.jsx";
import { useState, useEffect } from "react";
import MenuOverlay from "../components/MenuOverlay.jsx";
import { useNavigate, useLocation } from "react-router-dom";

const ChangeSchool = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { userId: stateUserId } = location.state || {};
    const userId = stateUserId || localStorage.getItem("userId");

    const [menuOpen, setMenuOpen] = useState(false);
    const [school, setSchool] = useState("");
    const API_BASE = process.env.REACT_APP_API_URL || "";

    useEffect(() => {
        if (!userId) return navigate("/login");
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");
        
        fetch(`${API_BASE}/api/settings/school`, {
            headers: {"Authorization": `Bearer ${token}`}
        })
            .then(res => res.json())
            .then(data => setSchool(data.school || ""))
            .catch(err => console.error(err));
    }, [userId, navigate]);

    const handleSave = async () => {
        const token = localStorage.getItem("token");
        await fetch(`${API_BASE}/api/settings/school`, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ value: school }),
        });
        navigate("/settings", { state: { userId } });
    };

    return (
        <div className="ChangeSchool">

            <HeaderBar title="Change School" 
                onHamburger={() => setMenuOpen(true)} 
                onLogo={() => navigate("/dashboard")} 
            />
           
            <div className="school-content">

                <h1>Settings</h1>
                <h4>School:</h4>

                <input value={school} onChange={e => setSchool(e.target.value)} />

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

export default ChangeSchool;
