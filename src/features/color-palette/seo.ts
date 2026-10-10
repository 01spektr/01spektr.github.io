import type { Locale } from "@/lib/i18n/config";
import { localizedToolPath } from "@/lib/i18n/config";
import { seoHead } from "@/lib/seo";

const SITE_URL = "https://toolboxi.uz";

const metadata: Record<Locale, { title: string; description: string }> = {
  ru: {
    title: "Генератор палитры цветов онлайн — подбор цветовых схем и градиентов — Toolboxi.uz",
    description:
      "Бесплатный онлайн генератор цветовых палитр: гармоничные цветовые схемы, градиенты, HEX и RGB коды для дизайнеров интерфейсов, брендинга и сайтов.",
  },
  uz: {
    title: "Ranglar palitrasi generatori onlayn — ranglar uyg‘unligi va kodlari — Toolboxi.uz",
    description:
      "Bepul onlayn ranglar palitrasi generatori: mos tushuvchi ranglar uyg‘unligi, HEX va RGB kodlar, gradientlar dizaynerlar va saytlar uchun.",
  },
  en: {
    title: "Color Palette Generator Online — Color Schemes & Hex Codes — Toolboxi.uz",
    description:
      "Free online color palette generator: create harmonious color schemes, extract palettes, generate gradients, and copy HEX/RGB codes effortlessly.",
  },
};

export function colorPaletteHead(locale: Locale) {
  const path = localizedToolPath("color-palette", locale);
  return seoHead({
    ...metadata[locale],
    path,
    alternates: [
      { hrefLang: "en", href: `${SITE_URL}/tools/color-palette/` },
      { hrefLang: "ru", href: `${SITE_URL}/ru/tools/color-palette/` },
      { hrefLang: "uz", href: `${SITE_URL}/uz/tools/color-palette/` },
      { hrefLang: "x-default", href: `${SITE_URL}/tools/color-palette/` },
    ],
  });
}
