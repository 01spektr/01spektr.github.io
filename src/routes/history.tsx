import { createFileRoute } from "@tanstack/react-router";
import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { ToolIcon } from "@/components/tool-icon";
import { useI18n } from "@/lib/i18n";
import { TOOLS } from "@/lib/tools/catalog";
import { clearHistory, getHistory, subscribeHistory } from "@/lib/tools/history";
import { seoHead } from "@/lib/seo";
import { localizedToolPath } from "@/lib/i18n/config";

export const Route = createFileRoute("/history")({
  component: HistoryPage,
  head: () =>
    seoHead({
      title: "История — Toolboxi.uz",
      description: "Локальная история использования инструментов Toolboxi.uz.",
      path: "/history",
      noIndex: true,
    }),
});

function HistoryPage() {
  const { t, locale } = useI18n();
  const entries = useSyncExternalStore(subscribeHistory, getHistory, getHistory);

  return (
    <div className="mx-auto max-w-3xl pb-10">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold tracking-tight">{t("hist.title")}</h1>
        {entries.length > 0 ? (
          <Button variant="outline" onClick={clearHistory}>
            {t("hist.clear")}
          </Button>
        ) : null}
      </div>
      {entries.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">
          {t("hist.empty")}. {t("hist.emptyHint")}
        </p>
      ) : (
        <ul className="mt-6 grid gap-2">
          {entries.map((entry) => {
            const tool = TOOLS.find((item) => item.id === entry.toolId);
            const qs = new URLSearchParams(entry.params).toString();
            const href = tool
              ? `${localizedToolPath(tool.slug, locale)}${qs ? `?${qs}` : ""}`
              : "/tools";
            return (
              <li key={entry.id}>
                <a
                  href={href}
                  className="surface-card surface-card-hover flex items-center gap-3 p-4"
                >
                  {tool ? (
                    <ToolIcon tool={tool} />
                  ) : (
                    <span className="flex size-10 items-center justify-center rounded-xl bg-muted text-primary" />
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{entry.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {tool?.name[locale]} · {new Date(entry.at).toLocaleString(locale)}
                    </span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
