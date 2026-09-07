import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock3, Grid2X2, Lock, Search, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolCard } from "@/components/tool-card";
import { useI18n } from "@/lib/i18n";
import { iconByName } from "@/lib/icons";
import { CATEGORIES, TOOLS, toolsByCategory } from "@/lib/tools/catalog";
import { getHistory } from "@/lib/tools/history";
import { useSyncExternalStore } from "react";
import { subscribeHistory } from "@/lib/tools/history";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [{ title: "ToolBox" }],
  }),
});

function Home() {
  const { t, locale } = useI18n();
  const history = useSyncExternalStore(subscribeHistory, getHistory, getHistory);
  const featured = TOOLS.filter((tool) => tool.featured || tool.available);
  const recentIds = [...new Set(history.map((h) => h.toolId))].slice(0, 4);
  const recent = recentIds
    .map((id) => TOOLS.find((tool) => tool.id === id))
    .filter((tool): tool is NonNullable<typeof tool> => Boolean(tool));

  return (
    <div className="mx-auto max-w-6xl pb-12">
      <section className="relative mb-10 overflow-hidden rounded-3xl bg-card px-6 py-8 shadow-[var(--shadow-border)] sm:px-10 sm:py-12">
        <div className="absolute inset-y-0 right-0 hidden w-2/5 bg-primary/5 lg:block" aria-hidden="true" />
        <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
              <Zap className="size-4" />
              {t("home.kicker")}
            </p>
            <h1 className="mt-5 max-w-2xl font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              {t("home.title")}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
              {t("home.subtitle")}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/tools/$slug" params={{ slug: "qr-generator" }}>
                  {t("home.cta")}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/tools">{t("home.catalog")}</Link>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <HeroMetric icon={Grid2X2} value={`${TOOLS.length}+`} label={t("home.featured")} />
            <HeroMetric icon={Search} value={`${CATEGORIES.length}`} label={t("home.categories")} />
            <div className="col-span-2 rounded-2xl bg-primary p-5 text-primary-foreground shadow-sm">
              <ShieldCheck className="size-6" />
              <p className="mt-4 text-sm font-semibold">{t("home.privacy")}</p>
              <p className="mt-1 text-sm leading-relaxed text-primary-foreground/80">{t("home.offlineish")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-11">
        <SectionHeading title={t("home.featured")} href="/tools" action={t("home.catalog")} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {recent.length > 0 ? (
        <section className="mb-11">
          <div className="mb-4 flex items-center gap-2">
            <Clock3 className="size-5 text-primary" />
            <h2 className="text-xl font-semibold tracking-tight">{t("home.recent")}</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {recent.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      ) : null}

      <section>
        <SectionHeading title={t("home.categories")} href="/tools" action={t("home.catalog")} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((cat) => {
            const Icon = iconByName(cat.icon);
            const count = toolsByCategory(cat.id).length;
            return (
              <Link
                key={cat.id}
                to="/categories/$id"
                params={{ id: cat.slug }}
                className="surface-card surface-card-hover flex items-start gap-3 p-4"
              >
                <span
                  className="flex size-10 items-center justify-center rounded-xl"
                  style={{ background: `${cat.tint}22`, color: cat.tint }}
                >
                  <Icon className="size-5" />
                </span>
                <span>
                  <span className="block font-semibold">{cat.name[locale]}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">
                    {count} · {cat.description[locale]}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function SectionHeading({ title, href, action }: { title: string; href: string; action: string }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <Link to={href} className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80">
        {action}
        <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}

function HeroMetric({ icon: Icon, value, label }: { icon: typeof Lock; value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-muted p-4">
      <Icon className="size-5 text-primary" />
      <p className="mt-5 text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
