import React, { useState } from "react";
import { Check, Copy, Database, ShieldAlert, Sparkles, CheckCircle2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import type { ContrastLevel } from "../contrast";
import { effectiveEcc, type QrState } from "../state";

interface MetricsCardsProps {
  state: QrState;
  payloadLength: number;
  contrast: ContrastLevel;
  error: string | null;
  empty: boolean;
  onCopyAll: () => void;
}

export const QrMetricsCards: React.FC<MetricsCardsProps> = ({
  state,
  payloadLength,
  contrast,
  error,
  empty,
  onCopyAll,
}) => {
  const { locale } = useI18n();
  const [copied, setCopied] = useState(false);
  const ecc = effectiveEcc(state);

  const labels = {
    ru: {
      success: "QR-код готов к печати и сканированию",
      warning: "Проверьте контрастность или объём данных",
      empty: "Введите данные для создания QR-кода",
      copy: "Копировать",
      copied: "Скопировано!",
      dataSize: "Объём данных",
      dataSizeSub: `${payloadLength} симв. (тип: ${state.type.toUpperCase()})`,
      ecc: "Коррекция ошибок",
      eccSub: `Уровень ${ecc} (${ecc === "H" ? "до 30%" : ecc === "Q" ? "до 25%" : ecc === "M" ? "до 15%" : "до 7%"})`,
      readability: "Читаемость",
      readGood: "Отличная",
      readWarn: "Средний контраст",
      readBad: "Низкий контраст",
      readSub: `${state.size}×${state.size} px`,
    },
    uz: {
      success: "QR-kod chop etish va skanerlashga tayyor",
      warning: "Kontrast yoki ma'lumot hajmini tekshiring",
      empty: "QR-kod yaratish uchun ma'lumot kiriting",
      copy: "Nusxalash",
      copied: "Nusxalandi!",
      dataSize: "Ma'lumot hajmi",
      dataSizeSub: `${payloadLength} belgi (turi: ${state.type.toUpperCase()})`,
      ecc: "Xatolarni tuzatish",
      eccSub: `Daraja ${ecc}`,
      readability: "O'qilish sifati",
      readGood: "A'lo darajada",
      readWarn: "O'rtacha kontrast",
      readBad: "Past kontrast",
      readSub: `${state.size}×${state.size} px`,
    },
    en: {
      success: "QR code is ready for scanning and printing",
      warning: "Check color contrast or payload length",
      empty: "Enter data to generate QR code",
      copy: "Copy",
      copied: "Copied!",
      dataSize: "Payload Size",
      dataSizeSub: `${payloadLength} chars (${state.type.toUpperCase()})`,
      ecc: "Error Correction",
      eccSub: `Level ${ecc} (${ecc === "H" ? "up to 30%" : ecc === "Q" ? "up to 25%" : ecc === "M" ? "up to 15%" : "up to 7%"})`,
      readability: "Scan Reliability",
      readGood: "Optimal",
      readWarn: "Medium contrast",
      readBad: "Low contrast",
      readSub: `${state.size}×${state.size} px`,
    },
  }[locale as "ru" | "uz" | "en"] || {
    success: "QR code is ready for scanning and printing",
    warning: "Check color contrast or payload length",
    empty: "Enter data to generate QR code",
    copy: "Copy",
    copied: "Copied!",
    dataSize: "Payload Size",
    dataSizeSub: `${payloadLength} chars`,
    ecc: "Error Correction",
    eccSub: `Level ${ecc}`,
    readability: "Scan Reliability",
    readGood: "Optimal",
    readWarn: "Medium contrast",
    readBad: "Low contrast",
    readSub: `${state.size}×${state.size} px`,
  };

  const isGood = !empty && !error && contrast === "ok";
  const statusText = empty ? labels.empty : isGood ? labels.success : labels.warning;

  const readabilityText = contrast === "ok" ? labels.readGood : contrast === "warn" ? labels.readWarn : labels.readBad;
  const readabilityColor = contrast === "ok" ? "text-emerald-600 dark:text-emerald-400" : contrast === "warn" ? "text-amber-600 dark:text-amber-400" : "text-rose-600 dark:text-rose-400";

  return (
    <div className="flex flex-col gap-3">
      {/* Success / Warning banner with copy button matching loan-calculator */}
      <div
        className={`border rounded-xl py-2 px-3 sm:px-3.5 flex items-center justify-between gap-2 transition-colors ${
          isGood
            ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-800/60"
            : empty
            ? "bg-slate-50 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800"
            : "bg-amber-50 dark:bg-amber-950/40 border-amber-200/80 dark:border-amber-800/60"
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={`w-5 h-5 rounded-full text-white flex items-center justify-center shrink-0 ${
              isGood
                ? "bg-emerald-600"
                : empty
                ? "bg-slate-400"
                : "bg-amber-500"
            }`}
          >
            {isGood ? (
              <Check className="w-3 h-3 stroke-[3]" />
            ) : (
              <CheckCircle2 className="w-3 h-3 stroke-[2.5]" />
            )}
          </div>
          <span
            className={`text-xs sm:text-[13px] font-semibold truncate ${
              isGood
                ? "text-emerald-900 dark:text-emerald-200"
                : empty
                ? "text-slate-700 dark:text-slate-300"
                : "text-amber-900 dark:text-amber-200"
            }`}
          >
            {statusText}
          </span>
        </div>

        {!empty && (
          <button
            type="button"
            onClick={() => {
              onCopyAll();
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            )}
            <span>{copied ? labels.copied : labels.copy}</span>
          </button>
        )}
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {/* Card 1: Data Size */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {labels.dataSize}
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Database className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            {payloadLength}{" "}
            <span className="text-sm font-semibold text-slate-500">байт</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
            {labels.dataSizeSub}
          </p>
        </div>

        {/* Card 2: ECC Level */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {labels.ecc}
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-purple-600 dark:text-purple-400 tracking-tight">
            Level {ecc}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
            {labels.eccSub}
          </p>
        </div>

        {/* Card 3: Readability / Contrast */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {labels.readability}
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className={`text-xl sm:text-2xl font-black tracking-tight ${readabilityColor}`}>
            {readabilityText}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
            {labels.readSub}
          </p>
        </div>
      </div>
    </div>
  );
};
