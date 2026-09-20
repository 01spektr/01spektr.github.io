import React from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight, Zap, ShieldCheck, Laptop, Share2, Star } from "lucide-react";
import { useState } from "react";
import { ToolIcon } from "@/components/tool-icon";
import { isFavorite, toggleFavorite } from "@/lib/tools/favorites";
import { buildShareUrl, shareUrl } from "@/lib/tools/share";
import { useTranslation } from "../context/LanguageContext.tsx";

export const BreadcrumbsHero: React.FC = () => {
  const { t, lang } = useTranslation();
  const [favorite, setFavorite] = useState(() => isFavorite("text-symbol-generator"));
  const category =
    lang === "ru"
      ? "AI и работа с текстом"
      : lang === "uz"
        ? "AI va matn bilan ishlash"
        : "AI & writing";
  const favoriteLabel =
    lang === "ru"
      ? favorite
        ? "В избранном"
        : "В избранное"
      : lang === "uz"
        ? favorite
          ? "Sevimlilarda"
          : "Sevimlilarga"
        : favorite
          ? "Saved"
          : "Add to favorites";
  const shareLabel = lang === "ru" ? "Поделиться" : lang === "uz" ? "Ulashish" : "Share";

  return (
    <section id="breadcrumbs-hero" className="w-full mb-4 sm:mb-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 mb-3 sm:mb-4 overflow-x-auto no-scrollbar py-0.5 font-heading">
        <Link
          to="/"
          className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap"
        >
          {t("hero.home")}
        </Link>
        <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
        <Link
          to="/categories/$id"
          params={{ id: "ai-text" }}
          className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap"
        >
          {category}
        </Link>
        <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
        <span className="text-slate-800 dark:text-slate-200 font-semibold whitespace-nowrap">
          {t("hero.currentPage")}
        </span>
      </nav>

      {/* Hero Banner Card */}
      <div className="flex flex-col gap-4 sm:gap-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xs transition-colors">
        <div className="flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={() => setFavorite(toggleFavorite("text-symbol-generator"))}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-xs hover:border-purple-300 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
          >
            <Star className={`size-4 ${favorite ? "fill-current text-purple-600" : ""}`} />
            {favoriteLabel}
          </button>
          <button
            type="button"
            onClick={() =>
              void shareUrl(
                buildShareUrl("/tools/text-symbol-generator", new URLSearchParams()),
                t("hero.title"),
              )
            }
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-xs hover:border-purple-300 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
          >
            <Share2 className="size-4" />
            {shareLabel}
          </button>
        </div>
        <div className="flex flex-col min-[1700px]:flex-row min-[1700px]:items-center justify-between gap-4 sm:gap-6">
          {/* Left: Icon & Text description */}
          <div className="flex items-start sm:items-center gap-3 sm:gap-4.5">
            {/* Purple "Aa" Badge */}
            <ToolIcon tool={{ slug: "text-symbol-generator", icon: "Type" }} size="hero" />
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-[11px] font-bold font-heading mb-1 border border-purple-200/60 dark:border-purple-800/60">
                {t("hero.badge")}
              </div>
              <h1 className="text-lg sm:text-2xl lg:text-3xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight leading-tight">
                {t("hero.title")}
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed font-inter">
                {t("hero.subtitle")}
              </p>
            </div>
          </div>

          {/* Right: Quick Features Cards */}
          <div className="grid grid-cols-3 gap-2 w-full min-[1700px]:w-auto min-[1700px]:flex min-[1700px]:flex-nowrap shrink-0">
            {/* Feature 1 */}
            <div className="flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-1.5 sm:gap-3 p-2 sm:px-3.5 sm:py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/80">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div>
                <div className="text-[11px] sm:text-xs font-bold font-heading text-slate-900 dark:text-slate-200 leading-tight">
                  {t("hero.features.instantCopy")}
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-1.5 sm:gap-3 p-2 sm:px-3.5 sm:py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/80">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div>
                <div className="text-[11px] sm:text-xs font-bold font-heading text-slate-900 dark:text-slate-200 leading-tight">
                  {t("hero.features.noRegistration")}
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-1.5 sm:gap-3 p-2 sm:px-3.5 sm:py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/80">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                <Laptop className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div>
                <div className="text-[11px] sm:text-xs font-bold font-heading text-slate-900 dark:text-slate-200 leading-tight">
                  {t("hero.features.worksEverywhere")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
