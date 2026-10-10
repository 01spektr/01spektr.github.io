import type { Locale } from "@/lib/i18n/config";
import { localizedToolPath } from "@/lib/i18n/config";
import { seoHead } from "@/lib/seo";

const SITE_URL = "https://toolboxi.uz";

const metadata: Record<Locale, { title: string; description: string }> = {
  ru: {
    title: "Калькулятор НДС 12% онлайн — начислить и выделить налог — Toolboxi.uz",
    description:
      "Бесплатный калькулятор НДС онлайн: быстро начислить или выделить налог из суммы. Актуальная ставка НДС 12% в Узбекистане, мировые ставки и экспорт расчёта.",
  },
  uz: {
    title: "QQS kalkulyatori 12% onlayn — soliqni hisoblash va ajratish — Toolboxi.uz",
    description:
      "Bepul onlayn QQS kalkulyatori: umumiy summadan qo‘shilgan qiymat solig‘ini hisoblash, ajratish va qo‘shish. O‘zbekiston 12% QQS stavkasi va xalqaro mezonlar.",
  },
  en: {
    title: "VAT Calculator 12% Online — Add & Extract Tax — Toolboxi.uz",
    description:
      "Free online VAT and sales tax calculator: easily calculate, add or extract tax from any amount. 12% VAT rate for Uzbekistan, world rates and instant export.",
  },
};

export function vatCalculatorHead(locale: Locale) {
  const path = localizedToolPath("vat-calculator", locale);
  return seoHead({
    ...metadata[locale],
    path,
    alternates: [
      { hrefLang: "en", href: `${SITE_URL}/tools/vat-calculator/` },
      { hrefLang: "ru", href: `${SITE_URL}/ru/tools/vat-calculator/` },
      { hrefLang: "uz", href: `${SITE_URL}/uz/tools/vat-calculator/` },
      { hrefLang: "x-default", href: `${SITE_URL}/tools/vat-calculator/` },
    ],
  });
}
