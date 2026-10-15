import type { Locale } from "@/lib/i18n/config";
import { localizedToolPath } from "@/lib/i18n/config";
import { seoHead } from "@/lib/seo";

const SITE_URL = "https://toolboxi.uz";

const metadata: Record<Locale, { title: string; description: string }> = {
  ru: {
    title:
      "Калькулятор расхода топлива грузовика онлайн — расчёт рейса, себестоимости и груза — Toolboxi.uz",
    description:
      "Онлайн-калькулятор расхода топлива для грузовиков и автопоездов: точный расчёт затрат на рейс с учётом веса груза, рельефа дороги, подъёмов, кондиционера и норм Минтранса.",
  },
  uz: {
    title:
      "Yuk mashinasi yoqilg‘i sarfi kalkulyatori onlayn — reys xarajatlari va yuk hisobi — Toolboxi.uz",
    description:
      "Yuk mashinalari va tyagachlar uchun yoqilg‘i sarfini onlayn hisoblash: yuk og‘irligi, yo‘l relyefi, balandliklar va me’yorlar bo‘yicha safar xarajati va tannarxini aniq hisoblang.",
  },
  en: {
    title:
      "Truck Fuel Consumption Calculator Online — Trip Cost & Cargo Load — Toolboxi.uz",
    description:
      "Free online truck fuel consumption and trip cost calculator. Accurate calculations factoring in cargo weight, elevation ascent/descent, route terrain, season, and fleet presets.",
  },
};

export function truckFuelCalculatorHead(locale: Locale) {
  const path = localizedToolPath("truck-fuel-calculator", locale);
  return seoHead({
    ...metadata[locale],
    path,
    alternates: [
      { hrefLang: "en", href: `${SITE_URL}/tools/truck-fuel-calculator/` },
      { hrefLang: "ru", href: `${SITE_URL}/ru/tools/truck-fuel-calculator/` },
      { hrefLang: "uz", href: `${SITE_URL}/uz/tools/truck-fuel-calculator/` },
      { hrefLang: "x-default", href: `${SITE_URL}/tools/truck-fuel-calculator/` },
    ],
  });
}
