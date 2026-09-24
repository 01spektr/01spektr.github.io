import type { Locale } from "@/lib/i18n/config";
import { localizedToolPath } from "@/lib/i18n/config";
import { seoHead } from "@/lib/seo";

const SITE_URL = "https://toolboxi.uz";

const metadata: Record<Locale, { title: string; description: string }> = {
  en: {
    title: "Exchange rates and currency converter — Toolboxi.uz",
    description:
      "View official Central Bank of Uzbekistan exchange rates, convert currencies and compare historical rate changes.",
  },
  ru: {
    title: "Курсы валют и конвертер валют — Toolboxi.uz",
    description:
      "Официальные курсы Центрального банка Узбекистана, конвертер валют и график изменения курсов.",
  },
  uz: {
    title: "Valyuta kurslari va valyuta konverteri — Toolboxi.uz",
    description:
      "O‘zbekiston Markaziy bankining rasmiy valyuta kurslari, valyuta konverteri va kurslar o‘zgarishi grafigi.",
  },
};

export function currencyRatesHead(locale: Locale) {
  const path = localizedToolPath("currency-rates", locale);
  return seoHead({
    ...metadata[locale],
    path,
    alternates: [
      { hrefLang: "en", href: `${SITE_URL}/tools/currency-rates/` },
      { hrefLang: "ru", href: `${SITE_URL}/ru/tools/currency-rates/` },
      { hrefLang: "uz", href: `${SITE_URL}/uz/tools/currency-rates/` },
      { hrefLang: "x-default", href: `${SITE_URL}/tools/currency-rates/` },
    ],
  });
}
