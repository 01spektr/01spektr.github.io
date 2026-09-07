import { createFileRoute } from "@tanstack/react-router";
import { useSyncExternalStore } from "react";
import { ToolCard } from "@/components/tool-card";
import { useI18n } from "@/lib/i18n";
import { TOOLS } from "@/lib/tools/catalog";
import { getFavorites, subscribeFavorites } from "@/lib/tools/favorites";

export const Route = createFileRoute("/favorites")({
  component: FavoritesPage,
  head: () => ({ meta: [{ title: "Избранное — ToolBox" }] }),
});

function FavoritesPage() {
  const { t } = useI18n();
  const ids = useSyncExternalStore(subscribeFavorites, getFavorites, getFavorites);
  const tools = ids
    .map((id) => TOOLS.find((tool) => tool.id === id))
    .filter((tool): tool is NonNullable<typeof tool> => Boolean(tool));

  return (
    <div className="mx-auto max-w-6xl pb-10">
      <h1 className="font-display text-2xl font-semibold tracking-tight">{t("fav.title")}</h1>
      {tools.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">
          {t("fav.empty")}. {t("fav.emptyHint")}
        </p>
      ) : (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      )}
    </div>
  );
}
