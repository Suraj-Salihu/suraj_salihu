export default function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-info">
          <h3>Suraj Salihu</h3>
          <p>Creating digital experiences that matter.</p>
        </div>
        <div className="social-links">
          <a
            href="https://github.com/Suraj-Salihu"
            className="social-link"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/suraj-salihu-03813b359"
            className="social-link"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
          <a
            href="https://www.instagram.com/suraj_salihu1"
            className="social-link"
            target="_blank"
            rel="noreferrer"
          >
            Instagram
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Suraj Salihu. All rights reserved.</p>
      </div>
    </footer>
  );
}
