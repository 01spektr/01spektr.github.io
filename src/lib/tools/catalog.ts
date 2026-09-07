export type Locale = "ru" | "en";

export type CategoryId =
  | "logistics"
  | "finance"
  | "business"
  | "design-print"
  | "ai-text"
  | "everyday"
  | "developers"
  | "construction";

export interface Localized {
  ru: string;
  en: string;
}

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
    name: { ru: "Логистика и грузоперевозки", en: "Logistics & shipping" },
    description: {
      ru: "Расчёты груза, объёма и маршрутов",
      en: "Cargo, volume and route calculations",
    },
    icon: "Package",
    tint: "#38bdf8",
  },
  {
    id: "finance",
    slug: "finance",
    name: { ru: "Финансы и инвестиции", en: "Finance & investing" },
    description: {
      ru: "Проценты, НДС, кредиты и валюта",
      en: "Interest, VAT, loans and currency",
    },
    icon: "Wallet",
    tint: "#34d399",
  },
  {
    id: "business",
    slug: "business",
    name: { ru: "Для работы и бизнеса", en: "Work & business" },
    description: {
      ru: "Документы, счета и ежедневные задачи",
      en: "Documents, invoices and daily work",
    },
    icon: "Briefcase",
    tint: "#60a5fa",
  },
  {
    id: "design-print",
    slug: "design-print",
    name: { ru: "Дизайн и полиграфия", en: "Design & print" },
    description: {
      ru: "QR-коды, цвета, макеты и подготовка к печати",
      en: "QR codes, color, layouts and print prep",
    },
    icon: "Pentagon",
    tint: "#8b7cf6",
  },
  {
    id: "ai-text",
    slug: "ai-text",
    name: { ru: "AI и работа с текстом", en: "AI & writing" },
    description: {
      ru: "Текст, счётчики, правки и шаблоны",
      en: "Writing, counters, edits and templates",
    },
    icon: "PenLine",
    tint: "#f472b6",
  },
  {
    id: "everyday",
    slug: "everyday",
    name: { ru: "Повседневные инструменты", en: "Everyday tools" },
    description: {
      ru: "Калькуляторы, пароли, конвертеры",
      en: "Calculators, passwords, converters",
    },
    icon: "House",
    tint: "#fb923c",
  },
  {
    id: "developers",
    slug: "developers",
    name: { ru: "Для разработчиков", en: "For developers" },
    description: {
      ru: "Кодирование, JSON, хеши и UUID",
      en: "Encoding, JSON, hashes and UUIDs",
    },
    icon: "Code2",
    tint: "#22d3ee",
  },
  {
    id: "construction",
    slug: "construction",
    name: { ru: "Строительство и замеры", en: "Construction & measures" },
    description: {
      ru: "Площадь, объём, масштаб и единицы",
      en: "Area, volume, scale and units",
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
    name: { ru: "Генератор QR-кодов", en: "QR code generator" },
    description: {
      ru: "Создавайте QR-коды для ссылок, текста, контактов, Wi-Fi, email, телефона и других данных.",
      en: "Create QR codes for links, text, contacts, Wi-Fi, email, phone and more.",
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
    name: { ru: "Палитра цветов", en: "Color palette" },
    description: {
      ru: "Подбор гармоничных цветов для бренда и печати.",
      en: "Build harmonious palettes for brand and print.",
    },
    keywords: ["цвет", "палитра", "hex", "color"],
    icon: "Palette",
    available: false,
  },
  {
    id: "image-resize",
    slug: "image-resize",
    category: "design-print",
    name: { ru: "Ресайз изображений", en: "Image resizer" },
    description: {
      ru: "Изменение размера картинок без потери качества.",
      en: "Resize images without leaving the browser.",
    },
    keywords: ["изображение", "ресайз", "png"],
    icon: "Image",
    available: false,
  },
  {
    id: "barcode-generator",
    slug: "barcode-generator",
    category: "design-print",
    name: { ru: "Генератор штрихкодов", en: "Barcode generator" },
    description: {
      ru: "EAN, Code128 и другие линейные коды.",
      en: "EAN, Code128 and other linear barcodes.",
    },
    keywords: ["штрихкод", "ean", "barcode"],
    icon: "Barcode",
    available: false,
  },
  {
    id: "cmyk-convert",
    slug: "cmyk-convert",
    category: "design-print",
    name: { ru: "RGB → CMYK", en: "RGB → CMYK" },
    description: {
      ru: "Перевод цветов в печатную модель CMYK.",
      en: "Convert colors into a print-ready CMYK model.",
    },
    keywords: ["cmyk", "rgb", "печать"],
    icon: "Droplets",
    available: false,
  },
  {
    id: "cargo-volume",
    slug: "cargo-volume",
    category: "logistics",
    name: { ru: "Объём груза", en: "Cargo volume" },
    description: {
      ru: "Расчёт объёма коробок и паллет.",
      en: "Box and pallet volume calculator.",
    },
    keywords: ["груз", "объём", "паллета"],
    icon: "Package",
    available: false,
  },
  {
    id: "shipping-cost",
    slug: "shipping-cost",
    category: "logistics",
    name: { ru: "Стоимость доставки", en: "Shipping cost" },
    description: {
      ru: "Оценка стоимости перевозки по весу и расстоянию.",
      en: "Estimate shipping cost by weight and distance.",
    },
    keywords: ["доставка", "тариф"],
    icon: "Truck",
    available: false,
  },
  {
    id: "vat-calculator",
    slug: "vat-calculator",
    category: "finance",
    name: { ru: "Калькулятор НДС", en: "VAT calculator" },
    description: {
      ru: "Выделение и начисление НДС.",
      en: "Add or extract VAT from an amount.",
    },
    keywords: ["ндс", "vat", "налог"],
    icon: "Percent",
    available: false,
  },
  {
    id: "loan-calculator",
    slug: "loan-calculator",
    category: "finance",
    name: { ru: "Кредитный калькулятор", en: "Loan calculator" },
    description: {
      ru: "Платежи, переплата и график.",
      en: "Payments, overpay and a simple schedule.",
    },
    keywords: ["кредит", "платёж"],
    icon: "Landmark",
    available: false,
  },
  {
    id: "invoice-number",
    slug: "invoice-number",
    category: "business",
    name: { ru: "Номер счёта", en: "Invoice number" },
    description: {
      ru: "Генератор номеров документов.",
      en: "Generate sequential document numbers.",
    },
    keywords: ["счёт", "invoice"],
    icon: "FileText",
    available: false,
  },
  {
    id: "word-counter",
    slug: "word-counter",
    category: "ai-text",
    name: { ru: "Счётчик слов", en: "Word counter" },
    description: {
      ru: "Слова, знаки и время чтения.",
      en: "Words, characters and reading time.",
    },
    keywords: ["слова", "текст"],
    icon: "Type",
    available: false,
  },
  {
    id: "case-converter",
    slug: "case-converter",
    category: "ai-text",
    name: { ru: "Регистр текста", en: "Case converter" },
    description: {
      ru: "UPPER, lower, Title Case и другие.",
      en: "UPPER, lower, Title Case and more.",
    },
    keywords: ["регистр", "case"],
    icon: "CaseSensitive",
    available: false,
  },
  {
    id: "password-generator",
    slug: "password-generator",
    category: "everyday",
    name: { ru: "Генератор паролей", en: "Password generator" },
    description: {
      ru: "Надёжные пароли прямо в браузере.",
      en: "Strong passwords generated locally.",
    },
    keywords: ["пароль", "password"],
    icon: "KeyRound",
    available: false,
  },
  {
    id: "unit-converter",
    slug: "unit-converter",
    category: "everyday",
    name: { ru: "Конвертер единиц", en: "Unit converter" },
    description: {
      ru: "Длина, вес, температура и объём.",
      en: "Length, weight, temperature and volume.",
    },
    keywords: ["единицы", "конвертер"],
    icon: "ArrowLeftRight",
    available: false,
  },
  {
    id: "json-formatter",
    slug: "json-formatter",
    category: "developers",
    name: { ru: "JSON-форматтер", en: "JSON formatter" },
    description: {
      ru: "Красивый вывод и проверка JSON.",
      en: "Pretty-print and validate JSON.",
    },
    keywords: ["json", "формат"],
    icon: "Braces",
    available: false,
  },
  {
    id: "base64",
    slug: "base64",
    category: "developers",
    name: { ru: "Base64", en: "Base64" },
    description: {
      ru: "Кодирование и декодирование строк.",
      en: "Encode and decode strings.",
    },
    keywords: ["base64", "encode"],
    icon: "Binary",
    available: false,
  },
  {
    id: "uuid-generator",
    slug: "uuid-generator",
    category: "developers",
    name: { ru: "Генератор UUID", en: "UUID generator" },
    description: {
      ru: "UUID v4 пакетами, без сервера.",
      en: "Batch UUID v4, fully offline.",
    },
    keywords: ["uuid", "guid"],
    icon: "Fingerprint",
    available: false,
  },
  {
    id: "area-calculator",
    slug: "area-calculator",
    category: "construction",
    name: { ru: "Площадь помещения", en: "Room area" },
    description: {
      ru: "Площадь комнат, стен и покрытий.",
      en: "Room, wall and flooring area.",
    },
    keywords: ["площадь", "ремонт"],
    icon: "Square",
    available: false,
  },
  {
    id: "scale-converter",
    slug: "scale-converter",
    category: "construction",
    name: { ru: "Масштаб чертежа", en: "Drawing scale" },
    description: {
      ru: "Перевод размеров по масштабу.",
      en: "Convert measurements by drawing scale.",
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
  const q = query.trim().toLowerCase();
  if (!q) return TOOLS;
  return TOOLS.filter((t) => {
    const hay = [
      t.id,
      t.slug,
      t.name.ru,
      t.name.en,
      t.description.ru,
      t.description.en,
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
