/**
 * Russian number to words converter with proper financial declensions
 */

const ONES_MASCULINE = ['', 'один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять'];
const ONES_FEMININE = ['', 'одна', 'две', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять'];
const TEENS = [
  'десять',
  'одиннадцать',
  'двенадцать',
  'тринадцать',
  'четырнадцать',
  'пятнадцать',
  'шестнадцать',
  'семнадцать',
  'восемнадцать',
  'девятнадцать',
];
const TENS = ['', '', 'двадцать', 'тридцать', 'сорок', 'пятьдесят', 'шестьдесят', 'семьдесят', 'восемьдесят', 'девяносто'];
const HUNDREDS = [
  '',
  'сто',
  'двести',
  'триста',
  'четыреста',
  'пятьсот',
  'шестьсот',
  'семьсот',
  'восемьсот',
  'девятьсот',
];

interface FormForms {
  one: string;
  twoToFour: string;
  other: string;
  isFeminine?: boolean;
}

const ORDERS: { [key: number]: FormForms } = {
  1: { one: 'тысяча', twoToFour: 'тысячи', other: 'тысяч', isFeminine: true },
  2: { one: 'миллион', twoToFour: 'миллиона', other: 'миллионов', isFeminine: false },
  3: { one: 'миллиард', twoToFour: 'миллиарда', other: 'миллиардов', isFeminine: false },
  4: { one: 'триллион', twoToFour: 'триллиона', other: 'триллионов', isFeminine: false },
};

const CURRENCY_DECLENSIONS: Record<string, { main: FormForms; sub: FormForms }> = {
  USD: {
    main: { one: 'доллар США', twoToFour: 'доллара США', other: 'долларов США', isFeminine: false },
    sub: { one: 'цент', twoToFour: 'цента', other: 'центов', isFeminine: false },
  },
  EUR: {
    main: { one: 'евро', twoToFour: 'евро', other: 'евро', isFeminine: false },
    sub: { one: 'евроцент', twoToFour: 'евроцента', other: 'евроцентов', isFeminine: false },
  },
  GBP: {
    main: { one: 'британский фунт', twoToFour: 'британских фунта', other: 'британских фунтов', isFeminine: false },
    sub: { one: 'пенс', twoToFour: 'пенса', other: 'пенсов', isFeminine: false },
  },
  CAD: {
    main: { one: 'канадский доллар', twoToFour: 'канадских доллара', other: 'канадских долларов', isFeminine: false },
    sub: { one: 'цент', twoToFour: 'цента', other: 'центов', isFeminine: false },
  },
  AUD: {
    main: { one: 'австралийский доллар', twoToFour: 'австралийских доллара', other: 'австралийских долларов', isFeminine: false },
    sub: { one: 'цент', twoToFour: 'цента', other: 'центов', isFeminine: false },
  },
  CHF: {
    main: { one: 'швейцарский франк', twoToFour: 'швейцарских франка', other: 'швейцарских франков', isFeminine: false },
    sub: { one: 'сантим', twoToFour: 'сантима', other: 'сантимов', isFeminine: false },
  },
  AED: {
    main: { one: 'дирхам ОАЭ', twoToFour: 'дирхама ОАЭ', other: 'дирхамов ОАЭ', isFeminine: false },
    sub: { one: 'филс', twoToFour: 'филса', other: 'филсов', isFeminine: false },
  },
  TRY: {
    main: { one: 'турецкая лира', twoToFour: 'турецкие лиры', other: 'турецких лир', isFeminine: true },
    sub: { one: 'куруш', twoToFour: 'куруша', other: 'курушей', isFeminine: false },
  },
  CNY: {
    main: { one: 'китайский юань', twoToFour: 'китайских юаня', other: 'китайских юаней', isFeminine: false },
    sub: { one: 'фэнь', twoToFour: 'фэня', other: 'фэней', isFeminine: false },
  },
  JPY: {
    main: { one: 'японская иена', twoToFour: 'японские иены', other: 'японских иен', isFeminine: true },
    sub: { one: 'сен', twoToFour: 'сена', other: 'сенов', isFeminine: false },
  },
  UZS: {
    main: { one: 'узбекский сум', twoToFour: 'узбекских сума', other: 'узбекских сумов', isFeminine: false },
    sub: { one: 'тийин', twoToFour: 'тийина', other: 'тийинов', isFeminine: false },
  },
  KZT: {
    main: { one: 'казахстанский тенге', twoToFour: 'казахстанских тенге', other: 'казахстанских тенге', isFeminine: false },
    sub: { one: 'тиын', twoToFour: 'тиына', other: 'тиынов', isFeminine: false },
  },
  RUB: {
    main: { one: 'российский рубль', twoToFour: 'российских рубля', other: 'российских рублей', isFeminine: false },
    sub: { one: 'копейка', twoToFour: 'копейки', other: 'копеек', isFeminine: true },
  },
  GEL: {
    main: { one: 'грузинский лари', twoToFour: 'грузинских лари', other: 'грузинских лари', isFeminine: false },
    sub: { one: 'тетри', twoToFour: 'тетри', other: 'тетри', isFeminine: false },
  },
};

function getDeclension(n: number, forms: FormForms): string {
  const mod100 = Math.abs(n) % 100;
  const mod10 = mod100 % 10;
  if (mod100 >= 11 && mod100 <= 19) {
    return forms.other;
  }
  if (mod10 === 1) {
    return forms.one;
  }
  if (mod10 >= 2 && mod10 <= 4) {
    return forms.twoToFour;
  }
  return forms.other;
}

function tripletToWords(num: number, isFeminine = false): string {
  if (num === 0) return '';
  const result: string[] = [];

  const h = Math.floor(num / 100);
  const t = Math.floor((num % 100) / 10);
  const o = num % 10;

  if (h > 0) result.push(HUNDREDS[h]);

  if (t === 1) {
    result.push(TEENS[o]);
  } else {
    if (t > 1) result.push(TENS[t]);
    if (o > 0) {
      result.push(isFeminine ? ONES_FEMININE[o] : ONES_MASCULINE[o]);
    }
  }

  return result.join(' ');
}

export function numberToWordsRu(amount: number, currencyCode = 'USD'): string {
  if (isNaN(amount) || amount < 0) return '';
  
  const integerPart = Math.floor(amount);
  const fractionalPart = Math.round((amount - integerPart) * 100);

  const currInfo = CURRENCY_DECLENSIONS[currencyCode] || CURRENCY_DECLENSIONS['USD'];

  if (integerPart === 0) {
    const mainDecl = getDeclension(0, currInfo.main);
    const subStr = fractionalPart.toString().padStart(2, '0');
    const subDecl = getDeclension(fractionalPart, currInfo.sub);
    return `Ноль ${mainDecl} ${subStr} ${subDecl}`;
  }

  const chunks: number[] = [];
  let temp = integerPart;
  while (temp > 0) {
    chunks.push(temp % 1000);
    temp = Math.floor(temp / 1000);
  }

  const words: string[] = [];

  for (let i = chunks.length - 1; i >= 0; i--) {
    const chunk = chunks[i];
    if (chunk === 0) continue;

    const isFem = i === 1 ? true : (i === 0 ? currInfo.main.isFeminine ?? false : false);
    const chunkText = tripletToWords(chunk, isFem);
    if (!chunkText) continue;

    words.push(chunkText);

    if (i > 0 && ORDERS[i]) {
      words.push(getDeclension(chunk, ORDERS[i]));
    }
  }

  const mainCurrencyDecl = getDeclension(integerPart, currInfo.main);
  words.push(mainCurrencyDecl);

  const subNumStr = fractionalPart.toString().padStart(2, '0');
  const subCurrencyDecl = getDeclension(fractionalPart, currInfo.sub);

  const fullString = `${words.join(' ')} ${subNumStr} ${subCurrencyDecl}`;
  // Capitalize first letter
  return fullString.charAt(0).toUpperCase() + fullString.slice(1);
}

// English number to words
const EN_ONES = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const EN_TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const EN_SCALES = ['', 'thousand', 'million', 'billion', 'trillion'];

function tripletToWordsEn(num: number): string {
  const parts: string[] = [];
  const h = Math.floor(num / 100);
  const rem = num % 100;
  if (h > 0) {
    parts.push(`${EN_ONES[h]} hundred`);
  }
  if (rem > 0) {
    if (rem < 20) {
      parts.push(EN_ONES[rem]);
    } else {
      const ten = Math.floor(rem / 10);
      const one = rem % 10;
      parts.push(one > 0 ? `${EN_TENS[ten]}-${EN_ONES[one]}` : EN_TENS[ten]);
    }
  }
  return parts.join(' ');
}

export function numberToWordsEn(amount: number, currencyCode = 'USD'): string {
  if (isNaN(amount) || amount < 0) return '';
  const integerPart = Math.floor(amount);
  const cents = Math.round((amount - integerPart) * 100);

  let intWords = 'zero';
  if (integerPart > 0) {
    const chunks: number[] = [];
    let temp = integerPart;
    while (temp > 0) {
      chunks.push(temp % 1000);
      temp = Math.floor(temp / 1000);
    }
    const parts: string[] = [];
    for (let i = chunks.length - 1; i >= 0; i--) {
      const chunk = chunks[i];
      if (chunk === 0) continue;
      const text = tripletToWordsEn(chunk);
      if (text) {
        parts.push(i > 0 ? `${text} ${EN_SCALES[i]}` : text);
      }
    }
    intWords = parts.join(' ');
  }

  const currMap: Record<string, { main: string; sub: string }> = {
    USD: { main: integerPart === 1 ? 'US dollar' : 'US dollars', sub: cents === 1 ? 'cent' : 'cents' },
    EUR: { main: integerPart === 1 ? 'euro' : 'euros', sub: cents === 1 ? 'cent' : 'cents' },
    GBP: { main: integerPart === 1 ? 'British pound' : 'British pounds', sub: cents === 1 ? 'penny' : 'pence' },
    UZS: { main: 'sums', sub: 'tiyins' },
    RUB: { main: integerPart === 1 ? 'ruble' : 'rubles', sub: cents === 1 ? 'kopeck' : 'kopecks' },
    KZT: { main: 'tenge', sub: 'tiyins' },
    AED: { main: 'dirhams', sub: 'fils' },
  };
  const c = currMap[currencyCode] || { main: currencyCode, sub: 'cents' };
  const centsStr = cents.toString().padStart(2, '0');
  const res = `${intWords} ${c.main} ${centsStr} ${c.sub}`;
  return res.charAt(0).toUpperCase() + res.slice(1);
}

// Uzbek number to words
const UZ_ONES = ['', 'bir', 'ikki', 'uch', 'toʻrt', 'besh', 'olti', 'yetti', 'sakkiz', 'toʻqqiz'];
const UZ_TENS = ['', 'oʻn', 'yigirma', 'oʻttiz', 'qirq', 'ellik', 'oltmish', 'yetmish', 'sakson', 'toʻqson'];
const UZ_SCALES = ['', 'ming', 'million', 'milliard', 'trillion'];

function tripletToWordsUz(num: number): string {
  const parts: string[] = [];
  const h = Math.floor(num / 100);
  const rem = num % 100;
  if (h > 0) {
    parts.push(h === 1 ? 'bir yuz' : `${UZ_ONES[h]} yuz`);
  }
  if (rem > 0) {
    const ten = Math.floor(rem / 10);
    const one = rem % 10;
    if (ten > 0) parts.push(UZ_TENS[ten]);
    if (one > 0) parts.push(UZ_ONES[one]);
  }
  return parts.join(' ');
}

export function numberToWordsUz(amount: number, currencyCode = 'USD'): string {
  if (isNaN(amount) || amount < 0) return '';
  const integerPart = Math.floor(amount);
  const tiyin = Math.round((amount - integerPart) * 100);

  let intWords = 'nol';
  if (integerPart > 0) {
    const chunks: number[] = [];
    let temp = integerPart;
    while (temp > 0) {
      chunks.push(temp % 1000);
      temp = Math.floor(temp / 1000);
    }
    const parts: string[] = [];
    for (let i = chunks.length - 1; i >= 0; i--) {
      const chunk = chunks[i];
      if (chunk === 0) continue;
      const text = tripletToWordsUz(chunk);
      if (text) {
        parts.push(i > 0 ? `${text} ${UZ_SCALES[i]}` : text);
      }
    }
    intWords = parts.join(' ');
  }

  const currMapUz: Record<string, { main: string; sub: string }> = {
    USD: { main: 'AQSh dollari', sub: 'sent' },
    EUR: { main: 'yevro', sub: 'sent' },
    GBP: { main: 'funt sterling', sub: 'pens' },
    UZS: { main: 'soʻm', sub: 'tiyin' },
    RUB: { main: 'rubl', sub: 'tiyin' },
    KZT: { main: 'tenge', sub: 'tiyin' },
    AED: { main: 'BAA dirhami', sub: 'fils' },
  };
  const c = currMapUz[currencyCode] || { main: currencyCode, sub: 'tiyin' };
  const tiyinStr = tiyin.toString().padStart(2, '0');
  const res = `${intWords} ${c.main} ${tiyinStr} ${c.sub}`;
  return res.charAt(0).toUpperCase() + res.slice(1);
}

export function numberToWords(amount: number, currencyCode = 'USD', lang: 'ru' | 'en' | 'uz' = 'ru'): string {
  if (lang === 'en') return numberToWordsEn(amount, currencyCode);
  if (lang === 'uz') return numberToWordsUz(amount, currencyCode);
  return numberToWordsRu(amount, currencyCode);
}

