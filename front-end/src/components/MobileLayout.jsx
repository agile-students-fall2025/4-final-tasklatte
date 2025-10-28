import { useState } from "react";
import HeaderBar from "./HeaderBar.jsx";
import BottomNav from "./BottomNav.jsx";
import MenuOverlay from "./MenuOverlay.jsx";
import "./MobileLayout.css";

export default function MobileLayout({
  title = "Title",
  children,
  showBottomNav = true,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="ml-root">
      <HeaderBar title={title} onHamburger={() => setMenuOpen(true)} />

      <main className="ml-scroll">{children}</main>

      {showBottomNav && <BottomNav />}

      {menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} />}
    </div>
  );
}
