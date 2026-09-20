import React, { useRef, useState } from "react";
import { Sparkles, X } from "lucide-react";
import { useTranslation } from "../context/LanguageContext.tsx";

interface MainInputCardProps {
  inputText: string;
  onChangeInputText: (text: string) => void;
  onRefresh?: () => void;
}

export const MainInputCard: React.FC<MainInputCardProps> = ({
  inputText,
  onChangeInputText,
  onRefresh,
}) => {
  const { t } = useTranslation();
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const showNotice = (text: string) => {
    setFeedbackNotice(text);
    setTimeout(() => {
      setFeedbackNotice(null);
    }, 2000);
  };

  const handleClear = () => {
    onChangeInputText("");
    inputRef.current?.focus();
    showNotice(t("input.actions.clear"));
  };

  const handleRefreshClick = () => {
    if (!inputText.trim()) {
      onChangeInputText(t("input.defaultText"));
    }
    showNotice(t("hero.features.instantCopy"));
    if (onRefresh) onRefresh();
  };

  return (
    <div
      id="main-generator-input-card"
      className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs transition-colors"
    >
      {/* Header Bar: Title, Live Notice, Character Count */}
      <div className="flex items-center justify-between mb-2.5">
        <label
          htmlFor="permanent-text-input"
          className="text-xs sm:text-sm font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2"
        >
          <span>{t("input.title")}</span>
          {feedbackNotice && (
            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/60 px-2 py-0.5 rounded-md animate-pulse font-sans">
              ✓ {feedbackNotice}
            </span>
          )}
        </label>
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 font-sans">
          {inputText.length} {t("input.stats.chars")}
        </span>
      </div>

      {/* Text Input Box & Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            id="permanent-text-input"
            type="text"
            value={inputText}
            onChange={(e) => onChangeInputText(e.target.value)}
            placeholder={t("input.placeholder")}
            className="w-full h-12 pl-4 pr-11 text-base font-medium text-slate-900 dark:text-white font-heading bg-slate-50/90 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-400 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-2xs"
          />
          {inputText && (
            <button
              id="clear-input-btn"
              type="button"
              onClick={handleClear}
              title={t("input.actions.clear")}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 active:scale-90 rounded-lg hover:bg-slate-200/70 dark:hover:bg-slate-700 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          id="generate-button"
          type="button"
          onClick={handleRefreshClick}
          className="h-11 sm:h-12 w-full sm:w-auto px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold font-heading text-sm flex items-center justify-center gap-2 shadow-sm shadow-blue-500/20 active:scale-[0.98] transition-all cursor-pointer shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>{t("symbols.randomBtn")}</span>
        </button>
      </div>
    </div>
  );
};
