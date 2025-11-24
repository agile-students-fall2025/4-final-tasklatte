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

  useEffect(() => {
    const today = new Date();
    const local = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];

    const queryDate = date || local;

    Promise.all([
      fetch(`/api/tasks/daily/${queryDate}`).then((res) => res.json()),
      fetch(`/api/classes/daily/${queryDate}`).then((res) => res.json()),
    ])
      .then(([tasksData, classesData]) => {
        const normalizedTasks = tasksData.map((t) => ({
          ...t,
          completed: Boolean(t.completed),
        }));
        const merged = [...normalizedTasks, ...classesData];
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
        {items.length === 0 && (
          <div className="allpixel-empty">
            {date ? `No classes or tasks for ${date}.` : "No classes or tasks for today."}
          </div>
        )}

        {items.map((item) => {
          const isClass = item.source === "class";
          const itemId = isClass ? item.occurrenceId : item.id;

          return (
            <button
              key={itemId}
              className={`allpixel-card ${isClass ? "allpixel-card-class" : ""}`}
              onClick={() => {
                if (!isClass) openEdit(item.id);
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
                        {pillText(item.priority)}
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
                        const res = await fetch(`/api/tasks/${item.id}`, {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
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
