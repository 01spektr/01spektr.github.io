import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ChevronRight,
  Barcode,
  Star,
  Share2,
  Check,
  Zap,
  ShieldCheck,
  Download,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { localeHomePath, localizedCategoryPath } from "@/lib/i18n/config";

interface BarcodeHeroBannerProps {
  favorite: boolean;
  onToggleFavorite: () => void;
  onShare: () => Promise<void>;
}

export const BarcodeHeroBanner: React.FC<BarcodeHeroBannerProps> = ({
  favorite,
  onToggleFavorite,
  onShare,
}) => {
  const { locale } = useI18n();
  const [copied, setCopied] = useState(false);

  const labels = {
    ru: {
      home: "Главная",
      category: "Дизайн и полиграфия",
      title: "Генератор штрихкодов онлайн",
      subtitle:
        "Создавайте штрихкоды EAN-13, EAN-8, Code 128, Code 39, ITF-14, UPC-A и Codabar с автопроверкой контрольной суммы и экспортом в векторный SVG, PDF и PNG высокого разрешения.",
      favAdd: "В избранное",
      favRemove: "В избранном",
      share: "Поделиться",
      copied: "Скопировано!",
      b1Title: "GS1 стандарты",
      b1Desc: "EAN-13, EAN-8, ITF-14",
      b2Title: "Векторный экспорт",
      b2Desc: "SVG, PDF и PNG до 1200 DPI",
      b3Title: "100% локально",
      b3Desc: "Безопасно без отправки на сервер",
    },
    uz: {
      home: "Bosh sahifa",
      category: "Dizayn va poligrafiya",
      title: "Onlayn shtrix-kod generatori",
      subtitle:
        "EAN-13, EAN-8, Code 128, Code 39, ITF-14, UPC-A va Codabar shtrix-kodlarini nazorat sonini tekshirish hamda yuqori sifatli SVG, PDF va PNG formatlarida yuklab olish bilan yarating.",
      favAdd: "Saralangan",
      favRemove: "Saralangan",
      share: "Ulashish",
      copied: "Nusxalandi!",
      b1Title: "GS1 standartlari",
      b1Desc: "EAN-13, EAN-8, ITF-14",
      b2Title: "Vektor eksport",
      b2Desc: "SVG, PDF va 1200 DPI PNG",
      b3Title: "100% lokal",
      b3Desc: "Serverga yuborilmasdan ishlaydi",
    },
    en: {
      home: "Home",
      category: "Design & Print",
      title: "Online Barcode Generator",
      subtitle:
        "Create EAN-13, EAN-8, Code 128, Code 39, ITF-14, UPC-A, and Codabar barcodes with auto-checksum calculation and high-resolution SVG, PDF, and PNG vector export.",
      favAdd: "Bookmark",
      favRemove: "Saved",
      share: "Share",
      copied: "Copied!",
      b1Title: "GS1 Standards",
      b1Desc: "EAN-13, EAN-8, ITF-14",
      b2Title: "Vector Export",
      b2Desc: "SVG, PDF & up to 1200 DPI PNG",
      b3Title: "100% Private",
      b3Desc: "Runs locally in browser",
    },
  }[locale] || {
    home: "Home",
    category: "Design & Print",
    title: "Online Barcode Generator",
    subtitle:
      "Create professional barcodes with auto-checksum calculation and high-resolution export.",
    favAdd: "Bookmark",
    favRemove: "Saved",
    share: "Share",
    copied: "Copied!",
    b1Title: "GS1 Standards",
    b1Desc: "EAN-13, EAN-8, ITF-14",
    b2Title: "Vector Export",
    b2Desc: "SVG, PDF & PNG",
    b3Title: "100% Private",
    b3Desc: "Runs locally in browser",
  };

  return (
    <div className="w-full mb-5">
      {/* Top Breadcrumb Trail & Action Buttons */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <nav
          aria-label="Breadcrumb"
          className="flex min-w-0 items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 overflow-x-auto whitespace-nowrap scrollbar-none"
        >
          <Link
            to={localeHomePath(locale)}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {labels.home}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-slate-600" />
          <Link
            to={localizedCategoryPath("design-print", locale)}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {labels.category}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-slate-600" />
          <span className="truncate text-slate-700 dark:text-slate-200 font-medium">
            {labels.title}
          </span>
        </nav>

        <div className="flex flex-wrap items-center gap-2">
          {/* Bookmark Button */}
          <button
            type="button"
            onClick={onToggleFavorite}
            className={`inline-flex h-9 items-center gap-1.5 rounded-xl border px-3 text-xs font-semibold shadow-2xs transition-colors cursor-pointer ${
              favorite
                ? "border-amber-200/90 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400"
                : "border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400"
            }`}
          >
            <Star
              className="h-3.5 w-3.5"
              fill={favorite ? "currentColor" : "none"}
            />
            <span>{favorite ? labels.favRemove : labels.favAdd}</span>
          </button>

          {/* Share Button */}
          <button
            type="button"
            onClick={async () => {
              await onShare();
              setCopied(true);
              window.setTimeout(() => setCopied(false), 2000);
            }}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-600" />
            ) : (
              <Share2 className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
            )}
            <span className={copied ? "text-emerald-600" : undefined}>
              {copied ? labels.copied : labels.share}
            </span>
          </button>
        </div>
      </div>

      {/* Hero Banner Card Matching loan-calculator */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left: Icon & Title */}
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-2xs shrink-0">
              <Barcode className="w-6 h-6 stroke-[2.2]" />
            </div>

            <div>
              <h1 className="font-heading text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                {labels.title}
              </h1>
              <p className="font-body text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 mt-0.5 max-w-xl leading-relaxed">
                {labels.subtitle}
              </p>
            </div>
          </div>

          {/* Right: 3 Feature Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full lg:w-auto shrink-0">
            {/* Badge 1 */}
            <div className="min-w-0 bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/80 rounded-xl px-2.5 sm:px-3 py-2 flex items-center gap-2 sm:gap-2.5 transition-colors">
              <div className="w-7 h-7 rounded-lg bg-blue-100/70 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Zap className="w-3.5 h-3.5 fill-blue-600 dark:fill-blue-400" />
              </div>
              <div className="min-w-0">
                <p className="font-heading text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight truncate">
                  {labels.b1Title}
                </p>
                <p className="font-body text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight truncate">
                  {labels.b1Desc}
                </p>
              </div>
            </div>

            {/* Badge 2 */}
            <div className="min-w-0 bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/80 rounded-xl px-2.5 sm:px-3 py-2 flex items-center gap-2 sm:gap-2.5 transition-colors">
              <div className="w-7 h-7 rounded-lg bg-blue-100/70 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Download className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <p className="font-heading text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight truncate">
                  {labels.b2Title}
                </p>
                <p className="font-body text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight truncate">
                  {labels.b2Desc}
                </p>
              </div>
            </div>

            {/* Badge 3 */}
            <div className="hidden sm:flex min-w-0 bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/80 rounded-xl px-3 py-2 items-center gap-2.5 transition-colors">
              <div className="w-7 h-7 rounded-lg bg-emerald-100/70 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <p className="font-heading text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight truncate">
                  {labels.b3Title}
                </p>
                <p className="font-body text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight truncate">
                  {labels.b3Desc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
