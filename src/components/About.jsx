import { useEffect, useRef } from "react";

export default function About() {
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
    <section id="about" className="section-hidden" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title">About Me</h2>
        <div className="about-content">
          <div className="profile-img" />
          <div className="about-text">
            <p>
              Hello! I'm Suraj Salihu, a full-stack developer with expertise in both frontend and
              backend technologies. I specialize in building scalable web applications with robust
              APIs and efficient databases. With 5 years of experience across the stack, I bridge
              the gap between beautiful interfaces and powerful server-side functionality.
            </p>
            <p>
              My backend expertise includes designing RESTful APIs, optimizing database queries,
              implementing authentication systems, and deploying cloud infrastructure. I'm proficient
              in Node.js, Python, and Java backends, with experience in both SQL and NoSQL databases.
            </p>
            <div className="badges">
              <span className="badge">Full-Stack Development</span>
              <span className="badge backend-badge">Backend Specialist</span>
              <span className="badge">Cloud Architecture</span>
              <span className="badge">API Design</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
