import React from "react";
import { Download, Sparkles, Image as ImageIcon, Minimize2, Percent, Check } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface MetricsCardsProps {
  hasImage: boolean;
  sourceDim: { width: number; height: number };
  sourceBytes: string;
  resultDim: { width: number; height: number };
  resultBytes: string;
  savingPercent: number;
  formatLabel: string;
  onDownload: () => void;
}

export const ImageMetricsCards: React.FC<MetricsCardsProps> = ({
  hasImage,
  sourceDim,
  sourceBytes,
  resultDim,
  resultBytes,
  savingPercent,
  formatLabel,
  onDownload,
}) => {
  const { locale } = useI18n();

  const labels = {
    ru: {
      success: "Изображение готово к скачиванию",
      download: "Скачать результат",
      sourceTitle: "Исходный файл",
      sourceSub: sourceDim.width ? `${sourceDim.width} × ${sourceDim.height} px` : "Не загружено",
      resultTitle: "Новый результат",
      resultSub: resultDim.width ? `${resultDim.width} × ${resultDim.height} px (${formatLabel})` : "Ожидание",
      savingTitle: "Сжатие / Экономия",
      savingSub: savingPercent > 0 ? "Уменьшение веса файла" : "Оптимальное качество",
    },
    uz: {
      success: "Rasm yuklab olishga tayyor",
      download: "Natijani yuklash",
      sourceTitle: "Asl fayl",
      sourceSub: sourceDim.width ? `${sourceDim.width} × ${sourceDim.height} px` : "Yuklanmagan",
      resultTitle: "Yangi natija",
      resultSub: resultDim.width ? `${resultDim.width} × ${resultDim.height} px (${formatLabel})` : "Kutilmoqda",
      savingTitle: "Siqilish / Tejash",
      savingSub: savingPercent > 0 ? "Hajmni qisqartirish" : "Optimal sifat",
    },
    en: {
      success: "Image is ready for download",
      download: "Download image",
      sourceTitle: "Original File",
      sourceSub: sourceDim.width ? `${sourceDim.width} × ${sourceDim.height} px` : "Not uploaded",
      resultTitle: "Processed Result",
      resultSub: resultDim.width ? `${resultDim.width} × ${resultDim.height} px (${formatLabel})` : "Pending",
      savingTitle: "Compression",
      savingSub: savingPercent > 0 ? "Size reduction" : "Optimal quality",
    },
  }[locale as "ru" | "uz" | "en"] || {
    success: "Image is ready for download",
    download: "Download image",
    sourceTitle: "Original File",
    sourceSub: sourceDim.width ? `${sourceDim.width} × ${sourceDim.height} px` : "Not uploaded",
    resultTitle: "Processed Result",
    resultSub: resultDim.width ? `${resultDim.width} × ${resultDim.height} px (${formatLabel})` : "Pending",
    savingTitle: "Compression",
    savingSub: savingPercent > 0 ? "Size reduction" : "Optimal quality",
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Success Notification Bar */}
      {hasImage && (
        <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-xl px-4 py-3 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300 transition-colors">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{labels.success}</span>
          </div>
          <button
            type="button"
            onClick={onDownload}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-600 dark:bg-emerald-700 text-white hover:bg-emerald-700 dark:hover:bg-emerald-600 text-[11px] font-semibold transition-all shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{labels.download}</span>
          </button>
        </div>
      )}

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Card 1: Source */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3.5 flex flex-col justify-between shadow-2xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[11px] font-medium tracking-wide uppercase">{labels.sourceTitle}</span>
            <ImageIcon className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2">
            <div className="font-heading text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 truncate">
              {sourceBytes || "0 KB"}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight truncate">
              {labels.sourceSub}
            </p>
          </div>
        </div>

        {/* Card 2: Result */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3.5 flex flex-col justify-between shadow-2xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[11px] font-medium tracking-wide uppercase">{labels.resultTitle}</span>
            <Minimize2 className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2">
            <div className="font-heading text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 truncate">
              {resultBytes || "0 KB"}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight truncate">
              {labels.resultSub}
            </p>
          </div>
        </div>

        {/* Card 3: Compression Saving */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3.5 flex flex-col justify-between shadow-2xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[11px] font-medium tracking-wide uppercase">{labels.savingTitle}</span>
            <Percent className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1">
              <span className={`font-heading text-lg sm:text-xl font-black ${savingPercent > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-slate-900 dark:text-slate-100"}`}>
                {savingPercent > 0 ? `-${savingPercent}%` : "0%"}
              </span>
              {savingPercent > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300">
                  SAVE
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight truncate">
              {labels.savingSub}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
