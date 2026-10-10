import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { colorPaletteHead } from "@/features/color-palette/seo";

const ColorPalettePage = lazy(() =>
  import("@/features/color-palette").then((module) => ({ default: module.ColorPalettePage })),
);

export const Route = createFileRoute("/uz_/tools/color-palette")({
  component: ColorPaletteRoute,
  head: () => colorPaletteHead("uz"),
});

function ColorPaletteRoute() {
  return (
    <Suspense fallback={<Skeleton className="h-[40rem] w-full" />}>
      <ColorPalettePage />
    </Suspense>
  );
}
