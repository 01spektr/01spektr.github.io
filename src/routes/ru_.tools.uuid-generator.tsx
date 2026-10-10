import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { uuidGeneratorHead } from "@/features/uuid-generator/seo";

const UuidGeneratorPage = lazy(() =>
  import("@/features/uuid-generator").then((module) => ({ default: module.UuidGeneratorPage })),
);

export const Route = createFileRoute("/ru_/tools/uuid-generator")({
  component: UuidGeneratorRoute,
  head: () => uuidGeneratorHead("ru"),
});

function UuidGeneratorRoute() {
  return (
    <Suspense fallback={<Skeleton className="h-[40rem] w-full" />}>
      <UuidGeneratorPage />
    </Suspense>
  );
}
