import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight, Droplets, Palette, Layers, Star, Share2, Check, Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { localeHomePath, localizedCategoryPath } from "@/lib/i18n/config";

interface HeroBannerProps {
  fav: boolean;
  onToggleFav: () => void;
  onShare: () => Promise<void>;
}

export const CmykHeroBanner: React.FC<HeroBannerProps> = ({
  fav,
  onToggleFav,
  onShare,
}) => {
  const { locale } = useI18n();
  const [copied, setCopied] = useState(false);

  const labels = {
    ru: {
      home: "Главная",
      category: "Дизайн и полиграфия",
      title: "Конвертер RGB → CMYK",
      subtitle: "Переводите экранные цвета в печатную модель, проверяйте общее покрытие краской (TAC) и подбирайте близкий Pantone.",
      favAdd: "В избранное",
      favRemove: "В избранном",
      share: "Поделиться",
      copied: "Скопировано!",
      b1Title: "Мелованная & офсет",
      b1Desc: "Имитация бумаги",
      b2Title: "Контроль TAC",
      b2Desc: "Безопасно для печати",
      b3Title: "Pantone Match",
      b3Desc: "Точный подбор веера",
    },
    uz: {
      home: "Bosh sahifa",
      category: "Dizayn va poligrafiya",
      title: "RGB → CMYK konverteri",
      subtitle: "Ekran ranglarini bosma modelga o‘tkazing, bo‘yoq qoplamasini tekshiring va yaqin Pantone rangini toping.",
      favAdd: "Tanlanganlarga",
      favRemove: "Tanlangan",
      share: "Ulashish",
      copied: "Nusxalandi!",
      b1Title: "Qoplangan & ofset",
      b1Desc: "Qog'oz taqlidi",
      b2Title: "TAC nazorati",
      b2Desc: "Bosmaga xavfsiz",
      b3Title: "Pantone Match",
      b3Desc: "Yaqin rang tanlash",
    },
    en: {
      home: "Home",
      category: "Design & print",
      title: "RGB → CMYK Converter",
      subtitle: "Convert screen colors to print models, check total ink coverage (TAC), and find matching Pantone swatches.",
      favAdd: "Bookmark",
      favRemove: "Saved",
      share: "Share",
      copied: "Copied!",
      b1Title: "Coated & Offset",
      b1Desc: "Paper simulation",
      b2Title: "TAC Control",
      b2Desc: "Print-safe check",
      b3Title: "Pantone Match",
      b3Desc: "Swatch matching",
    },
  }[locale as "ru" | "uz" | "en"] || {
    home: "Home",
    category: "Design & print",
    title: "RGB → CMYK Converter",
    subtitle: "Convert screen colors to print models, check ink coverage, and find matching Pantone swatches.",
    favAdd: "Bookmark",
    favRemove: "Saved",
    share: "Share",
    copied: "Copied!",
    b1Title: "Coated & Offset",
    b1Desc: "Paper simulation",
    b2Title: "TAC Control",
    b2Desc: "Print-safe check",
    b3Title: "Pantone Match",
    b3Desc: "Swatch matching",
  };

  return (
    <div className="w-full mb-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <nav
          aria-label="Breadcrumb"
          className="flex min-w-0 items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400"
        >
          <Link to={localeHomePath(locale)} className="hover:text-primary dark:hover:text-primary transition-colors">
            {labels.home}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <Link
            to={localizedCategoryPath("design-print", locale)}
            className="hover:text-primary dark:hover:text-primary transition-colors"
          >
            {labels.category}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate text-slate-700 dark:text-slate-200 font-medium">
            {labels.title}
          </span>
        </nav>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onToggleFav}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
              fav
                ? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400"
                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            <Star className={`h-3.5 w-3.5 ${fav ? "fill-current" : ""}`} />
            <span>{fav ? labels.favRemove : labels.favAdd}</span>
          </button>
          <button
            type="button"
            onClick={async () => {
              await onShare();
              setCopied(true);
              window.setTimeout(() => setCopied(false), 2000);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Share2 className="h-3.5 w-3.5" />
            )}
            <span className={copied ? "text-emerald-600 dark:text-emerald-400 font-semibold" : undefined}>
              {copied ? labels.copied : labels.share}
            </span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/75 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 via-sky-500 to-blue-600 flex items-center justify-center text-white shadow-xs shrink-0">
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                  {labels.title}
                </h1>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border border-cyan-200/60 dark:border-cyan-800/40">
                  ISO 12647
                </span>
              </div>
              <p className="font-body text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 mt-0.5 max-w-xl leading-relaxed">
                {labels.subtitle}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full lg:w-auto shrink-0">
            <div className="min-w-0 bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/80 rounded-xl px-2.5 sm:px-3 py-2 flex items-center gap-2 sm:gap-2.5 transition-colors">
              <div className="w-7 h-7 rounded-lg bg-cyan-100/70 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                <Layers className="w-3.5 h-3.5" />
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

            <div className="min-w-0 bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/80 rounded-xl px-2.5 sm:px-3 py-2 flex items-center gap-2 sm:gap-2.5 transition-colors">
              <div className="w-7 h-7 rounded-lg bg-emerald-100/70 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Droplets className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
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

            <div className="hidden sm:flex min-w-0 bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/80 rounded-xl px-3 py-2 items-center gap-2.5 transition-colors">
              <div className="w-7 h-7 rounded-lg bg-indigo-100/70 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Palette className="w-3.5 h-3.5" />
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
