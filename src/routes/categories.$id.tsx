import { createFileRoute, Link } from "@tanstack/react-router";
import { ToolCard } from "@/components/tool-card";
import { useI18n } from "@/lib/i18n";
import { getCategoryBySlug, toolsByCategory } from "@/lib/tools/catalog";
import { iconByName } from "@/lib/icons";

export const Route = createFileRoute("/categories/$id")({
  component: CategoryPage,
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
