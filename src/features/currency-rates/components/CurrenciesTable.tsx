import React, { useState, useMemo } from 'react';
import { Currency } from '../types';
import { Language } from '../types';
import { FlagIcon } from './FlagIcon';
import {
  Star,
  ArrowUpDown,
  Search,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Check,
  Globe2,
} from 'lucide-react';

interface CurrenciesTableProps {
  currencies: Currency[];
  locale: Language;
  onToggleFavorite: (code: string) => void;
  onSelectCurrency: (code: string) => void;
  t?: any;
  getCurrencyName?: (code: string, fallback: string) => string;
}

type CategoryType = 'all' | 'popular' | 'favorites' | 'cis' | 'mideast' | 'asia' | 'west';
type SortField = 'code' | 'name' | 'rate' | 'change24h';
type SortOrder = 'asc' | 'desc';

const POPULAR_CODES = ['USD', 'EUR', 'RUB', 'CNY', 'AED', 'TRY', 'KZT', 'GBP'];
const CIS_CODES = ['RUB', 'KZT', 'KGS', 'TJS', 'BYN', 'AZN', 'GEL'];
const MIDEAST_CODES = ['AED', 'SAR', 'TRY', 'QAR', 'KWD', 'EGP'];
const ASIA_CODES = ['CNY', 'JPY', 'KRW', 'SGD', 'INR', 'MYR', 'THB'];
const WEST_CODES = ['USD', 'EUR', 'GBP', 'CHF', 'CAD', 'AUD', 'PLN'];

export const CurrenciesTable: React.FC<CurrenciesTableProps> = ({
  currencies,
  locale,
  onToggleFavorite,
  onSelectCurrency,
  t,
  getCurrencyName,
}) => {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('rate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(8);

  // Exclude UZS
  const nonUzsCurrencies = useMemo(
    () => currencies.filter((c) => c.code !== 'UZS'),
    [currencies]
  );

  // Filter by category and search
  const filteredCurrencies = useMemo(() => {
    return nonUzsCurrencies.filter((c) => {
      // Category filter
      if (activeCategory === 'popular' && !POPULAR_CODES.includes(c.code)) return false;
      if (activeCategory === 'favorites' && !c.isFavorite) return false;
      if (activeCategory === 'cis' && !CIS_CODES.includes(c.code)) return false;
      if (activeCategory === 'mideast' && !MIDEAST_CODES.includes(c.code)) return false;
      if (activeCategory === 'asia' && !ASIA_CODES.includes(c.code)) return false;
      if (activeCategory === 'west' && !WEST_CODES.includes(c.code)) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchCode = c.code.toLowerCase().includes(q);
        const matchName = c.name.toLowerCase().includes(q);
        return matchCode || matchName;
      }
      return true;
    });
  }, [nonUzsCurrencies, activeCategory, searchQuery]);

  // Sort
  const sortedCurrencies = useMemo(() => {
    return [...filteredCurrencies].sort((a, b) => {
      let valA: string | number = a[sortField];
      let valB: string | number = b[sortField];

      if (typeof valA === 'string') {
        const comp = valA.localeCompare(valB as string);
        return sortOrder === 'asc' ? comp : -comp;
      } else {
        const numA = valA as number;
        const numB = valB as number;
        return sortOrder === 'asc' ? numA - numB : numB - numA;
      }
    });
  }, [filteredCurrencies, sortField, sortOrder]);

  // Pagination
  const totalPages = itemsPerPage > 0 ? Math.ceil(sortedCurrencies.length / itemsPerPage) : 1;
  const paginatedItems = useMemo(() => {
    if (itemsPerPage === 0) return sortedCurrencies;
    const start = (currentPage - 1) * itemsPerPage;
    return sortedCurrencies.slice(start, start + itemsPerPage);
  }, [sortedCurrencies, currentPage, itemsPerPage]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder(field === 'rate' || field === 'change24h' ? 'desc' : 'asc');
    }
  };

  const favoriteCount = nonUzsCurrencies.filter((c) => c.isFavorite).length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-sm sm:text-base text-slate-900 tracking-tight">
              {t?.table?.title || 'Официальные курсы валют ЦБ РУз'}
            </h2>
            <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {t?.dataSource?.officialBadge || 'ЦБ РУз'}
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
            {locale === 'en' ? `${nonUzsCurrencies.length} currencies against the Uzbek sum` : locale === 'uz' ? `${nonUzsCurrencies.length} ta valyuta o‘zbek so‘miga nisbatan` : `Всего ${nonUzsCurrencies.length} валют к узбекскому суму`}
          </p>
        </div>

        {/* Quick Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={t?.table?.searchPlaceholder || 'Поиск валюты (код, страна)...'}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-8.5 pr-3 py-1.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 text-xs scrollbar-none">
        <button
          type="button"
          onClick={() => {
            setActiveCategory('all');
            setCurrentPage(1);
          }}
          className={`px-3 py-1 rounded-lg font-medium shrink-0 transition-all cursor-pointer ${
            activeCategory === 'all'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
          }`}
        >
          {t?.table?.categories?.all || 'Все'} ({nonUzsCurrencies.length})
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveCategory('popular');
            setCurrentPage(1);
          }}
          className={`px-3 py-1 rounded-lg font-medium shrink-0 transition-all cursor-pointer ${
            activeCategory === 'popular'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
          }`}
        >
          {t?.table?.categories?.popular || 'Популярные'} ({POPULAR_CODES.length})
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveCategory('favorites');
            setCurrentPage(1);
          }}
          className={`px-3 py-1 rounded-lg font-medium shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeCategory === 'favorites'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
          }`}
        >
          <Star className={`w-3 h-3 ${activeCategory === 'favorites' ? 'fill-white' : ''}`} />
          <span>{t?.table?.categories?.favorites || 'Избранные'} ({favoriteCount})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveCategory('cis');
            setCurrentPage(1);
          }}
          className={`px-3 py-1 rounded-lg font-medium shrink-0 transition-all cursor-pointer ${
            activeCategory === 'cis'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
          }`}
        >
          {t?.table?.categories?.cis || 'СНГ и ЦА'}
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveCategory('mideast');
            setCurrentPage(1);
          }}
          className={`px-3 py-1 rounded-lg font-medium shrink-0 transition-all cursor-pointer ${
            activeCategory === 'mideast'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
          }`}
        >
          {t?.table?.categories?.mideast || 'Ближний Восток'}
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveCategory('asia');
            setCurrentPage(1);
          }}
          className={`px-3 py-1 rounded-lg font-medium shrink-0 transition-all cursor-pointer ${
            activeCategory === 'asia'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
          }`}
        >
          {t?.table?.categories?.asia || 'Азия и Океания'}
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveCategory('west');
            setCurrentPage(1);
          }}
          className={`px-3 py-1 rounded-lg font-medium shrink-0 transition-all cursor-pointer ${
            activeCategory === 'west'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
          }`}
        >
          {t?.table?.categories?.west || 'Европа и Америка'}
        </button>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 scrollbar-none">
        <table className="w-full text-left border-collapse min-w-[340px] sm:min-w-0">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-medium text-slate-400">
              <th className="pb-2.5 pl-2 font-medium w-10 sm:w-12">{t?.table?.columns?.currency || 'Валюта'}</th>
              <th
                onClick={() => handleSort('code')}
                className="pb-2.5 px-2 sm:px-3 font-medium cursor-pointer hover:text-slate-700 select-none"
              >
                <div className="flex items-center gap-1">
                  <span>{t?.table?.columns?.code || 'Код'}</span>
                  {sortField === 'code' && (
                    sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                  )}
                </div>
              </th>
              <th
                onClick={() => handleSort('name')}
                className="hidden sm:table-cell pb-2.5 px-3 font-medium cursor-pointer hover:text-slate-700 select-none"
              >
                <div className="flex items-center gap-1">
                  <span>{locale === 'en' ? 'Name' : locale === 'uz' ? 'Nomi' : 'Наименование'}</span>
                  {sortField === 'name' && (
                    sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                  )}
                </div>
              </th>
              <th
                onClick={() => handleSort('rate')}
                className="pb-2.5 px-2 sm:px-3 font-medium text-right cursor-pointer hover:text-slate-700 select-none"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>{t?.table?.columns?.rate || 'Курс (UZS)'}</span>
                  {sortField === 'rate' && (
                    sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                  )}
                </div>
              </th>
              <th
                onClick={() => handleSort('change24h')}
                className="pb-2.5 px-2 sm:px-3 font-medium text-right cursor-pointer hover:text-slate-700 select-none"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>{t?.table?.columns?.change || '24ч %'}</span>
                  {sortField === 'change24h' && (
                    sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                  )}
                </div>
              </th>
              <th className="hidden md:table-cell pb-2.5 px-4 font-medium text-center">{t?.table?.columns?.chart || 'Тренд (7д)'}</th>
              <th className="pb-2.5 pr-2 text-right font-medium w-8"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/70 text-xs">
            {paginatedItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  {t?.table?.noCurrencies || 'По данному фильтру или запросу ничего не найдено'}
                </td>
              </tr>
            ) : (
              paginatedItems.map((curr) => {
                const isPositive = curr.change24h >= 0;
                const localizedName = getCurrencyName ? getCurrencyName(curr.code, curr.name) : curr.name;
                const formattedRate =
                  curr.rate >= 1000
                    ? curr.rate.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                    : curr.rate.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 4 });

                return (
                  <tr
                    key={curr.code}
                    onClick={() => onSelectCurrency(curr.code)}
                    className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                    title={`${curr.code} - ${localizedName}`}
                  >
                    {/* Flag */}
                    <td className="py-2.5 pl-2">
                      <FlagIcon code={curr.code} size="md" />
                    </td>

                    {/* Code */}
                    <td className="py-2.5 px-2 sm:px-3">
                      <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {curr.code}
                      </div>
                      <div className="sm:hidden text-[10px] text-slate-400 truncate max-w-[80px]">
                        {localizedName}
                      </div>
                    </td>

                    {/* Name (Desktop/tablet) */}
                    <td className="hidden sm:table-cell py-2.5 px-3 text-slate-600 font-medium">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate max-w-[170px] sm:max-w-xs">{localizedName}</span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          {curr.symbol}
                        </span>
                      </div>
                    </td>

                    {/* Rate to UZS */}
                    <td className="py-2.5 px-2 sm:px-3 text-right font-bold text-slate-900 whitespace-nowrap">
                      <span>{formattedRate}</span>
                      <span className="text-[10px] text-slate-400 font-normal ml-1 hidden xs:inline">сум</span>
                    </td>

                    {/* Change */}
                    <td className="py-2.5 px-2 sm:px-3 text-right whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-1.5 py-0.5 rounded-md font-semibold text-[10px] sm:text-[11px] ${
                          isPositive
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            : 'bg-rose-50 text-rose-600 border border-rose-100'
                        }`}
                      >
                        {isPositive ? `+${curr.change24h.toFixed(2)}%` : `${curr.change24h.toFixed(2)}%`}
                      </span>
                    </td>

                    {/* Sparkline (Desktop/Tablet) */}
                    <td className="hidden md:table-cell py-2.5 px-4 text-center">
                      <div className="w-18 h-5 mx-auto">
                        <svg viewBox="0 0 80 24" className="w-full h-full overflow-visible">
                          <defs>
                            <linearGradient
                              id={`tbl-grad-${curr.code}`}
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="0%"
                                stopColor={isPositive ? '#10b981' : '#f43f5e'}
                                stopOpacity="0.2"
                              />
                              <stop
                                offset="100%"
                                stopColor={isPositive ? '#10b981' : '#f43f5e'}
                                stopOpacity="0"
                              />
                            </linearGradient>
                          </defs>
                          <path
                            d={generateSparklineArea(curr.sparkline)}
                            fill={`url(#tbl-grad-${curr.code})`}
                          />
                          <path
                            d={generateSparklinePath(curr.sparkline)}
                            fill="none"
                            stroke={isPositive ? '#10b981' : '#f43f5e'}
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </td>

                    {/* Star Favorite */}
                    <td className="py-2.5 pr-2 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => onToggleFavorite(curr.code)}
                        className="p-1 hover:scale-110 transition-transform cursor-pointer"
                        title={curr.isFavorite ? 'Удалить из избранного' : 'В избранное'}
                      >
                        <Star
                          className={`w-4 h-4 ${
                            curr.isFavorite
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300 hover:text-slate-400'
                          }`}
                        />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer: Pagination & Display toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
        <div>
          {t?.table?.show || 'Показано'}{' '}
          <span className="font-semibold text-slate-700">
            {sortedCurrencies.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
          </span>{' '}
          —{' '}
          <span className="font-semibold text-slate-700">
            {itemsPerPage === 0
              ? sortedCurrencies.length
              : Math.min(currentPage * itemsPerPage, sortedCurrencies.length)}
          </span>{' '}
          {t?.table?.of || 'из'} <span className="font-semibold text-slate-700">{sortedCurrencies.length}</span> {t?.table?.records || 'валют'}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setItemsPerPage(itemsPerPage === 8 ? 0 : 8);
              setCurrentPage(1);
            }}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer mr-2"
          >
            {itemsPerPage === 8 ? `${t?.table?.categories?.all || 'Показать все'} (${sortedCurrencies.length})` : `${t?.table?.show || 'Показать'} 8`}
          </button>

          {itemsPerPage > 0 && totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-2 py-1 rounded-md border border-slate-200 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer"
              >
                {locale === 'en' ? 'Back' : locale === 'uz' ? 'Orqaga' : 'Назад'}
              </button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-7 h-7 rounded-md font-semibold text-xs flex items-center justify-center transition-all cursor-pointer ${
                    currentPage === i + 1
                      ? 'bg-blue-600 text-white'
                      : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-2 py-1 rounded-md border border-slate-200 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer"
              >
                {locale === 'en' ? 'Next' : locale === 'uz' ? 'Keyingi' : 'Вперёд'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function generateSparklinePath(data: number[]): string {
  if (!data || data.length === 0) return '';
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 72;
  const height = 18;
  const padding = 2;

  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - padding * 2) - padding;
    return { x, y };
  });

  return points.reduce((acc, point, i, arr) => {
    if (i === 0) return `M ${point.x} ${point.y}`;
    const prev = arr[i - 1];
    const cp1x = prev.x + (point.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (point.x - prev.x) / 2;
    const cp2y = point.y;
    return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${point.x} ${point.y}`;
  }, '');
}

function generateSparklineArea(data: number[]): string {
  const linePath = generateSparklinePath(data);
  if (!linePath) return '';
  return `${linePath} L 72 22 L 0 22 Z`;
}
