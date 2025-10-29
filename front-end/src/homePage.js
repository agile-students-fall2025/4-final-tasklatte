import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderBar from "./components/HeaderBar.jsx";
import BottomNav from "./components/BottomNav.jsx";
import MenuOverlay from "./components/MenuOverlay.jsx";
import logo from "./logo.png";
import "./homePage.css";

export default function HomePage() {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="page home-page">
        <HeaderBar
            title="Welcome"
            onHamburger={() => setMenuOpen(true)}
            onLogo={() => navigate("/home")}
        />

        <main className="home-content">
            <h1>TaskLatte</h1>
            <img src={logo} alt="Logo" className="logo" />

            <div className="button-section">
            <button
                className="pixel-button"
                onClick={() => navigate("/login")}
            >
                Log In
            </button>
            <button
                className="pixel-button"
                onClick={() => navigate("/register")}
            >
                Register
            </button>
            </div>
        </main>

        <BottomNav />
        {menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} />}
        </div>
    );
}
