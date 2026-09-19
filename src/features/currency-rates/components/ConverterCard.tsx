import React, { useState, useEffect } from 'react';
import { Currency, ConverterMode } from '../types';
import { FlagIcon } from './FlagIcon';
import {
  ArrowUpDown,
  Heart,
  Check,
  ChevronDown,
  Search,
  Copy,
  Zap,
} from 'lucide-react';

interface ConverterCardProps {
  currencies: Currency[];
  fromCurrency: string;
  toCurrency: string;
  onFromChange: (code: string) => void;
  onToChange: (code: string) => void;
  onSwapCurrencies?: () => void;
  onToggleFavoritePair?: (pair: string) => void;
  t?: any;
  getCurrencyName?: (code: string, fallback: string) => string;
}

export const ConverterCard: React.FC<ConverterCardProps> = ({
  currencies,
  fromCurrency,
  toCurrency,
  onFromChange,
  onToChange,
  onSwapCurrencies,
  onToggleFavoritePair,
  t,
  getCurrencyName,
}) => {
  const [mode, setMode] = useState<ConverterMode>('convert');
  const [fromAmount, setFromAmount] = useState<string>('1 000');
  const [toAmount, setToAmount] = useState<string>('12 650 000');
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const [showFromDropdown, setShowFromDropdown] = useState<boolean>(false);
  const [showToDropdown, setShowToDropdown] = useState<boolean>(false);
  const [fromSearch, setFromSearch] = useState<string>('');
  const [toSearch, setToSearch] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const getCurrencyRate = (code: string): number => {
    if (code === 'UZS') return 1;
    const found = currencies.find((c) => c.code === code);
    return found ? found.rate : 1;
  };

  // Convert whenever input or currencies change
  const calculateConversion = (inputVal: string, fromCode: string, toCode: string) => {
    const rawNumber = parseFloat(inputVal.replace(/\s+/g, '').replace(',', '.')) || 0;
    const fromRate = getCurrencyRate(fromCode);
    const toRate = getCurrencyRate(toCode);

    // Amount in UZS = rawNumber * fromRate
    const amountInUzs = rawNumber * fromRate;
    // Amount in target = amountInUzs / toRate
    const result = toRate > 0 ? amountInUzs / toRate : 0;

    if (toCode === 'UZS') {
      return Math.round(result).toLocaleString('ru-RU');
    } else if (result >= 100) {
      return result.toLocaleString('ru-RU', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    } else if (result >= 1) {
      return result.toLocaleString('ru-RU', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
      });
    } else {
      return result.toLocaleString('ru-RU', {
        minimumFractionDigits: 4,
        maximumFractionDigits: 6,
      });
    }
  };

  useEffect(() => {
    setToAmount(calculateConversion(fromAmount, fromCurrency, toCurrency));
  }, [fromAmount, fromCurrency, toCurrency, currencies]);

  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9.,\s]/g, '');
    setFromAmount(val);
  };

  const handleQuickPreset = (preset: number) => {
    setFromAmount(preset >= 1000 ? preset.toLocaleString('ru-RU') : preset.toString());
  };

  const handleCopyResult = () => {
    navigator.clipboard.writeText(toAmount.replace(/\s+/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleSwap = () => {
    if (onSwapCurrencies) {
      onSwapCurrencies();
    } else {
      const prevFrom = fromCurrency;
      const prevTo = toCurrency;
      onFromChange(prevTo);
      onToChange(prevFrom);
    }
  };

  const currentRateStr = () => {
    const fRate = getCurrencyRate(fromCurrency);
    const tRate = getCurrencyRate(toCurrency);
    if (tRate === 0) return '';
    const single = fRate / tRate;
    let formatted = '';
    if (single >= 100) {
      formatted = single.toLocaleString('ru-RU', { maximumFractionDigits: 2 });
    } else if (single >= 1) {
      formatted = single.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
    } else {
      formatted = single.toLocaleString('ru-RU', { minimumFractionDigits: 4, maximumFractionDigits: 6 });
    }
    return `1 ${fromCurrency} = ${formatted} ${toCurrency}`;
  };

  const availableCurrencies = [
    ...currencies.filter((c) => c.code !== 'UZS'),
    { code: 'UZS', name: 'Узбекский сум', rate: 1, symbol: "so'm", change24h: 0, sparkline: [] },
  ];

  const filteredFromCurrencies = availableCurrencies.filter(
    (c) =>
      c.code.toLowerCase().includes(fromSearch.toLowerCase()) ||
      c.name.toLowerCase().includes(fromSearch.toLowerCase())
  );

  const filteredToCurrencies = availableCurrencies.filter(
    (c) =>
      c.code.toLowerCase().includes(toSearch.toLowerCase()) ||
      c.name.toLowerCase().includes(toSearch.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs flex flex-col justify-between h-full relative">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-none stroke-current stroke-2">
                <path d="M7 16V4M7 4L3 8M7 4L11 8M17 8V20M17 20L21 16M17 20L13 16" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="font-bold text-base text-slate-900 tracking-tight">
              {t?.converter?.title || 'Конвертер валют'}
            </h2>
          </div>

          {/* Auto-recalculation badge */}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-[11px] font-semibold">
            <Zap className="w-3 h-3 text-emerald-600 fill-emerald-500" />
            {t?.converter?.autoCalculate || 'Автопересчет'}
          </span>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-slate-100/90 p-1 rounded-xl mb-4 text-center text-xs">
          <button
            type="button"
            onClick={() => setMode('convert')}
            className={`py-1.5 px-1 sm:px-2 rounded-lg font-semibold transition-all cursor-pointer truncate ${
              mode === 'convert'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t?.converter?.modeConvert || 'Конвертация'}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('reverse');
              handleSwap();
            }}
            className={`py-1.5 px-1 sm:px-2 rounded-lg font-medium transition-all cursor-pointer truncate ${
              mode === 'reverse'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t?.converter?.modeReverse || 'Обратный'}
          </button>
          <button
            type="button"
            onClick={() => setMode('multi')}
            className={`py-1.5 px-1 sm:px-2 rounded-lg font-medium transition-all cursor-pointer truncate ${
              mode === 'multi'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t?.converter?.modeMulti || 'Мульти'}
          </button>
        </div>

        {/* "Отдаю" Field */}
        <div className="mb-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-400 mb-1.5">
            <span>{t?.converter?.youGive || 'Отдаю'}</span>
            {/* Quick Presets */}
            <div className="flex items-center gap-1">
              {[100, 500, 1000, 5000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleQuickPreset(preset)}
                  className="px-1.5 py-0.5 rounded text-[10px] font-semibold text-slate-500 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  {preset >= 1000 ? `${preset / 1000}k` : preset}
                </button>
              ))}
            </div>
          </div>
          <div className="relative border border-slate-200 rounded-xl p-2.5 flex items-center justify-between bg-white hover:border-slate-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all">
            {/* Currency Selector Trigger */}
            <button
              type="button"
              onClick={() => {
                setShowFromDropdown(!showFromDropdown);
                setShowToDropdown(false);
              }}
              className="flex items-center gap-2 pr-3 border-r border-slate-200 text-slate-800 font-bold text-sm cursor-pointer select-none shrink-0"
            >
              <FlagIcon code={fromCurrency} size="md" />
              <span>{fromCurrency}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Input */}
            <div className="flex-1 flex items-center pl-3">
              <input
                type="text"
                value={fromAmount}
                onChange={handleFromAmountChange}
                className="w-full font-bold text-[18px] text-slate-900 bg-transparent outline-none"
                placeholder="0"
              />
            </div>

            {/* From Dropdown */}
            {showFromDropdown && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-1.5">
                <div className="p-1 mb-1 border-b border-slate-100 flex items-center gap-1.5 text-slate-400">
                  <Search className="w-3.5 h-3.5" />
                  <input
                    type="text"
                    placeholder={t?.converter?.searchCurrency || 'Найти валюту...'}
                    value={fromSearch}
                    onChange={(e) => setFromSearch(e.target.value)}
                    className="w-full text-xs text-slate-800 outline-none placeholder:text-slate-400"
                    autoFocus
                  />
                </div>
                <div className="max-h-52 overflow-y-auto">
                  {filteredFromCurrencies.length === 0 ? (
                    <div className="p-2 text-center text-xs text-slate-400">{t?.converter?.notFound || 'Ничего не найдено'}</div>
                  ) : (
                    filteredFromCurrencies.map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => {
                          onFromChange(c.code);
                          setShowFromDropdown(false);
                          setFromSearch('');
                        }}
                        className="w-full px-2.5 py-1.5 text-left flex items-center justify-between hover:bg-slate-50 rounded-lg text-xs text-slate-800 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <FlagIcon code={c.code} size="sm" />
                          <span className="font-bold">{c.code}</span>
                          <span className="text-slate-400 text-[11px] truncate max-w-[120px]">
                            {getCurrencyName ? getCurrencyName(c.code, c.name) : c.name}
                          </span>
                        </div>
                        {fromCurrency === c.code && <Check className="w-3.5 h-3.5 text-blue-600" />}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Central Swap Button */}
        <div className="flex justify-center -my-2 relative z-10">
          <button
            type="button"
            onClick={handleSwap}
            className="w-9 h-9 rounded-full bg-white border border-slate-200/90 shadow-2xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
            title="Поменять местами"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>

        {/* "Получаю" Field */}
        <div className="mt-2 mb-3">
          <div className="flex items-center justify-between text-xs font-medium text-slate-400 mb-1.5">
            <span>{t?.converter?.youGet || 'Получаю'}</span>
            {copied && (
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                <Check className="w-3 h-3" /> {t?.converter?.copied || 'Скопировано в буфер'}
              </span>
            )}
          </div>
          <div className="relative border border-slate-200 rounded-xl p-2.5 flex items-center justify-between bg-slate-50/60 hover:border-slate-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all">
            {/* Currency Selector Trigger */}
            <button
              type="button"
              onClick={() => {
                setShowToDropdown(!showToDropdown);
                setShowFromDropdown(false);
              }}
              className="flex items-center gap-2 pr-3 border-r border-slate-200 text-slate-800 font-bold text-sm cursor-pointer select-none shrink-0"
            >
              <FlagIcon code={toCurrency} size="md" />
              <span>{toCurrency}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Value */}
            <div className="flex-1 flex items-center pl-3">
              <input
                type="text"
                readOnly
                value={toAmount}
                className="w-full font-bold text-[18px] text-slate-900 bg-transparent outline-none cursor-default truncate"
              />
            </div>

            {/* Quick Copy Button */}
            <button
              type="button"
              onClick={handleCopyResult}
              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg transition-colors cursor-pointer shrink-0"
              title={t?.converter?.copyResult || 'Скопировать результат'}
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>

            {/* To Dropdown */}
            {showToDropdown && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-1.5">
                <div className="p-1 mb-1 border-b border-slate-100 flex items-center gap-1.5 text-slate-400">
                  <Search className="w-3.5 h-3.5" />
                  <input
                    type="text"
                    placeholder={t?.converter?.searchCurrency || 'Найти валюту...'}
                    value={toSearch}
                    onChange={(e) => setToSearch(e.target.value)}
                    className="w-full text-xs text-slate-800 outline-none placeholder:text-slate-400"
                    autoFocus
                  />
                </div>
                <div className="max-h-52 overflow-y-auto">
                  {filteredToCurrencies.length === 0 ? (
                    <div className="p-2 text-center text-xs text-slate-400">{t?.converter?.notFound || 'Ничего не найдено'}</div>
                  ) : (
                    filteredToCurrencies.map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => {
                          onToChange(c.code);
                          setShowToDropdown(false);
                          setToSearch('');
                        }}
                        className="w-full px-2.5 py-1.5 text-left flex items-center justify-between hover:bg-slate-50 rounded-lg text-xs text-slate-800 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <FlagIcon code={c.code} size="sm" />
                          <span className="font-bold">{c.code}</span>
                          <span className="text-slate-400 text-[11px] truncate max-w-[120px]">
                            {getCurrencyName ? getCurrencyName(c.code, c.name) : c.name}
                          </span>
                        </div>
                        {toCurrency === c.code && <Check className="w-3.5 h-3.5 text-blue-600" />}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Rate Info line */}
        <div className="text-center py-2 px-3 bg-slate-50 rounded-xl border border-slate-100/80 mb-3">
          <div className="font-bold text-xs text-slate-800">{currentRateStr()}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {t?.converter?.officialCbuRate || 'Курс ЦБ РУз'} • {t?.converter?.calcOnInput || 'Автоматический расчет при вводе'}
          </div>
        </div>
      </div>

      {/* Action Buttons: Copy result & Favorite */}
      <div className="grid grid-cols-2 gap-2 mt-auto pt-1">
        <button
          type="button"
          onClick={handleCopyResult}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all cursor-pointer active:scale-[0.99] flex items-center justify-center gap-1.5"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>{t?.converter?.copied || 'Скопировано'}</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>{t?.converter?.copyResult || 'Скопировать'}</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            setIsFavorited(!isFavorited);
            if (onToggleFavoritePair) {
              onToggleFavoritePair(`${fromCurrency}/${toCurrency}`);
            }
          }}
          className={`w-full py-2.5 border font-semibold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
            isFavorited
              ? 'border-blue-300 bg-blue-50 text-blue-700'
              : 'border-slate-200/90 hover:bg-slate-50 text-slate-700'
          }`}
        >
          <Heart
            className={`w-3.5 h-3.5 ${isFavorited ? 'fill-blue-600 text-blue-600' : 'text-slate-400'}`}
          />
          <span>{isFavorited ? (t?.converter?.saved || 'В избранном') : (t?.converter?.savePair || 'В избранное')}</span>
        </button>
      </div>
    </div>
  );
};
