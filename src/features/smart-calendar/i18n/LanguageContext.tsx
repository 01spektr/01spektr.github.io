import React, { createContext, useContext } from 'react';
import { Language, Holiday } from '../types/calendar';
import {
  TRANSLATIONS,
  Translations,
  MONTH_NAMES_BY_LANG,
  MONTH_NAMES_GENITIVE_BY_LANG,
  WEEKDAYS_SHORT_BY_LANG,
  WEEKDAYS_FULL_BY_LANG,
} from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof Translations) => string;
  monthNames: string[];
  monthNamesGenitive: string[];
  weekdaysShort: string[];
  weekdaysFull: string[];
  getHolidayTitle: (holiday: Holiday) => string;
  formatLocalizedDate: (date: Date) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Multilingual holiday mappings for common Uzbekistan and international holidays
const HOLIDAY_TRANSLATIONS: Record<string, { ru: string; uz: string; en: string }> = {
  'Новый год': {
    ru: 'Новый год',
    uz: 'Yangi yil bayrami',
    en: "New Year's Day",
  },
  'Новый год (Янги йил)': {
    ru: 'Новый год',
    uz: 'Yangi yil bayrami',
    en: "New Year's Day",
  },
  'Новогодний дополнительный выходной': {
    ru: 'Новогодний дополнительный выходной',
    uz: 'Yangi yil qo‘shimcha dam olish kuni',
    en: 'New Year Additional Day Off',
  },
  'Международный женский день': {
    ru: 'Международный женский день',
    uz: 'Xalqaro xotin-qizlar kuni',
    en: "International Women's Day",
  },
  'Праздник Навруз (Наврўз байрами)': {
    ru: 'Праздник Навруз',
    uz: 'Navro‘z umumxalq bayrami',
    en: 'Nowruz Spring Holiday',
  },
  'Дополнительный выходной к Наврузу': {
    ru: 'Дополнительный выходной к Наврузу',
    uz: 'Navro‘z qo‘shimcha dam olish kuni',
    en: 'Additional Nowruz Day Off',
  },
  'Перенесённый выходной день': {
    ru: 'Перенесённый выходной день',
    uz: 'Ko‘chirilgan dam olish kuni',
    en: 'Transferred Day Off',
  },
  'Рузи хайит (Иид ал-Фитр)': {
    ru: 'Руза хайит (Иид аль-Фитр)',
    uz: 'Ro‘za hayiti (Iyd al-Fitr)',
    en: 'Eid al-Fitr Holiday',
  },
  'День памяти и почестей (Хотира ва қадрлаш)': {
    ru: 'День памяти и почестей',
    uz: 'Xotira va qadrlash kuni',
    en: 'Day of Remembrance and Honor',
  },
  'Курбан хайит (Иид ал-Адха)': {
    ru: 'Курбан хайит (Иид аль-Адха)',
    uz: 'Qurbon hayiti (Iyd al-Adha)',
    en: 'Eid al-Adha Holiday',
  },
  'Дополнительный выходной к Курбан хайиту': {
    ru: 'Дополнительный выходной к Курбан хайиту',
    uz: 'Qurbon hayiti qo‘shimcha dam olish kuni',
    en: 'Additional Eid al-Adha Day Off',
  },
  'День независимости Узбекистана (Мустақиллик)': {
    ru: 'День независимости Узбекистана',
    uz: 'O‘zbekiston Respublikasi Mustaqillik kuni',
    en: 'Uzbekistan Independence Day',
  },
  'Дополнительный праздничный выходной': {
    ru: 'Дополнительный праздничный выходной',
    uz: 'Qo‘shimcha bayram dam olish kuni',
    en: 'Additional Holiday Day Off',
  },
  'День учителя и наставника (Ўқитувчилар куни)': {
    ru: 'День учителя и наставника',
    uz: 'O‘qituvchi va murabbiylar kuni',
    en: 'Teachers and Mentors Day',
  },
  'День Конституции Республики Узбекистан': {
    ru: 'День Конституции Республики Узбекистан',
    uz: 'O‘zbekiston Respublikasi Konstitutsiyasi kuni',
    en: 'Constitution Day of Uzbekistan',
  },
  'Предпраздничный сокращённый день': {
    ru: 'Предпраздничный сокращённый день',
    uz: 'Bayram oldi qisqartirilgan ish kuni',
    en: 'Pre-holiday Shortened Working Day',
  },
  'Новый год (предпраздничный день)': {
    ru: 'Новый год (предпраздничный день)',
    uz: 'Yangi yil oldidan qisqartirilgan ish kuni',
    en: 'New Year’s Eve Shortened Working Day',
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode; language: Language }> = ({
  children,
  language,
}) => {
  const setLanguage = () => undefined;

  const t = (key: keyof Translations): string => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.ru;
    return dict[key] || TRANSLATIONS.ru[key] || key;
  };

  const monthNames = MONTH_NAMES_BY_LANG[language] || MONTH_NAMES_BY_LANG.ru;
  const monthNamesGenitive = MONTH_NAMES_GENITIVE_BY_LANG[language] || MONTH_NAMES_GENITIVE_BY_LANG.ru;
  const weekdaysShort = WEEKDAYS_SHORT_BY_LANG[language] || WEEKDAYS_SHORT_BY_LANG.ru;
  const weekdaysFull = WEEKDAYS_FULL_BY_LANG[language] || WEEKDAYS_FULL_BY_LANG.ru;

  const getHolidayTitle = (holiday: Holiday): string => {
    if (!holiday) return '';
    const match = HOLIDAY_TRANSLATIONS[holiday.title];
    if (match && match[language]) {
      return match[language];
    }
    return holiday.title;
  };

  const formatLocalizedDate = (date: Date): string => {
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    if (language === 'uz') {
      return `${year}-yil ${day}-${monthNamesGenitive[month]}`;
    }
    if (language === 'en') {
      return `${monthNames[month]} ${day}, ${year}`;
    }
    return `${day} ${monthNamesGenitive[month]} ${year} г.`;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        monthNames,
        monthNamesGenitive,
        weekdaysShort,
        weekdaysFull,
        getHolidayTitle,
        formatLocalizedDate,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

// The hook is intentionally colocated with the provider for this isolated tool module.
// eslint-disable-next-line react-refresh/only-export-components
export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
