import type { Locale } from "@/lib/i18n/config";
import { localizedToolPath } from "@/lib/i18n/config";
import { seoHead } from "@/lib/seo";

const SITE_URL = "https://toolboxi.uz";

const metadata: Record<Locale, { title: string; description: string }> = {
  ru: {
    title: "Мировое время и часовые пояса онлайн — разница во времени с Ташкентом — Toolboxi.uz",
    description:
      "Точное мировое время онлайн: часовые пояса городов мира, разница во времени с Ташкентом (UTC+5), удобный планировщик международных звонков и встреч.",
  },
  uz: {
    title: "Dunyo vaqti va soat mintaqalari onlayn — Toshkent vaqti bilan farq — Toolboxi.uz",
    description:
      "Aniq dunyo vaqti onlayn: jahon shaharlarining soat mintaqalari, Toshkent vaqti (UTC+5) bilan farq va xalqaro uchrashuvlarni rejalashtirish vositasi.",
  },
  en: {
    title: "World Time Zones & Clock Online — Tashkent Time Difference — Toolboxi.uz",
    description:
      "Accurate world clock and time zone converter: compare local time across global cities with Tashkent (UTC+5), schedule international meetings easily.",
  },
};

export function worldTimezonesHead(locale: Locale) {
  const path = localizedToolPath("world-timezones", locale);
  return seoHead({
    ...metadata[locale],
    path,
    alternates: [
      { hrefLang: "en", href: `${SITE_URL}/tools/world-timezones/` },
      { hrefLang: "ru", href: `${SITE_URL}/ru/tools/world-timezones/` },
      { hrefLang: "uz", href: `${SITE_URL}/uz/tools/world-timezones/` },
      { hrefLang: "x-default", href: `${SITE_URL}/tools/world-timezones/` },
    ],
  });
}
