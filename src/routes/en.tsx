import { createFileRoute } from "@tanstack/react-router";
import { homeHead } from "@/features/home/home";
import { HomePage } from "./index";
export const Route = createFileRoute("/en")({
  component: () => <HomePage language="en" />,
  head: () => homeHead("en"),
});
