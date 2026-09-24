import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { currencyRatesHead } from "@/features/currency-rates/seo";

const CurrencyRatesPage = lazy(() =>
  import("@/features/currency-rates").then((module) => ({ default: module.CurrencyRatesPage })),
);

export const Route = createFileRoute("/uz_/tools/currency-rates")({
  component: CurrencyRatesRoute,
  head: () => currencyRatesHead("uz"),
});

function CurrencyRatesRoute() {
  return (
    <Suspense fallback={<Skeleton className="h-[40rem] w-full" />}>
      <CurrencyRatesPage />
    </Suspense>
  );
}
