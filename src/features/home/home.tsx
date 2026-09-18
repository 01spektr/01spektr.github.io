import { useEffect, useState, useSyncExternalStore, type CSSProperties } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Box,
  Check,
  Clock3,
  Heart,
  Image,
  Layers,
  LockKeyhole,
  Search,
  ShieldCheck,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { CATEGORIES, TOOLS, searchTools, type Locale, type ToolDef } from "@/lib/tools/catalog";
import { iconByName } from "@/lib/icons";
import { getHistory, subscribeHistory } from "@/lib/tools/history";
import { getFavorites, subscribeFavorites, toggleFavorite } from "@/lib/tools/favorites";
import { toast } from "sonner";
import { seoHead } from "@/lib/seo";
import "./home.css";
const copy = {
  ru: {
    kicker: "Маленькие инструменты. Большие возможности.",
    title: "Все нужные инструменты",
    accent: "в одном месте.",
    lead: "Рассчитывайте, создавайте и преобразовывайте. Бесплатные инструменты для работы и повседневных задач.",
    search: "Что вы хотите сделать?",
    example: "Например: создать QR-код или изменить размер фото",
    find: "Найти инструмент",
    ready: "готовых инструмента",
    categories: "категорий",
    free: "без регистрации",
    browse: "Выберите направление",
    all: "Весь каталог",
    available: "Доступно",
    soon: "В разработке",
    quick: "Ваш следующий результат — в пару кликов",
    recommended: "Рекомендуемые",
    favorites: "Избранное",
    open: "Открыть инструмент",
    nofav: "Сохраните нужные инструменты сердечком — они появятся здесь.",
    empty: "Ничего не найдено. Попробуйте «QR», «фото», «крыша» или «UUID».",
    found: "Результаты поиска",
    recent: "Продолжите с того места, где остановились",
    history: "Вся история",
    norecent: "Здесь будут ваши недавние расчёты.",
    recentHint: "Создайте QR-код, обработайте изображение или сохраните расчёт крыши.",
    privacy: "Ваши файлы остаются с вами",
    privacyBody:
      "Доступные инструменты обрабатывают файлы и выполняют расчёты прямо в браузере. Загружать их на сервер не нужно.",
    privacyLink: "Подробнее о конфиденциальности",
    local: "Обработка на устройстве",
    account: "Без создания аккаунта",
    save: "История в вашем браузере",
    favorite: "Добавить в избранное",
    unfavorite: "Убрать из избранного",
    clear: "Очистить поиск",
    roof: "Рассчитать крышу",
    qr: "Создать QR-код",
    photo: "Изменить фото",
    allTools: "Все инструменты",
    count: "инструментов",
    soonHint: "Инструменты этой категории ещё готовятся",
    ruOnly: "Интерфейс инструмента: русский",
  },
  en: {
    kicker: "Small tools. Big possibilities.",
    title: "Everyday tools,",
    accent: "all in one place.",
    lead: "Calculate, create and convert. Free tools for your work, projects and everyday tasks.",
    search: "What would you like to do?",
    example: "Try: create a QR code or resize a photo",
    find: "Find a tool",
    ready: "tools ready to use",
    categories: "categories",
    free: "no account needed",
    browse: "Find your starting point",
    all: "Browse all tools",
    available: "Available",
    soon: "Coming soon",
    quick: "Your next result is just a few clicks away",
    recommended: "Recommended",
    favorites: "Favorites",
    open: "Open tool",
    nofav: "Save tools with the heart button to find them here.",
    empty: "No results. Try “QR”, “photo”, “roof” or “UUID”.",
    found: "Search results",
    recent: "Pick up where you left off",
    history: "View history",
    norecent: "Your recent calculations will appear here.",
    recentHint: "Create a QR code, resize an image or save a roof calculation.",
    privacy: "Your files stay with you",
    privacyBody:
      "Available tools process files and run calculations directly in your browser. There is no need to upload them to a server.",
    privacyLink: "Read our privacy policy",
    local: "Processed on your device",
    account: "No account required",
    save: "History stored in your browser",
    favorite: "Add to favorites",
    unfavorite: "Remove from favorites",
    clear: "Clear search",
    roof: "Calculate a roof",
    qr: "Create a QR code",
    photo: "Resize a photo",
    allTools: "All tools",
    count: "tools",
    soonHint: "Tools in this category are still in development",
    ruOnly: "Tool interface: Russian",
  },
};
const EMPTY_HISTORY: ReturnType<typeof getHistory> = [];
const shortNames: Record<string, [string, string]> = {
  logistics: ["Логистика", "Logistics"],
  finance: ["Финансы", "Finance"],
  business: ["Для бизнеса", "Business"],
  "design-print": ["Дизайн и печать", "Design & print"],
  "ai-text": ["Текст и AI", "Text & AI"],
  everyday: ["На каждый день", "Everyday"],
  developers: ["Разработчикам", "Developer tools"],
  construction: ["Строительство", "Construction"],
};
export function Home({ language }: { language: Locale }) {
  const c = copy[language === "uz" ? "en" : language],
    { setLocale } = useI18n(),
    navigate = useNavigate();
  useEffect(() => {
    setLocale(language);
  }, [language, setLocale]);
  const [query, setQuery] = useState(""),
    [filter, setFilter] = useState<"all" | "favorites">("all"),
    [favorites, setFavorites] = useState<string[]>([]);
  useEffect(() => {
    const sync = () => setFavorites(getFavorites());
    sync();
    return subscribeFavorites(sync);
  }, []);
  const history = useSyncExternalStore(subscribeHistory, getHistory, () => EMPTY_HISTORY);
  const available = TOOLS.filter((t) => t.available);
  const results = (query.trim() ? searchTools(query).filter((t) => t.available) : available).filter(
    (t) => filter === "all" || favorites.includes(t.id),
  );
  const recent = history
    .filter(
      (entry, index, list) =>
        available.some((t) => t.id === entry.toolId) &&
        list.findIndex((other) => other.toolId === entry.toolId) === index,
    )
    .slice(0, 4);
  function favorite(id: string) {
    try {
      toggleFavorite(id);
    } catch {
      toast.error(language === "ru" ? "Не удалось сохранить избранное" : "Could not save favorite");
    }
  }
  return (
    <div className="hp-page">
      <section className="hp-hero">
        <div className="hp-hero-copy">
          <p className="hp-kicker">
            <Zap />
            {c.kicker}
          </p>
          <h1>
            {c.title}
            <br />
            <span>{c.accent}</span>
          </h1>
          <p className="hp-lead">{c.lead}</p>
          <div className="hp-stats">
            <div>
              <b>{available.length}</b>
              <span>{c.ready}</span>
            </div>
            <div>
              <b>{CATEGORIES.length}</b>
              <span>{c.categories}</span>
            </div>
            <div>
              <b>100%</b>
              <span>{c.free}</span>
            </div>
          </div>
        </div>
        <div className="hp-hero-work">
          <form
            className="hp-search"
            onSubmit={(e) => {
              e.preventDefault();
              if (results.length === 1 && query.trim())
                void navigate({ to: "/tools/$slug", params: { slug: results[0].slug } });
              else document.getElementById("ready-tools")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <label htmlFor="home-tool-search">
              <Search />
              <input
                id="home-tool-search"
                aria-label={c.search}
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setFilter("all");
                }}
                placeholder={c.search}
                autoComplete="off"
              />
            </label>
            <button aria-label={c.find} type="submit">
              <ArrowRight />
            </button>
            <p>{c.example}</p>
            <div className="hp-search-chips">
              {[
                "QR",
                language === "ru" ? "крыша" : "roof",
                language === "ru" ? "фото" : "photo",
                "UUID",
              ].map((q) => (
                <button
                  type="button"
                  key={q}
                  onClick={() => {
                    setQuery(q);
                    setFilter("all");
                    document.getElementById("ready-tools")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </form>
          <div className="hp-action-cards">
            <Link
              to="/tools/$slug"
              params={{ slug: "qr-generator" }}
              className="hp-action hp-action-qr"
            >
              <span className="hp-large-icon">
                {(() => {
                  const Icon = iconByName("QrCode");
                  return <Icon />;
                })()}
              </span>
              <b>{c.qr}</b>
              <ArrowUpRight />
            </Link>
            <Link
              to="/tools/$slug"
              params={{ slug: "roof-calculator" }}
              className="hp-action hp-action-roof"
            >
              <img src="/visuals/home-roof.webp" width="180" height="130" alt="" />
              <b>{c.roof}</b>
              <ArrowUpRight />
            </Link>
            <Link
              to="/tools/$slug"
              params={{ slug: "image-resize" }}
              className="hp-action hp-action-image"
            >
              <span className="hp-large-icon">
                <Image />
              </span>
              <b>{c.photo}</b>
              <ArrowUpRight />
            </Link>
          </div>
        </div>
      </section>
      <section className="hp-section" id="categories">
        <div className="hp-section-heading">
          <div>
            <span className="hp-overline">TOOLBOXI</span>
            <h2>{c.browse}</h2>
          </div>
          <Link to="/tools">
            {c.all}
            <ArrowRight />
          </Link>
        </div>
        <div className="hp-category-grid">
          {CATEGORIES.map((cat) => {
            const Icon = iconByName(cat.id === "design-print" ? "Palette" : cat.icon),
              count = available.filter((t) => t.category === cat.id).length;
            return (
              <Link
                to="/categories/$id"
                params={{ id: cat.slug }}
                key={cat.id}
                className={`hp-category ${count ? "" : "hp-category-soon"}`}
                style={{ "--tile-color": cat.tint } as CSSProperties}
              >
                <span className="hp-category-icon">
                  <Icon />
                </span>
                <b>{shortNames[cat.id][language === "ru" ? 0 : 1]}</b>
                <small>
                  {count ? `${count} ${language === "ru" ? "доступно" : "available"}` : c.soon}
                </small>
              </Link>
            );
          })}
        </div>
      </section>
      <section className="hp-section" id="ready-tools">
        <div className="hp-section-heading">
          <h2>{query ? c.found : c.quick}</h2>
          <div
            className="hp-filter"
            aria-label={language === "ru" ? "Выбор инструментов" : "Filter tools"}
          >
            <button
              aria-pressed={filter === "all"}
              className={filter === "all" ? "active" : ""}
              onClick={() => setFilter("all")}
            >
              {c.recommended}
            </button>
            <button
              aria-pressed={filter === "favorites"}
              className={filter === "favorites" ? "active" : ""}
              onClick={() => setFilter("favorites")}
            >
              <Heart />
              {c.favorites}
            </button>
          </div>
        </div>
        {query && (
          <div className="hp-query">
            <span>{query}</span>
            <button onClick={() => setQuery("")} aria-label={c.clear}>
              <X />
            </button>
          </div>
        )}
        <div className="hp-tool-grid" aria-live="polite">
          {results.length ? (
            results.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                language={language}
                favorite={favorites.includes(tool.id)}
                onFavorite={() => favorite(tool.id)}
              />
            ))
          ) : (
            <div className="hp-empty">
              <Search />
              <p>{filter === "favorites" ? c.nofav : c.empty}</p>
            </div>
          )}
        </div>
      </section>
      <div data-ad-placement="home-after-tools" hidden />
      <div className="hp-bottom">
        <section className="hp-recent">
          <div className="hp-section-heading">
            <h2>{c.recent}</h2>
            <Link to="/history" aria-label={c.history}>
              <ArrowUpRight />
            </Link>
          </div>
          {recent.length ? (
            <div className="hp-recent-list">
              {recent.map((entry) => {
                const tool = available.find((t) => t.id === entry.toolId)!;
                const Icon = iconByName(tool.icon);
                return (
                  <a
                    key={entry.id}
                    href={`/tools/${tool.slug}?${new URLSearchParams(entry.params)}`}
                  >
                    <span>
                      <Icon />
                    </span>
                    <div>
                      <b>{tool.name[language]}</b>
                      <small>
                        {new Date(entry.at).toLocaleDateString(
                          language === "ru" ? "ru-RU" : "en-US",
                        )}
                      </small>
                    </div>
                    <ArrowRight />
                  </a>
                );
              })}
            </div>
          ) : (
            <div className="hp-recent-empty">
              <Clock3 />
              <h3>{c.norecent}</h3>
              <p>{c.recentHint}</p>
            </div>
          )}
          <p className="hp-device">
            <LockKeyhole />
            {c.save}
          </p>
        </section>
        <section className="hp-privacy">
          <div>
            <span className="hp-privacy-badge">
              <ShieldCheck />
              {language === "ru" ? "Под вашим контролем" : "You’re in control"}
            </span>
            <h2>{c.privacy}</h2>
            <p>{c.privacyBody}</p>
            <ul>
              <li>
                <Check />
                {c.local}
              </li>
              <li>
                <Check />
                {c.account}
              </li>
            </ul>
            <Link to="/privacy">
              {c.privacyLink}
              <ArrowUpRight />
            </Link>
          </div>
          <img src="/visuals/home-privacy.webp" width="180" height="270" loading="lazy" alt="" />
        </section>
      </div>
    </div>
  );
}
function ToolCard({
  tool,
  language,
  favorite,
  onFavorite,
}: {
  tool: ToolDef;
  language: Locale;
  favorite: boolean;
  onFavorite: () => void;
}) {
  const Icon = iconByName(tool.icon),
    c = copy[language === "uz" ? "en" : language];
  const accents: Record<string, string> = {
    "qr-generator": "blue",
    "image-resize": "green",
    "uuid-generator": "violet",
    "roof-calculator": "orange",
  };
  const tags: Record<string, string[]> = {
    "qr-generator": ["PNG", "SVG", "Wi-Fi"],
    "image-resize": ["JPG", "PNG", "WebP"],
    "uuid-generator": ["UUID v4", "TXT", "CSV"],
    "roof-calculator": [language === "ru" ? "м²" : "m²", "2D / 3D", "CSV"],
  };
  return (
    <article className={`hp-tool hp-${accents[tool.id]}`}>
      <div className="hp-tool-top">
        <span className="hp-tool-icon">
          <Icon />
        </span>
        <button
          onClick={onFavorite}
          aria-label={`${favorite ? c.unfavorite : c.favorite}: ${tool.name[language]}`}
          aria-pressed={favorite}
        >
          <Heart fill={favorite ? "currentColor" : "none"} />
        </button>
      </div>
      <Link to="/tools/$slug" params={{ slug: tool.slug }} className="hp-tool-main">
        <h3>{tool.name[language]}</h3>
        <p>{tool.description[language]}</p>
      </Link>
      <div className="hp-tags">
        {tags[tool.id]?.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
      {language === "en" &&
        ["roof-calculator", "image-resize", "uuid-generator"].includes(tool.id) && (
          <small className="hp-locale-note">{c.ruOnly}</small>
        )}
      <Link to="/tools/$slug" params={{ slug: tool.slug }} className="hp-tool-open">
        {c.open}
        <ArrowRight />
      </Link>
    </article>
  );
}
export function homeHead(language: Locale) {
  const metadata: Record<Locale, { title: string; description: string; path: string }> = {
    ru: {
      title: "Toolboxi.uz — бесплатные инструменты для работы и жизни",
      description:
        "Создавайте QR-коды, меняйте размер изображений, генерируйте UUID и рассчитывайте кровлю. Бесплатно, прямо в браузере.",
      path: "/",
    },
    en: {
      title: "Toolboxi.uz — free tools for work and everyday life",
      description:
        "Create QR codes, resize images, generate UUIDs and calculate roof materials. Free browser-based tools, no account required.",
      path: "/en",
    },
    uz: {
      title: "Toolboxi.uz — ish va kundalik hayot uchun bepul vositalar",
      description:
        "QR-kodlar yarating, rasmlar o‘lchamini o‘zgartiring, UUID hosil qiling va tom materiallarini hisoblang. Bepul va bevosita brauzerda.",
      path: "/uz",
    },
  };
  const head = seoHead(metadata[language]);
  return {
    ...head,
    links: [
      ...head.links,
      { rel: "alternate", hrefLang: "ru", href: "https://toolboxi.uz/" },
      { rel: "alternate", hrefLang: "en", href: "https://toolboxi.uz/en/" },
      { rel: "alternate", hrefLang: "uz", href: "https://toolboxi.uz/uz/" },
      { rel: "alternate", hrefLang: "x-default", href: "https://toolboxi.uz/" },
    ],
  };
}
