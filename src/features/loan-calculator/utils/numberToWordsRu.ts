/**
 * Translates integer or decimal numbers into full Russian words with proper currency declension.
 */

type CurrencyType = "сум" | "₽" | "$" | "€" | "₸";

interface UnitDeclension {
  one: string;
  two: string;
  five: string;
  gender: "m" | "f";
}

const ONES_M = [
  "",
  "один",
  "два",
  "три",
  "четыре",
  "пять",
  "шесть",
  "семь",
  "восемь",
  "девять",
  "десять",
  "одиннадцать",
  "двенадцать",
  "тринадцать",
  "четырнадцать",
  "пятнадцать",
  "шестнадцать",
  "семнадцать",
  "восемнадцать",
  "девятнадцать",
];

const ONES_F = [
  "",
  "одна",
  "две",
  "три",
  "четыре",
  "пять",
  "шесть",
  "семь",
  "восемь",
  "девять",
  "десять",
  "одиннадцать",
  "двенадцать",
  "тринадцать",
  "четырнадцать",
  "пятнадцать",
  "шестнадцать",
  "семнадцать",
  "восемнадцать",
  "девятнадцать",
];

const TENS = [
  "",
  "",
  "двадцать",
  "тридцать",
  "сорок",
  "пятьдесят",
  "шестьдесят",
  "семьдесят",
  "восемьдесят",
  "девяносто",
];

const HUNDREDS = [
  "",
  "сто",
  "двести",
  "триста",
  "четыреста",
  "пятьсот",
  "шестьсот",
  "семьсот",
  "восемьсот",
  "девятьсот",
];

const ORDERS: { one: string; two: string; five: string; gender: "m" | "f" }[] = [
  { one: "тысяча", two: "тысячи", five: "тысяч", gender: "f" },
  { one: "миллион", two: "миллиона", five: "миллионов", gender: "m" },
  { one: "миллиард", two: "миллиарда", five: "миллиардов", gender: "m" },
  { one: "триллион", two: "триллиона", five: "триллионов", gender: "m" },
];

const CURRENCY_DECLENSIONS: Record<
  CurrencyType,
  {
    main: UnitDeclension;
    fraction: UnitDeclension;
  }
> = {
  сум: {
    main: { one: "сум", two: "сума", five: "сумов", gender: "m" },
    fraction: { one: "тийин", two: "тийина", five: "тийинов", gender: "m" },
  },
  "₽": {
    main: { one: "рубль", two: "рубля", five: "рублей", gender: "m" },
    fraction: { one: "копейка", two: "копейки", five: "копеек", gender: "f" },
  },
  $: {
    main: { one: "доллар США", two: "доллара США", five: "долларов США", gender: "m" },
    fraction: { one: "цент", two: "цента", five: "центов", gender: "m" },
  },
  "€": {
    main: { one: "евро", two: "евро", five: "евро", gender: "m" },
    fraction: { one: "цент", two: "цента", five: "центов", gender: "m" },
  },
  "₸": {
    main: { one: "тенге", two: "тенге", five: "тенге", gender: "m" },
    fraction: { one: "тиын", two: "тиына", five: "тиынов", gender: "m" },
  },
};

function getDeclension(n: number, unit: UnitDeclension): string {
  const mod100 = Math.abs(n) % 100;
  const mod10 = mod100 % 10;
  if (mod100 > 10 && mod100 < 20) return unit.five;
  if (mod10 === 1) return unit.one;
  if (mod10 >= 2 && mod10 <= 4) return unit.two;
  return unit.five;
}

function tripletToWords(num: number, gender: "m" | "f"): string {
  const parts: string[] = [];
  const h = Math.floor(num / 100);
  const t = Math.floor((num % 100) / 10);
  const o = num % 10;
  const lastTwo = num % 100;

  if (h > 0) parts.push(HUNDREDS[h]);

  if (lastTwo >= 10 && lastTwo < 20) {
    parts.push(gender === "f" ? ONES_F[lastTwo] : ONES_M[lastTwo]);
  } else {
    if (t > 0) parts.push(TENS[t]);
    if (o > 0) parts.push(gender === "f" ? ONES_F[o] : ONES_M[o]);
  }

  return parts.join(" ");
}

export function numberToWordsRu(amount: number, currency: CurrencyType = "сум"): string {
  if (isNaN(amount) || amount === 0) {
    const cur = CURRENCY_DECLENSIONS[currency].main;
    return `Ноль ${cur.five} 00 ${CURRENCY_DECLENSIONS[currency].fraction.five}`;
  }

  const rounded = Math.round(amount * 100) / 100;
  const wholePart = Math.floor(rounded);
  const fractionalPart = Math.round((rounded - wholePart) * 100);

  const curConfig = CURRENCY_DECLENSIONS[currency] || CURRENCY_DECLENSIONS["сум"];

  if (wholePart === 0) {
    const words = `ноль ${curConfig.main.five}`;
    const fracStr = fractionalPart.toString().padStart(2, "0");
    const fracWord = getDeclension(fractionalPart, curConfig.fraction);
    const capitalized = words.charAt(0).toUpperCase() + words.slice(1);
    return `${capitalized} ${fracStr} ${fracWord}`;
  }

  const triplets: number[] = [];
  let temp = wholePart;
  while (temp > 0) {
    triplets.push(temp % 1000);
    temp = Math.floor(temp / 1000);
  }

  const parts: string[] = [];

  for (let i = triplets.length - 1; i >= 0; i--) {
    const triplet = triplets[i];
    if (triplet === 0) continue;

    if (i === 0) {
      // Units
      const words = tripletToWords(triplet, curConfig.main.gender);
      if (words) parts.push(words);
    } else {
      const order = ORDERS[i - 1];
      const words = tripletToWords(triplet, order.gender);
      const decl = getDeclension(triplet, order);
      if (words) parts.push(`${words} ${decl}`);
    }
  }

  const mainCurrencyWord = getDeclension(wholePart, curConfig.main);
  parts.push(mainCurrencyWord);

  const fracStr = fractionalPart.toString().padStart(2, "0");
  const fracWord = getDeclension(fractionalPart, curConfig.fraction);

  const fullSentence = `${parts.join(" ")} ${fracStr} ${fracWord}`.replace(/\s+/g, " ").trim();
  return fullSentence.charAt(0).toUpperCase() + fullSentence.slice(1);
}
