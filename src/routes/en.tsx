import { createFileRoute } from "@tanstack/react-router";
import { homeHead } from "@/features/home/home";
import { HomePage } from "./index";
export const Route = createFileRoute("/en")({
  component: () => <HomePage language="en" />,
  head: () => {
    const head = homeHead("en");
    return {
      ...head,
      meta: [...head.meta, { name: "robots", content: "noindex, follow" }],
    };
  },
});
