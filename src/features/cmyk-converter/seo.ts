import type { Locale } from "@/lib/i18n/config";
import { localizedToolPath } from "@/lib/i18n/config";
import { seoHead } from "@/lib/seo";

const SITE_URL = "https://toolboxi.uz";

const metadata: Record<Locale, { title: string; description: string }> = {
  ru: {
    title: "Конвертер CMYK в RGB и HEX онлайн — подготовка к печати — Toolboxi.uz",
    description:
      "Бесплатный конвертер цветов CMYK в RGB, HEX, HSL онлайн: точный перевод цветовых моделей для полиграфии, печати и веб-дизайна с предпросмотром.",
  },
  uz: {
    title: "CMYK dan RGB va HEX ga rang konverteri onlayn — bosmaxona uchun — Toolboxi.uz",
    description:
      "Bepul onlayn CMYK dan RGB, HEX, HSL rang modellariga o‘girish: poligrafiya, chop etish va veb-dizayn uchun aniq ranglar konvertatsiyasi.",
  },
  en: {
    title: "CMYK to RGB & HEX Color Converter Online — Print Prep — Toolboxi.uz",
    description:
      "Free online CMYK to RGB, HEX, and HSL color converter: precise color space conversions for print preparation, digital design, and branding.",
  },
};

export function cmykConvertHead(locale: Locale) {
  const path = localizedToolPath("cmyk-convert", locale);
  return seoHead({
    ...metadata[locale],
    path,
    alternates: [
      { hrefLang: "en", href: `${SITE_URL}/tools/cmyk-convert/` },
      { hrefLang: "ru", href: `${SITE_URL}/ru/tools/cmyk-convert/` },
      { hrefLang: "uz", href: `${SITE_URL}/uz/tools/cmyk-convert/` },
      { hrefLang: "x-default", href: `${SITE_URL}/tools/cmyk-convert/` },
    ],
  });
}
