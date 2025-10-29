import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderBar from "./components/HeaderBar.jsx";
import BottomNav from "./components/BottomNav.jsx";
import MenuOverlay from "./components/MenuOverlay.jsx";
import "./loginPage.css";

export default function LoginPage() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Username:", username, "Password:", password);
        navigate("/dashboard");
    };

    return (
        <div className="page login-page">
        <HeaderBar 
            title="Log In"
            onHamburger={() => setMenuOpen(true)}
            onLogo={() => navigate("/")} />

        <main className="login-content">
            <h1>Enter Details</h1>
            <form className="login-form" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Username"
                className="login-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                className="login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />

            <div className="login-buttons">
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
