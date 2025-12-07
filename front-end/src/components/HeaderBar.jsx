import "./HeaderBar.css";
import logo from './logo.png';

export default function HeaderBar({ title = "Page Title", onHamburger, onLogo }) {
  return (
    <header className="header-bar">
      <button className="hamburger" onClick={onHamburger} aria-label="Open menu">
        <span /><span /><span />
      </button>
      <h1 className="header-title">{title}</h1>
      <img src={logo} alt="Logo" className="logo" />
    </header>
  );
}
