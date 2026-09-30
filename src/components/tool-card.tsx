import { type ToolDef } from "@/lib/tools/catalog";
import { FeaturedLoanCard } from "@/components/featured-loan-card";
import { ToolPromoCard } from "@/components/tool-promo-card";

export function ToolCard({ tool }: { tool: ToolDef }) {
  if (tool.id === "loan-calculator") return <FeaturedLoanCard tool={tool} />;
  return <ToolPromoCard tool={tool} />;
}
