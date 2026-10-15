import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { truckFuelCalculatorHead } from "@/features/truck-fuel-calculator/seo";

const TruckFuelCalculatorPage = lazy(() =>
  import("@/features/truck-fuel-calculator").then((module) => ({
    default: module.TruckFuelCalculatorPage,
  }))
);

export const Route = createFileRoute("/uz_/tools/truck-fuel-calculator")({
  component: TruckFuelCalculatorRoute,
  head: () => truckFuelCalculatorHead("uz"),
});

function TruckFuelCalculatorRoute() {
  return (
    <Suspense fallback={<Skeleton className="h-[40rem] w-full" />}>
      <TruckFuelCalculatorPage />
    </Suspense>
  );
}
