import React from 'react';
import {
  X,
  History,
  Trash2,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  FileSpreadsheet,
} from 'lucide-react';
import { CalculationResult } from '../types';
import { formatNumber } from '../utils/vatCalculations';
import { getModeLabel, exportToExcel } from '../utils/exportUtils';
import { useApp } from '../context/AppContext';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CalculationResult[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onSelectResult: (result: CalculationResult) => void;
  onClearHistory: () => void;
  isFavoritesOnly?: boolean;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  items,
  favorites,
  onToggleFavorite,
  onSelectResult,
  onClearHistory,
  isFavoritesOnly = false,
}) => {
  const { language } = useApp();
  if (!isOpen) return null;

  const copy = language === 'ru'
    ? { favorites: 'Избранные расчёты', history: 'История расчётов', one: 'запись', many: 'записей', clear: 'Очистить', noFavorites: 'У вас пока нет сохранённых в избранное расчётов.', empty: 'История пока пуста. Выполните расчёт, и он появится здесь.', rate: 'Ставка', net: 'Без НДС', total: 'Итого', item: 'Товар', remove: 'Удалить из избранного', add: 'Добавить в избранное', export: 'Экспорт в Excel', open: 'Открыть' }
    : language === 'uz'
      ? { favorites: 'Sevimli hisoblar', history: 'Hisob-kitoblar tarixi', one: 'yozuv', many: 'yozuv', clear: 'Tozalash', noFavorites: 'Sevimlilarga saqlangan hisoblar hali yo‘q.', empty: 'Tarix hozircha bo‘sh. Hisoblang, natija shu yerda paydo bo‘ladi.', rate: 'Stavka', net: 'QQSsiz', total: 'Jami', item: 'Tovar', remove: 'Sevimlilardan olib tashlash', add: 'Sevimlilarga qo‘shish', export: 'Excelga eksport', open: 'Ochish' }
      : { favorites: 'Favorite calculations', history: 'Calculation history', one: 'entry', many: 'entries', clear: 'Clear', noFavorites: 'You have no favorite calculations yet.', empty: 'History is empty. Complete a calculation and it will appear here.', rate: 'Rate', net: 'Net', total: 'Total', item: 'Item', remove: 'Remove from favorites', add: 'Add to favorites', export: 'Export to Excel', open: 'Open' };
  const modeLabels = language === 'ru'
    ? { add: 'Добавить НДС', extract: 'Выделить НДС', calculate_only: 'Рассчитать НДС' }
    : language === 'uz'
      ? { add: 'QQS qo‘shish', extract: 'QQSni ajratish', calculate_only: 'QQSni hisoblash' }
      : { add: 'Add VAT', extract: 'Extract VAT', calculate_only: 'Calculate VAT' };

  const filteredItems = isFavoritesOnly
    ? items.filter((item) => favorites.includes(item.id))
    : items;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 font-inter">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              {isFavoritesOnly ? <Bookmark className="w-4 h-4" /> : <History className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white font-montserrat">
                {isFavoritesOnly ? copy.favorites : copy.history}
              </h2>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {filteredItems.length} {filteredItems.length === 1 ? copy.one : copy.many}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isFavoritesOnly && items.length > 0 && (
              <button
                type="button"
                onClick={onClearHistory}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                {copy.clear}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-sm">
              {isFavoritesOnly ? copy.noFavorites : copy.empty}
            </div>
          ) : (
            filteredItems.map((item) => {
              const isFav = favorites.includes(item.id);
              const dateFormatted = new Date(item.timestamp).toLocaleString(language === 'ru' ? 'ru-RU' : language === 'uz' ? 'uz-UZ' : 'en-US', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 bg-white dark:bg-slate-800 hover:bg-blue-50/20 dark:hover:bg-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                        {modeLabels[item.mode] ?? getModeLabel(item.mode)}
                      </span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-400">{dateFormatted}</span>
                      <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">{copy.rate} {item.vatRate}%</span>
                    </div>

                    <div className="flex items-baseline gap-2 font-mono text-sm">
                      <span className="text-slate-500 dark:text-slate-400 text-xs">{copy.net}:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-100">
                        {formatNumber(item.amountWithoutVat, 2, item.roundToTwoDecimals)} {item.currency}
                      </span>
                      <span className="text-slate-300 dark:text-slate-600">|</span>
                      <span className="text-slate-500 dark:text-slate-400 text-xs">{copy.total}:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {formatNumber(item.totalWithVat, 2, item.roundToTwoDecimals)} {item.currency}
                      </span>
                    </div>

                    {item.itemName && (
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
                        {copy.item}: {item.itemName}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => onToggleFavorite(item.id)}
                      title={isFav ? copy.remove : copy.add}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                      {isFav ? (
                        <BookmarkCheck className="w-4 h-4 text-amber-500" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => exportToExcel(item)}
                      title={copy.export}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onSelectResult(item);
                        onClose();
                      }}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <span>{copy.open}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

