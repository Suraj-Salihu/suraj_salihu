import { useEffect, useRef } from "react";
import { useSiteSettings } from "../siteSettingsContext";

export default function About() {
  const { settings } = useSiteSettings();
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
          {settings.profileImageUrl && (
            <div
              className="profile-img"
              style={{ backgroundImage: `url(${settings.profileImageUrl})` }}
            />
          )}
          <div className="about-text">
            {settings.aboutParagraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
            <div className="badges">
              {settings.aboutBadges.map((badge) => (
                <span className="badge" key={badge}>{badge}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
