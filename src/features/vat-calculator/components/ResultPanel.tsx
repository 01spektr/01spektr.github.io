import React, { useState } from 'react';
import {
  Copy,
  Check,
  Download,
  FileSpreadsheet,
  FileDown,
  ChevronDown,
  CheckCircle2,
  Receipt,
  FileText,
  Loader2,
} from 'lucide-react';
import { CalculationResult } from '../types';
import { formatNumber } from '../utils/vatCalculations';
import { exportToExcel, getFormattedClipboardText, downloadPdfReport } from '../utils/exportUtils';
import { useApp } from '../context/AppContext';

interface ResultPanelProps {
  result: CalculationResult;
  showTableView: boolean;
}

export const ResultPanel: React.FC<ResultPanelProps> = ({
  result,
  showTableView,
}) => {
  const { t } = useApp();
  const [copied, setCopied] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleCopy = async () => {
    const text = getFormattedClipboardText(result);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExcelExport = () => {
    exportToExcel(result);
    setShowDownloadMenu(false);
  };

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    setShowDownloadMenu(false);
    try {
      await downloadPdfReport(result);
    } catch (e) {
      console.error('PDF export failed', e);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div id="result-section" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-6 shadow-2xs flex flex-col justify-between transition-colors">
      <div>
        {/* Header with Title & Action Buttons */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-montserrat truncate">
            {t('result.title')}
          </h2>

          <div className="flex items-center gap-1.5 sm:gap-2 relative shrink-0">
            {/* Copy Button */}
            <button
              type="button"
              onClick={handleCopy}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-1.5 rounded-lg border text-xs font-semibold font-montserrat transition-all cursor-pointer active:scale-95 ${
                copied
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>{t('result.copied')}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span>{t('result.copy')}</span>
                </>
              )}
            </button>

            {/* Download Dropdown */}
            <div className="relative">
              <button
                type="button"
                disabled={isGeneratingPdf}
                onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold font-montserrat transition-colors cursor-pointer disabled:opacity-50 active:scale-95"
              >
                {isGeneratingPdf ? (
                  <Loader2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                )}
                <span>{isGeneratingPdf ? t('result.generatingPdf') : t('result.download')}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showDownloadMenu && (
                <div className="absolute right-0 mt-1 w-56 sm:w-60 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-30 py-1.5 overflow-hidden animate-in fade-in slide-in-from-top-1">
                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    className="w-full px-3.5 py-2.5 text-left text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700/60 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <FileDown className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{t('result.downloadPdf')}</div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-400 font-inter">PDF Report</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={handleExcelExport}
                    className="w-full px-3.5 py-2.5 text-left text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700/60 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-2.5 transition-colors border-t border-slate-100 dark:border-slate-700 cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{t('result.exportCsv')}</div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-400 font-inter">CSV spreadsheet</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Success Banner */}
        <div className="mb-4 flex items-center gap-2 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-semibold font-montserrat">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="truncate">{t('result.success')}</span>
        </div>

        {/* 3 Metric Cards - Optimized for Mobile (2 side-by-side + 1 full-width Gross Total) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5 mb-5">
          {/* Card 1: Amount without VAT */}
          <div className="col-span-1 bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-xl p-2.5 sm:p-3 flex flex-col justify-center min-w-0">
            <div className="text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-0.5 sm:mb-1 truncate font-inter">
              {t('result.netAmount')}
            </div>
            <div className="flex items-baseline gap-1 overflow-hidden">
              <span className="text-sm sm:text-[17px] xl:text-xl font-bold font-montserrat text-slate-900 dark:text-white whitespace-nowrap tabular-nums tracking-tight truncate">
                {formatNumber(result.amountWithoutVat, 2, result.roundToTwoDecimals)}
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400 lowercase shrink-0 font-montserrat">
                {result.currency.toLowerCase()}
              </span>
            </div>
          </div>

          {/* Card 2: VAT Amount */}
          <div className="col-span-1 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 rounded-xl p-2.5 sm:p-3 flex flex-col justify-center min-w-0">
            <div className="text-[10px] sm:text-[11px] font-semibold text-blue-700 dark:text-blue-300 mb-0.5 sm:mb-1 truncate font-inter">
              {t('result.vatAmount')} ({result.vatRate}%)
            </div>
            <div className="flex items-baseline gap-1 overflow-hidden">
              <span className="text-sm sm:text-[17px] xl:text-xl font-bold font-montserrat text-blue-600 dark:text-blue-400 whitespace-nowrap tabular-nums tracking-tight truncate">
                {formatNumber(result.vatAmount, 2, result.roundToTwoDecimals)}
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold text-blue-500 dark:text-blue-400 lowercase shrink-0 font-montserrat">
                {result.currency.toLowerCase()}
              </span>
            </div>
          </div>

          {/* Card 3: Total with VAT */}
          <div className="col-span-2 sm:col-span-1 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/60 rounded-xl p-2.5 sm:p-3 flex flex-col justify-center min-w-0">
            <div className="text-[10px] sm:text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 mb-0.5 sm:mb-1 truncate font-inter">
              {t('result.grossTotal')}
            </div>
            <div className="flex items-baseline gap-1 overflow-hidden">
              <span className="text-base sm:text-[17px] xl:text-xl font-extrabold font-montserrat text-emerald-600 dark:text-emerald-400 whitespace-nowrap tabular-nums tracking-tight truncate">
                {formatNumber(result.totalWithVat, 2, result.roundToTwoDecimals)}
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 lowercase shrink-0 font-montserrat">
                {result.currency.toLowerCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Breakdown Table (Детализация расчёта) */}
        <div className="mb-5">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 font-montserrat">
            {t('result.detailsTitle')}
          </h3>

          <div className="border border-slate-200/90 dark:border-slate-700 rounded-xl overflow-hidden text-xs sm:text-sm">
            <div className="grid grid-cols-2 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 font-semibold text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 text-xs font-inter">
              <div>{t('result.metric')}</div>
              <div className="text-right">{t('result.value')}</div>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 font-inter">
              <div className="grid grid-cols-2 px-3.5 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                <div>{t('result.netAmount')}</div>
                <div className="text-right font-bold text-slate-900 dark:text-white whitespace-nowrap">
                  {formatNumber(result.amountWithoutVat, 2, result.roundToTwoDecimals)} {result.currency}
                </div>
              </div>

              <div className="grid grid-cols-2 px-3.5 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                <div>{t('result.vatRate')}</div>
                <div className="text-right font-bold text-slate-900 dark:text-white">
                  {result.vatRate}%
                </div>
              </div>

              <div className="grid grid-cols-2 px-3.5 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                <div>{t('result.vatAmount')}</div>
                <div className="text-right font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                  {formatNumber(result.vatAmount, 2, result.roundToTwoDecimals)} {result.currency}
                </div>
              </div>

              <div className="grid grid-cols-2 px-3.5 py-2 bg-slate-50/60 dark:bg-slate-800/60 text-slate-900 dark:text-white font-bold">
                <div>{t('result.grossTotal')}</div>
                <div className="text-right text-slate-900 dark:text-white whitespace-nowrap">
                  {formatNumber(result.totalWithVat, 2, result.roundToTwoDecimals)} {result.currency}
                </div>
              </div>

              {result.itemName && (
                <div className="grid grid-cols-2 px-3.5 py-2 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900">
                  <div>{t('result.item')}</div>
                  <div className="text-right font-medium text-slate-800 dark:text-slate-200 truncate">{result.itemName}</div>
                </div>
              )}

              {result.note && (
                <div className="grid grid-cols-2 px-3.5 py-2 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900">
                  <div>{t('result.noteLabel')}</div>
                  <div className="text-right font-medium text-slate-800 dark:text-slate-200 truncate">{result.note}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Invoice Table View when switch is on */}
        {showTableView && (
          <div className="mb-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5 font-montserrat">
                <Receipt className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                Line Item Summary
              </h3>
            </div>

            <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-x-auto">
              <table className="w-full text-left text-xs font-inter">
                <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold">
                  <tr>
                    <th className="py-2 px-3">#</th>
                    <th className="py-2 px-3">{t('result.item')}</th>
                    <th className="py-2 px-3">Qty</th>
                    <th className="py-2 px-3 text-right">{t('result.netAmount')}</th>
                    <th className="py-2 px-3 text-center">{t('result.vatRate')}</th>
                    <th className="py-2 px-3 text-right">{t('result.vatAmount')}</th>
                    <th className="py-2 px-3 text-right">{t('result.grossTotal')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  <tr>
                    <td className="py-2 px-3 font-medium">1</td>
                    <td className="py-2 px-3 font-semibold text-slate-900 dark:text-white">{result.itemName || t('result.defaultItemName')}</td>
                    <td className="py-2 px-3">1</td>
                    <td className="py-2 px-3 text-right whitespace-nowrap">{formatNumber(result.amountWithoutVat, 2, result.roundToTwoDecimals)}</td>
                    <td className="py-2 px-3 text-center font-medium text-blue-600 dark:text-blue-400">{result.vatRate}%</td>
                    <td className="py-2 px-3 text-right font-medium whitespace-nowrap">{formatNumber(result.vatAmount, 2, result.roundToTwoDecimals)}</td>
                    <td className="py-2 px-3 text-right font-bold text-slate-900 dark:text-white whitespace-nowrap">{formatNumber(result.totalWithVat, 2, result.roundToTwoDecimals)} {result.currency}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Сумма прописью */}
        <div className="mb-5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5 font-montserrat">
            <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            {t('result.inWordsTitle')}
          </div>
          <div className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 leading-snug font-inter">
            {result.amountInWords}
          </div>
        </div>

        {/* Formula Section */}
        <div>
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 font-montserrat">
            {t('result.formula')}
          </h3>

          <div className="bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100/90 dark:border-blue-900/60 rounded-xl p-3.5 text-center sm:text-left">
            <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight font-montserrat">
              {result.formulaEquation}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-mono font-inter">
              {result.formulaSubstituted}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

