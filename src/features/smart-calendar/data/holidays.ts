import { CountryCode, Holiday, Language } from '../types/calendar';

export interface CountryInfo {
  code: CountryCode;
  name: string;
  flag: string;
  officialCalendarName: string;
  description: string;
}

export const COUNTRIES: CountryInfo[] = [
  {
    code: 'UZ',
    name: 'Узбекистан',
    flag: '🇺🇿',
    officialCalendarName: 'Производственный календарь Республики Узбекистан',
    description: 'Официальные праздничные дни установлены Трудовым кодексом Республики Узбекистан и указами Президента.',
  },
  {
    code: 'GLOBAL',
    name: 'Международный (ISO)',
    flag: '🌐',
    officialCalendarName: 'Международный календарь ISO-8601',
    description: 'Универсальный календарь рабочих дней и общепринятых мировых праздников.',
  },
  {
    code: 'US',
    name: 'США (United States)',
    flag: '🇺🇸',
    officialCalendarName: 'Federal Holidays of the United States',
    description: 'Официальные федеральные праздники США (US Federal Holidays).',
  },
  {
    code: 'GB',
    name: 'Великобритания (UK)',
    flag: '🇬🇧',
    officialCalendarName: 'UK Bank Holidays & Observances',
    description: 'Официальные банковские выходные Великобритании (Bank Holidays).',
  },
  {
    code: 'DE',
    name: 'Германия (Deutschland)',
    flag: '🇩🇪',
    officialCalendarName: 'Gesetzliche Feiertage in Deutschland',
    description: 'Федеральные государственные праздники Германии.',
  },
  {
    code: 'FR',
    name: 'Франция (France)',
    flag: '🇫🇷',
    officialCalendarName: 'Jours fériés en France',
    description: 'Официальные государственные нерабочие праздники Франции.',
  },
  {
    code: 'AE',
    name: 'ОАЭ (UAE)',
    flag: '🇦🇪',
    officialCalendarName: 'UAE Official Public Holidays',
    description: 'Официальные праздничные и нерабочие дни Объединённых Арабских Эмиратов.',
  },
  {
    code: 'TR',
    name: 'Турция (Türkiye)',
    flag: '🇹🇷',
    officialCalendarName: 'Türkiye Ulusal Bayramlar ve Genel Tatiller',
    description: 'Национальные и религиозные праздники Турецкой Республики.',
  },
  {
    code: 'KZ',
    name: 'Казахстан',
    flag: '🇰🇿',
    officialCalendarName: 'Производственный календарь Республики Казахстан',
    description: 'Национальные и государственные праздники РК согласно Закону «О праздниках в Республике Казахстан».',
  },
  {
    code: 'RU',
    name: 'Россия',
    flag: '🇷🇺',
    officialCalendarName: 'Производственный календарь Российской Федерации',
    description: 'Нерабочие праздничные дни согласно статье 112 Трудового кодекса РФ с постановлениями о переносах.',
  },
  {
    code: 'KG',
    name: 'Кыргызстан',
    flag: '🇰🇬',
    officialCalendarName: 'Производственный календарь Кыргызской Республики',
    description: 'Праздничные дни в соответствии с Трудовым кодексом КР.',
  },
  {
    code: 'BY',
    name: 'Беларусь',
    flag: '🇧🇾',
    officialCalendarName: 'Производственный календарь Республики Беларусь',
    description: 'Государственные праздники и праздничные дни Республики Беларусь.',
  },
  {
    code: 'CA',
    name: 'Канада (Canada)',
    flag: '🇨🇦',
    officialCalendarName: 'Canadian Statutory Holidays',
    description: 'Федеральные и провинциальные праздничные дни Канады.',
  },
  {
    code: 'ES',
    name: 'Испания (España)',
    flag: '🇪🇸',
    officialCalendarName: 'Fiestas Laborales de España',
    description: 'Национальные праздники и нерабочие дни Королевства Испания.',
  },
  {
    code: 'IT',
    name: 'Италия (Italia)',
    flag: '🇮🇹',
    officialCalendarName: 'Festività Nazionali in Italia',
    description: 'Официальные государственные и религиозные праздники Италии.',
  },
  {
    code: 'IN',
    name: 'Индия (India)',
    flag: '🇮🇳',
    officialCalendarName: 'Indian Gazetted & Public Holidays',
    description: 'Официальные праздничные дни Республики Индия.',
  },
  {
    code: 'BR',
    name: 'Бразилия (Brasil)',
    flag: '🇧🇷',
    officialCalendarName: 'Feriados Nacionais do Brasil',
    description: 'Национальные праздничные дни Федеративной Республики Бразилия.',
  },
  {
    code: 'CN',
    name: 'Китай (China)',
    flag: '🇨🇳',
    officialCalendarName: 'Public Holidays of China',
    description: 'Государственные праздники КНР (Новый год, Праздник весны, День образования КНР).',
  },
  {
    code: 'JP',
    name: 'Япония (Japan)',
    flag: '🇯🇵',
    officialCalendarName: 'Japanese Public Holidays (祝日)',
    description: 'Официальные государственные праздники Японии.',
  },
];

const COUNTRY_NAMES: Record<CountryCode, Record<Language, string>> = {
  UZ: { ru: 'Узбекистан', en: 'Uzbekistan', uz: 'O‘zbekiston' },
  GLOBAL: { ru: 'Международный (ISO)', en: 'International (ISO)', uz: 'Xalqaro (ISO)' },
  US: { ru: 'США', en: 'United States', uz: 'AQSh' },
  GB: { ru: 'Великобритания', en: 'United Kingdom', uz: 'Buyuk Britaniya' },
  DE: { ru: 'Германия', en: 'Germany', uz: 'Germaniya' },
  FR: { ru: 'Франция', en: 'France', uz: 'Fransiya' },
  AE: { ru: 'ОАЭ', en: 'United Arab Emirates', uz: 'BAA' },
  TR: { ru: 'Турция', en: 'Türkiye', uz: 'Turkiya' },
  KZ: { ru: 'Казахстан', en: 'Kazakhstan', uz: 'Qozog‘iston' },
  RU: { ru: 'Россия', en: 'Russia', uz: 'Rossiya' },
  KG: { ru: 'Кыргызстан', en: 'Kyrgyzstan', uz: 'Qirg‘iziston' },
  BY: { ru: 'Беларусь', en: 'Belarus', uz: 'Belarus' },
  CA: { ru: 'Канада', en: 'Canada', uz: 'Kanada' },
  ES: { ru: 'Испания', en: 'Spain', uz: 'Ispaniya' },
  IT: { ru: 'Италия', en: 'Italy', uz: 'Italiya' },
  IN: { ru: 'Индия', en: 'India', uz: 'Hindiston' },
  BR: { ru: 'Бразилия', en: 'Brazil', uz: 'Braziliya' },
  CN: { ru: 'Китай', en: 'China', uz: 'Xitoy' },
  JP: { ru: 'Япония', en: 'Japan', uz: 'Yaponiya' },
};

export function getCountryName(code: CountryCode, language: Language): string {
  return COUNTRY_NAMES[code]?.[language] ?? COUNTRY_NAMES[code]?.ru ?? code;
}

export function getHolidaysForYear(country: CountryCode, year: number): Holiday[] {
  if (country === 'UZ') {
    return [
      { date: `${year}-01-01`, title: 'Новый год (Янги йил)', type: 'holiday', isDayOff: true },
      { date: `${year}-01-02`, title: 'Новогодний дополнительный выходной', type: 'transferred', isDayOff: true },
      { date: `${year}-03-07`, title: 'Предпраздничный сокращённый день', type: 'shortened', isDayOff: false, note: 'Рабочий день сокращён на 1 час' },
      { date: `${year}-03-08`, title: 'Международный женский день', type: 'holiday', isDayOff: true },
      { date: `${year}-03-20`, title: 'Предпраздничный сокращённый день', type: 'shortened', isDayOff: false, note: 'Рабочий день сокращён на 1 час' },
      { date: `${year}-03-21`, title: 'Праздник Навруз (Наврўз байрами)', type: 'holiday', isDayOff: true },
      { date: `${year}-03-22`, title: 'Дополнительный выходной к Наврузу', type: 'transferred', isDayOff: true },
      { date: `${year}-03-23`, title: 'Перенесённый выходной день', type: 'transferred', isDayOff: true },
      { date: `${year}-03-20`, title: 'Рузи хайит (Иид ал-Фитр)', type: 'holiday', isDayOff: true },
      { date: `${year}-05-08`, title: 'Предпраздничный сокращённый день', type: 'shortened', isDayOff: false, note: 'Рабочий день сокращён на 1 час' },
      { date: `${year}-05-09`, title: 'День памяти и почестей (Хотира ва қадрлаш)', type: 'holiday', isDayOff: true },
      { date: `${year}-05-27`, title: 'Курбан хайит (Иид ал-Адха)', type: 'holiday', isDayOff: true },
      { date: `${year}-05-28`, title: 'Дополнительный выходной к Курбан хайиту', type: 'transferred', isDayOff: true },
      { date: `${year}-08-31`, title: 'Предпраздничный сокращённый день', type: 'shortened', isDayOff: false, note: 'Рабочий день сокращён на 1 час' },
      { date: `${year}-09-01`, title: 'День независимости Узбекистана (Мустақиллик)', type: 'holiday', isDayOff: true },
      { date: `${year}-09-02`, title: 'Дополнительный праздничный выходной', type: 'transferred', isDayOff: true },
      { date: `${year}-09-30`, title: 'Предпраздничный сокращённый день', type: 'shortened', isDayOff: false, note: 'Рабочий день сокращён на 1 час' },
      { date: `${year}-10-01`, title: 'День учителя и наставника (Ўқитувчилар куни)', type: 'holiday', isDayOff: true },
      { date: `${year}-12-07`, title: 'Предпраздничный сокращённый день', type: 'shortened', isDayOff: false, note: 'Рабочий день сокращён на 1 час' },
      { date: `${year}-12-08`, title: 'День Конституции Республики Узбекистан', type: 'holiday', isDayOff: true },
      { date: `${year}-12-31`, title: 'Новый год (предпраздничный день)', type: 'shortened', isDayOff: false, note: 'Рабочий день сокращён на 1 час' },
    ];
  }

  if (country === 'US') {
    return [
      { date: `${year}-01-01`, title: "New Year's Day", type: 'holiday', isDayOff: true },
      { date: `${year}-01-19`, title: 'Martin Luther King Jr. Day', type: 'holiday', isDayOff: true },
      { date: `${year}-02-16`, title: "Presidents' Day / Washington's Birthday", type: 'holiday', isDayOff: true },
      { date: `${year}-05-25`, title: 'Memorial Day', type: 'holiday', isDayOff: true },
      { date: `${year}-06-19`, title: 'Juneteenth National Independence Day', type: 'holiday', isDayOff: true },
      { date: `${year}-07-04`, title: 'Independence Day (4th of July)', type: 'holiday', isDayOff: true },
      { date: `${year}-09-07`, title: 'Labor Day', type: 'holiday', isDayOff: true },
      { date: `${year}-10-12`, title: 'Columbus Day / Indigenous Peoples Day', type: 'holiday', isDayOff: true },
      { date: `${year}-11-11`, title: 'Veterans Day', type: 'holiday', isDayOff: true },
      { date: `${year}-11-26`, title: 'Thanksgiving Day', type: 'holiday', isDayOff: true },
      { date: `${year}-11-27`, title: 'Day after Thanksgiving', type: 'transferred', isDayOff: true },
      { date: `${year}-12-25`, title: 'Christmas Day', type: 'holiday', isDayOff: true },
    ];
  }

  if (country === 'GB') {
    return [
      { date: `${year}-01-01`, title: "New Year's Day", type: 'holiday', isDayOff: true },
      { date: `${year}-04-03`, title: 'Good Friday', type: 'holiday', isDayOff: true },
      { date: `${year}-04-06`, title: 'Easter Monday', type: 'holiday', isDayOff: true },
      { date: `${year}-05-04`, title: 'Early May Bank Holiday', type: 'holiday', isDayOff: true },
      { date: `${year}-05-25`, title: 'Spring Bank Holiday', type: 'holiday', isDayOff: true },
      { date: `${year}-08-31`, title: 'Summer Bank Holiday', type: 'holiday', isDayOff: true },
      { date: `${year}-12-25`, title: 'Christmas Day', type: 'holiday', isDayOff: true },
      { date: `${year}-12-28`, title: 'Boxing Day (Substitute Day)', type: 'holiday', isDayOff: true },
    ];
  }

  if (country === 'DE') {
    return [
      { date: `${year}-01-01`, title: 'Neujahr (Новый год)', type: 'holiday', isDayOff: true },
      { date: `${year}-04-03`, title: 'Karfreitag (Страстная пятница)', type: 'holiday', isDayOff: true },
      { date: `${year}-04-06`, title: 'Ostermontag (Пасхальный понедельник)', type: 'holiday', isDayOff: true },
      { date: `${year}-05-01`, title: 'Tag der Arbeit (День труда)', type: 'holiday', isDayOff: true },
      { date: `${year}-05-14`, title: 'Christi Himmelfahrt (Вознесение)', type: 'holiday', isDayOff: true },
      { date: `${year}-05-25`, title: 'Pfingstmontag (Троицкий понедельник)', type: 'holiday', isDayOff: true },
      { date: `${year}-10-03`, title: 'Tag der Deutschen Einheit (День единства)', type: 'holiday', isDayOff: true },
      { date: `${year}-12-25`, title: '1. Weihnachtstag (Рождество)', type: 'holiday', isDayOff: true },
      { date: `${year}-12-26`, title: '2. Weihnachtstag (Второй день Рождества)', type: 'holiday', isDayOff: true },
    ];
  }

  if (country === 'FR') {
    return [
      { date: `${year}-01-01`, title: "Jour de l'An (Новый год)", type: 'holiday', isDayOff: true },
      { date: `${year}-04-06`, title: 'Lundi de Pâques (Пасхальный понедельник)', type: 'holiday', isDayOff: true },
      { date: `${year}-05-01`, title: 'Fête du Travail (День труда)', type: 'holiday', isDayOff: true },
      { date: `${year}-05-08`, title: 'Victoire 1945 (День Победы)', type: 'holiday', isDayOff: true },
      { date: `${year}-05-14`, title: "Ascension (Вознесение Господне)", type: 'holiday', isDayOff: true },
      { date: `${year}-05-25`, title: 'Lundi de Pentecôte (Духов день)', type: 'holiday', isDayOff: true },
      { date: `${year}-07-14`, title: 'Fête Nationale (День взятия Бастилии)', type: 'holiday', isDayOff: true },
      { date: `${year}-08-15`, title: 'Assomption (Успение)', type: 'holiday', isDayOff: true },
      { date: `${year}-11-01`, title: 'Toussaint (День всех святых)', type: 'holiday', isDayOff: true },
      { date: `${year}-11-11`, title: 'Armistice 1918 (День перемирия)', type: 'holiday', isDayOff: true },
      { date: `${year}-12-25`, title: 'Noël (Рождество)', type: 'holiday', isDayOff: true },
    ];
  }

  if (country === 'AE') {
    return [
      { date: `${year}-01-01`, title: "New Year's Day", type: 'holiday', isDayOff: true },
      { date: `${year}-03-20`, title: 'Eid al-Fitr (Ид аль-Фитр)', type: 'holiday', isDayOff: true },
      { date: `${year}-03-21`, title: 'Eid al-Fitr Holiday', type: 'holiday', isDayOff: true },
      { date: `${year}-03-22`, title: 'Eid al-Fitr Holiday', type: 'holiday', isDayOff: true },
      { date: `${year}-05-26`, title: 'Arafah Day', type: 'holiday', isDayOff: true },
      { date: `${year}-05-27`, title: 'Eid al-Adha (Курбан-байрам)', type: 'holiday', isDayOff: true },
      { date: `${year}-05-28`, title: 'Eid al-Adha Holiday', type: 'holiday', isDayOff: true },
      { date: `${year}-06-16`, title: 'Islamic New Year', type: 'holiday', isDayOff: true },
      { date: `${year}-12-02`, title: 'UAE National Day', type: 'holiday', isDayOff: true },
      { date: `${year}-12-03`, title: 'UAE National Day Holiday', type: 'holiday', isDayOff: true },
    ];
  }

  if (country === 'TR') {
    return [
      { date: `${year}-01-01`, title: 'Yılbaşı (Новый год)', type: 'holiday', isDayOff: true },
      { date: `${year}-03-20`, title: 'Ramazan Bayramı Arifesi', type: 'shortened', isDayOff: false },
      { date: `${year}-03-21`, title: 'Ramazan Bayramı (1. Gün)', type: 'holiday', isDayOff: true },
      { date: `${year}-03-22`, title: 'Ramazan Bayramı (2. Gün)', type: 'holiday', isDayOff: true },
      { date: `${year}-04-23`, title: 'Ulusal Egemenlik ve Çocuk Bayramı', type: 'holiday', isDayOff: true },
      { date: `${year}-05-01`, title: 'Emek ve Dayanışma Günü', type: 'holiday', isDayOff: true },
      { date: `${year}-05-19`, title: "Atatürk'ü Anma, Gençlik ve Spor Bayramı", type: 'holiday', isDayOff: true },
      { date: `${year}-05-27`, title: 'Kurban Bayramı (1. Gün)', type: 'holiday', isDayOff: true },
      { date: `${year}-07-15`, title: 'Demokrasi ve Milli Birlik Günü', type: 'holiday', isDayOff: true },
      { date: `${year}-08-30`, title: 'Zafer Bayramı (День победы)', type: 'holiday', isDayOff: true },
      { date: `${year}-10-29`, title: 'Cumhuriyet Bayramı (День Республики)', type: 'holiday', isDayOff: true },
    ];
  }

  if (country === 'KZ') {
    return [
      { date: `${year}-01-01`, title: 'Новый год', type: 'holiday', isDayOff: true },
      { date: `${year}-01-02`, title: 'Новый год (второй день)', type: 'holiday', isDayOff: true },
      { date: `${year}-01-07`, title: 'Православное Рождество', type: 'holiday', isDayOff: true },
      { date: `${year}-03-08`, title: 'Международный женский день', type: 'holiday', isDayOff: true },
      { date: `${year}-03-21`, title: 'Наурыз мейрамы', type: 'holiday', isDayOff: true },
      { date: `${year}-03-22`, title: 'Наурыз мейрамы', type: 'holiday', isDayOff: true },
      { date: `${year}-03-23`, title: 'Наурыз мейрамы', type: 'holiday', isDayOff: true },
      { date: `${year}-05-01`, title: 'Праздник единства народа Казахстана', type: 'holiday', isDayOff: true },
      { date: `${year}-05-07`, title: 'День защитника Отечества', type: 'holiday', isDayOff: true },
      { date: `${year}-05-09`, title: 'День Победы', type: 'holiday', isDayOff: true },
      { date: `${year}-07-06`, title: 'День Столицы', type: 'holiday', isDayOff: true },
      { date: `${year}-08-30`, title: 'День Конституции РК', type: 'holiday', isDayOff: true },
      { date: `${year}-10-25`, title: 'День Республики', type: 'holiday', isDayOff: true },
      { date: `${year}-12-16`, title: 'День Независимости РК', type: 'holiday', isDayOff: true },
      { date: `${year}-12-31`, title: 'Предпраздничный день', type: 'shortened', isDayOff: false },
    ];
  }

  if (country === 'RU') {
    return [
      { date: `${year}-01-01`, title: 'Новогодние каникулы', type: 'holiday', isDayOff: true },
      { date: `${year}-01-02`, title: 'Новогодние каникулы', type: 'holiday', isDayOff: true },
      { date: `${year}-01-03`, title: 'Новогодние каникулы', type: 'holiday', isDayOff: true },
      { date: `${year}-01-04`, title: 'Новогодние каникулы', type: 'holiday', isDayOff: true },
      { date: `${year}-01-05`, title: 'Новогодние каникулы', type: 'holiday', isDayOff: true },
      { date: `${year}-01-06`, title: 'Новогодние каникулы', type: 'holiday', isDayOff: true },
      { date: `${year}-01-07`, title: 'Рождество Христово', type: 'holiday', isDayOff: true },
      { date: `${year}-01-08`, title: 'Новогодние каникулы', type: 'holiday', isDayOff: true },
      { date: `${year}-02-23`, title: 'День защитника Отечества', type: 'holiday', isDayOff: true },
      { date: `${year}-03-08`, title: 'Международный женский день', type: 'holiday', isDayOff: true },
      { date: `${year}-05-01`, title: 'Праздник Весны и Труда', type: 'holiday', isDayOff: true },
      { date: `${year}-05-09`, title: 'День Победы', type: 'holiday', isDayOff: true },
      { date: `${year}-06-12`, title: 'День России', type: 'holiday', isDayOff: true },
      { date: `${year}-11-04`, title: 'День народного единства', type: 'holiday', isDayOff: true },
      { date: `${year}-12-31`, title: 'Новогодний выходной / предпраздничный', type: 'transferred', isDayOff: true },
    ];
  }

  if (country === 'GLOBAL') {
    return [
      { date: `${year}-01-01`, title: "New Year's Day (Всемирный Новый год)", type: 'holiday', isDayOff: true },
      { date: `${year}-03-08`, title: "International Women's Day (Женский день)", type: 'holiday', isDayOff: true },
      { date: `${year}-05-01`, title: 'International Workers Day (День труда)', type: 'holiday', isDayOff: true },
      { date: `${year}-06-21`, title: 'Summer Solstice (День солнцестояния)', type: 'holiday', isDayOff: false },
      { date: `${year}-12-25`, title: 'Christmas / Winter Holiday', type: 'holiday', isDayOff: true },
      { date: `${year}-12-31`, title: "New Year's Eve (Канун Нового года)", type: 'shortened', isDayOff: false },
    ];
  }

  if (country === 'BY') {
    return [
      { date: `${year}-01-01`, title: 'Новый год', type: 'holiday', isDayOff: true },
      { date: `${year}-01-02`, title: 'Новый год (второй день)', type: 'holiday', isDayOff: true },
      { date: `${year}-01-07`, title: 'Рождество Христово (православное)', type: 'holiday', isDayOff: true },
      { date: `${year}-03-08`, title: 'День женщин', type: 'holiday', isDayOff: true },
      { date: `${year}-05-01`, title: 'Праздник труда', type: 'holiday', isDayOff: true },
      { date: `${year}-05-09`, title: 'День Победы', type: 'holiday', isDayOff: true },
      { date: `${year}-07-03`, title: 'День Независимости Республики Беларусь', type: 'holiday', isDayOff: true },
      { date: `${year}-11-07`, title: 'День Октябрьской революции', type: 'holiday', isDayOff: true },
      { date: `${year}-12-25`, title: 'Рождество Христово (католическое)', type: 'holiday', isDayOff: true },
    ];
  }

  if (country === 'CA') {
    return [
      { date: `${year}-01-01`, title: "New Year's Day", type: 'holiday', isDayOff: true },
      { date: `${year}-02-16`, title: 'Family Day / Louis Riel Day', type: 'holiday', isDayOff: true },
      { date: `${year}-04-03`, title: 'Good Friday', type: 'holiday', isDayOff: true },
      { date: `${year}-05-18`, title: 'Victoria Day', type: 'holiday', isDayOff: true },
      { date: `${year}-07-01`, title: 'Canada Day', type: 'holiday', isDayOff: true },
      { date: `${year}-09-07`, title: 'Labour Day', type: 'holiday', isDayOff: true },
      { date: `${year}-09-30`, title: 'National Day for Truth and Reconciliation', type: 'holiday', isDayOff: true },
      { date: `${year}-10-12`, title: 'Thanksgiving Day', type: 'holiday', isDayOff: true },
      { date: `${year}-11-11`, title: 'Remembrance Day', type: 'holiday', isDayOff: true },
      { date: `${year}-12-25`, title: 'Christmas Day', type: 'holiday', isDayOff: true },
      { date: `${year}-12-26`, title: 'Boxing Day', type: 'holiday', isDayOff: true },
    ];
  }

  if (country === 'ES') {
    return [
      { date: `${year}-01-01`, title: 'Año Nuevo', type: 'holiday', isDayOff: true },
      { date: `${year}-01-06`, title: 'Epifanía del Señor (Reyes Magos)', type: 'holiday', isDayOff: true },
      { date: `${year}-04-03`, title: 'Viernes Santo', type: 'holiday', isDayOff: true },
      { date: `${year}-05-01`, title: 'Fiesta del Trabajo', type: 'holiday', isDayOff: true },
      { date: `${year}-08-15`, title: 'Asunción de la Virgen', type: 'holiday', isDayOff: true },
      { date: `${year}-10-12`, title: 'Fiesta Nacional de España', type: 'holiday', isDayOff: true },
      { date: `${year}-11-01`, title: 'Todos los Santos', type: 'holiday', isDayOff: true },
      { date: `${year}-12-06`, title: 'Día de la Constitución Española', type: 'holiday', isDayOff: true },
      { date: `${year}-12-08`, title: 'Inmaculada Concepción', type: 'holiday', isDayOff: true },
      { date: `${year}-12-25`, title: 'Navidad del Señor', type: 'holiday', isDayOff: true },
    ];
  }

  if (country === 'IT') {
    return [
      { date: `${year}-01-01`, title: 'Capodanno', type: 'holiday', isDayOff: true },
      { date: `${year}-01-06`, title: 'Epifania', type: 'holiday', isDayOff: true },
      { date: `${year}-04-06`, title: "Lunedì dell'Angelo (Pasquetta)", type: 'holiday', isDayOff: true },
      { date: `${year}-04-25`, title: 'Festa della Liberazione', type: 'holiday', isDayOff: true },
      { date: `${year}-05-01`, title: 'Festa dei Lavoratori', type: 'holiday', isDayOff: true },
      { date: `${year}-06-02`, title: 'Festa della Repubblica', type: 'holiday', isDayOff: true },
      { date: `${year}-08-15`, title: 'Ferragosto (Assunzione)', type: 'holiday', isDayOff: true },
      { date: `${year}-11-01`, title: 'Tutti i Santi', type: 'holiday', isDayOff: true },
      { date: `${year}-12-08`, title: 'Immacolata Concezione', type: 'holiday', isDayOff: true },
      { date: `${year}-12-25`, title: 'Natale', type: 'holiday', isDayOff: true },
      { date: `${year}-12-26`, title: 'Santo Stefano', type: 'holiday', isDayOff: true },
    ];
  }

  if (country === 'IN') {
    return [
      { date: `${year}-01-26`, title: 'Republic Day (गणतंत्र दिवस)', type: 'holiday', isDayOff: true },
      { date: `${year}-03-04`, title: 'Holi (होली)', type: 'holiday', isDayOff: true },
      { date: `${year}-03-21`, title: 'Eid-ul-Fitr', type: 'holiday', isDayOff: true },
      { date: `${year}-04-14`, title: 'Ambedkar Jayanti', type: 'holiday', isDayOff: true },
      { date: `${year}-05-27`, title: 'Bakrid / Eid al-Adha', type: 'holiday', isDayOff: true },
      { date: `${year}-08-15`, title: 'Independence Day (स्वतंत्रता दिवस)', type: 'holiday', isDayOff: true },
      { date: `${year}-10-02`, title: 'Mahatma Gandhi Jayanti', type: 'holiday', isDayOff: true },
      { date: `${year}-10-20`, title: 'Dussehra (दशहरा)', type: 'holiday', isDayOff: true },
      { date: `${year}-11-08`, title: 'Diwali (दीपावली)', type: 'holiday', isDayOff: true },
      { date: `${year}-12-25`, title: 'Christmas Day', type: 'holiday', isDayOff: true },
    ];
  }

  if (country === 'BR') {
    return [
      { date: `${year}-01-01`, title: 'Confraternização Universal (Ano Novo)', type: 'holiday', isDayOff: true },
      { date: `${year}-02-17`, title: 'Carnaval', type: 'holiday', isDayOff: true },
      { date: `${year}-04-03`, title: 'Sexta-feira Santa', type: 'holiday', isDayOff: true },
      { date: `${year}-04-21`, title: 'Tiradentes', type: 'holiday', isDayOff: true },
      { date: `${year}-05-01`, title: 'Dia do Trabalho', type: 'holiday', isDayOff: true },
      { date: `${year}-06-04`, title: 'Corpus Christi', type: 'holiday', isDayOff: true },
      { date: `${year}-09-07`, title: 'Independência do Brasil', type: 'holiday', isDayOff: true },
      { date: `${year}-10-12`, title: 'Nossa Senhora Aparecida', type: 'holiday', isDayOff: true },
      { date: `${year}-11-02`, title: 'Finados', type: 'holiday', isDayOff: true },
      { date: `${year}-11-15`, title: 'Proclamação da República', type: 'holiday', isDayOff: true },
      { date: `${year}-12-25`, title: 'Natal', type: 'holiday', isDayOff: true },
    ];
  }

  // Default KG / other
  return [
    { date: `${year}-01-01`, title: 'Новый год', type: 'holiday', isDayOff: true },
    { date: `${year}-01-07`, title: 'Рождество Христово', type: 'holiday', isDayOff: true },
    { date: `${year}-02-23`, title: 'День защитника Отечества', type: 'holiday', isDayOff: true },
    { date: `${year}-03-08`, title: 'Международный женский день', type: 'holiday', isDayOff: true },
    { date: `${year}-03-21`, title: 'Нооруз', type: 'holiday', isDayOff: true },
    { date: `${year}-05-01`, title: 'Праздник труда', type: 'holiday', isDayOff: true },
    { date: `${year}-05-05`, title: 'День Конституции Кыргызской Республики', type: 'holiday', isDayOff: true },
    { date: `${year}-05-09`, title: 'День Победы', type: 'holiday', isDayOff: true },
    { date: `${year}-08-31`, title: 'День независимости Кыргызской Республики', type: 'holiday', isDayOff: true },
    { date: `${year}-11-07`, title: 'Дни истории и памяти предков', type: 'holiday', isDayOff: true },
    { date: `${year}-11-08`, title: 'Дни истории и памяти предков', type: 'holiday', isDayOff: true },
    { date: `${year}-12-31`, title: 'Предпраздничный день', type: 'shortened', isDayOff: false },
  ];
}

export const MONTH_NAMES_RU = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];

export const MONTH_NAMES_GENITIVE = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
];

export const WEEKDAYS_SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export const WEEKDAYS_FULL = [
  'Воскресенье',
  'Понедельник',
  'Вторник',
  'Среда',
  'Четверг',
  'Пятница',
  'Суббота',
];
