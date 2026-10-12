import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ChevronRight,
  Clock,
  Heart,
  Share2,
  Check,
  Ship,
  Zap,
  Calculator,
  ShieldCheck,
} from "lucide-react";
import { useTranslation } from "../context/LanguageContext";
import { localeHomePath, localizedCategoryPath } from "@/lib/i18n/config";

interface HeroBannerProps {
  historyCount: number;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onOpenHistory: () => void;
  onShare: () => Promise<void>;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  historyCount,
  isFavorite,
  onToggleFavorite,
  onOpenHistory,
  onShare,
}) => {
  const { t, language } = useTranslation();
  const [copied, setCopied] = useState(false);

  const labels = {
    ru: {
      home: "Главная",
      category: "Логистика и ВЭД",
      history: "История",
      favorite: "В избранное",
      favorited: "В избранном",
      share: "Поделиться",
      copied: "Скопировано!",
      title: "Таможенный калькулятор Узбекистана",
      subtitle:
        "Расчёт таможенных платежей, пошлин, акцизов и НДС по кодам ТН ВЭД для юрлиц и физлиц в соответствии с Таможенным кодексом РУз.",
      b1Title: "Актуальные ставки",
      b1Desc: "База ТН ВЭД РУз 2026",
      b2Title: "Точный расчёт",
      b2Desc: "Пошлина, акциз, сбор и НДС",
      b3Title: "Физлица и юрлица",
      b3Desc: "Нормы ввоза и авиа/авто",
    },
    uz: {
      home: "Bosh sahifa",
      category: "Logistika va TIF",
      history: "Tarix",
      favorite: "Saralangan",
      favorited: "Saralangan",
      share: "Ulashish",
      copied: "Nusxalandi!",
      title: "O‘zbekiston bojxona kalkulyatori",
      subtitle:
        "O‘zbekiston Bojxona kodeksi bo‘yicha yuridik va jismoniy shaxslar uchun boj, aksiz, QQS va yig‘imlarni TIF TN kodlari asosida hisoblash.",
      b1Title: "Dolzarb stavkalar",
      b1Desc: "O‘zR TIF TN 2026 bazasi",
      b2Title: "Aniq hisob-kitob",
      b2Desc: "Boj, aksiz, yig‘im va QQS",
      b3Title: "Jismoniy va yuridik",
      b3Desc: "Bojxona me’yorlari va avia/avto",
    },
    en: {
      home: "Home",
      category: "Logistics & Foreign Trade",
      history: "History",
      favorite: "Bookmark",
      favorited: "Saved",
      share: "Share",
      copied: "Copied!",
      title: "Uzbekistan Customs Duty Calculator",
      subtitle:
        "Accurate calculation of import duties, VAT, excise, and customs clearance fees by HS codes under the Customs Code of Uzbekistan.",
      b1Title: "Up-to-Date Rates",
      b1Desc: "UZ HS Codes 2026",
      b2Title: "Accurate Breakdown",
      b2Desc: "Duty, excise, fees & VAT",
      b3Title: "B2B & Individuals",
      b3Desc: "De minimis & transit modes",
    },
  }[language] || {
    home: "Home",
    category: "Logistics & Trade",
    history: "History",
    favorite: "Bookmark",
    favorited: "Saved",
    share: "Share",
    copied: "Copied!",
    title: "Uzbekistan Customs Duty Calculator",
    subtitle:
      "Accurate calculation of import duties, VAT, excise, and customs clearance fees by HS codes.",
    b1Title: "Up-to-Date Rates",
    b1Desc: "UZ HS Codes 2026",
    b2Title: "Accurate Breakdown",
    b2Desc: "Duty, excise, fees & VAT",
    b3Title: "B2B & Individuals",
    b3Desc: "De minimis limits",
  };

  const currentTitle = t("pageHeader.title") || labels.title;
  const currentSubtitle = t("pageHeader.description") || labels.subtitle;

  return (
    <div className="w-full mb-5">
      {/* Top bar: Breadcrumb Trail & Quick Actions */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <nav
          aria-label="Breadcrumb"
          className="flex min-w-0 items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 overflow-x-auto whitespace-nowrap scrollbar-none"
        >
          <Link
            to={localeHomePath(language)}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {labels.home}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-slate-600" />
          <Link
            to={localizedCategoryPath("logistics", language)}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {labels.category}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-slate-600" />
          <span className="truncate text-slate-700 dark:text-slate-200 font-medium">
            {currentTitle}
          </span>
        </nav>

        <div className="flex flex-wrap items-center gap-2">
          {/* History Button */}
          <button
            type="button"
            onClick={onOpenHistory}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
          >
            <Clock className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
            <span>{labels.history}</span>
            {historyCount > 0 && (
              <b className="ml-0.5 px-1.5 py-0.2 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-[10px] font-bold">
                {historyCount}
              </b>
            )}
          </button>

          {/* Favorite Button */}
          <button
            type="button"
            onClick={onToggleFavorite}
            className={`inline-flex h-9 items-center gap-1.5 rounded-xl border px-3 text-xs font-semibold shadow-2xs transition-colors cursor-pointer ${
              isFavorite
                ? "border-rose-200/90 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400"
                : "border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400"
            }`}
          >
            <Heart
              className="h-3.5 w-3.5"
              fill={isFavorite ? "currentColor" : "none"}
            />
            <span>{isFavorite ? labels.favorited : labels.favorite}</span>
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

      {/* Main Hero Card Matching loan-calculator */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left: Icon & Title */}
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-2xs shrink-0">
              <Ship className="w-6 h-6 stroke-[2.2]" />
            </div>

            <div>
              <h1 className="font-heading text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                {currentTitle}
              </h1>
              <p className="font-body text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 mt-0.5 max-w-xl leading-relaxed">
                {currentSubtitle}
              </p>
            </div>
          </div>

          {/* Right: 3 Feature Badges matching loan-calculator */}
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
                <Calculator className="w-3.5 h-3.5" />
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
