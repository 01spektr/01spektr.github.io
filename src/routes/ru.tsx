import { createFileRoute } from "@tanstack/react-router";
import { homeHead } from "@/features/home/home";
import { HomePage } from "./index";

export const Route = createFileRoute("/ru")({
  component: () => <HomePage language="ru" />,
  head: () => homeHead("ru"),
});
