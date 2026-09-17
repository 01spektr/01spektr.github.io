import { createFileRoute } from "@tanstack/react-router";
import { Home, homeHead } from "@/features/home/home";
export const Route = createFileRoute("/en")({
  component: () => <Home language="en" />,
  head: () => homeHead("en"),
});
