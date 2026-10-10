import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { qrGeneratorHead } from "@/features/qr-generator/seo";

const QrGeneratorPage = lazy(() =>
  import("@/features/qr-generator").then((module) => ({ default: module.QrGeneratorPage })),
);

export const Route = createFileRoute("/ru_/tools/qr-generator")({
  component: QrGeneratorRoute,
  head: () => qrGeneratorHead("ru"),
});

function QrGeneratorRoute() {
  return (
    <Suspense fallback={<Skeleton className="h-[40rem] w-full" />}>
      <QrGeneratorPage />
    </Suspense>
  );
}
