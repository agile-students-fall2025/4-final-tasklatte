import './ChangeMajor.css'
/*import logo from './logo.png'*/
import HeaderBar from "../components/HeaderBar.jsx";
import BottomNav from "../components/BottomNav.jsx";
import { useState, useEffect } from "react";
import MenuOverlay from "../components/MenuOverlay.jsx";
import { useNavigate } from "react-router-dom";

const ChangeMajor = () => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [major, setMajor] = useState("");
    
    useEffect(() => {
        fetch("http://localhost:5001/api/settings/major").then(res => res.json()).then(data => setMajor(data.major))
    }, [])

    const handleSave = async () => {
        await fetch("http://localhost:5001/api/settings/major", {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({value : major})
        });
        navigate("/settings")
    }

    return(
        <div className = "ChangeMajor">
            <HeaderBar title="Change Major" onHamburger={() => setMenuOpen(true)} onLogo={() => {}} />

            <div className = "major-content">
                <h1>Settings</h1>
                <h4>Major:</h4>
                <label>
                    <input name="major" value={major} onChange={e => setMajor(e.target.value)}/>
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

export default ChangeMajor