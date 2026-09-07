import { createFileRoute } from "@tanstack/react-router";
import { ToolCard } from "@/components/tool-card";
import { useI18n } from "@/lib/i18n";
import { CATEGORIES, toolsByCategory } from "@/lib/tools/catalog";

export const Route = createFileRoute("/tools/")({
  component: ToolsIndex,
  head: () => ({ meta: [{ title: "ToolBox — инструменты" }] }),
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
            <h2 className="mb-3 text-lg font-semibold">{cat.name[locale]}</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
