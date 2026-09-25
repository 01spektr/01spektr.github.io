import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Search,
  X,
  Calculator,
  Info,
  ChevronDown,
  Check,
  RefreshCw,
  Sparkles,
  Building2,
  User,
  Plane,
  Package,
  Car,
  Train,
  Edit3,
  Sliders,
  Globe,
} from "lucide-react";
import { CalculationInput, HsCodeItem, DeclarantType, IndividualTransportType } from "../types";
import { COUNTRIES } from "../data/customsData";
import { searchAllHsCodes } from "../data/hsDatabase";
import { getIndicativeDefaults } from "../utils/indicativePrices";
import { getIndividualDutyFreeLimits } from "../utils/calculator";
import { CountryFlag } from "./CountryFlag";
import { getCountryProfile } from "../utils/countryProfiles";
import { useTranslation } from "../context/LanguageContext";

interface CalculatorFormProps {
  input: CalculationInput;
  onChange: (updated: Partial<CalculationInput>) => void;
  onCalculate: () => void;
}

export const CalculatorForm: React.FC<CalculatorFormProps> = ({ input, onChange, onCalculate }) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isManualMode, setIsManualMode] = useState(Boolean(input.isManualProduct));
  const [indicativeInfo, setIndicativeInfo] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLocalizedProductName = useMemo(() => {
    if (input.hsCode?.code) {
      const cleanCode = input.hsCode.code.replace(/\s+/g, "");
      const translated = t(`goods.${cleanCode}`);
      if (translated && translated !== `goods.${cleanCode}`) {
        return translated;
      }
    }
    return input.hsCode?.name || t("calculator.defaultProductName");
  }, [input.hsCode, t]);

  // Sync internal isManualMode with input.isManualProduct from parent state
  useEffect(() => {
    setIsManualMode(Boolean(input.isManualProduct));
  }, [input.isManualProduct]);

  const isUzbekistan = input.destinationCountry === "UZ";
  const effectiveManualMode = !isUzbekistan || isManualMode;
  const destProfile = useMemo(
    () => getCountryProfile(input.destinationCountry),
    [input.destinationCountry],
  );

  // Справочник товаров и база ТН ВЭД активны по умолчанию для Республики Узбекистан.
  // Для других стран форма переключается на ввод по инвойсу.
  // При возврате в Узбекистан автоматически восстанавливаем Справочник товаров.
  const prevDestCountryRef = useRef(input.destinationCountry);

  useEffect(() => {
    const prevCountry = prevDestCountryRef.current;
    prevDestCountryRef.current = input.destinationCountry;

    if (!isUzbekistan) {
      if (!isManualMode) {
        setIsManualMode(true);
      }
      if (!input.isManualProduct) {
        onChange({
          isManualProduct: true,
          manualProductName: input.manualProductName || input.hsCode?.name,
          manualHsCode: input.manualHsCode || input.hsCode?.code,
        });
      }
    } else if (prevCountry !== "UZ") {
      setIsManualMode(false);
      onChange({
        isManualProduct: false,
      });
    }
  }, [isUzbekistan, input.destinationCountry]);

  const currentIndicative = useMemo(() => {
    return getIndicativeDefaults(input.hsCode, input.declarantType, input.quantity);
  }, [input.hsCode, input.declarantType, input.quantity]);

  const handleCalculateClick = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
      onCalculate();
    }, 280);
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search across all 97 chapters and comprehensive HS codes
  const filteredCodes = useMemo(() => {
    return searchAllHsCodes(isUserTyping ? searchQuery : "");
  }, [isUserTyping, searchQuery]);

  const handleSelectCode = (item: HsCodeItem) => {
    const indicative = getIndicativeDefaults(item, input.declarantType, input.quantity);
    onChange({
      hsCode: item,
      unitPriceUSD: indicative.unitPriceUSD,
      goodsCostUSD: indicative.typicalPriceUSD,
      quantity: indicative.typicalQuantity,
      unit: item.measurementUnit || indicative.unit,
      unitWeightKg: indicative.unitWeightKg,
      grossWeightKg: indicative.typicalWeightKg,
      weightUnit: indicative.weightUnit,
      deliveryCostUSD: indicative.typicalDeliveryUSD,
      insuranceCostUSD: indicative.typicalInsuranceUSD,
      isManualProduct: false,
      manualProductName: undefined,
      manualHsCode: undefined,
    });
    setSearchQuery("");
    setIsUserTyping(false);
    setIsDropdownOpen(false);
    setIndicativeInfo(indicative.sourceNote || "Индикативные параметры применены автоматически");
  };

  const handleUnitPriceChange = (price: number) => {
    const safePrice = Math.max(0, price || 0);
    const newTotal = Math.round(safePrice * (input.quantity || 1) * 100) / 100;
    onChange({
      unitPriceUSD: safePrice,
      goodsCostUSD: newTotal,
    });
  };

  const handleQuantityChange = (qty: number) => {
    const safeQty = Math.max(1, qty || 1);
    const unitPrice =
      input.unitPriceUSD ?? (input.goodsCostUSD ? input.goodsCostUSD / (input.quantity || 1) : 100);
    const newTotal = Math.round(unitPrice * safeQty * 100) / 100;

    const unitW =
      input.unitWeightKg ??
      (input.grossWeightKg ? input.grossWeightKg / (input.quantity || 1) : 1.5);
    const newGrossW = Math.round(unitW * safeQty * 100) / 100;

    onChange({
      quantity: safeQty,
      goodsCostUSD: newTotal,
      grossWeightKg: newGrossW,
    });
  };

  const handleTotalGoodsCostChange = (total: number) => {
    const safeTotal = Math.max(0, total || 0);
    const derivedUnitPrice = input.quantity
      ? Math.round((safeTotal / input.quantity) * 100) / 100
      : safeTotal;
    onChange({
      goodsCostUSD: safeTotal,
      unitPriceUSD: derivedUnitPrice,
    });
  };

  const handleGrossWeightChange = (weight: number) => {
    const safeW = Math.max(0, weight || 0);
    const derivedUnitW = input.quantity ? Math.round((safeW / input.quantity) * 100) / 100 : safeW;
    onChange({
      grossWeightKg: safeW,
      unitWeightKg: derivedUnitW,
    });
  };

  const handleResetToIndicative = () => {
    const indicative = getIndicativeDefaults(input.hsCode, input.declarantType, input.quantity);
    onChange({
      unitPriceUSD: indicative.unitPriceUSD,
      goodsCostUSD: indicative.typicalPriceUSD,
      quantity: indicative.typicalQuantity,
      unit: indicative.unit,
      unitWeightKg: indicative.unitWeightKg,
      grossWeightKg: indicative.typicalWeightKg,
      weightUnit: indicative.weightUnit,
      deliveryCostUSD: indicative.typicalDeliveryUSD,
      insuranceCostUSD: indicative.typicalInsuranceUSD,
    });
    setIndicativeInfo(indicative.sourceNote || "Значения возвращены к индикативным");
  };

  const handleDeclarantTypeChange = (type: DeclarantType) => {
    const isInd = type === "individual";
    const targetQty = isInd ? 1 : 10;
    const indicative = getIndicativeDefaults(input.hsCode, type, targetQty);
    onChange({
      declarantType: type,
      individualTransportType:
        type === "individual" ? input.individualTransportType || "air" : undefined,
      quantity: indicative.typicalQuantity,
      unitPriceUSD: indicative.unitPriceUSD,
      goodsCostUSD: indicative.typicalPriceUSD,
      unitWeightKg: indicative.unitWeightKg,
      grossWeightKg: indicative.typicalWeightKg,
      deliveryCostUSD: indicative.typicalDeliveryUSD,
      insuranceCostUSD: indicative.typicalInsuranceUSD,
    });
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setIsUserTyping(false);
    setIsDropdownOpen(true);
  };

  const dutyLimits = getIndividualDutyFreeLimits(
    input.individualTransportType || "air",
    input.destinationCountry,
  );
  const isIndividual = input.declarantType === "individual";

  return (
    <div
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs p-4 sm:p-6 flex flex-col h-full transition-colors"
      id="calculator-input-card"
    >
      {/* Step 1 Header & Mode Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-xl bg-[#eef6ff] dark:bg-blue-950/60 text-[#0066FF] dark:text-blue-400 border border-blue-100 dark:border-blue-900 font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
            1
          </div>
          <div>
            <h2 className="text-base sm:text-[19px] font-bold text-slate-900 dark:text-white tracking-tight">
              {t("calculator.step1Title")}
            </h2>
            <p className="text-[11.5px] font-secondary text-slate-500 dark:text-slate-400">
              {t("calculator.step1Subtitle")}
            </p>
          </div>
        </div>

        {/* Import / Export Tabs */}
        <div className="flex items-center bg-slate-100/90 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700 text-xs font-semibold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => onChange({ operationType: "import" })}
            className={`px-3.5 sm:px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
              input.operationType === "import"
                ? "bg-[#0066FF] dark:bg-blue-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
            id="tab-import"
          >
            {t("calculator.import")}
          </button>
          <button
            type="button"
            onClick={() => onChange({ operationType: "export" })}
            className={`px-3.5 sm:px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
              input.operationType === "export"
                ? "bg-[#0066FF] dark:bg-blue-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
            id="tab-export"
          >
            {t("calculator.export")}
          </button>
        </div>
      </div>

      {/* Declarant Type Selector: Юридическое лицо vs Физическое лицо */}
      <div className="pt-3 pb-2">
        <label className="block text-[12px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          {t("calculator.declarantStatus")}
        </label>
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleDeclarantTypeChange("legal")}
            className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-[13px] font-semibold transition-all cursor-pointer ${
              !isIndividual
                ? "bg-blue-50/80 dark:bg-blue-950/50 border-[#0066FF] dark:border-blue-500 text-[#0066FF] dark:text-blue-400 shadow-2xs ring-1 ring-[#0066FF]/20"
                : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750"
            }`}
            id="btn-declarant-legal"
          >
            <Building2 className="w-4 h-4 shrink-0" />
            <span className="truncate">{t("calculator.legalEntity")}</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-blue-100/60 dark:bg-blue-900/60 rounded text-blue-700 dark:text-blue-300 hidden sm:inline shrink-0">
              {t("calculator.gtdWholesale")}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleDeclarantTypeChange("individual")}
            className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-[13px] font-semibold transition-all cursor-pointer ${
              isIndividual
                ? "bg-blue-50/80 dark:bg-blue-950/50 border-[#0066FF] dark:border-blue-500 text-[#0066FF] dark:text-blue-400 shadow-2xs ring-1 ring-[#0066FF]/20"
                : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750"
            }`}
            id="btn-declarant-individual"
          >
            <User className="w-4 h-4 shrink-0" />
            <span className="truncate">{t("calculator.individual")}</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-emerald-100/70 dark:bg-emerald-950/70 rounded text-emerald-800 dark:text-emerald-300 hidden sm:inline shrink-0">
              {t("calculator.personalImport")}
            </span>
          </button>
        </div>

        {/* Transport channel for individual */}
        {isIndividual &&
          input.operationType === "import" &&
          (isUzbekistan ? (
            <div className="mt-2.5 p-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 rounded-xl">
              <div className="flex flex-wrap items-center justify-between text-[11.5px] font-medium text-slate-600 dark:text-slate-400 mb-1.5 gap-1">
                <span>{t("calculator.transportMethod")}</span>
                <span className="font-bold text-[#0066FF] dark:text-blue-400">
                  {t("calculator.upTo")} ${dutyLimits.limitUSD.toLocaleString()} (
                  {dutyLimits.limitKg} {t("common.kg")}) — 0%
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {[
                  { id: "air", label: t("calculator.air"), limit: "$2 000", icon: Plane },
                  { id: "post", label: t("calculator.post"), limit: "$1 000", icon: Package },
                  { id: "auto", label: t("calculator.auto"), limit: "$300", icon: Car },
                  { id: "rail", label: t("calculator.rail"), limit: "$1 000", icon: Train },
                ].map((m) => {
                  const isSelected = (input.individualTransportType || "air") === m.id;
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() =>
                        onChange({ individualTransportType: m.id as IndividualTransportType })
                      }
                      className={`px-2 py-1.5 rounded-lg border text-left text-[11px] sm:text-[11.5px] font-medium transition-all flex items-center justify-between gap-1 cursor-pointer min-w-0 ${
                        isSelected
                          ? "bg-white dark:bg-slate-800 border-[#0066FF] dark:border-blue-500 text-[#0066FF] dark:text-blue-400 shadow-2xs font-semibold ring-1 ring-blue-400/20"
                          : "bg-transparent border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 min-w-0 truncate">
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{m.label}</span>
                      </div>
                      <span className="text-[10px] font-bold shrink-0">{m.limit}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="mt-2.5 px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 rounded-xl flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400 font-medium">
                {t("calculator.dutyFreeLimitLabel")}
              </span>
              <span className="font-bold text-[#0066FF] dark:text-blue-400">
                {t("calculator.upTo")} ${dutyLimits.limitUSD.toLocaleString()} ({dutyLimits.limitKg}{" "}
                {t("common.kg")}) — 0%
              </span>
            </div>
          ))}
      </div>

      <div className="pt-2 space-y-3.5 flex-1">
        {/* HS Code Selection Header with Switcher: Catalog vs Manual Entry */}
        <div className="relative" ref={dropdownRef}>
          <div className="flex flex-wrap items-center justify-between gap-2 text-[12px] font-medium text-slate-600 dark:text-slate-300 mb-1.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="truncate">{t("calculator.productCodeOrName")}</span>
              {input.destinationCountry !== "UZ" && (
                <span className="text-[10px] bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded font-medium border border-blue-100 dark:border-blue-900 hidden sm:inline">
                  {t("calculator.hsCodeWco")}
                </span>
              )}
            </div>

            {/* Mode Switcher: Catalog Search vs Manual Entry */}
            {isUzbekistan ? (
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-[11px]">
                <button
                  type="button"
                  onClick={() => {
                    setIsManualMode(false);
                    onChange({ isManualProduct: false });
                  }}
                  className={`px-2.5 py-0.5 rounded-md font-medium transition-all cursor-pointer ${
                    !effectiveManualMode
                      ? "bg-white dark:bg-slate-700 text-[#0066FF] dark:text-blue-400 shadow-2xs font-semibold"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                  title={t("calculator.catalogButton")}
                >
                  {t("calculator.catalogButton")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsManualMode(true);
                    onChange({
                      isManualProduct: true,
                      manualProductName: input.manualProductName || input.hsCode?.name,
                      manualHsCode: input.manualHsCode || input.hsCode?.code,
                    });
                  }}
                  className={`px-2.5 py-0.5 rounded-md font-medium transition-all cursor-pointer ${
                    effectiveManualMode
                      ? "bg-white dark:bg-slate-700 text-[#0066FF] dark:text-blue-400 shadow-2xs font-semibold"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                  title={t("calculator.manualButton")}
                >
                  {t("calculator.manualButton")}
                </button>
              </div>
            ) : (
              <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-md">
                {t("calculator.manualInvoiceBadge")}
              </span>
            )}
          </div>

          {!effectiveManualMode ? (
            <>
              {/* Catalog Search Input */}
              <div className="relative flex items-center bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 shadow-2xs focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-[#0066FF] dark:focus-within:border-blue-500 transition-all">
                <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 mr-2.5 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsUserTyping(true);
                    setIsDropdownOpen(true);
                  }}
                  onFocus={() => {
                    setIsDropdownOpen(true);
                  }}
                  onClick={() => {
                    setIsDropdownOpen(true);
                  }}
                  placeholder={
                    isUserTyping || searchQuery
                      ? t("calculator.searchPlaceholder")
                      : `${input.hsCode.code} — ${currentLocalizedProductName}`
                  }
                  className="w-full bg-transparent text-sm font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
                  id="input-hs-search"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded cursor-pointer shrink-0 ml-1"
                    id="btn-clear-hs-search"
                    title={t("common.close")}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="text-slate-400 hover:text-[#0066FF] dark:hover:text-blue-400 p-0.5 ml-1 rounded cursor-pointer shrink-0"
                  title={t("common.tools")}
                >
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180 text-[#0066FF] dark:text-blue-400" : ""
                    }`}
                  />
                </button>
              </div>

              {/* Autocomplete List */}
              {isDropdownOpen && (
                <div
                  className="mt-1.5 bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden divide-y divide-slate-100 dark:divide-slate-700/80 max-h-[285px] overflow-y-auto z-30"
                  id="hs-dropdown-list"
                >
                  {filteredCodes.length > 0 ? (
                    <>
                      <div className="px-3.5 py-1.5 bg-slate-50/90 dark:bg-slate-750 text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center justify-between border-b border-slate-100 dark:border-slate-700 sticky top-0 z-10">
                        <span>
                          {t("calculator.foundProducts")} {filteredCodes.length}
                        </span>
                        <span className="text-[10px] text-blue-600 dark:text-blue-400 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> {t("calculator.autoSuggest")}
                        </span>
                      </div>
                      {filteredCodes.map((item) => {
                        const isSelected = input.hsCode.code === item.code;
                        const itemCleanCode = item.code.replace(/\s+/g, "");
                        const itemDisplayName = t(`goods.${itemCleanCode}`, item.name);
                        return (
                          <button
                            key={item.code}
                            type="button"
                            onClick={() => handleSelectCode(item)}
                            className={`w-full text-left px-3.5 sm:px-4 py-2.5 hover:bg-slate-50/90 dark:hover:bg-slate-700/60 transition-colors flex items-center justify-between gap-3 sm:gap-4 cursor-pointer group ${
                              isSelected ? "bg-blue-50/50 dark:bg-blue-950/40" : ""
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 min-w-0 flex-1">
                              <span className="font-bold text-[13px] sm:text-[13.5px] text-slate-900 dark:text-slate-100 group-hover:text-[#0066FF] dark:group-hover:text-blue-400 tracking-tight shrink-0 font-mono">
                                {item.code}
                              </span>
                              <span className="text-[12.5px] sm:text-[13px] text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white truncate flex-1">
                                {itemDisplayName}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 group-hover:text-slate-600 hidden sm:inline">
                                {item.dutyRate}% {t("calculator.dutyShort")}
                              </span>
                              {isSelected && (
                                <span className="text-[11px] font-semibold text-[#0066FF] dark:text-blue-400 bg-blue-100/70 dark:bg-blue-900/60 px-2 py-0.5 rounded-md flex items-center gap-1">
                                  <Check className="w-3 h-3 stroke-[2.5]" />
                                  {t("calculator.selected")}
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </>
                  ) : (
                    <div className="p-4 text-center text-slate-500 dark:text-slate-400 text-xs">
                      {t("calculator.nothingFound")} «{searchQuery}».
                      <div className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
                        {t("calculator.tryManual")}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            /* Manual Entry Mode: User enters own description & HS code */
            <div className="p-3.5 bg-slate-50/90 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700 rounded-xl space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t("calculator.manualProductNameLabel")}
                  </label>
                  <input
                    type="text"
                    value={input.manualProductName ?? currentLocalizedProductName}
                    onChange={(e) => {
                      const newName = e.target.value;
                      onChange({
                        manualProductName: newName,
                        hsCode: {
                          ...input.hsCode,
                          name: newName || t("calculator.defaultProductName"),
                        },
                      });
                    }}
                    placeholder={t("calculator.manualProductNamePlaceholder")}
                    className="w-full h-10 bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 rounded-xl px-3 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#0066FF] dark:focus:border-blue-500"
                    id="input-manual-product-name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t("calculator.manualHsCodeLabel")}
                  </label>
                  <input
                    type="text"
                    value={input.manualHsCode ?? input.hsCode?.code ?? ""}
                    onChange={(e) => {
                      const newCode = e.target.value;
                      onChange({
                        manualHsCode: newCode,
                        hsCode: { ...input.hsCode, code: newCode || "0000 00 000 0" },
                      });
                    }}
                    placeholder={t("calculator.manualHsCodePlaceholder")}
                    className="w-full h-10 bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 rounded-xl px-3 text-sm font-mono font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#0066FF] dark:focus:border-blue-500"
                    id="input-manual-hs-code"
                  />
                </div>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal space-y-1">
                <p className="text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-750 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700 text-[11px] leading-relaxed">
                  🌐 <strong>{t("calculator.manualHintTitle")}:</strong>{" "}
                  {t("calculator.manualHint")}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Indicative Auto-fill Notification Banner (shown only in catalog mode for UZ) */}
        {!effectiveManualMode && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3.5 py-2.5 bg-blue-50/70 dark:bg-blue-950/50 border border-blue-200/70 dark:border-blue-900/60 rounded-xl text-xs shadow-2xs">
            <div className="flex items-center gap-2 min-w-0 text-slate-700 dark:text-slate-300">
              <Sparkles className="w-4 h-4 text-[#0066FF] dark:text-blue-400 shrink-0" />
              <span className="truncate">
                {t("calculator.indicativePrice")}:{" "}
                <strong>${currentIndicative.unitPriceUSD}</strong> /{" "}
                {t(`units.${input.unit}`, input.unit)} • {t("calculator.weightApprox")}{" "}
                <strong>
                  {currentIndicative.typicalWeightKg} {t("common.kg")}
                </strong>{" "}
                • {t("calculator.deliveryApprox")}{" "}
                <strong>${currentIndicative.typicalDeliveryUSD}</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={handleResetToIndicative}
              className="text-[11.5px] font-semibold text-[#0066FF] dark:text-blue-400 hover:underline self-end sm:self-auto shrink-0 cursor-pointer"
              title={t("calculator.applyIndicative")}
            >
              {t("calculator.applyIndicative")}
            </button>
          </div>
        )}

        {/* Custom Rates Adjuster for Non-UZ Destination Countries */}
        {input.destinationCountry !== "UZ" && (
          <div className="p-3.5 bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 min-w-0">
                <Sliders className="w-3.5 h-3.5 text-[#0066FF] dark:text-blue-400 shrink-0" />
                <span className="truncate">
                  {t("calculator.customRatesTitle")} (
                  {t(`countries.${destProfile.code}`, destProfile.shortName || destProfile.name)}):
                </span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 shrink-0">
                {input.customDutyRate !== undefined || input.customVatRate !== undefined
                  ? t("calculator.customRatesSubCustom")
                  : t("calculator.customRatesSubDefault")}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11.5px] font-medium text-slate-600 dark:text-slate-300 mb-1 truncate">
                  {t("calculator.customDutyRate")}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="100"
                    value={
                      input.customDutyRate !== undefined
                        ? input.customDutyRate
                        : (input.hsCode.dutyRate ?? 0)
                    }
                    onChange={(e) => {
                      const val =
                        e.target.value === ""
                          ? undefined
                          : Math.max(0, parseFloat(e.target.value) || 0);
                      onChange({ customDutyRate: val });
                    }}
                    className="w-full h-9 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 pr-7 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#0066FF] dark:focus:border-blue-500"
                    placeholder="0"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 dark:text-slate-500 pointer-events-none">
                    %
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11.5px] font-medium text-slate-600 dark:text-slate-300 mb-1 truncate">
                  {t("calculator.customVatRate")}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="100"
                    value={
                      input.customVatRate !== undefined ? input.customVatRate : destProfile.vatRate
                    }
                    onChange={(e) => {
                      const val =
                        e.target.value === ""
                          ? undefined
                          : Math.max(0, parseFloat(e.target.value) || 0);
                      onChange({ customVatRate: val });
                    }}
                    className="w-full h-9 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 pr-7 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#0066FF] dark:focus:border-blue-500"
                    placeholder="0"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 dark:text-slate-500 pointer-events-none">
                    %
                  </span>
                </div>
              </div>
            </div>

            {(input.customDutyRate !== undefined || input.customVatRate !== undefined) && (
              <div className="flex justify-end pt-0.5">
                <button
                  type="button"
                  onClick={() => onChange({ customDutyRate: undefined, customVatRate: undefined })}
                  className="text-[11px] text-[#0066FF] dark:text-blue-400 hover:underline font-medium cursor-pointer"
                >
                  {t("calculator.resetRates")}
                </button>
              </div>
            )}
          </div>
        )}

        {/* 3 Country Fields: Страна отправления, Страна происхождения, Страна назначения (ввоза) */}
        <div className="space-y-2.5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 items-start">
            {/* Страна отправления */}
            <div>
              <div className="h-5 flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 truncate">
                  {t("calculator.departureCountry")}
                </label>
              </div>
              <div className="relative">
                <select
                  value={input.departureCountry}
                  onChange={(e) => onChange({ departureCountry: e.target.value })}
                  className="w-full h-10 appearance-none bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 rounded-xl pl-9 pr-8 text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#0066FF] dark:focus:border-blue-500 shadow-2xs cursor-pointer"
                  id="select-departure-country"
                >
                  {COUNTRIES.map((c) => (
                    <option
                      key={`dep-${c.code}`}
                      value={c.code}
                      className="dark:bg-slate-800 dark:text-slate-100"
                    >
                      {t(`countries.${c.code}`, c.name)}
                    </option>
                  ))}
                </select>
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <CountryFlag code={input.departureCountry} />
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[1.8]" />
              </div>
            </div>

            {/* Страна происхождения */}
            <div>
              <div className="h-5 flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 truncate">
                  {t("calculator.originCountry")}
                </label>
                <span
                  className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold shrink-0"
                  title={t("calculator.st1Title")}
                >
                  СТ-1
                </span>
              </div>
              <div className="relative">
                <select
                  value={input.originCountry}
                  onChange={(e) => onChange({ originCountry: e.target.value })}
                  className="w-full h-10 appearance-none bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 rounded-xl pl-9 pr-8 text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#0066FF] dark:focus:border-blue-500 shadow-2xs cursor-pointer"
                  id="select-origin-country"
                >
                  {COUNTRIES.map((c) => (
                    <option
                      key={`orig-${c.code}`}
                      value={c.code}
                      className="dark:bg-slate-800 dark:text-slate-100"
                    >
                      {t(`countries.${c.code}`, c.name)}{" "}
                      {c.isPreferential ? `(${t("calculator.st1Preference")})` : ""}
                    </option>
                  ))}
                </select>
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <CountryFlag code={input.originCountry} />
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[1.8]" />
              </div>
            </div>

            {/* Страна назначения (ввоза) */}
            <div>
              <div className="h-5 flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 truncate">
                  {t("calculator.destinationCountry")}
                </label>
              </div>
              <div className="relative">
                <select
                  value={input.destinationCountry}
                  onChange={(e) => {
                    const newCountry = e.target.value;
                    if (newCountry !== "UZ") {
                      setIsManualMode(true);
                      onChange({
                        destinationCountry: newCountry,
                        isManualProduct: true,
                        manualProductName:
                          input.manualProductName ||
                          (input.hsCode?.code === "8517 12 000 0"
                            ? t("goods.8517120000", input.hsCode?.name)
                            : input.hsCode?.name) ||
                          t("calculator.defaultProductName"),
                        manualHsCode: input.manualHsCode || input.hsCode?.code || "8517.13.00.00",
                      });
                    } else {
                      setIsManualMode(false);
                      onChange({
                        destinationCountry: "UZ",
                        isManualProduct: false,
                        manualProductName: undefined,
                        manualHsCode: undefined,
                        customDutyRate: undefined,
                        customVatRate: undefined,
                      });
                    }
                  }}
                  className="w-full h-10 appearance-none bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 rounded-xl pl-9 pr-8 text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#0066FF] dark:focus:border-blue-500 shadow-2xs cursor-pointer"
                  id="select-destination-country"
                >
                  {COUNTRIES.map((c) => (
                    <option
                      key={`dest-${c.code}`}
                      value={c.code}
                      className="dark:bg-slate-800 dark:text-slate-100"
                    >
                      {t(`countries.${c.code}`, c.name)}
                    </option>
                  ))}
                </select>
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <CountryFlag code={input.destinationCountry} />
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[1.8]" />
              </div>

              {input.destinationCountry !== "UZ" && (
                <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium truncate flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>
                    {t("calculator.adaptiveCalc")} ({destProfile.currencyCode})
                  </span>
                </div>
              )}
            </div>
          </div>

          {input.destinationCountry !== "UZ" && (
            <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 bg-blue-50/70 dark:bg-blue-950/50 border border-blue-200/70 dark:border-blue-900/60 rounded-xl text-xs text-blue-900 dark:text-blue-300 transition-all">
              <div className="flex items-center gap-2 min-w-0">
                <span className="flex-shrink-0 font-semibold text-blue-700 dark:text-blue-400">
                  ⚡ {t("calculator.adaptiveTariff")}:
                </span>
                <span className="truncate">
                  {t("calculator.customs")}:{" "}
                  <strong>
                    {t(`countries.${destProfile.code}`, destProfile.shortName || destProfile.name)}
                  </strong>{" "}
                  • {t("calculator.currency")}:{" "}
                  <strong>
                    {destProfile.currencyCode} ({destProfile.currencySymbol})
                  </strong>
                </span>
              </div>
              <span className="text-[11px] text-blue-700 dark:text-blue-300 font-medium shrink-0 hidden md:inline bg-white/70 dark:bg-slate-850 px-2 py-0.5 rounded-md border border-blue-100 dark:border-blue-900">
                {t(`deMinimisRuleNames.${destProfile.code}`, destProfile.deMinimisRuleName)}
              </span>
            </div>
          )}
        </div>

        {/* Row 2: Цена за единицу, Количество + ед. изм., Общая фактурная стоимость */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
          {/* Цена за единицу */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 truncate">
              {t("calculator.unitPrice")} 1 {t(`units.${input.unit}`, input.unit || "pcs")} (USD)
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="any"
                value={input.unitPriceUSD !== undefined ? input.unitPriceUSD : ""}
                onChange={(e) => handleUnitPriceChange(Number(e.target.value))}
                className="w-full h-10 bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 rounded-xl pl-3 pr-11 text-sm font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#0066FF] dark:focus:border-blue-500 shadow-2xs"
                id="input-unit-price"
                placeholder="0"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 dark:text-slate-500 pointer-events-none font-medium">
                USD
              </span>
            </div>
          </div>

          {/* Количество и единица измерения */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 truncate">
              {t("calculator.quantity")}
            </label>
            <div className="flex h-10 bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 rounded-xl overflow-hidden shadow-2xs focus-within:border-[#0066FF] dark:focus-within:border-blue-500">
              <input
                type="number"
                min="1"
                value={input.quantity || ""}
                onChange={(e) => handleQuantityChange(Number(e.target.value))}
                className="w-full h-full px-3 text-sm font-semibold text-slate-900 dark:text-slate-100 focus:outline-none bg-transparent"
                id="input-quantity"
                placeholder="1"
              />
              <div className="relative border-l border-slate-200/80 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-750 shrink-0">
                <select
                  value={input.unit}
                  onChange={(e) => onChange({ unit: e.target.value })}
                  className="h-full appearance-none bg-transparent px-2.5 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none pr-6 cursor-pointer"
                  id="select-unit"
                >
                  <option value="шт." className="dark:bg-slate-800">
                    {t("units.шт.")}
                  </option>
                  <option value="кг" className="dark:bg-slate-800">
                    {t("units.кг")}
                  </option>
                  <option value="пар" className="dark:bg-slate-800">
                    {t("units.пар")}
                  </option>
                  <option value="л" className="dark:bg-slate-800">
                    {t("units.л")}
                  </option>
                  <option value="м" className="dark:bg-slate-800">
                    {t("units.м")}
                  </option>
                  <option value="компл." className="dark:bg-slate-800">
                    {t("units.компл.")}
                  </option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[1.8]" />
              </div>
            </div>
          </div>

          {/* Общая стоимость товара (USD) */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 truncate">
              {t("calculator.goodsCost")}
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="any"
                value={input.goodsCostUSD || ""}
                onChange={(e) => handleTotalGoodsCostChange(Number(e.target.value))}
                className="w-full h-10 bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 rounded-xl pl-3 pr-11 text-sm font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#0066FF] dark:focus:border-blue-500 shadow-2xs"
                id="input-goods-cost"
                placeholder="0"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 dark:text-slate-500 pointer-events-none font-medium">
                USD
              </span>
            </div>
          </div>
        </div>

        {/* Row 3: Вес (брутто), Доставка (USD), Страхование (USD) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
          {/* Вес брутто */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 truncate">
              {t("calculator.grossWeight")}
            </label>
            <div className="flex h-10 bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 rounded-xl overflow-hidden shadow-2xs focus-within:border-[#0066FF] dark:focus-within:border-blue-500">
              <input
                type="number"
                min="0"
                step="0.01"
                value={input.grossWeightKg || ""}
                onChange={(e) => handleGrossWeightChange(Number(e.target.value))}
                className="w-full h-full px-3 text-sm font-semibold text-slate-900 dark:text-slate-100 focus:outline-none bg-transparent"
                id="input-weight"
                placeholder="0"
              />
              <div className="relative border-l border-slate-200/80 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-750 shrink-0">
                <select
                  value={input.weightUnit}
                  onChange={(e) => onChange({ weightUnit: e.target.value })}
                  className="h-full appearance-none bg-transparent px-2.5 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none pr-6 cursor-pointer"
                  id="select-weight-unit"
                >
                  <option value="кг" className="dark:bg-slate-800">
                    {t("units.кг")}
                  </option>
                  <option value="т" className="dark:bg-slate-800">
                    {t("units.т")}
                  </option>
                  <option value="г" className="dark:bg-slate-800">
                    {t("units.г")}
                  </option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[1.8]" />
              </div>
            </div>
          </div>

          {/* Доставка (USD) */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 truncate">
              {t("calculator.deliveryCost")}
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="any"
                value={input.deliveryCostUSD || ""}
                onChange={(e) => onChange({ deliveryCostUSD: Number(e.target.value) || 0 })}
                className="w-full h-10 bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 rounded-xl pl-3 pr-11 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#0066FF] dark:focus:border-blue-500 shadow-2xs"
                id="input-delivery-cost"
                placeholder="0"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 dark:text-slate-500 pointer-events-none font-medium">
                USD
              </span>
            </div>
          </div>

          {/* Страхование (USD) */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 truncate">
              {t("calculator.insuranceCost")}
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="any"
                value={input.insuranceCostUSD || ""}
                onChange={(e) => onChange({ insuranceCostUSD: Number(e.target.value) || 0 })}
                className="w-full h-10 bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 rounded-xl pl-3 pr-11 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#0066FF] dark:focus:border-blue-500 shadow-2xs"
                id="input-insurance-cost"
                placeholder="0"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 dark:text-slate-500 pointer-events-none font-medium">
                USD
              </span>
            </div>
          </div>
        </div>

        {/* Info Callout */}
        <div
          className="flex items-start gap-3 p-3.5 bg-blue-50/50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 rounded-xl text-xs"
          id="customs-info-callout"
        >
          <div className="w-5 h-5 rounded-full border-[1.5px] border-[#0066FF] dark:border-blue-400 text-[#0066FF] dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[11px]">
            i
          </div>
          <div className="space-y-0.5 min-w-0">
            <p className="font-bold text-slate-800 dark:text-slate-200 leading-snug">
              {isIndividual ? t("calculator.infoIndividual") : t("calculator.infoLegal")}
            </p>
            <p className="text-slate-500 dark:text-slate-400 leading-snug">
              {input.destinationCountry !== "UZ"
                ? t("calculator.intlShipmentNotice")
                : `${t("calculator.indicativePricePerUnit")}: ~$${currentIndicative.unitPriceUSD} ${t("calculator.perUnit")}, ${t("calculator.weight")} ~${currentIndicative.unitWeightKg} ${t("common.kg")}`}
            </p>
          </div>
        </div>
      </div>

      {/* Primary Calculate Button */}
      <div className="pt-4 mt-auto">
        <button
          type="button"
          onClick={handleCalculateClick}
          disabled={isCalculating}
          className="w-full h-12 flex items-center justify-center gap-2 bg-[#0066FF] hover:bg-[#0052FF] dark:bg-blue-600 dark:hover:bg-blue-500 active:scale-[0.99] text-white font-semibold rounded-xl shadow-xs transition-all cursor-pointer text-[14px] sm:text-[14.5px] disabled:opacity-85"
          id="btn-calculate-customs"
        >
          {isCalculating ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>{t("calculator.calculating")}</span>
            </>
          ) : (
            <>
              <Calculator className="w-5 h-5 stroke-[2.2]" />
              <span>{t("calculator.calculateButton")}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
