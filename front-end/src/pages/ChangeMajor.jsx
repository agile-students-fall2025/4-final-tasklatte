import './ChangeMajor.css';
import HeaderBar from "../components/HeaderBar.jsx";
import BottomNav from "../components/BottomNav.jsx";
import { useState, useEffect } from "react";
import MenuOverlay from "../components/MenuOverlay.jsx";
import { useNavigate, useLocation } from "react-router-dom";

const ChangeMajor = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { userId: stateUserId } = location.state || {};
    const userId = stateUserId || localStorage.getItem("userId");

    const [menuOpen, setMenuOpen] = useState(false);
    const [major, setMajor] = useState("");

    useEffect(() => {
        if (!userId) return navigate("/login");
        fetch(`http://localhost:5001/api/settings/major?userId=${userId}`)
            .then(res => res.json())
            .then(data => setMajor(data.major || ""))
            .catch(err => console.error(err));
    }, [userId, navigate]);

    const handleSave = async () => {
        await fetch(`http://localhost:5001/api/settings/major?userId=${userId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ value: major }),
        });
        navigate("/settings", { state: { userId } });
    };

    return (
        <div className="ChangeMajor">
            <HeaderBar title="Change Major" onHamburger={() => setMenuOpen(true)} onLogo={() => {}} />
            <div className="major-content">
                <h1>Settings</h1>
                <h4>Major:</h4>
                <input value={major} onChange={e => setMajor(e.target.value)} />
                <button className="save-button" onClick={handleSave}>Save</button>
                <button className="back-button" onClick={() => navigate("/settings", { state: { userId } })}>Back</button>
            </div>
            <BottomNav />
            {menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} />}
        </div>
    );
};

export default ChangeMajor;
