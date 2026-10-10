import type { Locale } from "@/lib/i18n/config";
import { localizedToolPath } from "@/lib/i18n/config";
import { seoHead } from "@/lib/seo";

const SITE_URL = "https://toolboxi.uz";

const metadata: Record<Locale, { title: string; description: string }> = {
  ru: {
    title: "Калькулятор кровли онлайн — расчёт площади крыши и металлочерепицы — Toolboxi.uz",
    description:
      "Бесплатный калькулятор крыши: точный онлайн расчёт площади кровли, угла наклона, количества листов металлочерепицы, профнастила и доборных элементов.",
  },
  uz: {
    title: "Tom yopish kalkulyatori onlayn — tom maydoni va tunuka hisobi — Toolboxi.uz",
    description:
      "Bepul onlayn tom kalkulyatori: tomning maydoni, qiyaligi, profnastil va metall cherepitsa varaqlar sonini aniq hisoblash. Qurilish xarajatlari hisobi.",
  },
  en: {
    title: "Roof Calculator Online — Roof Pitch, Area & Material Estimator — Toolboxi.uz",
    description:
      "Free online roofing calculator: estimate roof area, pitch angle, metal sheet counts, shingles, and materials needed for gable, shed, and hip roofs.",
  },
};

export function roofCalculatorHead(locale: Locale) {
  const path = localizedToolPath("roof-calculator", locale);
  return seoHead({
    ...metadata[locale],
    path,
    alternates: [
      { hrefLang: "en", href: `${SITE_URL}/tools/roof-calculator/` },
      { hrefLang: "ru", href: `${SITE_URL}/ru/tools/roof-calculator/` },
      { hrefLang: "uz", href: `${SITE_URL}/uz/tools/roof-calculator/` },
      { hrefLang: "x-default", href: `${SITE_URL}/tools/roof-calculator/` },
    ],
  });
}
