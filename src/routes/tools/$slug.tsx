import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/lib/i18n";
import { iconByName } from "@/lib/icons";
import { getToolBySlug } from "@/lib/tools/catalog";

const QrGeneratorPage = lazy(() =>
  import("@/features/qr-generator").then((m) => ({ default: m.QrGeneratorPage })),
);
const UuidGeneratorPage = lazy(() =>
  import("@/features/uuid-generator").then((m) => ({ default: m.UuidGeneratorPage })),
);

export const Route = createFileRoute("/tools/$slug")({
  component: ToolDispatcher,
  head: ({ params }) => {
    if (params.slug === "qr-generator") {
      return {
        meta: [
          { title: "Генератор QR-кодов — ToolBox" },
          {
            name: "description",
            content:
              "Создавайте QR-коды для ссылок, текста, контактов, Wi-Fi, email, телефона и других данных. Полностью в браузере.",
          },
        ],
      };
    }
    if (params.slug === "uuid-generator") {
      return {
        meta: [
          { title: "Генератор UUID — ToolBox" },
          {
            name: "description",
            content: "Безопасно создавайте UUID v4 пакетами прямо в браузере.",
          },
        ],
      };
    }
    return { meta: [{ title: "ToolBox" }] };
  },
});

function ToolDispatcher() {
  const { slug } = Route.useParams();
  if (slug === "qr-generator") {
    return (
      <Suspense fallback={<QrPending />}>
        <QrGeneratorPage />
      </Suspense>
    );
  }
  if (slug === "uuid-generator") {
    return (
      <Suspense fallback={<QrPending />}>
        <UuidGeneratorPage />
      </Suspense>
    );
  }
  return <ComingSoon slug={slug} />;
}

function QrPending() {
  return (
    <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
      <div className="grid gap-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-52 w-full" />
        <Skeleton className="h-72 w-full" />
      </div>
      <Skeleton className="h-[28rem] w-full" />
    </div>
  );
}

function ComingSoon({ slug }: { slug: string }) {
  const { t, locale } = useI18n();
  const tool = getToolBySlug(slug);

  if (!tool) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <h1 className="text-2xl font-semibold">{t("search.empty")}</h1>
        <Button asChild className="mt-6" variant="outline">
          <Link to="/tools">
            <ArrowLeft className="size-4" />
            {t("coming.back")}
          </Link>
        </Button>
      </div>
    );
  }

  const Icon = iconByName(tool.icon);

  return (
    <div className="mx-auto max-w-xl py-10">
      <div className="surface-card p-8 text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-muted text-primary">
          <Icon className="size-7" />
        </span>
        <h1 className="mt-4 text-2xl font-semibold">{tool.name[locale]}</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {tool.description[locale]}
        </p>
        <p className="mt-6 text-sm text-muted-foreground">{t("coming.body")}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild variant="outline">
            <Link to="/tools">{t("coming.back")}</Link>
          </Button>
          <Button asChild>
            <Link to="/tools/$slug" params={{ slug: "qr-generator" }}>
              {t("coming.qr")}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
