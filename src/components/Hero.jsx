export default function Hero() {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 60, behavior: "smooth" });
  };

  return (
    <section id="home" className="hero">
      <div className="hero-content">
        <h1>Suraj</h1>
        <h2>Full-Stack Developer | Graphics Designer</h2>
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
