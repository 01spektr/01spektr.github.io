import React, { createContext, useContext, useMemo } from 'react';
import translationsData from '../locales/translations.json';
import { useI18n } from '@/lib/i18n';

export type Language = 'ru' | 'uz' | 'en';
export type TranslationsType = typeof translationsData.ru;

interface LanguageContextType {
  lang: Language;
  t: TranslationsType;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { locale } = useI18n();
  const lang: Language = (locale === 'uz' || locale === 'en') ? locale : 'ru';

  const value = useMemo(() => {
    const t = (translationsData as Record<Language, TranslationsType>)[lang] || translationsData.ru;
    return { lang, t };
  }, [lang]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    return { lang: 'ru', t: translationsData.ru };
  }
  return context;
};
