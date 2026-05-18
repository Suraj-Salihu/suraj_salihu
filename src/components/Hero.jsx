import { useSiteSettings } from "../siteSettingsContext";

export default function Hero() {
  const { settings } = useSiteSettings();
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 60, behavior: "smooth" });
  };

  const heroBackground = settings.coverImageUrl || "";

  return (
    <section
      id="home"
      className="hero"
      style={{
        backgroundImage: heroBackground ? `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('${heroBackground}')` : "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7))",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="hero-content">
        <h1>{settings.heroTitle}</h1>
        <h2>{settings.heroSubtitle}</h2>
        <div className="hero-buttons">
          <button
            className="btn btn-primary"
            onClick={() => scrollTo("projects")}
          >
            View My Work
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => scrollTo("contact")}
          >
            Contact Me
          </button>
        </div>
      </div>
    </section>
  );
}
