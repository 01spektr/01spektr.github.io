import { iconByName } from "@/lib/icons";
import { type ToolDef } from "@/lib/tools/catalog";
import { toolAccent } from "@/lib/tools/visuals";

type ToolIconSize = "compact" | "card" | "hero";

export function ToolIcon({
  tool,
  size = "card",
  className,
}: {
  tool: Pick<ToolDef, "slug" | "icon">;
  size?: ToolIconSize;
  className?: string;
}) {
  const Icon = iconByName(tool.icon);
  const accent = toolAccent(tool.slug);
  return (
    <span
      className={`tool-icon tool-icon--${size}${className ? ` ${className}` : ""}`}
      style={{
        backgroundColor: accent,
        borderColor: accent,
        boxShadow: `0 7px 15px ${accent}42, inset 0 1px rgb(255 255 255 / 28%)`,
      }}
      aria-hidden="true"
    >
      <Icon strokeWidth={2.5} />
    </span>
  );
}
