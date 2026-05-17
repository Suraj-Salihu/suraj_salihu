import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import DesignWorks from "./components/DesignWorks";
import CV from "./components/CV";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import MobileNotification from "./components/MobileNotification";
import AdminPage from "./AdminPage";

// Simple hash-based routing — no react-router needed
function useRoute() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    const handler = () => setPath(window.location.pathname);
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);
  return path;
}

function App() {
  const path = useRoute();

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Admin route — reset body so portfolio's global nav/CSS doesn't interfere
  if (path === "/admin") {
    document.body.style.overflow = "hidden";
    document.body.style.background = "#0d0d14";
    document.body.classList.remove("dark");
    return <AdminPage />;
  }

  // Restore body for portfolio
  document.body.style.overflow = "";
  document.body.style.background = "";

  // Main portfolio
  return (
    <div className={darkMode ? "dark" : ""}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <DesignWorks />
      <CV />
      <Contact />
      <Footer />
      <MobileNotification />
    </div>
  );
}

export default App;
