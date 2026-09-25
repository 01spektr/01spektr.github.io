export interface CountryCustomsProfile {
  code: string;
  name: string;
  shortName?: string;
  countryNameGenitive: string; // "Узбекистана", "США", "Казахстана", "России", "Турции"
  customsAuthority: string; // "ГТК РУз", "U.S. CBP", "КГД МФ РК (ЕАЭС)", "ФТС РФ (ЕАЭС)"
  customsWebsite: string; // Official customs administration URL
  currencyCode: string; // 'UZS' | 'USD' | 'KZT' | 'RUB' | 'TRY' | 'EUR'
  currencySymbol: string;
  defaultRateToUSD: number; // exchange rate: 1 USD = X in currencyCode
  vatRate: number; // e.g. 12 for 12%, 0 for US (no federal VAT), 20 for RU/TR, 19 for DE
  vatName: string; // "НДС 12%", "Sales Tax (0% fed.)", "НДС РК 12%", "НДС РФ 20%", "KDV 20%", "MwSt 19%"
  hasDeMinimisIndividual: boolean;
  individualDeMinimisUSD: number; // threshold in USD
  individualDeMinimisKg: number;
  individualExcessDutyRate: number; // percentage applied to excess, e.g. 30% for UZ, 15% for KZ/RU
  deMinimisRuleName: string;
  deMinimisNote: string;
  legalCustomsFeeFormula: (
    cifUSD: number,
    rateToUSD: number,
  ) => { feeAmount: number; note: string };
}

export const COUNTRY_PROFILES: Record<string, CountryCustomsProfile> = {
  UZ: {
    code: "UZ",
    name: "Узбекистан",
    shortName: "Узбекистан",
    countryNameGenitive: "Узбекистана",
    customsAuthority: "ГТК Республики Узбекистан",
    customsWebsite: "https://customs.uz",
    currencyCode: "UZS",
    currencySymbol: "UZS",
    defaultRateToUSD: 12650,
    vatRate: 12,
    vatName: "НДС 12%",
    hasDeMinimisIndividual: true,
    individualDeMinimisUSD: 1000,
    individualDeMinimisKg: 30,
    individualExcessDutyRate: 30,
    deMinimisRuleName: "Постановления ПП-3512 / ПП-4470",
    deMinimisNote:
      "Беспошлинный ввоз для физлиц: до $1 000 (посылка) / $2 000 (авиа) / $300 (авто). На превышение начисляется ЕТП 30%.",
    legalCustomsFeeFormula: (cifUSD, rateToUSD) => {
      const cifUZS = cifUSD * rateToUSD;
      // 0.2% от CIF, мин 143 200 сум (Постановление КМ РУз №700)
      const fee = Math.max(143200, Math.round(cifUZS * 0.002));
      return { feeAmount: fee, note: "Сбор за таможенное оформление (ПКМ №700)" };
    },
  },
  US: {
    code: "US",
    name: "США",
    shortName: "США",
    countryNameGenitive: "США",
    customsAuthority: "U.S. Customs and Border Protection (CBP)",
    customsWebsite: "https://www.cbp.gov",
    currencyCode: "USD",
    currencySymbol: "$",
    defaultRateToUSD: 1,
    vatRate: 0,
    vatName: "Federal VAT (0%)",
    hasDeMinimisIndividual: true,
    individualDeMinimisUSD: 800,
    individualDeMinimisKg: 50,
    individualExcessDutyRate: 10,
    deMinimisRuleName: "Section 321 De Minimis (19 U.S.C. 1321)",
    deMinimisNote:
      "Беспошлинный порог De Minimis: до $800 на человека в день ввозится со ставкой 0% пошлины и налогов.",
    legalCustomsFeeFormula: (cifUSD) => {
      // Merchandise Processing Fee (MPF): 0.3464%, min $31.67, max $614.35
      const mpf = Math.min(614.35, Math.max(31.67, cifUSD * 0.003464));
      return { feeAmount: Math.round(mpf), note: "Сбор MPF (Merchandise Processing Fee: 0.3464%)" };
    },
  },
  KZ: {
    code: "KZ",
    name: "Казахстан",
    shortName: "Казахстан",
    countryNameGenitive: "Казахстана",
    customsAuthority: "КГД МФ РК (Таможня ЕАЭС)",
    customsWebsite: "https://kgd.gov.kz",
    currencyCode: "KZT",
    currencySymbol: "₸",
    defaultRateToUSD: 500,
    vatRate: 12,
    vatName: "НДС РК 12%",
    hasDeMinimisIndividual: true,
    individualDeMinimisUSD: 220, // ~€200
    individualDeMinimisKg: 31,
    individualExcessDutyRate: 15,
    deMinimisRuleName: "Решение Совета ЕЭК №107 (ЕАЭС)",
    deMinimisNote:
      "Норма ЕАЭС: до €200 (~$220) и 31 кг. На сумму превышения начисляется 15% (не менее €2 за 1 кг превышения).",
    legalCustomsFeeFormula: (cifUSD, rateToUSD) => {
      // Фиксированный сбор за таможенное декларирование в РК: 20 000 KZT
      const fee = 20000;
      return { feeAmount: fee, note: "Сбор за таможенное декларирование (20 000 ₸)" };
    },
  },
  RU: {
    code: "RU",
    name: "Россия",
    shortName: "Россия",
    countryNameGenitive: "России",
    customsAuthority: "Федеральная таможенная служба (ФТС РФ, ЕАЭС)",
    customsWebsite: "https://customs.gov.ru",
    currencyCode: "RUB",
    currencySymbol: "₽",
    defaultRateToUSD: 92,
    vatRate: 20,
    vatName: "НДС РФ 20%",
    hasDeMinimisIndividual: true,
    individualDeMinimisUSD: 220, // ~€200
    individualDeMinimisKg: 31,
    individualExcessDutyRate: 15,
    deMinimisRuleName: "Решение Совета ЕЭК №107 (ЕАЭС)",
    deMinimisNote:
      "Норма ЕАЭС: до €200 (~$220) и 31 кг. На сумму превышения начисляется 15% (не менее €2 за 1 кг) + сбор 500 ₽.",
    legalCustomsFeeFormula: (cifUSD, rateToUSD) => {
      const cifRUB = cifUSD * rateToUSD;
      // Шкала таможенных сборов РФ
      let fee = 775;
      if (cifRUB > 200000) fee = 1550;
      if (cifRUB > 450000) fee = 3100;
      if (cifRUB > 1200000) fee = 8530;
      return { feeAmount: fee, note: "Таможенный сбор за совершение таможенных операций" };
    },
  },
  TR: {
    code: "TR",
    name: "Турция",
    shortName: "Турция",
    countryNameGenitive: "Турции",
    customsAuthority: "Министерство торговли Турции (Ticaret Bakanlığı)",
    customsWebsite: "https://www.ticaret.gov.tr",
    currencyCode: "TRY",
    currencySymbol: "₺",
    defaultRateToUSD: 34,
    vatRate: 20,
    vatName: "KDV 20%",
    hasDeMinimisIndividual: true,
    individualDeMinimisUSD: 33, // ~€30 по новым правилам 2024
    individualDeMinimisKg: 30,
    individualExcessDutyRate: 30,
    deMinimisRuleName: "Таможенный регламент Турции 2024",
    deMinimisNote:
      "Лимит посылок для физлиц: €30 (~$33). Пошлина 30% (из ЕС) или 60% (из остальных стран) + KDV 20%.",
    legalCustomsFeeFormula: (cifUSD, rateToUSD) => {
      const cifTRY = cifUSD * rateToUSD;
      const fee = Math.max(500, Math.round(cifTRY * 0.005));
      return { feeAmount: fee, note: "Таможенный сервисный сбор Турции" };
    },
  },
  DE: {
    code: "DE",
    name: "Германия (ЕС)",
    shortName: "Германия",
    countryNameGenitive: "Германии и Евросоюза",
    customsAuthority: "Таможенная служба Германии (Bundeszollverwaltung)",
    customsWebsite: "https://www.zoll.de",
    currencyCode: "EUR",
    currencySymbol: "€",
    defaultRateToUSD: 0.92,
    vatRate: 19,
    vatName: "MwSt 19%",
    hasDeMinimisIndividual: true,
    individualDeMinimisUSD: 165, // ~€150 для пошлины
    individualDeMinimisKg: 30,
    individualExcessDutyRate: 10,
    deMinimisRuleName: "Таможенный кодекс ЕС (UCC)",
    deMinimisNote:
      "В ЕС НДС 19% начисляется с любого евро (IOSS). Таможенная пошлина начисляется при заказе от €150 (~$165).",
    legalCustomsFeeFormula: (cifUSD, rateToUSD) => {
      const fee = 15; // €15 стандартный сбор
      return { feeAmount: fee, note: "EU Customs clearance fee (€15)" };
    },
  },
  AE: {
    code: "AE",
    name: "ОАЭ",
    shortName: "ОАЭ",
    countryNameGenitive: "ОАЭ",
    customsAuthority: "Federal Authority for Identity & Customs (ОАЭ)",
    customsWebsite: "https://www.dubaicustoms.gov.ae",
    currencyCode: "AED",
    currencySymbol: "AED",
    defaultRateToUSD: 3.67,
    vatRate: 5,
    vatName: "VAT 5%",
    hasDeMinimisIndividual: true,
    individualDeMinimisUSD: 80, // ~300 AED
    individualDeMinimisKg: 30,
    individualExcessDutyRate: 5,
    deMinimisRuleName: "Таможенные правила ОАЭ (300 AED)",
    deMinimisNote:
      "Посылки до 300 AED (~$80) ввозятся беспошлинно. Свыше 300 AED начисляется пошлина 5% и НДС 5%.",
    legalCustomsFeeFormula: (cifUSD, rateToUSD) => {
      const fee = 70; // 70 AED
      return { feeAmount: fee, note: "Dubai/UAE Customs declaration fee (70 AED)" };
    },
  },
  CN: {
    code: "CN",
    name: "Китай",
    shortName: "Китай",
    countryNameGenitive: "Китая",
    customsAuthority: "Главное таможенное управление КНР (GACC)",
    customsWebsite: "http://www.customs.gov.cn",
    currencyCode: "CNY",
    currencySymbol: "¥",
    defaultRateToUSD: 7.25,
    vatRate: 13,
    vatName: "НДС КНР 13%",
    hasDeMinimisIndividual: true,
    individualDeMinimisUSD: 70, // 500 CNY
    individualDeMinimisKg: 30,
    individualExcessDutyRate: 20,
    deMinimisRuleName: "Правила трансграничной торговли КНР",
    deMinimisNote:
      "Лимит на личные посылки: 500 CNY (~$70). На превышение начисляется налог на трансграничную торговлю.",
    legalCustomsFeeFormula: (cifUSD, rateToUSD) => {
      const fee = 50; // 50 CNY
      return { feeAmount: fee, note: "Сбор за таможенное оформление ГТУ КНР" };
    },
  },
  KR: {
    code: "KR",
    name: "Южная Корея",
    shortName: "Юж. Корея",
    countryNameGenitive: "Южной Кореи",
    customsAuthority: "Таможенная служба Республики Корея (KCS)",
    customsWebsite: "https://www.customs.go.kr",
    currencyCode: "KRW",
    currencySymbol: "₩",
    defaultRateToUSD: 1350,
    vatRate: 10,
    vatName: "VAT 10%",
    hasDeMinimisIndividual: true,
    individualDeMinimisUSD: 150,
    individualDeMinimisKg: 30,
    individualExcessDutyRate: 15,
    deMinimisRuleName: "Таможенный регламент Республики Корея (KCS)",
    deMinimisNote:
      "Беспошлинный ввоз для личных посылок: до $150 (из США — до $200). На превышение начисляется пошлина 15% и VAT 10%.",
    legalCustomsFeeFormula: (cifUSD, rateToUSD) => {
      const fee = Math.max(10000, Math.round(cifUSD * rateToUSD * 0.002));
      return { feeAmount: fee, note: "Сбор за таможенное оформление KCS (Корея)" };
    },
  },
  BY: {
    code: "BY",
    name: "Беларусь",
    shortName: "Беларусь",
    countryNameGenitive: "Беларуси",
    customsAuthority: "ГТК Республики Беларусь (ЕАЭС)",
    customsWebsite: "https://www.customs.gov.by",
    currencyCode: "BYN",
    currencySymbol: "Br",
    defaultRateToUSD: 3.25,
    vatRate: 20,
    vatName: "НДС РБ 20%",
    hasDeMinimisIndividual: true,
    individualDeMinimisUSD: 220, // ~€200
    individualDeMinimisKg: 31,
    individualExcessDutyRate: 15,
    deMinimisRuleName: "Решение Совета ЕЭК №107 (ЕАЭС)",
    deMinimisNote:
      "Норма ЕАЭС: до €200 (~$220) и 31 кг. На сумму превышения начисляется 15% (не менее €2 за 1 кг) + сбор 10 Br.",
    legalCustomsFeeFormula: () => {
      return { feeAmount: 120, note: "Таможенный сбор за совершение операций (120 Br)" };
    },
  },
  KG: {
    code: "KG",
    name: "Кыргызстан",
    shortName: "Кыргызстан",
    countryNameGenitive: "Кыргызстана",
    customsAuthority: "ГТС при Минфине Кыргызской Республики (ЕАЭС)",
    customsWebsite: "https://customs.gov.kg",
    currencyCode: "KGS",
    currencySymbol: "сом",
    defaultRateToUSD: 89,
    vatRate: 12,
    vatName: "НДС КР 12%",
    hasDeMinimisIndividual: true,
    individualDeMinimisUSD: 220, // ~€200
    individualDeMinimisKg: 31,
    individualExcessDutyRate: 15,
    deMinimisRuleName: "Решение Совета ЕЭК №107 (ЕАЭС)",
    deMinimisNote:
      "Норма ЕАЭС: до €200 (~$220) и 31 кг. На сумму превышения начисляется 15% (не менее €2 за 1 кг) + сбор.",
    legalCustomsFeeFormula: () => {
      return { feeAmount: 2500, note: "Сбор за таможенное оформление ГТС КР (2 500 сом)" };
    },
  },
  TJ: {
    code: "TJ",
    name: "Таджикистан",
    shortName: "Таджикистан",
    countryNameGenitive: "Таджикистана",
    customsAuthority: "Таможенная служба Республики Таджикистан",
    customsWebsite: "https://customs.tj",
    currencyCode: "TJS",
    currencySymbol: "смн",
    defaultRateToUSD: 10.9,
    vatRate: 14,
    vatName: "НДС РТ 14%",
    hasDeMinimisIndividual: true,
    individualDeMinimisUSD: 200,
    individualDeMinimisKg: 30,
    individualExcessDutyRate: 20,
    deMinimisRuleName: "Таможенный кодекс Республики Таджикистан",
    deMinimisNote:
      "Беспошлинный ввоз для личных посылок: до $200. На сумму превышения взимается ставка пошлины и НДС 14%.",
    legalCustomsFeeFormula: (cifUSD, rateToUSD) => {
      const fee = Math.max(100, Math.round(cifUSD * rateToUSD * 0.003));
      return { feeAmount: fee, note: "Сбор за таможенное оформление ТС РТ" };
    },
  },
  IN: {
    code: "IN",
    name: "Индия",
    shortName: "Индия",
    countryNameGenitive: "Индии",
    customsAuthority: "Таможенная служба Индии (CBIC)",
    customsWebsite: "https://www.cbic.gov.in",
    currencyCode: "INR",
    currencySymbol: "₹",
    defaultRateToUSD: 84,
    vatRate: 18,
    vatName: "IGST 18%",
    hasDeMinimisIndividual: true,
    individualDeMinimisUSD: 60, // ~5000 INR
    individualDeMinimisKg: 30,
    individualExcessDutyRate: 20,
    deMinimisRuleName: "Индийский таможенный регламент (CBIC)",
    deMinimisNote:
      "Беспошлинный ввоз для личных подарков/посылок до ₹5 000 (~$60). При коммерческом ввозе начисляется BCD и IGST 18%.",
    legalCustomsFeeFormula: () => {
      return { feeAmount: 1500, note: "Сбор за таможенное оформление CBIC (₹1 500)" };
    },
  },
  IT: {
    code: "IT",
    name: "Италия (ЕС)",
    shortName: "Италия",
    countryNameGenitive: "Италии и Евросоюза",
    customsAuthority: "Агентство таможен и монополий Италии (ADM, ЕС)",
    customsWebsite: "https://www.adm.gov.it",
    currencyCode: "EUR",
    currencySymbol: "€",
    defaultRateToUSD: 0.92,
    vatRate: 22,
    vatName: "IVA 22%",
    hasDeMinimisIndividual: true,
    individualDeMinimisUSD: 165, // ~€150
    individualDeMinimisKg: 30,
    individualExcessDutyRate: 10,
    deMinimisRuleName: "Таможенный кодекс ЕС (UCC) / IVA",
    deMinimisNote:
      "В ЕС налог IVA 22% начисляется со всех покупок (IOSS). Таможенная пошлина начисляется при стоимости заказа свыше €150 (~$165).",
    legalCustomsFeeFormula: () => {
      return { feeAmount: 15, note: "Сбор за оформление таможни Италии (€15)" };
    },
  },
  GB: {
    code: "GB",
    name: "Великобритания",
    shortName: "UK (Британия)",
    countryNameGenitive: "Великобритании",
    customsAuthority: "Таможенная служба Великобритании (HMRC)",
    customsWebsite: "https://www.gov.uk/government/organisations/hm-revenue-customs",
    currencyCode: "GBP",
    currencySymbol: "£",
    defaultRateToUSD: 0.78,
    vatRate: 20,
    vatName: "UK VAT 20%",
    hasDeMinimisIndividual: true,
    individualDeMinimisUSD: 175, // ~£135
    individualDeMinimisKg: 30,
    individualExcessDutyRate: 10,
    deMinimisRuleName: "UK Customs Duty & Import VAT (HMRC)",
    deMinimisNote:
      "Беспошлинный порог пошлины: до £135 (~$175). Импортный VAT 20% начисляется на все входящие посылки.",
    legalCustomsFeeFormula: () => {
      return { feeAmount: 12, note: "Сбор за таможенное оформление HMRC (£12)" };
    },
  },
};

const COUNTRY_NAMES_MAP: Record<
  string,
  { name: string; shortName: string; genitive: string; authority: string; website: string }
> = {
  UZ: {
    name: "Узбекистан",
    shortName: "Узбекистан",
    genitive: "Узбекистана",
    authority: "ГТК Республики Узбекистан",
    website: "https://customs.uz",
  },
  CN: {
    name: "Китай",
    shortName: "Китай",
    genitive: "Китая",
    authority: "Главное таможенное управление КНР (GACC)",
    website: "http://www.customs.gov.cn",
  },
  TR: {
    name: "Турция",
    shortName: "Турция",
    genitive: "Турции",
    authority: "Министерство торговли Турции",
    website: "https://www.ticaret.gov.tr",
  },
  RU: {
    name: "Россия",
    shortName: "Россия",
    genitive: "России",
    authority: "ФТС России (ЕАЭС)",
    website: "https://customs.gov.ru",
  },
  KZ: {
    name: "Казахстан",
    shortName: "Казахстан",
    genitive: "Казахстана",
    authority: "КГД МФ РК (ЕАЭС)",
    website: "https://kgd.gov.kz",
  },
  DE: {
    name: "Германия",
    shortName: "Германия",
    genitive: "Германии",
    authority: "Таможенная служба Германии",
    website: "https://www.zoll.de",
  },
  AE: {
    name: "ОАЭ",
    shortName: "ОАЭ",
    genitive: "ОАЭ",
    authority: "Федеральная таможенная служба ОАЭ",
    website: "https://www.dubaicustoms.gov.ae",
  },
  US: {
    name: "США",
    shortName: "США",
    genitive: "США",
    authority: "Таможенная служба США (U.S. CBP)",
    website: "https://www.cbp.gov",
  },
  KR: {
    name: "Южная Корея",
    shortName: "Юж. Корея",
    genitive: "Южной Кореи",
    authority: "Таможенная служба Республики Корея",
    website: "https://www.customs.go.kr",
  },
  BY: {
    name: "Беларусь",
    shortName: "Беларусь",
    genitive: "Беларуси",
    authority: "ГТК Республики Беларусь",
    website: "https://www.customs.gov.by",
  },
  KG: {
    name: "Кыргызстан",
    shortName: "Кыргызстан",
    genitive: "Кыргызстана",
    authority: "ГТС при Минфине Кыргызской Республики",
    website: "https://customs.gov.kg",
  },
  TJ: {
    name: "Таджикистан",
    shortName: "Таджикистан",
    genitive: "Таджикистана",
    authority: "Таможенная служба Республики Таджикистан",
    website: "https://customs.tj",
  },
  IN: {
    name: "Индия",
    shortName: "Индия",
    genitive: "Индии",
    authority: "Таможенная служба Индии (CBIC)",
    website: "https://www.cbic.gov.in",
  },
  IT: {
    name: "Италия",
    shortName: "Италия",
    genitive: "Италии",
    authority: "Агентство таможен Италии",
    website: "https://www.adm.gov.it",
  },
  GB: {
    name: "Великобритания",
    shortName: "UK (Британия)",
    genitive: "Великобритании",
    authority: "Таможенная служба Великобритании (HMRC)",
    website: "https://www.gov.uk/government/organisations/hm-revenue-customs",
  },
};

export function getCountryProfile(countryCode: string): CountryCustomsProfile {
  const upper = countryCode.toUpperCase();
  if (COUNTRY_PROFILES[upper]) {
    return COUNTRY_PROFILES[upper];
  }

  const meta = COUNTRY_NAMES_MAP[upper] || {
    name: upper,
    shortName: upper,
    genitive: upper,
    authority: `Таможенная служба (${upper})`,
    website: "https://www.wcoomd.org",
  };

  return {
    code: upper,
    name: meta.name,
    shortName: meta.shortName || meta.name,
    countryNameGenitive: meta.genitive,
    customsAuthority: meta.authority,
    customsWebsite: meta.website || "https://www.wcoomd.org",
    currencyCode: "USD",
    currencySymbol: "$",
    defaultRateToUSD: 1,
    vatRate: 10,
    vatName: "Local VAT (10%)",
    hasDeMinimisIndividual: true,
    individualDeMinimisUSD: 500,
    individualDeMinimisKg: 30,
    individualExcessDutyRate: 15,
    deMinimisRuleName: "Международный стандарт CIF",
    deMinimisNote:
      "Стандартный беспошлинный порог для физлиц ~$500. На превышение начисляется пошлина 15%.",
    legalCustomsFeeFormula: (cifUSD) => ({
      feeAmount: Math.round(Math.max(25, cifUSD * 0.005)),
      note: "Международный сбор за таможенное оформление",
    }),
  };
}

export function formatCustomCurrency(
  amount: number,
  currencyCode: string,
  currencySymbol: string,
): string {
  const rounded = Math.round(amount);
  const formattedNumber = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  switch (currencyCode) {
    case "USD":
      return `$${formattedNumber}`;
    case "EUR":
      return `€${formattedNumber}`;
    case "GBP":
      return `£${formattedNumber}`;
    case "RUB":
      return `${formattedNumber} ₽`;
    case "KZT":
      return `${formattedNumber} ₸`;
    case "TRY":
      return `${formattedNumber} ₺`;
    case "CNY":
      return `¥${formattedNumber}`;
    case "KRW":
      return `₩${formattedNumber}`;
    case "BYN":
      return `${formattedNumber} Br`;
    case "KGS":
      return `${formattedNumber} сом`;
    case "TJS":
      return `${formattedNumber} смн`;
    case "INR":
      return `₹${formattedNumber}`;
    case "AED":
      return `${formattedNumber} AED`;
    case "UZS":
    default:
      return `${formattedNumber} UZS`;
  }
}
