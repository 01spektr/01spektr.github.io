import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ChevronRight,
  Type,
  Star,
  Share2,
  Check,
  Zap,
  ShieldCheck,
  Layers,
  Sparkles,
} from "lucide-react";
import { useTranslation } from "../context/LanguageContext.tsx";
import { localeHomePath, localizedCategoryPath } from "@/lib/i18n/config";

interface BreadcrumbsHeroProps {
  fav: boolean;
  onToggleFav: () => void;
  onShare: () => Promise<void>;
}

export const BreadcrumbsHero: React.FC<BreadcrumbsHeroProps> = ({
  fav,
  onToggleFav,
  onShare,
}) => {
  const { t, lang } = useTranslation();
  const [copied, setCopied] = useState(false);

  const labels = {
    ru: {
      home: "Главная",
      category: "AI и работа с текстом",
      title: "Генератор красивого текста",
      subtitle:
        "Создавайте стильные шрифты, символы и эмодзи для Instagram, Telegram, TikTok, Discord и игр с мгновенным копированием в 1 клик.",
      favAdd: "В избранное",
      favRemove: "В избранном",
      share: "Поделиться",
      copied: "Скопировано!",
      b1Title: "30+ стилей",
      b1Desc: "Жирный, готика, курсив",
      b2Title: "800+ символов",
      b2Desc: "Эмодзи, рамки, значки",
      b3Title: "100% приватно",
      b3Desc: "Работает в браузере",
    },
    uz: {
      home: "Bosh sahifa",
      category: "AI va matn bilan ishlash",
      title: "Chiroyli matn generatori",
      subtitle:
        "Instagram, Telegram, TikTok, Discord va o‘yinlar uchun chiroyli shriftlar, belgilar va emojilarni 1 bosishda nusxalang.",
      favAdd: "Tanlanganlarga",
      favRemove: "Tanlangan",
      share: "Ulashish",
      copied: "Nusxalandi!",
      b1Title: "30+ uslub",
      b1Desc: "Qalin, gotika, kursiv",
      b2Title: "800+ belgi",
      b2Desc: "Emojilar, ramkalar, belgilar",
      b3Title: "100% maxfiy",
      b3Desc: "Brauzerda ishlaydi",
    },
    en: {
      home: "Home",
      category: "AI & writing",
      title: "Fancy Text & Font Generator",
      subtitle:
        "Convert normal text into cool stylish fonts, unicode symbols, and emojis for Instagram, Telegram, TikTok, and games.",
      favAdd: "Bookmark",
      favRemove: "Saved",
      share: "Share",
      copied: "Copied!",
      b1Title: "30+ Styles",
      b1Desc: "Bold, gothic, cursive",
      b2Title: "800+ Symbols",
      b2Desc: "Emojis, frames, icons",
      b3Title: "100% Private",
      b3Desc: "Runs locally in browser",
    },
  }[lang] || {
    home: "Home",
    category: "AI & writing",
    title: "Fancy Text & Font Generator",
    subtitle:
      "Convert normal text into cool stylish fonts, unicode symbols, and emojis for social platforms.",
    favAdd: "Bookmark",
    favRemove: "Saved",
    share: "Share",
    copied: "Copied!",
    b1Title: "30+ Styles",
    b1Desc: "Bold, gothic, cursive",
    b2Title: "800+ Symbols",
    b2Desc: "Emojis, frames, icons",
    b3Title: "100% Private",
    b3Desc: "Runs locally in browser",
  };

  return (
    <div className="w-full mb-5">
      {/* Top Bar: Clean Breadcrumbs on the left, standard Favorite & Share buttons on the right */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <nav
          aria-label="Breadcrumb"
          className="flex min-w-0 items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-heading"
        >
          <Link
            to={localeHomePath(lang)}
            className="hover:text-primary dark:hover:text-primary transition-colors"
          >
            {labels.home}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <Link
            to={localizedCategoryPath("ai-text", lang)}
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
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-900 border rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              fav
                ? "border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/30"
                : "border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            <Star className="h-3.5 w-3.5" fill={fav ? "currentColor" : "none"} />
            <span>{fav ? labels.favRemove : labels.favAdd}</span>
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
            <span
              className={
                copied ? "text-emerald-600 dark:text-emerald-400 font-bold" : undefined
              }
            >
              {copied ? labels.copied : labels.share}
            </span>
          </button>
        </div>
      </div>

      {/* Hero Banner Card matching QR Generator & Loan Calculator benchmark */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left: Gradient Icon & Title */}
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 via-indigo-500 to-pink-500 flex items-center justify-center text-white shadow-xs shrink-0">
              <Type className="w-6 h-6 stroke-[2.2]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight font-heading">
                  {labels.title}
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-400 border border-purple-200/60 dark:border-purple-800/60 font-heading">
                  {labels.category}
                </span>
              </div>
              <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 mt-1 max-w-xl leading-relaxed font-inter">
                {labels.subtitle}
              </p>
            </div>
          </div>

          {/* Right: 3 Feature Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full lg:w-auto shrink-0">
            {/* Badge 1 */}
            <div className="min-w-0 bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70 rounded-xl px-2.5 sm:px-3 py-2 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                <Layers className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight truncate font-heading">
                  {labels.b1Title}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight truncate font-inter">
                  {labels.b1Desc}
                </p>
              </div>
            </div>

            {/* Badge 2 */}
            <div className="min-w-0 bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70 rounded-xl px-2.5 sm:px-3 py-2 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight truncate font-heading">
                  {labels.b2Title}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight truncate font-inter">
                  {labels.b2Desc}
                </p>
              </div>
            </div>

            {/* Badge 3 */}
            <div className="min-w-0 col-span-2 sm:col-span-1 bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70 rounded-xl px-2.5 sm:px-3 py-2 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight truncate font-heading">
                  {labels.b3Title}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight truncate font-inter">
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
