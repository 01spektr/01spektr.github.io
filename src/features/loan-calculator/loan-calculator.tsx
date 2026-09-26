/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from "react";
import { LoanParams, Currency, ComparisonScenario, PaymentType, ExampleLoanItem } from "./types";
import { calculateLoan, formatCurrencyNumber } from "./utils/loanCalculations";
import { HeroBanner } from "./components/HeroBanner";
import { CalculatorForm } from "./components/CalculatorForm";
import { ResultPane } from "./components/ResultPane";
import { RightSidebar } from "./components/RightSidebar";
import { BottomCards } from "./components/BottomCards";
import { HistoryModal } from "./components/HistoryModal";
import { PDFExportModal } from "./components/PDFExportModal";
import { useLanguage } from "./context/LanguageContext";
import {
  Calculator,
  BarChart3,
  Car,
  HelpCircle,
  ArrowRight,
  LayoutGrid,
  Layers,
  FileText,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { recordHistory } from "@/lib/tools/history";
import { isFavorite, toggleFavorite } from "@/lib/tools/favorites";
import { buildShareUrl, shareUrl } from "@/lib/tools/share";
import "./loan-calculator.css";

const DEFAULT_PARAMS: LoanParams = {
  amount: 50000,
  termMonths: 36,
  interestRate: 6.8,
  paymentType: "annuity",
  downPayment: 0,
  oneTimeFees: 0,
  annualInsurance: 0,
  currency: "$",
  roundToInteger: true,
  purpose: "",
  notes: "",
};

export function LoanCalculatorPage() {
  const { t, language } = useLanguage();
  const [params, setParams] = useState<LoanParams>(() => {
    if (typeof window !== "undefined" && window.location.search) {
      const search = new URLSearchParams(window.location.search);
      const amount = Number(search.get("amount"));
      const term = Number(search.get("term"));
      const rate = Number(search.get("rate"));
      const type = search.get("type") as PaymentType;
      const cur = search.get("currency") as Currency;

      return {
        ...DEFAULT_PARAMS,
        amount: !isNaN(amount) && amount > 0 ? amount : DEFAULT_PARAMS.amount,
        termMonths: !isNaN(term) && term > 0 ? term : DEFAULT_PARAMS.termMonths,
        interestRate: !isNaN(rate) && rate > 0 ? rate : DEFAULT_PARAMS.interestRate,
        paymentType: type === "differentiated" ? "differentiated" : "annuity",
        currency: cur || DEFAULT_PARAMS.currency,
      };
    }
    return DEFAULT_PARAMS;
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isPDFOpen, setIsPDFOpen] = useState(false);
  const [isSiteFavorite, setIsSiteFavorite] = useState(false);

  // Mobile navigation state
  const [mobileTab, setMobileTab] = useState<"calc" | "result" | "rates" | "info">("calc");
  const [mobileViewMode, setMobileViewMode] = useState<"tabs" | "all">("tabs");

  useEffect(() => setIsSiteFavorite(isFavorite("loan-calculator")), []);

  // Global history
  const [history, setHistory] = useState<ComparisonScenario[]>(() => {
    try {
      const stored = localStorage.getItem("toolboxi_loan_history_v2");
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return [
      {
        id: "1",
        name: "Mortgage 30Y (USA)",
        date: "24.09.2026",
        params: {
          ...DEFAULT_PARAMS,
          amount: 250000,
          termMonths: 360,
          interestRate: 6.8,
          currency: "$",
        },
        result: calculateLoan({
          ...DEFAULT_PARAMS,
          amount: 250000,
          termMonths: 360,
          interestRate: 6.8,
          currency: "$",
        }),
      },
      {
        id: "2",
        name: "Auto Loan (Germany)",
        date: "23.09.2026",
        params: {
          ...DEFAULT_PARAMS,
          amount: 35000,
          termMonths: 48,
          interestRate: 4.9,
          currency: "€",
        },
        result: calculateLoan({
          ...DEFAULT_PARAMS,
          amount: 35000,
          termMonths: 48,
          interestRate: 4.9,
          currency: "€",
        }),
      },
      {
        id: "3",
        name: "Personal Loan (UK)",
        date: "22.09.2026",
        params: {
          ...DEFAULT_PARAMS,
          amount: 15000,
          termMonths: 24,
          interestRate: 5.5,
          currency: "$",
        },
        result: calculateLoan({
          ...DEFAULT_PARAMS,
          amount: 15000,
          termMonths: 24,
          interestRate: 5.5,
          currency: "$",
        }),
      },
      {
        id: "4",
        name: "Isteʼmol krediti 100 mln (UZ)",
        date: "20.09.2026",
        params: {
          ...DEFAULT_PARAMS,
          amount: 100000000,
          termMonths: 36,
          interestRate: 19.5,
          currency: "сум",
        },
        result: calculateLoan({
          ...DEFAULT_PARAMS,
          amount: 100000000,
          termMonths: 36,
          interestRate: 19.5,
          currency: "сум",
        }),
      },
      {
        id: "5",
        name: "Ипотека 5 млн (RU)",
        date: "18.09.2026",
        params: {
          ...DEFAULT_PARAMS,
          amount: 5000000,
          termMonths: 180,
          interestRate: 19.0,
          currency: "₽",
        },
        result: calculateLoan({
          ...DEFAULT_PARAMS,
          amount: 5000000,
          termMonths: 180,
          interestRate: 19.0,
          currency: "₽",
        }),
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem("toolboxi_loan_history_v2", JSON.stringify(history));
    } catch {
      // ignore
    }
  }, [history]);

  // Recalculate
  const result = useMemo(() => {
    return calculateLoan(params);
  }, [params]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleParamChange = (updated: Partial<LoanParams>) => {
    setParams((prev) => ({ ...prev, ...updated }));
  };

  const handleReset = () => {
    setParams(DEFAULT_PARAMS);
    showToast(t.toasts.paramsReset);
  };

  const handleCalculate = () => {
    const localeDateStr = language === "ru" ? "ru-RU" : language === "uz" ? "uz-UZ" : "en-US";
    const fallbackName = `${t.result.detailsTitle}: ${formatCurrencyNumber(params.amount)} ${params.currency}`;
    const newRecord: ComparisonScenario = {
      id: Date.now().toString(),
      name: params.purpose || fallbackName,
      date: new Date().toLocaleDateString(localeDateStr),
      params: { ...params },
      result,
    };

    setHistory((prev) => [newRecord, ...prev.slice(0, 19)]);
    recordHistory({
      toolId: "loan-calculator",
      title: `${formatCurrencyNumber(params.amount)} ${params.currency} · ${params.interestRate}%`,
      params: {
        amount: String(params.amount),
        term: String(params.termMonths),
        rate: String(params.interestRate),
        type: params.paymentType,
        currency: params.currency,
      },
    });
    showToast(t.toasts.calcSaved);

    if (window.innerWidth < 1024) {
      setMobileTab("result");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleCopySummary = () => {
    const pTypeStr = params.paymentType === "annuity" ? t.result.annuityFull : t.result.diffFull;
    const summaryText =
      `Toolboxi.uz - ${t.result.title}:\n` +
      `${t.result.loanAmount}: ${formatCurrencyNumber(params.amount)} ${params.currency}\n` +
      `${t.result.loanTerm}: ${params.termMonths} ${t.result.monthsWord}\n` +
      `${t.result.ratePerAnnum}: ${params.interestRate}%\n` +
      `${t.result.paymentType}: ${pTypeStr}\n` +
      `${t.result.monthlyPayment}: ${formatCurrencyNumber(result.monthlyPayment)} ${params.currency}\n` +
      `${t.result.overpayment}: ${formatCurrencyNumber(result.overpayment)} ${params.currency}\n` +
      `${t.result.totalToRepay}: ${formatCurrencyNumber(result.totalPayment)} ${params.currency}`;

    navigator.clipboard.writeText(summaryText);
    showToast(t.toasts.copiedClipboard);
  };

  const handleShare = async () => {
    const query = new URLSearchParams({
      amount: String(params.amount),
      term: String(params.termMonths),
      rate: String(params.interestRate),
      type: params.paymentType,
      currency: params.currency,
    });
    const status = await shareUrl(buildShareUrl("/tools/loan-calculator", query), t.hero.title);
    if (status === "copied" || status === "shared") {
      toast.success(t.toasts.copiedClipboard);
    }
  };

  const handleSelectRate = (rate: number) => {
    handleParamChange({ interestRate: rate });
    showToast(`${t.toasts.rateSet}: ${rate}%`);
  };

  const handleSelectExample = (ex: ExampleLoanItem) => {
    const chosenName =
      language === "en" && ex.nameEn
        ? ex.nameEn
        : language === "uz" && ex.nameUz
          ? ex.nameUz
          : ex.name;

    handleParamChange({
      amount: ex.amount,
      termMonths: ex.termMonths,
      interestRate: ex.rate,
      purpose: chosenName,
      currency: ex.currency,
    });
    showToast(`${t.toasts.exampleLoaded}: «${chosenName}»`);
  };

  const handleLoadHistory = (item: ComparisonScenario) => {
    setParams(item.params);
    showToast(`${t.toasts.historyLoaded}: «${item.name}»`);
  };

  const handleDeleteHistory = (id: string) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
  };

  const handleClearHistory = () => {
    setHistory([]);
    showToast(t.toasts.historyCleared);
  };

  const handleScrollToRates = () => {
    if (window.innerWidth < 1024) {
      setMobileTab("rates");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      document.getElementById("sidebar-rates")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="new-loan-page text-slate-800 dark:text-slate-100 font-body transition-colors duration-200">
      {/* Main Container */}
      <section className="max-w-[1440px] w-full mx-auto pb-24 lg:pb-8">
        {/* 2. Sleek Global Hero Banner */}
        <HeroBanner
          historyCount={history.length}
          onOpenHistory={() => setIsHistoryOpen(true)}
          onToggleFavorite={() => setIsSiteFavorite(toggleFavorite("loan-calculator"))}
          onShare={handleShare}
          isFavorite={isSiteFavorite}
        />

        {/* Mobile Navigation Header & View Mode Switcher (< 1024px) */}
        <div className="lg:hidden mb-4 space-y-2">
          {/* Mobile Tab Switcher */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-1 shadow-2xs flex items-center justify-between gap-1">
            <div className="flex-1 grid grid-cols-4 gap-0.5 sm:gap-1 min-w-0">
              {/* Tab 1: Calc */}
              <button
                type="button"
                onClick={() => setMobileTab("calc")}
                className={`min-w-0 py-1.5 sm:py-2 px-0.5 sm:px-1 rounded-xl text-[11px] sm:text-xs font-heading font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  mobileTab === "calc" && mobileViewMode === "tabs"
                    ? "bg-blue-600 text-white shadow-2xs font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                }`}
              >
                <Calculator className="w-3 h-3 shrink-0" />
                <span className="truncate leading-none">{t.mobile.tabCalc}</span>
              </button>

              {/* Tab 2: Result */}
              <button
                type="button"
                onClick={() => setMobileTab("result")}
                className={`min-w-0 py-1.5 sm:py-2 px-0.5 sm:px-1 rounded-xl text-[11px] sm:text-xs font-heading font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  mobileTab === "result" && mobileViewMode === "tabs"
                    ? "bg-blue-600 text-white shadow-2xs font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                }`}
              >
                <BarChart3 className="w-3 h-3 shrink-0" />
                <span className="truncate leading-none">{t.mobile.tabResult}</span>
              </button>

              {/* Tab 3: Rates */}
              <button
                type="button"
                onClick={() => setMobileTab("rates")}
                className={`min-w-0 py-1.5 sm:py-2 px-0.5 sm:px-1 rounded-xl text-[11px] sm:text-xs font-heading font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  mobileTab === "rates" && mobileViewMode === "tabs"
                    ? "bg-blue-600 text-white shadow-2xs font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                }`}
              >
                <Car className="w-3 h-3 shrink-0" />
                <span className="truncate leading-none">{t.mobile.tabRates}</span>
              </button>

              {/* Tab 4: Info */}
              <button
                type="button"
                onClick={() => setMobileTab("info")}
                className={`min-w-0 py-1.5 sm:py-2 px-0.5 sm:px-1 rounded-xl text-[11px] sm:text-xs font-heading font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  mobileTab === "info" && mobileViewMode === "tabs"
                    ? "bg-blue-600 text-white shadow-2xs font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                }`}
              >
                <HelpCircle className="w-3 h-3 shrink-0" />
                <span className="truncate leading-none">{t.mobile.tabInfo}</span>
              </button>
            </div>

            {/* View Mode Toggle: Tabs vs All Blocks */}
            <button
              type="button"
              onClick={() => setMobileViewMode(mobileViewMode === "tabs" ? "all" : "tabs")}
              title={mobileViewMode === "tabs" ? t.mobile.viewModeAll : t.mobile.viewModeTabs}
              className={`p-1.5 rounded-lg text-xs transition-colors shrink-0 cursor-pointer ${
                mobileViewMode === "all"
                  ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60"
                  : "text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              {mobileViewMode === "all" ? (
                <Layers className="w-3.5 h-3.5" />
              ) : (
                <LayoutGrid className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* 3A. Mobile Tabs Content View (when mobileViewMode === 'tabs' on mobile) */}
        <div className="lg:hidden">
          {mobileViewMode === "tabs" ? (
            <div className="space-y-4">
              {/* Tab: Calculator */}
              {mobileTab === "calc" && (
                <div className="space-y-3.5 animate-in fade-in duration-200">
                  <CalculatorForm
                    params={params}
                    onChange={handleParamChange}
                    onReset={handleReset}
                    onCalculate={handleCalculate}
                    onScrollToRates={handleScrollToRates}
                  />

                  {/* Mobile Quick CTA Card at bottom of Calculator */}
                  <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-md flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[11px] text-blue-100 uppercase tracking-wider font-semibold block">
                        {t.result.monthlyPayment}
                      </span>
                      <span className="text-xl font-black font-heading tracking-tight">
                        {formatCurrencyNumber(result.monthlyPayment, params.roundToInteger)}{" "}
                        {params.currency}
                        {t.mobile.monthlyPaymentShort}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileTab("result");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="px-3.5 py-2 bg-white text-blue-700 rounded-xl font-heading font-bold text-xs shadow-xs hover:bg-blue-50 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <span>{t.mobile.viewResult}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Tab: Result */}
              {mobileTab === "result" && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setMobileTab("calc");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors shadow-2xs cursor-pointer"
                    >
                      <span>← {t.mobile.editParams}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setMobileTab("rates");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      <Car className="w-3.5 h-3.5" />
                      <span>{t.mobile.tabRates} →</span>
                    </button>
                  </div>

                  <ResultPane
                    params={params}
                    result={result}
                    currency={params.currency}
                    onCopyAll={handleCopySummary}
                    onExportPDF={() => setIsPDFOpen(true)}
                  />
                </div>
              )}

              {/* Tab: World Rates (Авто в фокусе) */}
              {mobileTab === "rates" && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  {/* Notice banner: Auto is active */}
                  <div className="bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-900/60 rounded-xl p-3 flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                        <Car className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-heading font-bold text-slate-900 dark:text-slate-100 block">
                          {t.mobile.autoRatesFirstNotice}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {t.rates.description}
                        </span>
                      </div>
                    </div>
                  </div>

                  <RightSidebar
                    currentRate={params.interestRate}
                    currency={params.currency}
                    onSelectRate={handleSelectRate}
                    onSelectExample={handleSelectExample}
                  />
                </div>
              )}

              {/* Tab: Info & FAQ */}
              {mobileTab === "info" && (
                <div className="animate-in fade-in duration-200">
                  <BottomCards />
                </div>
              )}
            </div>
          ) : (
            /* Continuous all blocks stacked on mobile */
            <div className="space-y-5 animate-in fade-in duration-200">
              <CalculatorForm
                params={params}
                onChange={handleParamChange}
                onReset={handleReset}
                onCalculate={handleCalculate}
                onScrollToRates={handleScrollToRates}
              />
              <div id="result-pane-anchor">
                <ResultPane
                  params={params}
                  result={result}
                  currency={params.currency}
                  onCopyAll={handleCopySummary}
                  onExportPDF={() => setIsPDFOpen(true)}
                />
              </div>
              <RightSidebar
                currentRate={params.interestRate}
                currency={params.currency}
                onSelectRate={handleSelectRate}
                onSelectExample={handleSelectExample}
              />
              <BottomCards />
            </div>
          )}
        </div>

        {/* 3B. Desktop Three-Column Layout (>= 1024px) */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-5 items-start">
          {/* Column 1: Input Form with Range Sliders (4 cols ~ 33%) */}
          <div className="lg:col-span-4 w-full">
            <CalculatorForm
              params={params}
              onChange={handleParamChange}
              onReset={handleReset}
              onCalculate={handleCalculate}
              onScrollToRates={handleScrollToRates}
            />
          </div>

          {/* Column 2: Results Pane (5 cols ~ 42%) */}
          <div id="result-pane-anchor" className="lg:col-span-5 w-full">
            <ResultPane
              params={params}
              result={result}
              currency={params.currency}
              onCopyAll={handleCopySummary}
              onExportPDF={() => setIsPDFOpen(true)}
            />
          </div>

          {/* Column 3: Sidebar with SVG Flags & Global Rates (3 cols ~ 25%) */}
          <div className="lg:col-span-3 w-full">
            <RightSidebar
              currentRate={params.interestRate}
              currency={params.currency}
              onSelectRate={handleSelectRate}
              onSelectExample={handleSelectExample}
            />
          </div>
        </div>

        {/* 4. Desktop Independent Bottom Cards (>= 1024px) */}
        <div className="hidden lg:block mt-6">
          <BottomCards />
        </div>
      </section>

      {/* Mobile Sticky Bottom Action Dock (fixed on mobile < 1024px) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/90 dark:border-slate-800 shadow-2xl px-3 py-2 pb-safe">
        <div className="max-w-md mx-auto flex items-center justify-between gap-2">
          {/* Left: Monthly Payment Live Badge */}
          <div
            onClick={() => {
              setMobileTab("result");
              setMobileViewMode("tabs");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex flex-col cursor-pointer pr-2.5 border-r border-slate-200 dark:border-slate-800 group"
          >
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium leading-none">
              {t.result.monthlyPayment}
            </span>
            <span className="font-heading font-black text-sm sm:text-base text-blue-600 dark:text-blue-400 leading-tight mt-0.5 group-hover:underline">
              {formatCurrencyNumber(result.monthlyPayment, params.roundToInteger)} {params.currency}
            </span>
          </div>

          {/* Right: Quick Tab Action Buttons */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => {
                setMobileTab("calc");
                setMobileViewMode("tabs");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`flex flex-col items-center justify-center px-2 py-1 rounded-xl transition-colors cursor-pointer ${
                mobileTab === "calc" && mobileViewMode === "tabs"
                  ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span className="text-[9px] font-heading font-semibold mt-0.5">
                {t.mobile.tabCalc}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMobileTab("result");
                setMobileViewMode("tabs");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`flex flex-col items-center justify-center px-2 py-1 rounded-xl transition-colors cursor-pointer ${
                mobileTab === "result" && mobileViewMode === "tabs"
                  ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="text-[9px] font-heading font-semibold mt-0.5">
                {t.mobile.tabResult}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMobileTab("rates");
                setMobileViewMode("tabs");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`flex flex-col items-center justify-center px-2 py-1 rounded-xl transition-colors cursor-pointer ${
                mobileTab === "rates" && mobileViewMode === "tabs"
                  ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <Car className="w-4 h-4" />
              <span className="text-[9px] font-heading font-semibold mt-0.5">
                {t.mobile.tabRates}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIsPDFOpen(true)}
              className="flex flex-col items-center justify-center px-2 py-1 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4 text-rose-500" />
              <span className="text-[9px] font-heading font-semibold mt-0.5">PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl backdrop-blur-xs flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onLoad={handleLoadHistory}
        onDelete={handleDeleteHistory}
        onClearAll={handleClearHistory}
      />

      {/* PDF Export Modal */}
      <PDFExportModal
        isOpen={isPDFOpen}
        onClose={() => setIsPDFOpen(false)}
        params={params}
        result={result}
        currency={params.currency}
      />
    </div>
  );
}
