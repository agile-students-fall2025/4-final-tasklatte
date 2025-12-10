import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderBar from "../components/HeaderBar.jsx";
import MenuOverlay from "../components/MenuOverlay.jsx";
import "./registerPage.css";

export default function RegisterPage() {
    const navigate = useNavigate();

    // -----------------------------
    // Component State
    // -----------------------------
    const [menuOpen, setMenuOpen] = useState(false); // Controls hamburger menu
    const [username, setUsername] = useState(""); // Username input field
    const [password, setPassword] = useState(""); // Password input field
    const [name, setName] = useState(""); // Name input field
    const [showPopup, setShowPopup] = useState(false); // Controls error popup visibility
    const [popupMessage, setPopupMessage] = useState(""); // Message shown inside popup
    const API_BASE = process.env.REACT_APP_API_URL || "";

    // -----------------------------
    // Handle Form Submission
    // -----------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const res = await fetch(`${API_BASE}/api/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, name, password }),
            });

            const data = await res.json();
            console.log("Response from backend:", data);

            // -----------------------------
            // If registration succeeded
            // -----------------------------
            if (res.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("userId", data.user.id);
                localStorage.setItem("name", data.user.name);

                navigate("/account", {
                    state: { userId: data.user.id, name: data.user.name }
                });
            // -----------------------------
            // If registration failed (400 error)
            // -----------------------------    
            } else {
                setPopupMessage(data.error || "Registration failed");
                setShowPopup(true);
            }
        } catch (err) {
            console.error("Error registering user:", err);
            setPopupMessage("Server error. Please try again.");
            setShowPopup(true);
        }
    };

    return (
        <div className="page register-page">
            <HeaderBar
                title="Register"
                onHamburger={() => setMenuOpen(true)}
                onLogo={() => navigate("/")}
            />

            <main className="register-content">
                <h1>Enter Details</h1>

                <form className="register-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        className="register-input"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />

                    <input
                        type="text"
                        placeholder="Name"
                        className="register-input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
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
                            Register
                        </button>
                    </div>
                </form>
            </main>

            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-box">
                        <p>{popupMessage}</p>
                        <button
                            className="popup-close"
                            onClick={() => setShowPopup(false)}
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}

            {menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} />}
        </div>
    );
}
