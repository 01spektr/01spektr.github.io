import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import { House, ChevronRight, Heart, Share2, Check, Layers, Ruler, FileSpreadsheet, RotateCcw } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { localeHomePath, localizedCategoryPath } from "@/lib/i18n/config";

interface HeroBannerProps {
  isSaved: boolean;
  onToggleSaved: () => void;
  onShare: () => Promise<void>;
  onReset: () => void;
}

export const RoofHeroBanner: React.FC<HeroBannerProps> = ({
  isSaved,
  onToggleSaved,
  onShare,
  onReset,
}) => {
  const { locale } = useI18n();
  const [copied, setCopied] = useState(false);

  const t = {
    ru: {
      home: "Главная",
      category: "Строительство и замеры",
      title: "Калькулятор кровли",
      subtitle: "Точный расчёт площади крыши, угла наклона, кровельных листов и стоимости материалов",
      saved: "В избранное",
      share: "Поделиться",
      reset: "Сбросить",
      badge1Title: "4 типа крыши",
      badge1Desc: "Двускатная, вальма, мансарда",
      badge2Title: "Раскрой листов",
      badge2Desc: "С учётом нахлёста и запаса",
      badge3Title: "2D и 3D схема",
      badge3Desc: "Интерактивный чертёж",
    },
    uz: {
      home: "Bosh sahifa",
      category: "Qurilish va ta’mirlash",
      title: "Tom yopish kalkulyatori",
      subtitle: "Tom maydoni, qiyaligi, tom yopish listlari va materiallar sarfini aniq onlayn hisoblash",
      saved: "Saqlanganlar",
      share: "Ulashish",
      reset: "Qayta o‘rnatish",
      badge1Title: "4 xil tom turi",
      badge1Desc: "Ikki nishabli, valmali, mansard",
      badge2Title: "Listlar soni",
      badge2Desc: "Ustma-ust tushish va zaxira",
      badge3Title: "2D va 3D chizma",
      badge3Desc: "Interaktiv vizualizatsiya",
    },
    en: {
      home: "Home",
      category: "Construction & Measurement",
      title: "Roof Calculator",
      subtitle: "Accurate online roof pitch, surface area, metal sheet count, and cost estimation",
      saved: "Bookmark",
      share: "Share",
      reset: "Reset",
      badge1Title: "4 Roof Types",
      badge1Desc: "Gable, hip, shed, mansard",
      badge2Title: "Sheet Estimator",
      badge2Desc: "With overlaps & waste allowance",
      badge3Title: "2D & 3D Model",
      badge3Desc: "Interactive live preview",
    },
  }[locale] ?? {
    home: "Home",
    category: "Construction",
    title: "Roof Calculator",
    subtitle: "Accurate roof calculations",
    saved: "Saved",
    share: "Share",
    reset: "Reset",
    badge1Title: "4 Roof Types",
    badge1Desc: "Gable, hip, mansard",
    badge2Title: "Materials",
    badge2Desc: "Sheets and overlaps",
    badge3Title: "Live Preview",
    badge3Desc: "Interactive diagrams",
  };

  const categoryUrl = localizedCategoryPath("construction", locale);

  return (
    <div className="w-full mb-6">
      {/* Breadcrumb + Top Actions */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <nav
          aria-label="Breadcrumb"
          className="flex min-w-0 items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400"
        >
          <Link to={localeHomePath(locale)} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {t.home}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <Link
            to={categoryUrl}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {t.category}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate text-slate-700 dark:text-slate-200 font-medium">
            {t.title}
          </span>
        </nav>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={t.reset}
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
            <span>{t.reset}</span>
          </button>

          <button
            type="button"
            onClick={onToggleSaved}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-900 border rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              isSaved
                ? "border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/30"
                : "border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            <Heart className="h-3.5 w-3.5" fill={isSaved ? "currentColor" : "none"} />
            <span>{t.saved}</span>
          </button>

          <button
            type="button"
            onClick={async () => {
              await onShare();
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Share2 className="h-3.5 w-3.5 text-slate-400" />
            )}
            <span className={copied ? "text-emerald-600 dark:text-emerald-400 font-bold" : undefined}>
              {copied ? "OK!" : t.share}
            </span>
          </button>
        </div>
      </div>

      {/* Hero Banner Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left: Icon & Title */}
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-xs shrink-0">
              <House className="w-6 h-6 stroke-[2.2]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                  {t.title}
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-400">
                  {t.category}
                </span>
              </div>
              <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
                {t.subtitle}
              </p>
            </div>
          </div>

          {/* Right: Feature Badges (3 items) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full lg:w-auto shrink-0">
            {/* Badge 1 */}
            <div className="min-w-0 bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70 rounded-xl px-2.5 sm:px-3 py-2 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Layers className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight truncate">
                  {t.badge1Title}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight truncate">
                  {t.badge1Desc}
                </p>
              </div>
            </div>

            {/* Badge 2 */}
            <div className="min-w-0 bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70 rounded-xl px-2.5 sm:px-3 py-2 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                <FileSpreadsheet className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight truncate">
                  {t.badge2Title}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight truncate">
                  {t.badge2Desc}
                </p>
              </div>
            </div>

            {/* Badge 3 */}
            <div className="min-w-0 col-span-2 sm:col-span-1 bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70 rounded-xl px-2.5 sm:px-3 py-2 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Ruler className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight truncate">
                  {t.badge3Title}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight truncate">
                  {t.badge3Desc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
