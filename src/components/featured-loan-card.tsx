import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Calculator,
  ChartNoAxesColumnIncreasing,
  Flame,
  Landmark,
  Percent,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { localizedToolPath } from "@/lib/i18n/config";
import { type ToolDef } from "@/lib/tools/catalog";
import "./featured-loan-card.css";

const features = [
  { key: "payment", icon: Calculator },
  { key: "schedule", icon: ChartNoAxesColumnIncreasing },
  { key: "apr", icon: Percent },
] as const;

export function FeaturedLoanCard({ tool }: { tool: ToolDef }) {
  const { locale, t } = useI18n();

  return (
    <Link
      to={localizedToolPath(tool.slug, locale)}
      className="featured-loan-card"
      aria-label={`${tool.name[locale]} — ${t("tools.openTool")}`}
    >
      <div className="featured-loan-card__visual" aria-hidden="true">
        <span className="featured-loan-card__icon"><Landmark /></span>
        <span className="featured-loan-card__badge"><Flame />{t("home.featured")}</span>
        <img src="/loan-calculator-card.webp" alt="" draggable={false} />
      </div>

      <h3>{tool.name[locale]}</h3>
      <p>{tool.description[locale]}</p>

      <ul className="featured-loan-card__features" aria-label={t("tools.loan.features")}>
        {features.map(({ key, icon: Icon }) => (
          <li key={key}>
            <Icon />
            <span>{t(`tools.loan.${key}`)}</span>
          </li>
        ))}
      </ul>

      <span className="featured-loan-card__cta">
        {t("tools.openTool")} <ArrowRight />
      </span>
    </Link>
  );
}
