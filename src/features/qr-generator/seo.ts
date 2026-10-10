import type { Locale } from "@/lib/i18n/config";
import { localizedToolPath } from "@/lib/i18n/config";
import { seoHead } from "@/lib/seo";

const SITE_URL = "https://toolboxi.uz";

const metadata: Record<Locale, { title: string; description: string }> = {
  ru: {
    title: "Генератор QR-кодов онлайн бесплатно — создать QR-код с логотипом — Toolboxi.uz",
    description:
      "Бесплатный онлайн генератор QR-кодов: создавайте QR-коды для ссылок, текста, Wi-Fi, визиток vCard, Telegram и WhatsApp. Настройка дизайна, цветов и логотипа.",
  },
  uz: {
    title: "QR-kod generatori onlayn bepul — logotipli QR-kod yaratish — Toolboxi.uz",
    description:
      "Bepul onlayn QR-kod generatori: havolalar, matn, Wi-Fi, vizitkalar (vCard), Telegram va WhatsApp uchun QR-kodlar yarating. Ranglar va logotipni sozlash.",
  },
  en: {
    title: "Free QR Code Generator Online — Create Custom QR Codes with Logo — Toolboxi.uz",
    description:
      "Free online QR code generator: generate QR codes for links, text, Wi-Fi, contacts, email and phone numbers. Customize design, colors and export high-res PNG/SVG.",
  },
};

export function qrGeneratorHead(locale: Locale) {
  const path = localizedToolPath("qr-generator", locale);
  return seoHead({
    ...metadata[locale],
    path,
    alternates: [
      { hrefLang: "en", href: `${SITE_URL}/tools/qr-generator/` },
      { hrefLang: "ru", href: `${SITE_URL}/ru/tools/qr-generator/` },
      { hrefLang: "uz", href: `${SITE_URL}/uz/tools/qr-generator/` },
      { hrefLang: "x-default", href: `${SITE_URL}/tools/qr-generator/` },
    ],
  });
}
