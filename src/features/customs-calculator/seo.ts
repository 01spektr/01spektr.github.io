import type { Locale } from "@/lib/i18n/config";
import { localizedToolPath } from "@/lib/i18n/config";
import { seoHead } from "@/lib/seo";

const SITE_URL = "https://toolboxi.uz";

const metadata: Record<Locale, { title: string; description: string }> = {
  ru: {
    title: "Таможенный калькулятор Узбекистана онлайн — расчёт растаможки, пошлин и сборов — Toolboxi.uz",
    description:
      "Бесплатный таможенный калькулятор: онлайн расчёт таможенных пошлин, акцизов, НДС и сборов на импорт товаров и авто в Узбекистан по кодам ТН ВЭД.",
  },
  uz: {
    title: "Bojxona kalkulyatori O‘zbekiston — boj to‘lovlari va soliqlar hisobi onlayn — Toolboxi.uz",
    description:
      "Bepul onlayn bojxona kalkulyatori: tovar va avtomobillarni import qilishda bojxona boji, aksiz, QQS va yig‘imlarni hisoblash. TIF TN kodlari bo‘yicha to‘lovlar.",
  },
  en: {
    title: "Uzbekistan Customs Duty Calculator Online — Import Taxes & Fees — Toolboxi.uz",
    description:
      "Calculate customs duties, excise tax, VAT and processing fees for goods and vehicle import into Uzbekistan by HS codes and country of origin.",
  },
};

export function customsCalculatorHead(locale: Locale) {
  const path = localizedToolPath("customs-calculator", locale);
  return seoHead({
    ...metadata[locale],
    path,
    alternates: [
      { hrefLang: "en", href: `${SITE_URL}/tools/customs-calculator/` },
      { hrefLang: "ru", href: `${SITE_URL}/ru/tools/customs-calculator/` },
      { hrefLang: "uz", href: `${SITE_URL}/uz/tools/customs-calculator/` },
      { hrefLang: "x-default", href: `${SITE_URL}/tools/customs-calculator/` },
    ],
  });
}
