import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ChevronRight,
  Truck,
  Star,
  Share2,
  Check,
  Zap,
  Sliders,
  Bookmark,
  ShieldCheck,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { localeHomePath, localizedCategoryPath } from "@/lib/i18n/config";

interface TruckHeroBannerProps {
  favorite: boolean;
  onToggleFavorite: () => void;
  savedCount: number;
  onOpenSaved: () => void;
  onShare: () => Promise<void>;
}

export const TruckHeroBanner: React.FC<TruckHeroBannerProps> = ({
  favorite,
  onToggleFavorite,
  savedCount,
  onOpenSaved,
  onShare,
}) => {
  const { locale } = useI18n();
  const [copied, setCopied] = useState(false);

  const labels = {
    ru: {
      home: "Главная",
      category: "Логистика и грузоперевозки",
      title: "Расход топлива грузовика",
      subtitle:
        "Онлайн-калькулятор расхода топлива и себестоимости рейса с учётом груза, рельефа и норм Минтранса.",
      favAdd: "В избранное",
      favRemove: "В избранном",
      saved: "Сохранённые",
      share: "Поделиться",
      copied: "Скопировано!",
      b1Title: "Точный расчёт",
      b1Desc: "Учёт груза и порожнего рейса",
      b2Title: "Минтранс и рельеф",
      b2Desc: "Подъёмы, спуски, горы и сезон",
      b3Title: "Каталог тягачей",
      b3Desc: "Нормы MAN, Scania, КАМАЗ",
    },
    uz: {
      home: "Bosh sahifa",
      category: "Logistika va yuk tashish",
      title: "Yuk mashinasi yoqilg‘i sarfi",
      subtitle:
        "Yuk og‘irligi, relyef va me’yorlarni hisobga oluvchi yoqilg‘i sarfi va reys xarajatlari onlayn kalkulyatori.",
      favAdd: "Saralangan",
      favRemove: "Saralangan",
      saved: "Saqlanganlar",
      share: "Ulashish",
      copied: "Nusxalandi!",
      b1Title: "Aniq hisob-kitob",
      b1Desc: "Yukli va yuksiz masofa hisobi",
      b2Title: "Relyef va omillar",
      b2Desc: "Balandliklar, qish va sharoitlar",
      b3Title: "Modellar bazasi",
      b3Desc: "MAN, Scania, KAMAZ me’yorlari",
    },
    en: {
      home: "Home",
      category: "Logistics & shipping",
      title: "Truck Fuel Consumption",
      subtitle:
        "Online fuel consumption and trip cost calculator factoring in cargo weight, road gradient, and operating conditions.",
      favAdd: "Bookmark",
      favRemove: "Saved",
      saved: "Saved trips",
      share: "Share",
      copied: "Copied!",
      b1Title: "Accurate Trip Cost",
      b1Desc: "Loaded & empty distance split",
      b2Title: "Terrain & Season",
      b2Desc: "Elevation change & winter factor",
      b3Title: "Truck Presets",
      b3Desc: "MAN, Scania, Volvo norms",
    },
  }[locale] || {
    home: "Home",
    category: "Logistics & shipping",
    title: "Truck Fuel Consumption",
    subtitle:
      "Online fuel consumption and trip cost calculator factoring in cargo weight and road conditions.",
    favAdd: "Bookmark",
    favRemove: "Saved",
    saved: "Saved",
    share: "Share",
    copied: "Copied!",
    b1Title: "Accurate Trip Cost",
    b1Desc: "Loaded & empty distance split",
    b2Title: "Terrain & Season",
    b2Desc: "Elevation change & winter factor",
    b3Title: "Truck Presets",
    b3Desc: "Fleet norms",
  };

  const handleShareClick = async () => {
    await onShare();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full mb-5">
      {/* Top bar: Breadcrumb Trail & Quick Actions */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <nav
          aria-label="Breadcrumb"
          className="flex min-w-0 items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-inter overflow-x-auto whitespace-nowrap scrollbar-none"
        >
          <Link
            to={localeHomePath(locale)}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors shrink-0"
          >
            {labels.home}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-slate-600" />
          <Link
            to={localizedCategoryPath("logistics", locale)}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors shrink-0"
          >
            {labels.category}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-slate-600" />
          <span className="truncate text-slate-700 dark:text-slate-200 font-medium">
            {labels.title}
          </span>
        </nav>

        {/* Favorite, Saved Trips & Share actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Saved Trips Button */}
          <button
            type="button"
            onClick={onOpenSaved}
            className={`inline-flex h-9 items-center gap-1.5 px-3 rounded-xl border text-xs font-semibold shadow-2xs transition-colors cursor-pointer ${
              savedCount > 0
                ? "border-blue-300 dark:border-blue-700 bg-blue-50/70 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300"
                : "border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            <Bookmark
              className={`h-3.5 w-3.5 ${
                savedCount > 0
                  ? "text-blue-600 dark:text-blue-400 fill-blue-600 dark:fill-blue-400"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            />
            <span>{labels.saved}</span>
            {savedCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-blue-600 text-white">
                {savedCount}
              </span>
            )}
          </button>

          {/* Favorite Button */}
          <button
            type="button"
            id="truck-favorite-btn"
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
            id="truck-share-btn"
            onClick={handleShareClick}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-emerald-600 dark:text-emerald-400">
                  {labels.copied}
                </span>
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                <span>{labels.share}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Hero Card Compacted Exactly Like Benchmark */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left: Icon & Title */}
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-2xs shrink-0">
              <Truck className="w-6 h-6 stroke-[2.2]" />
            </div>

            <div>
              <h1 className="font-heading text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-snug sm:whitespace-nowrap">
                {labels.title}
              </h1>
              <p className="font-body text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 mt-0.5 max-w-xl leading-relaxed font-inter">
                {labels.subtitle}
              </p>
            </div>
          </div>

          {/* Right: 3 Feature Badges matching benchmark */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full lg:w-auto shrink-0 font-inter">
            {/* Badge 1 */}
            <div className="min-w-0 bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/80 rounded-xl px-2.5 sm:px-3 py-2 flex items-center gap-2 sm:gap-2.5 transition-colors">
              <div className="w-7 h-7 rounded-lg bg-blue-100/70 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Truck className="w-3.5 h-3.5" />
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
                <Sliders className="w-3.5 h-3.5" />
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
