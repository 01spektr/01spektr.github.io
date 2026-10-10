import type { Locale } from "@/lib/i18n/config";
import { localizedToolPath } from "@/lib/i18n/config";
import { seoHead } from "@/lib/seo";

const SITE_URL = "https://toolboxi.uz";

const metadata: Record<Locale, { title: string; description: string }> = {
  ru: {
    title: "Кредитный калькулятор онлайн — расчёт ежемесячного платежа, переплаты и графика — Toolboxi.uz",
    description:
      "Бесплатный кредитный калькулятор онлайн: точный расчёт аннуитетных и дифференцированных платежей, переплаты и графика погашения кредита и ипотеки.",
  },
  uz: {
    title: "Kredit kalkulyatori onlayn — oylik to‘lov va foizlarni hisoblash — Toolboxi.uz",
    description:
      "Bepul onlayn kredit kalkulyatori: oylik to‘lov, ortiqcha to‘lov (foizlar) va kredit to‘lov jadvalini aniq hisoblash. Ipoteka va avtokredit hisobi.",
  },
  en: {
    title: "Loan Calculator Online — Monthly Payments, Interest & Schedule — Toolboxi.uz",
    description:
      "Free online loan and mortgage calculator: calculate monthly payments, total interest, effective annual rate (APR) and full amortization schedule.",
  },
};

export function loanCalculatorHead(locale: Locale) {
  const path = localizedToolPath("loan-calculator", locale);
  return seoHead({
    ...metadata[locale],
    path,
    alternates: [
      { hrefLang: "en", href: `${SITE_URL}/tools/loan-calculator/` },
      { hrefLang: "ru", href: `${SITE_URL}/ru/tools/loan-calculator/` },
      { hrefLang: "uz", href: `${SITE_URL}/uz/tools/loan-calculator/` },
      { hrefLang: "x-default", href: `${SITE_URL}/tools/loan-calculator/` },
    ],
  });
}
