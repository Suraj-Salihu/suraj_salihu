import { useSiteSettings } from "../siteSettingsContext";

export default function Footer() {
  const { settings } = useSiteSettings();

  return (
    <footer>
      <div className="footer-content">
        <div className="footer-info">
          <h3>{settings.footerName}</h3>
          <p>{settings.footerText}</p>
        </div>
        <div className="social-links">
          {settings.footerLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              className="social-link"
              target="_blank"
              rel="noreferrer"
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} {settings.footerName}. All rights reserved.</p>
      </div>
    </footer>
  );
}
