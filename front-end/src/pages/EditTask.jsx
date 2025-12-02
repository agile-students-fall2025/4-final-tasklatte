import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HeaderBar from "../components/HeaderBar.jsx";
import BottomNav from "../components/BottomNav.jsx";
import MenuOverlay from "../components/MenuOverlay.jsx";
import "./EditTask.css";

export default function EditTask({ tasks = [], setTasks }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const [form, setForm] = useState({
    title: "",
    details: "",
    course: "",
    due: "",
    priority: "Medium",
    completed: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/tasks/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Task not found");
        return res.json();
      })
      .then((task) => {
        setForm({
          title: task.title || "",
          details: task.details || "",
          course: task.course || "",
          due: task.date || "",
          priority: task.priority || "Medium",
          completed: Boolean(task.completed),
        });
      })
      .catch(() => {
        navigate("/calendar");
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const update = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSave = async () => {
    const payload = {
      title: form.title,
      details: form.details,
      course: form.course,
      date: form.due,
      priority: form.priority,
      completed: Boolean(form.completed),
    };

    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save");
      const json = await res.json();

      if (setTasks) {
        setTasks((prev) => prev.map((t) => (t.id === id ? json.task : t)));
      }

      navigate(-1);
    } catch (err) {
      console.error(err);
    }
  };

  const onDelete = async () => {
  try {
    setLoading(true);
    const res = await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
      header: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!res.ok) throw new Error("Failed to delete task");

    if (setTasks) {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    }
    navigate(-1);
  } catch (err) {
    console.error(err);
    alert("Something went wrong while deleting the task.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="edittask-container">
      <HeaderBar
        title="Edit Task"
        onHamburger={() => setMenuOpen(true)}
        onLogo={() => {}}
      />

      <main className="edittask-main">
        <form className="sheet">
          <label className="label" htmlFor="title">Title</label>
          <input
            id="title"
            className="input"
            placeholder="e.g., Project Milestone"
            value={form.title}
            onChange={update("title")}
            required
          />

          <label className="label" htmlFor="details">Details</label>
          <textarea
            id="details"
            className="textarea"
            placeholder="Notes / subtasks / links…"
            rows={3}
            value={form.details}
            onChange={update("details")}
          />

          <label className="label" htmlFor="course">Course</label>
          <input
            id="course"
            className="input"
            placeholder="e.g., CS 101"
            value={form.course}
            onChange={update("course")}
          />

          <label className="label" htmlFor="due">Date</label>
          <input
            id="due"
            type="datetime-local"
            className="input"
            value={form.due}
            onChange={update("due")}
          />

          <label className="label" htmlFor="priority">Priority</label>
          <select
            id="priority"
            className="input"
            value={form.priority}
            onChange={update("priority")}
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <label className="label" htmlFor="completed">Completed</label>
            <input
              id="completed"
              className="task-checkbox"
              type="checkbox"
              checked={Boolean(form.completed)}
              onChange={(e) =>
                setForm((f) => ({ ...f, completed: e.target.checked }))
              }
            />
          </div>

          {/* Action buttons */}
          <div className="actions">
            <button
              type="button"
              className="btn ghost"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn solid"
              onClick={onSave}
              disabled={loading}
            >
              {loading ? "Loading…" : "Save"}
            </button>
          </div>

          <div
            className="actions"
            style={{ justifyContent: "flex-start", marginTop: "0.5rem" }}
          >
            <button
              type="button"
              className="btn danger"
              onClick={onDelete}
              disabled={loading}
            >
              Delete Task
            </button>
          </div>
        </form>
      </main>

      <BottomNav />
      {menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} />}
    </div>
  );
}