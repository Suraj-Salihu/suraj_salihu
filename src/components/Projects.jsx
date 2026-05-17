import { useEffect, useRef, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

// Fallback static data (used if Firestore is empty or offline)
const FALLBACK = [
  { slotNum: 1, title: "JK Clothing - WhatsApp Commerce", description: "Lightweight e-commerce site for fashion products with 1-click WhatsApp ordering.", tech: "HTML5, CSS3, JavaScript, WhatsApp API", features: ["WhatsApp order automation", "LocalStorage cart persistence", "Mobile-first responsive design"], demoLink: "https://jk-fashion.netlify.app/", codeLink: "https://github.com/Suraj-Salihu/e-commerce-website-jk-closet/tree/main", imageUrl: "/images/jk-fashion.jpg", status: "" },
  { slotNum: 2, title: "Sovex Task Master", description: "Progressive Web App for task management with offline capabilities.", tech: "HTML5, CSS3, JavaScript, PWA", features: ["Installable PWA", "Priority-based tasks", "Offline support"], demoLink: "https://suraj-salihu.github.io/Task-Manager-PWA/", codeLink: "https://github.com/Suraj-Salihu/Task-Manager-PWA/tree/main", imageUrl: "/images/task-Master.png", status: "" },
  { slotNum: 3, title: "BL4MELESS Artist Portfolio", description: "Professional music artist website showcasing discography and streaming links.", tech: "HTML5, CSS3, JavaScript", features: ["Music player", "Streaming links", "Responsive gallery"], demoLink: "https://bl4meless.netlify.app", codeLink: "https://github.com/Suraj-Salihu/singer-website/blob/main/index.html", imageUrl: "/images/bl4meless-screenshot.jpg", status: "" },
  { slotNum: 4, title: "The Movement (Tafiyar Matasa)", description: "Official website for a Nigerian youth empowerment movement.", tech: "HTML5, CSS3, JavaScript, EmailJS", features: [], demoLink: "#", codeLink: "#", imageUrl: "/images/TMLogo.png", status: "" },
  { slotNum: 5, title: "VTU Website", description: "Mobile-first virtual top-up platform for airtime, data, and bill payments.", tech: "HTML5, CSS3, JavaScript, FontAwesome", features: [], demoLink: "#", codeLink: "#", imageUrl: "/images/vtu-screenshot.jpg", status: "" },
  { slotNum: 6, title: "API Service", description: "High-performance REST API with caching and rate limiting.", tech: "Node.js, Redis, MongoDB, Docker", features: [], demoLink: "#", codeLink: "#", imageUrl: "/images/carbon.png", status: "in-progress", backend: "JWT auth, Redis caching, API docs" },
];

function ProjectCard({ project }) {
  const handleInProgress = (e) => {
    e.preventDefault();
    alert("🚧 This project is currently under development. Check back soon!");
  };

  return (
    <div className="project-card">
      <div className="project-image-container">
        <img
          src={project.imageUrl || project.image || "/images/placeholder.jpg"}
          alt={project.title}
          className="project-image"
          onError={(e) => { e.target.src = "/images/TMLogo.png"; }}
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
    (async () => {
      try {
        const snap = await getDocs(collection(db, "portfolio"));
        const docs  = {};
        snap.forEach((d) => { docs[d.id] = d.data(); });

        const loaded = Array.from({ length: 6 }, (_, i) => {
          const id   = `project-${i + 1}`;
          const data = docs[id];
          // If Firestore doc exists and has a title, use it; otherwise use fallback
          return data?.title ? { slotNum: i + 1, ...data } : FALLBACK[i];
        }).filter((p) => p.title); // skip empty slots

        setProjects(loaded.length > 0 ? loaded : FALLBACK);
      } catch (err) {
        console.warn("Firestore unavailable, using fallback data:", err.message);
        setProjects(FALLBACK);
      } finally {
        setLoading(false);
      }
    })();
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
