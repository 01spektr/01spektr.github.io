import type { Locale } from "@/lib/i18n/config";
import { localizedToolPath } from "@/lib/i18n/config";
import { seoHead } from "@/lib/seo";

const SITE_URL = "https://toolboxi.uz";

const metadata: Record<Locale, { title: string; description: string }> = {
  ru: {
    title: "Генератор штрихкодов онлайн бесплатно — EAN-13, Code 128 для маркетплейсов — Toolboxi.uz",
    description:
      "Бесплатный онлайн генератор штрихкодов: создание штрих-кодов форматов EAN-13, Code 128, UPC для товаров, складов и маркетплейсов Uzum и WB. Экспорт в PNG и SVG.",
  },
  uz: {
    title: "Shtrix-kod generatori onlayn bepul — EAN-13, Code 128 yaratish — Toolboxi.uz",
    description:
      "Bepul onlayn shtrix-kod generatori: tovarlar, do‘konlar va Uzum Market uchun EAN-13, Code 128, UPC formatlarida shtrix-kodlar yarating. PNG va SVG formatda yuklab olish.",
  },
  en: {
    title: "Free Barcode Generator Online — EAN-13, Code 128, UPC Generator — Toolboxi.uz",
    description:
      "Free online barcode generator: generate standard barcodes including EAN-13, Code 128, UPC for retail products, shipping and inventory. Export high-res PNG and SVG.",
  },
};

export function barcodeGeneratorHead(locale: Locale) {
  const path = localizedToolPath("barcode-generator", locale);
  return seoHead({
    ...metadata[locale],
    path,
    alternates: [
      { hrefLang: "en", href: `${SITE_URL}/tools/barcode-generator/` },
      { hrefLang: "ru", href: `${SITE_URL}/ru/tools/barcode-generator/` },
      { hrefLang: "uz", href: `${SITE_URL}/uz/tools/barcode-generator/` },
      { hrefLang: "x-default", href: `${SITE_URL}/tools/barcode-generator/` },
    ],
  });
}
