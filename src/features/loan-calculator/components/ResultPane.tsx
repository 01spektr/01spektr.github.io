import React, { useState } from "react";
import {
  Copy,
  Download,
  Check,
  FileText,
  ChevronDown,
  Printer,
  FileSpreadsheet,
  ChevronUp,
  BarChart2,
} from "lucide-react";
import { LoanCalculationResult, LoanParams, Currency } from "../types";
import { formatCurrencyNumber } from "../utils/loanCalculations";
import { formatAmountInWords } from "../utils/numberToWords";
import { PaymentChart } from "./PaymentChart";
import { AmortizationTable } from "./AmortizationTable";
import { useLanguage } from "../context/LanguageContext";

interface ResultPaneProps {
  params: LoanParams;
  result: LoanCalculationResult;
  currency: Currency;
  onCopyAll: () => void;
  onExportPDF: () => void;
}

export const ResultPane: React.FC<ResultPaneProps> = ({
  params,
  result,
  currency,
  onCopyAll,
  onExportPDF,
}) => {
  const { t, language } = useLanguage();
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);

  const isAnnuity = params.paymentType === "annuity";
  const sumInWords = formatAmountInWords(result.totalPayment, currency, language);

  const handleCopy = () => {
    onCopyAll();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportCSV = () => {
    const headers = [
      t.chart.month,
      `${t.chart.payment} (${currency})`,
      `${t.chart.principal} (${currency})`,
      `${t.chart.interest} (${currency})`,
      `${t.chart.balance} (${currency})`,
    ];
    const rows = result.schedule.map((item) => [
      item.month,
      Math.round(item.payment),
      Math.round(item.principal),
      Math.round(item.interest),
      Math.round(item.remainingBalance),
    ]);
    const csvContent =
      "\uFEFF" + [headers.join(";"), ...rows.map((row) => row.join(";"))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `kredit_${params.amount}_${params.currency}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setDownloadOpen(false);
  };

  const handlePrint = () => {
    window.print();
    setDownloadOpen(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xs space-y-4 sm:space-y-5 transition-colors">
      {/* Header: Результат + Кнопки Скопировать & Скачать */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
        <h2 className="font-heading text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 shrink-0">
          {t.result.title}
        </h2>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Button: Скопировать */}
          <button
            id="btn-copy-result"
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
            )}
            <span>{copied ? t.result.copied : t.result.copy}</span>
          </button>

          {/* Button: Скачать v */}
          <div className="relative">
            <button
              id="btn-download-menu"
              type="button"
              onClick={() => setDownloadOpen(!downloadOpen)}
              className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
              <span>{t.result.download}</span>
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
            </button>

            {downloadOpen && (
              <div className="absolute right-0 mt-1 w-44 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg py-1.5 z-50 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setDownloadOpen(false);
                    onExportPDF();
                  }}
                  className="w-full px-3 py-2 text-left font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-rose-500" />
                  <span>{t.result.exportPdf}</span>
                </button>
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="w-full px-3 py-2 text-left font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{t.result.exportCsv}</span>
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="w-full px-3 py-2 text-left font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>{t.result.printReport}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success banner: ✓ Расчёт выполнен успешно! */}
      <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800/60 rounded-xl py-2 px-3.5 flex items-center gap-2 text-xs font-medium text-emerald-800 dark:text-emerald-300">
        <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
          <Check className="w-2.5 h-2.5 stroke-[3]" />
        </div>
        <span className="font-heading font-semibold text-[13px]">{t.result.successBanner}</span>
      </div>

      {/* 3 Metric Cards in a row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {/* Card 1: Ежемесячный платёж */}
        <div className="bg-slate-50/70 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 rounded-xl p-3 sm:p-3.5">
          <span className="font-heading text-[11px] font-semibold text-slate-500 dark:text-slate-400 block leading-tight">
            {t.result.monthlyPayment}
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="font-heading text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              {formatCurrencyNumber(result.monthlyPayment, params.roundToInteger)}
            </span>
            <span className="font-heading text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
              {currency}
            </span>
          </div>
          {!isAnnuity && (
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5 font-body">
              {t.result.differentiatedNote}
            </span>
          )}
        </div>

        {/* Card 2: Переплата */}
        <div className="bg-blue-50/40 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 rounded-xl p-3 sm:p-3.5">
          <span className="font-heading text-[11px] font-semibold text-blue-700 dark:text-blue-300 block leading-tight">
            {t.result.overpayment} ({params.interestRate}%)
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="font-heading text-lg sm:text-xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight">
              {formatCurrencyNumber(result.overpayment, params.roundToInteger)}
            </span>
            <span className="font-heading text-xs font-bold text-blue-500 dark:text-blue-400 uppercase">
              {currency}
            </span>
          </div>
          <span className="text-[10px] text-blue-600/70 dark:text-blue-400/70 block mt-0.5 font-body">
            {result.overpaymentPercentage.toFixed(1)}
            {t.result.ofAmount}
          </span>
        </div>

        {/* Card 3: Итого выплат */}
        <div className="bg-emerald-50/50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 rounded-xl p-3 sm:p-3.5">
          <span className="font-heading text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 block leading-tight">
            {t.result.totalWithInterest}
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="font-heading text-lg sm:text-xl font-extrabold text-emerald-700 dark:text-emerald-400 tracking-tight">
              {formatCurrencyNumber(result.totalPayment, params.roundToInteger)}
            </span>
            <span className="font-heading text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">
              {currency}
            </span>
          </div>
          <span className="text-[10px] text-emerald-600/70 dark:text-emerald-400/70 block mt-0.5 font-body">
            {t.result.effectiveApr}
          </span>
        </div>
      </div>

      {/* ДЕТАЛИЗАЦИЯ РАСЧЁТА (Table) */}
      <div>
        <h3 className="font-heading text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
          {t.result.detailsTitle}
        </h3>

        <div className="border border-slate-200/90 dark:border-slate-800 rounded-xl overflow-hidden text-xs">
          <div className="bg-slate-50/80 dark:bg-slate-800/80 px-3.5 py-2 font-heading font-semibold text-slate-600 dark:text-slate-300 flex justify-between border-b border-slate-200/80 dark:border-slate-800 text-[11px]">
            <span>{t.result.indicatorCol}</span>
            <span>{t.result.valueCol}</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 font-body">
            <div className="px-3.5 py-2 flex justify-between items-center hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
              <span className="text-slate-600 dark:text-slate-400">{t.result.loanAmount}</span>
              <span className="font-heading font-bold text-slate-900 dark:text-slate-100">
                {formatCurrencyNumber(params.amount, params.roundToInteger)} {currency}
              </span>
            </div>

            {params.downPayment > 0 && (
              <div className="px-3.5 py-2 flex justify-between items-center hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                <span className="text-slate-600 dark:text-slate-400">{t.result.downPayment}</span>
                <span className="font-heading font-semibold text-slate-700 dark:text-slate-300">
                  {formatCurrencyNumber(params.downPayment, params.roundToInteger)} {currency}
                </span>
              </div>
            )}

            <div className="px-3.5 py-2 flex justify-between items-center hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
              <span className="text-slate-600 dark:text-slate-400">{t.result.loanTerm}</span>
              <span className="font-heading font-semibold text-slate-800 dark:text-slate-200">
                {params.termMonths} {t.result.monthsWord} (
                {(params.termMonths / 12).toFixed(params.termMonths % 12 === 0 ? 0 : 1)}{" "}
                {t.form.yearsUnit})
              </span>
            </div>

            <div className="px-3.5 py-2 flex justify-between items-center hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
              <span className="text-slate-600 dark:text-slate-400">{t.form.interestRate}</span>
              <span className="font-heading font-bold text-slate-800 dark:text-slate-200">
                {params.interestRate.toFixed(2)}
                {t.result.ratePerAnnum}
              </span>
            </div>

            <div className="px-3.5 py-2 flex justify-between items-center hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
              <span className="text-slate-600 dark:text-slate-400">{t.result.paymentType}</span>
              <span className="font-heading font-semibold text-slate-800 dark:text-slate-200">
                {isAnnuity ? t.result.annuityFull : t.result.diffFull}
              </span>
            </div>

            <div className="px-3.5 py-2 flex justify-between items-center hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
              <span className="text-slate-600 dark:text-slate-400">{t.result.overpaymentSum}</span>
              <span className="font-heading font-bold text-blue-600 dark:text-blue-400">
                {formatCurrencyNumber(result.overpayment, params.roundToInteger)} {currency}
              </span>
            </div>

            <div className="px-3.5 py-2.5 flex justify-between items-center bg-slate-50/40 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors">
              <span className="font-heading font-bold text-slate-900 dark:text-slate-100">
                {t.result.totalToRepay}
              </span>
              <span className="font-heading font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                {formatCurrencyNumber(result.totalPayment, params.roundToInteger)} {currency}
              </span>
            </div>

            <div className="px-3.5 py-2 flex justify-between items-center hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
              <span className="text-slate-500 dark:text-slate-400">{t.result.purposeOrName}</span>
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                {params.purpose || t.result.defaultPurpose}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* СУММА ПРОПИСЬЮ */}
      <div className="bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 rounded-xl p-3.5 text-xs text-slate-700 dark:text-slate-300">
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mb-1">
          <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span className="font-heading text-[11px] font-semibold">{t.result.amountInWords}</span>
        </div>
        <p className="font-body text-slate-800 dark:text-slate-200 leading-snug pl-5 font-medium">
          {sumInWords}
        </p>
      </div>

      {/* ФОРМУЛА РАСЧЁТА */}
      <div className="bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 rounded-xl p-3.5 text-xs">
        <h4 className="font-heading text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
          {t.result.formulaTitle}
        </h4>
        <div className="font-heading font-bold text-slate-800 dark:text-slate-200 text-[12px] leading-tight font-mono">
          {isAnnuity ? (
            <>P = S × (r × (1 + r)ⁿ) / ((1 + r)ⁿ - 1)</>
          ) : (
            <>P = (S / n) + (Balance × r)</>
          )}
        </div>
        <p className="font-body text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
          {isAnnuity ? (
            <>
              {t.result.inYourCase} {formatCurrencyNumber(params.amount)} × (
              {(params.interestRate / 100 / 12).toFixed(4)} ×{" "}
              {Math.pow(1 + params.interestRate / 100 / 12, params.termMonths).toFixed(3)}) / ... ={" "}
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {formatCurrencyNumber(result.monthlyPayment)} {currency}
              </span>
            </>
          ) : (
            <>
              {t.result.inYourCase} {t.result.firstMonth} ={" "}
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {formatCurrencyNumber(result.firstMonthlyPayment)} {currency}
              </span>
              , {t.result.lastMonth} ={" "}
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {formatCurrencyNumber(result.lastMonthlyPayment)} {currency}
              </span>
            </>
          )}
        </p>
      </div>

      {/* Button to toggle Chart & Amortization schedule */}
      <div>
        <button
          id="btn-toggle-schedule-view"
          type="button"
          onClick={() => setShowSchedule(!showSchedule)}
          className="w-full py-2.5 px-3.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200/80 dark:border-slate-700 rounded-xl text-xs font-heading font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-between transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>{showSchedule ? t.result.toggleScheduleHide : t.result.toggleScheduleShow}</span>
          </div>
          {showSchedule ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {showSchedule && (
          <div className="mt-4 space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            <PaymentChart schedule={result.schedule} currency={currency} />
            <AmortizationTable
              schedule={result.schedule}
              currency={currency}
              principalAmount={result.principalAmount}
              totalPayment={result.totalPayment}
              overpayment={result.overpayment}
              onExportPDF={onExportPDF}
            />
          </div>
        )}
      </div>
    </div>
  );
};
