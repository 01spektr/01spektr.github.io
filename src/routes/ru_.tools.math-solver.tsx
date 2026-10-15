import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { mathSolverHead } from "@/features/math-solver/seo";

const MathSolverPage = lazy(() =>
  import("@/features/math-solver").then((module) => ({
    default: module.MathSolverPage,
  }))
);

export const Route = createFileRoute("/ru_/tools/math-solver")({
  component: MathSolverRoute,
  head: () => mathSolverHead("ru"),
});

function MathSolverRoute() {
  return (
    <Suspense fallback={<Skeleton className="h-[40rem] w-full" />}>
      <MathSolverPage />
    </Suspense>
  );
}
