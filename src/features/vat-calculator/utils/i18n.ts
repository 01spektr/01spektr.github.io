import ruTranslations from '../locales/ru.json';
import enTranslations from '../locales/en.json';
import uzTranslations from '../locales/uz.json';

export type Language = 'ru' | 'en' | 'uz';

export const TRANSLATIONS = {
  ru: ruTranslations,
  en: enTranslations,
  uz: uzTranslations,
};

export const LANGUAGES: { code: Language; name: string; flag: string; nativeName: string }[] = [
  { code: 'ru', name: 'Русский', flag: '🇷🇺', nativeName: 'Русский' },
  { code: 'en', name: 'English', flag: '🇺🇸', nativeName: 'English' },
  { code: 'uz', name: 'Oʻzbekcha', flag: '🇺🇿', nativeName: 'Oʻzbek' },
];

/**
 * Retrieve translation by dotted path: e.g. "header.title"
 */
export function getTranslation(key: string, lang: Language = 'ru'): any {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.ru;
  const fallbackDict = TRANSLATIONS.ru;

  const parts = key.split('.');
  let current: any = dict;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      current = undefined;
      break;
    }
  }

  if (current !== undefined) {
    return current;
  }

  // Fallback to Russian
  let fallback: any = fallbackDict;
  for (const part of parts) {
    if (fallback && typeof fallback === 'object' && part in fallback) {
      fallback = fallback[part];
    } else {
      return key; // return key if missing
    }
  }

  return fallback !== undefined ? fallback : key;
}

/**
 * Detect preferred language from user's browser settings
 */
export function detectBrowserLanguage(): Language {
  if (typeof navigator === 'undefined') return 'en';

  const browserLangs = navigator.languages && navigator.languages.length > 0
    ? navigator.languages
    : [navigator.language || ''];

  for (const raw of browserLangs) {
    if (!raw) continue;
    const code = raw.toLowerCase();
    if (code.startsWith('ru') || code.startsWith('be') || code.startsWith('kk') || code.startsWith('uk')) {
      return 'ru';
    }
    if (code.startsWith('uz')) {
      return 'uz';
    }
    if (code.startsWith('en')) {
      return 'en';
    }
  }

  // Global default for international audience
  return 'en';
}
