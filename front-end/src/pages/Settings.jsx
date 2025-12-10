import './Settings.css';
import HeaderBar from "../components/HeaderBar.jsx";
import BottomNav from "../components/BottomNav.jsx";
import { useEffect, useState } from "react";
import MenuOverlay from "../components/MenuOverlay.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import DeleteConfirmOverlay from "../components/DeleteConfirmOverlay.jsx";

const Settings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId: stateUserId } = location.state || {};
  const userId = stateUserId || localStorage.getItem("userId");

  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [profile, setProfile] = useState({});
  const [selectedPhoto, setSelectedPhoto] = useState("");
  const API_BASE = process.env.REACT_APP_API_URL || "";

  const settingsOptions = ["bio", "major", "school", "goals"];

  // Fetch user profile on mount
  useEffect(() => {
    if (!userId) return navigate("/login");

    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    fetch(`${API_BASE}/api/settings`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setSelectedPhoto(data.photo || ""); // current saved photo
      })
      .catch((err) => console.error("Fetch profile error:", err));
  }, [userId, navigate]);

  // Update profile photo in DB and UI
  const handlePhotoClick = async (photo) => {
    setSelectedPhoto(photo);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_BASE}/api/settings/photo`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ photo }), // send { photo: "picX.jpeg" }
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to update photo");
      }

      const data = await res.json();
      setProfile((prev) => ({ ...prev, photo: data.photo }));
    } catch (err) {
      console.error("Photo update error:", err.message);
    }
  };

  return (
    <div className="Settings">
      <HeaderBar
        title="Settings"
        onHamburger={() => setMenuOpen(true)}
        onLogo={() => navigate("/")}
      />

      <div className="settings-content">
        <h1>Settings</h1>

        <h4>Profile Picture:</h4>
        <h5>Select one of the images below</h5>

        <div className="photo-selection">
          {[...Array(10)].map((_, i) => {
            const photo = `pic${i + 1}.jpeg`;
            return (
              <img
                key={photo}
                src={`${process.env.PUBLIC_URL}/profile-pics/${photo}`}
                alt={`Photo ${i + 1}`}
                className={`profile-photo ${selectedPhoto === photo ? "selected" : ""}`}
                onClick={() => handlePhotoClick(photo)}
              />
            );
          })}
        </div>

        <h4>Profile:</h4>
        {settingsOptions.map((option) => (
          <label key={option}>
            <h5>{option}</h5>
            <input
              name={option}
              value={
                option === "goals"
                  ? (profile.goals || []).map((g) => g.title).join(", ")
                  : profile[option] || ""
              }
              readOnly
            />
            <button
              className="edit-button"
              onClick={() =>
                navigate(`/settings/${option}`, {
                  state: { userId: profile.id || userId },
                })
              }
            >
              Edit
            </button>
          </label>
        ))}

        <h4>Other:</h4>
        <div className="button-row">
          <button
            className="action-button"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("userId");
              navigate("/");
            }}
          >
            Log Out
          </button>

          <button
            className="action-button"
            onClick={() => setConfirmOpen(true)}
          >
            Delete Account
          </button>
        </div>
      </div>

      <BottomNav />

      {menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} />}
      {confirmOpen && (
        <DeleteConfirmOverlay
          onClose={() => setConfirmOpen(false)}
          onConfirm={async () => {
            const token = localStorage.getItem("token");
            await fetch(`${API_BASE}/api/settings/account`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            });
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            navigate("/login");
          }}
        />
      )}
    </div>
  );
};

export default Settings;
