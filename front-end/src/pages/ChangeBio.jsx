import './ChangeBio.css'
/*import logo from './logo.png'*/
import HeaderBar from "../components/HeaderBar.jsx";
import BottomNav from "../components/BottomNav.jsx";
import { useState, useEffect } from "react";
import MenuOverlay from "../components/MenuOverlay.jsx";
import { useNavigate } from "react-router-dom";

const ChangeBio = () => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [bio, setBio] = useState("");

    useEffect(() => {
        fetch("http://localhost:5001/api/settings/bio").then(res => res.json()).then(data => setBio(data.bio))
    }, [])

    const handleSave = async () => {
        await fetch("http://localhost:5001/api/settings/bio", {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({value : bio})
        });
        navigate("/settings")
    }


    return(
        <div className = "ChangeBio">
            <HeaderBar title="Change Bio" onHamburger={() => setMenuOpen(true)} onLogo={() => {}} />

            <div className = "bio-content">
                <h1>Settings</h1>
                <h4>Bio:</h4>
                <label>
                    <input name="bio" value={bio} onChange={e => setBio(e.target.value)}/>
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

export default ChangeBio