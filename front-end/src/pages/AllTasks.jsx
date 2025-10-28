import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderBar from "../components/HeaderBar.jsx";
import BottomNav from "../components/BottomNav.jsx";
import MenuOverlay from "../components/MenuOverlay.jsx";
import "./AllTasks.css";

export default function AllTasks() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const tasks = useMemo(
    () => [
      { id: "t1", title: "Task 1", course: "DMA",       note: "Read ch2",   due: "2025-10-29", priority: 1 },
      { id: "t2", title: "Task 2", course: "OOP",       note: "HW 3",       due: "2025-10-30", priority: 4 },
      { id: "t3", title: "Task 3", course: "Parallel",  note: "Lab",        due: "2025-11-02", priority: 1 },
      { id: "t4", title: "Task 4", course: "Robotics",  note: "FK coding",  due: "2025-11-05", priority: 3 },
      { id: "t5", title: "Alpha Read", course: "DMA",   note: "Outline",    due: "2025-11-02", priority: 2 },
      { id: "t6", title: "Beta Lab",   course: "Robotics", note:"Grasping", due: "2025-11-01", priority: 2 },
    ],
    []
  );

  const [q, setQ] = useState("");                
  const [course, setCourse] = useState("any"); 
  const [date, setDate] = useState("");
  const [prio, setPrio] = useState("any");

  const courseOptions = useMemo(() => {
    const s = new Set(tasks.map(t => t.course));
    return ["any", ...Array.from(s).sort()];
  }, [tasks]);

  const ymd = (d) => new Date(d).toISOString().slice(0, 10);

  const filtered = useMemo(() => {
    return tasks.filter(t => {
      if (q.trim()) {
        const text = `${t.title} ${t.note}`.toLowerCase();
        if (!text.includes(q.trim().toLowerCase())) return false;
      }
      if (course !== "any" && t.course !== course) return false;
      if (prio !== "any" && String(t.priority) !== prio) return false;
      if (date) {
        if (ymd(t.due) !== date) return false;
      }
      return true;
    });
  }, [tasks, q, course, prio, date]);

  const openEdit = (id) => navigate(`/tasks/${id}/edit`);

  const clearFilters = () => {
    setQ(""); setCourse("any"); setDate(""); setPrio("any");
  };

  return (
    <div className="page">
      <HeaderBar title="All Tasks" onHamburger={() => setMenuOpen(true)} />


      <div className="filters">
        <div className="row">
          <input
            className="input"
            type="text"
            placeholder="Search title / note..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <div className="row two-cols">
          <select className="select" value={course} onChange={e => setCourse(e.target.value)}>
            {courseOptions.map(c => (
              <option key={c} value={c}>
                {c === "any" ? "All courses" : c}
              </option>
            ))}
          </select>

          <select className="select" value={prio} onChange={e => setPrio(e.target.value)}>
            <option value="any">Any priority</option>
            <option value="1">P1</option>
            <option value="2">P2</option>
            <option value="3">P3</option>
            <option value="4">P4</option>
          </select>
        </div>

        <div className="row">
          <input
            className="input"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            aria-label="Due date"
            title="Filter by due date"
          />
          <button className="btn-clear" onClick={clearFilters}>Clear filters</button>
          <div className="result-count">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</div>
        </div>
      </div>


      <main className="scroll">
        {filtered.length === 0 ? (
          <div className="empty">No tasks match current filters.</div>
        ) : (
          filtered.map((t) => (
            <button key={t.id} className="task-card" onClick={() => openEdit(t.id)}>
              <div className="left">
                <div className="title-row">
                  <span className="title">{t.title}</span>
                  <span className={`pill pill-prio-${t.priority}`}>P{t.priority}</span>
                </div>
                <div className="meta">
                  <span className="course">{t.course}</span>
                  <span className="dot" />
                  <span className="due">{new Date(t.due).toLocaleDateString()}</span>
                </div>
                <div className="note">{t.note}</div>
              </div>
              <div className="square" aria-hidden />
            </button>
          ))
        )}
      </main>

      <BottomNav />
      {menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} />}
    </div>
  );
}
