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
    const API_BASE = process.env.REACT_APP_API_URL || "";

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }
        fetch(`${API_BASE}/api/dashboard`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
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
    }, [navigate]);

    const [quote, setQuote] = useState(null);

    useEffect(() => {
        fetch(`${API_BASE}/quotes.json`)
            .then(res => res.json())
            .then(data => {
                if (data.quotes && data.quotes.length > 0) {
                    const random = data.quotes[Math.floor(Math.random() * data.quotes.length)];
                    setQuote(random);
                }
            })
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="page dashboard-page">
        <HeaderBar
            title="Dashboard"
            onHamburger={() => setMenuOpen(true)}
            onLogo={() => navigate("/dashboard")}
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
                {quote ? (
                    <>
                        <p className="quote-text">"{quote.quote}"</p>
                        <p className="quote-author">— {quote.author}</p>
                    </>
                ) : (
                    <p>Loading inspiration...</p>
                )}
            </div>
        </main>

        <BottomNav />
        {menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} />}
        </div>
    );
}
