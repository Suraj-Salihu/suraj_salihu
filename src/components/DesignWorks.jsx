import { useEffect, useRef } from "react";
import { designWorks } from "../data";
import Slideshow from "./Slideshow";

const categories = [
  { key: "birthday", label: "Birthday Designs" },
  { key: "advert", label: "Advert Designs" },
  { key: "song", label: "Song Covers" },
  { key: "invitation", label: "Invitation Designs" },
  { key: "logo", label: "Logo Designs" },
  { key: "other", label: "Other Designs" },
];

export default function DesignWorks() {
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
    <section id="design" className="section-hidden design-section" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title">Graphic Design Works</h2>
        <div className="design-grid">
          {categories.map(({ key, label }) => (
            <div className="design-category" key={key}>
              <h3 className="design-category-title">{label}</h3>
              <Slideshow slides={designWorks[key]} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
