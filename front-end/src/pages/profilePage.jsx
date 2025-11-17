import { useState, useEffect } from "react";
import HeaderBar from "../components/HeaderBar.jsx";
import BottomNav from "../components/BottomNav.jsx";
import MenuOverlay from "../components/MenuOverlay.jsx";
import "./profilePage.css";

export default function ProfilePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [user, setUser] = useState({
    name: "User",
    grade: "",
    major: "",
    university: "",
    avatar: "https://picsum.photos/id/237/200/300",
    stats: [
      { label: "📚study streak", value: 0 },
      { label: "🧘‍♀️longest focus", value: 0 },
      { label: "☕coffees drank", value: 0 },
      { label: "🍪snack breaks", value: 0 },
    ],
  });

  const [biography, setBiography] = useState({ bio: "" });
  const [goals, setGoals] = useState({ shortTerm: [], longTerm: [] });
  const [expandedGoal, setExpandedGoal] = useState(null);

  const toggleGoal = (id) => {
    setExpandedGoal((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/profile", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();

        // Map backend keys to frontend state
        setUser({
          name: "User", // profileSettings has no name
          grade: data.grade || "",
          major: data.major || "",
          university: data.school || "",
          avatar: "https://picsum.photos/id/237/200/300", // placeholder
          stats: [
            { label: "📚study streak", value: 0 },
            { label: "🧘‍♀️longest focus", value: 0 },
            { label: "☕coffees drank", value: 0 },
            { label: "🍪snack breaks", value: 0 },
          ],
        });

        setBiography({ bio: data.bio || "" });

        const allGoals = data.goals || [];
        setGoals({
          shortTerm: allGoals.slice(0, Math.ceil(allGoals.length / 2)),
          longTerm: allGoals.slice(Math.ceil(allGoals.length / 2)),
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="page">
      <HeaderBar title="Profile Page" onHamburger={() => setMenuOpen(true)} onLogo={() => {}} />

      <main className="profile-main">
        {/* Profile Card */}
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

        {/* Bio */}
        <div className="bio-div stat-card pixel-border">
          <p className="pixel-font">Bio:</p>
          <p>{biography.bio}</p>
        </div>

        {/* Stats */}
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
              style={{ cursor: s.label === "☕coffees drank" ? "pointer" : "default" }}
            >
              <p className="pixel-font label">{s.label}</p>
              <p className="pixel-font value">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Goals */}
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
                {expandedGoal === g.id && <p className="pixel-font goal-details">{g.description}</p>}
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
                {expandedGoal === g.id && <p className="pixel-font goal-details">{g.description}</p>}
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
