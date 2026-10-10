import type { Locale } from "@/lib/i18n/config";
import { localizedToolPath } from "@/lib/i18n/config";
import { seoHead } from "@/lib/seo";

const SITE_URL = "https://toolboxi.uz";

const metadata: Record<Locale, { title: string; description: string }> = {
  ru: {
    title: "Генератор UUID v4 онлайн — массовая генерация уникальных GUID — Toolboxi.uz",
    description:
      "Бесплатный генератор UUID v4 онлайн: быстрая пакетная генерация случайных идентификаторов GUID/UUID, выбор регистра, фигурных скобок и выгрузка списком.",
  },
  uz: {
    title: "UUID v4 generatori onlayn — takrorlanmas GUID yaratish — Toolboxi.uz",
    description:
      "Bepul onlayn UUID v4 generatori: dasturchilar uchun takrorlanmas GUID/UUID identifikatorlarini ommaviy yaratish, katta/kichik harflar va qulay nusxalash.",
  },
  en: {
    title: "Online UUID / GUID v4 Generator — Bulk Unique Identifier Tool — Toolboxi.uz",
    description:
      "Free online UUID v4 generator: securely generate random GUIDs and UUIDs in bulk directly in your browser with customizable uppercase, braces, and formats.",
  },
};

export function uuidGeneratorHead(locale: Locale) {
  const path = localizedToolPath("uuid-generator", locale);
  return seoHead({
    ...metadata[locale],
    path,
    alternates: [
      { hrefLang: "en", href: `${SITE_URL}/tools/uuid-generator/` },
      { hrefLang: "ru", href: `${SITE_URL}/ru/tools/uuid-generator/` },
      { hrefLang: "uz", href: `${SITE_URL}/uz/tools/uuid-generator/` },
      { hrefLang: "x-default", href: `${SITE_URL}/tools/uuid-generator/` },
    ],
  });
}
