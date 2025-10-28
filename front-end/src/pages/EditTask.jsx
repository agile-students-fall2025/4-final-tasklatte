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

  // Find task to edit
  const existingTask = tasks.find((t) => t.id === id);

  const [form, setForm] = useState({
    title: existingTask?.title || "",
    details: existingTask?.details || "",
    course: existingTask?.course || "",
    due: existingTask?.due || "",
    priority: existingTask?.priority || "Medium",
  });

  // useEffect(() => {
  //   if (!existingTask) {
  //     // Redirect if task doesn't exist
  //     navigate("/calendar");
  //   }
  // }, [existingTask, navigate]);

  const update = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSave = (e) => {
    e.preventDefault();

    const updated = tasks.map((t) =>
      t.id === id ? { ...t, ...form } : t
    );
    setTasks(updated);

    console.log("UPDATED TASK:", form);
    navigate("/calendar");
  };

  return (
    <div className="addtask-container">
      <HeaderBar
        title="Edit Task"
        onHamburger={() => setMenuOpen(true)}
        onLogo={() => {}}
      />

      <main className="addtask-main">
        <form className="sheet" onSubmit={onSave}>
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

          <div className="actions">
            <button type="button" className="btn ghost" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button type="submit" className="btn solid">Save</button>
          </div>
        </form>
      </main>

      <BottomNav />
      {menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} />}
    </div>
  );
}
