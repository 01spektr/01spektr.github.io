import React, { useState } from "react";
import { Download, FileText, Filter } from "lucide-react";
import { PaymentScheduleItem, Currency } from "../types";
import { formatCurrencyNumber } from "../utils/loanCalculations";
import { useLanguage } from "../context/LanguageContext";

interface AmortizationTableProps {
  schedule: PaymentScheduleItem[];
  currency: Currency;
  principalAmount: number;
  totalPayment: number;
  overpayment: number;
  onExportPDF: () => void;
}

export const AmortizationTable: React.FC<AmortizationTableProps> = ({
  schedule,
  currency,
  principalAmount,
  totalPayment,
  overpayment,
  onExportPDF,
}) => {
  const { t } = useLanguage();
  const [selectedYear, setSelectedYear] = useState<number | "all">("all");

  const totalYears = Math.ceil(schedule.length / 12);
  const yearsList = Array.from({ length: totalYears }, (_, i) => i + 1);

  const filteredSchedule =
    selectedYear === "all"
      ? schedule
      : schedule.filter((item) => Math.ceil(item.month / 12) === selectedYear);

  const handleExportCSV = () => {
    const headers = [
      t.table.colNum,
      `${t.table.colPayment} (${currency})`,
      `${t.table.colPrincipal} (${currency})`,
      `${t.table.colInterest} (${currency})`,
      `${t.table.colBalance} (${currency})`,
    ];
    const rows = schedule.map((item) => [
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
    link.setAttribute("download", `grafik_platezhey_${schedule.length}_mesyacev.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-xs transition-colors">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="font-heading text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
            {t.table.title}
          </h3>
          <p className="font-body text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {t.table.subtitle} ({schedule.length} {t.form.monthsUnit})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Year Filter */}
          {totalYears > 1 && (
            <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-0.5 text-xs">
              <Filter className="w-3 h-3 text-slate-400 ml-1" />
              <button
                type="button"
                onClick={() => setSelectedYear("all")}
                className={`px-2 py-0.5 rounded text-[11px] font-medium cursor-pointer ${
                  selectedYear === "all"
                    ? "bg-white dark:bg-slate-700 shadow-2xs text-blue-600 dark:text-blue-400 font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                {t.table.allYears}
              </button>
              {yearsList.slice(0, 5).map((yr) => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => setSelectedYear(yr)}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-medium cursor-pointer ${
                    selectedYear === yr
                      ? "bg-white dark:bg-slate-700 shadow-2xs text-blue-600 dark:text-blue-400 font-bold"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  {yr} {t.table.yearSuffix}
                </button>
              ))}
            </div>
          )}

          {/* Export CSV */}
          <button
            id="btn-export-csv"
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>CSV</span>
          </button>

          {/* Button: Скачать в PDF */}
          <button
            id="btn-download-pdf-table"
            type="button"
            onClick={onExportPDF}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-2xs transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{t.table.exportPdf}</span>
          </button>
        </div>
      </div>

      {/* Mobile scroll hint */}
      <div className="sm:hidden mt-2 flex items-center justify-between text-[10px] text-blue-600 dark:text-blue-400 font-medium bg-blue-50/50 dark:bg-blue-950/30 px-2.5 py-1 rounded-lg border border-blue-100/50 dark:border-blue-900/40">
        <span>{t.mobile.swipeTableHint}</span>
      </div>

      {/* Table */}
      <div className="mt-2.5 overflow-x-auto max-h-[380px] rounded-xl border border-slate-200/80 dark:border-slate-800 scrollbar-thin">
        <table className="w-full text-left text-xs font-body">
          <thead className="sticky top-0 z-10 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-heading font-bold border-b border-slate-200 dark:border-slate-700 text-[11px]">
            <tr>
              <th className="py-2 px-3 w-14 text-center">{t.table.colNum}</th>
              <th className="py-2 px-3">{t.table.colPayment}</th>
              <th className="py-2 px-3">{t.table.colPrincipal}</th>
              <th className="py-2 px-3">{t.table.colInterest}</th>
              <th className="py-2 px-3 text-right">{t.table.colBalance}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredSchedule.map((item) => (
              <tr
                key={item.month}
                className="hover:bg-blue-50/40 dark:hover:bg-slate-800/60 transition-colors font-medium text-slate-700 dark:text-slate-300"
              >
                <td className="py-1.5 px-3 text-center text-slate-400 dark:text-slate-500 font-semibold text-xs">
                  {item.month}
                </td>
                <td className="py-1.5 px-3 font-heading font-semibold text-slate-900 dark:text-slate-100">
                  {formatCurrencyNumber(item.payment)}{" "}
                  <span className="text-slate-400 dark:text-slate-500 text-[10px]">{currency}</span>
                </td>
                <td className="py-1.5 px-3 text-blue-700 dark:text-blue-400 font-medium">
                  {formatCurrencyNumber(item.principal)}{" "}
                  <span className="text-slate-400 dark:text-slate-500 text-[10px]">{currency}</span>
                </td>
                <td className="py-1.5 px-3 text-amber-600 dark:text-amber-400 font-medium">
                  {formatCurrencyNumber(item.interest)}{" "}
                  <span className="text-slate-400 dark:text-slate-500 text-[10px]">{currency}</span>
                </td>
                <td className="py-1.5 px-3 text-right text-slate-600 dark:text-slate-400 font-mono text-xs">
                  {formatCurrencyNumber(item.remainingBalance)} {currency}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer totals */}
      <div className="mt-3.5 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/70 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2.5 text-xs font-body">
        <div>
          <span className="text-slate-500 dark:text-slate-400">{t.result.loanAmount}: </span>
          <span className="font-heading font-bold text-slate-900 dark:text-slate-100">
            {formatCurrencyNumber(principalAmount)} {currency}
          </span>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400">{t.result.overpaymentSum}: </span>
          <span className="font-heading font-bold text-amber-600 dark:text-amber-400">
            +{formatCurrencyNumber(overpayment)} {currency}
          </span>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400">{t.result.totalToRepay}: </span>
          <span className="font-heading font-bold text-blue-600 dark:text-blue-400">
            {formatCurrencyNumber(totalPayment)} {currency}
          </span>
        </div>
      </div>
    </div>
  );
};
