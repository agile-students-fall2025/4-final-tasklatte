import './ChangeBio.css';
import HeaderBar from "../components/HeaderBar.jsx";
import BottomNav from "../components/BottomNav.jsx";
import { useState, useEffect } from "react";
import MenuOverlay from "../components/MenuOverlay.jsx";
import { useNavigate, useLocation } from "react-router-dom";

const ChangeBio = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { userId: stateUserId } = location.state || {};
    const userId = stateUserId || localStorage.getItem("userId");

    const [menuOpen, setMenuOpen] = useState(false);
    const [bio, setBio] = useState("");

    useEffect(() => {
        if (!userId) return navigate("/login");
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");
        
        fetch(`http://localhost:5001/api/settings/bio`, {
            headers: {"Authorization": `Bearer ${token}`}
        })
            .then(res => res.json())
            .then(data => setBio(data.bio || ""))
            .catch(err => console.error(err));
    }, [userId, navigate]);

    const handleSave = async () => {
        const token = localStorage.getItem("token");
        await fetch(`http://localhost:5001/api/settings/bio`, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ value: bio }),
        });
        navigate("/settings", { state: { userId } });
    };

    return (
        <div className="ChangeBio">
            <HeaderBar title="Change Bio" onHamburger={() => setMenuOpen(true)} onLogo={() => {}} />
            <div className="bio-content">
                <h1>Settings</h1>
                <h4>Bio:</h4>
                <input value={bio} onChange={e => setBio(e.target.value)} />
                <button className="save-button" onClick={handleSave}>Save</button>
                <button className="back-button" onClick={() => navigate("/settings", { state: { userId } })}>Back</button>
            </div>
            <BottomNav />
            {menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} />}
        </div>
    );
};

export default ChangeBio;
