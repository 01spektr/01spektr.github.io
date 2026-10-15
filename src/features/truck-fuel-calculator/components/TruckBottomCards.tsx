import React, { useState } from "react";
import {
  Info,
  HelpCircle,
  Lightbulb,
  ChevronDown,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { TranslationData } from "../locales/i18n";

interface TruckBottomCardsProps {
  onOpenFeedback: () => void;
  t: TranslationData["knowledge"];
}

export const TruckBottomCards: React.FC<TruckBottomCardsProps> = ({
  onOpenFeedback,
  t,
}) => {
  // Independent open/close states for each of the 3 cards
  const [openInfo, setOpenInfo] = useState(false);
  const [openFaq, setOpenFaq] = useState(false);
  const [openTips, setOpenTips] = useState(false);

  // Active accordion item for FAQ (0 = first question open by default when card is expanded)
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(0);

  return (
    <div className="mt-8 flex flex-col gap-6">
      {/* 1. Three Collapsible Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        {/* Card 1: Полезная информация */}
        <div
          className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all overflow-hidden ${
            openInfo
              ? "border-blue-500/80 shadow-md ring-2 ring-blue-500/10"
              : "border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700"
          }`}
        >
          <button
            type="button"
            onClick={() => setOpenInfo(!openInfo)}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100/60 dark:border-blue-900/50 group-hover:scale-105 transition-transform">
                <Info className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                  {t.card1Title}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5 font-inter">
                  {t.card1Sub}
                </p>
              </div>
            </div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-500 transition-transform duration-200 shrink-0 ml-2 ${
                openInfo
                  ? "rotate-180 bg-blue-50 dark:bg-slate-800 text-blue-600"
                  : "bg-slate-50 dark:bg-slate-800"
              }`}
            >
              <ChevronDown className="w-4 h-4" />
            </div>
          </button>

          {/* Expanded Content for Card 1 */}
          {openInfo && (
            <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-3 font-inter leading-relaxed">
              <div className="p-3 bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 rounded-xl">
                <div className="font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5 font-sans">
                  <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  {t.card1FormulaTitle}
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  <code className="font-mono font-bold text-blue-700 dark:text-blue-300">
                    Qн = 0.01 × (Hsan × S + Hw × W) × (1 + 0.01 × D)
                  </code>
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  {t.card1FormulaText}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-1 font-sans">
                  {t.card1Point1Title}
                </h4>
                <p>{t.card1Point1Text}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-1 font-sans">
                  {t.card1Point2Title}
                </h4>
                <p>{t.card1Point2Text}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-1 font-sans">
                  {t.card1Point3Title}
                </h4>
                <p>{t.card1Point3Text}</p>
              </div>
            </div>
          )}
        </div>

        {/* Card 2: Частые вопросы (FAQ) */}
        <div
          className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all overflow-hidden ${
            openFaq
              ? "border-blue-500/80 shadow-md ring-2 ring-blue-500/10"
              : "border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700"
          }`}
        >
          <button
            type="button"
            onClick={() => setOpenFaq(!openFaq)}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100/60 dark:border-blue-900/50 group-hover:scale-105 transition-transform">
                <HelpCircle className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                  {t.card2Title}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5 font-inter">
                  {t.card2Sub}
                </p>
              </div>
            </div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-500 transition-transform duration-200 shrink-0 ml-2 ${
                openFaq
                  ? "rotate-180 bg-blue-50 dark:bg-slate-800 text-blue-600"
                  : "bg-slate-50 dark:bg-slate-800"
              }`}
            >
              <ChevronDown className="w-4 h-4" />
            </div>
          </button>

          {/* Expanded Content for Card 2 with nested smooth accordion */}
          {openFaq && (
            <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-2.5 font-inter leading-relaxed">
              {[
                { q: t.card2Q1, a: t.card2A1 },
                { q: t.card2Q2, a: t.card2A2 },
                { q: t.card2Q3, a: t.card2A3 },
                { q: t.card2Q4, a: t.card2A4 },
                { q: t.card2Q5, a: t.card2A5 },
              ].map((item, idx) => {
                const isOpen = activeFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setActiveFaqIndex(isOpen ? null : idx)
                      }
                      className="w-full text-left p-3 flex items-center justify-between gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                    >
                      <span className="font-bold text-slate-900 dark:text-white font-sans text-xs">
                        {item.q}
                      </span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-blue-600" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-3 pb-3 pt-1 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Card 3: Советы по расчётам */}
        <div
          className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all overflow-hidden ${
            openTips
              ? "border-emerald-500/80 shadow-md ring-2 ring-emerald-500/10"
              : "border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700"
          }`}
        >
          <button
            type="button"
            onClick={() => setOpenTips(!openTips)}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100/60 dark:border-emerald-900/50 group-hover:scale-105 transition-transform">
                <Lightbulb className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                  {t.card3Title}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5 font-inter">
                  {t.card3Sub}
                </p>
              </div>
            </div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-500 transition-transform duration-200 shrink-0 ml-2 ${
                openTips
                  ? "rotate-180 bg-emerald-50 dark:bg-slate-800 text-emerald-600"
                  : "bg-slate-50 dark:bg-slate-800"
              }`}
            >
              <ChevronDown className="w-4 h-4" />
            </div>
          </button>

          {/* Expanded Content for Card 3 */}
          {openTips && (
            <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-3 font-inter leading-relaxed">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <strong className="text-slate-900 dark:text-white font-sans">
                    {t.card3P1Title}
                  </strong>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                    {t.card3P1Text}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <strong className="text-slate-900 dark:text-white font-sans">
                    {t.card3P2Title}
                  </strong>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                    {t.card3P2Text}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <strong className="text-slate-900 dark:text-white font-sans">
                    {t.card3P3Title}
                  </strong>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                    {t.card3P3Text}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  4
                </span>
                <div>
                  <strong className="text-slate-900 dark:text-white font-sans">
                    {t.card3P4Title}
                  </strong>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                    {t.card3P4Text}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Feedback Action Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-4 text-left w-full sm:w-auto">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100/60 dark:border-blue-900/50">
            <Lightbulb className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white tracking-tight">
              {t.feedbackTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 font-inter">
              {t.feedbackDesc}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenFeedback}
          className="w-full sm:w-auto px-6 py-2.5 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <span>{t.feedbackBtn}</span>
          <ArrowRight className="w-4 h-4 text-slate-500 dark:text-slate-400" />
        </button>
      </div>
    </div>
  );
};
