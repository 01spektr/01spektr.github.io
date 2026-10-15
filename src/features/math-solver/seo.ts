import type { Locale } from "@/lib/i18n/config";
import { localizedToolPath } from "@/lib/i18n/config";
import { seoHead } from "@/lib/seo";

const SITE_URL = "https://toolboxi.uz";

const metadata: Record<Locale, { title: string; description: string }> = {
  ru: {
    title:
      "Математический калькулятор онлайн — пошаговое решение уравнений, производных, интегралов и графики — Toolboxi.uz",
    description:
      "Бесплатный символьный математический калькулятор: пошаговое решение уравнений, систем, неравенств, нахождение производных и интегралов, построение графиков функций 2D, матрицы и шпаргалки по формулам.",
  },
  uz: {
    title:
      "Matematik kalkulyator onlayn — tenglamalar, hosilalar, integrallar va grafiklar yechish — Toolboxi.uz",
    description:
      "Bepul simvolli matematik kalkulyator: tenglamalar, tengsizliklar va sistemalarni bosqichma-bosqich yechish, hosila va integrallar hisoblash, 2D funksiya grafigini chizish hamda formulalar ma’lumotnomasi.",
  },
  en: {
    title:
      "Math Solver & Graphing Calculator Online — Step-by-Step Solutions & CAS Engine — Toolboxi.uz",
    description:
      "Free online symbolic math solver and grapher: step-by-step solutions for algebraic equations, systems, inequalities, derivatives, integrals, matrix operations, and formula cheat sheets.",
  },
};

export function mathSolverHead(locale: Locale) {
  const path = localizedToolPath("math-solver", locale);
  return seoHead({
    ...metadata[locale],
    path,
    alternates: [
      { hrefLang: "en", href: `${SITE_URL}/tools/math-solver/` },
      { hrefLang: "ru", href: `${SITE_URL}/ru/tools/math-solver/` },
      { hrefLang: "uz", href: `${SITE_URL}/uz/tools/math-solver/` },
      { hrefLang: "x-default", href: `${SITE_URL}/tools/math-solver/` },
    ],
  });
}
