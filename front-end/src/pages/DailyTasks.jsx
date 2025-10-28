import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import HeaderBar from "../components/HeaderBar.jsx";
import BottomNav from "../components/BottomNav.jsx";
import MenuOverlay from "../components/MenuOverlay.jsx";
import "./DailyTasks.css";

export default function DailyTasks() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const tasks = useMemo(
    () => [
      { id: "t1", title: "Task 1", note: "XXXXX" },
      { id: "t2", title: "Task 2", note: "XXXXX" },
      { id: "t3", title: "Task 3", note: "XXXXX" },
      { id: "t4", title: "Task 4", note: "XXXXX" },
    ],
    []
  );

  const openEdit = (id) => navigate(`/tasks/${id}/edit`);

  return (
    <div className="page">
      <HeaderBar
        title="Daily Tasks"
        onHamburger={() => setMenuOpen(true)}
        onLogo={() => {}}
      />

      <main className="scroll">
        {tasks.map((t) => (
          <button
            key={t.id}
            className="task-card"
            onClick={() => openEdit(t.id)}
          >
            <div className="left">
              <div className="title">{t.title}</div>
              <div className="note">{t.note}</div>
            </div>
            <div className="square" aria-hidden></div>
          </button>
        ))}
      </main>

      <BottomNav />

      {menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} />}
    </div>
  );
}
