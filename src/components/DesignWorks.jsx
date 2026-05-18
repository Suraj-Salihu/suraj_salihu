import { useEffect, useRef, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import Slideshow from "./Slideshow";

const DESIGN_CATEGORIES = ["birthday", "advert", "song", "invitation", "logo", "other"];
const CATEGORY_LABELS   = {
  birthday:   "Birthday Designs",
  advert:     "Advert Designs",
  song:       "Song Covers",
  invitation: "Invitation Designs",
  logo:       "Logo Designs",
  other:      "Other Designs",
};
const CATEGORY_PATHS = {
  birthday: "birthday", advert: "advert", song: "song",
  invitation: "iv", logo: "logos", other: "other",
};



export default function DesignWorks() {
  const sectionRef              = useRef(null);
  const [designs, setDesigns]   = useState(null); // null = loading
  const [error,   setError]     = useState(false);

  // Scroll animation
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

        const loaded = Object.fromEntries(
          DESIGN_CATEGORIES.map((cat) => {
            const slides = Array.from({ length: 6 }, (_, i) => {
              const id = `design-${cat}-${i + 1}`;
              const data = docs[id];
              if (data?.imageUrl) {
                return { src: data.imageUrl, caption: data.caption || `${CATEGORY_LABELS[cat]} ${i + 1}` };
              }
              return null;
            }).filter((s) => s !== null);
            return [cat, slides];
          })
        );
        setDesigns(loaded);
      },
      (err) => {
        console.warn("Firestore unavailable:", err.message);
        setDesigns(Object.fromEntries(DESIGN_CATEGORIES.map((cat) => [cat, []])));
        setError(true);
      }
    );

    return unsubscribe;
  }, []);

  return (
    <section id="design" className="section-hidden design-section" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title">Graphic Design Works</h2>

        {designs === null ? (
          // Loading skeleton
          <div className="design-grid">
            {DESIGN_CATEGORIES.map((cat) => (
              <div key={cat} className="design-category" style={{ opacity: .4 }}>
                <div className="design-category-title">{CATEGORY_LABELS[cat]}</div>
                <div style={{ height: 200, background: "#e5e7eb", borderRadius: 8 }} />
              </div>
            ))}
          </div>
        ) : (
          <div className="design-grid">
            {DESIGN_CATEGORIES.map((cat) => (
              <div key={cat} className="design-category">
                <h3 className="design-category-title">{CATEGORY_LABELS[cat]}</h3>
                <Slideshow slides={designs[cat]} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
