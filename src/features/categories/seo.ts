import { getCategoryBySlug } from "@/lib/tools/catalog";
import { localizedCategoryPath, type Locale } from "@/lib/i18n/config";
import { seoHead } from "@/lib/seo";

const SITE_URL = "https://toolboxi.uz";

const CATEGORY_SEO: Record<string, Record<Locale, { title: string; description: string }>> = {
  logistics: {
    ru: {
      title: "Калькуляторы логистики и грузоперевозок — Toolboxi.uz",
      description: "Бесплатные онлайн калькуляторы логистики: расчёт объёма груза, паллет, контейнеров, стоимости доставки и таможенных платежей в Узбекистане.",
    },
    uz: {
      title: "Logistika va yuk tashish kalkulyatorlari — Toolboxi.uz",
      description: "Bepul onlayn logistika vositalari: yuk hajmi, konteynerlar, palletlar va O‘zbekistonga yetkazib berish hamda bojxona to‘lovlarini hisoblash.",
    },
    en: {
      title: "Logistics & Shipping Calculators Online — Toolboxi.uz",
      description: "Free online logistics tools: cargo volume, container capacity, freight calculations, and customs duties in your browser.",
    },
  },
  finance: {
    ru: {
      title: "Финансовые калькуляторы онлайн — НДС, кредиты, валюты — Toolboxi.uz",
      description: "Бесплатные финансовые калькуляторы: расчёт НДС 12%, аннуитетных кредитов, официальные курсы ЦБ Узбекистана и конвертер валют.",
    },
    uz: {
      title: "Moliya va investitsiya kalkulyatorlari — QQS, kredit, valyuta — Toolboxi.uz",
      description: "Bepul onlayn moliya vositalari: 12% QQS hisobi, kredit va ipoteka to‘lovlari jadvali hamda O‘zbekiston Markaziy banki valyuta kurslari.",
    },
    en: {
      title: "Financial Calculators Online — VAT, Loans, Currency — Toolboxi.uz",
      description: "Free browser-based financial calculators: calculate 12% VAT, loan amortizations, Central Bank of Uzbekistan exchange rates, and conversions.",
    },
  },
  business: {
    ru: {
      title: "Инструменты для работы и бизнеса онлайн — Toolboxi.uz",
      description: "Онлайн инструменты для предпринимателей и бухгалтеров: расчёт налогов, производственный календарь, нумерация счетов и деловые утилиты.",
    },
    uz: {
      title: "Ish va biznes uchun onlayn vositalar — Toolboxi.uz",
      description: "Tadbirkorlar va hisobchilar uchun bepul vositalar: soliq hisob-kitoblari, ishlab chiqarish taqvimi va qulay ish qurollari.",
    },
    en: {
      title: "Business & Productivity Tools Online — Toolboxi.uz",
      description: "Free online business tools: tax calculations, interactive work calendars, document number generators, and daily work utilities.",
    },
  },
  "design-print": {
    ru: {
      title: "Инструменты дизайна и полиграфии — QR-коды, штрихкоды, CMYK — Toolboxi.uz",
      description: "Бесплатные генераторы и конвертеры для дизайнеров и полиграфии: генератор QR-кодов и штрихкодов, конвертер CMYK/RGB, палитры цветов и ресайз фото.",
    },
    uz: {
      title: "Dizayn va poligrafiya vositalari — QR-kod, shtrix-kod, CMYK — Toolboxi.uz",
      description: "Dizaynerlar va bosmaxona uchun bepul vositalar: QR-kod va shtrix-kod generatorlari, CMYK/RGB konverteri, ranglar palitrasi va rasm o‘lchami.",
    },
    en: {
      title: "Design & Print Prep Tools Online — QR, Barcodes, CMYK — Toolboxi.uz",
      description: "Free design and print tools: high-res QR code generator, barcode maker, RGB to CMYK color converter, color palettes, and image resizer.",
    },
  },
  "ai-text": {
    ru: {
      title: "Инструменты для текста и копирайтинга — Toolboxi.uz",
      description: "Бесплатные утилиты для работы с текстом: генератор красивых шрифтов и символов Unicode, подсчёт знаков, форматирование и очистка текста.",
    },
    uz: {
      title: "Matn va kopirayting vositalari — Toolboxi.uz",
      description: "Matn bilan ishlash uchun bepul vositalar: chiroyli shriftlar va Unicode belgilari generatori, so‘z va belgilar hisoblagichi.",
    },
    en: {
      title: "Text & Writing Tools Online — Toolboxi.uz",
      description: "Free online writing tools: fancy stylish text and symbol generator, word & character counters, and text formatters.",
    },
  },
  everyday: {
    ru: {
      title: "Повседневные онлайн-инструменты и калькуляторы — Toolboxi.uz",
      description: "Удобные микросервисы на каждый день: генераторы паролей, конвертеры величин, мировое время, календарь рабочих дней прямо в браузере.",
    },
    uz: {
      title: "Kundalik onlayn vositalar va kalkulyatorlar — Toolboxi.uz",
      description: "Har kunlik foydali servislar: xavfsiz parol generatori, dunyo vaqti soatlari, o‘lchov birliklari konverteri bepul brauzerda.",
    },
    en: {
      title: "Everyday Utilities & Online Calculators — Toolboxi.uz",
      description: "Useful daily web tools: world time zone converter, password generator, unit converters, and fast browser calculators.",
    },
  },
  developers: {
    ru: {
      title: "Инструменты для веб-разработчиков и программистов — Toolboxi.uz",
      description: "Быстрые утилиты для разработчиков: генератор UUID v4, форматирование JSON, Base64 кодирование и декодирование, хэширование.",
    },
    uz: {
      title: "Dasturchilar va IT mutaxassislar uchun vositalar — Toolboxi.uz",
      description: "Dasturchilar uchun qulay onlayn vositalar: UUID v4 generatori, JSON formatlash, Base64 kodlash va dekodlash to‘g‘ridan-to‘g‘ri brauzerda.",
    },
    en: {
      title: "Developer Tools & Utilities Online — Toolboxi.uz",
      description: "Free developer tools: bulk UUID v4 generator, JSON validator and formatter, Base64 encoder/decoder directly in your browser.",
    },
  },
  construction: {
    ru: {
      title: "Строительные калькуляторы — расчёт кровли, материалов и площади — Toolboxi.uz",
      description: "Бесплатные онлайн калькуляторы для ремонта и строительства: точный расчёт площади крыши, кровельных листов, расхода материалов и стоимости.",
    },
    uz: {
      title: "Qurilish kalkulyatorlari — tom yopish, materiallar va maydon hisobi — Toolboxi.uz",
      description: "Qurilish va ta’mirlash uchun bepul onlayn kalkulyatorlar: tom maydonini hisoblash, profnastil va cherepitsa soni hamda materiallar xarajati.",
    },
    en: {
      title: "Construction & Measurement Calculators Online — Toolboxi.uz",
      description: "Free construction calculators: roof pitch and sheet area calculation, materials estimator, and measurement conversions.",
    },
  },
};

export function categoryHead(slug: string, locale: Locale) {
  const category = getCategoryBySlug(slug);
  if (!category) {
    return seoHead({
      title: "Category not found — Toolboxi.uz",
      description: "Requested category was not found.",
      path: `/categories/${slug}`,
      noIndex: true,
    });
  }

  const custom = CATEGORY_SEO[slug]?.[locale];
  const title = custom?.title ?? `${category.name[locale]} — Toolboxi.uz`;
  const description = custom?.description ?? category.description[locale];
  const path = localizedCategoryPath(slug, locale);

  return seoHead({
    title,
    description,
    path,
    alternates: [
      { hrefLang: "en", href: `${SITE_URL}/categories/${slug}/` },
      { hrefLang: "ru", href: `${SITE_URL}/ru/categories/${slug}/` },
      { hrefLang: "uz", href: `${SITE_URL}/uz/categories/${slug}/` },
      { hrefLang: "x-default", href: `${SITE_URL}/categories/${slug}/` },
    ],
  });
}
