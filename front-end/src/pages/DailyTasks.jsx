import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import HeaderBar from "../components/HeaderBar.jsx";
import BottomNav from "../components/BottomNav.jsx";
import MenuOverlay from "../components/MenuOverlay.jsx";
import "./DailyTasks.css";
import "./AllTasks.css";

export default function DailyTasks() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const tasks = useMemo(
    () => [
      { id: "t1", title: "Finish Report", note: "Add charts & polish intro", course: "CS 101", due: "2025-10-30 23:59", priority: 2 },
      { id: "t2", title: "Read Paper",  note: "RAG evaluation section",      course: "AI Lab", due: "2025-10-29 18:00", priority: 3 },
      { id: "t3", title: "Team Sync",   note: "Prepare slides (5 pages)",    course: "Proj",   due: "2025-10-31 10:00", priority: 1 },
      { id: "t4", title: "Quiz Prep",   note: "Ch.4–6 quick review",         course: "DMA",    due: "2025-10-28 21:00", priority: 3 },
    ],
    []
  );

  const pillText = (p) => (p === 3 ? "High" : p === 2 ? "Medium" : "Low");

  const openEdit = (id) => navigate(`/tasks/${id}/edit`);

  return (
    <div className="dailypixel-page">
      <HeaderBar
        title="Daily Tasks"
        onHamburger={() => setMenuOpen(true)}
        onLogo={() => {}}
      />

      <main className="dailypixel-main">
        {tasks.map((t) => (
          <button key={t.id} className="allpixel-card" onClick={() => openEdit(t.id)}>
            <div className="allpixel-left">
              <div className="allpixel-title-row">
                <span className="allpixel-title">{t.title}</span>
                <span className={`allpixel-pill allpixel-pill-${t.priority}`}>{pillText(t.priority)}</span>
              </div>

              <div className="allpixel-meta">
                <span>{t.course}</span>
                <span className="allpixel-dot" />
                <span>Due {t.due}</span>
              </div>

              <div className="allpixel-note">{t.note}</div>
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
