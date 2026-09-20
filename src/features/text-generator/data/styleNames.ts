import type { Language } from "../context/LanguageContext";

const EN: Record<string, string> = {
  plain: "Plain text",
  bold: "Bold",
  italic: "Italic",
  "bold-italic": "Bold italic",
  underline: "Underlined",
  strikethrough: "Strikethrough",
  monospace: "Monospace",
  bubbles: "Bubbles",
  squared: "Squared",
  flipped: "Flipped",
  "small-caps": "Small caps",
  aesthetic: "Aesthetic",
  double: "Double-struck",
  decorative: "Decorative",
  "dark-bubbles": "Dark bubbles",
  "dark-squared": "Dark squares",
  "double-underline": "Double underline",
  "slash-through": "Slash-through",
  "wavy-underline": "Wavy underline",
  sparkles: "Sparkles",
  hearts: "Hearts",
  "love-wings": "Love wings",
  floral: "Floral",
  stars: "Stars",
  wings: "Wings",
  royal: "Royal",
  gothic: "Gothic (Fraktur)",
  "bold-gothic": "Bold gothic",
  script: "Script",
  "bold-script": "Bold script",
  "japanese-brackets": "Japanese brackets",
  "diamond-brackets": "Diamond brackets",
  fullwidth: "Fullwidth",
  superscript: "Superscript",
  subscript: "Subscript",
  glitch: "Glitch (Zalgo)",
};

const UZ: Record<string, string> = {
  plain: "Oddiy matn",
  bold: "Qalin",
  italic: "Kursiv",
  "bold-italic": "Qalin kursiv",
  underline: "Tagi chizilgan",
  strikethrough: "Usti chizilgan",
  monospace: "Bir xil kenglikdagi",
  bubbles: "Pufakchalar",
  squared: "Kvadratlar",
  flipped: "Teskari",
  "small-caps": "Kichik bosh harflar",
  aesthetic: "Estetik",
  double: "Ikki chiziqli",
  decorative: "Bezakli",
  "dark-bubbles": "To‘q pufakchalar",
  "dark-squared": "To‘q kvadratlar",
  "double-underline": "Ikki marta tagi chizilgan",
  "slash-through": "Qiya chiziqli",
  "wavy-underline": "To‘lqinli tagchiziq",
  sparkles: "Yaltiroq",
  hearts: "Yurakchalar",
  "love-wings": "Qanotli sevgi",
  floral: "Gulli",
  stars: "Yulduzli",
  wings: "Qanotlar",
  royal: "Qirollik",
  gothic: "Gotik (Fraktur)",
  "bold-gothic": "Qalin gotik",
  script: "Qo‘lyozma",
  "bold-script": "Qalin qo‘lyozma",
  "japanese-brackets": "Yapon qavslari",
  "diamond-brackets": "Rombsimon qavslar",
  fullwidth: "Keng (Fullwidth)",
  superscript: "Yuqori indeks",
  subscript: "Quyi indeks",
  glitch: "Glitch (Zalgo)",
};

export function styleName(id: string, fallback: string, lang: Language): string {
  if (lang === "en") return EN[id] ?? fallback;
  if (lang === "uz") return UZ[id] ?? fallback;
  return fallback;
}

export function styleBadge(badge: string | undefined, lang: Language): string | undefined {
  if (!badge || lang === "ru") return badge;
  if (badge === "Топ") return lang === "uz" ? "Top" : "Top";
  if (badge === "Тренд") return lang === "uz" ? "Trend" : "Trending";
  return badge;
}
