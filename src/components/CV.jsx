import { useEffect, useRef } from "react";
import { useSiteSettings } from "../siteSettingsContext";

export default function CV() {
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
    <section id="cv" className="section-hidden" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title">Curriculum Vitae</h2>
        <div className="cv-content">

          {/* Profile */}
          <div className="cv-section">
            <h3>Profile</h3>
            <p>{settings.cvProfile}</p>
          </div>

          {/* Work Experience */}
          <div className="cv-section">
            <h3>Work Experience</h3>

            <div className="cv-entry">
              <h4>Freelance Full Stack Developer</h4>
              <p><em>Remote — 2020 – Present</em></p>
              <ul>
                <li>Worked with clients worldwide on web and mobile development projects.</li>
                <li>Built responsive websites, Progressive Web Apps, and backend systems using HTML, CSS, JavaScript, PHP, and Python.</li>
                <li>Delivered clean UI/UX designs and ensured cross-device compatibility.</li>
                <li>Projects range from e-commerce platforms to custom business tools.</li>
              </ul>
            </div>

            <div className="cv-entry">
              <h4>Freelance Graphic Designer</h4>
              <p><em>Remote — 2018 – Present</em></p>
              <ul>
                <li>Designed logos, flyers, social media posts, banners, and brand assets for clients across different industries.</li>
                <li>Worked with CorelDRAW, Photoshop, and AI-powered design platforms to deliver high-quality content.</li>
                <li>Successfully completed projects for individuals, businesses, and organizations worldwide.</li>
              </ul>
            </div>

            <div className="cv-entry">
              <h4>SOVEX Technologies</h4>
              <p><em>Remote — 2023 – Present</em></p>
              <ul>
                <li>Established SOVEX to deliver creative and technical solutions in web development, app building, and AI-based design.</li>
                <li>Currently building personal and client-driven tools, websites, and mobile-ready interfaces.</li>
              </ul>
            </div>
          </div>

          {/* Education */}
          <div className="cv-section">
            <h3>Education</h3>

            <div className="cv-entry">
              <h4>Website Design and Development</h4>
              <p><em>Bright Information Technology Academy — 2021 – 2024</em></p>
              <p><strong>Grade:</strong> Upper Credit</p>
            </div>

            <div className="cv-entry">
              <h4>Bachelor of Science in Mathematics</h4>
              <p><em>Sa'adu Zungur University, Gadau — 2020 – 2025</em></p>
              <p><strong>GPA:</strong> 3.38</p>
            </div>
          </div>

          {/* Skills */}
          <div className="cv-section">
            <h3>Skills</h3>
            <ul>
              <li>Frontend: HTML, CSS, JavaScript, Tailwind CSS</li>
              <li>Backend: PHP, MySQL, API Integration</li>
              <li>Mobile App: PWA, Kivy (Python)</li>
              <li>AI &amp; Machine Learning (Python)</li>
              <li>Tools: GitHub, VS Code, Git, Figma, Canva</li>
              <li>Graphic Design: CorelDRAW, Photoshop, AI-based tools</li>
            </ul>
          </div>

          {/* Languages */}
          <div className="cv-section">
            <h3>Languages</h3>
            <ul>
              <li>English — Fluent</li>
              <li>Hausa — Native</li>
              <li>Arabic — Intermediate</li>
            </ul>
          </div>

          {/* Reference */}
          <div className="cv-section">
            <h3>Reference</h3>
            <p><strong>Name:</strong> Aminu Babayo Shehu</p>
            <p><strong>Title:</strong> KDN / CEO</p>
            <p><strong>Phone:</strong> +234 907 474 8664</p>
            <p><strong>Email:</strong> absheikh@gmail.com</p>
          </div>

          {/* Contact Info */}
          <div className="cv-section">
            <h3>Contact Information</h3>
            <p><strong>Name:</strong> Suraj Salihu</p>
            <p><strong>Phone:</strong> +234 903 130 0454</p>
            <p><strong>Email:</strong> soorajsalihu@gmail.com</p>
            <p><strong>Location:</strong> No. 16 Alkali Musa Street, Zawiyya Azare</p>
            <p>
              <strong>GitHub:</strong>{" "}
              <a href="https://github.com/Suraj-Salihu" target="_blank" rel="noreferrer">
                github.com/Suraj-Salihu
              </a>
            </p>
          </div>

          {/* Download */}
          <div className="cv-download">
            <a
              href={settings.cvDownloadUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary"
            >
              {settings.cvDownloadLabel}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
