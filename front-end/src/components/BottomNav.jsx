import { NavLink } from "react-router-dom";
import "./BottomNav.css";

export default function BottomNav() {
  const cls = ({ isActive }) =>
    "bottom-nav-item" + (isActive ? " active" : "");

  return (
    <nav className="bottom-nav" aria-label="Bottom navigation">
      <NavLink to="/daily" end className={cls}>
        Daily Tasks
      </NavLink>
      <NavLink to="/calendar" className={cls}>
        Calendar
      </NavLink>
      <NavLink to="/AISuggestions" className={cls}>
        AI Suggestions
      </NavLink>
      <NavLink to="/profilePage" state={{userID:localStorage.getItem("userId")}} className={cls}>
        Profile
      </NavLink>
    </nav>
  );
}
