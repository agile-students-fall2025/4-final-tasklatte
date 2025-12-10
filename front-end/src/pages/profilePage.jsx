import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import HeaderBar from "../components/HeaderBar.jsx";
import BottomNav from "../components/BottomNav.jsx";
import MenuOverlay from "../components/MenuOverlay.jsx";
import "./profilePage.css";

export default function ProfilePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get photo from state if navigated from Settings
  const { photo: statePhoto } = location.state || {};
  const userId = localStorage.getItem("userId");

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
    photo: statePhoto || "",
  });

  const [expandedGoal, setExpandedGoal] = useState(null);
  const toggleGoal = (id) => setExpandedGoal((prev) => (prev === id ? null : id));
  const API_BASE = process.env.REACT_APP_API_URL || "";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(`${API_BASE}/api/settings`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (!res.ok) {
          console.error("Error fetching profile:", data.error);
          return;
        }

        // Fallback profile pics
        // const profilePics = Array.from({ length: 10 }, (_, i) => `pic${i + 1}.jpeg`);
        // const randomPic = profilePics[Math.floor(Math.random() * profilePics.length)];

        setProfile({
          id: data.id || null,
          name: data.name?.trim() || "Unknown User",
          username: data.username || "",
          bio: data.bio || "No Bio",
          major: data.major || "No Major",
          school: data.school || "No School",
          grade: data.grade || "No Grade",
          timezone: data.timezone || "UTC",
          photo: statePhoto || data.photo || profile.photo || "pic1.jpeg",
          goals: Array.isArray(data.goals) ? data.goals : [],
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, [statePhoto, userId]);

  return (
    <div className="page">
      <HeaderBar
        title="Profile Page"
        onHamburger={() => setMenuOpen(true)}
        onLogo={() => navigate("/dashboard")}
      />
      <main className="profile-main">
            <span id="settings"
          onClick={() => navigate("/settings")}
          style={{ cursor: "pointer" }}
        >⚙
      </span>
        <div className="profile-card pixel-frame">
          <div className="profile-left">
            <img
              src={
                profile.photo
                  ? `${process.env.PUBLIC_URL}/profile-pics/${profile.photo}`
                  : "https://picsum.photos/id/237/200/300"
              }
              alt="Avatar"
              className="avatar pixel-border"
            />
            <h2 className="pixel-font">{profile?.name || "User"}</h2>
          </div>

          <div className="profile-right">
            <p className="pixel-font">Grade: {profile.grade}</p>
            <p className="pixel-font">Major: {profile.major}</p>
            <p className="pixel-font cafe-name">School: {profile.school}</p>
          </div>
        </div>

        <div className="bio-div stat-card pixel-border">
          Bio:
          <p>{profile.bio}</p>
        </div>

        <div className="goals-section">
          {/* <span id="add-goal">⊕</span> */}
          <h3 className="pixel-font section-title">Goals</h3>
          {profile.goals.map((g, index) => (
            <div
              key={g.id || g._id || index}
              className={`goal-card pixel-border ${
                expandedGoal === (g.id || g._id) ? "expanded" : ""
              }`}
              onClick={() => toggleGoal(g.id || g._id)}
            >
              <p className="pixel-font goal-title">{g.title}</p>
              {expandedGoal === (g.id || g._id) && (
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
