import { useEffect, useRef, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";



function ProjectCard({ project }) {
  const handleInProgress = (e) => {
    e.preventDefault();
    alert("🚧 This project is currently under development. Check back soon!");
  };

  return (
    <div className="project-card">
      <div className="project-image-container">
        <img
          src={project.imageUrl || project.image || ""}
          alt={project.title}
          className="project-image"
          onError={(e) => { e.target.style.display = "none"; }}
        />
        {project.status === "in-progress" && (
          <span className="status-badge in-progress">In Progress</span>
        )}
      </div>
      <div className="project-content">
        <h3 className="project-title">{project.title}</h3>
        <p className="project-description">{project.description}</p>
        <p className="project-tech">{project.tech}</p>

        {project.features?.length > 0 && (
          <div style={{ marginBottom: "1rem" }}>
            <strong style={{ fontSize: ".875rem", color: "#6b7280" }}>Features:</strong>
            <ul style={{ paddingLeft: "1.25rem", marginTop: "0.5rem" }}>
              {project.features.map((f, i) => (
                <li key={i} style={{ marginBottom: "0.25rem", fontSize: "0.875rem", color: "#6b7280" }}>{f}</li>
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
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);

  // Animate on scroll
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

  // Load from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "portfolio"),
      (snap) => {
        const docs = {};
        snap.forEach((d) => { docs[d.id] = d.data(); });

        const loaded = Array.from({ length: 6 }, (_, i) => {
          const id = `project-${i + 1}`;
          const data = docs[id];
          return data?.title ? { slotNum: i + 1, ...data } : null;
        }).filter((p) => p !== null);

        setProjects(loaded);
        setLoading(false);
      },
      (err) => {
        console.warn("Firestore unavailable:", err.message);
        setProjects([]);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  return (
    <section id="projects" className="section-hidden" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title">My Projects</h2>

        {loading ? (
          <div className="projects-grid">
            {Array(6).fill(null).map((_, i) => (
              <div key={i} className="project-card" style={{ minHeight: 300, opacity: .4 }}>
                <div style={{ height: 200, background: "#e5e7eb", borderRadius: ".75rem .75rem 0 0" }} />
                <div style={{ padding: "1.25rem" }}>
                  <div style={{ height: 18, background: "#e5e7eb", borderRadius: 4, marginBottom: 12, width: "70%" }} />
                  <div style={{ height: 12, background: "#f3f4f6", borderRadius: 4, marginBottom: 8 }} />
                  <div style={{ height: 12, background: "#f3f4f6", borderRadius: 4, width: "80%" }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map((project, i) => (
              <ProjectCard key={project.slotNum || i} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
