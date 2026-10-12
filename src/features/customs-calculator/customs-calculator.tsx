/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import {
  CalculationInput,
  CalculationBreakdown,
  HistoryItem,
  HsCodeItem,
} from "./types";
import { HS_CODES_DATABASE, DEFAULT_EXCHANGE_RATE } from "./data/customsData";
import { calculateCustoms } from "./utils/calculator";
import { getIndicativeDefaults } from "./utils/indicativePrices";
import { HeroBanner } from "./components/HeroBanner";
import { CustomsMetricsCards } from "./components/CustomsMetricsCards";
import { CalculatorForm } from "./components/CalculatorForm";
import { CalculationResult } from "./components/CalculationResult";
import { BottomGrid } from "./components/BottomGrid";
import { DisclaimerBanner } from "./components/DisclaimerBanner";
import {
  SearchModal,
  HistoryModal,
  RateModal,
  RelatedToolModal,
} from "./components/Modals";
import { LanguageProvider, useTranslation } from "./context/LanguageContext";
import { useI18n } from "@/lib/i18n";
import { isFavorite, toggleFavorite } from "@/lib/tools/favorites";
import { recordHistory } from "@/lib/tools/history";
import { buildShareUrl, shareUrl } from "@/lib/tools/share";
import {
  Calculator,
  BarChart3,
  BookOpen,
  HelpCircle,
  LayoutGrid,
  Layers,
  ArrowRight,
} from "lucide-react";
import "./customs-calculator.css";

const DEFAULT_INPUT: CalculationInput = {
  operationType: "import",
  declarantType: "legal",
  individualTransportType: "air",
  hsCode: HS_CODES_DATABASE[0], // 8517 12 000 0 Телефоны сотовые (смартфоны)
  originCountry: "CN",
  departureCountry: "CN",
  destinationCountry: "UZ",
  unitPriceUSD: 100,
  goodsCostUSD: 1000,
  quantity: 10,
  unit: "шт.",
  unitWeightKg: 1.5,
  grossWeightKg: 15,
  weightUnit: "кг",
  deliveryCostUSD: 150,
  insuranceCostUSD: 50,
};

export default function CustomsCalculatorPage() {
  const { locale } = useI18n();
  return (
    <LanguageProvider language={locale}>
      <CustomsApp />
    </LanguageProvider>
  );
}

function CustomsApp() {
  const { t, language } = useTranslation();

  // Exchange rate
  const [exchangeRate, setExchangeRate] = useState<number>(DEFAULT_EXCHANGE_RATE);

  // Form input state
  const [input, setInput] = useState<CalculationInput>(() => {
    if (typeof window !== "undefined" && window.location.search) {
      const search = new URLSearchParams(window.location.search);
      const code = search.get("code");
      const cost = Number(search.get("cost"));
      const qty = Number(search.get("qty"));
      const origin = search.get("origin");
      const dest = search.get("dest");
      const declarant = search.get("declarant") as any;

      const foundHs = code
        ? HS_CODES_DATABASE.find(
            (h) => h.code.replace(/\s+/g, "") === code.replace(/\s+/g, "")
          )
        : null;

      return {
        ...DEFAULT_INPUT,
        hsCode: foundHs || DEFAULT_INPUT.hsCode,
        goodsCostUSD: !isNaN(cost) && cost > 0 ? cost : DEFAULT_INPUT.goodsCostUSD,
        quantity: !isNaN(qty) && qty > 0 ? qty : DEFAULT_INPUT.quantity,
        originCountry: origin || DEFAULT_INPUT.originCountry,
        destinationCountry: dest || DEFAULT_INPUT.destinationCountry,
        declarantType:
          declarant === "individual" ? "individual" : DEFAULT_INPUT.declarantType,
      };
    }
    return DEFAULT_INPUT;
  });

  // Calculate result reactively
  const result: CalculationBreakdown = useMemo(() => {
    return calculateCustoms(input, exchangeRate);
  }, [input, exchangeRate]);

  // History state
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("toolboxi_customs_history_v2");
        if (stored) return JSON.parse(stored);
      } catch {
        // fallback
      }
    }
    return [
      {
        id: "init-1",
        date: "15.09.2026",
        productName: "Телефоны сотовые (смартфоны)",
        hsCode: "8517 12 000 0",
        totalUZS: 18562400,
        totalUSD: 1468,
        input: { ...DEFAULT_INPUT },
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem("toolboxi_customs_history_v2", JSON.stringify(history));
    } catch {
      // ignore
    }
  }, [history]);

  // Favorite state
  const [favorite, setFavorite] = useState(false);
  useEffect(() => {
    setFavorite(isFavorite("customs-calculator"));
  }, []);

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [activeRelatedTool, setActiveRelatedTool] = useState<
    "shipping" | "volumetric" | "currency" | null
  >(null);

  // Mobile navigation state matching loan-calculator
  const [mobileTab, setMobileTab] = useState<"calc" | "result" | "info">("calc");
  const [mobileViewMode, setMobileViewMode] = useState<"tabs" | "all">("tabs");

  // Global Ctrl + K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleInputChange = (updated: Partial<CalculationInput>) => {
    setInput((prev) => {
      if (
        (updated.unitPriceUSD !== undefined || updated.quantity !== undefined) &&
        updated.goodsCostUSD === undefined
      ) {
        const p = updated.unitPriceUSD ?? prev.unitPriceUSD;
        const q = updated.quantity ?? prev.quantity;
        return {
          ...prev,
          ...updated,
          goodsCostUSD: Number((p * q).toFixed(2)),
        };
      }
      return { ...prev, ...updated };
    });
  };

  const handleReset = () => {
    setInput(DEFAULT_INPUT);
  };

  const handleCalculate = () => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(
        language === "uz" ? "uz-UZ" : language === "en" ? "en-US" : "ru-RU"
      ),
      productName: input.hsCode.name,
      hsCode: input.hsCode.code,
      totalUZS: result.totalPayableUZS,
      totalUSD: result.totalPayableUSD,
      input: { ...input },
    };

    setHistory((prev) => [
      newItem,
      ...prev.filter((h) => h.hsCode !== newItem.hsCode).slice(0, 19),
    ]);

    recordHistory({
      toolId: "customs-calculator",
      title: `${newItem.productName} · ${newItem.totalUSD.toLocaleString()} USD`,
      params: {
        hsCode: newItem.hsCode,
        destination: input.destinationCountry,
        declarant: input.declarantType,
      },
    });

    // Smoothly scroll to results on small screens
    const resultElem = document.getElementById("calculation-result-card");
    if (resultElem && window.innerWidth < 1024) {
      resultElem.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleRestoreHistory = (item: HistoryItem) => {
    setInput(item.input);
  };

  const handleSelectCodeFromSearch = (item: HsCodeItem) => {
    const indicative = getIndicativeDefaults(
      item,
      input.declarantType,
      input.quantity
    );
    const isUzbekistan = input.destinationCountry === "UZ";
    setInput((prev) => ({
      ...prev,
      isManualProduct: !isUzbekistan,
      manualProductName: !isUzbekistan ? item.name : prev.manualProductName,
      manualHsCode: !isUzbekistan ? item.code : prev.manualHsCode,
      hsCode: item,
      unit: item.measurementUnit || indicative.unit || prev.unit,
      unitPriceUSD: indicative.unitPriceUSD,
      goodsCostUSD: indicative.typicalPriceUSD,
      unitWeightKg: indicative.unitWeightKg,
      grossWeightKg: indicative.typicalWeightKg,
      deliveryCostUSD: indicative.typicalDeliveryUSD,
      insuranceCostUSD: indicative.typicalInsuranceUSD,
    }));
  };

  const handleShare = async () => {
    const params = new URLSearchParams();
    if (input.hsCode?.code) {
      params.set("code", input.hsCode.code.replace(/\s+/g, ""));
    }
    if (input.goodsCostUSD) {
      params.set("cost", String(input.goodsCostUSD));
    }
    if (input.quantity) {
      params.set("qty", String(input.quantity));
    }
    if (input.destinationCountry) {
      params.set("dest", input.destinationCountry);
    }
    if (input.declarantType) {
      params.set("declarant", input.declarantType);
    }

    await shareUrl(
      buildShareUrl("/tools/customs-calculator", params),
      t("pageHeader.title") || "Таможенный калькулятор Узбекистана"
    );
  };

  const mobileLabels = {
    ru: {
      tabCalc: "Параметры",
      tabResult: "Результат",
      tabInfo: "Справка и FAQ",
      viewModeTabs: "Режим вкладок",
      viewModeAll: "Показать все блоки",
      editParams: "Параметры груза",
      viewResult: "Посмотреть расчёт",
      totalCustoms: "Таможенные платежи",
    },
    uz: {
      tabCalc: "Parametrlar",
      tabResult: "Natija",
      tabInfo: "Ma’lumot va FAQ",
      viewModeTabs: "Vkladkalar",
      viewModeAll: "Barcha bloklar",
      editParams: "Yuk parametrlari",
      viewResult: "Natijani ko‘rish",
      totalCustoms: "Bojxona to‘lovlari",
    },
    en: {
      tabCalc: "Goods Data",
      tabResult: "Breakdown",
      tabInfo: "Guide & FAQ",
      viewModeTabs: "Tab view",
      viewModeAll: "Show all blocks",
      editParams: "Edit shipment",
      viewResult: "View calculation",
      totalCustoms: "Total customs fees",
    },
  }[language] || {
    tabCalc: "Goods Data",
    tabResult: "Breakdown",
    tabInfo: "Guide & FAQ",
    viewModeTabs: "Tab view",
    viewModeAll: "Show all blocks",
    editParams: "Edit shipment",
    viewResult: "View calculation",
    totalCustoms: "Total customs fees",
  };

  return (
    <div className="customs-calculator-page text-slate-900 dark:text-slate-100 selection:bg-blue-100 dark:selection:bg-blue-900 selection:text-blue-900 dark:selection:text-blue-100 transition-colors duration-200">
      {/* Standardized Benchmark Container matching loan-calculator */}
      <main className="max-w-[1380px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-6">
        {/* Unified HeroBanner */}
        <HeroBanner
          historyCount={history.length}
          isFavorite={favorite}
          onToggleFavorite={() => setFavorite(toggleFavorite("customs-calculator"))}
          onOpenHistory={() => setIsHistoryOpen(true)}
          onShare={handleShare}
        />

        {/* 3 Metric Summary Cards with quick reset and copy action */}
        <CustomsMetricsCards
          result={result}
          input={input}
          exchangeRate={exchangeRate}
          onRefreshRate={() => setIsRateModalOpen(true)}
          onReset={handleReset}
        />

        {/* Mobile Navigation Header & View Mode Switcher (< 1024px) */}
        <div className="lg:hidden mb-4 space-y-2">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-1 shadow-2xs flex items-center justify-between gap-1">
            <div className="flex-1 grid grid-cols-3 gap-0.5 sm:gap-1 min-w-0">
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
                <Calculator className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate leading-none">{mobileLabels.tabCalc}</span>
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
                <BarChart3 className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate leading-none">{mobileLabels.tabResult}</span>
              </button>

              {/* Tab 3: Info */}
              <button
                type="button"
                onClick={() => setMobileTab("info")}
                className={`min-w-0 py-1.5 sm:py-2 px-0.5 sm:px-1 rounded-xl text-[11px] sm:text-xs font-heading font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  mobileTab === "info" && mobileViewMode === "tabs"
                    ? "bg-blue-600 text-white shadow-2xs font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate leading-none">{mobileLabels.tabInfo}</span>
              </button>
            </div>

            {/* View Mode Toggle: Tabs vs All Blocks */}
            <button
              type="button"
              onClick={() =>
                setMobileViewMode(mobileViewMode === "tabs" ? "all" : "tabs")
              }
              title={
                mobileViewMode === "tabs"
                  ? mobileLabels.viewModeAll
                  : mobileLabels.viewModeTabs
              }
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

        {/* Mobile View Content (< 1024px) */}
        <div className="lg:hidden">
          {mobileViewMode === "tabs" ? (
            <div className="space-y-4">
              {/* Tab: Calculator */}
              {mobileTab === "calc" && (
                <div className="space-y-3.5 animate-in fade-in duration-200">
                  <CalculatorForm
                    input={input}
                    onChange={handleInputChange}
                    onCalculate={handleCalculate}
                  />

                  {/* Mobile Quick CTA Card */}
                  <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-md flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <span className="text-[11px] text-blue-100 uppercase tracking-wider font-semibold block truncate">
                        {mobileLabels.totalCustoms}
                      </span>
                      <span className="text-lg sm:text-xl font-black font-heading tracking-tight truncate block">
                        {result.totalPayableUZS.toLocaleString("ru-RU")} UZS
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
                      <span>{mobileLabels.viewResult}</span>
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
                      <span>← {mobileLabels.editParams}</span>
                    </button>
                  </div>

                  <CalculationResult
                    result={result}
                    input={input}
                    onRefreshRate={() => setIsRateModalOpen(true)}
                    onOpenRateModal={() => setIsRateModalOpen(true)}
                  />
                </div>
              )}

              {/* Tab: Info & FAQ */}
              {mobileTab === "info" && (
                <div className="animate-in fade-in duration-200 space-y-4">
                  <BottomGrid
                    onOpenRelatedTool={(tool) => setActiveRelatedTool(tool)}
                  />
                  <DisclaimerBanner />
                </div>
              )}
            </div>
          ) : (
            /* Continuous all blocks on mobile */
            <div className="space-y-5 animate-in fade-in duration-200">
              <CalculatorForm
                input={input}
                onChange={handleInputChange}
                onCalculate={handleCalculate}
              />
              <div id="calculation-result-card">
                <CalculationResult
                  result={result}
                  input={input}
                  onRefreshRate={() => setIsRateModalOpen(true)}
                  onOpenRateModal={() => setIsRateModalOpen(true)}
                />
              </div>
              <BottomGrid
                onOpenRelatedTool={(tool) => setActiveRelatedTool(tool)}
              />
              <DisclaimerBanner />
            </div>
          )}
        </div>

        {/* Desktop Layout (>= 1024px) */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-6 items-stretch">
          {/* Column 1: Step 1 Goods details form */}
          <div className="h-full">
            <CalculatorForm
              input={input}
              onChange={handleInputChange}
              onCalculate={handleCalculate}
            />
          </div>

          {/* Column 2: Step 2 Calculation result & breakdown */}
          <div className="h-full" id="calculation-result-card">
            <CalculationResult
              result={result}
              input={input}
              onRefreshRate={() => setIsRateModalOpen(true)}
              onOpenRateModal={() => setIsRateModalOpen(true)}
            />
          </div>
        </div>

        {/* Desktop Bottom Cards & Legal Banner */}
        <div className="hidden lg:block mt-6 space-y-4">
          <BottomGrid onOpenRelatedTool={(tool) => setActiveRelatedTool(tool)} />
          <DisclaimerBanner />
        </div>
      </main>

      {/* Modals & Overlays */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectCode={handleSelectCodeFromSearch}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectHistory={handleRestoreHistory}
        onClearHistory={() => setHistory([])}
      />

      <RateModal
        isOpen={isRateModalOpen}
        onClose={() => setIsRateModalOpen(false)}
        currentRate={exchangeRate}
        onSaveRate={(rate) => setExchangeRate(rate)}
      />

      <RelatedToolModal
        toolType={activeRelatedTool}
        onClose={() => setActiveRelatedTool(null)}
      />
    </div>
  );
}
