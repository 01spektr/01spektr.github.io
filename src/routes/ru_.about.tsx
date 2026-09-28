import { createFileRoute } from "@tanstack/react-router";
import { AboutPage, aboutHead } from "@/features/site-info/site-info";

export const Route = createFileRoute("/ru_/about")({
  component: AboutPage,
  head: () => aboutHead("ru"),
});
