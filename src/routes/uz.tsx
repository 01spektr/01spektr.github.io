import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "./index";
import { homeHead } from "@/features/home/home";

export const Route = createFileRoute("/uz")({
  component: () => <HomePage language="uz" />,
  head: () => homeHead("uz"),
});
