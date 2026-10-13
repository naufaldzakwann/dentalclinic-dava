"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { translate, type Language } from "@/lib/i18n";
import { isClinicLocationId, type ClinicLocationId } from "@/lib/site";
import { MoonIcon, SunIcon } from "@/components/icons";

type Theme = "light" | "dark";

type SitePreferencesValue = {
  clinicLocationId: ClinicLocationId | null;
  language: Language;
  theme: Theme;
  setClinicLocationId: (value: ClinicLocationId | null) => void;
  setLanguage: (value: Language) => void;
  toggleTheme: () => void;
  t: (id: string, fallback: string) => string;
};

const SitePreferencesContext = createContext<SitePreferencesValue | null>(null);

export function SitePreferencesProvider({ children }: { children: React.ReactNode }) {
  const [clinicLocationId, setClinicLocationId] = useState<ClinicLocationId | null>(null);
  const [language, setLanguage] = useState<Language>("id");
  const [theme, setTheme] = useState<Theme>("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const savedLocation = window.localStorage.getItem("dava:clinic");
      const savedLanguage = window.localStorage.getItem("dava:language");
      const savedTheme = window.localStorage.getItem("dava:theme");
      if (isClinicLocationId(savedLocation)) setClinicLocationId(savedLocation);
      if (savedLanguage === "id" || savedLanguage === "en") setLanguage(savedLanguage);
      if (savedTheme === "light" || savedTheme === "dark") setTheme(savedTheme);
    } catch {
      // Preferences remain usable when browser storage is unavailable.
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.dataset.theme = theme;
    document.documentElement.lang = language;
    try {
      window.localStorage.setItem("dava:theme", theme);
      window.localStorage.setItem("dava:language", language);
      if (clinicLocationId) window.localStorage.setItem("dava:clinic", clinicLocationId);
      else window.localStorage.removeItem("dava:clinic");
    } catch {
      // The current page state still works without persistent storage.
    }
  }, [clinicLocationId, language, ready, theme]);

  const value = useMemo<SitePreferencesValue>(
    () => ({
      clinicLocationId,
      language,
      theme,
      setClinicLocationId,
      setLanguage,
      toggleTheme: () => setTheme((current) => (current === "dark" ? "light" : "dark")),
      t: (id, fallback) => translate(language, id, fallback),
    }),
    [clinicLocationId, language, theme],
  );

  return <SitePreferencesContext.Provider value={value}>{children}</SitePreferencesContext.Provider>;
}

export function useSitePreferences() {
  const value = useContext(SitePreferencesContext);
  if (!value) throw new Error("Site preferences must be used inside SitePreferencesProvider");
  return value;
}

export function T({ id, fallback }: { id: string; fallback: string }) {
  const { t } = useSitePreferences();
  return <>{t(id, fallback)}</>;
}

export function ThemeToggle() {
  const { theme, toggleTheme, t } = useSitePreferences();
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={t(isDark ? "controls.themeLight" : "controls.themeDark", isDark ? "Ganti ke tema terang" : "Ganti ke tema gelap")}
      aria-pressed={isDark}
      className="grid h-10 w-10 place-items-center rounded-full border border-brand-200 bg-white text-brand-800 shadow-sm transition hover:border-brand-400 hover:bg-brand-50"
    >
      {isDark ? <SunIcon width={17} height={17} /> : <MoonIcon width={17} height={17} />}
    </button>
  );
}

export function LanguageToggle() {
  const { language, setLanguage, t } = useSitePreferences();
  return (
    <div className="inline-flex h-10 items-center rounded-full border border-brand-200 bg-white p-1 shadow-sm" role="group" aria-label={t("controls.language", "Bahasa")}>
      {(["id", "en"] as const).map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={language === option}
          onClick={() => setLanguage(option)}
          className={`h-8 min-w-9 rounded-full px-2 text-[11px] font-bold transition ${language === option ? "bg-brand-600 text-white" : "text-ink-soft hover:bg-brand-50 hover:text-brand-800"}`}
        >
          {option.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
