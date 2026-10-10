import type { Locale } from "@/lib/i18n/config";
import { localizedToolPath } from "@/lib/i18n/config";
import { seoHead } from "@/lib/seo";

const SITE_URL = "https://toolboxi.uz";

const metadata: Record<Locale, { title: string; description: string }> = {
  ru: {
    title: "Изменить размер фото онлайн бесплатно — обрезка и сжатие изображений — Toolboxi.uz",
    description:
      "Бесплатный ресайз фото онлайн: изменение ширины и высоты, сжатие без потери качества, обрезка и конвертация JPG, PNG, WebP прямо в браузере.",
  },
  uz: {
    title: "Rasm o‘lchamini o‘zgartirish onlayn bepul — qirqish va siqish — Toolboxi.uz",
    description:
      "Bepul onlayn rasm o‘lchamini o‘zgartirish: piksellar bo‘yicha eni va bo‘yini sozlash, sifatini yo‘qotmasdan siqish, qirqish, JPG, PNG, WebP konvertatsiyasi.",
  },
  en: {
    title: "Free Image Resizer Online — Resize, Crop & Compress Images — Toolboxi.uz",
    description:
      "Free browser-based image resizer: scale dimensions in pixels or percent, crop, compress file size, and convert between JPG, PNG, and WebP instantly.",
  },
};

export function imageResizeHead(locale: Locale) {
  const path = localizedToolPath("image-resize", locale);
  return seoHead({
    ...metadata[locale],
    path,
    alternates: [
      { hrefLang: "en", href: `${SITE_URL}/tools/image-resize/` },
      { hrefLang: "ru", href: `${SITE_URL}/ru/tools/image-resize/` },
      { hrefLang: "uz", href: `${SITE_URL}/uz/tools/image-resize/` },
      { hrefLang: "x-default", href: `${SITE_URL}/tools/image-resize/` },
    ],
  });
}
