import './ChangeTimezone.css';
/*import logo from './logo.png'*/
import HeaderBar from "../components/HeaderBar.jsx";
import BottomNav from "../components/BottomNav.jsx";
import { useState, useEffect } from "react";
import MenuOverlay from "../components/MenuOverlay.jsx";
import { useNavigate } from "react-router-dom";

const ChangeTimezone = () => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [timezone, setTimezone] = useState("");
    
    useEffect(() => {
        fetch("http://localhost:5001/api/settings/timezone").then(res => res.json()).then(data => setTimezone(data.timezone))
    }, [])

    const handleSave = async () => {
        await fetch("http://localhost:5001/api/settings/timezone", {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({value : timezone})
        });
        navigate("/settings")
    }

    return(
        <div className = "ChangeTimezone">
            <HeaderBar title="Change TimeZone" onHamburger={() => setMenuOpen(true)} onLogo={() => {}} />

            <div className = "timezone-content">
                <h1>Settings</h1>
                <h4>Time-zone:</h4>
                <label>
                    <input name="timezone" value={timezone} onChange={e => setTimezone(e.target.value)}/>
                </label>
                <button className="save-button" onClick={handleSave}>Save</button>
                <button className="back-button" onClick={() => navigate("/settings")}>
                 Back
                </button>
            </div>

            <BottomNav />
            {menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} />}
                    
        </div>
    );
};

export default ChangeTimezone