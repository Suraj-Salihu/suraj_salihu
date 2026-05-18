import { useState, useRef } from "react";

export default function Slideshow({ slides = [] }) {
  // Filter out any null/undefined slides
  const validSlides = slides.filter((s) => s && s.src);
  
  if (validSlides.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "2rem", color: "rgba(255,255,255,.5)" }}>
        No designs added yet.
      </div>
    );
  }

  const [current, setCurrent] = useState(0);
  const slideshowRef = useRef(null);

  const goTo = (index) => {
    setCurrent(index);
    const slideshow = slideshowRef.current;
    if (slideshow) {
      const slide = slideshow.children[index];
      if (slide) {
        slide.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
      }
    }
  };

  const move = (dir) => {
    let next = current + dir;
    if (next >= validSlides.length) next = 0;
    if (next < 0) next = validSlides.length - 1;
    goTo(next);
  };

  return (
    <div>
      <div className="slideshow-container">
        <div className="slideshow" ref={slideshowRef}>
          {validSlides.map((slide, i) => (
            <div className="slide" key={`slide-${slide.src}-${i}`}>
              <img src={slide.src} alt={slide.caption} />
              <div className="slide-caption">{slide.caption}</div>
            </div>
          ))}
        </div>
        <button className="slideshow-arrow prev" onClick={() => move(-1)}>❮</button>
        <button className="slideshow-arrow next" onClick={() => move(1)}>❯</button>
      </div>
      <div className="slideshow-nav">
        {validSlides.map((_, i) => (
          <button
            key={`nav-${i}`}
            className={i === current ? "active" : ""}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  );
}
