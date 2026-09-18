import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "./index";
import { seoHead } from "@/lib/seo";

export const Route = createFileRoute("/uz")({
  component: () => <HomePage language="uz" />,
  head: () => {
    const head = seoHead({
      title: "Toolboxi.uz — ish va kundalik hayot uchun bepul vositalar",
      description: "QR-kodlar va shtrix-kodlar yarating, rasmlar o‘lchamini o‘zgartiring, ranglarni konvertatsiya qiling va hisob-kitoblarni bevosita brauzerda bajaring.",
      path: "/uz",
    });
    return {
      ...head,
      links: [
        ...head.links,
        { rel: "alternate", hrefLang: "ru", href: "https://toolboxi.uz/" },
        { rel: "alternate", hrefLang: "en", href: "https://toolboxi.uz/en/" },
        { rel: "alternate", hrefLang: "uz", href: "https://toolboxi.uz/uz/" },
        { rel: "alternate", hrefLang: "x-default", href: "https://toolboxi.uz/" },
      ],
    };
  },
});
