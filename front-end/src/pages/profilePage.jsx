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

  useEffect(() => {
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`http://localhost:5001/api/settings?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      console.log("API response:", data);

      if (!res.ok) {
        console.error("Error fetching profile:", data.error);
        return;
      }

      // List of 10 possible profile pics
      const profilePics = Array.from({ length: 10 }, (_, i) => `profile${i + 1}.png`);
      // Random pic fallback
      const randomPic = profilePics[Math.floor(Math.random() * profilePics.length)];

      const safeProfile = {
        id: data.id || null,
        name: data.name && data.name.trim() !== "" ? data.name : "Unknown User",
        username: data.username || "",
        bio: data.bio || "",
        major: data.major || "",
        school: data.school || "",
        grade: data.grade || "N/A",
        timezone: data.timezone || "UTC",
        // Use statePhoto > data.photo > random fallback
        photo: statePhoto || data.photo || randomPic,
        goals: Array.isArray(data.goals) ? data.goals : [],
      };

      setProfile(safeProfile);
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
        onLogo={() => navigate("/")}
      />

      <main className="profile-main">
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
