import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ToolCard } from "@/components/tool-card";
import { useI18n } from "@/lib/i18n";
import { CATEGORIES, toolsByCategory } from "@/lib/tools/catalog";
import { seoHead } from "@/lib/seo";

export const Route = createFileRoute("/tools/")({
  component: ToolsIndex,
  head: () =>
    seoHead({
      title: "Все онлайн-инструменты — Toolboxi.uz",
      description:
        "Бесплатные калькуляторы, генераторы и конвертеры для работы, дизайна, финансов и повседневных задач.",
      path: "/tools",
    }),
});

function ToolsIndex() {
  const { t, locale } = useI18n();
  return (
    <div className="mx-auto max-w-6xl pb-10">
      <h1 className="font-display text-2xl font-semibold tracking-tight">{t("tools.title")}</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t("tools.subtitle")}</p>
      <div className="mt-8 grid gap-10">
        {CATEGORIES.map((cat) => (
          <section key={cat.id}>
            <h2 className="mb-3">
              <Link
                to="/categories/$id"
                params={{ id: cat.slug }}
                className="group inline-flex items-center gap-2 rounded-lg text-lg font-semibold transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
                aria-label={`${cat.name[locale]} — ${t("tools.openCategory")}`}
              >
                {cat.name[locale]}
                <span className="grid size-7 place-items-center rounded-full bg-primary/8 text-primary transition-transform group-hover:translate-x-0.5">
                  <ArrowRight className="size-4" />
                </span>
              </Link>
            </h2>
            <div className="grid items-start gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {toolsByCategory(cat.id).map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
