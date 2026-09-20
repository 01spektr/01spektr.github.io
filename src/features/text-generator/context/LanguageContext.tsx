/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext } from "react";
import { useI18n } from "@/lib/i18n";
import ruTranslations from "../locales/ru.json";
import enTranslations from "../locales/en.json";
import uzTranslations from "../locales/uz.json";

export type Language = "ru" | "en" | "uz";

export interface LanguageOption {
  code: Language;
  name: string;
  short: string;
  flag: string;
}

export const AVAILABLE_LANGUAGES: LanguageOption[] = [
  { code: "ru", name: "Русский", short: "RU", flag: "🇷🇺" },
  { code: "uz", name: "O'zbekcha", short: "UZ", flag: "🇺🇿" },
  { code: "en", name: "English", short: "EN", flag: "🇬🇧" },
];

export type TranslationsType = typeof ruTranslations;

const TRANSLATION_MAP: Record<Language, TranslationsType> = {
  ru: ruTranslations,
  en: enTranslations,
  uz: uzTranslations,
};

interface LanguageContextProps {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (path: string, fallback?: string) => string;
  translations: TranslationsType;
}

const LanguageContext = createContext<LanguageContextProps | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { locale, setLocale } = useI18n();
  const lang: Language = locale;
  const setLang = (newLang: Language) => setLocale(newLang);

  const currentTranslations = TRANSLATION_MAP[lang] || TRANSLATION_MAP.ru;

  /**
   * Translates a dot-notated key path, e.g. "hero.title" or "symbols.tabs.popular"
   */
  const t = (path: string, fallback?: string): string => {
    const keys = path.split(".");
    let current: any = currentTranslations;
    for (const key of keys) {
      if (current && typeof current === "object" && key in current) {
        current = current[key];
      } else {
        // Fallback to Russian if missing in active lang
        let ruFallback: any = TRANSLATION_MAP.ru;
        for (const k of keys) {
          if (ruFallback && typeof ruFallback === "object" && k in ruFallback) {
            ruFallback = ruFallback[k];
          } else {
            ruFallback = undefined;
            break;
          }
        }
        return typeof ruFallback === "string" ? ruFallback : fallback || path;
      }
    }
    return typeof current === "string" ? current : fallback || path;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, translations: currentTranslations }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = (): LanguageContextProps => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
};
