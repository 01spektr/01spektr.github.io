import React, { useRef } from 'react';
import { Currency } from '../types';
import { FlagIcon } from './FlagIcon';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface CurrencyCardsRowProps {
  currencies: Currency[];
  selectedCurrency: string;
  onSelectCurrency: (code: string) => void;
  getCurrencyName?: (code: string, fallback: string) => string;
}

export const CurrencyCardsRow: React.FC<CurrencyCardsRowProps> = ({
  currencies,
  selectedCurrency,
  onSelectCurrency,
  getCurrencyName,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // We display foreign currencies, ordered by popular ones first
  const preferredOrder = [
    'USD', 'EUR', 'RUB', 'CNY', 'KZT', 'AED', 'TRY', 'GBP',
    'CHF', 'JPY', 'KRW', 'SAR', 'CAD', 'AUD', 'SGD', 'KGS', 'INR'
  ];

  const sortedTopCurrencies = [...currencies.filter((c) => c.code !== 'UZS')].sort((a, b) => {
    const idxA = preferredOrder.indexOf(a.code);
    const idxB = preferredOrder.indexOf(b.code);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return b.rate - a.rate;
  });

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative my-3 sm:my-4 group/carousel -mx-4 sm:mx-0 px-4 sm:px-0">
      {/* Scroll Left Button */}
      <button
        type="button"
        onClick={() => scroll('left')}
        className="hidden sm:flex absolute -left-3.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white border border-slate-200 shadow-md text-slate-600 hover:text-blue-600 hover:scale-105 items-center justify-center transition-all cursor-pointer opacity-0 group-hover/carousel:opacity-100"
        title="Назад"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Cards Scroll Container */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto pb-2 pt-1 scroll-smooth scrollbar-none px-0.5"
      >
        {sortedTopCurrencies.map((currency) => {
          const isPositive = currency.change24h >= 0;
          const isSelected = selectedCurrency === currency.code;

          const formattedRate =
            currency.rate >= 1000
              ? currency.rate.toLocaleString('ru-RU')
              : currency.rate.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

          return (
            <div
              key={currency.code}
              onClick={() => onSelectCurrency(currency.code)}
              className={`flex-1 min-w-[170px] sm:min-w-[185px] max-w-[210px] bg-white rounded-2xl p-3.5 border transition-all cursor-pointer select-none shrink-0 group ${
                isSelected
                  ? 'border-blue-500 shadow-sm ring-2 ring-blue-500/20 bg-blue-50/10'
                  : 'border-slate-200/80 shadow-2xs hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              {/* Header: Flag, Code & Name */}
              <div className="flex items-center gap-2 mb-2">
                <FlagIcon code={currency.code} size="md" />
                <div className="min-w-0">
                  <div className="font-bold text-xs text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                    {currency.code}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate max-w-[100px]">
                    {getCurrencyName ? getCurrencyName(currency.code, currency.name) : currency.name}
                  </div>
                </div>
              </div>

              {/* Rate */}
              <div className="text-[16px] font-bold text-slate-900 tracking-tight leading-snug">
                {formattedRate}{' '}
                <span className="text-[11px] font-semibold text-slate-400">UZS</span>
              </div>

              {/* Bottom: Change & Sparkline */}
              <div className="flex items-end justify-between gap-1 mt-1.5">
                <div
                  className={`text-xs font-bold flex items-center gap-0.5 ${
                    isPositive ? 'text-emerald-600' : 'text-rose-500'
                  }`}
                >
                  <span className="text-[9px]">{isPositive ? '▲' : '▼'}</span>
                  <span>{isPositive ? `+${currency.change24h.toFixed(2)}%` : `${currency.change24h.toFixed(2)}%`}</span>
                </div>

                {/* Mini Sparkline Chart */}
                <div className="w-16 h-6 shrink-0">
                  <svg viewBox="0 0 70 30" className="w-full h-full overflow-visible">
                    <defs>
                      <linearGradient
                        id={`grad-${currency.code}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor={isPositive ? '#10b981' : '#f43f5e'}
                          stopOpacity="0.25"
                        />
                        <stop
                          offset="100%"
                          stopColor={isPositive ? '#10b981' : '#f43f5e'}
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>

                    {/* Smooth area fill */}
                    <path
                      d={generateSparklineArea(currency.sparkline)}
                      fill={`url(#grad-${currency.code})`}
                    />

                    {/* Smooth stroke line */}
                    <path
                      d={generateSparklinePath(currency.sparkline)}
                      fill="none"
                      stroke={isPositive ? '#10b981' : '#f43f5e'}
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Scroll Right Button */}
      <button
        type="button"
        onClick={() => scroll('right')}
        className="hidden sm:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white border border-slate-200 shadow-md text-slate-600 hover:text-blue-600 hover:scale-105 items-center justify-center transition-all cursor-pointer opacity-0 group-hover/carousel:opacity-100"
        title="Вперёд"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

// Helpers for smooth SVG sparklines
function generateSparklinePath(data: number[]): string {
  if (!data || data.length === 0) return '';
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 70;
  const height = 24;
  const padding = 3;

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
  return `${linePath} L 70 30 L 0 30 Z`;
}
