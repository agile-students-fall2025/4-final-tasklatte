import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderBar from "../components/HeaderBar.jsx";
import BottomNav from "../components/BottomNav.jsx";
import MenuOverlay from "../components/MenuOverlay.jsx";
import "./dashboardPage.css";

export default function DashboardPage() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [user, setUser] = useState({ username: "", name: "" });
    const [dailyTasks, setDailyTasks] = useState({ total: 0, completed: 0 });
    const [weeklyTasks, setWeeklyTasks] = useState({ total: 0, completed: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        const userId = 1;
        fetch(`http://localhost:5001/api/dashboard/${userId}`)
        .then(res => {
            if (!res.ok) {
                throw new Error("Failed to fetch dashboard data");
            }
            return res.json();
        })
        .then(data => {
            setUser(data.user || { username: "", name: "" });
            setDailyTasks(data.dailyTasks || { total: 0, completed: 0 });
            setWeeklyTasks(data.weeklyTasks || { total: 0, completed: 0 });
        })
        .catch(err => {
            console.error(err);
        });
    }, []);

    return (
        <div className="page dashboard-page">
        <HeaderBar
            title="Dashboard"
            onHamburger={() => setMenuOpen(true)}
            onLogo={() => navigate("/")}
        />

        <main className="dashboard-content">
            <h1 className="dashboard-greeting">hi, {user?.name || "User"}</h1>

            <div className="task-section">
            <div className="task-card">
                <h2>Daily Tasks</h2>
                <div className="task-image"></div>
                <p>{dailyTasks?.completed}/{dailyTasks?.total} Completed</p>
            </div>

            <div className="task-card">
                <h2>Weekly Tasks</h2>
                <div className="task-image"></div>
                <p>{weeklyTasks?.completed}/{weeklyTasks?.total} Completed</p>
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
