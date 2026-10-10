import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { loanCalculatorHead } from "@/features/loan-calculator/seo";

const LoanCalculatorPage = lazy(() =>
  import("@/features/loan-calculator").then((module) => ({ default: module.LoanCalculatorPage })),
);

export const Route = createFileRoute("/ru_/tools/loan-calculator")({
  component: LoanCalculatorRoute,
  head: () => loanCalculatorHead("ru"),
});

function LoanCalculatorRoute() {
  return (
    <Suspense fallback={<Skeleton className="h-[40rem] w-full" />}>
      <LoanCalculatorPage />
    </Suspense>
  );
}
