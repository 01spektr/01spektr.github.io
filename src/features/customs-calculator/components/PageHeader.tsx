import React, { useEffect, useState } from "react";
import { Zap, Calculator, Gift, Heart, Share2 } from "lucide-react";
import { ToolIcon } from "@/components/tool-icon";
import { isFavorite, toggleFavorite } from "@/lib/tools/favorites";
import { buildShareUrl, shareUrl } from "@/lib/tools/share";
import { useTranslation } from "../context/LanguageContext";

export const PageHeader: React.FC = () => {
  const { t, language } = useTranslation();
  const [favorite, setFavorite] = useState(false);

  useEffect(() => setFavorite(isFavorite("customs-calculator")), []);

  const labels =
    language === "ru"
      ? { favorite: "В избранное", share: "Поделиться" }
      : language === "uz"
        ? { favorite: "Sevimlilarga", share: "Ulashish" }
        : { favorite: "Favorite", share: "Share" };

  const handleShare = async () => {
    await shareUrl(
      buildShareUrl("/tools/customs-calculator", new URLSearchParams()),
      t("pageHeader.title"),
    );
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-5 pb-4 sm:pb-6">
      {/* Title & Description Section - Full width, no side-by-side card crunch */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between w-full">
        <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 min-w-0">
          {/* Gradient Icon with Document + Calculator */}
          <ToolIcon tool={{ slug: "customs-calculator", icon: "Ship" }} size="hero" />

          <div className="flex-1 min-w-0">
            <h1
              className="text-[20px] xs:text-[22px] sm:text-[26px] lg:text-[28px] font-extrabold text-[#0f172a] dark:text-white tracking-tight leading-tight"
              id="page-header-title"
            >
              {t("pageHeader.title")}
            </h1>
            <p
              className="text-[12.5px] sm:text-[13.5px] font-secondary text-slate-500 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed"
              id="page-header-subtitle"
            >
              {t("pageHeader.description")}
            </p>
          </div>
        </div>
        <div className="flex gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => setFavorite(toggleFavorite("customs-calculator"))}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 shadow-sm transition hover:border-blue-300 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            <Heart className="h-4 w-4" fill={favorite ? "currentColor" : "none"} />
            {labels.favorite}
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 shadow-sm transition hover:border-blue-300 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            <Share2 className="h-4 w-4" />
            {labels.share}
          </button>
        </div>
      </div>

      {/* 3 Feature Cards / Badges in their own dedicated responsive row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3.5 w-full">
        {/* Card 1: Актуальные ставки */}
        <div
          className="flex items-center gap-3 px-3.5 sm:px-4 py-2.5 sm:py-3 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-2xs min-w-0 transition-colors"
          id="feature-badge-rates"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#eef6ff] dark:bg-blue-950/60 flex items-center justify-center text-[#0066FF] dark:text-blue-400 shrink-0">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-[#0066FF] stroke-[#0066FF] dark:fill-blue-400 dark:stroke-blue-400" />
          </div>
          <div className="min-w-0">
            <div className="text-[12.5px] sm:text-[13px] font-bold text-slate-900 dark:text-slate-100 leading-tight">
              {t("pageHeader.card1Title")}
            </div>
            <div className="text-[11px] sm:text-[11.5px] font-secondary text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
              {t("pageHeader.card1Subtitle")}
            </div>
          </div>
        </div>

        {/* Card 2: Удобный расчёт */}
        <div
          className="flex items-center gap-3 px-3.5 sm:px-4 py-2.5 sm:py-3 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-2xs min-w-0 transition-colors"
          id="feature-badge-calculation"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#eef6ff] dark:bg-blue-950/60 flex items-center justify-center text-[#0066FF] dark:text-blue-400 shrink-0">
            <Calculator className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <div className="text-[12.5px] sm:text-[13px] font-bold text-slate-900 dark:text-slate-100 leading-tight">
              {t("pageHeader.card2Title")}
            </div>
            <div className="text-[11px] sm:text-[11.5px] font-secondary text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
              {t("pageHeader.card2Subtitle")}
            </div>
          </div>
        </div>

        {/* Card 3: Бесплатно */}
        <div
          className="flex items-center gap-3 px-3.5 sm:px-4 py-2.5 sm:py-3 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-2xs min-w-0 transition-colors"
          id="feature-badge-free"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#eef6ff] dark:bg-blue-950/60 flex items-center justify-center text-[#0066FF] dark:text-blue-400 shrink-0">
            <Gift className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
          </div>
          <div className="min-w-0">
            <div className="text-[12.5px] sm:text-[13px] font-bold text-slate-900 dark:text-slate-100 leading-tight">
              {t("pageHeader.card3Title")}
            </div>
            <div className="text-[11px] sm:text-[11.5px] font-secondary text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
              {t("pageHeader.card3Subtitle")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
