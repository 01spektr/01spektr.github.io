import React, { useState } from "react";
import {
  Layers,
  Wrench,
  HelpCircle,
  ChevronRight,
  ChevronDown,
  Truck,
  Box,
  Coins,
  ArrowRight,
  ExternalLink,
  Lightbulb,
} from "lucide-react";
import { INFLUENCING_FACTORS, FAQ_ITEMS } from "../data/customsData";
import { useTranslation } from "../context/LanguageContext";

interface BottomGridProps {
  onOpenRelatedTool: (toolType: "shipping" | "volumetric" | "currency") => void;
}

export const BottomGrid: React.FC<BottomGridProps> = ({ onOpenRelatedTool }) => {
  const { t } = useTranslation();
  const [openFactorIndex, setOpenFactorIndex] = useState<number | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // All 4 cards collapsed by default as requested
  const [openCards, setOpenCards] = useState<{
    howItWorks: boolean;
    factors: boolean;
    tools: boolean;
    faq: boolean;
  }>({
    howItWorks: false,
    factors: false,
    tools: false,
    faq: false,
  });

  const toggleCard = (cardKey: keyof typeof openCards) => {
    setOpenCards((prev) => ({
      ...prev,
      [cardKey]: !prev[cardKey],
    }));
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const toggleFactor = (index: number) => {
    setOpenFactorIndex(openFactorIndex === index ? null : index);
  };

  const steps =
    (t("bottomGrid.steps", []) as Array<{ step: number; title: string; desc: string }>) || [];
  const factors = t("bottomGrid.factorsList", INFLUENCING_FACTORS) as Array<{
    id: string;
    title: string;
    badge: string;
    desc: string;
  }>;
  const faqList = t("bottomGrid.faqList", FAQ_ITEMS) as Array<{ question: string; answer: string }>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 items-start gap-3.5 sm:gap-5 pt-4 sm:pt-6">
      {/* Card 1: Как это работает? */}
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs transition-all duration-200 overflow-hidden"
        id="card-how-it-works"
      >
        <button
          type="button"
          onClick={() => toggleCard("howItWorks")}
          className="w-full flex items-center justify-between p-3.5 sm:p-5 text-left cursor-pointer group hover:bg-slate-50/60 dark:hover:bg-slate-800/60 transition-colors"
          aria-expanded={openCards.howItWorks}
        >
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-7 h-7 rounded-xl bg-[#eef6ff] dark:bg-blue-950/60 text-[#0066FF] dark:text-blue-400 flex items-center justify-center shrink-0">
              <Lightbulb className="w-4 h-4 text-[#0066FF] dark:text-blue-400 stroke-[2.2]" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-[14.5px] sm:text-[16px] tracking-tight group-hover:text-[#0066FF] dark:group-hover:text-blue-400 transition-colors truncate">
              {t("bottomGrid.howItWorks")}
            </h3>
          </div>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:text-[#0066FF] dark:group-hover:text-blue-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/60 transition-all shrink-0">
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 stroke-[2] ${
                openCards.howItWorks ? "rotate-180 text-[#0066FF] dark:text-blue-400" : ""
              }`}
            />
          </div>
        </button>

        {openCards.howItWorks && (
          <div className="px-3.5 pb-4 sm:px-5 sm:pb-6 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3.5 sm:space-y-4 animate-in fade-in duration-200">
            {steps.map((s) => (
              <div key={s.step} className="flex items-start gap-2.5 sm:gap-3">
                <span className="w-5 h-5 rounded-md bg-[#eef6ff] dark:bg-blue-950/60 text-[#0066FF] dark:text-blue-400 border border-blue-100/90 dark:border-blue-900 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {s.step}
                </span>
                <div className="min-w-0">
                  <div className="text-[12px] sm:text-[12.5px] font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                    {s.title}
                  </div>
                  <p className="text-[11px] sm:text-[11.5px] text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Card 2: Что влияет на сумму? */}
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs transition-all duration-200 overflow-hidden"
        id="card-influencing-factors"
      >
        <button
          type="button"
          onClick={() => toggleCard("factors")}
          className="w-full flex items-center justify-between p-3.5 sm:p-5 text-left cursor-pointer group hover:bg-slate-50/60 dark:hover:bg-slate-800/60 transition-colors"
          aria-expanded={openCards.factors}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#0066FF] dark:text-blue-400 flex items-center justify-center shrink-0">
              <Layers className="w-4 h-4 text-[#0066FF] dark:text-blue-400 stroke-[2.2]" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-[14.5px] sm:text-[16px] tracking-tight group-hover:text-[#0066FF] dark:group-hover:text-blue-400 transition-colors truncate">
              {t("bottomGrid.factors")}
            </h3>
          </div>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:text-[#0066FF] dark:group-hover:text-blue-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/60 transition-all shrink-0">
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 stroke-[2] ${
                openCards.factors ? "rotate-180 text-[#0066FF] dark:text-blue-400" : ""
              }`}
            />
          </div>
        </button>

        {openCards.factors && (
          <div className="px-3.5 pb-4 sm:px-5 sm:pb-6 pt-1 border-t border-slate-100 dark:border-slate-800 animate-in fade-in duration-200">
            <div className="flex justify-end pb-2 pt-1">
              <button
                type="button"
                onClick={() => setOpenFactorIndex(openFactorIndex === null ? 0 : null)}
                className="inline-flex items-center gap-1 text-[11px] sm:text-[11.5px] font-medium text-[#0066FF] dark:text-blue-400 hover:underline cursor-pointer"
              >
                <span>
                  {openFactorIndex === null
                    ? t("bottomGrid.expandFirstFactor")
                    : t("bottomGrid.collapseFactors")}
                </span>
                <span className="text-xs">→</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {factors.map((factor, index) => {
                const isOpen = openFactorIndex === index;
                return (
                  <div key={factor.id} className="py-2.5">
                    <button
                      type="button"
                      onClick={() => toggleFactor(index)}
                      className="w-full flex items-center justify-between text-left gap-2 text-[12px] sm:text-[12.5px] font-medium text-slate-800 dark:text-slate-200 hover:text-[#0066FF] dark:hover:text-blue-400 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-2 min-w-0 pr-1">
                        <span className="leading-snug truncate">{factor.title}</span>
                        {factor.badge && (
                          <span className="text-[10px] bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded font-medium shrink-0 border border-blue-100 dark:border-blue-900 hidden sm:inline">
                            {factor.badge}
                          </span>
                        )}
                      </div>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0 transition-transform stroke-[1.8] ${
                          isOpen ? "rotate-180 text-[#0066FF] dark:text-blue-400" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="mt-2 text-[11px] sm:text-[11.5px] text-slate-600 dark:text-slate-300 leading-relaxed bg-[#f8fafc] dark:bg-slate-800/70 p-2.5 rounded-lg border border-slate-100 dark:border-slate-700/80">
                        {factor.badge && (
                          <div className="sm:hidden mb-1.5">
                            <span className="text-[10px] bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded font-medium border border-blue-100 dark:border-blue-900">
                              {factor.badge}
                            </span>
                          </div>
                        )}
                        {factor.desc}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Card 3: Связанные инструменты */}
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs transition-all duration-200 overflow-hidden"
        id="card-related-tools"
      >
        <button
          type="button"
          onClick={() => toggleCard("tools")}
          className="w-full flex items-center justify-between p-3.5 sm:p-5 text-left cursor-pointer group hover:bg-slate-50/60 dark:hover:bg-slate-800/60 transition-colors"
          aria-expanded={openCards.tools}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#0066FF] dark:text-blue-400 flex items-center justify-center shrink-0">
              <Wrench className="w-4 h-4 text-[#0066FF] dark:text-blue-400 stroke-[2.2]" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-[14.5px] sm:text-[16px] tracking-tight group-hover:text-[#0066FF] dark:group-hover:text-blue-400 transition-colors truncate">
              {t("bottomGrid.tools")}
            </h3>
          </div>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:text-[#0066FF] dark:group-hover:text-blue-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/60 transition-all shrink-0">
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 stroke-[2] ${
                openCards.tools ? "rotate-180 text-[#0066FF] dark:text-blue-400" : ""
              }`}
            />
          </div>
        </button>

        {openCards.tools && (
          <div className="px-3.5 pb-3.5 sm:px-5 sm:pb-5 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5 animate-in fade-in duration-200">
            {/* Tool 1 */}
            <button
              type="button"
              onClick={() => onOpenRelatedTool("shipping")}
              className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors text-left group cursor-pointer"
            >
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#eef6ff] dark:bg-blue-950/60 text-[#0066FF] dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4 stroke-[2]" />
                </div>
                <div className="min-w-0">
                  <div className="text-[12.5px] sm:text-[13px] font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#0066FF] dark:group-hover:text-blue-400 transition-colors leading-tight truncate">
                    {t("bottomGrid.shippingCalc")}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate leading-tight mt-0.5">
                    {t("bottomGrid.shippingCalcDesc")}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-[#0066FF] dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 stroke-[1.8]" />
            </button>

            {/* Tool 2 */}
            <button
              type="button"
              onClick={() => onOpenRelatedTool("volumetric")}
              className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors text-left group cursor-pointer"
            >
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#eef6ff] dark:bg-blue-950/60 text-[#0066FF] dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Box className="w-4 h-4 stroke-[2]" />
                </div>
                <div className="min-w-0">
                  <div className="text-[12.5px] sm:text-[13px] font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#0066FF] dark:group-hover:text-blue-400 transition-colors leading-tight truncate">
                    {t("bottomGrid.volumetricWeight")}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate leading-tight mt-0.5">
                    {t("bottomGrid.volumetricWeightDesc")}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-[#0066FF] dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 stroke-[1.8]" />
            </button>

            {/* Tool 3: Курсы валют / Конвертер */}
            <a
              href="https://toolboxi.uz/tools/currency-rates"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors text-left group cursor-pointer"
              id="tool-link-currency-rates"
              title={t("bottomGrid.currencyRates")}
            >
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#eef6ff] dark:bg-blue-950/60 text-[#0066FF] dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Coins className="w-4 h-4 stroke-[2]" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12.5px] sm:text-[13px] font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#0066FF] dark:group-hover:text-blue-400 transition-colors leading-tight truncate">
                      {t("bottomGrid.currencyRates")}
                    </span>
                    <ExternalLink className="w-3 h-3 text-slate-400 dark:text-slate-500 group-hover:text-[#0066FF] dark:group-hover:text-blue-400 shrink-0" />
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate leading-tight mt-0.5">
                    toolboxi.uz/tools/currency-rates
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-[#0066FF] dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 stroke-[1.8]" />
            </a>
          </div>
        )}
      </div>

      {/* Card 4: Частые вопросы */}
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs transition-all duration-200 overflow-hidden"
        id="card-frequently-asked-questions"
      >
        <button
          type="button"
          onClick={() => toggleCard("faq")}
          className="w-full flex items-center justify-between p-3.5 sm:p-5 text-left cursor-pointer group hover:bg-slate-50/60 dark:hover:bg-slate-800/60 transition-colors"
          aria-expanded={openCards.faq}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#0066FF] dark:text-blue-400 flex items-center justify-center shrink-0">
              <HelpCircle className="w-4 h-4 text-[#0066FF] dark:text-blue-400 stroke-[2.2]" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-[14.5px] sm:text-[16px] tracking-tight group-hover:text-[#0066FF] dark:group-hover:text-blue-400 transition-colors truncate">
              {t("bottomGrid.faq")}
            </h3>
          </div>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:text-[#0066FF] dark:group-hover:text-blue-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/60 transition-all shrink-0">
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 stroke-[2] ${
                openCards.faq ? "rotate-180 text-[#0066FF] dark:text-blue-400" : ""
              }`}
            />
          </div>
        </button>

        {openCards.faq && (
          <div className="px-3.5 pb-4 sm:px-5 sm:pb-6 pt-1 border-t border-slate-100 dark:border-slate-800 animate-in fade-in duration-200">
            <div className="flex justify-end pb-2 pt-1">
              <button
                type="button"
                onClick={() => setOpenFaqIndex(openFaqIndex === null ? 0 : null)}
                className="inline-flex items-center gap-1 text-[11px] sm:text-[11.5px] font-medium text-[#0066FF] dark:text-blue-400 hover:underline cursor-pointer"
              >
                <span>
                  {openFaqIndex === null
                    ? t("bottomGrid.expandFirstAnswer")
                    : t("bottomGrid.collapseAnswers")}
                </span>
                <span className="text-xs">→</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {faqList.map((item, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div key={item.question} className="py-2.5">
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      className="w-full flex items-center justify-between text-left gap-2 text-[12px] sm:text-[12.5px] font-medium text-slate-800 dark:text-slate-200 hover:text-[#0066FF] dark:hover:text-blue-400 transition-colors cursor-pointer group"
                    >
                      <span className="leading-snug truncate pr-1">{item.question}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0 transition-transform stroke-[1.8] ${
                          isOpen ? "rotate-180 text-[#0066FF] dark:text-blue-400" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="mt-2 text-[11px] sm:text-[11.5px] text-slate-600 dark:text-slate-300 leading-relaxed bg-[#f8fafc] dark:bg-slate-800/70 p-2.5 rounded-lg border border-slate-100 dark:border-slate-700/80">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
