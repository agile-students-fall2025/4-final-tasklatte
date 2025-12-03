import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import HeaderBar from "../components/HeaderBar.jsx";
import BottomNav from "../components/BottomNav.jsx";
import MenuOverlay from "../components/MenuOverlay.jsx";
import "./profilePage.css";

export default function ProfilePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    id: null,
    name: "",
    username: "",
    bio: "",
    major: "",
    school: "",
    grade: "",
    timezone: "",
    goals: [],
  });
  const [expandedGoal, setExpandedGoal] = useState(null);

  const toggleGoal = (id) => {
    setExpandedGoal((prev) => (prev === id ? null : id));
  };
  const location = useLocation();
  const {userId: stateUserId} = location.state || {};
  const userId = stateUserId || localStorage.getItem("userId");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }
        const res = await fetch(`http://localhost:5001/api/profile`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await res.json();
        console.log("Fetched profile data:", data); // 👀 Debugging tip
        if (!res.ok) {
          console.error(data.error);
          return;
        }
        setProfile(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, []);

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
            <img
              src="https://picsum.photos/id/237/200/300"
              alt="Avatar"
              className="avatar pixel-border"
            />
            <h2 className="pixel-font">{profile.name}</h2>
          </div>
          <div className="profile-right">
            <p className="pixel-font">Grade: {profile.grade}</p>
            <p className="pixel-font">Major: {profile.major}</p>
            <p className="pixel-font cafe-name">School: {profile.school}</p>
            {/* <p className="pixel-font">Timezone: {profile.timezone}</p> */}
          </div>
        </div>

        <div className="bio-div stat-card pixel-border">
          Bio:
          <p>{profile.bio}</p>
        </div>

        <div className="goals-section">
          <h3 className="pixel-font section-title">Goals</h3>
          {profile.goals.map((g) => (
            <div
              key={g.id}
              className={`goal-card pixel-border ${expandedGoal === g.id ? "expanded" : ""}`}
              onClick={() => toggleGoal(g.id)}
            >
              <p className="pixel-font goal-title">{g.title}</p>
              {expandedGoal === g.id && (
                <p className="pixel-font goal-details">{g.description}</p>
              )}
            </div>
          ))}
        </div>
      </main>

      <BottomNav />
      {menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} />}
    </div>
  );
}
