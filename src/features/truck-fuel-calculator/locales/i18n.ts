import translations from './translations.json';
import { CurrencyCode } from '../types/calculator';

export type LanguageCode = 'ru' | 'en' | 'uz';

export type TranslationData = typeof translations.ru;

export function getTranslations(lang: LanguageCode): TranslationData {
  return translations[lang] || translations.ru;
}

export function getDefaultCurrencyForLang(lang: LanguageCode): CurrencyCode {
  switch (lang) {
    case 'ru':
      return 'RUB';
    case 'uz':
      return 'UZS';
    case 'en':
      return 'USD';
    default:
      return 'USD';
  }
}

export function getDefaultPriceForCurrency(currency: CurrencyCode): number {
  switch (currency) {
    case 'RUB':
      return 65.0; // Typical diesel price in Russia in rubles
    case 'UZS':
      return 13500; // Typical diesel price in Uzbekistan in sums
    case 'USD':
      return 1.20; // Typical diesel price in international USD
    case 'EUR':
      return 1.15;
    case 'KZT':
      return 320;
    default:
      return 1.20;
  }
}
