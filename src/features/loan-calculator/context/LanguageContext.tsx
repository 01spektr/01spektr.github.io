import type { ReactNode } from "react";
import { useI18n } from "@/lib/i18n";
import { translations, type Language } from "../translations";

export function LanguageProvider({ children }: { children: ReactNode }) {
  return children;
}

export function useLanguage() {
  const { locale, setLocale } = useI18n();
  const language = locale as Language;

  return {
    language,
    setLanguage: (next: Language) => setLocale(next),
    t: translations[language],
    langLabel: language === "ru" ? "RU" : language === "uz" ? "O‘Z" : "EN",
  };
}
