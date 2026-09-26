import { Currency } from "../types";
import { numberToWordsRu } from "./numberToWordsRu";

const EN_ONES = [
  "",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
];

const EN_TENS = [
  "",
  "",
  "twenty",
  "thirty",
  "forty",
  "fifty",
  "sixty",
  "seventy",
  "eighty",
  "ninety",
];

const EN_SCALES = ["", "thousand", "million", "billion", "trillion"];

function numberToWordsEnRaw(num: number): string {
  if (num === 0) return "zero";
  const integerPart = Math.floor(Math.abs(num));
  if (integerPart === 0) return "zero";

  function convertTriplet(n: number): string {
    let result = "";
    const hundred = Math.floor(n / 100);
    const rest = n % 100;

    if (hundred > 0) {
      result += EN_ONES[hundred] + " hundred";
      if (rest > 0) result += " and ";
    }

    if (rest > 0) {
      if (rest < 20) {
        result += EN_ONES[rest];
      } else {
        const ten = Math.floor(rest / 10);
        const one = rest % 10;
        result += EN_TENS[ten];
        if (one > 0) result += "-" + EN_ONES[one];
      }
    }
    return result;
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
    if (chunk > 0) {
      const tripletText = convertTriplet(chunk);
      const scaleText = EN_SCALES[i];
      words.push(tripletText + (scaleText ? " " + scaleText : ""));
    }
  }

  return words.join(", ");
}

// Uzbek numbers
const UZ_ONES = ["", "bir", "ikki", "uch", "to'rt", "besh", "olti", "yetti", "sakkiz", "to'qqiz"];
const UZ_TENS = [
  "",
  "o'n",
  "yigirma",
  "o'ttiz",
  "qirq",
  "ellik",
  "oltmish",
  "yetmish",
  "sakson",
  "to'qson",
];
const UZ_SCALES = ["", "ming", "million", "milliard", "trillion"];

function numberToWordsUzRaw(num: number): string {
  if (num === 0) return "nol";
  const integerPart = Math.floor(Math.abs(num));
  if (integerPart === 0) return "nol";

  function convertTriplet(n: number): string {
    const parts: string[] = [];
    const hundred = Math.floor(n / 100);
    const rest = n % 100;

    if (hundred > 0) {
      if (hundred === 1) {
        parts.push("bir yuz");
      } else {
        parts.push(UZ_ONES[hundred] + " yuz");
      }
    }

    if (rest > 0) {
      const ten = Math.floor(rest / 10);
      const one = rest % 10;
      if (ten > 0) parts.push(UZ_TENS[ten]);
      if (one > 0) parts.push(UZ_ONES[one]);
    }
    return parts.join(" ");
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
    if (chunk > 0) {
      const tripletText = convertTriplet(chunk);
      const scaleText = UZ_SCALES[i];
      words.push(tripletText + (scaleText ? " " + scaleText : ""));
    }
  }

  return words.join(" ");
}

export function formatAmountInWords(
  amount: number,
  currency: Currency,
  lang: "ru" | "en" | "uz" = "ru",
): string {
  if (lang === "ru") {
    return numberToWordsRu(amount, currency);
  }

  if (lang === "en") {
    const words = numberToWordsEnRaw(amount);
    const capitalized = words.charAt(0).toUpperCase() + words.slice(1);
    const curLabel =
      currency === "$"
        ? "US dollars"
        : currency === "€"
          ? "Euros"
          : currency === "₽"
            ? "Russian rubles"
            : currency === "₸"
              ? "Kazakhstani tenge"
              : "Uzbek sums";
    return `${capitalized} ${curLabel}`;
  }

  // uz
  const words = numberToWordsUzRaw(amount);
  const capitalized = words.charAt(0).toUpperCase() + words.slice(1);
  const curLabel =
    currency === "$"
      ? "AQSH dollari"
      : currency === "€"
        ? "Yevro"
        : currency === "₽"
          ? "Rossiya rubli"
          : currency === "₸"
            ? "Qozogʻiston tengesi"
            : "so'm";
  return `${capitalized} ${curLabel}`;
}
