import React, { useState } from "react";
import {
  X,
  Download,
  FileText,
  FileCode,
  Layers,
  Copy,
  Check,
  Printer,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { RGB, CMYK, PantoneMatch, PaperType } from "../types";
import { rgbToHex, getTotalInkCoverage } from "../utils/colorConversion";
import { exportToPdf, downloadSvg, exportToEps, generateVectorSvg } from "../utils/vectorExport";
import { useI18n } from "@/lib/i18n";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  rgb: RGB;
  cmyk: CMYK;
  simulatedRgb: RGB;
  pantoneMatch?: PantoneMatch;
  paperType: PaperType;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  rgb,
  cmyk,
  simulatedRgb,
  pantoneMatch,
  paperType,
}) => {
  const { locale } = useI18n();
  const en = locale === "en";
  const [copiedSvg, setCopiedSvg] = useState(false);
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);

  if (!isOpen) return null;

  const hexString = rgbToHex(rgb);
  const tic = getTotalInkCoverage(cmyk);

  const handleDownloadPdf = () => {
    setDownloadingFormat("pdf");
    try {
      exportToPdf({
        rgb,
        cmyk,
        cmykSimulatedRgb: simulatedRgb,
        pantoneMatch,
        paperName:
          paperType === "coated" ? "Мелованная (ISO Coated v2)" : "Немелованная (PSO Uncoated)",
      });
    } finally {
      setTimeout(() => setDownloadingFormat(null), 800);
    }
  };

  const handleDownloadSvg = () => {
    setDownloadingFormat("svg");
    try {
      downloadSvg({
        rgb,
        cmyk,
        cmykSimulatedRgb: simulatedRgb,
        pantoneMatch,
      });
    } finally {
      setTimeout(() => setDownloadingFormat(null), 800);
    }
  };

  const handleDownloadEps = () => {
    setDownloadingFormat("eps");
    try {
      exportToEps({
        rgb,
        cmyk,
        cmykSimulatedRgb: simulatedRgb,
        pantoneMatch,
      });
    } finally {
      setTimeout(() => setDownloadingFormat(null), 800);
    }
  };

  const handleCopySvgCode = async () => {
    const svgCode = generateVectorSvg({
      rgb,
      cmyk,
      cmykSimulatedRgb: simulatedRgb,
      pantoneMatch,
    });
    try {
      await navigator.clipboard.writeText(svgCode);
      setCopiedSvg(true);
      setTimeout(() => setCopiedSvg(false), 2000);
    } catch {
      setCopiedSvg(true);
      setTimeout(() => setCopiedSvg(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="export-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="export-modal-content"
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden animate-scaleUp"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                {en ? "Export print specification" : "Экспорт спецификации для печати"}
              </h2>
              <p className="text-xs text-slate-500">
                {en
                  ? "Vector files and colour specifications for print production"
                  : "Векторные файлы и паспорта цвета для типографий и верстки"}
              </p>
            </div>
          </div>
          <button
            type="button"
            id="btn-close-export-modal"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Swatch Quick Overview */}
          <div className="flex items-center gap-4 bg-slate-50 border border-slate-200/80 rounded-xl p-3.5">
            <div
              className="w-14 h-14 rounded-lg shadow-inner border border-black/10 shrink-0"
              style={{ backgroundColor: hexString }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold text-slate-900">{hexString}</div>
                <div className="text-xs font-semibold text-slate-600">TIC: {tic}%</div>
              </div>
              <div className="text-xs text-slate-600 mt-0.5">
                CMYK:{" "}
                <span className="font-semibold text-slate-900">
                  {cmyk.c}%, {cmyk.m}%, {cmyk.y}%, {cmyk.k}%
                </span>
              </div>
              {pantoneMatch && (
                <div className="text-xs text-blue-700 font-medium flex items-center gap-1 mt-0.5">
                  <Sparkles className="w-3 h-3" />
                  <span>
                    {pantoneMatch.pantone.code} ({pantoneMatch.matchScore}% совпадение)
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Export Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* 1. PDF Spec Sheet */}
            <button
              type="button"
              id="modal-export-pdf"
              onClick={handleDownloadPdf}
              className="group p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/30 transition-all text-left flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                    A4 PDF
                  </span>
                </div>
                <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Паспорт цвета (PDF)
                </div>
                <div className="text-xs text-slate-500 mt-1 leading-snug">
                  Лист A4 с метками приводки, разбивкой каналов и суммой красок
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-blue-600">
                <Download className="w-3.5 h-3.5" />
                <span>
                  {downloadingFormat === "pdf"
                    ? en
                      ? "Downloading..."
                      : "Скачивание..."
                    : en
                      ? "Download PDF"
                      : "Скачать PDF"}
                </span>
              </div>
            </button>

            {/* 2. Vector SVG */}
            <button
              type="button"
              id="modal-export-svg"
              onClick={handleDownloadSvg}
              className="group p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/30 transition-all text-left flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <FileCode className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                    Вектор SVG
                  </span>
                </div>
                <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Векторный файл (SVG)
                </div>
                <div className="text-xs text-slate-500 mt-1 leading-snug">
                  Для Adobe Illustrator, Figma, CorelDRAW и вёрстки веб-макетов
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-blue-600">
                <Download className="w-3.5 h-3.5" />
                <span>
                  {downloadingFormat === "svg"
                    ? en
                      ? "Downloading..."
                      : "Скачивание..."
                    : en
                      ? "Download SVG"
                      : "Скачать SVG"}
                </span>
              </div>
            </button>

            {/* 3. Prepress EPS */}
            <button
              type="button"
              id="modal-export-eps"
              onClick={handleDownloadEps}
              className="group p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/30 transition-all text-left flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Layers className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                    PostScript EPS
                  </span>
                </div>
                <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Типографский EPS
                </div>
                <div className="text-xs text-slate-500 mt-1 leading-snug">
                  Encapsulated PostScript с встроенной CMYK-формулой для RIP
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-blue-600">
                <Download className="w-3.5 h-3.5" />
                <span>
                  {downloadingFormat === "eps"
                    ? en
                      ? "Downloading..."
                      : "Скачивание..."
                    : en
                      ? "Download EPS"
                      : "Скачать EPS"}
                </span>
              </div>
            </button>

            {/* 4. Copy SVG Code */}
            <button
              type="button"
              id="modal-export-copy-svg"
              onClick={handleCopySvgCode}
              className="group p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/30 transition-all text-left flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {copiedSvg ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Буфер обмена
                  </span>
                </div>
                <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {copiedSvg ? "Код скопирован!" : "Скопировать SVG-код"}
                </div>
                <div className="text-xs text-slate-500 mt-1 leading-snug">
                  Вставьте прямо в Illustrator, Figma или HTML-код через Ctrl+V
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-emerald-700">
                {copiedSvg ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSvg ? "Готово!" : "Копировать"}</span>
              </div>
            </button>
          </div>

          {/* Quick Print Banner */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                <Printer className="w-4 h-4" />
              </div>
              <div className="text-xs text-slate-600">
                <span className="font-semibold text-slate-900">Распечатать тестовый лист:</span>{" "}
                вывод на физический принтер для быстрой визуальной оценки
              </div>
            </div>
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 transition-colors shrink-0 cursor-pointer"
            >
              Печать
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Профиль: ISO Coated v2 / FOGRA39</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition-colors cursor-pointer"
          >
            {en ? "Close" : "Закрыть"}
          </button>
        </div>
      </div>
    </div>
  );
};
