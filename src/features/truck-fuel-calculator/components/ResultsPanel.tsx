import React, { useState } from 'react';
import {
  Check,
  Bookmark,
  Fuel,
  Coins,
  Gauge,
  Route,
  ArrowRight,
  Package,
  Layers,
  FileText,
  Copy,
  Share2,
  ChevronDown,
  Scale,
  Leaf,
  CheckCircle2,
} from 'lucide-react';
import {
  CalculatorState,
  CalculationResult,
  DistanceUnit,
  CurrencyCode,
} from '../types/calculator';
import { CURRENCIES } from '../utils/constants';
import {
  formatConsumption,
  formatDistance,
  formatFuel,
  formatMoney,
} from '../utils/calculations';
import { exportCalculationToPdf } from '../utils/exportPdf';
import { LanguageCode, TranslationData } from '../locales/i18n';

interface ResultsPanelProps {
  state: CalculatorState;
  result: CalculationResult;
  onUpdateUnit: (unit: DistanceUnit) => void;
  onUpdateCurrency: (curr: CurrencyCode) => void;
  onSaveCalculation: () => void;
  isSaved?: boolean;
  t: TranslationData['results'];
  lang: LanguageCode;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({
  state,
  result,
  onUpdateUnit,
  onUpdateCurrency,
  onSaveCalculation,
  isSaved,
  t,
  lang,
}) => {
  const [copyToast, setCopyToast] = useState<string | null>(null);
  const currencySymbol = CURRENCIES[state.currency].symbol;

  const showToast = (msg: string) => {
    setCopyToast(msg);
    setTimeout(() => setCopyToast(null), 2500);
  };

  const formattedCost = formatMoney(result.totalCost, currencySymbol);
  const formattedFuelStr = formatFuel(result.totalFuel, state.distanceUnit);
  const formattedAvgStr = formatConsumption(result.effectiveAvgConsumption, state.distanceUnit);

  const handleCopy = () => {
    const text = [
      `Toolboxi.uz - ${t.title}`,
      `---------------------------------------`,
      `${t.metricFuel}: ${formattedFuelStr}`,
      `${t.metricCost}: ${formattedCost}`,
      `${t.metricAvg}: ${formattedAvgStr}`,
      `${t.detailTotalDist}: ${formatDistance(state.totalDistance, state.distanceUnit)}`,
      `${t.detailLoadedDist}: ${formatDistance(state.loadedDistance, state.distanceUnit)} (${formatFuel(result.loadedFuel, state.distanceUnit)} / ${formatMoney(result.loadedCost, currencySymbol)})`,
      `${t.detailEmptyDist}: ${formatDistance(state.emptyDistance, state.distanceUnit)} (${formatFuel(result.emptyFuel, state.distanceUnit)} / ${formatMoney(result.emptyCost, currencySymbol)})`,
      `${t.detailCargo}: ${state.cargoWeight} ${t.tonsUnit}, ${t.detailTrailer}: ${state.trailerWeight} ${t.tonsUnit}`,
      `${t.detailCostPerKm}: ${formatMoney(result.costPerKm, currencySymbol)}`,
    ].join('\n');

    navigator.clipboard.writeText(text);
    showToast(t.toastCopied);
  };

  const handleShare = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('dist', String(state.totalDistance));
    url.searchParams.set('loaded', String(state.loadedDistance));
    url.searchParams.set('empty', String(state.emptyDistance));
    url.searchParams.set('avg', String(state.avgConsumption));
    url.searchParams.set('price', String(state.fuelPrice));
    url.searchParams.set('cargo', String(state.cargoWeight));
    url.searchParams.set('curr', state.currency);

    navigator.clipboard.writeText(url.toString());
    showToast(t.toastLinkCopied);
  };

  const handlePdfExport = async () => {
    try {
      showToast(t.toastPdfGenerating);
      await exportCalculationToPdf(state, result, lang);
      showToast(t.toastPdfSuccess);
    } catch (e) {
      console.error(e);
      showToast('Error exporting PDF');
    }
  };

  // Percentages for the segments breakdown progress bars
  const sumFuel = result.loadedFuel + result.emptyFuel + result.idleFuel || 1;
  const loadedPct = Math.min(100, Math.max(0, (result.loadedFuel / sumFuel) * 100));
  const emptyPct = Math.min(100, Math.max(0, (result.emptyFuel / sumFuel) * 100));
  const idlePct = Math.min(100, Math.max(0, (result.idleFuel / sumFuel) * 100));

  // Dynamic font sizing for metric card 2 to handle large Uzbek sums smoothly
  const costFontSize =
    formattedCost.length > 13
      ? 'text-xs sm:text-sm font-extrabold'
      : formattedCost.length > 9
      ? 'text-sm sm:text-base font-extrabold'
      : 'text-base sm:text-lg font-extrabold';

  return (
    <div className="flex flex-col gap-3">
      {/* Top Unit & Currency Switcher Bar */}
      <div className="h-9 flex items-center justify-between gap-2 px-1">
        {/* Km / Miles Switcher */}
        <div className="inline-flex items-center p-0.5 bg-slate-100/90 dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700 shadow-2xs h-8">
          <button
            type="button"
            onClick={() => onUpdateUnit('km')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer leading-none ${
              state.distanceUnit === 'km'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t.unitKm}
          </button>
          <button
            type="button"
            onClick={() => onUpdateUnit('miles')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer leading-none ${
              state.distanceUnit === 'miles'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t.unitMiles}
          </button>
        </div>

        {/* Currency Dropdown */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium h-8">
          <span>{t.currencyLabel}</span>
          <div className="relative h-8">
            <select
              value={state.currency}
              onChange={(e) => onUpdateCurrency(e.target.value as CurrencyCode)}
              className="h-full pl-2.5 pr-6 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none appearance-none cursor-pointer shadow-2xs"
            >
              {Object.values(CURRENCIES).map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-1.5 flex items-center pointer-events-none text-slate-400">
              <ChevronDown className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Results Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-3.5 sm:p-5 flex flex-col gap-4 sm:gap-5 transition-colors">
        {/* Top Status Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs shadow-emerald-500/20 shrink-0">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white block leading-tight">
                {t.title}
              </span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium block leading-tight mt-0.5">
                {t.statusSuccess}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onSaveCalculation}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer shadow-2xs ${
              isSaved
                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-blue-600 text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
            <span>{isSaved ? t.btnSaved : t.btnSave}</span>
          </button>
        </div>

        {/* 3 Metric Cards - strictly equal fixed height and aligned baselines */}
        <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
          {/* Metric 1: Total Fuel */}
          <div className="h-[92px] bg-slate-50/70 dark:bg-slate-800/60 rounded-xl p-2.5 sm:p-3 border border-slate-100/90 dark:border-slate-800 flex flex-col justify-between overflow-hidden">
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100/60 dark:border-emerald-900/50">
                <Fuel className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate leading-tight">
                {t.metricFuel}
              </span>
            </div>
            <div
              className="text-sm sm:text-base xl:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight tabular-nums truncate"
              title={formattedFuelStr}
            >
              {formattedFuelStr}
            </div>
          </div>

          {/* Metric 2: Total Cost (uses Coins icon instead of dollar sign to avoid any confusion) */}
          <div className="h-[92px] bg-slate-50/70 dark:bg-slate-800/60 rounded-xl p-2.5 sm:p-3 border border-slate-100/90 dark:border-slate-800 flex flex-col justify-between overflow-hidden">
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100/60 dark:border-blue-900/50">
                <Coins className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate leading-tight">
                {t.metricCost}
              </span>
            </div>
            <div
              className={`${costFontSize} text-slate-900 dark:text-white tracking-tight tabular-nums truncate`}
              title={formattedCost}
            >
              {formattedCost}
            </div>
          </div>

          {/* Metric 3: Avg Consumption */}
          <div className="h-[92px] bg-slate-50/70 dark:bg-slate-800/60 rounded-xl p-2.5 sm:p-3 border border-slate-100/90 dark:border-slate-800 flex flex-col justify-between overflow-hidden">
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="w-6 h-6 rounded-lg bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 border border-sky-100/60 dark:border-sky-900/50">
                <Gauge className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate leading-tight">
                {t.metricAvg}
              </span>
            </div>
            <div
              className="text-sm sm:text-base xl:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight tabular-nums truncate"
              title={formattedAvgStr}
            >
              {formattedAvgStr}
            </div>
          </div>
        </div>

        {/* Detailed Breakdown Section */}
        <div className="flex flex-col gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center text-[10px] font-bold shrink-0">
              i
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{t.detailTitle}</h3>
          </div>

          <div className="flex flex-col text-xs divide-y divide-slate-100 dark:divide-slate-800">
            {/* Total distance */}
            <div className="flex items-center justify-between py-2 min-h-[34px]">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 truncate">
                <Route className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{t.detailTotalDist}</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-white tabular-nums shrink-0 pl-2">
                {formatDistance(state.totalDistance, state.distanceUnit)}
              </span>
            </div>

            {/* Loaded distance */}
            <div className="flex items-center justify-between py-2 min-h-[34px]">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 truncate">
                <ArrowRight className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="truncate">{t.detailLoadedDist}</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-white tabular-nums shrink-0 pl-2">
                {formatDistance(state.loadedDistance, state.distanceUnit)}
              </span>
            </div>

            {/* Empty distance */}
            <div className="flex items-center justify-between py-2 min-h-[34px]">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 truncate">
                <ArrowRight className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span className="truncate">{t.detailEmptyDist}</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-white tabular-nums shrink-0 pl-2">
                {formatDistance(state.emptyDistance, state.distanceUnit)}
              </span>
            </div>

            {/* Cargo weight */}
            <div className="flex items-center justify-between py-2 min-h-[34px]">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 truncate">
                <Package className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{t.detailCargo}</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-white tabular-nums shrink-0 pl-2">
                {state.cargoWeight} {t.tonsUnit}
              </span>
            </div>

            {/* Trailer weight */}
            <div className="flex items-center justify-between py-2 min-h-[34px]">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 truncate">
                <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{t.detailTrailer}</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-white tabular-nums shrink-0 pl-2">
                {state.trailerWeight} {t.tonsUnit}
              </span>
            </div>

            {/* Total Fuel */}
            <div className="flex items-center justify-between py-2 min-h-[34px]">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 truncate">
                <Fuel className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{t.detailFuel}</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-white tabular-nums shrink-0 pl-2">
                {formattedFuelStr}
              </span>
            </div>

            {/* Total Cost */}
            <div className="flex items-center justify-between py-2 min-h-[34px]">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 truncate">
                <Coins className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{t.detailCost}</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-white tabular-nums shrink-0 pl-2">
                {formattedCost}
              </span>
            </div>

            {/* Extra: Cost per km */}
            <div className="flex items-center justify-between py-2 min-h-[34px]">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 truncate">
                <Scale className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{t.detailCostPerKm}</span>
              </div>
              <span className="font-semibold text-slate-700 dark:text-slate-300 tabular-nums shrink-0 pl-2">
                {formatMoney(result.costPerKm, currencySymbol)}/{state.distanceUnit === 'miles' ? t.perMileUnit : t.perKmUnit}
              </span>
            </div>

            {/* Extra: CO2 */}
            <div className="flex items-center justify-between py-2 min-h-[34px]">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 truncate">
                <Leaf className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="truncate">{t.detailCo2}</span>
              </div>
              <span className="font-semibold text-slate-700 dark:text-slate-300 tabular-nums shrink-0 pl-2">
                ~{result.co2EmissionsKg} kg
              </span>
            </div>
          </div>
        </div>

        {/* Расход по участкам section */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center text-[10px] font-bold shrink-0">
              <Route className="w-3 h-3" />
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{t.breakdownTitle}</h3>
          </div>

          <div className="flex flex-col gap-3 text-xs">
            {/* Loaded section */}
            <div>
              <div className="flex items-center justify-between mb-1 gap-2">
                <span className="text-slate-700 dark:text-slate-300 font-medium truncate">
                  {t.breakdownLoaded} ({formatDistance(state.loadedDistance, state.distanceUnit)})
                </span>
                <div className="text-right shrink-0 whitespace-nowrap">
                  <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                    {formatFuel(result.loadedFuel, state.distanceUnit)}
                  </span>
                  <span className="text-slate-400 dark:text-slate-500 text-[11px] ml-2 tabular-nums">
                    {formatMoney(result.loadedCost, currencySymbol)}
                  </span>
                </div>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${loadedPct}%` }}
                />
              </div>
            </div>

            {/* Empty section */}
            <div>
              <div className="flex items-center justify-between mb-1 gap-2">
                <span className="text-slate-700 dark:text-slate-300 font-medium truncate">
                  {t.breakdownEmpty} ({formatDistance(state.emptyDistance, state.distanceUnit)})
                </span>
                <div className="text-right shrink-0 whitespace-nowrap">
                  <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                    {formatFuel(result.emptyFuel, state.distanceUnit)}
                  </span>
                  <span className="text-slate-400 dark:text-slate-500 text-[11px] ml-2 tabular-nums">
                    {formatMoney(result.emptyCost, currencySymbol)}
                  </span>
                </div>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-sky-400 rounded-full transition-all duration-300"
                  style={{ width: `${emptyPct}%` }}
                />
              </div>
            </div>

            {/* Idle section (if any) */}
            {result.idleFuel > 0 && (
              <div>
                <div className="flex items-center justify-between mb-1 gap-2">
                  <span className="text-slate-700 dark:text-slate-300 font-medium truncate">
                    {t.breakdownIdle} ({state.idleHours} h)
                  </span>
                  <div className="text-right shrink-0 whitespace-nowrap">
                    <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                      {formatFuel(result.idleFuel, state.distanceUnit)}
                    </span>
                    <span className="text-slate-400 dark:text-slate-500 text-[11px] ml-2 tabular-nums">
                      {formatMoney(result.idleCost, currencySymbol)}
                    </span>
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-300"
                    style={{ width: `${idlePct}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom 3 Action Buttons */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={handlePdfExport}
            className="h-10 flex items-center justify-center gap-1.5 px-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl border border-slate-200/90 dark:border-slate-700 shadow-2xs transition-all cursor-pointer"
            title={t.btnPdf}
          >
            <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="truncate">{t.btnPdf}</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="h-10 flex items-center justify-center gap-1.5 px-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl border border-slate-200/90 dark:border-slate-700 shadow-2xs transition-all cursor-pointer"
            title={t.btnCopy}
          >
            <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
            <span className="truncate">{t.btnCopy}</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="h-10 flex items-center justify-center gap-1.5 px-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl border border-slate-200/90 dark:border-slate-700 shadow-2xs transition-all cursor-pointer"
            title={t.btnShare}
          >
            <Share2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
            <span className="truncate">{t.btnShare}</span>
          </button>
        </div>
      </div>

      {/* Floating Copy / Action Toast */}
      {copyToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-medium px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{copyToast}</span>
        </div>
      )}
    </div>
  );
};
