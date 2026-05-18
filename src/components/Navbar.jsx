import { useState } from "react";

const navLinks = ["home", "about", "skills", "projects", "design", "cv", "contact"];

export default function Navbar({ darkMode, setDarkMode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = (id) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.offsetTop - 60, behavior: "smooth" });
    }
  };

  return (
    <nav>
      <div className="nav-container">
        <a href="#" className="logo" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
          𝐒𝐔𝐑𝐀𝐉 𝐒𝐀𝐋𝐈𝐇𝐔
        </a>

        {/* Desktop Links */}
        <div className="nav-links">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link}`}
              className="nav-link"
              onClick={(e) => { e.preventDefault(); handleNavClick(link); }}
            >
              {link.charAt(0).toUpperCase() + link.slice(1)}
            </a>
          ))}
          <button
            className="theme-toggle"
            aria-label="Toggle dark mode"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="mobile-menu-button"
          aria-label="Toggle menu"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu${mobileOpen ? " active" : ""}`}>
        <div className="mobile-menu-links">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link}`}
              className="nav-link"
              onClick={(e) => { e.preventDefault(); handleNavClick(link); }}
            >
              {link.charAt(0).toUpperCase() + link.slice(1)}
            </a>
          ))}
          <div className="mobile-theme-toggle">
            <span>Dark Mode</span>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>
    </nav>
  );
}
