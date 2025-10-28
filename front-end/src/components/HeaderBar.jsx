// src/components/HeaderBar.jsx
import "./HeaderBar.css";

export default function HeaderBar({ title = "Page Title", onHamburger, onLogo }) {
  return (
    <header className="header-bar">
      <button className="hamburger" onClick={onHamburger} aria-label="Open menu">
        <span /><span /><span />
      </button>
      <h1 className="header-title">{title}</h1>
      <button className="header-logo" onClick={onLogo} aria-label="Logo">Logo</button>
    </header>
  );
}
