import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import HeaderBar from "../components/HeaderBar.jsx";
import MenuOverlay from "../components/MenuOverlay.jsx";
import "./Account.css";

export default function Account() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [bio, setBio] = useState("");
    const [major, setMajor] = useState("");
    const [school, setSchool] = useState("");
    const [grade, setGrade] = useState("");
    const [timezone, setTimezone] = useState("");
    const location = useLocation();
    const {userId, name} = location.state || {};

    const API_BASE = process.env.REACT_APP_API_URL || "";

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Not authenticated. Please log in.");
            return;
        }

        try {
            await fetch(`${API_BASE}/api/settings/bio`, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({value: bio }),
            });
             await fetch(`${API_BASE}/api/settings/major`, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({value: major }),
            });
             await fetch(`${API_BASE}/api/settings/school`, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({value: school }),
            });
             await fetch(`${API_BASE}/api/settings/grade`, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({value: grade }),
            });
             await fetch(`${API_BASE}/api/settings/timezone`, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({value: timezone }),
            });
        
            navigate("/dashboard", {state: {userId}})
        } catch (err) {
            console.error("Error registering user:", err);
        }

    };

    return (
        <div className="page account-page">
        <HeaderBar 
            title="Account Setup"
            onHamburger={() => setMenuOpen(true)}
            onLogo={() => navigate("/")} />

        <main className="account-content">
            <h1>Hi, {name}!</h1>
            <h3>Please set up your account</h3>
            <form className="account-form" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Bio"
                className="account-input"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Major"
                className="account-input"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="School"
                className="account-input"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Grade"
                className="account-input"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                required
            />
            {/* <input
                type="text"
                placeholder="Timezone"
                className="account-input"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                required
            /> */}

            <div className="account-buttons">
                <button
                type="button"
                className="pixel-button"
                onClick={() => navigate("/register")}
                >
                Go Back
                </button>
                <button type="submit" className="pixel-button">
                Save
                </button>
            </div>
            </form>
        </main>

        {menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} />}
        </div>
    );
}