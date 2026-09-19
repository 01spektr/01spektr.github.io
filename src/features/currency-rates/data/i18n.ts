import translationsData from '../data/translations.json';
import { Language } from '../types';

export type TranslationSchema = typeof translationsData.ru;

export const getTranslations = (lang: Language): TranslationSchema => {
  return (translationsData as Record<Language, TranslationSchema>)[lang] || translationsData.ru;
};

export default translationsData;
