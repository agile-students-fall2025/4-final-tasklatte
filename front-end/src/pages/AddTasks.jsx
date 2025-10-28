import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderBar from "../components/HeaderBar.jsx";
import BottomNav from "../components/BottomNav.jsx";
import MenuOverlay from "../components/MenuOverlay.jsx";
import "./AddTasks.css";

export default function AddTask() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const [form, setForm] = useState({
    title: "",
    details: "",
    course: "",
    due: "",
    priority: "Medium",
  });

  const update = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSave = (e) => {
    e.preventDefault();
    console.log("NEW TASK:", form);
    navigate("/calendar");
  };

  return (
    <div className="addtask-container">
      <HeaderBar title="Add Task" onHamburger={() => setMenuOpen(true)} onLogo={() => {}} />

      <main className="addtask-main">
        <form className="addtask-sheet" onSubmit={onSave}>
            <label className="addtask-label" htmlFor="title">Title</label>
            <input
                id="title"
                className="addtask-input"
                placeholder="e.g., Project Milestone"
                value={form.title}
                onChange={update("title")}
                required
            />

            <label className="addtask-label" htmlFor="details">Details</label>
            <textarea
                id="details"
                className="addtask-textarea"
                placeholder="Notes / subtasks / links…"
                rows={3}
                value={form.details}
                onChange={update("details")}
            />

            <label className="addtask-label" htmlFor="course">Course</label>
            <input
                id="course"
                className="addtask-input"
                placeholder="e.g., CS 101"
                value={form.course}
                onChange={update("course")}
            />

            <label className="addtask-label" htmlFor="due">Date</label>
            <input
                id="due"
                type="datetime-local"
                className="addtask-input"
                value={form.due}
                onChange={update("due")}
            />

            <label className="addtask-label" htmlFor="priority">Priority</label>
            <select
                id="priority"
                className="addtask-input"
                value={form.priority}
                onChange={update("priority")}
            >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
            </select>

            <div className="addtask-actions">
                <button type="button" className="addtask-btn ghost" onClick={() => navigate(-1)}>
                Cancel
                </button>
                <button type="submit" className="addtask-btn solid">Save</button>
            </div>
        </form>

      </main>

      <BottomNav />
      {menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} />}
    </div>
  );
}
