import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cmykConvertHead } from "@/features/cmyk-converter/seo";

const CmykConvertPage = lazy(() =>
  import("@/features/cmyk-converter").then((module) => ({ default: module.CmykConverterPage })),
);

export const Route = createFileRoute("/ru_/tools/cmyk-convert")({
  component: CmykConvertRoute,
  head: () => cmykConvertHead("ru"),
});

function CmykConvertRoute() {
  return (
    <Suspense fallback={<Skeleton className="h-[40rem] w-full" />}>
      <CmykConvertPage />
    </Suspense>
  );
}
