import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { vatCalculatorHead } from "@/features/vat-calculator/seo";

const VatCalculatorPage = lazy(() =>
  import("@/features/vat-calculator").then((module) => ({ default: module.VatCalculatorPage })),
);

export const Route = createFileRoute("/uz_/tools/vat-calculator")({
  component: VatCalculatorRoute,
  head: () => vatCalculatorHead("uz"),
});

function VatCalculatorRoute() {
  return (
    <Suspense fallback={<Skeleton className="h-[40rem] w-full" />}>
      <VatCalculatorPage />
    </Suspense>
  );
}
