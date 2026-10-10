import type { Locale } from "@/lib/i18n/config";
import { localizedToolPath } from "@/lib/i18n/config";
import { seoHead } from "@/lib/seo";

const SITE_URL = "https://toolboxi.uz";

const metadata: Record<Locale, { title: string; description: string }> = {
  ru: {
    title: "Красивые шрифты и символы онлайн — генератор текста для ников и соцсетей — Toolboxi.uz",
    description:
      "Бесплатный генератор красивых шрифтов и редких символов Unicode: стильный текст для ников, Telegram, Instagram, PUBG, каллиграфия и спецсимволы.",
  },
  uz: {
    title: "Chiroyli shriftlar va belgilar onlayn — nik va ijtimoiy tarmoqlar uchun — Toolboxi.uz",
    description:
      "Bepul onlayn chiroyli shriftlar va noyob Unicode belgilari generatori: Telegram, Instagram va o‘yinlardagi niklar uchun noodatiy harflar va bezaklar.",
  },
  en: {
    title: "Fancy Text & Symbol Generator Online — Cool Fonts for Nicknames — Toolboxi.uz",
    description:
      "Free fancy text generator and Unicode symbols: create cool fonts, cursive calligraphy, aesthetic symbols for bios, gaming handles, Instagram, and Telegram.",
  },
};

export function textSymbolGeneratorHead(locale: Locale) {
  const path = localizedToolPath("text-symbol-generator", locale);
  return seoHead({
    ...metadata[locale],
    path,
    alternates: [
      { hrefLang: "en", href: `${SITE_URL}/tools/text-symbol-generator/` },
      { hrefLang: "ru", href: `${SITE_URL}/ru/tools/text-symbol-generator/` },
      { hrefLang: "uz", href: `${SITE_URL}/uz/tools/text-symbol-generator/` },
      { hrefLang: "x-default", href: `${SITE_URL}/tools/text-symbol-generator/` },
    ],
  });
}
