import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderBar from "../components/HeaderBar.jsx";
import BottomNav from "../components/BottomNav.jsx";
import MenuOverlay from "../components/MenuOverlay.jsx";
import "./AllTasks.css";

export default function AllTasks() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // All tasks + classes data from backend
  const [tasks, setTasks] = useState([]);
  const [classes, setClasses] = useState([]);

  // API base URL from environment variables
  const API_BASE = process.env.REACT_APP_API_URL || "";

  // Fetch tasks + classes when page first loads
  useEffect(() => {
    const token = localStorage.getItem("token");

    // Run both fetches in parallel
    Promise.all([
      fetch(`${API_BASE}/api/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.json()),

      fetch(`${API_BASE}/api/classes`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.json()),
    ])
      .then(([tasksData, classesData]) => {
        // Backend might return error objects, so ensure they are arrays
        const safeTasksData = Array.isArray(tasksData) ? tasksData : [];
        const safeClassesData = Array.isArray(classesData) ? classesData : [];

        // Normalize boolean field (in case backend sends string/number)
        const normalizedTasks = safeTasksData.map((t) => ({
          ...t,
          completed: Boolean(t.completed),
        }));

        setTasks(normalizedTasks);
        setClasses(safeClassesData);
      })
      .catch(console.error);
  }, []);


  // User filter states
  const [query, setQuery] = useState("");
  const [prio, setPrio] = useState("all");
  const [course, setCourse] = useState("");
  const [due, setDue] = useState("");
  const [status, setStatus] = useState("all");

  // Reset all filters at once
  const clearFilters = () => {
    setQuery("");
    setPrio("all");
    setCourse("");
    setDue("");
    setStatus("all");
  };


  // Filter logic for tasks
  const filtered = tasks.filter((t) => {
    // Text search
    if (
      query &&
      !(`${t.title} ${t.details}`.toLowerCase().includes(query.toLowerCase()))
    )
      return false;

    // Priority match (Low / Medium / High)
    if (prio !== "all" && prio.toLowerCase() !== t.priority.toLowerCase())
      return false;

    // Course filter
    if (course && !t.course.toLowerCase().includes(course.toLowerCase()))
      return false;

    // Date filter (YYYY-MM-DD prefix)
    if (due && !t.date.startsWith(due)) return false;

    // Completed / Incomplete toggle
    if (status !== "all") {
      const isCompleted = Boolean(t.completed);
      if (status === "completed" && !isCompleted) return false;
      if (status === "incomplete" && isCompleted) return false;
    }

    return true;
  });


  // Filters for classes section
  const filteredClasses = classes.filter((c) => {
    if (
      query &&
      !(`${c.title} ${c.notes}`.toLowerCase().includes(query.toLowerCase()))
    )
      return false;

    if (course && !c.title.toLowerCase().includes(course.toLowerCase()))
      return false;

    return true;
  });

  // Helper to format priority string
  const priorityText = (p) => {
    if (!p) return "";
    const lower = p.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  };

  // Navigate to task editor
  const openEdit = (id) => navigate(`/tasks/${id}/edit`);

  return (
    <div className="allpixel-page">
      <HeaderBar title="All Tasks" onHamburger={() => setMenuOpen(true)} onLogo={() => navigate("/dashboard")} />

      {/* FILTER UI */}
      <section className="allpixel-filters">
        <div className="allpixel-row">
          <input
            className="allpixel-input"
            placeholder="Search…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {/* Priority filter */}
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

          {/* Completed / Incomplete filter */}
          <select
            className="allpixel-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ marginLeft: 8 }}
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="incomplete">Incomplete</option>
          </select>

          <button className="allpixel-btn-clear" onClick={clearFilters}>
            Clear
          </button>

          <span className="allpixel-result-count">{filtered.length} results</span>
        </div>

        {/* Course + Due date filters */}
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

      {/* MAIN LIST SECTION */}
      <main className="allpixel-scroll">
        {/* Empty state */}
        {filtered.length === 0 && filteredClasses.length === 0 && (
          <div className="allpixel-empty">No tasks or classes found.</div>
        )}

        {/* Render tasks */}
        {filtered.map((t) => (
          <button
            key={t._id}
            className="allpixel-card"
            onClick={() => openEdit(t._id)}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="allpixel-left">
                {/* Title + Priority */}
                <div className="allpixel-title-row">
                  <span className="allpixel-title">{t.title}</span>
                  <span
                    className={`allpixel-pill allpixel-pill-${t.priority.toLowerCase()}`}
                  >
                    {priorityText(t.priority)}
                  </span>
                </div>

                {/* Course + Due date */}
                <div className="allpixel-meta">
                  <span>{t.course}</span>
                  <span className="allpixel-dot" />
                  <span>Due {t.date.replace("T", " ")}</span>
                </div>

                {/* Details / Notes */}
                <div className="allpixel-note">{t.details}</div>
              </div>
            </div>

            {/* Complete checkbox (does not open modal when clicked) */}
            <div className="allpixel-square" aria-hidden>
              <input
                className="task-checkbox"
                type="checkbox"
                checked={Boolean(t.completed)}
                onChange={async (e) => {
                  e.stopPropagation(); // Avoid opening the edit page
                  const newVal = e.target.checked;

                  try {
                    const res = await fetch(`${API_BASE}/api/tasks/${t._id}`, {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                      },
                      body: JSON.stringify({ completed: newVal }),
                    });

                    if (!res.ok) throw new Error("Failed to toggle");

                    const json = await res.json();
                    const updated = {
                      ...json.task,
                      completed: Boolean(json.task?.completed),
                    };

                    // Update UI without re-fetching entire task list
                    setTasks((prev) =>
                      prev.map((it) => (it._id === t._id ? updated : it))
                    );
                  } catch (err) {
                    console.error(err);
                  }
                }}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </button>
        ))}

        {/* Render classes */}
        {filteredClasses.map((c) => (
          <button
            key={c._id}
            className="allpixel-card allpixel-card-class"
            style={{ borderLeftColor: c.color, cursor: "pointer" }}
            onClick={() => navigate(`/classes/${c._id}/edit`)}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="allpixel-left">
                <div className="allpixel-title-row">
                  <span className="allpixel-title">{c.title}</span>
                  <span className="allpixel-pill allpixel-pill-class">Class</span>
                </div>

                <div className="allpixel-meta">
                  <span>{c.location}</span>
                  <span className="allpixel-dot" />
                  <span>
                    {/* Convert 0–6 integers → weekday names */}
                    {c.days
                      .map((d) => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d])
                      .join(", ")}
                  </span>
                </div>

                <div className="allpixel-note">
                  {c.instructor && `Instructor: ${c.instructor}`}{" "}
                  {c.notes && `• ${c.notes}`}
                </div>
              </div>
            </div>
          </button>
        ))}
      </main>

      {/* Bottom navigation bar */}
      <BottomNav />

      {/* Menu overlay */}
      {menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} />}
    </div>
  );
}
