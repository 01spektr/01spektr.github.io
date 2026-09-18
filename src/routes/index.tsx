import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Clock3, Search, ShieldCheck, Sparkles } from "lucide-react";
import { useSyncExternalStore } from "react";
import { ToolIcon } from "@/components/tool-icon";
import { iconByName } from "@/lib/icons";
import { useI18n } from "@/lib/i18n";
import { CATEGORIES, type Locale, type ToolDef, TOOLS, toolsByCategory } from "@/lib/tools/catalog";
import { getHistory, subscribeHistory } from "@/lib/tools/history";
import { seoHead } from "@/lib/seo";

export const Route = createFileRoute("/")({
  component: HomeRoute,
  head: () => {
    const head = seoHead({
      title: "Toolboxi.uz — бесплатные инструменты для работы и жизни",
      description:
        "Создавайте QR-коды и штрихкоды, меняйте размер изображений, конвертируйте цвета, генерируйте UUID и выполняйте расчёты прямо в браузере.",
      path: "/",
    });
    return {
      ...head,
      links: [
        ...head.links,
        { rel: "alternate", hrefLang: "ru", href: "https://toolboxi.uz/" },
        { rel: "alternate", hrefLang: "en", href: "https://toolboxi.uz/en/" },
        { rel: "alternate", hrefLang: "x-default", href: "https://toolboxi.uz/" },
      ],
    };
  },
});

function HomeRoute() {
  const { locale } = useI18n();
  return <HomePage language={locale} />;
}

const QUICK_LINKS = {
  ru: [
    ["qr", "qr-generator"],
    ["контейнер", "cargo-volume"],
    ["кредит", "loan-calculator"],
    ["конвертер", "unit-converter"],
    ["json", "json-formatter"],
  ],
  en: [
    ["qr", "qr-generator"],
    ["barcode", "barcode-generator"],
    ["loan", "loan-calculator"],
    ["converter", "unit-converter"],
    ["json", "json-formatter"],
  ],
} as const;
const POPULAR_SLUGS = [
  "qr-generator",
  "barcode-generator",
  "loan-calculator",
  "cmyk-convert",
  "image-resize",
];
const DEMO_RECENT_SLUGS = [
  "uuid-generator",
  "qr-generator",
  "barcode-generator",
  "cmyk-convert",
  "image-resize",
];

const HOME_COPY = {
  ru: {
    kickerTools: "инструментов",
    kickerFree: "100% бесплатно",
    title: "Один сервис.",
    titleAccent: "Много инструментов.",
    lead: "Рассчитывайте, конвертируйте, создавайте, анализируйте. Быстро. Удобно. Бесплатно.",
    search: "Например: QR-код, кредит, контейнер, dpi…",
    popularQueries: "Популярные запросы:",
    trust: [
      ["100% автономность", "Ваши данные остаются в браузере"],
      ["Быстрая работа", "Мгновенный результат"],
      ["Полностью бесплатно", "Без регистрации и платежей"],
    ],
    statTools: "инструментов",
    statCategories: "категорий",
    statBrowser: "в браузере",
    statFree: "бесплатно",
    categories: "Категории",
    allCategories: "Смотреть все категории",
    popular: "Популярные инструменты",
    viewAll: "Смотреть все",
    recent: "Недавно использовали",
    recentEmpty: "Здесь появятся инструменты, которыми вы воспользуетесь.",
    privacyTitle: "Ваши данные\nостаются с вами",
    privacyText:
      "Все инструменты работают прямо в вашем браузере. Никакие данные не отправляются на сервер.",
    privacyItems: [
      "100% конфиденциальность",
      "Автономная работа",
      "Без регистрации",
      "Бесплатно навсегда",
    ],
    newTools: "Новые инструменты",
    popularBadge: "Популярное",
    newBadge: "NEW",
  },
  en: {
    kickerTools: "tools",
    kickerFree: "100% free",
    title: "One service.",
    titleAccent: "Many tools.",
    lead: "Calculate, convert, create and analyze. Fast. Simple. Free.",
    search: "Try: QR code, loan, barcode, dpi…",
    popularQueries: "Popular searches:",
    trust: [
      ["100% private", "Your data stays in your browser"],
      ["Fast", "Instant results"],
      ["Completely free", "No account or payment required"],
    ],
    statTools: "tools",
    statCategories: "categories",
    statBrowser: "in your browser",
    statFree: "free",
    categories: "Categories",
    allCategories: "View all categories",
    popular: "Popular tools",
    viewAll: "View all",
    recent: "Recently used",
    recentEmpty: "Tools you use will appear here.",
    privacyTitle: "Your data\nstays with you",
    privacyText:
      "All tools run directly in your browser. Your data is never sent to a server.",
    privacyItems: ["100% private", "Works locally", "No account", "Free forever"],
    newTools: "New tools",
    popularBadge: "Popular",
    newBadge: "NEW",
  },
} as const;

const EMPTY_HISTORY: ReturnType<typeof getHistory> = [];

export function HomePage({ language }: { language: Locale }) {
  const { locale } = useI18n();
  const copy = HOME_COPY[language];
  const history = useSyncExternalStore(subscribeHistory, getHistory, () => EMPTY_HISTORY);
  const popular = POPULAR_SLUGS.map((slug) => TOOLS.find((tool) => tool.slug === slug)).filter(
    (tool): tool is ToolDef => Boolean(tool),
  );
  const newTools = TOOLS.filter((tool) => !POPULAR_SLUGS.includes(tool.slug)).slice(0, 5);
  const actualRecent = [...new Set(history.map((entry) => entry.toolId))]
    .map((id) => TOOLS.find((tool) => tool.id === id))
    .filter((tool): tool is ToolDef => Boolean(tool));
  const demoRecent = DEMO_RECENT_SLUGS.map((slug) =>
    TOOLS.find((tool) => tool.slug === slug),
  ).filter((tool): tool is ToolDef => Boolean(tool));
  const recent = [
    ...actualRecent,
    ...demoRecent.filter((tool) => !actualRecent.some((item) => item.id === tool.id)),
  ].slice(0, 5);

  return (
    <div className="home-page -mx-4 -mt-5 pb-12 lg:-mx-8 lg:-mt-6">
      <section className="home-hero">
        <div className="home-hero-inner">
          <div className="home-hero-copy">
            <p className="home-kicker">
              <Sparkles className="size-4" /> {TOOLS.length}+ {copy.kickerTools} <i /> {copy.kickerFree}
            </p>
            <h1>
              {copy.title}
              <br />
              <span>{copy.titleAccent}</span>
            </h1>
            <p className="home-lead">{copy.lead}</p>
            <Link to="/tools" className="home-search-link">
              <Search className="size-5" />
              <span>{copy.search}</span>
              <b>
                <ArrowRight className="size-4" />
              </b>
            </Link>
            <div className="home-query-list">
              <span>{copy.popularQueries}</span>
              {QUICK_LINKS[language].map(([label, slug]) => (
                <Link key={slug} to="/tools/$slug" params={{ slug }}>
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div className="home-hero-art" aria-hidden="true">
            <img src="/visuals/tool-hero-3d.png" alt="" />
          </div>
        </div>
        <div className="home-trust-row">
          {copy.trust.map(([title, text]) => (
            <Trust key={title} title={title} text={text} />
          ))}
        </div>
      </section>
      <div className="home-content">
        <svg
          className="home-content-curve"
          viewBox="0 0 1000 140"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M18 0H446c28 4 17 98 47 97h487c11 0 20 9 20 20v23H0V24C0 11 7 0 18 0Z" />
        </svg>
        <div className="home-stats">
          <Stat value={`${TOOLS.length}+`} label={copy.statTools} />
          <Stat value={`${CATEGORIES.length}`} label={copy.statCategories} />
          <Stat value="100%" label={copy.statBrowser} />
          <Stat value="∞" label={copy.statFree} />
        </div>
        <section id="categories" className="home-section">
          <SectionTitle title={copy.categories} action={copy.allCategories} />
          <div className="home-category-grid">
            {CATEGORIES.map((category) => {
              const Icon = iconByName(category.icon);
              const count = toolsByCategory(category.id).length;
              return (
                <Link
                  key={category.id}
                  to="/categories/$id"
                  params={{ id: category.slug }}
                  className="home-category-card"
                >
                  <span
                    className="home-category-icon"
                    style={{
                      color: category.tint,
                      backgroundColor: `${category.tint}2b`,
                      borderColor: `${category.tint}38`,
                      boxShadow: `0 7px 16px ${category.tint}1c, inset 0 1px rgb(255 255 255 / 78%)`,
                    }}
                  >
                    <Icon className="size-6" strokeWidth={2.55} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <b>{category.name[locale]}</b>
                    <small>{toolLabel(count, language)}</small>
                  </span>
                  <ArrowRight className="home-category-arrow size-4" />
                </Link>
              );
            })}
          </div>
        </section>
        <section className="home-section">
          <SectionTitle title={copy.popular} action={copy.viewAll} />
          <div className="home-tool-grid">
            {popular.map((tool) => (
              <HomeToolCard key={tool.id} tool={tool} badge={copy.popularBadge} />
            ))}
          </div>
        </section>
        <div className="home-lower-grid">
          <section className="home-section home-recent-section">
            <div className="mb-4 flex items-center justify-between">
              <h2>{copy.recent}</h2>
              <Clock3 className="size-4 text-muted-foreground" />
            </div>
            {recent.length ? (
              <div className="home-recent-list">
                {recent.map((tool) => (
                  <RecentItem key={tool.id} tool={tool} />
                ))}
              </div>
            ) : (
              <p className="home-empty">{copy.recentEmpty}</p>
            )}
          </section>
          <section className="home-privacy-card">
            <div>
              <ShieldCheck className="size-7" />
              <h2>
                {copy.privacyTitle.split("\n").map((line, index) => (
                  <span key={line}>{index ? <><br />{line}</> : line}</span>
                ))}
              </h2>
              <p>{copy.privacyText}</p>
              <ul>
                {copy.privacyItems.map((item) => (
                  <li key={item}>
                    <Check className="size-4" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <img src="/visuals/privacy-shield-3d.png" alt="" />
          </section>
        </div>
        <section className="home-section home-new-tools">
          <SectionTitle title={copy.newTools} action={copy.viewAll} />
          <div className="home-tool-grid">
            {newTools.map((tool) => (
              <HomeToolCard key={tool.id} tool={tool} badge={copy.newBadge} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function toolLabel(count: number, language: Locale) {
  if (language === "en") return `${count} ${count === 1 ? "tool" : "tools"}`;
  return `${count} ${count % 10 === 1 && count % 100 !== 11 ? "инструмент" : count % 10 > 1 && count % 10 < 5 && (count % 100 < 10 || count % 100 > 20) ? "инструмента" : "инструментов"}`;
}
function Trust({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <ShieldCheck className="size-5" />
      <span>
        <b>{title}</b>
        <small>{text}</small>
      </span>
    </div>
  );
}
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}
function SectionTitle({ title, action }: { title: string; action: string }) {
  return (
    <div className="home-section-title">
      <h2>{title}</h2>
      <Link to="/tools">
        {action}
        <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}
function HomeToolCard({
  tool,
  badge,
}: {
  tool: ToolDef;
  badge?: string;
}) {
  const { locale } = useI18n();
  return (
    <Link to="/tools/$slug" params={{ slug: tool.slug }} className="home-tool-card">
      <ToolIcon tool={tool} />
      {badge && <em>{badge}</em>}
      <b>{tool.name[locale]}</b>
      <p>{tool.description[locale]}</p>
      <ArrowRight className="home-tool-arrow size-4" />
    </Link>
  );
}
function RecentItem({ tool }: { tool: ToolDef }) {
  const { locale } = useI18n();
  return (
    <Link to="/tools/$slug" params={{ slug: tool.slug }}>
      <ToolIcon tool={tool} size="compact" />
      <b>{tool.name[locale]}</b>
      <ArrowRight className="size-4 text-muted-foreground" />
    </Link>
  );
}
