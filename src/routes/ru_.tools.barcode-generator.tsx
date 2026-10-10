import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { barcodeGeneratorHead } from "@/features/barcode-generator/seo";

const BarcodeGeneratorPage = lazy(() =>
  import("@/features/barcode-generator").then((module) => ({ default: module.BarcodeGeneratorPage })),
);

export const Route = createFileRoute("/ru_/tools/barcode-generator")({
  component: BarcodeGeneratorRoute,
  head: () => barcodeGeneratorHead("ru"),
});

function BarcodeGeneratorRoute() {
  return (
    <Suspense fallback={<Skeleton className="h-[40rem] w-full" />}>
      <BarcodeGeneratorPage />
    </Suspense>
  );
}
