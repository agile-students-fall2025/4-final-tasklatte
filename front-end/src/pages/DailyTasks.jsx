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
  const [items, setItems] = useState([]); // merged tasks + classes
  const API_BASE = process.env.REACT_APP_API_URL || "";

  useEffect(() => {
    const today = new Date();
    const local = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];

    const queryDate = date || local;
    const token = localStorage.getItem("token");

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
        // Handle potential errors - ensure arrays
        const safeTasksData = Array.isArray(tasksData) ? tasksData : [];
        const safeClassesData = Array.isArray(classesData) ? classesData : [];
        
        const normalizedTasks = safeTasksData.map((t) => ({
          ...t,
          completed: Boolean(t.completed),
        }));
        const merged = [...normalizedTasks, ...safeClassesData];
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

  const priorityText = (p) => {
    if (!p) return "";
    const lower = p.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  };

  const openEdit = (id) => navigate(`/tasks/${id}/edit`);

  return (
    <div className="dailypixel-page">
      <HeaderBar
        title={`Daily Tasks${date ? ` (${date})` : ""}`}
        onHamburger={() => setMenuOpen(true)}
        onLogo={() => navigate("/dashboard")}
      />

      <main className="dailypixel-main">
        {items.length === 0 && (
          <div className="allpixel-empty">
            {date ? `No classes or tasks for ${date}.` : "No classes or tasks for today."}
          </div>
        )}

        {items.map((item) => {
          const isClass = item.source === "class";
          const itemId = isClass ? item.occurrenceId : item._id;

          return (
            <button
              key={itemId}
              className={`allpixel-card ${isClass ? "allpixel-card-class" : ""}`}
              onClick={() => {
                if (!isClass) openEdit(item._id);
                else navigate(`/classes/${item.classId}/edit`);
              }}
              style={isClass ? { borderLeftColor: item.color, cursor: "pointer" } : {}}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div className="allpixel-left">
                  <div className="allpixel-title-row">
                    <span className="allpixel-title">{item.title}</span>
                    {!isClass && (
                      <span className={`allpixel-pill allpixel-pill-${item.priority.toLowerCase()}`}>
                        {priorityText(item.priority)}
                      </span>
                    )}
                    {isClass && <span className="allpixel-pill allpixel-pill-class">Class</span>}
                  </div>
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
                    <span>
                      {isClass
                        ? `${item.start.split("T")[1]} - ${item.end.split("T")[1]}`
                        : `Due ${item.date.replace("T", " ")}`}
                    </span>
                  </div>
                  <div className="allpixel-note">
                    {!isClass ? item.details : item.instructor || item.notes || ""}
                  </div>
                </div>
              </div>
              {!isClass && (
                <div className="allpixel-square" aria-hidden>
                  <input
                    className="task-checkbox"
                    type="checkbox"
                    checked={Boolean(item.completed)}
                    onChange={async (e) => {
                      e.stopPropagation();
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

      <BottomNav />
      {menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} />}
    </div>
  );
}
