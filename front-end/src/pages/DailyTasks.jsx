import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HeaderBar from "../components/HeaderBar.jsx";
import BottomNav from "../components/BottomNav.jsx";
import MenuOverlay from "../components/MenuOverlay.jsx";
import "./DailyTasks.css";
import "./AllTasks.css";

export default function DailyTasks() {
  // Track whether menu overlay is open
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();
  const { date } = useParams();

  // Raw tasks + merged “items” list (tasks + classes)
  const [tasks, setTasks] = useState([]);
  const [items, setItems] = useState([]);

  // API base URL (from environment variable)
  const API_BASE = process.env.REACT_APP_API_URL || "";


  // Fetch daily tasks + classes whenever `date` changes
  useEffect(() => {
    const today = new Date();

    // Convert local timezone to correct YYYY-MM-DD format
    const local = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];

    // If date param exists, use it; otherwise use today
    const queryDate = date || local;

    const token = localStorage.getItem("token");

    // Fetch both tasks + classes simultaneously
    Promise.all([
      fetch(`${API_BASE}/api/tasks/daily/${queryDate}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json()),

      fetch(`${API_BASE}/api/classes/daily/${queryDate}`, {
        headers: { 
          Authorization: `Bearer ${token}`, 
        },
      }).then((res) => res.json()),
    ])
      .then(([tasksData, classesData]) => {
        // Ensure both responses are arrays
        const safeTasksData = Array.isArray(tasksData) ? tasksData : [];
        const safeClassesData = Array.isArray(classesData) ? classesData : [];

        // Normalize completed boolean values
        const normalizedTasks = safeTasksData.map((t) => ({
          ...t,
          completed: Boolean(t.completed),
        }));

        // Merge tasks + classes into a single array
        const merged = [...normalizedTasks, ...safeClassesData];

        // Sort by time: tasks use `date`, classes use `start`
        merged.sort((a, b) => {
          const aTime = a.date || a.start;
          const bTime = b.date || b.start;
          return aTime.localeCompare(bTime);
        });

        setTasks(normalizedTasks);
        setItems(merged);
      })
      .catch(console.error);
  }, [date]);

  // Capitalize priority text
  const priorityText = (p) => {
    if (!p) return "";
    const lower = p.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  };

  // Navigate to task editor page
  const openEdit = (id) => navigate(`/tasks/${id}/edit`);

  return (
    <div className="dailypixel-page">
      {/* Top header bar */}
      <HeaderBar
        title={`Daily Tasks${date ? ` (${date})` : ""}`}
        onHamburger={() => setMenuOpen(true)}
        onLogo={() => navigate("/dashboard")}
      />

      <main className="dailypixel-main">
        {/* Empty state message */}
        {items.length === 0 && (
          <div className="allpixel-empty">
            {date
              ? `No classes or tasks for ${date}.`
              : "No classes or tasks for today."}
          </div>
        )}

        {/* Loop through merged list: tasks + class occurrences */}
        {items.map((item) => {
          const isClass = item.source === "class"; // Distinguish tasks vs classes
          const itemId = isClass ? item.occurrenceId : item._id;

          return (
            <button
              key={itemId}
              className={`allpixel-card ${isClass ? "allpixel-card-class" : ""}`}
              onClick={() => {
                // Class → navigate to class editor
                // Task → navigate to task editor
                if (!isClass) openEdit(item._id);
                else navigate(`/classes/${item.classId}/edit`);
              }}
              style={isClass ? { borderLeftColor: item.color, cursor: "pointer" } : {}}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div className="allpixel-left">
                  {/* Title row */}
                  <div className="allpixel-title-row">
                    <span className="allpixel-title">{item.title}</span>

                    {/* Task → show priority pill */}
                    {!isClass && (
                      <span
                        className={`allpixel-pill allpixel-pill-${item.priority.toLowerCase()}`}
                      >
                        {priorityText(item.priority)}
                      </span>
                    )}

                    {/* Class → show Class pill */}
                    {isClass && (
                      <span className="allpixel-pill allpixel-pill-class">Class</span>
                    )}
                  </div>

                  {/* Meta row: course + due time OR class info */}
                  <div className="allpixel-meta">
                    {!isClass && (
                      <>
                        <span>{item.course}</span>
                        <span className="allpixel-dot" />
                      </>
                    )}

                    {isClass && (
                      <>
                        <span>{item.location}</span>
                        <span className="allpixel-dot" />
                      </>
                    )}

                    {/* Display time range for classes; due date for tasks */}
                    <span>
                      {isClass
                        ? `${item.start.split("T")[1]} - ${item.end.split("T")[1]}`
                        : `Due ${item.date.replace("T", " ")}`}
                    </span>
                  </div>

                  {/* Notes / details */}
                  <div className="allpixel-note">
                    {!isClass ? item.details : item.instructor || item.notes || ""}
                  </div>
                </div>
              </div>

              {/* Checkbox for task completion (classes do not have checkboxes) */}
              {!isClass && (
                <div className="allpixel-square" aria-hidden>
                  <input
                    className="task-checkbox"
                    type="checkbox"
                    checked={Boolean(item.completed)}
                    onChange={async (e) => {
                      e.stopPropagation(); // Prevent opening the edit page

                      const newVal = e.target.checked;

                      try {
                        const res = await fetch(`${API_BASE}/api/tasks/${item.id}`, {
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

                        // Update task list and merged list
                        setTasks((prev) =>
                          prev.map((t) => (t.id === item.id ? updated : t))
                        );
                        setItems((prev) =>
                          prev.map((it) => (it.id === item.id ? updated : it))
                        );
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}
            </button>
          );
        })}
      </main>

      {/* Bottom navigation bar */}
      <BottomNav />

      {/* Slide-out menu */}
      {menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} />}
    </div>
  );
}
