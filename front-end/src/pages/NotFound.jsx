import { useNavigate } from "react-router-dom";
import HeaderBar from "../components/HeaderBar.jsx";
import BottomNav from "../components/BottomNav.jsx";
import MenuOverlay from "../components/MenuOverlay.jsx";
import { useState } from "react";
import "./NotFound.css";

export default function NotFound() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const isLoggedIn = !!localStorage.getItem("token");


  return (
    <div className={`page notfound-page ${isLoggedIn ? "nf-logged-in" : "nf-logged-out"}`}>
      <HeaderBar 
        title=""
        onHamburger={isLoggedIn ? () => setMenuOpen(true) : null}
        onLogo={() => navigate("/")} />
      <main className="notfound-content">
        <h1>404 Not Found</h1>

        {/* If logged in version */}
        {isLoggedIn ? (
          <>
            <p>You’re logged in, but this page does not exist.</p>
            <div className="notfound-actions">
              <button className="pixel-button" onClick={() => navigate(-1)}>Go Back</button>
              <button className="pixel-button" onClick={() => navigate("/dashboard")}>
                Go to Dashboard
              </button>
            </div>
          </>
        ) : (
          /* Logged out version */
          <>
            <p>Sorry — the page you're looking for doesn't exist.</p>
            <div className="notfound-actions">
              <button className="pixel-button" onClick={() => navigate(-1)}>Go Back</button>
              <button className="pixel-button" onClick={() => navigate("/login")}>Login</button>
              <button className="pixel-button" onClick={() => navigate("/register")}>Register</button>
            </div>
          </>
        )}
      </main>

      {isLoggedIn && <BottomNav />}
      {menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} />}
    </div>
  );
}
