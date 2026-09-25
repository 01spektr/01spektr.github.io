/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import { CalculationInput, CalculationBreakdown, HistoryItem, HsCodeItem } from "./types";
import { HS_CODES_DATABASE, DEFAULT_EXCHANGE_RATE } from "./data/customsData";
import { calculateCustoms } from "./utils/calculator";
import { getIndicativeDefaults } from "./utils/indicativePrices";
import { Breadcrumbs } from "./components/Breadcrumbs";
import { PageHeader } from "./components/PageHeader";
import { CalculatorForm } from "./components/CalculatorForm";
import { CalculationResult } from "./components/CalculationResult";
import { BottomGrid } from "./components/BottomGrid";
import { DisclaimerBanner } from "./components/DisclaimerBanner";
import { SearchModal, HistoryModal, RateModal, RelatedToolModal } from "./components/Modals";
import { LanguageProvider } from "./context/LanguageContext";
import { useI18n } from "@/lib/i18n";
import { recordHistory } from "@/lib/tools/history";
import "./customs-calculator.css";

export default function CustomsCalculatorPage() {
  const { locale } = useI18n();
  return (
    <LanguageProvider language={locale}>
      <CustomsApp />
    </LanguageProvider>
  );
}

function CustomsApp() {
  // Exchange rate
  const [exchangeRate, setExchangeRate] = useState<number>(DEFAULT_EXCHANGE_RATE);

  // Initial input matching the screenshot exactly
  const [input, setInput] = useState<CalculationInput>({
    operationType: "import",
    declarantType: "legal",
    individualTransportType: "air",
    hsCode: HS_CODES_DATABASE[0], // 8517 12 000 0 Телефоны сотовые (смартфоны)
    originCountry: "CN", // Китай
    departureCountry: "CN", // Китай
    destinationCountry: "UZ", // Узбекистан
    unitPriceUSD: 100,
    goodsCostUSD: 1000,
    quantity: 10,
    unit: "шт.",
    unitWeightKg: 1.5,
    grossWeightKg: 15,
    weightUnit: "кг",
    deliveryCostUSD: 150,
    insuranceCostUSD: 50,
  });

  // Calculate result reactively
  const result: CalculationBreakdown = useMemo(() => {
    return calculateCustoms(input, exchangeRate);
  }, [input, exchangeRate]);

  // History state
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: "init-1",
      date: "15.09.2026",
      productName: "Телефоны сотовые (смартфоны)",
      hsCode: "8517 12 000 0",
      totalUZS: 18562400,
      totalUSD: 1468,
      input: {
        operationType: "import",
        declarantType: "legal",
        individualTransportType: "air",
        hsCode: HS_CODES_DATABASE[0],
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
      },
    },
  ]);

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [activeRelatedTool, setActiveRelatedTool] = useState<
    "shipping" | "volumetric" | "currency" | null
  >(null);
  // Global Ctrl + K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleInputChange = (updated: Partial<CalculationInput>) => {
    setInput((prev) => {
      // Check if destination country changed
      if (updated.destinationCountry && updated.destinationCountry !== prev.destinationCountry) {
        if (updated.destinationCountry === "UZ") {
          // When destination country is switched back to 'UZ' (Uzbekistan),
          // automatically reset input state to use the 'hsCode' selection flow (справочник товаров)
          // instead of manual entry mode.
          return {
            ...prev,
            ...updated,
            isManualProduct: false,
            manualProductName: undefined,
            manualHsCode: undefined,
            hsCode: prev.hsCode || HS_CODES_DATABASE[0],
            customDutyRate: undefined,
            customVatRate: undefined,
          };
        } else {
          // Non-UZ country: enable manual entry mode
          return {
            ...prev,
            ...updated,
            isManualProduct: true,
            manualProductName: prev.manualProductName || prev.hsCode?.name,
            manualHsCode: prev.manualHsCode || prev.hsCode?.code,
          };
        }
      }

      return { ...prev, ...updated };
    });
  };

  const handleCalculate = () => {
    // Add to history
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString("ru-RU"),
      productName: input.hsCode.name,
      hsCode: input.hsCode.code,
      totalUZS: result.totalPayableUZS,
      totalUSD: result.totalPayableUSD,
      input: { ...input },
    };
    setHistory((prev) => [newItem, ...prev.filter((h) => h.hsCode !== newItem.hsCode)]);
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
    const indicative = getIndicativeDefaults(item, input.declarantType, input.quantity);
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

  const handleRefreshRate = () => {
    // Flashes a notification or simulated rate check
    setExchangeRate(12650);
  };

  return (
    <div className="customs-calculator-page text-slate-900 dark:text-slate-100 selection:bg-blue-100 dark:selection:bg-blue-900 selection:text-blue-900 dark:selection:text-blue-100 transition-colors duration-200">
      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto py-3 sm:py-6">
        {/* Breadcrumb Trail */}
        <Breadcrumbs />

        {/* Page Title & Feature Badges */}
        <PageHeader />

        {/* 2-Column Primary Calculator Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-stretch">
          {/* Column 1: Step 1 Goods details form */}
          <div className="h-full">
            <CalculatorForm
              input={input}
              onChange={handleInputChange}
              onCalculate={handleCalculate}
            />
          </div>

          {/* Column 2: Step 2 Calculation result & breakdown */}
          <div className="h-full">
            <CalculationResult
              result={result}
              input={input}
              onRefreshRate={handleRefreshRate}
              onOpenRateModal={() => setIsRateModalOpen(true)}
            />
          </div>
        </div>

        {/* 4 Bottom Informational & Tool Cards */}
        <BottomGrid onOpenRelatedTool={(tool) => setActiveRelatedTool(tool)} />

        {/* Bottom Legal / Disclaimer Warning Banner */}
        <DisclaimerBanner />
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

      <RelatedToolModal toolType={activeRelatedTool} onClose={() => setActiveRelatedTool(null)} />
    </div>
  );
}
