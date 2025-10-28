import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderBar from "./components/HeaderBar.jsx";
import BottomNav from "./components/BottomNav.jsx";
import MenuOverlay from "./components/MenuOverlay.jsx";
import "./profilePage.css";

export default function ProfilePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const [user,setUser] = useState({
    name: "Lorem ipsum",
    grade: "Lorem",
    major: "Dolor sit amet",
    university: "consectetur adipiscing",
    avatar: "https://picsum.photos/id/237/200/300",
    stats: [
      { label: "📚study streak", value: 0 },
      { label: "🧘‍♀️longest focus", value: 0 },
      { label: "☕coffees drank", value: 0 },
      { label: "🍪snack breaks", value: 0}
    ],
  });

  const biography = { bio: "sed do eiusmod tempor incididunt"};

  const [goals, setGoals] = useState({
    shortTerm: [
      { id: 1, title: "Ut labore et dolore magna aliqua", details: "Ut enim ad minim veniam, quis nostrud" },
      { id: 2, title: "Laboris nisi ut aliquip ex ea commodo consequa", details: "Duis aute irure dolor in reprehenderit in" },
    ],
    longTerm: [
      { id: 3, title: "Oluptate velit esse cillum dolore", details: "Eu fugiat nulla pariatur." },
    ],
  });

  const [expandedGoal, setExpandedGoal] = useState(null);

  const toggleGoal = (id) => {
    setExpandedGoal((prev) => (prev === id ? null : id));
  };

  return (
    <div className="page">
      <HeaderBar
        title="Profile Page"
        onHamburger={() => setMenuOpen(true)}
        onLogo={() => navigate("/")}
      />

      <main className="profile-main">
        <div className="profile-card pixel-frame">
            <div className="profile-left">
                <img src={user.avatar} alt="Avatar" className="avatar pixel-border" />
                <h2 className="pixel-font">{user.name}</h2>
            </div>
            <div className="profile-right">
                <p className="pixel-font">Grade: {user.grade}</p>
                <p className="pixel-font">Major: {user.major}</p>
                <p className="pixel-font cafe-name">School: {user.university}</p>
            </div>
        </div>

        <div className="bio-div stat-card pixel-border">
          Bio:
          <p>{biography.bio}</p>
        </div>

        <div className="stats-grid">
          {user.stats.map((s, index) => (
            <div
              key={s.label}
              className="stat-card pixel-border"
              onClick={() => {
                if (s.label === "☕coffees drank") {
                  const newStats = [...user.stats];
                  newStats[index] = { ...s, value: s.value + 1 };
                  setUser({ ...user, stats: newStats });
                }
              }}
              style={{ cursor: s.label === "coffees drank" ? "pointer" : "default" }}
            >
              <p className="pixel-font label">{s.label}</p>
              <p className="pixel-font value">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="goals-section">
          <h3 className="pixel-font section-title">Goals</h3>

          <div className="goal-group">
            <h4 className="pixel-font goal-type">Short Term</h4>
            {goals.shortTerm.map((g) => (
              <div
                key={g.id}
                className={`goal-card pixel-border ${expandedGoal === g.id ? "expanded" : ""}`}
                onClick={() => toggleGoal(g.id)}
              >
                <p className="pixel-font goal-title">{g.title}</p>
                {expandedGoal === g.id && (
                  <p className="pixel-font goal-details">{g.details}</p>
                )}
              </div>
            ))}
          </div>

          <div className="goal-group">
            <h4 className="pixel-font goal-type">Long Term</h4>
            {goals.longTerm.map((g) => (
              <div
                key={g.id}
                className={`goal-card pixel-border ${expandedGoal === g.id ? "expanded" : ""}`}
                onClick={() => toggleGoal(g.id)}
              >
                <p className="pixel-font goal-title">{g.title}</p>
                {expandedGoal === g.id && (
                  <p className="pixel-font goal-details">{g.details}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      <BottomNav />

      {menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} />}
    </div>
  );
}
