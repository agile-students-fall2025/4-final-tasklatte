import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HeaderBar from "../components/HeaderBar.jsx";
import BottomNav from "../components/BottomNav.jsx";
import MenuOverlay from "../components/MenuOverlay.jsx";
import "./AddTasks.css";

export default function EditClass() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(null);
  const API_BASE = process.env.REACT_APP_API_URL || "";

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API_BASE}/api/classes/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setFormData(data))
      .catch((err) => console.error(err));
  }, [id]);

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

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/classes/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to update");
      navigate("/calendar");
    } catch (err) {
      console.error(err);
      alert("Error saving class");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this class?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/classes/${id}`, { 
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete");
      navigate("/calendar");
    } catch (err) {
      console.error(err);
      alert("Error deleting class");
    }
  };

  if (!formData) return <div>Loading...</div>;

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayValues = [0, 1, 2, 3, 4, 5, 6];

  return (
    <div className="edittask-container">
      <HeaderBar title="Edit Class" onHamburger={() => setMenuOpen(true)} />

      <main className="edittask-main">
        <form className="sheet" onSubmit={handleSave}>
          <label className="label">TITLE</label>
          <input className="input" name="title" value={formData.title || ""} onChange={handleInputChange} />

          <label className="label">INSTRUCTOR</label>
          <input className="input" name="instructor" value={formData.instructor || ""} onChange={handleInputChange} />

          <label className="label">LOCATION</label>
          <input className="input" name="location" value={formData.location || ""} onChange={handleInputChange} />

          <label className="label">DAYS OF WEEK</label>
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
              <label className="label">START TIME</label>
              <input className="input" type="time" name="startTime" value={formData.startTime || ""} onChange={handleInputChange} />
            </div>
            <div style={{ flex: 1 }}>
              <label className="label">END TIME</label>
              <input className="input" type="time" name="endTime" value={formData.endTime || ""} onChange={handleInputChange} />
            </div>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label className="label">START DATE</label>
              <input className="input" type="date" name="startDate" value={formData.startDate || ""} onChange={handleInputChange} />
            </div>
            <div style={{ flex: 1 }}>
              <label className="label">END DATE</label>
              <input className="input" type="date" name="endDate" value={formData.endDate || ""} onChange={handleInputChange} />
            </div>
          </div>

          <label className="label">TIMEZONE</label>
          <select className="input" name="timezone" value={formData.timezone || "America/Los_Angeles"} onChange={handleInputChange}>
            <option value="America/Los_Angeles">Pacific Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/New_York">Eastern Time</option>
            <option value="UTC">UTC</option>
          </select>

          <label className="label">COLOR</label>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input className="input" style={{ padding: 0, height: 42 }} type="color" name="color" value={formData.color || "#8b5e3c"} onChange={handleInputChange} />
            <div style={{ fontFamily: "monospace", color: "#6a5636" }}>{formData.color}</div>
          </div>

          <label className="label">NOTES</label>
          <textarea className="textarea" name="notes" value={formData.notes || ""} onChange={handleInputChange} />

          <div className="actions">
            <button type="button" className="btn ghost" onClick={() => navigate("/calendar")}>Cancel</button>
            <button type="submit" className="btn" disabled={loading}>{loading ? "Saving..." : "Save"}</button>
          </div>

          <div className="actions" style={{ justifyContent: "flex-start", marginTop: "0.5rem" }}>
            <button type="button" className="btn danger" onClick={handleDelete} disabled={loading}>Delete Class</button>
          </div>
        </form>
      </main>

      <BottomNav />
      {menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} />}
    </div>
  );
}
