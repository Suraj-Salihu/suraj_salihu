import { useEffect, useRef, useState } from "react";
import Slideshow from "./Slideshow";
import { supabase } from "../supabaseClient";
import { designWorks } from "../data";

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

  useEffect(() => {
    const loadDesigns = async () => {
      const { data, error } = await supabase
        .from("portfolio")
        .select("id, data")
        .like("id", "design-%");

      if (error) {
        console.warn("Supabase design works load failed:", error.message);
        setDesigns(designWorks);
        setError(true);
        return;
      }

      const grouped = DESIGN_CATEGORIES.reduce((acc, cat) => {
        acc[cat] = [];
        return acc;
      }, {});

      (data || []).forEach((row) => {
        const [, category, slot] = row.id.split("-");
        if (!grouped[category]) return;

        grouped[category].push({
          src: row.data?.imageUrl || row.data?.src || "",
          caption: row.data?.caption || CATEGORY_LABELS[category],
          slotNum: Number(slot),
        });
      });

      Object.values(grouped).forEach((slides) => {
        slides.sort((a, b) => a.slotNum - b.slotNum);
      });

      setDesigns(grouped);
    };

    loadDesigns();
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
