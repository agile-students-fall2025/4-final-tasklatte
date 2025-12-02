import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderBar from "../components/HeaderBar.jsx";
import MenuOverlay from "../components/MenuOverlay.jsx";
import "./registerPage.css";

export default function RegisterPage() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:5001/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, name, password }),
            });
            const data = await res.json();
            console.log("Response from backend:", data);

            if (res.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("userId", data.user.id);
                localStorage.setItem("name", data.user.name);
                navigate("/account", {state: {userId: data.user.id, name:data.user.name}});
            } else {
                alert(data.error || "Registration failed");
            }
        } catch (err) {
            console.error("Error registering user:", err);
        }

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
                <button type="submit" className="pixel-button" onClick={() => navigate('/account' , {state: {name}})}>
                Next
                </button>
            </div>
            </form>
        </main>

        {menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} />}
        </div>
    );
}
