import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Hammer,
  House,
  Image as ImageIcon,
  Layers,
  Palette,
  Printer,
  QrCode,
  Ruler,
  Sparkles,
  Square,
} from "lucide-react";
import { ToolIcon } from "@/components/tool-icon";
import { ToolCard } from "@/components/tool-card";
import { useI18n } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";
import { getCategoryBySlug, toolsByCategory } from "@/lib/tools/catalog";
import { iconByName } from "@/lib/icons";
import { seoHead } from "@/lib/seo";
import "./categories.css";

export const Route = createFileRoute("/categories/$id")({
  component: CategoryPage,
  head: ({ params }) => {
    const category = getCategoryBySlug(params.id);
    return seoHead({
      title: category ? `${category.name.ru} — Toolboxi.uz` : "Категория не найдена — Toolboxi.uz",
      description: category?.description.ru ?? "Категория инструментов не найдена.",
      path: `/categories/${params.id}`,
      noIndex: !category,
    });
  },
});

function CategoryPage() {
  const { id } = Route.useParams();
  const { t, locale } = useI18n();
  const category = getCategoryBySlug(id);

  if (!category) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted-foreground">{t("search.empty")}</p>
        <Link to="/tools" className="mt-4 inline-block text-sm text-primary">
          {t("coming.back")}
        </Link>
      </div>
    );
  }

  const Icon = iconByName(category.icon);
  const tools = toolsByCategory(category.id);

  if (category.id === "construction") {
    return <ConstructionCategory tools={tools} locale={locale} />;
  }

  if (category.id === "design-print") {
    return <DesignPrintCategory tools={tools} locale={locale} />;
  }

  return (
    <div className="mx-auto max-w-6xl pb-10">
      <div className="mb-6 flex items-center gap-3">
        <span
          className="flex size-12 items-center justify-center rounded-2xl"
          style={{ background: `${category.tint}22`, color: category.tint }}
        >
          <Icon className="size-6" />
        </span>
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            {category.name[locale]}
          </h1>
          <p className="text-sm text-muted-foreground">{category.description[locale]}</p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}

function DesignPrintCategory({
  tools,
  locale,
}: {
  tools: ReturnType<typeof toolsByCategory>;
  locale: Locale;
}) {
  const en = locale === "en";
  const uz = locale === "uz";
  const topics = uz
    ? ["Barcha vositalar", "Ranglar", "Tasvirlar", "Kodlar", "Bosmaga tayyorlash"]
    : en
      ? ["All tools", "Colors", "Images", "Codes", "Print preparation"]
      : ["Все инструменты", "Цвета", "Изображения", "Коды", "Подготовка к печати"];
  const benefits = uz
    ? [["Aniq", "Rang va o‘lcham nazorati"], ["Qulay", "Brauzerda ishlaydi"], ["Tayyor", "Raqamli va bosma uchun"]]
    : en
      ? [["Precise", "Color and size control"], ["Convenient", "Works in your browser"], ["Ready", "For digital and print"]]
      : [["Точно", "Контроль цвета и размера"], ["Удобно", "Работает в браузере"], ["Готово", "Для экрана и печати"]];
  const collections = uz
    ? [
        { title: "Brend ranglari", text: "Palitra va CMYK", Icon: Palette, slug: "color-palette" },
        { title: "Kodlar va belgilar", text: "QR va shtrix-kodlar", Icon: QrCode, slug: "qr-generator" },
        { title: "Tasvirlarni tayyorlash", text: "O‘lcham va eksport", Icon: ImageIcon, slug: "image-resize" },
      ]
    : en
      ? [
          { title: "Brand colors", text: "Palettes and CMYK", Icon: Palette, slug: "color-palette" },
          { title: "Codes & labels", text: "QR codes and barcodes", Icon: QrCode, slug: "qr-generator" },
          { title: "Image preparation", text: "Resize and export", Icon: ImageIcon, slug: "image-resize" },
        ]
      : [
          { title: "Цвета бренда", text: "Палитры и CMYK", Icon: Palette, slug: "color-palette" },
          { title: "Коды и маркировка", text: "QR-коды и штрихкоды", Icon: QrCode, slug: "qr-generator" },
          { title: "Подготовка изображений", text: "Размер и экспорт", Icon: ImageIcon, slug: "image-resize" },
        ];
  const extendedDescriptions: Record<string, string> = {
    "qr-generator": uz
      ? "Havolalar, matn, Wi‑Fi, kontaktlar, email va telefon uchun QR-kod yarating. Rang, shakl va logotipni sozlab, tayyor kodni PNG, SVG yoki PDF formatida yuklab oling."
      : en
        ? "Create QR codes for links, text, Wi-Fi, contacts, email and phone numbers. Customize colors, shapes and a logo, then download the result as PNG, SVG or PDF."
        : "Создавайте QR-коды для ссылок, текста, Wi‑Fi, контактов, email и телефона. Настраивайте цвета, форму и логотип, затем скачивайте готовый код в PNG, SVG или PDF.",
    "color-palette": uz
      ? "Brend, sayt, illyustratsiya yoki bosma maket uchun uyg‘un ranglar palitrasini tanlang. HEX, RGB va boshqa qiymatlarni nusxalab, tayyor kombinatsiyalarni saqlang."
      : en
        ? "Build a harmonious color palette for a brand, website, illustration or print layout. Copy HEX and RGB values and save ready-made color combinations."
        : "Подбирайте гармоничную палитру для бренда, сайта, иллюстрации или печатного макета. Копируйте значения HEX и RGB и сохраняйте готовые сочетания цветов.",
    "image-resize": uz
      ? "Rasm o‘lchamini aniq piksellarda o‘zgartiring, nisbatlarni saqlang va kerakli joyni kesib oling. JPG, PNG, WebP yoki AVIF formatiga sifat va fayl hajmini nazorat qilib eksport qiling."
      : en
        ? "Resize images to exact pixel dimensions, preserve proportions and crop the required area. Export to JPG, PNG, WebP or AVIF while controlling quality and file size."
        : "Изменяйте размер изображения в точных пикселях, сохраняйте пропорции и обрезайте нужную область. Экспортируйте в JPG, PNG, WebP или AVIF с контролем качества и веса файла.",
    "barcode-generator": uz
      ? "Mahsulot, ombor, hujjat va yorliqlar uchun EAN-13, EAN-8, Code 128 va boshqa shtrix-kodlarni yarating. O‘lcham va yozuvlarni sozlab, kodni bosma uchun yuklab oling."
      : en
        ? "Generate EAN-13, EAN-8, Code 128 and other barcodes for products, inventory, documents and labels. Adjust dimensions and captions, then download a print-ready code."
        : "Генерируйте EAN-13, EAN-8, Code 128 и другие штрихкоды для товаров, склада, документов и этикеток. Настраивайте размеры и подписи и скачивайте код для печати.",
    "cmyk-convert": uz
      ? "Ekrandagi RGB va HEX ranglarini bosma CMYK modeliga o‘tkazing. Bo‘yoq qoplamasini tekshiring, ekran va bosma natijani solishtiring hamda yaqin Pantone rangini toping."
      : en
        ? "Convert on-screen RGB and HEX colors to a print-ready CMYK model. Check ink coverage, compare screen and print previews and find the nearest Pantone color."
        : "Переводите экранные цвета RGB и HEX в печатную модель CMYK. Проверяйте покрытие краской, сравнивайте цвет на экране и в печати и находите ближайший Pantone.",
  };

  return (
    <div className="construction-page design-category-page pb-10">
      <nav aria-label="Breadcrumb" className="construction-breadcrumb">
        <Link to="/">{uz ? "Bosh sahifa" : en ? "Home" : "Главная"}</Link>
        <ChevronRight />
        <Link to="/tools">{uz ? "Toifalar" : en ? "Categories" : "Категории"}</Link>
        <ChevronRight />
        <span>{uz ? "Dizayn va poligrafiya" : en ? "Design & print" : "Дизайн и полиграфия"}</span>
      </nav>

      <section className="construction-hero design-category-hero">
        <div className="construction-intro">
          <span className="construction-icon design-category-icon"><Palette /></span>
          <div>
            <h1>{uz ? "Dizayn va poligrafiya" : en ? "Design & print" : "Дизайн и полиграфия"}</h1>
            <p>
              {uz
                ? "Ranglar, tasvirlar, QR va shtrix-kodlar bilan ishlash vositalari. Ekran va bosma uchun hammasi bir joyda."
                : en
                  ? "Tools for colors, images, QR codes and barcodes. Everything for screen and print in one place."
                  : "Инструменты для работы с цветом, изображениями, QR-кодами и штрихкодами. Всё для экрана и печати — в одном месте."}
            </p>
          </div>
        </div>
        <div className="design-category-art" aria-hidden="true">
          <span className="design-art-card design-art-palette"><Palette /></span>
          <span className="design-art-card design-art-image"><ImageIcon /></span>
          <span className="design-art-card design-art-qr"><QrCode /></span>
          <i className="design-art-swatch design-art-swatch-one" />
          <i className="design-art-swatch design-art-swatch-two" />
          <i className="design-art-swatch design-art-swatch-three" />
        </div>
        <div className="construction-benefits">
          {benefits.map(([title, text], index) => (
            <div key={title}>
              <span>{index === 0 ? <Sparkles /> : index === 1 ? <Check /> : <Printer />}</span>
              <p><b>{title}</b><small>{text}</small></p>
            </div>
          ))}
        </div>
      </section>

      <div className="construction-topics">
        {topics.map((topic, index) => <button type="button" className={index === 0 ? "is-active" : ""} key={topic}>{topic}</button>)}
      </div>

      <section>
        <div className="construction-section-heading">
          <div>
            <h2>{uz ? "Vositalar" : en ? "Tools" : "Инструменты"}</h2>
            <p>{uz ? "Dizayn va bosma uchun tayyor vositalar" : en ? "Ready-to-use tools for design and print" : "Готовые инструменты для дизайна и печати"}</p>
          </div>
          <span>{tools.length} {uz ? "vosita" : en ? "tools" : "инструментов"}</span>
        </div>
        <div className="construction-tool-grid">
          {tools.map((tool) => (
            <ConstructionTool
              key={tool.id}
              tool={tool}
              locale={locale}
              description={extendedDescriptions[tool.slug]}
            />
          ))}
        </div>
      </section>

      <div className="construction-bottom">
        <section className="construction-collections">
          <div className="construction-panel-heading"><div><span><Layers /></span><h2>{uz ? "Ommabop to‘plamlar" : en ? "Popular collections" : "Популярные подборки"}</h2></div></div>
          <div>
            {collections.map(({ title, text, Icon: CollectionIcon, slug }) => (
              <Link to="/tools/$slug" params={{ slug }} key={title}>
                <span><CollectionIcon /></span><p><b>{title}</b><small>{text}</small></p><ChevronRight />
              </Link>
            ))}
          </div>
        </section>
        <section className="construction-note design-category-note">
          <span><Printer /></span>
          <div>
            <h2>{uz ? "Yangi dizayn vositalari tayyorlanmoqda" : en ? "More design tools are coming" : "Новые инструменты уже в работе"}</h2>
            <p>{uz ? "Maket, rang va bosmaga tayyorlash vositalarini qo‘shib boramiz." : en ? "We are adding more tools for layouts, color and print preparation." : "Добавляем новые инструменты для макетов, цвета и подготовки к печати."}</p>
            <Link to="/tools">{uz ? "Barcha vositalar" : en ? "View all tools" : "Все инструменты"} <ArrowRight /></Link>
          </div>
        </section>
      </div>
    </div>
  );
}

function ConstructionCategory({
  tools,
  locale,
}: {
  tools: ReturnType<typeof toolsByCategory>;
  locale: Locale;
}) {
  const en = locale === "en";
  const uz = locale === "uz";
  const topics = uz
    ? ["Barcha vositalar", "Xonalar", "Pardozlash", "Materiallar", "Tom", "Yer va devor"]
    : en
    ? ["All tools", "Rooms", "Finishing", "Materials", "Roofing", "Plot & fence"]
    : ["Все инструменты", "Помещения", "Отделка", "Материалы", "Крыша и кровля", "Участок и забор"];
  const benefits = uz
    ? [["Tez", "Natija bir zumda"], ["Tushunarli", "Qulay vositalar"], ["Amaliy", "Uy va ish uchun"]]
    : en
    ? [
        ["Fast", "Instant results"],
        ["Clear", "Easy-to-use tools"],
        ["Practical", "For home and work"],
      ]
    : [
        ["Быстро", "Мгновенный результат"],
        ["Понятно", "Простые инструменты"],
        ["Практично", "Для дома и работы"],
      ];
  const collections = uz
    ? [
        { title: "Xonani ta’mirlash", text: "Maydon, devorlar va pardoz", Icon: Square },
        { title: "Tom va qoplama", text: "Tom geometriyasi va materiallar", Icon: House },
        { title: "Rejalar va chizmalar", text: "Masshtab va o‘lchovlar", Icon: Ruler },
      ]
    : en
    ? [
        { title: "Room renovation", text: "Area, walls and finishes", Icon: Square },
        { title: "Roofing", text: "Roof geometry and materials", Icon: House },
        { title: "Plans & drawings", text: "Scale and measurements", Icon: Ruler },
      ]
    : [
        { title: "Ремонт помещений", text: "Площадь, стены и отделка", Icon: Square },
        { title: "Крыша и кровля", text: "Геометрия крыши и материалы", Icon: House },
        { title: "Планы и чертежи", text: "Масштаб и замеры", Icon: Ruler },
      ];

  return (
    <div className="construction-page pb-10">
      <nav aria-label="Breadcrumb" className="construction-breadcrumb">
        <Link to="/">{uz ? "Bosh sahifa" : en ? "Home" : "Главная"}</Link>
        <ChevronRight />
        <Link to="/tools">{uz ? "Toifalar" : en ? "Categories" : "Категории"}</Link>
        <ChevronRight />
        <span>{uz ? "Qurilish va o‘lchovlar" : en ? "Construction & measures" : "Строительство и замеры"}</span>
      </nav>
      <section className="construction-hero">
        <div className="construction-intro">
          <span className="construction-icon">
            <Hammer />
          </span>
          <div>
            <h1>{uz ? "Qurilish va ta’mirlash" : en ? "Construction & renovation" : "Строительство и ремонт"}</h1>
            <p>
              {uz
                ? "Maydon, o‘lcham, materiallar va tom uchun kalkulyatorlar. Loyiha uchun kerakli hamma narsa bir joyda."
                : en
                ? "Calculators and tools for areas, dimensions, materials and roofing. Everything you need for a project in one place."
                : "Калькуляторы и инструменты для площади, размеров, материалов и кровли. Всё нужное для проекта — в одном месте."}
            </p>
          </div>
        </div>
        <img src="/visuals/construction-hero-v2.png" alt="" className="construction-hero-image" />
        <div className="construction-benefits">
          {benefits.map(([title, text], index) => (
            <div key={title}>
              <span>{index === 0 ? <ArrowRight /> : index === 1 ? <Check /> : <Layers />}</span>
              <p>
                <b>{title}</b>
                <small>{text}</small>
              </p>
            </div>
          ))}
        </div>
      </section>
      <div className="construction-topics">
        {topics.map((topic, index) => (
          <button type="button" className={index === 0 ? "is-active" : ""} key={topic}>
            {topic}
          </button>
        ))}
      </div>
      <section>
        <div className="construction-section-heading">
          <div>
            <h2>{uz ? "Vositalar" : en ? "Tools" : "Инструменты"}</h2>
            <p>
              {uz
                ? "Hozir mavjud va rejalashtirilgan yo‘nalishlar"
                : en
                ? "Available now and planned directions"
                : "Доступные сейчас и запланированные направления"}
            </p>
          </div>
          <span>
            {tools.length} {uz ? "vosita" : en ? "tools" : "инструмента"}
          </span>
        </div>
        <div className="construction-tool-grid">
          {tools.map((tool) => (
            <ConstructionTool key={tool.id} tool={tool} locale={locale} />
          ))}
        </div>
      </section>
      <div className="construction-bottom">
        <section className="construction-collections">
          <div className="construction-panel-heading">
            <div>
              <span>
                <Layers />
              </span>
              <h2>{uz ? "Ommabop to‘plamlar" : en ? "Popular collections" : "Популярные подборки"}</h2>
            </div>
          </div>
          <div>
            {collections.map(({ title, text, Icon: CollectionIcon }) => (
              <Link to="/tools" key={title}>
                <span>
                  <CollectionIcon />
                </span>
                <p>
                  <b>{title}</b>
                  <small>{text}</small>
                </p>
                <ChevronRight />
              </Link>
            ))}
          </div>
        </section>
        <section className="construction-note">
          <span>
            <Hammer />
          </span>
          <div>
            <h2>{uz ? "Yangi vositalar tayyorlanmoqda" : en ? "More tools are coming" : "Новые инструменты уже в работе"}</h2>
            <p>
              {uz
                ? "Pardozlash va qurilish materiallari kalkulyatorlarini bosqichma-bosqich qo‘shmoqdamiz."
                : en
                ? "We are adding calculators for finishes and materials step by step."
                : "Постепенно добавляем калькуляторы отделки и строительных материалов."}
            </p>
            <Link to="/tools">
              {uz ? "Barcha vositalar" : en ? "View all tools" : "Все инструменты"} <ArrowRight />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

function ConstructionTool({
  tool,
  locale,
  description,
}: {
  tool: ReturnType<typeof toolsByCategory>[number];
  locale: Locale;
  description?: string;
}) {
  const en = locale === "en";
  const uz = locale === "uz";
  return (
    <Link to="/tools/$slug" params={{ slug: tool.slug }} className="construction-tool">
      <ToolIcon tool={tool} />
      <div>
        <h3>{tool.name[locale]}</h3>
        <p>{description ?? tool.description[locale]}</p>
        <small>
          {tool.available
            ? uz ? "Vositani ochish" : en ? "Open tool" : "Открыть инструмент"
            : uz ? "Tez orada" : en ? "Coming soon" : "Скоро"}
        </small>
      </div>
      <ArrowRight />
    </Link>
  );
}
