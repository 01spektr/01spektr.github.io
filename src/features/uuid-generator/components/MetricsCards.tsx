import React from "react";
import { KeyRound, Binary, ShieldCheck, Check, Copy, Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface MetricsCardsProps {
  count: number;
  format: "standard" | "compact";
  uppercase: boolean;
  currentUuid: string | undefined;
  onCopySingle: () => void;
  singleCopied: boolean;
}

export const UuidMetricsCards: React.FC<MetricsCardsProps> = ({
  count,
  format,
  uppercase,
  currentUuid,
  onCopySingle,
  singleCopied,
}) => {
  const { locale } = useI18n();

  const labels = {
    ru: {
      success: "UUID v4 успешно сгенерирован",
      copyCurrent: "Копировать",
      copied: "Скопировано!",
      countLabel: "Количество",
      countSub: "в текущей пачке",
      itemsUnit: "шт.",
      formatLabel: "Формат",
      formatStandard: "Стандартный",
      formatCompact: "Без дефисов",
      formatLen: (len: number) => `${len} символов, ${uppercase ? "UPPER" : "lower"}`,
      securityLabel: "Криптостойкость",
      securityValue: "128 бит",
      securitySub: "CSPRNG (crypto.randomUUID)",
    },
    uz: {
      success: "UUID v4 muvaffaqiyatli yaratildi",
      copyCurrent: "Nusxalash",
      copied: "Nusxalandi!",
      countLabel: "Miqdor",
      countSub: "joriy to'plamda",
      itemsUnit: "dona",
      formatLabel: "Format",
      formatStandard: "Standart",
      formatCompact: "Chiziqlarsiz",
      formatLen: (len: number) => `${len} belgi, ${uppercase ? "UPPER" : "lower"}`,
      securityLabel: "Xavfsizlik",
      securityValue: "128 bit",
      securitySub: "CSPRNG (crypto.randomUUID)",
    },
    en: {
      success: "UUID v4 generated successfully",
      copyCurrent: "Copy",
      copied: "Copied!",
      countLabel: "Quantity",
      countSub: "in current batch",
      itemsUnit: "pcs",
      formatLabel: "Format",
      formatStandard: "Standard",
      formatCompact: "No hyphens",
      formatLen: (len: number) => `${len} chars, ${uppercase ? "UPPER" : "lower"}`,
      securityLabel: "Security",
      securityValue: "128-bit",
      securitySub: "CSPRNG (crypto.randomUUID)",
    },
  }[locale as "ru" | "uz" | "en"] || {
    success: "UUID v4 generated successfully",
    copyCurrent: "Copy",
    copied: "Copied!",
    countLabel: "Quantity",
    countSub: "in current batch",
    itemsUnit: "pcs",
    formatLabel: "Format",
    formatStandard: "Standard",
    formatCompact: "No hyphens",
    formatLen: (len: number) => `${len} chars, ${uppercase ? "UPPER" : "lower"}`,
    securityLabel: "Security",
    securityValue: "128-bit",
    securitySub: "CSPRNG (crypto.randomUUID)",
  };

  const charLength = format === "standard" ? 36 : 32;

  return (
    <div className="flex flex-col gap-3">
      {/* Success Notification Bar */}
      {currentUuid && (
        <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-xl px-4 py-3 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300 transition-colors">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{labels.success}</span>
          </div>
          <button
            type="button"
            onClick={onCopySingle}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-600 dark:bg-emerald-700 text-white hover:bg-emerald-700 dark:hover:bg-emerald-600 text-[11px] font-semibold transition-all shadow-2xs"
          >
            {singleCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{singleCopied ? labels.copied : labels.copyCurrent}</span>
          </button>
        </div>
      )}

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Card 1: Quantity */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3.5 flex flex-col justify-between shadow-2xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[11px] font-medium tracking-wide uppercase">{labels.countLabel}</span>
            <KeyRound className="w-4 h-4 text-violet-500" />
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1">
              <span className="font-heading text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                {count}
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {labels.itemsUnit}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
              {labels.countSub}
            </p>
          </div>
        </div>

        {/* Card 2: Format */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3.5 flex flex-col justify-between shadow-2xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[11px] font-medium tracking-wide uppercase">{labels.formatLabel}</span>
            <Binary className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2">
            <span className="font-heading text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 block truncate">
              {format === "standard" ? labels.formatStandard : labels.formatCompact}
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight truncate">
              {labels.formatLen(charLength)}
            </p>
          </div>
        </div>

        {/* Card 3: Security */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3.5 flex flex-col justify-between shadow-2xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[11px] font-medium tracking-wide uppercase">{labels.securityLabel}</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2">
            <span className="font-heading text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 block">
              {labels.securityValue}
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight truncate">
              {labels.securitySub}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
