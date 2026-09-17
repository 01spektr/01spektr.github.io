import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/lib/i18n";
import { ToolIcon } from "@/components/tool-icon";
import { getToolBySlug } from "@/lib/tools/catalog";
import { seoHead } from "@/lib/seo";

const QrGeneratorPage = lazy(() =>
  import("@/features/qr-generator").then((m) => ({ default: m.QrGeneratorPage })),
);
const UuidGeneratorPage = lazy(() =>
  import("@/features/uuid-generator").then((m) => ({ default: m.UuidGeneratorPage })),
);
const ImageResizePage = lazy(() =>
  import("@/features/image-resize").then((m) => ({ default: m.ImageResizePage })),
);
const RoofCalculatorPage = lazy(() =>
  import("@/features/roof-calculator").then((m) => ({ default: m.RoofCalculatorPage })),
);
const LoanCalculatorPage = lazy(() =>
  import("@/features/loan-calculator").then((m) => ({ default: m.LoanCalculatorPage })),
);
const CmykConverterPage = lazy(() =>
  import("@/features/cmyk-converter").then((m) => ({ default: m.CmykConverterPage })),
);
const BarcodeGeneratorPage = lazy(() =>
  import("@/features/barcode-generator").then((m) => ({ default: m.BarcodeGeneratorPage })),
);

export const Route = createFileRoute("/tools/$slug")({
  component: ToolDispatcher,
  head: ({ params }) => {
    const tool = getToolBySlug(params.slug);
    const customDescriptions: Record<string, string> = {
      "qr-generator":
        "Создавайте QR-коды для ссылок, текста, контактов, Wi-Fi, email и телефона. Бесплатно и полностью в браузере.",
      "uuid-generator": "Безопасно создавайте UUID v4 пакетами прямо в браузере.",
      "image-resize": "Меняйте размер и формат JPG, PNG и WebP прямо в браузере.",
      "roof-calculator":
        "Рассчитайте площадь крыши, количество кровельных листов и предварительную стоимость материалов.",
      "loan-calculator":
        "Рассчитайте ежемесячный платёж, переплату и подробный график погашения кредита.",
      "cmyk-convert":
        "Переводите RGB и HEX в CMYK, сравнивайте экранный и печатный цвет, проверяйте покрытие краской и подбирайте Pantone.",
      "barcode-generator":
        "Создавайте штрихкоды EAN, Code 128 и других форматов, настраивайте оформление и экспортируйте результат.",
    };
    if (!tool) {
      return seoHead({
        title: "Инструмент не найден — Toolboxi.uz",
        description: "Запрошенный инструмент не найден.",
        path: `/tools/${params.slug}`,
        noIndex: true,
      });
    }
    return seoHead({
      title: `${tool.name.ru} — Toolboxi.uz`,
      description: customDescriptions[tool.slug] ?? tool.description.ru,
      path: `/tools/${tool.slug}`,
      noIndex: !tool.available,
    });
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
  if (slug === "image-resize") {
    return (
      <Suspense fallback={<QrPending />}>
        <ImageResizePage />
      </Suspense>
    );
  }
  if (slug === "roof-calculator") {
    return (
      <Suspense fallback={<QrPending />}>
        <RoofCalculatorPage />
      </Suspense>
    );
  }
  if (slug === "loan-calculator") {
    return (
      <Suspense fallback={<QrPending />}>
        <LoanCalculatorPage />
      </Suspense>
    );
  }
  if (slug === "cmyk-convert") {
    return (
      <Suspense fallback={<QrPending />}>
        <CmykConverterPage />
      </Suspense>
    );
  }
  if (slug === "barcode-generator") {
    return (
      <Suspense fallback={<QrPending />}>
        <BarcodeGeneratorPage />
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

  return (
    <div className="mx-auto max-w-xl py-10">
      <div className="surface-card p-8 text-center">
        <ToolIcon tool={tool} size="hero" className="mx-auto" />
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
