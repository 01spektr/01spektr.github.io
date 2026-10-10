import React from "react";
import { Check, Copy, Droplets, Palette, ShieldCheck, AlertTriangle, Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface MetricsCardsProps {
  cmyk: { c: number; m: number; y: number; k: number };
  coverage: number;
  closestPantone: { code: string; name: string; score: number };
  onCopyAll: () => void;
  copied: boolean;
}

export const CmykMetricsCards: React.FC<MetricsCardsProps> = ({
  cmyk,
  coverage,
  closestPantone,
  onCopyAll,
  copied,
}) => {
  const { locale } = useI18n();

  const labels = {
    ru: {
      success: "Цвет успешно сконвертирован в CMYK",
      copy: "Копировать CMYK",
      copied: "Скопировано!",
      cmykTitle: "Модель CMYK",
      cmykSub: "Красочные каналы печати",
      tacTitle: "Покрытие краской (TAC)",
      tacSafe: "Безопасно для офсета (≤ 300%)",
      tacWarning: "Высокое покрытие (> 300%)",
      pantoneTitle: "Ближайший Pantone",
      pantoneSub: `Совпадение ${closestPantone.score}%`,
    },
    uz: {
      success: "Rang CMYK modeliga muvaffaqiyatli o'tkazildi",
      copy: "CMYK nusxalash",
      copied: "Nusxalandi!",
      cmykTitle: "CMYK modeli",
      cmykSub: "Bosma bo'yoq kanallari",
      tacTitle: "Bo'yoq qoplamasi (TAC)",
      tacSafe: "Ofset uchun xavfsiz (≤ 300%)",
      tacWarning: "Yuqori qoplama (> 300%)",
      pantoneTitle: "Yaqin Pantone",
      pantoneSub: `Moslik ${closestPantone.score}%`,
    },
    en: {
      success: "Color successfully converted to CMYK",
      copy: "Copy CMYK",
      copied: "Copied!",
      cmykTitle: "CMYK Model",
      cmykSub: "Print ink separation channels",
      tacTitle: "Total Ink Coverage (TAC)",
      tacSafe: "Safe for offset (≤ 300%)",
      tacWarning: "High coverage (> 300%)",
      pantoneTitle: "Closest Pantone",
      pantoneSub: `Match score: ${closestPantone.score}%`,
    },
  }[locale as "ru" | "uz" | "en"] || {
    success: "Color successfully converted to CMYK",
    copy: "Copy CMYK",
    copied: "Copied!",
    cmykTitle: "CMYK Model",
    cmykSub: "Print separation channels",
    tacTitle: "Total Ink Coverage (TAC)",
    tacSafe: "Safe for offset (≤ 300%)",
    tacWarning: "High coverage (> 300%)",
    pantoneTitle: "Closest Pantone",
    pantoneSub: `Match ${closestPantone.score}%`,
  };

  const isSafe = coverage <= 300;

  return (
    <div className="flex flex-col gap-3">
      {/* Success Notification Bar */}
      <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-xl px-4 py-3 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300 transition-colors">
        <div className="flex items-center gap-2 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>{labels.success}</span>
        </div>
        <button
          type="button"
          onClick={onCopyAll}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-600 dark:bg-emerald-700 text-white hover:bg-emerald-700 dark:hover:bg-emerald-600 text-[11px] font-semibold transition-all shadow-2xs"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? labels.copied : labels.copy}</span>
        </button>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Card 1: CMYK Values */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3.5 flex flex-col justify-between shadow-2xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[11px] font-medium tracking-wide uppercase">{labels.cmykTitle}</span>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400" title="Cyan" />
              <span className="w-2 h-2 rounded-full bg-pink-500" title="Magenta" />
              <span className="w-2 h-2 rounded-full bg-yellow-400" title="Yellow" />
              <span className="w-2 h-2 rounded-full bg-slate-900 dark:bg-slate-300" title="Key/Black" />
            </div>
          </div>
          <div className="mt-2">
            <div className="font-heading font-black text-slate-900 dark:text-slate-100 flex items-baseline gap-1.5 text-sm sm:text-base">
              <span>C{cmyk.c}</span>
              <span>M{cmyk.m}</span>
              <span>Y{cmyk.y}</span>
              <span>K{cmyk.k}</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight truncate">
              {labels.cmykSub}
            </p>
          </div>
        </div>

        {/* Card 2: TAC Ink Coverage */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3.5 flex flex-col justify-between shadow-2xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[11px] font-medium tracking-wide uppercase">{labels.tacTitle}</span>
            {isSafe ? (
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            )}
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1">
              <span className={`font-heading text-xl sm:text-2xl font-black ${isSafe ? "text-slate-900 dark:text-slate-100" : "text-amber-600 dark:text-amber-400"}`}>
                {coverage}%
              </span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isSafe ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300" : "bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300"}`}>
                {isSafe ? "SAFE" : "HIGH"}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight truncate">
              {isSafe ? labels.tacSafe : labels.tacWarning}
            </p>
          </div>
        </div>

        {/* Card 3: Closest Pantone */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3.5 flex flex-col justify-between shadow-2xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[11px] font-medium tracking-wide uppercase">{labels.pantoneTitle}</span>
            <Palette className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2">
            <span className="font-heading text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 block truncate">
              {closestPantone.code}
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight truncate">
              {labels.pantoneSub} · {closestPantone.name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
