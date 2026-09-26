import React from "react";
import { X, Clock, Trash2, ArrowRight } from "lucide-react";
import { ComparisonScenario } from "../types";
import { formatCurrencyNumber } from "../utils/loanCalculations";
import { useLanguage } from "../context/LanguageContext";

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: ComparisonScenario[];
  onLoad: (item: ComparisonScenario) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onLoad,
  onDelete,
  onClearAll,
}) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-5 sm:p-6 relative max-h-[85vh] flex flex-col transition-colors">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading text-base font-bold text-slate-900 dark:text-slate-100">
              {t.modals.historyTitle}
            </h3>
            <p className="font-body text-xs text-slate-500 dark:text-slate-400">
              {t.modals.historySubtitle}
            </p>
          </div>
        </div>

        {/* List */}
        <div className="overflow-y-auto space-y-2 flex-1 pr-1">
          {history.length === 0 ? (
            <div className="text-center py-10 text-slate-400 dark:text-slate-500 text-xs font-body">
              {t.modals.historyEmpty}
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl border border-slate-200/90 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 bg-white dark:bg-slate-800/90 transition-all flex items-center justify-between gap-3 group"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-heading text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                      {item.name}
                    </h4>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                      {item.date}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 space-x-1.5 font-body truncate">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {formatCurrencyNumber(item.params.amount)} {item.params.currency}
                    </span>
                    <span>•</span>
                    <span>
                      {item.params.termMonths} {t.form.monthsUnit}
                    </span>
                    <span>•</span>
                    <span>{item.params.interestRate}%</span>
                    <span>•</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrencyNumber(item.result.monthlyPayment)} {item.params.currency}/
                      {t.form.monthsUnit}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      onLoad(item);
                      onClose();
                    }}
                    className="px-2.5 py-1.5 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>{t.modals.loadBtn}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors cursor-pointer"
                    title={t.modals.deleteBtn}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0">
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {t.modals.totalRecords}: {history.length}
            </span>
            <button
              type="button"
              onClick={onClearAll}
              className="text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 font-semibold transition-colors cursor-pointer"
            >
              {t.modals.clearAllBtn}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
