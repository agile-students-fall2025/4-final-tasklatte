import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderBar from "../components/HeaderBar.jsx";
import BottomNav from "../components/BottomNav.jsx";
import MenuOverlay from "../components/MenuOverlay.jsx";
import "./AllTasks.css";

export default function AllTasks() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const allTasks = useMemo(
    () => [
      { id: "t1", title: "Finish Report", note: "Add charts & polish intro", course: "CS 101", due: "2025-10-30 23:59", priority: 2 },
      { id: "t2", title: "Read Paper", note: "RAG evaluation section", course: "AI Lab", due: "2025-10-29 18:00", priority: 3 },
      { id: "t3", title: "Team Sync", note: "Prepare slides (5 pages)", course: "Proj", due: "2025-10-31 10:00", priority: 1 },
      { id: "t4", title: "Quiz Prep", note: "Ch.4–6 quick review", course: "DMA", due: "2025-10-28 21:00", priority: 4 },
    ],
    []
  );

  const [query, setQuery] = useState("");
  const [prio, setPrio] = useState("all");
  const [course, setCourse] = useState("");
  const [due, setDue] = useState("");

  const clearFilters = () => {
    setQuery("");
    setPrio("all");
    setCourse("");
    setDue("");
  };

  const filtered = allTasks.filter((t) => {
    if (query && !(`${t.title} ${t.note}`.toLowerCase().includes(query.toLowerCase()))) return false;
    if (prio !== "all" && Number(prio) !== t.priority) return false;
    if (course && !t.course.toLowerCase().includes(course.toLowerCase())) return false;
    if (due && !t.due.startsWith(due)) return false;
    return true;
  });

  const openEdit = (id) => navigate(`/tasks/${id}/edit`);

  return (
    <div className="allpixel-page">
      <HeaderBar
        title="All Tasks"
        onHamburger={() => setMenuOpen(true)}
        onLogo={() => {}}
      />

      <section className="allpixel-filters">
        <div className="allpixel-row">
          <input
            className="allpixel-input"
            placeholder="Search…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            className="allpixel-select"
            value={prio}
            onChange={(e) => setPrio(e.target.value)}
          >
            <option value="all">All</option>
            <option value="1">Low</option>
            <option value="2">Medium</option>
            <option value="3">High</option>
            <option value="4">Critical</option>
          </select>
          <button className="allpixel-btn-clear" onClick={clearFilters}>
            Clear
          </button>
          <span className="allpixel-result-count">{filtered.length} results</span>
        </div>

        <div className="allpixel-two-cols" style={{ marginTop: 10 }}>
          <input
            className="allpixel-input"
            placeholder="Course (e.g., CS 101)"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          />
          <input
            className="allpixel-input"
            type="date"
            value={due}
            onChange={(e) => setDue(e.target.value)}
          />
        </div>
      </section>

      <main className="allpixel-scroll">
        {filtered.length === 0 && <div className="allpixel-empty">No tasks found.</div>}

        {filtered.map((t) => (
          <button key={t.id} className="allpixel-card" onClick={() => openEdit(t.id)}>
            <div className="allpixel-left">
              <div className="allpixel-title-row">
                <span className="allpixel-title">{t.title}</span>
                <span className={`allpixel-pill allpixel-pill-${t.priority}`}>
                  {t.priority === 4 ? "Critical" : t.priority === 3 ? "High" : t.priority === 2 ? "Medium" : "Low"}
                </span>
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
