import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderBar from "./components/HeaderBar.jsx";
import BottomNav from "./components/BottomNav.jsx";
import MenuOverlay from "./components/MenuOverlay.jsx";
import "./dashboardPage.css";

export default function DashboardPage() {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="page dashboard-page">
        <HeaderBar
            title="Dashboard"
            onHamburger={() => setMenuOpen(true)}
            onLogo={() => navigate("/")}
        />

        <main className="dashboard-content">
            <h1 className="dashboard-greeting">hi, XXXXX</h1>

            <div className="task-section">
            <div className="task-card">
                <h2>Daily Tasks</h2>
                <div className="task-image"></div>
                <p>0/7 Completed</p>
            </div>

            <div className="task-card">
                <h2>Weekly Tasks</h2>
                <div className="task-image"></div>
                <p>2/35 Completed</p>
            </div>
            </div>

            <div className="motivation-card">
            <p>Motivational Quote/Image</p>
            </div>

            <div className="analytics-card">
            <p>Analytics / Recap</p>
            </div>
        </main>

        <BottomNav />
        {menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} />}
        </div>
    );
}
