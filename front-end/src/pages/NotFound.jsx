import { useNavigate } from "react-router-dom";
import HeaderBar from "../components/HeaderBar.jsx";
import BottomNav from "../components/BottomNav.jsx";
import MenuOverlay from "../components/MenuOverlay.jsx";
import { useState } from "react";
import "./NotFound.css";

export default function NotFound() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="page notfound-page">
      <HeaderBar title="" onHamburger={() => setMenuOpen(true)} onLogo={() => navigate("/")} />

      <main className="notfound-content">
        <h1>404 Not Found</h1>
        <p>Sorry — the page you're looking for doesn't exist.</p>
        <div className="notfound-actions">
          <button className="pixel-button" onClick={() => navigate(-1)}>Go Back</button>
          <button className="pixel-button" onClick={() => navigate("/")}>Home</button>
        </div>
      </main>

      <BottomNav />
      {menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} />}
    </div>
  );
}
