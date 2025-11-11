import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HeaderBar from "../components/HeaderBar.jsx";
import BottomNav from "../components/BottomNav.jsx";
import MenuOverlay from "../components/MenuOverlay.jsx";
import "./DailyTasks.css";
import "./AllTasks.css";

export default function DailyTasks() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { date } = useParams();

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const today = new Date();
    const local = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];

    const queryDate = date || local;

    fetch(`/api/tasks/daily/${queryDate}`)
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch(console.error);
  }, [date]);

  const pillText = (p) =>
    p === "High" ? "High" : p === "Medium" ? "Medium" : p === "Low" ? "Low" : p;

  const openEdit = (id) => navigate(`/tasks/${id}/edit`);

  return (
    <div className="dailypixel-page">
      <HeaderBar
        title={`Daily Tasks${date ? ` (${date})` : ""}`}
        onHamburger={() => setMenuOpen(true)}
        onLogo={() => {}}
      />

      <main className="dailypixel-main">
        {tasks.length === 0 && (
          <div className="allpixel-empty">
            {date ? `No tasks for ${date}.` : "No tasks for today."}
          </div>
        )}

        {tasks.map((t) => (
          <button key={t.id} className="allpixel-card" onClick={() => openEdit(t.id)}>
            <div className="allpixel-left">
              <div className="allpixel-title-row">
                <span className="allpixel-title">{t.title}</span>
                <span className={`allpixel-pill allpixel-pill-${t.priority.toLowerCase()}`}>
                  {pillText(t.priority)}
                </span>
              </div>
              <div className="allpixel-meta">
                <span>{t.course}</span>
                <span className="allpixel-dot" />
                <span>Due {t.date.replace("T", " ")}</span>
              </div>
              <div className="allpixel-note">{t.details}</div>
            </div>
            <div className="allpixel-square" aria-hidden />
          </button>
        ))}
      </main>

      <BottomNav />
      {menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} />}
    </div>
  );
}
