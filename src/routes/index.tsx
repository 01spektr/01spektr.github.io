import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Clock3, Search, ShieldCheck, Sparkles } from "lucide-react";
import { useSyncExternalStore } from "react";
import { ToolIcon } from "@/components/tool-icon";
import { iconByName } from "@/lib/icons";
import { useI18n } from "@/lib/i18n";
import { CATEGORIES, type ToolDef, TOOLS, toolsByCategory } from "@/lib/tools/catalog";
import { getHistory, subscribeHistory } from "@/lib/tools/history";
import { seoHead } from "@/lib/seo";

export const Route = createFileRoute("/")({
  component: Home,
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

const QUICK_LINKS = [
  ["qr", "qr-generator"],
  ["контейнер", "cargo-volume"],
  ["кредит", "loan-calculator"],
  ["конвертер", "unit-converter"],
  ["json", "json-formatter"],
] as const;
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

function Home() {
  const { locale } = useI18n();
  const history = useSyncExternalStore(subscribeHistory, getHistory, getHistory);
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
              <Sparkles className="size-4" /> {TOOLS.length}+ инструментов <i /> 100% бесплатно
            </p>
            <h1>
              Один сервис.
              <br />
              <span>Много инструментов.</span>
            </h1>
            <p className="home-lead">
              Рассчитывайте, конвертируйте, создавайте, анализируйте. Быстро. Удобно. Бесплатно.
            </p>
            <Link to="/tools" className="home-search-link">
              <Search className="size-5" />
              <span>Например: QR-код, кредит, контейнер, dpi…</span>
              <b>
                <ArrowRight className="size-4" />
              </b>
            </Link>
            <div className="home-query-list">
              <span>Популярные запросы:</span>
              {QUICK_LINKS.map(([label, slug]) => (
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
          <Trust title="100% автономность" text="Ваши данные остаются в браузере" />
          <Trust title="Быстрая работа" text="Мгновенный результат" />
          <Trust title="Полностью бесплатно" text="Без регистрации и платежей" />
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
          <Stat value={`${TOOLS.length}+`} label="инструментов" />
          <Stat value={`${CATEGORIES.length}`} label="категорий" />
          <Stat value="100%" label="в браузере" />
          <Stat value="∞" label="бесплатно" />
        </div>
        <section id="categories" className="home-section">
          <SectionTitle title="Категории" action="Смотреть все категории" />
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
                    <small>{toolLabel(count)}</small>
                  </span>
                  <ArrowRight className="home-category-arrow size-4" />
                </Link>
              );
            })}
          </div>
        </section>
        <section className="home-section">
          <SectionTitle title="Популярные инструменты" action="Смотреть все" />
          <div className="home-tool-grid">
            {popular.map((tool) => (
              <HomeToolCard key={tool.id} tool={tool} popular />
            ))}
          </div>
        </section>
        <div className="home-lower-grid">
          <section className="home-section home-recent-section">
            <div className="mb-4 flex items-center justify-between">
              <h2>Недавно использовали</h2>
              <Clock3 className="size-4 text-muted-foreground" />
            </div>
            {recent.length ? (
              <div className="home-recent-list">
                {recent.map((tool) => (
                  <RecentItem key={tool.id} tool={tool} />
                ))}
              </div>
            ) : (
              <p className="home-empty">Здесь появятся инструменты, которыми вы воспользуетесь.</p>
            )}
          </section>
          <section className="home-privacy-card">
            <div>
              <ShieldCheck className="size-7" />
              <h2>
                Ваши данные
                <br />
                остаются с вами
              </h2>
              <p>
                Все инструменты работают прямо в вашем браузере. Никакие данные не отправляются на
                сервер.
              </p>
              <ul>
                {[
                  "100% конфиденциальность",
                  "Автономная работа",
                  "Без регистрации",
                  "Бесплатно навсегда",
                ].map((item) => (
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
          <SectionTitle title="Новые инструменты" action="Смотреть все" />
          <div className="home-tool-grid">
            {newTools.map((tool) => (
              <HomeToolCard key={tool.id} tool={tool} fresh />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function toolLabel(count: number) {
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
  popular,
  fresh,
}: {
  tool: ToolDef;
  popular?: boolean;
  fresh?: boolean;
}) {
  const { locale } = useI18n();
  return (
    <Link to="/tools/$slug" params={{ slug: tool.slug }} className="home-tool-card">
      <ToolIcon tool={tool} />
      {(popular || fresh) && <em>{fresh ? "NEW" : "Популярное"}</em>}
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
