import { createFileRoute } from "@tanstack/react-router";
import { ContactPage, contactHead } from "@/features/site-info/site-info";

export const Route = createFileRoute("/ru_/contact")({
  component: ContactPage,
  head: () => contactHead("ru"),
});
