import { NavLink } from "react-router-dom";
import "./MenuOverlay.css";

export default function MenuOverlay({ onClose }) {
  return (
    <div className="menu-overlay" onClick={onClose}>
      <div
        className="menu-panel"
        onClick={(e) => e.stopPropagation()} // 阻止冒泡
      >
        <nav className="menu-links">
          <NavLink to="/" className="menu-link" onClick={onClose}>
            Home
          </NavLink>
          <NavLink to="/all" className="menu-link" onClick={onClose}>
            All Tasks
          </NavLink>
          <NavLink to="/account" className="menu-link" onClick={onClose}>
            Account
          </NavLink>
          <NavLink to="/settings" className="menu-link" onClick={onClose}>
            Settings
          </NavLink>
        </nav>
      </div>
    </div>
  );
}
