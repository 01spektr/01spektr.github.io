import React, { useState } from 'react';
import { X, Clock, Heart, Trash2, Calendar } from 'lucide-react';
import { CalculationHistoryItem } from '../types/calendar';
import { useTranslation } from '../i18n/LanguageContext';

interface HistoryFavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: CalculationHistoryItem[];
  favorites: CalculationHistoryItem[];
  onClearHistory: () => void;
  onToggleFavorite: (item: CalculationHistoryItem) => void;
  onOpenPdfModal: () => void;
  initialTab?: 'history' | 'favorites';
}

export const HistoryFavoritesModal: React.FC<HistoryFavoritesModalProps> = ({
  isOpen,
  onClose,
  history,
  favorites,
  onClearHistory,
  onToggleFavorite,
  onOpenPdfModal,
  initialTab = 'history',
}) => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<'history' | 'favorites'>(initialTab);

  if (!isOpen) return null;

  const list = tab === 'history' ? history : favorites;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 animate-in fade-in duration-150 font-primary">
      <div className="bg-white dark:bg-[#151D2E] rounded-xl max-w-md w-full p-4 shadow-2xl border border-slate-200 dark:border-[#232E42] flex flex-col max-h-[80vh] transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#232E42]">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setTab('history')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-primary font-bold transition-colors cursor-pointer ${
                tab === 'history'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1E293B]'
              }`}
            >
              <Clock className="w-3 h-3" />
              {t('btn_history')} ({history.length})
            </button>
            <button
              onClick={() => setTab('favorites')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-primary font-bold transition-colors cursor-pointer ${
                tab === 'favorites'
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1E293B]'
              }`}
            >
              <Heart className="w-3 h-3" />
              {t('btn_saved')} ({favorites.length})
            </button>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-[#1E293B] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content list */}
        <div className="py-3 overflow-y-auto flex-1 space-y-2">
          {list.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Calendar className="w-8 h-8 mx-auto stroke-1 text-slate-300 dark:text-slate-600 mb-1.5" />
              <p className="text-[12px] font-primary font-medium text-slate-600 dark:text-slate-400 px-4">
                {tab === 'history' ? t('empty_history') : t('empty_favorites')}
              </p>
            </div>
          ) : (
            list.map((item) => {
              const isFav = favorites.some((f) => f.id === item.id);
              const dateStr = new Date(item.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={item.id}
                  className="p-2.5 rounded-lg border border-slate-200 dark:border-[#232E42] hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-[#111827] flex items-start justify-between gap-2.5 group transition-all"
                >
                  <div>
                    <span className="text-[9px] font-primary font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                      {dateStr}
                    </span>
                    <h4 className="text-[11.5px] font-primary font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                      {item.title}
                    </h4>
                    <p className="text-[10.5px] font-secondary font-medium text-blue-600 dark:text-blue-400 mt-0.5">
                      {item.summary}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onToggleFavorite(item)}
                      className={`p-1 rounded-md transition-colors cursor-pointer ${
                        isFav
                          ? 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                          : 'text-slate-300 dark:text-slate-600 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-[#1E293B]'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-600' : ''}`} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer actions */}
        <div className="pt-2.5 border-t border-slate-100 dark:border-[#232E42] flex items-center justify-between">
          {tab === 'history' && history.length > 0 ? (
            <button
              onClick={onClearHistory}
              className="text-[10.5px] font-primary font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              {t('clear_history')}
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={() => {
              onClose();
              onOpenPdfModal();
            }}
            className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 rounded-lg text-[10.5px] font-primary font-bold transition-colors cursor-pointer"
          >
            {t('btn_export_pdf')}
          </button>
        </div>
      </div>
    </div>
  );
};
