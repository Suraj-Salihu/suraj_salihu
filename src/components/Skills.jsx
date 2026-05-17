import { useEffect, useRef } from "react";
import { skillsData } from "../data";

export default function Skills() {
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
    <section id="skills" className="section-hidden bg-gray-100" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title">Skills &amp; Tools</h2>
        <div className="skills-grid">
          {skillsData.map((skill) => (
            <div className="skill-card" key={skill.name}>
              <span className="skill-icon" style={{ color: skill.color }}>
                {skill.icon}
              </span>
              <span>{skill.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
