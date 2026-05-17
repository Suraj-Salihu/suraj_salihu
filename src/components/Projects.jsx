import { useEffect, useRef } from "react";
import { projectsData } from "../data";

function ProjectCard({ project }) {
  const handleInProgress = (e) => {
    e.preventDefault();
    alert("🚧 This project is currently under development. Check back soon! 🚧");
  };

  return (
    <div className="project-card">
      <div className="project-image-container">
        <img src={project.image} alt={project.title} className="project-image" />
        {project.status === "in-progress" && (
          <span className="status-badge in-progress">In Progress</span>
        )}
      </div>
      <div className="project-content">
        <h3 className="project-title">{project.title}</h3>
        <p className="project-description">{project.description}</p>
        <p className="project-tech">{project.tech}</p>

        {project.features && (
          <div className="project-features" style={{ marginBottom: "1rem" }}>
            <strong>Features:</strong>
            <ul style={{ paddingLeft: "1.25rem", marginTop: "0.5rem" }}>
              {project.features.map((f, i) => (
                <li key={i} style={{ marginBottom: "0.25rem", fontSize: "0.875rem", color: "#6b7280" }}>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        )}

        {project.backend && (
          <div className="backend-details">
            <strong>Backend Highlights:</strong> {project.backend}
          </div>
        )}

        <div className="project-buttons">
          <a
            href={project.demoLink}
            className="btn btn-primary btn-sm"
            onClick={project.status === "in-progress" ? handleInProgress : undefined}
            target={project.demoLink !== "#" ? "_blank" : undefined}
            rel="noreferrer"
          >
            View Demo
          </a>
          <a
            href={project.codeLink}
            className="btn btn-outline btn-sm"
            onClick={project.status === "in-progress" ? handleInProgress : undefined}
            target={project.codeLink !== "#" ? "_blank" : undefined}
            rel="noreferrer"
          >
            View Code
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove("section-hidden");
          entry.target.classList.add("animate-fade-in");
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="projects" className="section-hidden" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title">My Projects</h2>
        <div className="projects-grid">
          {projectsData.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
