import React from "react";
import { Link } from "@tanstack/react-router";
import { Zap, FileText, Calculator, ChevronRight, Clock, Heart, Share2 } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

interface HeroBannerProps {
  historyCount: number;
  isFavorite: boolean;
  onOpenHistory: () => void;
  onToggleFavorite: () => void;
  onShare: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  historyCount,
  isFavorite,
  onOpenHistory,
  onToggleFavorite,
  onShare,
}) => {
  const { t, language } = useLanguage();
  const labels =
    language === "ru"
      ? {
          home: "Главная",
          category: "Финансы и инвестиции",
          favorite: "В избранное",
          share: "Поделиться",
        }
      : language === "uz"
        ? {
            home: "Bosh sahifa",
            category: "Moliya va investitsiyalar",
            favorite: "Sevimlilarga",
            share: "Ulashish",
          }
        : { home: "Home", category: "Finance & investing", favorite: "Favorite", share: "Share" };

  return (
    <div className="w-full mb-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <nav
          aria-label="Breadcrumb"
          className="flex min-w-0 items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400"
        >
          <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400">
            {labels.home}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <Link
            to="/categories/$id"
            params={{ id: "finance" }}
            className="hover:text-blue-600 dark:hover:text-blue-400"
          >
            {labels.category}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate text-slate-700 dark:text-slate-200">{t.hero.title}</span>
        </nav>

        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={onOpenHistory} className="new-loan-header-action">
            <Clock className="h-4 w-4" />
            <span>{t.nav.history}</span>
            {historyCount > 0 && <b>{historyCount}</b>}
          </button>
          <button
            type="button"
            onClick={onToggleFavorite}
            className={`new-loan-header-action${isFavorite ? " active" : ""}`}
          >
            <Heart className="h-4 w-4" fill={isFavorite ? "currentColor" : "none"} />
            <span>{labels.favorite}</span>
          </button>
          <button type="button" onClick={onShare} className="new-loan-header-action">
            <Share2 className="h-4 w-4" />
            <span>{labels.share}</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/75 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left: Icon & Titles */}
          <div className="flex items-start sm:items-center gap-3.5">
            {/* Emerald rounded square with % symbol */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-2xs shrink-0">
              <span className="font-heading font-black text-2xl">%</span>
            </div>

            <div>
              <h1 className="font-heading text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                {t.hero.title}
              </h1>
              <p className="font-body text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 mt-0.5 max-w-xl leading-relaxed">
                {t.hero.subtitle}
              </p>
            </div>
          </div>

          {/* Right: Feature Badges (2 on mobile 50%/50%, 3 on tablet/desktop) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full lg:w-auto shrink-0">
            {/* Badge 1 */}
            <div className="min-w-0 bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/80 rounded-xl px-2.5 sm:px-3 py-2 flex items-center gap-2 sm:gap-2.5 transition-colors">
              <div className="w-7 h-7 rounded-lg bg-blue-100/70 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Zap className="w-3.5 h-3.5 fill-blue-600 dark:fill-blue-400" />
              </div>
              <div className="min-w-0">
                <p className="font-heading text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight truncate">
                  {t.hero.badge1Title}
                </p>
                <p className="font-body text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight truncate">
                  {t.hero.badge1Desc}
                </p>
              </div>
            </div>

            {/* Badge 2 */}
            <div className="min-w-0 bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/80 rounded-xl px-2.5 sm:px-3 py-2 flex items-center gap-2 sm:gap-2.5 transition-colors">
              <div className="w-7 h-7 rounded-lg bg-blue-100/70 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <FileText className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <p className="font-heading text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight truncate">
                  {t.hero.badge2Title}
                </p>
                <p className="font-body text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight truncate">
                  {t.hero.badge2Desc}
                </p>
              </div>
            </div>

            {/* Badge 3 */}
            <div className="hidden sm:flex min-w-0 bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/80 rounded-xl px-3 py-2 items-center gap-2.5 transition-colors">
              <div className="w-7 h-7 rounded-lg bg-blue-100/70 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Calculator className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <p className="font-heading text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight truncate">
                  {t.hero.badge3Title}
                </p>
                <p className="font-body text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight truncate">
                  {t.hero.badge3Desc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
