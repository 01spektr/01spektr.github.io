import React, { useState } from "react";
import {
  Check,
  Copy,
  Receipt,
  Percent,
  TrendingUp,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import { CalculationBreakdown, CalculationInput } from "../types";
import { useTranslation } from "../context/LanguageContext";
import { formatUSD } from "../utils/calculator";
import { getCountryProfile } from "../utils/countryProfiles";

interface CustomsMetricsCardsProps {
  result: CalculationBreakdown;
  input: CalculationInput;
  exchangeRate: number;
  onRefreshRate: () => void;
  onReset: () => void;
}

export const CustomsMetricsCards: React.FC<CustomsMetricsCardsProps> = ({
  result,
  input,
  exchangeRate,
  onRefreshRate,
  onReset,
}) => {
  const { t, language } = useTranslation();
  const [copied, setCopied] = useState(false);

  const targetCode = result.targetCountryCode || input.destinationCountry || "UZ";
  const profile = getCountryProfile(targetCode);
  const isUzbekistan = targetCode === "UZ";

  const totalPayableFormatted = isUzbekistan
    ? `${result.totalPayableUZS.toLocaleString("ru-RU")} UZS`
    : `${(result.totalPayableTarget || 0).toLocaleString("ru-RU")} ${profile.currencyCode}`;

  const totalUSDFormatted = `$${Math.round(result.totalPayableUSD).toLocaleString("ru-RU")}`;

  const labels = {
    ru: {
      statusSuccess: "Расчёт актуален по ставкам ТН ВЭД РУз 2026",
      reset: "Сбросить",
      copyResult: "Скопировать итог",
      copied: "Скопировано!",
      card1Title: "Таможенные платежи",
      card1Sub: `Эквивалент: ${totalUSDFormatted}`,
      card2Title: "Пошлина + НДС",
      card2Sub: `Эффективная ставка от стоимости: ${
        result.effectiveRatePercent ? result.effectiveRatePercent.toFixed(1) : "0"
      }%`,
      card3Title: "Курс валюты",
      card3Sub: "Нажмите для смены",
      rateUnit: "UZS / USD",
    },
    uz: {
      statusSuccess: "Hisob-kitob O‘zR TIF TN 2026 stavkalari bo‘yicha amalga oshirildi",
      reset: "Qayta o‘rnatish",
      copyResult: "Natijani nusxalash",
      copied: "Nusxalandi!",
      card1Title: "Bojxona to‘lovlari",
      card1Sub: `Ekvivalenti: ${totalUSDFormatted}`,
      card2Title: "Boj + QQS",
      card2Sub: `Tovardan samarali yuklama: ${
        result.effectiveRatePercent ? result.effectiveRatePercent.toFixed(1) : "0"
      }%`,
      card3Title: "Valyuta kursi",
      card3Sub: "O‘zgartirish uchun bosing",
      rateUnit: "UZS / USD",
    },
    en: {
      statusSuccess: "Calculated with current UZ HS Code 2026 tariffs",
      reset: "Reset",
      copyResult: "Copy Summary",
      copied: "Copied!",
      card1Title: "Total Customs Fees",
      card1Sub: `Equivalent: ${totalUSDFormatted}`,
      card2Title: "Duty & VAT Share",
      card2Sub: `Effective tax burden: ${
        result.effectiveRatePercent ? result.effectiveRatePercent.toFixed(1) : "0"
      }%`,
      card3Title: "Exchange Rate",
      card3Sub: "Click to adjust rate",
      rateUnit: "UZS / USD",
    },
  }[language] || {
    statusSuccess: "Calculated with current UZ HS Code 2026 tariffs",
    reset: "Reset",
    copyResult: "Copy Summary",
    copied: "Copied!",
    card1Title: "Total Customs Fees",
    card1Sub: `Equivalent: ${totalUSDFormatted}`,
    card2Title: "Duty & VAT Share",
    card2Sub: "Effective tax burden",
    card3Title: "Exchange Rate",
    card3Sub: "Click to adjust rate",
    rateUnit: "UZS / USD",
  };

  const handleCopy = () => {
    const textToCopy = `${input.hsCode.name} (${input.hsCode.code})\nИтого к оплате: ${totalPayableFormatted} (~${totalUSDFormatted})\nКурс: 1 USD = ${exchangeRate.toLocaleString("ru-RU")} UZS`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-3 mb-5">
      {/* Top status bar with Reset and Copy buttons matching loan-calculator standard */}
      <div className="border rounded-xl py-2 px-3 sm:px-3.5 flex items-center justify-between gap-2 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-800/60 transition-colors">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <Check className="w-3 h-3 stroke-[3]" />
          </div>
          <span className="text-xs sm:text-[13px] font-semibold text-emerald-900 dark:text-emerald-200 truncate">
            {labels.statusSuccess}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={labels.reset}
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span className="hidden sm:inline">{labels.reset}</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            )}
            <span>{copied ? labels.copied : labels.copyResult}</span>
          </button>
        </div>
      </div>

      {/* 3 Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {/* Card 1: Total Customs Payable */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-xs relative overflow-hidden transition-colors">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 font-inter">
              {labels.card1Title}
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Receipt className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight font-heading truncate">
            {totalPayableFormatted}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate font-inter">
            {labels.card1Sub}
          </p>
        </div>

        {/* Card 2: Duty + VAT effective burden */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-xs relative overflow-hidden transition-colors">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 font-inter">
              {labels.card2Title}
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Percent className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight font-heading">
            {result.dutyPercent}% <span className="text-xs font-semibold text-slate-400">+ 12% НДС</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate font-inter">
            {labels.card2Sub}
          </p>
        </div>

        {/* Card 3: Central Bank Exchange Rate */}
        <div
          onClick={onRefreshRate}
          className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-xs relative overflow-hidden transition-colors cursor-pointer hover:border-blue-300 dark:hover:border-blue-800 group"
          title="Нажмите, чтобы настроить курс"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 font-inter group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {labels.card3Title}
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight font-heading truncate">
            {exchangeRate.toLocaleString("ru-RU")}{" "}
            <span className="text-xs font-bold text-slate-500">UZS</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate font-inter">
            {labels.card3Sub}
          </p>
        </div>
      </div>
    </div>
  );
};
