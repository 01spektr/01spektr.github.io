import React, { useState } from "react";
import {
  Check,
  Copy,
  Fuel,
  Coins,
  Gauge,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { CalculationResult, CalculatorState } from "../types/calculator";
import { CURRENCIES } from "../utils/constants";
import {
  formatConsumption,
  formatDistance,
  formatFuel,
  formatMoney,
} from "../utils/calculations";

interface TruckMetricsCardsProps {
  state: CalculatorState;
  result: CalculationResult;
  onReset: () => void;
}

export const TruckMetricsCards: React.FC<TruckMetricsCardsProps> = ({
  state,
  result,
  onReset,
}) => {
  const { locale } = useI18n();
  const [copied, setCopied] = useState(false);

  const currencySymbol = CURRENCIES[state.currency]?.symbol || "$";
  const formattedCost = formatMoney(result.totalCost, currencySymbol);
  const formattedFuelStr = formatFuel(result.totalFuel, state.distanceUnit);
  const formattedAvgStr = formatConsumption(
    result.effectiveAvgConsumption,
    state.distanceUnit
  );
  const formattedDistStr = formatDistance(
    state.totalDistance,
    state.distanceUnit
  );

  const labels = {
    ru: {
      statusSuccess: "Расчёт актуален по методике Минтранса с учётом груза и условий",
      copySummary: "Скопировать итог",
      copied: "Скопировано!",
      reset: "Сбросить",
      card1Title: "Общий расход топлива",
      card1Sub: `На дистанцию ${formattedDistStr}`,
      card2Title: "Стоимость поездки",
      card2Sub: `Себестоимость: ${formatMoney(result.costPerKm, currencySymbol)} / ${state.distanceUnit === "miles" ? "милю" : "км"}`,
      card3Title: "Эффективный расход",
      card3Sub: `Базовый: ${state.avgConsumption} л/100км`,
    },
    uz: {
      statusSuccess: "Hisob-kitob yuk og‘irligi va yo‘l omillari bilan aniq bajarildi",
      copySummary: "Natijani nusxalash",
      copied: "Nusxalandi!",
      reset: "Qayta o‘rnatish",
      card1Title: "Jami yoqilg‘i sarfi",
      card1Sub: `${formattedDistStr} masofa uchun`,
      card2Title: "Safar xarajati",
      card2Sub: `Tannarx: ${formatMoney(result.costPerKm, currencySymbol)} / ${state.distanceUnit === "miles" ? "milya" : "km"}`,
      card3Title: "Samarali o‘rtacha sarf",
      card3Sub: `Asosiy: ${state.avgConsumption} l/100km`,
    },
    en: {
      statusSuccess: "Calculated with cargo load, terrain, and operational factors",
      copySummary: "Copy Summary",
      copied: "Copied!",
      reset: "Reset",
      card1Title: "Total Fuel Required",
      card1Sub: `For ${formattedDistStr} trip`,
      card2Title: "Total Trip Fuel Cost",
      card2Sub: `Running cost: ${formatMoney(result.costPerKm, currencySymbol)} / ${state.distanceUnit}`,
      card3Title: "Effective Average",
      card3Sub: `Base: ${state.avgConsumption} l/100km`,
    },
  }[locale] || {
    statusSuccess: "Calculated with cargo weight and road conditions",
    copySummary: "Copy Summary",
    copied: "Copied!",
    reset: "Reset",
    card1Title: "Total Fuel",
    card1Sub: `Trip: ${formattedDistStr}`,
    card2Title: "Trip Cost",
    card2Sub: `Cost/km: ${formatMoney(result.costPerKm, currencySymbol)}`,
    card3Title: "Effective Rate",
    card3Sub: `Base: ${state.avgConsumption}`,
  };

  const handleCopy = () => {
    const summaryText = [
      `Toolboxi.uz - ${labels.card1Title}`,
      `---------------------------------------`,
      `${labels.card1Title}: ${formattedFuelStr}`,
      `${labels.card2Title}: ${formattedCost}`,
      `${labels.card3Title}: ${formattedAvgStr}`,
      `Дистанция: ${formattedDistStr} (гружёный: ${state.loadedDistance} ${state.distanceUnit}, порожний: ${state.emptyDistance} ${state.distanceUnit})`,
      `Вес груза: ${state.cargoWeight} т, прицеп: ${state.trailerWeight} т`,
      `Себестоимость: ${formatMoney(result.costPerKm, currencySymbol)} / ${state.distanceUnit}`,
    ].join("\n");

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-3 mb-5">
      {/* Top Status Banner with Copy & Reset Actions */}
      <div className="border border-emerald-200/80 dark:border-emerald-900/50 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl py-2 px-3 sm:px-3.5 flex items-center justify-between gap-2 transition-colors">
        <div className="flex items-center gap-2 min-w-0">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="text-xs text-emerald-800 dark:text-emerald-300 font-medium truncate font-inter">
            {labels.statusSuccess}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Copy Summary */}
          <button
            type="button"
            id="truck-copy-summary-btn"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700 transition-colors shadow-2xs cursor-pointer font-inter"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-600 dark:text-emerald-400">
                  {labels.copied}
                </span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>{labels.copySummary}</span>
              </>
            )}
          </button>

          {/* Reset button */}
          <button
            type="button"
            id="truck-reset-metrics-btn"
            onClick={onReset}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/60 dark:hover:bg-slate-800 transition-colors cursor-pointer font-inter"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">{labels.reset}</span>
          </button>
        </div>
      </div>

      {/* 3 Metrics Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Card 1: Total Fuel */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-4.5 shadow-2xs transition-colors flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100/60 dark:border-blue-900/50">
            <Fuel className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider font-inter">
              {labels.card1Title}
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-heading tracking-tight leading-tight mt-0.5">
              {formattedFuelStr}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-inter">
              {labels.card1Sub}
            </div>
          </div>
        </div>

        {/* Card 2: Total Cost */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-4.5 shadow-2xs transition-colors flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100/60 dark:border-emerald-900/50">
            <Coins className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider font-inter">
              {labels.card2Title}
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 font-heading tracking-tight leading-tight mt-0.5">
              {formattedCost}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-inter">
              {labels.card2Sub}
            </div>
          </div>
        </div>

        {/* Card 3: Effective Average Consumption */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-4.5 shadow-2xs transition-colors flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0 border border-violet-100/60 dark:border-violet-900/50">
            <Gauge className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider font-inter">
              {labels.card3Title}
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-heading tracking-tight leading-tight mt-0.5">
              {formattedAvgStr}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-inter">
              {labels.card3Sub}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
