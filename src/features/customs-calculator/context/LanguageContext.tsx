import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import enTranslations from "../locales/en.json";
import ruTranslations from "../locales/ru.json";
import uzTranslations from "../locales/uz.json";

export type Language = "en" | "ru" | "uz";

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (keyPath: string, fallback?: any) => any;
}

const translations: Record<Language, any> = {
  en: enTranslations,
  ru: ruTranslations,
  uz: uzTranslations,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "customs_app_language";

export function getInitialLanguage(): Language {
  // 1. Stored user selection
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Language;
      if (saved === "en" || saved === "ru" || saved === "uz") {
        return saved;
      }
    } catch {
      // ignore
    }
  }

  // 2. Browser language detection
  if (typeof navigator !== "undefined") {
    const rawLangs = navigator.languages || [navigator.language];
    for (const raw of rawLangs) {
      if (!raw) continue;
      const lower = raw.toLowerCase();
      if (lower.startsWith("ru")) return "ru";
      if (lower.startsWith("uz")) return "uz";
      if (lower.startsWith("en")) return "en";
    }
  }

  // 3. Default to English
  return "en";
}

export const LanguageProvider: React.FC<{ children: ReactNode; language?: Language }> = ({
  children,
  language: controlledLanguage,
}) => {
  const [languageState, setLanguageState] = useState<Language>(
    controlledLanguage ?? getInitialLanguage,
  );
  const language = controlledLanguage ?? languageState;

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
    // Update HTML lang attribute
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  };

  useEffect(() => {
    if (controlledLanguage) setLanguageState(controlledLanguage);
  }, [controlledLanguage]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
    }
  }, [language]);

  const t = (keyPath: string, fallback?: any): any => {
    const resolve = (obj: any): any => {
      if (!obj || typeof obj !== "object") return undefined;

      // 1. Direct match on full keyPath
      if (keyPath in obj) return obj[keyPath];

      // 2. Section + subkey (handles cases like 'units' -> 'шт.' where subkey contains dots)
      const firstDot = keyPath.indexOf(".");
      if (firstDot > 0) {
        const section = keyPath.slice(0, firstDot);
        const subKey = keyPath.slice(firstDot + 1);
        if (obj[section] && typeof obj[section] === "object" && subKey in obj[section]) {
          return obj[section][subKey];
        }
      }

      // 3. Nested traversal by splitting by dot (filtering out empty segments)
      const keys = keyPath.split(".").filter(Boolean);
      let current = obj;
      for (const key of keys) {
        if (current && typeof current === "object" && key in current) {
          current = current[key];
        } else {
          return undefined;
        }
      }
      return current;
    };

    const val = resolve(translations[language]);
    if (val !== undefined) return val;

    // Fallback to English if key missing in selected language
    const enVal = resolve(translations.en);
    if (enVal !== undefined) return enVal;

    return fallback !== undefined ? fallback : keyPath;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
}
