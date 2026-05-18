import { createContext, useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import { defaultSiteSettings } from "./data";

const SiteSettingsContext = createContext({ settings: defaultSiteSettings, loaded: false });

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaultSiteSettings);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    let firestoreResponded = false;
    
    // Safety timeout: if Firestore doesn't respond within 3 seconds, render with defaults
    const timeoutId = setTimeout(() => {
      if (active && !firestoreResponded) {
        console.warn("Firestore timeout: rendering with default settings");
        setLoaded(true);
      }
    }, 3000);

    const unsubscribe = onSnapshot(
      doc(db, "portfolio", "site-settings"),
      (snap) => {
        if (!active) return;
        firestoreResponded = true;
        if (snap.exists()) {
          setSettings({ ...defaultSiteSettings, ...snap.data() });
        } else {
          setSettings(defaultSiteSettings);
        }
        setLoaded(true);
        clearTimeout(timeoutId);
      },
      (err) => {
        if (!active) return;
        firestoreResponded = true;
        console.error("Failed to load site settings:", err);
        setLoaded(true);
        clearTimeout(timeoutId);
      }
    );
    return () => {
      active = false;
      clearTimeout(timeoutId);
      unsubscribe();
    };
  }, []);

  if (!loaded) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "rgba(255,255,255,.75)",
          background: "#0b1020",
        }}
      >
        Loading portfolio settings...
      </div>
    );
  }

  return (
    <SiteSettingsContext.Provider value={{ settings, loaded }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
