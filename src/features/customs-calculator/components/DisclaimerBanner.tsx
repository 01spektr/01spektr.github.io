import React, { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { useTranslation } from "../context/LanguageContext";

export const DisclaimerBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const { t } = useTranslation();

  if (!isVisible) return null;

  return (
    <div
      className="mt-4 sm:mt-6 bg-[#fffbeb] dark:bg-amber-950/30 border border-[#fef08a] dark:border-amber-900/60 rounded-2xl p-3.5 sm:p-4 flex items-start sm:items-center justify-between gap-3 sm:gap-4 text-[12px] sm:text-[12.5px] font-secondary text-slate-700 dark:text-slate-300 shadow-2xs transition-colors"
      id="customs-disclaimer-banner"
    >
      <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 min-w-0">
        <div className="w-8 h-8 rounded-xl bg-[#fef3c7] dark:bg-amber-900/50 text-[#d97706] dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
          <AlertTriangle className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.2]" />
        </div>
        <div className="leading-relaxed min-w-0">
          <span className="font-bold text-slate-900 dark:text-slate-100">
            {t("disclaimer.title")}:{" "}
          </span>
          <span className="text-slate-600 dark:text-slate-300 break-words">
            {t("disclaimer.text")}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setIsVisible(false)}
        className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded-lg transition-colors cursor-pointer shrink-0"
        title={t("common.close")}
        id="btn-dismiss-disclaimer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
