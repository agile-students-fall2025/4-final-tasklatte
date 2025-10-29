import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderBar from "./components/HeaderBar.jsx";
import BottomNav from "./components/BottomNav.jsx";
import MenuOverlay from "./components/MenuOverlay.jsx";
import "./registerPage.css";

export default function RegisterPage() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Name:", name, "Username:", username, "Password:", password);
        navigate("/dashboard");
    };

    return (
        <div className="page register-page">
        <HeaderBar 
            title="Register"
            onHamburger={() => setMenuOpen(true)}
            onLogo={() => navigate("/")} />

        <main className="register-content">
            <h1>Enter Details</h1>
            <form className="register-form" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Name"
                className="register-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Username"
                className="register-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                className="register-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />

            <div className="register-buttons">
                <button
                type="button"
                className="pixel-button"
                onClick={() => navigate("/")}
                >
                Go Back
                </button>
                <button type="submit" className="pixel-button">
                Confirm
                </button>
            </div>
            </form>
        </main>

        <BottomNav />
        {menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} />}
        </div>
    );
}
