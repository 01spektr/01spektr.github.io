import React, { useState } from "react";
import { Info, BookOpen, Lightbulb, ChevronDown } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export const BottomCards: React.FC = () => {
  const { t } = useLanguage();

  // Independent open/close states
  const [openInfo, setOpenInfo] = useState(false);
  const [openFaq, setOpenFaq] = useState(false);
  const [openTips, setOpenTips] = useState(false);

  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(0);

  return (
    <div className="w-full mt-6">
      <div className="mb-3 px-0.5 flex items-center justify-between">
        <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {t.bottom.headerTitle}
        </h3>
        <span className="text-[11px] text-slate-400 dark:text-slate-500 font-body">
          {t.bottom.headerSubtitle}
        </span>
      </div>

      {/* Grid with items-start so each card maintains independent height */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        {/* Card 1: Полезная информация */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/85 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs transition-colors">
          <button
            type="button"
            onClick={() => setOpenInfo(!openInfo)}
            className="w-full flex items-center justify-between text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                <Info className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-heading text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {t.bottom.infoTabTitle}
                </h4>
                <p className="font-body text-[11px] text-slate-400 dark:text-slate-500">
                  {t.bottom.infoTabSubtitle}
                </p>
              </div>
            </div>
            <div className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  openInfo ? "rotate-180 text-blue-600 dark:text-blue-400" : ""
                }`}
              />
            </div>
          </button>

          {openInfo && (
            <div className="mt-3.5 pt-3.5 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-3 font-body leading-relaxed animate-in fade-in duration-150">
              <div>
                <h5 className="font-heading font-bold text-slate-800 dark:text-slate-200 text-[11px] uppercase tracking-wide mb-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>
                  {t.bottom.infoSection.annuityHeading}
                </h5>
                <p>{t.bottom.infoSection.annuityText}</p>
              </div>

              <div>
                <h5 className="font-heading font-bold text-slate-800 dark:text-slate-200 text-[11px] uppercase tracking-wide mb-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400"></span>
                  {t.bottom.infoSection.diffHeading}
                </h5>
                <p>{t.bottom.infoSection.diffText}</p>
              </div>

              <div>
                <h5 className="font-heading font-bold text-slate-800 dark:text-slate-200 text-[11px] uppercase tracking-wide mb-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 dark:bg-amber-400"></span>
                  {t.bottom.infoSection.aprHeading}
                </h5>
                <p>{t.bottom.infoSection.aprText}</p>
              </div>

              <div>
                <h5 className="font-heading font-bold text-slate-800 dark:text-slate-200 text-[11px] uppercase tracking-wide mb-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-600 dark:bg-purple-400"></span>
                  {t.bottom.infoSection.dtiHeading}
                </h5>
                <p>{t.bottom.infoSection.dtiText}</p>
              </div>

              <div>
                <h5 className="font-heading font-bold text-slate-800 dark:text-slate-200 text-[11px] uppercase tracking-wide mb-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600 dark:bg-rose-400"></span>
                  {t.bottom.infoSection.currencyHeading}
                </h5>
                <p>{t.bottom.infoSection.currencyText}</p>
              </div>
            </div>
          )}
        </div>

        {/* Card 2: Частые вопросы */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/85 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs transition-colors">
          <button
            type="button"
            onClick={() => setOpenFaq(!openFaq)}
            className="w-full flex items-center justify-between text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-heading text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {t.bottom.faqTabTitle}
                </h4>
                <p className="font-body text-[11px] text-slate-400 dark:text-slate-500">
                  {t.bottom.faqTabSubtitle}
                </p>
              </div>
            </div>
            <div className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  openFaq ? "rotate-180 text-blue-600 dark:text-blue-400" : ""
                }`}
              />
            </div>
          </button>

          {openFaq && (
            <div className="mt-3.5 pt-3.5 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs animate-in fade-in duration-150">
              {t.bottom.faqItems.map((item, idx) => {
                const isOpen = activeFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-800/40 transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveFaqIndex(isOpen ? null : idx)}
                      className="w-full p-2.5 text-left flex items-start justify-between gap-2 hover:bg-slate-100/70 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <span className="font-heading font-semibold text-slate-800 dark:text-slate-200 text-[11px] leading-snug">
                        {item.q}
                      </span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5 transition-transform duration-150 ${
                          isOpen ? "rotate-180 text-blue-600 dark:text-blue-400" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-3 pb-3 text-[11px] text-slate-700 dark:text-slate-200 font-body leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-2 bg-white dark:bg-slate-900/80">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Card 3: Советы заёмщикам */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/85 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs transition-colors">
          <button
            type="button"
            onClick={() => setOpenTips(!openTips)}
            className="w-full flex items-center justify-between text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <Lightbulb className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-heading text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {t.bottom.tipsTabTitle}
                </h4>
                <p className="font-body text-[11px] text-slate-400 dark:text-slate-500">
                  {t.bottom.tipsTabSubtitle}
                </p>
              </div>
            </div>
            <div className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  openTips ? "rotate-180 text-emerald-600 dark:text-emerald-400" : ""
                }`}
              />
            </div>
          </button>

          {openTips && (
            <div className="mt-3.5 pt-3.5 border-t border-slate-100 dark:border-slate-800 space-y-2.5 text-xs font-body text-slate-600 dark:text-slate-300 animate-in fade-in duration-150">
              <div className="bg-slate-50/70 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                <p className="font-heading font-bold text-slate-800 dark:text-slate-200 text-[11px] mb-1">
                  1. {t.bottom.tipsSection.tip1Title}
                </p>
                <p className="text-[11px] leading-relaxed">{t.bottom.tipsSection.tip1Desc}</p>
              </div>

              <div className="bg-slate-50/70 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                <p className="font-heading font-bold text-slate-800 dark:text-slate-200 text-[11px] mb-1">
                  2. {t.bottom.tipsSection.tip2Title}
                </p>
                <p className="text-[11px] leading-relaxed">{t.bottom.tipsSection.tip2Desc}</p>
              </div>

              <div className="bg-slate-50/70 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                <p className="font-heading font-bold text-slate-800 dark:text-slate-200 text-[11px] mb-1">
                  3. {t.bottom.tipsSection.tip3Title}
                </p>
                <p className="text-[11px] leading-relaxed">{t.bottom.tipsSection.tip3Desc}</p>
              </div>

              <div className="bg-slate-50/70 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                <p className="font-heading font-bold text-slate-800 dark:text-slate-200 text-[11px] mb-1">
                  4. {t.bottom.tipsSection.tip4Title}
                </p>
                <p className="text-[11px] leading-relaxed">{t.bottom.tipsSection.tip4Desc}</p>
              </div>

              <div className="bg-slate-50/70 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                <p className="font-heading font-bold text-slate-800 dark:text-slate-200 text-[11px] mb-1">
                  5. {t.bottom.tipsSection.tip5Title}
                </p>
                <p className="text-[11px] leading-relaxed">{t.bottom.tipsSection.tip5Desc}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
