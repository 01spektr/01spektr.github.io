import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { roofCalculatorHead } from "@/features/roof-calculator/seo";

const RoofCalculatorPage = lazy(() =>
  import("@/features/roof-calculator").then((module) => ({ default: module.RoofCalculatorPage })),
);

export const Route = createFileRoute("/ru_/tools/roof-calculator")({
  component: RoofCalculatorRoute,
  head: () => roofCalculatorHead("ru"),
});

function RoofCalculatorRoute() {
  return (
    <Suspense fallback={<Skeleton className="h-[40rem] w-full" />}>
      <RoofCalculatorPage />
    </Suspense>
  );
}
