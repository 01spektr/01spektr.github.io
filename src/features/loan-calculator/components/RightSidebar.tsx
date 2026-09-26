import React, { useState, useMemo } from "react";
import { Check, Sparkles, Search, Globe } from "lucide-react";
import { Currency, ExampleLoanItem } from "../types";
import {
  GLOBAL_BANK_RATES,
  getExamplesForCurrency,
  formatCurrencyNumber,
} from "../utils/loanCalculations";
import { CountryFlag } from "./CountryFlag";
import { useLanguage } from "../context/LanguageContext";

interface RightSidebarProps {
  currentRate: number;
  currency: Currency;
  onSelectRate: (rate: number) => void;
  onSelectExample: (ex: ExampleLoanItem) => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  currentRate,
  currency,
  onSelectRate,
  onSelectExample,
}) => {
  const { t, language } = useLanguage();
  const [rateFilter, setRateFilter] = useState<"all" | "mortgage" | "consumer" | "auto">("auto");
  const [rateSearch, setRateSearch] = useState("");
  const [exampleTab, setExampleTab] = useState<"consumer" | "auto" | "mortgage">("auto");

  const examples = getExamplesForCurrency(currency, exampleTab);

  const getCountryName = (item: (typeof GLOBAL_BANK_RATES)[0]) => {
    if (language === "en") return item.countryNameEn || item.countryName;
    if (language === "uz") return item.countryNameUz || item.countryName;
    return item.countryName;
  };

  const getProductName = (item: (typeof GLOBAL_BANK_RATES)[0]) => {
    if (language === "en") return item.productNameEn || item.productName;
    if (language === "uz") return item.productNameUz || item.productName;
    return item.productName;
  };

  const filteredRates = useMemo(() => {
    return GLOBAL_BANK_RATES.filter((item) => {
      const matchFilter = rateFilter === "all" || item.category === rateFilter;
      const cName = getCountryName(item).toLowerCase();
      const pName = getProductName(item).toLowerCase();
      const s = rateSearch.toLowerCase();
      const matchSearch =
        !rateSearch ||
        cName.includes(s) ||
        pName.includes(s) ||
        item.countryName.toLowerCase().includes(s) ||
        item.productName.toLowerCase().includes(s) ||
        (item.region && item.region.toLowerCase().includes(s));
      return matchFilter && matchSearch;
    });
  }, [rateFilter, rateSearch, language]);

  return (
    <div id="sidebar-rates" className="space-y-4">
      {/* Widget 1: Ставки по кредитам в мире (ПОЛНОСТЬЮ РАЗВЁРНУТЫЕ) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/85 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs transition-colors">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <h3 className="font-heading text-sm font-bold text-slate-900 dark:text-slate-100">
              {t.rates.title}
            </h3>
          </div>
          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60">
            {GLOBAL_BANK_RATES.length} {t.rates.ratesCountSuffix}
          </span>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3 font-body leading-relaxed">
          {t.rates.description}
        </p>

        {/* Category Filter Pills: Авто впереди и активно, затем ипотека, потребительская, все */}
        <div className="flex flex-wrap gap-1 mb-2.5">
          <button
            type="button"
            onClick={() => setRateFilter("auto")}
            className={`px-2 py-1 rounded-lg text-[11px] font-heading font-semibold transition-colors cursor-pointer ${
              rateFilter === "auto"
                ? "bg-blue-600 text-white shadow-2xs font-bold"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            {t.rates.filterAuto}
          </button>
          <button
            type="button"
            onClick={() => setRateFilter("mortgage")}
            className={`px-2 py-1 rounded-lg text-[11px] font-heading font-semibold transition-colors cursor-pointer ${
              rateFilter === "mortgage"
                ? "bg-blue-600 text-white shadow-2xs font-bold"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            {t.rates.filterMortgage}
          </button>
          <button
            type="button"
            onClick={() => setRateFilter("consumer")}
            className={`px-2 py-1 rounded-lg text-[11px] font-heading font-semibold transition-colors cursor-pointer ${
              rateFilter === "consumer"
                ? "bg-blue-600 text-white shadow-2xs font-bold"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            {t.rates.filterConsumer}
          </button>
          <button
            type="button"
            onClick={() => setRateFilter("all")}
            className={`px-2 py-1 rounded-lg text-[11px] font-heading font-semibold transition-colors cursor-pointer ${
              rateFilter === "all"
                ? "bg-blue-600 text-white shadow-2xs font-bold"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            {t.rates.filterAll} ({GLOBAL_BANK_RATES.length})
          </button>
        </div>

        {/* Quick Search */}
        <div className="relative mb-2.5">
          <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder={t.rates.searchPlaceholder}
            value={rateSearch}
            onChange={(e) => setRateSearch(e.target.value)}
            className="w-full pl-8 pr-2.5 py-1 text-[11px] rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Fully Unfolded List of All Global Rates */}
        <div className="space-y-1">
          {filteredRates.length === 0 ? (
            <div className="text-center py-4 text-[11px] text-slate-400 dark:text-slate-500">
              {t.rates.noRatesFound} «{rateSearch}»
            </div>
          ) : (
            filteredRates.map((item, idx) => {
              const isSelected = Math.abs(currentRate - item.rate) < 0.05;
              const cName = getCountryName(item);
              const pName = getProductName(item);
              return (
                <button
                  key={`${item.countryCode}-${idx}`}
                  type="button"
                  onClick={() => onSelectRate(item.rate)}
                  className={`w-full px-2.5 py-1.5 rounded-xl flex items-center justify-between transition-colors text-xs text-left cursor-pointer group ${
                    isSelected
                      ? "bg-blue-50/90 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold ring-1 ring-blue-500/30 shadow-2xs"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800/70 text-slate-700 dark:text-slate-300"
                  }`}
                  title={`${t.rates.setRateTitle} ${item.rate}% (${cName} - ${pName})`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {/* Vector SVG country flag */}
                    <CountryFlag
                      countryCode={item.countryCode}
                      className="w-4 h-4 shadow-2xs shrink-0"
                    />
                    <div className="truncate flex items-baseline gap-1">
                      <span className="font-heading font-semibold text-[11px] sm:text-xs text-slate-900 dark:text-slate-100">
                        {cName}
                      </span>
                      <span className="text-slate-400 dark:text-slate-500 text-[10px] truncate">
                        {pName}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    {item.category && (
                      <span className="hidden sm:inline-block text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                        {item.category === "mortgage"
                          ? t.rates.categoryMortgage
                          : item.category === "auto"
                            ? t.rates.categoryAuto
                            : t.rates.categoryConsumer}
                      </span>
                    )}
                    <span
                      className={`font-heading font-bold text-xs ${
                        item.isPopular
                          ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40 px-1.5 py-0.5 rounded"
                          : "text-slate-900 dark:text-slate-100"
                      }`}
                    >
                      {item.rate.toFixed(1)}%
                    </span>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 stroke-[3]" />
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Widget 2: Примеры расчёта */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/85 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs transition-colors">
        <h3 className="font-heading text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
          {t.rates.examplesTitle}
        </h3>

        {/* Mini tabs */}
        <div className="flex items-center gap-1 p-0.5 bg-slate-100/80 dark:bg-slate-800 rounded-lg text-[11px] mb-2.5 font-heading font-semibold">
          <button
            type="button"
            onClick={() => setExampleTab("auto")}
            className={`flex-1 py-1 rounded-md transition-colors text-center cursor-pointer ${
              exampleTab === "auto"
                ? "bg-blue-600 text-white shadow-2xs font-bold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            {t.rates.examplesTabAuto}
          </button>
          <button
            type="button"
            onClick={() => setExampleTab("consumer")}
            className={`flex-1 py-1 rounded-md transition-colors text-center cursor-pointer ${
              exampleTab === "consumer"
                ? "bg-blue-600 text-white shadow-2xs font-bold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            {t.rates.examplesTabConsumer}
          </button>
          <button
            type="button"
            onClick={() => setExampleTab("mortgage")}
            className={`flex-1 py-1 rounded-md transition-colors text-center cursor-pointer ${
              exampleTab === "mortgage"
                ? "bg-blue-600 text-white shadow-2xs font-bold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            {t.rates.examplesTabMortgage}
          </button>
        </div>

        {/* Compact Table */}
        <div className="border border-slate-200/90 dark:border-slate-800 rounded-xl overflow-hidden text-xs">
          <div className="grid grid-cols-3 bg-slate-50/80 dark:bg-slate-800/80 px-2.5 py-1.5 font-heading font-semibold text-[10px] text-slate-500 dark:text-slate-400 border-b border-slate-200/80 dark:border-slate-800">
            <span>{t.rates.colAmount}</span>
            <span className="text-center">{t.rates.colTerm}</span>
            <span className="text-right">{t.rates.colPayment}</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {examples.map((row, idx) => {
              const displayName =
                language === "en"
                  ? row.nameEn || row.name
                  : language === "uz"
                    ? row.nameUz || row.name
                    : row.name;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectExample({ ...row, name: displayName })}
                  className="w-full grid grid-cols-3 px-2.5 py-1.5 text-[11px] hover:bg-blue-50/60 dark:hover:bg-slate-800/60 transition-colors text-left cursor-pointer group"
                  title={`${displayName} - ${row.amount} ${row.currency}`}
                >
                  <span className="font-heading font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {formatCurrencyNumber(row.amount)} {row.currency}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 text-center font-body">
                    {row.termMonths} {t.form.monthsUnit}
                  </span>
                  <span className="font-heading font-bold text-slate-900 dark:text-slate-100 text-right group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {formatCurrencyNumber(row.payment)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-2 text-[10px] text-slate-400 dark:text-slate-500 text-center flex items-center justify-center gap-1 font-body">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>{t.rates.examplesHint}</span>
        </div>
      </div>
    </div>
  );
};
