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

    useEffect(() => {
        if (!userId) return navigate("/login");
        fetch(`http://localhost:5001/api/settings/school?userId=${userId}`)
            .then(res => res.json())
            .then(data => setSchool(data.school || ""))
            .catch(err => console.error(err));
    }, [userId, navigate]);

    const handleSave = async () => {
        await fetch(`http://localhost:5001/api/settings/school?userId=${userId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ value: school }),
        });
        navigate("/settings", { state: { userId } });
    };

    return (
        <div className="ChangeSchool">
            <HeaderBar title="Change School" onHamburger={() => setMenuOpen(true)} onLogo={() => {}} />
            <div className="school-content">
                <h1>Settings</h1>
                <h4>School:</h4>
                <input value={school} onChange={e => setSchool(e.target.value)} />
                <button className="save-button" onClick={handleSave}>Save</button>
                <button className="back-button" onClick={() => navigate("/settings", { state: { userId } })}>Back</button>
            </div>
            <BottomNav />
            {menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} />}
        </div>
    );
};

export default ChangeSchool;
