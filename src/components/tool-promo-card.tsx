import { Link } from "@tanstack/react-router";
import type { CSSProperties } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Download,
  Flame,
  Image as ImageIcon,
  ListChecks,
  SlidersHorizontal,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { localizedToolPath } from "@/lib/i18n/config";
import { iconByName } from "@/lib/icons";
import { type ToolDef } from "@/lib/tools/catalog";
import { TOOL_CARD_FEATURES } from "@/lib/tools/card-features";
import { toolAccent } from "@/lib/tools/visuals";
import "./tool-promo-card.css";

const featureIcons = [ListChecks, SlidersHorizontal, Download] as const;

function ArtworkPlaceholder() {
  return (
    <span className="tool-promo-card__placeholder">
      <span className="tool-promo-card__placeholder-icon"><ImageIcon /></span>
      <span className="tool-promo-card__placeholder-line" />
      <span className="tool-promo-card__placeholder-line is-short" />
    </span>
  );
}

export function ToolPromoCard({ tool }: { tool: ToolDef }) {
  const { locale, t } = useI18n();
  const isPopular = tool.featured;
  const Icon = iconByName(tool.icon);
  const accent = toolAccent(tool.slug);
  const StatusIcon = isPopular ? Flame : tool.available ? CheckCircle2 : Clock3;
  const statusLabel = isPopular ? t("home.featured") : tool.available ? t("tools.available") : t("tools.soon");
  const featureLabels = TOOL_CARD_FEATURES[tool.id]?.map((item) => item[locale]) ?? [
    t("tools.card.browser"),
    t("tools.card.fast"),
    t("tools.card.free"),
  ];

  return (
    <Link
      to={localizedToolPath(tool.slug, locale)}
      className="tool-promo-card"
      aria-label={`${tool.name[locale]} — ${tool.available ? t("tools.openTool") : t("tools.soon")}`}
    >
      <div className="tool-promo-card__visual" aria-hidden="true">
        <span className="tool-promo-card__icon" style={{ "--tool-card-accent": accent } as CSSProperties}>
          <Icon />
        </span>
        <span className={`tool-promo-card__badge${tool.available ? "" : " is-soon"}`}>
          <StatusIcon />
          {statusLabel}
        </span>
        <ArtworkPlaceholder />
      </div>

      <h3>{tool.name[locale]}</h3>
      <p>
        {tool.description[locale]}{" "}
        {tool.available ? t("tools.card.availableDetail") : t("tools.card.soonDetail")}
      </p>

      <ul className="tool-promo-card__features" aria-label={t("tools.card.features")}>
        {featureLabels.map((label, index) => {
          const FeatureIcon = featureIcons[index] ?? ListChecks;
          return (
          <li key={label}>
            <FeatureIcon />
            <span>{label}</span>
          </li>
          );
        })}
      </ul>

      <span className={`tool-promo-card__cta${tool.available ? "" : " is-disabled"}`}>
        {tool.available ? t("tools.openTool") : t("tools.soon")}
        {tool.available ? <ArrowRight /> : <Clock3 />}
      </span>
    </Link>
  );
}
