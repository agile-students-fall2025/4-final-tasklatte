import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderBar from "../components/HeaderBar.jsx";
import BottomNav from "../components/BottomNav.jsx";
import MenuOverlay from "../components/MenuOverlay.jsx";
import "./AllTasks.css";

export default function AllTasks() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch("/api/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch(console.error);
  }, []);

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

  const filtered = tasks.filter((t) => {
    if (query && !(`${t.title} ${t.details}`.toLowerCase().includes(query.toLowerCase()))) return false;
    if (prio !== "all" && prio.toLowerCase() !== t.priority.toLowerCase()) return false;
    if (course && !t.course.toLowerCase().includes(course.toLowerCase())) return false;
    if (due && !t.date.startsWith(due)) return false;
    return true;
  });

  const openEdit = (id) => navigate(`/tasks/${id}/edit`);

  return (
    <div className="allpixel-page">
      <HeaderBar title="All Tasks" onHamburger={() => setMenuOpen(true)} onLogo={() => {}} />

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
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
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
                <span className={`allpixel-pill allpixel-pill-${t.priority.toLowerCase()}`}>
                  {t.priority}
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
