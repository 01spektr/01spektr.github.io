import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Calculator, Check, Clock3, FileText, Image, QrCode, Search, ShieldCheck, Sparkles } from "lucide-react";
import { useSyncExternalStore } from "react";
import { ToolCard } from "@/components/tool-card";
import { iconByName } from "@/lib/icons";
import { useI18n } from "@/lib/i18n";
import { CATEGORIES, TOOLS, toolsByCategory } from "@/lib/tools/catalog";
import { getHistory, subscribeHistory } from "@/lib/tools/history";

export const Route = createFileRoute("/")({ component: Home, head: () => ({ meta: [{ title: "ToolBox" }] }) });

function Home() {
  const { locale } = useI18n();
  const history = useSyncExternalStore(subscribeHistory, getHistory, getHistory);
  const featured = TOOLS.filter((tool) => tool.featured || tool.available).slice(0, 5);
  const recent = [...new Set(history.map((entry) => entry.toolId))].slice(0, 5).map((id) => TOOLS.find((tool) => tool.id === id)).filter((tool): tool is (typeof TOOLS)[number] => Boolean(tool));
  return <div className="home-page -mx-4 -mt-5 pb-12 lg:-mx-8 lg:-mt-6">
    <section className="home-hero">
      <div className="home-hero-inner"><div className="home-hero-copy">
        <p className="home-kicker"><Sparkles className="size-4" /> {TOOLS.length}+ инструментов · бесплатно</p>
        <h1>Один сервис.<br /><span>Много инструментов.</span></h1>
        <p className="home-lead">Рассчитывайте, конвертируйте, создавайте и анализируйте. Быстро, удобно и без регистрации.</p>
        <Link to="/tools" className="home-search-link"><Search className="size-5" /><span>Например: QR-код, кредит, контейнер, dpi…</span><b><ArrowRight className="size-4" /></b></Link>
        <div className="home-query-list"><span>Популярные запросы:</span>{["qr", "контейнер", "кредит", "конвертер", "json"].map((query) => <span key={query}>{query}</span>)}</div>
      </div><HeroArt /></div>
      <div className="home-trust-row"><Trust title="100% автономность" text="Данные остаются в браузере" /><Trust title="Быстрая работа" text="Результат за несколько секунд" /><Trust title="Полностью бесплатно" text="Без регистрации и платежей" /></div>
    </section>
    <div className="home-content">
      <div className="home-stats"><Stat value={`${TOOLS.length}+`} label="инструментов" /><Stat value={`${CATEGORIES.length}`} label="категорий" /><Stat value="100%" label="в браузере" /><Stat value="∞" label="бесплатно" /></div>
      <section className="home-section"><SectionTitle title="Категории" action="Смотреть все категории" />
        <div className="home-category-grid">{CATEGORIES.map((category) => { const Icon = iconByName(category.icon); return <Link key={category.id} to="/categories/$id" params={{ id: category.slug }} className="home-category-card"><span className="home-category-icon" style={{ color: category.tint }}><Icon className="size-6" /></span><span className="min-w-0 flex-1"><b>{category.name[locale]}</b><small>{toolsByCategory(category.id).length} инструмента</small></span><ArrowRight className="size-4 text-muted-foreground" /></Link>; })}</div>
      </section>
      <section className="home-section"><SectionTitle title="Популярные инструменты" action="Смотреть все" /><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">{featured.map((tool) => <ToolCard key={tool.id} tool={tool} />)}</div></section>
      <div className="home-lower-grid"><section className="home-section home-recent-section"><div className="mb-4 flex items-center justify-between"><h2>Недавно использовали</h2><Clock3 className="size-4 text-muted-foreground" /></div>{recent.length ? <div className="home-recent-list">{recent.map((tool) => <RecentItem key={tool.id} tool={tool} />)}</div> : <p className="home-empty">Здесь появятся инструменты, которыми вы воспользуетесь.</p>}</section><section className="home-privacy-card"><ShieldCheck className="size-8" /><h2>Ваши данные<br />остаются с вами</h2><p>Инструменты работают прямо в браузере. Мы не отправляем ваши данные на сервер.</p><ul>{["100% конфиденциальность", "Автономная работа", "Без регистрации"].map((item) => <li key={item}><Check className="size-4" />{item}</li>)}</ul></section></div>
    </div>
  </div>;
}

function HeroArt() { return <div className="home-hero-art" aria-hidden="true"><i className="orbit one"><Image /></i><i className="orbit two"><Calculator /></i><i className="orbit three"><QrCode /></i><i className="orbit four"><FileText /></i></div>; }
function Trust({ title, text }: { title: string; text: string }) { return <div><ShieldCheck className="size-5" /><span><b>{title}</b><small>{text}</small></span></div>; }
function Stat({ value, label }: { value: string; label: string }) { return <div><strong>{value}</strong><span>{label}</span></div>; }
function SectionTitle({ title, action }: { title: string; action: string }) { return <div className="home-section-title"><h2>{title}</h2><Link to="/tools">{action}<ArrowRight className="size-4" /></Link></div>; }
function RecentItem({ tool }: { tool: (typeof TOOLS)[number] }) { const { locale } = useI18n(); const Icon = iconByName(tool.icon); return <Link to="/tools/$slug" params={{ slug: tool.slug }}><span className="home-recent-icon"><Icon className="size-4" /></span><b>{tool.name[locale]}</b><ArrowRight className="size-4 text-muted-foreground" /></Link>; }
