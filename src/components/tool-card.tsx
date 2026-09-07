import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { iconByName } from "@/lib/icons";
import { useI18n } from "@/lib/i18n";
import { type ToolDef } from "@/lib/tools/catalog";

export function ToolCard({ tool }: { tool: ToolDef }) {
  const { locale, t } = useI18n();
  const Icon = iconByName(tool.icon);
  return (
    <Link
      to="/tools/$slug"
      params={{ slug: tool.slug }}
      className="surface-card surface-card-hover flex min-h-36 flex-col gap-3 p-4"
    >
      <span className="flex size-10 items-center justify-center rounded-xl bg-muted text-primary">
        <Icon className="size-4" />
      </span>
      <span className="flex items-start justify-between gap-2">
        <span className="font-semibold leading-snug">{tool.name[locale]}</span>
        {tool.available ? null : (
          <Badge variant="secondary">{t("tools.soon")}</Badge>
        )}
      </span>
      <span className="text-sm text-muted-foreground">{tool.description[locale]}</span>
    </Link>
  );
}
