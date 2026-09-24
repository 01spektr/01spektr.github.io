export const LOCALES = {
  ru: { label: "Русский", shortLabel: "RU", htmlLang: "ru", numberLocale: "ru-RU" },
  en: { label: "English", shortLabel: "EN", htmlLang: "en", numberLocale: "en-US" },
  uz: { label: "O‘zbekcha", shortLabel: "UZ", htmlLang: "uz", numberLocale: "uz-UZ" },
} as const;

export type Locale = keyof typeof LOCALES;

export const SUPPORTED_LOCALES = Object.keys(LOCALES) as Locale[];
export const DEFAULT_LOCALE: Locale = "en";

export function localeHomePath(locale: Locale): "/" | "/ru" | "/uz" {
  return locale === "en" ? "/" : `/${locale}`;
}

export function localeFromHomePath(path: string): Locale | null {
  const normalized = path.replace(/\/$/, "") || "/";
  if (normalized === "/") return DEFAULT_LOCALE;
  const code = normalized.slice(1);
  return isLocale(code) ? code : null;
}

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
