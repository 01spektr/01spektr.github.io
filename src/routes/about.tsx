import { createFileRoute, Link } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  component: About,
  head: () =>
    seoHead({
      title: "О проекте — Toolboxi.uz",
      description: "Как устроен и развивается сервис бесплатных онлайн-инструментов Toolboxi.uz.",
      path: "/about",
    }),
});

function About() {
  return (
    <article className="legal-page">
      <p className="legal-kicker">О проекте</p>
      <h1>Toolboxi.uz — полезные инструменты в одном месте</h1>
      <p>
        Мы создаём понятные онлайн-инструменты для работы, учёбы, творчества и ежедневных задач.
        Главный принцип — быстрый результат без лишних шагов.
      </p>
      <h2>Как развивается сервис</h2>
      <p>
        Сайт строится модульно: новые калькуляторы, генераторы и конвертеры будут добавляться
        постепенно. Сейчас можно начать с{" "}
        <Link to="/tools/$slug" params={{ slug: "qr-generator" }}>
          генератора QR-кодов
        </Link>{" "}
        и каталога инструментов.
      </p>
    </article>
  );
}
