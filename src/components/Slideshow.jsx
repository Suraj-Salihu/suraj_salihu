import { useState, useRef } from "react";

export default function Slideshow({ slides }) {
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
    if (next >= slides.length) next = 0;
    if (next < 0) next = slides.length - 1;
    goTo(next);
  };

  return (
    <div>
      <div className="slideshow-container">
        <div className="slideshow" ref={slideshowRef}>
          {slides.map((slide, i) => (
            <div className="slide" key={i}>
              <img src={slide.src} alt={slide.caption} />
              <div className="slide-caption">{slide.caption}</div>
            </div>
          ))}
        </div>
        <button className="slideshow-arrow prev" onClick={() => move(-1)}>❮</button>
        <button className="slideshow-arrow next" onClick={() => move(1)}>❯</button>
      </div>
      <div className="slideshow-nav">
        {slides.map((_, i) => (
          <button
            key={i}
            className={i === current ? "active" : ""}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  );
}
