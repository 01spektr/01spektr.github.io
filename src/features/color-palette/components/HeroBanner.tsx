import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight, Palette, Sparkles, CheckCheck, Sliders, Star, Share2, Check } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface HeroBannerProps {
  fav: boolean;
  onToggleFav: () => void;
  onShare: () => Promise<void>;
}

export const PaletteHeroBanner: React.FC<HeroBannerProps> = ({
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
      title: "Палитра цветов",
      subtitle: "Создавайте гармоничные цветовые схемы, проверяйте контрастность по WCAG и экспортируйте коды HEX, RGB, CMYK.",
      favAdd: "В избранное",
      favRemove: "В избранном",
      share: "Поделиться",
      copied: "Скопировано!",
      b1Title: "Гармонии цвета",
      b1Desc: "Триада, аналог, сплит",
      b2Title: "Все форматы",
      b2Desc: "HEX, RGB, HSL, CMYK",
      b3Title: "Контраст WCAG",
      b3Desc: "Проверка доступности",
    },
    uz: {
      home: "Bosh sahifa",
      category: "Dizayn va poligrafiya",
      title: "Ranglar palitrasi",
      subtitle: "Uyg'un rang sxemalarini yarating, WCAG bo'yicha kontrastni tekshiring va HEX, RGB, CMYK kodlarini oling.",
      favAdd: "Tanlanganlarga",
      favRemove: "Tanlangan",
      share: "Ulashish",
      copied: "Nusxalandi!",
      b1Title: "Rang uyg'unligi",
      b1Desc: "Triada, analog, split",
      b2Title: "Barcha formatlar",
      b2Desc: "HEX, RGB, HSL, CMYK",
      b3Title: "WCAG kontrasti",
      b3Desc: "Foydalanish qulayligi",
    },
    en: {
      home: "Home",
      category: "Design & print",
      title: "Color Palette Generator",
      subtitle: "Create harmonious color combinations, check WCAG accessibility contrast, and export HEX, RGB, HSL, and CMYK codes.",
      favAdd: "Bookmark",
      favRemove: "Saved",
      share: "Share",
      copied: "Copied!",
      b1Title: "Color Harmonies",
      b1Desc: "Analogous, triad, split",
      b2Title: "All Formats",
      b2Desc: "HEX, RGB, HSL, CMYK",
      b3Title: "WCAG Contrast",
      b3Desc: "Accessibility check",
    },
  }[locale as "ru" | "uz" | "en"] || {
    home: "Home",
    category: "Design & print",
    title: "Color Palette Generator",
    subtitle: "Create harmonious color combinations, check accessibility contrast, and export HEX, RGB, HSL, and CMYK.",
    favAdd: "Bookmark",
    favRemove: "Saved",
    share: "Share",
    copied: "Copied!",
    b1Title: "Color Harmonies",
    b1Desc: "Analogous, triad, split",
    b2Title: "All Formats",
    b2Desc: "HEX, RGB, HSL, CMYK",
    b3Title: "WCAG Contrast",
    b3Desc: "Accessibility check",
  };

  return (
    <div className="w-full mb-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <nav
          aria-label="Breadcrumb"
          className="flex min-w-0 items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400"
        >
          <Link to="/" className="hover:text-primary dark:hover:text-primary transition-colors">
            {labels.home}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <Link
            to="/categories/$id"
            params={{ id: "design-print" }}
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 via-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-xs shrink-0">
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                  {labels.title}
                </h1>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 border border-pink-200/60 dark:border-pink-800/40">
                  WCAG 2.1
                </span>
              </div>
              <p className="font-body text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 mt-0.5 max-w-xl leading-relaxed">
                {labels.subtitle}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full lg:w-auto shrink-0">
            <div className="min-w-0 bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/80 rounded-xl px-2.5 sm:px-3 py-2 flex items-center gap-2 sm:gap-2.5 transition-colors">
              <div className="w-7 h-7 rounded-lg bg-pink-100/70 dark:bg-pink-900/40 text-pink-600 dark:text-pink-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5" />
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
              <div className="w-7 h-7 rounded-lg bg-indigo-100/70 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Sliders className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
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
              <div className="w-7 h-7 rounded-lg bg-emerald-100/70 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCheck className="w-3.5 h-3.5" />
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
