export const LOCALES = {
  ru: { label: "Русский", shortLabel: "RU", htmlLang: "ru", numberLocale: "ru-RU" },
  en: { label: "English", shortLabel: "EN", htmlLang: "en", numberLocale: "en-US" },
} as const;

export type Locale = keyof typeof LOCALES;

export const SUPPORTED_LOCALES = Object.keys(LOCALES) as Locale[];
export const DEFAULT_LOCALE: Locale = "en";

export function isLocale(value: string | null | undefined): value is Locale {
  return Boolean(value && value in LOCALES);
}

export function detectBrowserLocale(languages: readonly string[]): Locale {
  for (const language of languages) {
    const exact = language.toLowerCase().split("-")[0];
    if (isLocale(exact)) return exact;
  }
  return DEFAULT_LOCALE;
}
