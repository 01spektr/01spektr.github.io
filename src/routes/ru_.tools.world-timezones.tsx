import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { worldTimezonesHead } from "@/features/world-timezones/seo";

const WorldTimezonesPage = lazy(() =>
  import("@/features/world-timezones").then((module) => ({ default: module.WorldTimezonesPage })),
);

export const Route = createFileRoute("/ru_/tools/world-timezones")({
  component: WorldTimezonesRoute,
  head: () => worldTimezonesHead("ru"),
});

function WorldTimezonesRoute() {
  return (
    <Suspense fallback={<Skeleton className="h-[40rem] w-full" />}>
      <WorldTimezonesPage />
    </Suspense>
  );
}
