import React from 'react';
import { X, Bookmark, Trash2, ArrowRight, Fuel, Coins, Calendar } from 'lucide-react';
import { SavedCalculation } from '../types/calculator';
import { CURRENCIES } from '../utils/constants';
import { formatFuel, formatMoney } from '../utils/calculations';
import { TranslationData } from '../locales/i18n';

interface SavedCalculationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedList: SavedCalculation[];
  onLoad: (calc: SavedCalculation) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  t: TranslationData['modals'];
}

export const SavedCalculationsModal: React.FC<SavedCalculationsModalProps> = ({
  isOpen,
  onClose,
  savedList,
  onLoad,
  onDelete,
  onClearAll,
  t,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh] animate-in fade-in zoom-in-95 duration-150 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Bookmark className="w-4 h-4 fill-blue-600 dark:fill-blue-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                {t.savedTitle}
              </h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-inter">
                {t.savedSub} ({savedList.length})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100 dark:divide-slate-800">
          {savedList.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mb-3">
                <Bookmark className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.savedEmpty}</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs font-inter">
                {t.savedEmptyDesc}
              </p>
            </div>
          ) : (
            savedList.map((item) => {
              const sym = CURRENCIES[item.state.currency].symbol;
              return (
                <div
                  key={item.id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 dark:hover:bg-slate-800/60 p-2 rounded-xl transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                        {item.title}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 font-inter">
                        <Calendar className="w-3 h-3" />
                        {item.date}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                        <Fuel className="w-3.5 h-3.5" />
                        <span>{formatFuel(item.result.totalFuel, item.state.distanceUnit)}</span>
                      </div>
                      <div className="flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400">
                        <Coins className="w-3.5 h-3.5" />
                        <span>{formatMoney(item.result.totalCost, sym)}</span>
                      </div>
                      <span className="text-slate-400">
                        {item.state.totalDistance} {item.state.distanceUnit}
                      </span>
                      <span className="text-slate-400">
                        {item.state.cargoWeight} t
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        onLoad(item);
                        onClose();
                      }}
                      className="px-3 py-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-white dark:hover:text-white bg-blue-50 dark:bg-blue-900/40 hover:bg-blue-600 dark:hover:bg-blue-600 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>{t.savedLoad}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        {savedList.length > 0 && (
          <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={onClearAll}
              className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 font-semibold cursor-pointer"
            >
              {t.savedClear}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg cursor-pointer"
            >
              {t.close}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
