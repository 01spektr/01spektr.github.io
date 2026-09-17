import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Hammer,
  House,
  Layers,
  Ruler,
  Square,
} from "lucide-react";
import { ToolIcon } from "@/components/tool-icon";
import { ToolCard } from "@/components/tool-card";
import { useI18n } from "@/lib/i18n";
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

function ConstructionCategory({
  tools,
  locale,
}: {
  tools: ReturnType<typeof toolsByCategory>;
  locale: "ru" | "en";
}) {
  const en = locale === "en";
  const topics = en
    ? ["All tools", "Rooms", "Finishing", "Materials", "Roofing", "Plot & fence"]
    : ["Все инструменты", "Помещения", "Отделка", "Материалы", "Крыша и кровля", "Участок и забор"];
  const benefits = en
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
  const collections = en
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
        <Link to="/">{en ? "Home" : "Главная"}</Link>
        <ChevronRight />
        <Link to="/tools">{en ? "Categories" : "Категории"}</Link>
        <ChevronRight />
        <span>{en ? "Construction & measures" : "Строительство и замеры"}</span>
      </nav>
      <section className="construction-hero">
        <div className="construction-intro">
          <span className="construction-icon">
            <Hammer />
          </span>
          <div>
            <h1>{en ? "Construction & renovation" : "Строительство и ремонт"}</h1>
            <p>
              {en
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
            <h2>{en ? "Tools" : "Инструменты"}</h2>
            <p>
              {en
                ? "Available now and planned directions"
                : "Доступные сейчас и запланированные направления"}
            </p>
          </div>
          <span>
            {tools.length} {en ? "tools" : "инструмента"}
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
              <h2>{en ? "Popular collections" : "Популярные подборки"}</h2>
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
            <h2>{en ? "More tools are coming" : "Новые инструменты уже в работе"}</h2>
            <p>
              {en
                ? "We are adding calculators for finishes and materials step by step."
                : "Постепенно добавляем калькуляторы отделки и строительных материалов."}
            </p>
            <Link to="/tools">
              {en ? "View all tools" : "Все инструменты"} <ArrowRight />
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
}: {
  tool: ReturnType<typeof toolsByCategory>[number];
  locale: "ru" | "en";
}) {
  const en = locale === "en";
  return (
    <Link to="/tools/$slug" params={{ slug: tool.slug }} className="construction-tool">
      <ToolIcon tool={tool} />
      <div>
        <h3>{tool.name[locale]}</h3>
        <p>{tool.description[locale]}</p>
        <small>
          {tool.available
            ? en
              ? "Open tool"
              : "Открыть инструмент"
            : en
              ? "Coming soon"
              : "Скоро"}
        </small>
      </div>
      <ArrowRight />
    </Link>
  );
}
