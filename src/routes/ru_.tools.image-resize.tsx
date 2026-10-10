import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { imageResizeHead } from "@/features/image-resize/seo";

const ImageResizePage = lazy(() =>
  import("@/features/image-resize").then((module) => ({ default: module.ImageResizePage })),
);

export const Route = createFileRoute("/ru_/tools/image-resize")({
  component: ImageResizeRoute,
  head: () => imageResizeHead("ru"),
});

function ImageResizeRoute() {
  return (
    <Suspense fallback={<Skeleton className="h-[40rem] w-full" />}>
      <ImageResizePage />
    </Suspense>
  );
}
