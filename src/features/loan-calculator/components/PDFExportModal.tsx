import React, { useState } from "react";
import { X, Printer, Download, FileText, CheckCircle2, Loader2 } from "lucide-react";
import { LoanParams, LoanCalculationResult, Currency } from "../types";
import { formatCurrencyNumber } from "../utils/loanCalculations";
import { formatAmountInWords } from "../utils/numberToWords";
import { exportElementToPDF } from "../utils/pdfExport";
import { useLanguage } from "../context/LanguageContext";

interface PDFExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  params: LoanParams;
  result: LoanCalculationResult;
  currency: Currency;
}

export const PDFExportModal: React.FC<PDFExportModalProps> = ({
  isOpen,
  onClose,
  params,
  result,
  currency,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const { t, language } = useLanguage();

  if (!isOpen) return null;

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    const success = await exportElementToPDF(
      "pdf-printable-document",
      `raschet_kredita_${params.amount}_${params.currency}.pdf`,
    );
    setIsGenerating(false);
    if (success) {
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const isAnnuity = params.paymentType === "annuity";
  const localeStr = language === "ru" ? "ru-RU" : language === "uz" ? "uz-UZ" : "en-US";
  const todayStr = new Date().toLocaleDateString(localeStr, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full p-4 sm:p-6 relative max-h-[92vh] flex flex-col transition-colors">
        {/* Top Actions Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                {t.modals.pdfModalTitle}
              </h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-body">
                {t.modals.pdfModalSubtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Direct Download Button */}
            <button
              id="btn-trigger-pdf-download"
              type="button"
              disabled={isGenerating}
              onClick={handleDownloadPDF}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{t.modals.pdfGenerating}</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                  <span>{t.modals.pdfDownloaded}</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>{t.modals.pdfDownloadBtn}</span>
                </>
              )}
            </button>

            {/* Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              title={t.modals.pdfPrintBtn}
            >
              <Printer className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
              <span>{t.modals.pdfPrintBtn}</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Preview Area (Captured by html2canvas & jsPDF) */}
        <div className="overflow-y-auto mt-4 p-1 rounded-xl">
          <div
            id="pdf-printable-document"
            className="p-5 sm:p-7 bg-white rounded-xl border border-slate-200 space-y-4 text-xs font-body text-slate-800 shadow-2xs"
          >
            {/* Document Header */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-heading text-xs font-extrabold flex items-center justify-center">
                    T
                  </span>
                  <span className="font-heading font-extrabold text-base text-slate-900">
                    Toolboxi<span className="text-blue-600">.uz</span>
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">{t.modals.pdfServiceTag}</p>
              </div>
              <div className="text-right">
                <span className="font-heading font-bold text-slate-900 block text-xs tracking-tight">
                  {t.modals.pdfDocTitle}
                </span>
                <span className="text-[10px] text-slate-400 block font-mono mt-0.5">
                  {t.modals.pdfCreatedDate}: {todayStr}
                </span>
              </div>
            </div>

            {/* Section 1: Ключевые параметры кредитования */}
            <div>
              <h4 className="font-heading font-bold text-slate-900 text-xs uppercase tracking-wider mb-1.5">
                {t.modals.pdfSec1Title}
              </h4>
              <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-100 text-xs">
                <div className="grid grid-cols-2 p-2 px-3 bg-slate-50/50">
                  <span className="text-slate-500 font-medium">{t.result.loanAmount}:</span>
                  <span className="font-heading font-bold text-slate-900 text-right">
                    {formatCurrencyNumber(params.amount)} {currency}
                  </span>
                </div>
                {params.downPayment > 0 && (
                  <div className="grid grid-cols-2 p-2 px-3">
                    <span className="text-slate-500 font-medium">{t.result.downPayment}:</span>
                    <span className="font-heading font-semibold text-slate-800 text-right">
                      {formatCurrencyNumber(params.downPayment)} {currency}
                    </span>
                  </div>
                )}
                <div className="grid grid-cols-2 p-2 px-3">
                  <span className="text-slate-500 font-medium">{t.result.loanTerm}:</span>
                  <span className="font-heading font-semibold text-slate-800 text-right">
                    {params.termMonths} {t.result.monthsWord} (
                    {(params.termMonths / 12).toFixed(params.termMonths % 12 === 0 ? 0 : 1)}{" "}
                    {t.form.yearsUnit})
                  </span>
                </div>
                <div className="grid grid-cols-2 p-2 px-3 bg-slate-50/50">
                  <span className="text-slate-500 font-medium">{t.result.ratePerAnnum}:</span>
                  <span className="font-heading font-bold text-slate-900 text-right">
                    {params.interestRate.toFixed(2)}%
                  </span>
                </div>
                <div className="grid grid-cols-2 p-2 px-3">
                  <span className="text-slate-500 font-medium">{t.result.paymentType}:</span>
                  <span className="font-heading font-semibold text-slate-800 text-right">
                    {isAnnuity ? t.result.annuityFull : t.result.diffFull}
                  </span>
                </div>
                <div className="grid grid-cols-2 p-2 px-3">
                  <span className="text-slate-500 font-medium">{t.result.purposeOrName}:</span>
                  <span className="font-heading font-medium text-slate-700 text-right">
                    {params.purpose || t.result.defaultPurpose}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 2: Итоги расчёта */}
            <div>
              <h4 className="font-heading font-bold text-slate-900 text-xs uppercase tracking-wider mb-1.5">
                {t.modals.pdfSec2Title}
              </h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[10px] text-slate-500 font-medium block">
                    {t.result.monthlyPayment}:
                  </span>
                  <span className="font-heading text-sm font-extrabold text-blue-600 block mt-0.5">
                    {formatCurrencyNumber(result.monthlyPayment)} {currency}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[10px] text-slate-500 font-medium block">
                    {t.result.overpayment}:
                  </span>
                  <span className="font-heading text-sm font-extrabold text-slate-900 block mt-0.5">
                    {formatCurrencyNumber(result.overpayment)} {currency}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[10px] text-slate-500 font-medium block">
                    {t.result.totalWithInterest}:
                  </span>
                  <span className="font-heading text-sm font-extrabold text-emerald-700 block mt-0.5">
                    {formatCurrencyNumber(result.totalPayment)} {currency}
                  </span>
                </div>
              </div>
            </div>

            {/* Сумма прописью */}
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="font-heading font-bold text-slate-700 text-[10px] uppercase tracking-wide block mb-0.5">
                {t.result.amountInWords}:
              </span>
              <p className="italic text-slate-800 font-medium text-xs">
                {formatAmountInWords(result.totalPayment, currency, language)}
              </p>
            </div>

            {/* Section 3: График платежей */}
            <div>
              <h4 className="font-heading font-bold text-slate-900 text-xs uppercase tracking-wider mb-1.5">
                {t.modals.pdfSec3Title}
              </h4>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-100 font-heading font-semibold text-slate-700 border-b border-slate-200">
                    <tr>
                      <th className="py-1 px-2.5 text-center w-12">{t.table.colNum}</th>
                      <th className="py-1 px-2.5">{t.table.colPayment}</th>
                      <th className="py-1 px-2.5">{t.table.colPrincipal}</th>
                      <th className="py-1 px-2.5">{t.table.colInterest}</th>
                      <th className="py-1 px-2.5 text-right">{t.table.colBalance}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[10px]">
                    {result.schedule.slice(0, 12).map((item) => (
                      <tr key={item.month} className="hover:bg-slate-50/50">
                        <td className="py-1 px-2.5 text-center text-slate-400 font-medium">
                          {item.month}
                        </td>
                        <td className="py-1 px-2.5 font-semibold text-slate-900">
                          {formatCurrencyNumber(item.payment)}
                        </td>
                        <td className="py-1 px-2.5 text-blue-700 font-medium">
                          {formatCurrencyNumber(item.principal)}
                        </td>
                        <td className="py-1 px-2.5 text-amber-600 font-medium">
                          {formatCurrencyNumber(item.interest)}
                        </td>
                        <td className="py-1 px-2.5 text-right text-slate-600">
                          {formatCurrencyNumber(item.remainingBalance)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {result.schedule.length > 12 && (
                  <div className="p-1.5 text-center text-[10px] text-slate-400 bg-slate-50 border-t border-slate-100">
                    {t.modals.pdfFirst12Months} ({result.schedule.length} {t.form.monthsUnit})
                  </div>
                )}
              </div>
            </div>

            {/* Footer Notice */}
            <div className="text-[9px] text-slate-400 border-t border-slate-100 pt-2 flex justify-between items-center">
              <span>{t.modals.pdfDisclaimer}</span>
              <span className="font-mono">Toolboxi.uz</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
