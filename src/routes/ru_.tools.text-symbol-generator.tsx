import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { textSymbolGeneratorHead } from "@/features/text-generator/seo";

const TextSymbolGeneratorPage = lazy(() =>
  import("@/features/text-generator").then((module) => ({ default: module.TextGeneratorPage })),
);

export const Route = createFileRoute("/ru_/tools/text-symbol-generator")({
  component: TextSymbolGeneratorRoute,
  head: () => textSymbolGeneratorHead("ru"),
});

function TextSymbolGeneratorRoute() {
  return (
    <Suspense fallback={<Skeleton className="h-[40rem] w-full" />}>
      <TextSymbolGeneratorPage />
    </Suspense>
  );
}
