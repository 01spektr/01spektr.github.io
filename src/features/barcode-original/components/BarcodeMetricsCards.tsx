import React, { useState } from "react";
import {
  Check,
  Copy,
  Barcode,
  Layers,
  FileCheck,
  CheckCircle2,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { BarcodeFormatInfo } from "../utils/barcode";

interface BarcodeMetricsCardsProps {
  format: BarcodeFormatInfo;
  inputValue: string;
  isValid: boolean;
  onCopyText: () => void;
}

export const BarcodeMetricsCards: React.FC<BarcodeMetricsCardsProps> = ({
  format,
  inputValue,
  isValid,
  onCopyText,
}) => {
  const { locale } = useI18n();
  const [copied, setCopied] = useState(false);

  const clean = inputValue.trim();
  const charsCount = clean.length;

  const labels = {
    ru: {
      statusSuccess: `Формат ${format.name} корректен и готов к экспорту`,
      statusError: `Требуется проверить данные для формата ${format.name}`,
      copyText: "Скопировать значение",
      copied: "Скопировано!",
      card1Title: "Активный формат",
      card1Sub: format.usage,
      card2Title: "Длина данных",
      card2Sub: `${charsCount} ${charsCount === 1 ? "знак" : charsCount < 5 ? "знака" : "знаков"} · Кодировка`,
      card3Title: "Статус валидации",
      card3Sub: isValid ? "Контрольная сумма верна" : "Ошибка формата",
      validStatus: "Соответствует GS1 / ISO",
      invalidStatus: "Требует исправления",
    },
    uz: {
      statusSuccess: `${format.name} formati to‘g‘ri va eksportga tayyor`,
      statusError: `${format.name} formati uchun ma’lumotlarni tekshiring`,
      copyText: "Qiymatni nusxalash",
      copied: "Nusxalandi!",
      card1Title: "Faol format",
      card1Sub: format.usage,
      card2Title: "Ma’lumot uzunligi",
      card2Sub: `${charsCount} ta belgi`,
      card3Title: "Tekshiruv holati",
      card3Sub: isValid ? "Nazorat soni to‘g‘ri" : "Format xatosi",
      validStatus: "GS1 / ISO mos keladi",
      invalidStatus: "Tuzatish talab etiladi",
    },
    en: {
      statusSuccess: `${format.name} format is valid and ready to export`,
      statusError: `Please verify data for ${format.name}`,
      copyText: "Copy Value",
      copied: "Copied!",
      card1Title: "Active Format",
      card1Sub: format.usage,
      card2Title: "Data Length",
      card2Sub: `${charsCount} ${charsCount === 1 ? "char" : "chars"} encoded`,
      card3Title: "Validation Status",
      card3Sub: isValid ? "Valid checksum" : "Format error",
      validStatus: "Complies with GS1 / ISO",
      invalidStatus: "Needs correction",
    },
  }[locale] || {
    statusSuccess: `${format.name} format is ready`,
    statusError: `Please check ${format.name} data`,
    copyText: "Copy Value",
    copied: "Copied!",
    card1Title: "Active Format",
    card1Sub: format.usage,
    card2Title: "Data Length",
    card2Sub: `${charsCount} chars`,
    card3Title: "Validation Status",
    card3Sub: isValid ? "Valid" : "Invalid",
    validStatus: "Valid",
    invalidStatus: "Needs check",
  };

  const handleCopy = () => {
    onCopyText();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-3 mb-5">
      {/* Status banner with quick copy action */}
      <div
        className={`border rounded-xl py-2 px-3 sm:px-3.5 flex items-center justify-between gap-2 transition-colors ${
          isValid
            ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-800/60"
            : "bg-amber-50 dark:bg-amber-950/40 border-amber-200/80 dark:border-amber-800/60"
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={`w-5 h-5 rounded-full text-white flex items-center justify-center shrink-0 ${
              isValid ? "bg-emerald-600" : "bg-amber-600"
            }`}
          >
            {isValid ? (
              <Check className="w-3 h-3 stroke-[3]" />
            ) : (
              <CheckCircle2 className="w-3 h-3 stroke-[2.5]" />
            )}
          </div>
          <span
            className={`text-xs sm:text-[13px] font-semibold truncate ${
              isValid
                ? "text-emerald-900 dark:text-emerald-200"
                : "text-amber-900 dark:text-amber-200"
            }`}
          >
            {isValid ? labels.statusSuccess : labels.statusError}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          )}
          <span>{copied ? labels.copied : labels.copyText}</span>
        </button>
      </div>

      {/* 3 Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {/* Card 1: Active Barcode Format */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-xs relative overflow-hidden transition-colors">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 font-inter">
              {labels.card1Title}
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Barcode className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight font-heading truncate">
            {format.name}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate font-inter">
            {labels.card1Sub}
          </p>
        </div>

        {/* Card 2: Encoded Data Characters */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-xs relative overflow-hidden transition-colors">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 font-inter">
              {labels.card2Title}
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Layers className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight font-heading">
            {charsCount}{" "}
            <span className="text-xs font-semibold text-slate-400">символов</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate font-inter">
            {labels.card2Sub}
          </p>
        </div>

        {/* Card 3: Validation & Checksum status */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-xs relative overflow-hidden transition-colors">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 font-inter">
              {labels.card3Title}
            </span>
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                isValid
                  ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400"
                  : "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400"
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div
            className={`text-base sm:text-lg font-black tracking-tight font-heading truncate ${
              isValid
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-amber-600 dark:text-amber-400"
            }`}
          >
            {isValid ? labels.validStatus : labels.invalidStatus}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate font-inter">
            {labels.card3Sub}
          </p>
        </div>
      </div>
    </div>
  );
};
