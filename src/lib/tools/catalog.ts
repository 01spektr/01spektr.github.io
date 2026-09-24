export type { Locale } from "@/lib/i18n/config";
import type { Locale } from "@/lib/i18n/config";

export type CategoryId =
  | "logistics"
  | "finance"
  | "business"
  | "design-print"
  | "ai-text"
  | "everyday"
  | "developers"
  | "construction";

export type Localized = Record<Locale, string>;

export interface ToolCategory {
  id: CategoryId;
  slug: string;
  name: Localized;
  description: Localized;
  icon: string;
  tint: string;
}

export interface ToolDef {
  id: string;
  slug: string;
  category: CategoryId;
  name: Localized;
  description: Localized;
  keywords: string[];
  icon: string;
  available: boolean;
  featured?: boolean;
}

export const CATEGORIES: ToolCategory[] = [
  {
    id: "logistics",
    slug: "logistics",
    name: {
      ru: "Логистика и грузоперевозки",
      en: "Logistics & shipping",
      uz: "Logistika va yuk tashish",
    },
    description: {
      ru: "Расчёты груза, объёма и маршрутов",
      en: "Cargo, volume and route calculations",
      uz: "Yuk, hajm va yo‘nalish hisob-kitoblari",
    },
    icon: "Package",
    tint: "#38bdf8",
  },
  {
    id: "finance",
    slug: "finance",
    name: {
      ru: "Финансы и инвестиции",
      en: "Finance & investing",
      uz: "Moliya va investitsiyalar",
    },
    description: {
      ru: "Проценты, НДС, кредиты и валюта",
      en: "Interest, VAT, loans and currency",
      uz: "Foizlar, QQS, kreditlar va valyuta",
    },
    icon: "Wallet",
    tint: "#34d399",
  },
  {
    id: "business",
    slug: "business",
    name: { ru: "Для работы и бизнеса", en: "Work & business", uz: "Ish va biznes uchun" },
    description: {
      ru: "Документы, счета и ежедневные задачи",
      en: "Documents, invoices and daily work",
      uz: "Hujjatlar, hisob-fakturalar va kundalik vazifalar",
    },
    icon: "Briefcase",
    tint: "#60a5fa",
  },
  {
    id: "design-print",
    slug: "design-print",
    name: { ru: "Дизайн и полиграфия", en: "Design & print", uz: "Dizayn va poligrafiya" },
    description: {
      ru: "QR-коды, цвета, макеты и подготовка к печати",
      en: "QR codes, color, layouts and print prep",
      uz: "QR-kodlar, ranglar, maketlar va bosmaga tayyorlash",
    },
    icon: "Pentagon",
    tint: "#8b7cf6",
  },
  {
    id: "ai-text",
    slug: "ai-text",
    name: { ru: "AI и работа с текстом", en: "AI & writing", uz: "AI va matn bilan ishlash" },
    description: {
      ru: "Текст, счётчики, правки и шаблоны",
      en: "Writing, counters, edits and templates",
      uz: "Matn, hisoblagichlar, tahrirlash va shablonlar",
    },
    icon: "PenLine",
    tint: "#f472b6",
  },
  {
    id: "everyday",
    slug: "everyday",
    name: { ru: "Повседневные инструменты", en: "Everyday tools", uz: "Kundalik vositalar" },
    description: {
      ru: "Калькуляторы, пароли, конвертеры",
      en: "Calculators, passwords, converters",
      uz: "Kalkulyatorlar, parollar va konverterlar",
    },
    icon: "House",
    tint: "#fb923c",
  },
  {
    id: "developers",
    slug: "developers",
    name: { ru: "Для разработчиков", en: "For developers", uz: "Dasturchilar uchun" },
    description: {
      ru: "Кодирование, JSON, хеши и UUID",
      en: "Encoding, JSON, hashes and UUIDs",
      uz: "Kodlash, JSON, xeshlar va UUID",
    },
    icon: "Code2",
    tint: "#22d3ee",
  },
  {
    id: "construction",
    slug: "construction",
    name: {
      ru: "Строительство и замеры",
      en: "Construction & measures",
      uz: "Qurilish va o‘lchovlar",
    },
    description: {
      ru: "Площадь, объём, масштаб и единицы",
      en: "Area, volume, scale and units",
      uz: "Maydon, hajm, masshtab va birliklar",
    },
    icon: "Ruler",
    tint: "#facc15",
  },
];

export const TOOLS: ToolDef[] = [
  {
    id: "qr-generator",
    slug: "qr-generator",
    category: "design-print",
    name: { ru: "Генератор QR-кодов", en: "QR code generator", uz: "QR-kod generatori" },
    description: {
      ru: "Создавайте QR-коды для ссылок, текста, контактов, Wi-Fi, email, телефона и других данных.",
      en: "Create QR codes for links, text, contacts, Wi-Fi, email, phone and more.",
      uz: "Havolalar, matn, kontaktlar, Wi-Fi, email, telefon va boshqa ma’lumotlar uchun QR-kodlar yarating.",
    },
    keywords: [
      "qr",
      "qr код",
      "qr-code",
      "ссылка",
      "wifi",
      "wi-fi",
      "контакт",
      "визитка",
      "barcode",
      "код",
    ],
    icon: "QrCode",
    available: true,
    featured: true,
  },
  {
    id: "color-palette",
    slug: "color-palette",
    category: "design-print",
    name: { ru: "Палитра цветов", en: "Color palette", uz: "Ranglar palitrasi" },
    description: {
      ru: "Подбор гармоничных цветов для бренда и печати.",
      en: "Build harmonious palettes for brand and print.",
      uz: "Brend va bosma uchun uyg‘un ranglar palitrasini yarating.",
    },
    keywords: ["цвет", "палитра", "hex", "color"],
    icon: "Palette",
    available: true,
    featured: true,
  },
  {
    id: "image-resize",
    slug: "image-resize",
    category: "design-print",
    name: { ru: "Ресайз изображений", en: "Image resizer", uz: "Rasm o‘lchamini o‘zgartirish" },
    description: {
      ru: "Изменение размеров, обрезка и экспорт изображений.",
      en: "Resize images without leaving the browser.",
      uz: "Rasmlarni bevosita brauzerda o‘lchamini o‘zgartiring.",
    },
    keywords: ["изображение", "ресайз", "png"],
    icon: "Image",
    available: true,
  },
  {
    id: "barcode-generator",
    slug: "barcode-generator",
    category: "design-print",
    name: { ru: "Генератор штрихкодов", en: "Barcode generator", uz: "Shtrix-kod generatori" },
    description: {
      ru: "EAN, Code128 и другие линейные коды.",
      en: "EAN, Code128 and other linear barcodes.",
      uz: "EAN, Code128 va boshqa chiziqli shtrix-kodlar.",
    },
    keywords: ["штрихкод", "ean", "barcode"],
    icon: "Barcode",
    available: true,
  },
  {
    id: "cmyk-convert",
    slug: "cmyk-convert",
    category: "design-print",
    name: { ru: "RGB → CMYK", en: "RGB → CMYK", uz: "RGB → CMYK" },
    description: {
      ru: "Перевод цветов в печатную модель CMYK.",
      en: "Convert colors into a print-ready CMYK model.",
      uz: "Ranglarni bosmaga tayyor CMYK modeliga o‘tkazing.",
    },
    keywords: ["cmyk", "rgb", "печать"],
    icon: "Droplets",
    available: true,
  },
  {
    id: "cargo-volume",
    slug: "cargo-volume",
    category: "logistics",
    name: { ru: "Объём груза", en: "Cargo volume", uz: "Yuk hajmi" },
    description: {
      ru: "Расчёт объёма коробок и паллет.",
      en: "Box and pallet volume calculator.",
      uz: "Qutilar va tagliklar hajmi kalkulyatori.",
    },
    keywords: ["груз", "объём", "паллета"],
    icon: "Package",
    available: false,
  },
  {
    id: "shipping-cost",
    slug: "shipping-cost",
    category: "logistics",
    name: { ru: "Стоимость доставки", en: "Shipping cost", uz: "Yetkazib berish narxi" },
    description: {
      ru: "Оценка стоимости перевозки по весу и расстоянию.",
      en: "Estimate shipping cost by weight and distance.",
      uz: "Vazn va masofa bo‘yicha yetkazib berish narxini hisoblang.",
    },
    keywords: ["доставка", "тариф"],
    icon: "Truck",
    available: false,
  },
  {
    id: "vat-calculator",
    slug: "vat-calculator",
    category: "finance",
    name: { ru: "Калькулятор НДС", en: "VAT calculator", uz: "QQS kalkulyatori" },
    description: {
      ru: "Выделение и начисление НДС.",
      en: "Add or extract VAT from an amount.",
      uz: "Summaga QQS qo‘shing yoki undan QQSni ajrating.",
    },
    keywords: ["ндс", "vat", "налог"],
    icon: "Percent",
    available: true,
  },
  {
    id: "loan-calculator",
    slug: "loan-calculator",
    category: "finance",
    name: { ru: "Кредитный калькулятор", en: "Loan calculator", uz: "Kredit kalkulyatori" },
    description: {
      ru: "Платежи, переплата и график.",
      en: "Payments, overpay and a simple schedule.",
      uz: "To‘lovlar, ortiqcha to‘lov va to‘lov jadvali.",
    },
    keywords: ["кредит", "платёж"],
    icon: "Landmark",
    available: true,
  },
  {
    id: "currency-rates",
    slug: "currency-rates",
    category: "finance",
    name: { ru: "Курсы валют", en: "Exchange rates", uz: "Valyuta kurslari" },
    description: {
      ru: "Официальные курсы ЦБ Узбекистана, конвертер валют и график изменений.",
      en: "Official Central Bank of Uzbekistan rates, currency converter and change chart.",
      uz: "O‘zbekiston Markaziy bankining rasmiy kurslari, valyuta konverteri va o‘zgarishlar grafigi.",
    },
    keywords: [
      "курс валют",
      "валюта",
      "конвертер",
      "доллар",
      "евро",
      "cbu",
      "exchange rates",
      "valyuta kursi",
    ],
    icon: "ArrowLeftRight",
    available: true,
    featured: true,
  },
  {
    id: "invoice-number",
    slug: "invoice-number",
    category: "business",
    name: { ru: "Номер счёта", en: "Invoice number", uz: "Hisob raqami" },
    description: {
      ru: "Генератор номеров документов.",
      en: "Generate sequential document numbers.",
      uz: "Hujjatlar uchun ketma-ket raqamlar yarating.",
    },
    keywords: ["счёт", "invoice"],
    icon: "FileText",
    available: false,
  },
  {
    id: "text-symbol-generator",
    slug: "text-symbol-generator",
    category: "ai-text",
    name: {
      ru: "Генератор текста и символов",
      en: "Fancy text & symbols",
      uz: "Matn va belgilar generatori",
    },
    description: {
      ru: "Преобразуйте обычный текст в 30+ красивых Unicode-стилей, добавляйте символы и эмодзи для соцсетей, никнеймов и сообщений.",
      en: "Turn regular text into 30+ stylish Unicode variants and add symbols or emojis for social posts, usernames and messages.",
      uz: "Oddiy matnni 30 dan ortiq chiroyli Unicode uslubiga aylantiring, ijtimoiy tarmoqlar va niklar uchun belgilar hamda emojilar qo‘shing.",
    },
    keywords: [
      "генератор текста",
      "красивый шрифт",
      "символы",
      "эмодзи",
      "никнейм",
      "unicode",
      "fancy text",
      "stylish fonts",
      "matn generatori",
      "belgilar",
    ],
    icon: "Type",
    available: true,
    featured: true,
  },
  {
    id: "word-counter",
    slug: "word-counter",
    category: "ai-text",
    name: { ru: "Счётчик слов", en: "Word counter", uz: "So‘z hisoblagichi" },
    description: {
      ru: "Слова, знаки и время чтения.",
      en: "Words, characters and reading time.",
      uz: "So‘zlar, belgilar va o‘qish vaqti.",
    },
    keywords: ["слова", "текст"],
    icon: "Type",
    available: false,
  },
  {
    id: "case-converter",
    slug: "case-converter",
    category: "ai-text",
    name: { ru: "Регистр текста", en: "Case converter", uz: "Matn registri" },
    description: {
      ru: "UPPER, lower, Title Case и другие.",
      en: "UPPER, lower, Title Case and more.",
      uz: "UPPER, lower, Title Case va boshqa ko‘rinishlar.",
    },
    keywords: ["регистр", "case"],
    icon: "CaseSensitive",
    available: false,
  },
  {
    id: "password-generator",
    slug: "password-generator",
    category: "everyday",
    name: { ru: "Генератор паролей", en: "Password generator", uz: "Parol generatori" },
    description: {
      ru: "Надёжные пароли прямо в браузере.",
      en: "Strong passwords generated locally.",
      uz: "Ishonchli parollar bevosita brauzerda yaratiladi.",
    },
    keywords: ["пароль", "password"],
    icon: "KeyRound",
    available: false,
  },
  {
    id: "unit-converter",
    slug: "unit-converter",
    category: "everyday",
    name: { ru: "Конвертер единиц", en: "Unit converter", uz: "Birliklar konverteri" },
    description: {
      ru: "Длина, вес, температура и объём.",
      en: "Length, weight, temperature and volume.",
      uz: "Uzunlik, vazn, harorat va hajm.",
    },
    keywords: ["единицы", "конвертер"],
    icon: "ArrowLeftRight",
    available: false,
  },
  {
    id: "world-timezones",
    slug: "world-timezones",
    category: "everyday",
    name: { ru: "Часовые пояса мира", en: "World time zones", uz: "Dunyo vaqt mintaqalari" },
    description: {
      ru: "Конвертер времени, мировые часы и планировщик встреч.",
      en: "Time converter, world clock and meeting planner.",
      uz: "Vaqt konverteri, dunyo soati va uchrashuv rejalashtiruvchisi.",
    },
    keywords: [
      "время",
      "часовой пояс",
      "мировые часы",
      "timezone",
      "world clock",
      "vaqt",
      "uchrashuv",
    ],
    icon: "Clock3",
    available: true,
    featured: true,
  },
  {
    id: "json-formatter",
    slug: "json-formatter",
    category: "developers",
    name: { ru: "JSON-форматтер", en: "JSON formatter", uz: "JSON formatlagich" },
    description: {
      ru: "Красивый вывод и проверка JSON.",
      en: "Pretty-print and validate JSON.",
      uz: "JSONni chiroyli formatlash va tekshirish.",
    },
    keywords: ["json", "формат"],
    icon: "Braces",
    available: false,
  },
  {
    id: "base64",
    slug: "base64",
    category: "developers",
    name: { ru: "Base64", en: "Base64", uz: "Base64" },
    description: {
      ru: "Кодирование и декодирование строк.",
      en: "Encode and decode strings.",
      uz: "Satrlarni kodlash va dekodlash.",
    },
    keywords: ["base64", "encode"],
    icon: "Binary",
    available: false,
  },
  {
    id: "uuid-generator",
    slug: "uuid-generator",
    category: "developers",
    name: { ru: "Генератор UUID", en: "UUID generator", uz: "UUID generatori" },
    description: {
      ru: "UUID v4 пакетами, без сервера.",
      en: "Batch UUID v4, fully offline.",
      uz: "UUID v4 ni to‘plamda va oflayn yarating.",
    },
    keywords: ["uuid", "guid"],
    icon: "Fingerprint",
    available: true,
  },
  {
    id: "roof-calculator",
    slug: "roof-calculator",
    category: "construction",
    name: { ru: "Калькулятор кровли", en: "Roof calculator", uz: "Tom kalkulyatori" },
    description: {
      ru: "Четыре типа крыши, материалы и предварительная смета.",
      en: "Four roof types, materials and a preliminary estimate.",
      uz: "To‘rt xil tom turi, materiallar va dastlabki smeta.",
    },
    keywords: ["кровля", "крыша", "металлочерепица", "конёк"],
    icon: "House",
    available: true,
  },
  {
    id: "area-calculator",
    slug: "area-calculator",
    category: "construction",
    name: { ru: "Площадь помещения", en: "Room area", uz: "Xona maydoni" },
    description: {
      ru: "Площадь комнат, стен и покрытий.",
      en: "Room, wall and flooring area.",
      uz: "Xona, devor va pol maydonini hisoblash.",
    },
    keywords: ["площадь", "ремонт"],
    icon: "Square",
    available: false,
  },
  {
    id: "scale-converter",
    slug: "scale-converter",
    category: "construction",
    name: { ru: "Масштаб чертежа", en: "Drawing scale", uz: "Chizma masshtabi" },
    description: {
      ru: "Перевод размеров по масштабу.",
      en: "Convert measurements by drawing scale.",
      uz: "O‘lchamlarni chizma masshtabi bo‘yicha o‘tkazing.",
    },
    keywords: ["масштаб", "чертёж"],
    icon: "DraftingCompass",
    available: false,
  },
];

export function getCategory(id: CategoryId): ToolCategory | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

export function getCategoryBySlug(slug: string): ToolCategory | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getToolBySlug(slug: string): ToolDef | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function toolsByCategory(id: CategoryId): ToolDef[] {
  return TOOLS.filter((t) => t.category === id);
}

export function searchTools(query: string): ToolDef[] {
  const aliases: Record<string, string> = {
    фото: "image",
    photo: "image",
    картинка: "image",
    картинки: "image",
    ресайз: "image",
    крышу: "roof",
    кровлю: "roof",
  };
  const raw = query.trim().toLowerCase();
  const q = aliases[raw] ?? raw;
  if (!q) return TOOLS;
  return TOOLS.filter((t) => {
    const hay = [
      t.id,
      t.slug,
      t.name.ru,
      t.name.en,
      t.name.uz,
      t.description.ru,
      t.description.en,
      t.description.uz,
      ...t.keywords,
    ]
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  });
}

export function toolPath(tool: Pick<ToolDef, "slug">): string {
  return `/tools/${tool.slug}`;
}

export function categoryPath(category: Pick<ToolCategory, "slug">): string {
  return `/categories/${category.slug}`;
}
