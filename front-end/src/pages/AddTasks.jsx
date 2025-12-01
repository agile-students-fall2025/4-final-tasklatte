import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderBar from "../components/HeaderBar.jsx";
import BottomNav from "../components/BottomNav.jsx";
import MenuOverlay from "../components/MenuOverlay.jsx";
import "./AddTasks.css";

export default function AddTasks({ onTaskAdded }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [course, setCourse] = useState("");
  const [date, setDate] = useState("");
  const [priority, setPriority] = useState("Medium");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    if (!title || !course || !date) {
      setError("Please fill in title, course, and date.");
      setSaving(false);
      return;
    }

    try {
      const formattedDate = date.includes("T") ? date : `${date}:00`;
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          details,
          course,
          date: formattedDate,
          priority,
        }),
      });

      if (!response.ok) throw new Error("Failed to save task");
      const result = await response.json();

      console.log("✅ Task added:", result.task);
      setSuccess(true);
      setSaving(false);

      // Notify parent to refresh AI Suggestions
      if (onTaskAdded) onTaskAdded();

      // Optional: navigate to task list after 1.2s
      setTimeout(() => navigate("/all"), 1200);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while saving.");
      setSaving(false);
    }
  };

  const handleCancel = () => navigate("/calendar");

  return (
    <div className="addtask-container">
      <HeaderBar title="Add Task" onHamburger={() => setMenuOpen(true)} />

      <main className="addtask-main">
        <form className="addtask-sheet" onSubmit={handleSave}>
          <label className="addtask-label">TITLE</label>
          <input
            className="addtask-input"
            placeholder="e.g., Project Milestone"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label className="addtask-label">DETAILS</label>
          <textarea
            className="addtask-textarea"
            placeholder="Notes / subtasks / links…"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />

          <label className="addtask-label">COURSE</label>
          <input
            className="addtask-input"
            placeholder="e.g., CS 101"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          />

          <label className="addtask-label">DATE</label>
          <input
            className="addtask-input"
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <label className="addtask-label">PRIORITY</label>
          <select
            className="addtask-input"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          {error && <div className="addtask-error">{error}</div>}
          {success && <div className="addtask-success">✅ Task saved successfully!</div>}

          <div className="addtask-actions">
            <button
              type="button"
              className="addtask-btn ghost"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </button>
            <button type="submit" className="addtask-btn" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </main>

      <BottomNav />
      {menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} />}
    </div>
  );
}
