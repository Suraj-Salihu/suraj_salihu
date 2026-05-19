import { createContext, useContext, useEffect, useState } from "react";
import { defaultSiteSettings } from "./data";
import { supabase } from "./supabaseClient";

const SiteSettingsContext = createContext({ settings: defaultSiteSettings, loaded: false });

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaultSiteSettings);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;

    const loadSettings = async () => {
      const { data, error } = await supabase
        .from("portfolio")
        .select("data")
        .eq("id", "site-settings")
        .single();

      if (!active) return;

      if (error) {
        console.warn("Supabase site settings load failed:", error.message);
        setSettings(defaultSiteSettings);
      } else {
        setSettings({ ...defaultSiteSettings, ...(data?.data || {}) });
      }
      setLoaded(true);
    };

    loadSettings();
    return () => {
      active = false;
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
