import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderBar from "../components/HeaderBar.jsx";
import BottomNav from "../components/BottomNav.jsx";
import MenuOverlay from "../components/MenuOverlay.jsx";
import "./AddTasks.css";

export default function AddClass() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const API_BASE = process.env.REACT_APP_API_URL || "";

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    instructor: "",
    days: [],
    startTime: "09:00",
    endTime: "10:00",
    startDate: "2025-09-01",
    endDate: "2025-12-15",
    timezone: "America/Los_Angeles",
    color: "#8b5e3c",
    notes: "",
  });

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayValues = [0, 1, 2, 3, 4, 5, 6];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDayToggle = (dayValue) => {
    setFormData((prev) => ({
      ...prev,
      days: prev.days.includes(dayValue)
        ? prev.days.filter((d) => d !== dayValue)
        : [...prev.days, dayValue].sort(),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.title.trim()) {
      setError("Please enter a class title");
      setLoading(false);
      return;
    }

    if (formData.days.length === 0) {
      setError("Please select at least one day of the week");
      setLoading(false);
      return;
    }

    if (formData.startTime >= formData.endTime) {
      setError("Start time must be before end time");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/classes`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to create class");
      }

      setSuccess(true);
      setTimeout(() => navigate("/calendar"), 1200);
    } catch (err) {
      console.error(err);
      setError("Error creating class");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="addtask-container">
      <HeaderBar title="Add Class" onHamburger={() => setMenuOpen(true)} onLogo={() => navigate("/dashboard")} />

      <main className="addtask-main">
        <form className="addtask-sheet" onSubmit={handleSubmit}>
          <label className="addtask-label">TITLE</label>
          <input
            className="addtask-input"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g., CS 101 - Intro to CS"
          />

          <label className="addtask-label">INSTRUCTOR</label>
          <input
            className="addtask-input"
            name="instructor"
            value={formData.instructor}
            onChange={handleInputChange}
            placeholder="e.g., Prof. Smith"
          />

          <label className="addtask-label">LOCATION</label>
          <input
            className="addtask-input"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="e.g., Room 201"
          />

          <label className="addtask-label">DAYS OF WEEK</label>
          <div className="addclass-days">
            {dayLabels.map((label, idx) => (
              <button
                type="button"
                key={dayValues[idx]}
                className={`addclass-day ${formData.days.includes(dayValues[idx]) ? "active" : ""}`}
                onClick={() => handleDayToggle(dayValues[idx])}
              >
                {label}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label className="addtask-label">START TIME</label>
              <input className="addtask-input" type="time" name="startTime" value={formData.startTime} onChange={handleInputChange} />
            </div>
            <div style={{ flex: 1 }}>
              <label className="addtask-label">END TIME</label>
              <input className="addtask-input" type="time" name="endTime" value={formData.endTime} onChange={handleInputChange} />
            </div>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label className="addtask-label">START DATE</label>
              <input className="addtask-input" type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} />
            </div>
            <div style={{ flex: 1 }}>
              <label className="addtask-label">END DATE</label>
              <input className="addtask-input" type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} />
            </div>
          </div>

          <label className="addtask-label">TIMEZONE</label>
          <select className="addtask-input" name="timezone" value={formData.timezone} onChange={handleInputChange}>
            <option value="America/Los_Angeles">Pacific Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/New_York">Eastern Time</option>
            <option value="UTC">UTC</option>
          </select>

          <label className="addtask-label">COLOR</label>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input className="addtask-input" style={{ padding: 0, height: 42 }} type="color" name="color" value={formData.color} onChange={handleInputChange} />
            <div style={{ fontFamily: "monospace", color: "#6a5636" }}>{formData.color}</div>
          </div>

          <label className="addtask-label">NOTES</label>
          <textarea className="addtask-textarea" name="notes" value={formData.notes} onChange={handleInputChange} />

          {error && <div className="addtask-error">{error}</div>}
          {success && <div className="addtask-success">✅ Class saved successfully!</div>}

          <div className="addtask-actions">
            <button type="button" className="addtask-btn ghost" onClick={() => navigate("/calendar")}>Cancel</button>
            <button type="submit" className="addtask-btn">{loading ? "Saving..." : "Save"}</button>
          </div>
        </form>
      </main>

      <BottomNav />
      {menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} />}
    </div>
  );
}
