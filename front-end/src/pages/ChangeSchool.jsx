import './ChangeSchool.css'
/*import logo from './logo.png'*/
import HeaderBar from "../components/HeaderBar.jsx";
import BottomNav from "../components/BottomNav.jsx";
import { useState, useEffect } from "react";
import MenuOverlay from "../components/MenuOverlay.jsx";
import { useNavigate } from "react-router-dom";

const ChangeSchool = () => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [school, setSchool] = useState("");
    const [grade, setGrade] = useState("");
    
    useEffect(() => {
        fetch("http://localhost:5001/api/settings").then(res => res.json()).then(data => {setSchool(data.school || ""); setGrade(data.grade || "");})
    }, [])

    const handleSave = async () => {
        await fetch("http://localhost:5001/api/settings/school", {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({value : school})
        });
        await fetch("http://localhost:5001/api/settings/grade", {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({value : grade})
        });
        navigate("/settings")
    }

    return(
        <div className = "ChangeSchool">
            <HeaderBar title="Change School" onHamburger={() => setMenuOpen(true)} onLogo={() => {}} />

            <div className = "school-content">
                <h1>Settings</h1>
                <h4>School:</h4>
                <label>
                    <input name="school" value={school} onChange={e => setSchool(e.target.value)}/>
                </label>
                <h4>Grade:</h4>
                <label>
                    <input name="grade" value={grade} onChange={e => setGrade(e.target.value)}/>
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

export default ChangeSchool