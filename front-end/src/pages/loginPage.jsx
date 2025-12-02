import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderBar from "../components/HeaderBar.jsx";
import MenuOverlay from "../components/MenuOverlay.jsx";
import "./loginPage.css";

export default function LoginPage() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:5001/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            const data = await res.json();
            console.log("Response from backend:", data);

            if (res.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("userId", data.user.id);
                localStorage.setItem("name", data.user.name);
                navigate("/dashboard");
            } else {
                alert(data.error || "Login failed");
            }
        } catch (err) {
            console.error("Error logging in:", err);
        }

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

        {/* <BottomNav /> */}
        {menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} />}
        </div>
    );
}
