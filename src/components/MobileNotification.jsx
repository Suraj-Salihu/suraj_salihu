import { useState, useEffect } from "react";

export default function MobileNotification() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("desktopPromptDismissed") === "true";
    if (!dismissed && window.innerWidth <= 768) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 15000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSwitch = () => {
    const metaViewport = document.querySelector('meta[name="viewport"]');
    if (metaViewport) metaViewport.content = "width=1200";
    setVisible(false);
    localStorage.setItem("desktopPromptDismissed", "true");
    alert("Desktop view activated. For best results, try on an actual desktop computer.");
  };

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem("desktopPromptDismissed", "true");
  };

  if (!visible) return null;

  return (
    <div className="mobile-notification show">
      <div className="notification-content">
        <p>For the full experience with all features, would you like to switch to desktop view?</p>
        <div className="notification-actions">
          <button className="btn-notification btn-yes" onClick={handleSwitch}>Yes</button>
          <button className="btn-notification btn-no" onClick={handleDismiss}>No</button>
        </div>
      </div>
    </div>
  );
}
