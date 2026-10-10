import React from "react";
import { Box, Layers, Coins, Check, Copy } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { fmt, type Geometry, type RoofInput } from "../model";
import type { calculateMaterials } from "../materials";

type MaterialsResult = ReturnType<typeof calculateMaterials>;

interface MetricsCardsProps {
  geometry: Geometry;
  materials: MaterialsResult;
  input: RoofInput;
  totalCost: number;
  onCopyAll: () => void;
  copied: boolean;
}

export const RoofMetricsCards: React.FC<MetricsCardsProps> = ({
  geometry,
  materials,
  input,
  totalCost,
  onCopyAll,
  copied,
}) => {
  const { locale } = useI18n();

  const labels = {
    ru: {
      success: "Геометрия и материалы успешно рассчитаны",
      copy: "Копировать",
      copied: "Скопировано!",
      area: "Площадь крыши",
      areaSub: "С учётом скатов и свесов",
      sheets: "Кровельные листы",
      sheetsSub: `С запасом ${input.waste}% и нахлёстом`,
      sheetsUnit: "шт.",
      cost: "Примерная смета",
      costSub: "Листы, конёк, саморезы",
      currency: "сум",
    },
    uz: {
      success: "Tom geometriyasi va materiallar muvaffaqiyatli hisoblandi",
      copy: "Nusxalash",
      copied: "Nusxalandi!",
      area: "Tom umumiy maydoni",
      areaSub: "Chiqindilar va nishablar bilan",
      sheets: "Tom yopish listlari",
      sheetsSub: `${input.waste}% zaxira va ustma-ust tushish bilan`,
      sheetsUnit: "dona",
      cost: "Taxminiy smeta",
      costSub: "Listlar, qirra, mahkamlagichlar",
      currency: "so‘m",
    },
    en: {
      success: "Roof geometry and materials calculated successfully",
      copy: "Copy result",
      copied: "Copied!",
      area: "Total Roof Area",
      areaSub: "Including eaves and gables",
      sheets: "Roofing Sheets",
      sheetsSub: `Includes ${input.waste}% waste allowance`,
      sheetsUnit: "pcs",
      cost: "Estimated Cost",
      costSub: "Sheets, trims, and fasteners",
      currency: "UZS",
    },
  }[locale] ?? {
    success: "Calculated successfully",
    copy: "Copy",
    copied: "Copied!",
    area: "Roof Area",
    areaSub: "Total area",
    sheets: "Sheets",
    sheetsSub: "Sheet count",
    sheetsUnit: "pcs",
    cost: "Estimated Cost",
    costSub: "Estimate",
    currency: "UZS",
  };

  const formattedCost = totalCost > 0
    ? `${fmt(Math.round(totalCost))} ${labels.currency}`
    : `— ${labels.currency}`;

  return (
    <div className="flex flex-col gap-3">
      {/* Success banner with copy button (matching loan-calculator ResultPane) */}
      <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 rounded-xl py-2 px-3 sm:px-3.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <Check className="w-3 h-3 stroke-[3]" />
          </div>
          <span className="text-xs sm:text-[13px] font-semibold text-emerald-900 dark:text-emerald-200 truncate">
            {labels.success}
          </span>
        </div>

        <button
          type="button"
          onClick={onCopyAll}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 rounded-lg text-xs font-semibold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100/50 dark:hover:bg-emerald-900/40 transition-colors shrink-0 cursor-pointer"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          )}
          <span>{copied ? labels.copied : labels.copy}</span>
        </button>
      </div>

      {/* 3 Metric Cards matching loan-calculator */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {/* Card 1: Area */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {labels.area}
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Box className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            {fmt(geometry.area)} <span className="text-sm font-semibold text-slate-500">м²</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
            {labels.areaSub}
          </p>
        </div>

        {/* Card 2: Sheets */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {labels.sheets}
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Layers className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 tracking-tight">
            {materials.sheets} <span className="text-sm font-semibold text-slate-500">{labels.sheetsUnit}</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
            {labels.sheetsSub}
          </p>
        </div>

        {/* Card 3: Cost */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {labels.cost}
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Coins className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
            {formattedCost}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
            {labels.costSub}
          </p>
        </div>
      </div>
    </div>
  );
};
