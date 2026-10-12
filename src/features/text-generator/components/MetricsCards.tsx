import React, { useState } from "react";
import { Check, Copy, Sparkles, Type, Eye, CheckCircle2 } from "lucide-react";
import { useTranslation } from "../context/LanguageContext.tsx";

interface MetricsCardsProps {
  inputText: string;
  stylesCount: number;
  selectedStyleName: string;
  onCopyAll: () => void;
}

export const TextMetricsCards: React.FC<MetricsCardsProps> = ({
  inputText,
  stylesCount,
  selectedStyleName,
  onCopyAll,
}) => {
  const { t, lang } = useTranslation();
  const [copied, setCopied] = useState(false);

  const cleanText = inputText.trim();
  const isEmpty = cleanText.length === 0;
  const charsCount = cleanText.length;
  const wordsCount = isEmpty ? 0 : cleanText.split(/\s+/).filter(Boolean).length;

  const labels = {
    ru: {
      success: "Шрифты и стили готовы к копированию",
      empty: "Введите слово или фразу для генерации шрифтов",
      copy: "Копировать",
      copied: "Скопировано!",
      statsTitle: "Символов и слов",
      statsSub: `${wordsCount} ${wordsCount === 1 ? "слово" : wordsCount < 5 ? "слова" : "слов"} · UTF-8`,
      stylesTitle: "Стили и оформление",
      stylesSub: "Готово для соцсетей и ников",
      activeStyleTitle: "Текущий превью",
      activeStyleSub: "Для постов, историй и био",
    },
    uz: {
      success: "Shriftlar va uslublar nusxalashga tayyor",
      empty: "Shriftlarni yaratish uchun so‘z yoki matn kiriting",
      copy: "Nusxalash",
      copied: "Nusxalandi!",
      statsTitle: "Belgilar va so‘zlar",
      statsSub: `${wordsCount} ta so‘z · UTF-8`,
      stylesTitle: "Uslublar soni",
      stylesSub: "Ijtimoiy tarmoqlar va niklar uchun",
      activeStyleTitle: "Tanlangan uslub",
      activeStyleSub: "Postlar va bio uchun tayyor",
    },
    en: {
      success: "Fonts and styles are ready to copy",
      empty: "Type words or phrase to generate stylish fonts",
      copy: "Copy",
      copied: "Copied!",
      statsTitle: "Characters & Words",
      statsSub: `${wordsCount} ${wordsCount === 1 ? "word" : "words"} · UTF-8`,
      stylesTitle: "Styles Available",
      stylesSub: "Ready for bios, posts & nicknames",
      activeStyleTitle: "Active Preview",
      activeStyleSub: "Optimized for social platforms",
    },
  }[lang] || {
    success: "Fonts and styles are ready to copy",
    empty: "Type words or phrase to generate stylish fonts",
    copy: "Copy",
    copied: "Copied!",
    statsTitle: "Characters & Words",
    statsSub: `${wordsCount} words · UTF-8`,
    stylesTitle: "Styles Available",
    stylesSub: "Ready for social media",
    activeStyleTitle: "Active Preview",
    activeStyleSub: "Optimized for social platforms",
  };

  const statusText = isEmpty ? labels.empty : labels.success;

  return (
    <div className="flex flex-col gap-3">
      {/* Success / Warning status banner with copy button matching loan-calculator benchmark */}
      <div
        className={`border rounded-xl py-2 px-3 sm:px-3.5 flex items-center justify-between gap-2 transition-colors ${
          !isEmpty
            ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-800/60"
            : "bg-slate-50 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800"
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={`w-5 h-5 rounded-full text-white flex items-center justify-center shrink-0 ${
              !isEmpty ? "bg-emerald-600" : "bg-slate-400"
            }`}
          >
            {!isEmpty ? (
              <Check className="w-3 h-3 stroke-[3]" />
            ) : (
              <CheckCircle2 className="w-3 h-3 stroke-[2.5]" />
            )}
          </div>
          <span
            className={`text-xs sm:text-[13px] font-semibold truncate ${
              !isEmpty
                ? "text-emerald-900 dark:text-emerald-200"
                : "text-slate-700 dark:text-slate-300"
            }`}
          >
            {statusText}
          </span>
        </div>

        {!isEmpty && (
          <button
            type="button"
            onClick={() => {
              onCopyAll();
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            )}
            <span>{copied ? labels.copied : labels.copy}</span>
          </button>
        )}
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {/* Card 1: Characters & Words */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 font-inter">
              {labels.statsTitle}
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Type className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight font-heading">
            {charsCount}{" "}
            <span className="text-sm font-semibold text-slate-500 font-inter">
              {t("input.stats.chars")}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate font-inter">
            {labels.statsSub}
          </p>
        </div>

        {/* Card 2: Styles Count */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 font-inter">
              {labels.stylesTitle}
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-purple-600 dark:text-purple-400 tracking-tight font-heading">
            {stylesCount}+{" "}
            <span className="text-sm font-semibold text-slate-500 font-inter">
              {lang === "uz" ? "uslub" : lang === "en" ? "styles" : "стилей"}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate font-inter">
            {labels.stylesSub}
          </p>
        </div>

        {/* Card 3: Active Preview Style */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 font-inter">
              {labels.activeStyleTitle}
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Eye className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight font-heading truncate">
            {selectedStyleName || "Bold Serif"}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate font-inter">
            {labels.activeStyleSub}
          </p>
        </div>
      </div>
    </div>
  );
};
