import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { smartCalendarHead } from "@/features/smart-calendar/seo";

const SmartCalendarPage = lazy(() =>
  import("@/features/smart-calendar").then((module) => ({ default: module.SmartCalendarPage })),
);

export const Route = createFileRoute("/uz_/tools/smart-calendar")({
  component: SmartCalendarRoute,
  head: () => smartCalendarHead("uz"),
});

function SmartCalendarRoute() {
  return (
    <Suspense fallback={<Skeleton className="h-[40rem] w-full" />}>
      <SmartCalendarPage />
    </Suspense>
  );
}
