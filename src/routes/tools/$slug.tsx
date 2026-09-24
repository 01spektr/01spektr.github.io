import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import type { ComponentType } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/lib/i18n";
import { ToolIcon } from "@/components/tool-icon";
import { getToolBySlug } from "@/lib/tools/catalog";
import { seoHead } from "@/lib/seo";
import { currencyRatesHead } from "@/features/currency-rates/seo";

type LazyModule<T extends ComponentType> = { default: T };

function lazyWithDeployRecovery<T extends ComponentType>(load: () => Promise<LazyModule<T>>) {
  return lazy(async () => {
    const recoveryKey = "toolboxi:chunk-recovery";
    try {
      const module = await load();
      if (typeof window !== "undefined") sessionStorage.removeItem(recoveryKey);
      return module;
    } catch (error) {
      if (typeof window !== "undefined" && !sessionStorage.getItem(recoveryKey)) {
        sessionStorage.setItem(recoveryKey, "1");
        window.location.reload();
        return new Promise<LazyModule<T>>(() => undefined);
      }
      throw error;
    }
  });
}

const QrGeneratorPage = lazyWithDeployRecovery(() =>
  import("@/features/qr-generator").then((m) => ({ default: m.QrGeneratorPage })),
);
const UuidGeneratorPage = lazyWithDeployRecovery(() =>
  import("@/features/uuid-generator").then((m) => ({ default: m.UuidGeneratorPage })),
);
const ImageResizePage = lazyWithDeployRecovery(() =>
  import("@/features/image-resize").then((m) => ({ default: m.ImageResizePage })),
);
const RoofCalculatorPage = lazyWithDeployRecovery(() =>
  import("@/features/roof-calculator").then((m) => ({ default: m.RoofCalculatorPage })),
);
const LoanCalculatorPage = lazyWithDeployRecovery(() =>
  import("@/features/loan-calculator").then((m) => ({ default: m.LoanCalculatorPage })),
);
const CmykConverterPage = lazyWithDeployRecovery(() =>
  import("@/features/cmyk-converter").then((m) => ({ default: m.CmykConverterPage })),
);
const BarcodeGeneratorPage = lazyWithDeployRecovery(() =>
  import("@/features/barcode-generator").then((m) => ({ default: m.BarcodeGeneratorPage })),
);
const ColorPalettePage = lazyWithDeployRecovery(() =>
  import("@/features/color-palette").then((m) => ({ default: m.ColorPalettePage })),
);
const WorldTimezonesPage = lazyWithDeployRecovery(() =>
  import("@/features/world-timezones").then((m) => ({ default: m.WorldTimezonesPage })),
);
const CurrencyRatesPage = lazyWithDeployRecovery(() =>
  import("@/features/currency-rates").then((m) => ({ default: m.CurrencyRatesPage })),
);
const TextGeneratorPage = lazyWithDeployRecovery(() =>
  import("@/features/text-generator").then((m) => ({ default: m.TextGeneratorPage })),
);

export const Route = createFileRoute("/tools/$slug")({
  component: ToolDispatcher,
  head: ({ params }) => {
    if (params.slug === "currency-rates") return currencyRatesHead("en");
    const tool = getToolBySlug(params.slug);
    const customDescriptions: Record<string, string> = {
      "qr-generator":
        "Create QR codes for links, text, contacts, Wi-Fi, email and phone numbers. Free and entirely in your browser.",
      "uuid-generator":
        "Securely generate UUID v4 identifiers in batches directly in your browser.",
      "image-resize": "Resize and convert JPG, PNG and WebP images directly in your browser.",
      "roof-calculator":
        "Calculate roof area, roofing sheet quantities and an estimated material cost.",
      "loan-calculator":
        "Calculate monthly payments, total interest and a detailed loan repayment schedule.",
      "cmyk-convert":
        "Convert RGB and HEX to CMYK, compare screen and print colors, check ink coverage and find Pantone matches.",
      "barcode-generator":
        "Create EAN, Code 128 and other barcode formats, customize their appearance and export the result.",
      "color-palette":
        "Build harmonious color palettes, check contrast, extract colors from images and export HEX, RGB, HSL and CMYK.",
      "world-timezones":
        "Compare local times worldwide, convert dates and plan international meetings.",
      "currency-rates":
        "View official Central Bank of Uzbekistan exchange rates, convert amounts and compare rate changes.",
      "text-symbol-generator":
        "Create stylish Unicode text, usernames, symbols and emoji for Instagram, Telegram, TikTok and other services.",
    };
    if (!tool) {
      return seoHead({
        title: "Tool not found — Toolboxi.uz",
        description: "The requested tool could not be found.",
        path: `/tools/${params.slug}`,
        noIndex: true,
      });
    }
    return seoHead({
      title: `${tool.name.en} — Toolboxi.uz`,
      description: customDescriptions[tool.slug] ?? tool.description.en,
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
  if (slug === "color-palette") {
    return (
      <Suspense fallback={<QrPending />}>
        <ColorPalettePage />
      </Suspense>
    );
  }
  if (slug === "world-timezones") {
    return (
      <Suspense fallback={<QrPending />}>
        <WorldTimezonesPage />
      </Suspense>
    );
  }
  if (slug === "currency-rates") {
    return (
      <Suspense fallback={<QrPending />}>
        <CurrencyRatesPage />
      </Suspense>
    );
  }
  if (slug === "text-symbol-generator") {
    return (
      <Suspense fallback={<QrPending />}>
        <TextGeneratorPage />
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
