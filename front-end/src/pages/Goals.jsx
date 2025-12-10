import "./Goals.css";
import HeaderBar from "../components/HeaderBar.jsx";
import BottomNav from "../components/BottomNav.jsx";
import { useState, useEffect } from "react";
import MenuOverlay from "../components/MenuOverlay.jsx";
import { useNavigate } from "react-router-dom";
import EditGoal from "./EditGoal.jsx";

const Goals = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [goals, setGoals] = useState([]);
  const API_BASE = process.env.REACT_APP_API_URL || "";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch(`${API_BASE}/api/settings/goals`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setGoals(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error getting goals:", err));
  }, [navigate, API_BASE]);

  const handleSave = async (updatedGoal) => {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `${API_BASE}/api/settings/goals/${updatedGoal.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedGoal),
      }
    );
    const saved = await res.json();
    setGoals((prev) =>
      prev.map((g) => (g.id === saved.id || g._id === saved.id ? saved : g))
    );
    setEditingGoal(null);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    await fetch(`${API_BASE}/api/settings/goals/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setGoals((prev) => prev.filter((g) => g.id !== id && g._id !== id));
    setEditingGoal(null);
  };

  const handleAdd = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE}/api/settings/goals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: "", description: "" }),
    });
    const newGoal = await res.json();
    setGoals((prev) => [...prev, newGoal]);
    setEditingGoal(newGoal);
  };

  return (
    <div className="Goals">
      <HeaderBar
        title="Goals"
        onHamburger={() => setMenuOpen(true)}
        onLogo={() => navigate("/dashboard")}
      />

      <div className="goal-content">
        <h1>Goals</h1>
        {goals.map((goal) => (
          <label key={goal.id || goal._id}>
            <input name="myInput" value={goal.title} readOnly />
            <button
              className="edit-button"
              onClick={() => setEditingGoal(goal)}
            >
              Edit
            </button>
          </label>
        ))}
        <button className="add-button" onClick={handleAdd}>
          Add More
        </button>
      </div>

      <button className="back-button" onClick={() => navigate("/settings")}>
        Back
      </button>

      <BottomNav />
      {menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} />}
      {editingGoal && (
        <EditGoal
          goal={editingGoal}
          onClose={() => setEditingGoal(null)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default Goals;
