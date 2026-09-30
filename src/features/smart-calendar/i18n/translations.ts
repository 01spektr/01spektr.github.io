import { Language } from '../types/calendar';
import ruLocale from './locales/ru.json';
import uzLocale from './locales/uz.json';
import enLocale from './locales/en.json';

export type Translations = typeof ruLocale;
export type TranslationKey = keyof Translations;

export const TRANSLATIONS: Record<Language, Translations> = {
  ru: ruLocale,
  uz: uzLocale as unknown as Translations,
  en: enLocale as unknown as Translations,
};

export const MONTH_NAMES_BY_LANG: Record<Language, string[]> = {
  ru: [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
  ],
  uz: [
    'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
    'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr',
  ],
  en: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ],
};

export const MONTH_NAMES_GENITIVE_BY_LANG: Record<Language, string[]> = {
  ru: [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
  ],
  uz: [
    'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
    'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr',
  ],
  en: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ],
};

export const WEEKDAYS_SHORT_BY_LANG: Record<Language, string[]> = {
  ru: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
  uz: ['Dsh', 'Ssh', 'Chsh', 'Psh', 'Jm', 'Shb', 'Ysh'],
  en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
};

export const WEEKDAYS_FULL_BY_LANG: Record<Language, string[]> = {
  ru: [
    'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье',
  ],
  uz: [
    'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba', 'Yakshanba',
  ],
  en: [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
  ],
};
