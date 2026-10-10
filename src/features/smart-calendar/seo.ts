import type { Locale } from "@/lib/i18n/config";
import { localizedToolPath } from "@/lib/i18n/config";
import { seoHead } from "@/lib/seo";

const SITE_URL = "https://toolboxi.uz";

const metadata: Record<Locale, { title: string; description: string }> = {
  ru: {
    title: "Производственный календарь Узбекистана — нормы рабочего времени и праздники — Toolboxi.uz",
    description:
      "Официальный производственный календарь Узбекистана: нормы рабочих часов, праздничные и выходные дни, переносы и расчёт рабочих дней для кадровиков и бухгалтеров.",
  },
  uz: {
    title: "O‘zbekiston ishlab chiqarish taqvimi — ish vaqti me’yorlari va bayramlar — Toolboxi.uz",
    description:
      "O‘zbekiston rasmiy ishlab chiqarish taqvimi: ish soatlari me’yori, dam olish va bayram kunlari, ko‘chirilgan dam olish kunlari va ish kunlari hisoblagichi.",
  },
  en: {
    title: "Uzbekistan Work & Production Calendar — Working Hours & Holidays — Toolboxi.uz",
    description:
      "Official working calendar of Uzbekistan: standard working hours, public holidays, bridge days, and workdays counter for HR and accounting.",
  },
};

export function smartCalendarHead(locale: Locale) {
  const path = localizedToolPath("smart-calendar", locale);
  return seoHead({
    ...metadata[locale],
    path,
    alternates: [
      { hrefLang: "en", href: `${SITE_URL}/tools/smart-calendar/` },
      { hrefLang: "ru", href: `${SITE_URL}/ru/tools/smart-calendar/` },
      { hrefLang: "uz", href: `${SITE_URL}/uz/tools/smart-calendar/` },
      { hrefLang: "x-default", href: `${SITE_URL}/tools/smart-calendar/` },
    ],
  });
}
