import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { customsCalculatorHead } from "@/features/customs-calculator/seo";

const CustomsCalculatorPage = lazy(() =>
  import("@/features/customs-calculator").then((module) => ({ default: module.CustomsCalculatorPage })),
);

export const Route = createFileRoute("/ru_/tools/customs-calculator")({
  component: CustomsCalculatorRoute,
  head: () => customsCalculatorHead("ru"),
});

function CustomsCalculatorRoute() {
  return (
    <Suspense fallback={<Skeleton className="h-[40rem] w-full" />}>
      <CustomsCalculatorPage />
    </Suspense>
  );
}
