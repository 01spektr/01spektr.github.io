import React, { useState } from 'react';
import {
  RotateCcw,
  Calculator as CalcIcon,
  Info,
  ChevronDown,
  Percent,
} from 'lucide-react';
import { VatMode } from '../types';
import { CURRENCIES } from '../data/countries';
import { formatNumber, parseFormattedNumber } from '../utils/vatCalculations';
import { useApp } from '../context/AppContext';

interface CalculatorFormProps {
  mode: VatMode;
  onModeChange: (mode: VatMode) => void;
  inputAmount: number;
  onAmountChange: (amount: number) => void;
  vatRate: number;
  onVatRateChange: (rate: number) => void;
  currency: string;
  onCurrencyChange: (currency: string) => void;
  roundToTwoDecimals: boolean;
  onRoundToggle: (round: boolean) => void;
  itemName: string;
  onItemNameChange: (name: string) => void;
  note: string;
  onNoteChange: (note: string) => void;
  showTableView: boolean;
  onToggleTableView: (show: boolean) => void;
  onReset: () => void;
  onCalculate: () => void;
  onOpenRatesList: () => void;
}

export const CalculatorForm: React.FC<CalculatorFormProps> = ({
  mode,
  onModeChange,
  inputAmount,
  onAmountChange,
  vatRate,
  onVatRateChange,
  currency,
  onCurrencyChange,
  roundToTwoDecimals,
  onRoundToggle,
  itemName,
  onItemNameChange,
  note,
  onNoteChange,
  showTableView,
  onToggleTableView,
  onReset,
  onCalculate,
  onOpenRatesList,
}) => {
  const { t } = useApp();
  const [isCustomRate, setIsCustomRate] = useState(false);
  const [customRateInput, setCustomRateInput] = useState('');

  // Handle amount text changes with formatting
  const handleAmountInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const numeric = parseFormattedNumber(raw);
    onAmountChange(numeric);
  };

  const getAmountLabel = () => {
    switch (mode) {
      case 'add':
        return t('form.amountLabelAdd');
      case 'extract':
        return t('form.amountLabelExtract');
      case 'calculate_only':
        return t('form.amountLabelCalculate');
    }
  };

  const handleQuickAdd = (delta: number) => {
    onAmountChange(Math.max(0, inputAmount + delta));
  };

  const isMajorUnitCurrency = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'CHF'].includes(currency);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xs transition-colors">
      {/* 1. Select Mode */}
      <div className="mb-5 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-2.5 mb-3">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center font-montserrat shrink-0">
            1
          </span>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-montserrat">
            {t('modes.stepTitle')}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5">
          {/* Mode 1: Add VAT */}
          <button
            type="button"
            onClick={() => onModeChange('add')}
            className={`p-3 rounded-xl text-left transition-all relative cursor-pointer active:scale-[0.99] ${
              mode === 'add'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/25 ring-2 ring-blue-600 ring-offset-1 dark:ring-offset-slate-900'
                : 'bg-slate-50/80 dark:bg-slate-800 hover:bg-slate-100/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700'
            }`}
          >
            <div className="text-xs sm:text-sm font-bold font-montserrat">{t('modes.add')}</div>
            <div className={`text-[11px] mt-0.5 font-inter ${mode === 'add' ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
              {t('modes.addDesc')}
            </div>
          </button>

          {/* Mode 2: Extract VAT */}
          <button
            type="button"
            onClick={() => onModeChange('extract')}
            className={`p-3 rounded-xl text-left transition-all relative cursor-pointer active:scale-[0.99] ${
              mode === 'extract'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/25 ring-2 ring-blue-600 ring-offset-1 dark:ring-offset-slate-900'
                : 'bg-slate-50/80 dark:bg-slate-800 hover:bg-slate-100/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700'
            }`}
          >
            <div className="text-xs sm:text-sm font-bold font-montserrat">{t('modes.extract')}</div>
            <div className={`text-[11px] mt-0.5 font-inter ${mode === 'extract' ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
              {t('modes.extractDesc')}
            </div>
          </button>

          {/* Mode 3: Calculate VAT only */}
          <button
            type="button"
            onClick={() => onModeChange('calculate_only')}
            className={`p-3 rounded-xl text-left transition-all relative cursor-pointer active:scale-[0.99] ${
              mode === 'calculate_only'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/25 ring-2 ring-blue-600 ring-offset-1 dark:ring-offset-slate-900'
                : 'bg-slate-50/80 dark:bg-slate-800 hover:bg-slate-100/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700'
            }`}
          >
            <div className="text-xs sm:text-sm font-bold font-montserrat">{t('modes.calculateVatOnly')}</div>
            <div className={`text-[11px] mt-0.5 font-inter ${mode === 'calculate_only' ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
              {t('modes.calculateVatOnlyDesc')}
            </div>
          </button>
        </div>
      </div>

      {/* 2. Enter Data */}
      <div className="mb-6">
        <div className="flex items-center gap-2.5 mb-3.5">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center font-montserrat">
            2
          </span>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-montserrat">
            {t('form.stepTitle')}
          </h2>
        </div>

        {/* Amount Input */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 font-inter">
              {getAmountLabel()}
            </label>
            <div className="relative flex rounded-xl shadow-2xs">
              <input
                type="text"
                value={inputAmount === 0 ? '' : formatNumber(inputAmount, 2, false)}
                placeholder={isMajorUnitCurrency ? '1 000' : '1 000 000'}
                onChange={handleAmountInput}
                className="block w-full rounded-l-xl border border-r-0 border-slate-300 dark:border-slate-700 px-3.5 py-2.5 text-sm sm:text-base font-semibold text-slate-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white dark:bg-slate-800 font-inter tabular-nums"
              />
              <div className="relative shrink-0">
                <select
                  value={currency}
                  onChange={(e) => onCurrencyChange(e.target.value)}
                  className="appearance-none h-full rounded-r-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-3.5 pr-8 py-2.5 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-hidden cursor-pointer font-montserrat transition-colors"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code} className="dark:bg-slate-800 dark:text-white">
                      {c.code} ({c.symbol})
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center text-slate-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Quick Presets */}
            {isMajorUnitCurrency ? (
              <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto pb-1 no-scrollbar text-xs font-inter -mx-0.5 px-0.5">
                <span className="text-slate-400 text-[11px] shrink-0 font-medium">{t('form.quick')}</span>
                <button
                  type="button"
                  onClick={() => handleQuickAdd(100)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:text-blue-700 dark:hover:text-blue-300 active:scale-95 text-slate-600 dark:text-slate-300 font-medium transition-all shrink-0 text-[11px] cursor-pointer"
                >
                  +100
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAdd(500)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:text-blue-700 dark:hover:text-blue-300 active:scale-95 text-slate-600 dark:text-slate-300 font-medium transition-all shrink-0 text-[11px] cursor-pointer"
                >
                  +500
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAdd(1000)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:text-blue-700 dark:hover:text-blue-300 active:scale-95 text-slate-600 dark:text-slate-300 font-medium transition-all shrink-0 text-[11px] cursor-pointer"
                >
                  +1 000
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAdd(5000)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:text-blue-700 dark:hover:text-blue-300 active:scale-95 text-slate-600 dark:text-slate-300 font-medium transition-all shrink-0 text-[11px] cursor-pointer"
                >
                  +5 000
                </button>
                <button
                  type="button"
                  onClick={() => onAmountChange(1000)}
                  className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-medium hover:bg-blue-100 dark:hover:bg-blue-900/60 active:scale-95 transition-all shrink-0 text-[11px] cursor-pointer"
                >
                  1 000 {currency}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto pb-1 no-scrollbar text-xs font-inter -mx-0.5 px-0.5">
                <span className="text-slate-400 text-[11px] shrink-0 font-medium">{t('form.quick')}</span>
                <button
                  type="button"
                  onClick={() => handleQuickAdd(100000)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:text-blue-700 dark:hover:text-blue-300 active:scale-95 text-slate-600 dark:text-slate-300 font-medium transition-all shrink-0 text-[11px] cursor-pointer"
                >
                  +100 {t('form.thousandShort')}
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAdd(1000000)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:text-blue-700 dark:hover:text-blue-300 active:scale-95 text-slate-600 dark:text-slate-300 font-medium transition-all shrink-0 text-[11px] cursor-pointer"
                >
                  +1 {t('form.millionShort')}
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAdd(5000000)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:text-blue-700 dark:hover:text-blue-300 active:scale-95 text-slate-600 dark:text-slate-300 font-medium transition-all shrink-0 text-[11px] cursor-pointer"
                >
                  +5 {t('form.millionShort')}
                </button>
                <button
                  type="button"
                  onClick={() => onAmountChange(1000000)}
                  className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-medium hover:bg-blue-100 dark:hover:bg-blue-900/60 active:scale-95 transition-all shrink-0 text-[11px] cursor-pointer"
                >
                  1 000 000 {currency}
                </button>
              </div>
            )}
          </div>

          {/* VAT Rate Input & Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 font-inter">
                {t('form.rateLabel')}
              </label>
              <button
                type="button"
                onClick={onOpenRatesList}
                className="text-[11px] text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 font-medium transition-colors font-inter cursor-pointer"
              >
                <Info className="w-3.5 h-3.5" />
                {t('form.worldRates')}
              </button>
            </div>

            {!isCustomRate ? (
              <div className="relative">
                <select
                  value={vatRate}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === 'custom') {
                      setIsCustomRate(true);
                      setCustomRateInput(vatRate.toString());
                    } else {
                      onVatRateChange(parseFloat(val));
                    }
                  }}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer appearance-none pr-8 font-inter"
                >
                  <option value="20">{t('form.ratePresets.standard20')}</option>
                  <option value="19">{t('form.ratePresets.de19')}</option>
                  <option value="12">{t('form.ratePresets.uzkz12')}</option>
                  <option value="10">{t('form.ratePresets.jpau10')}</option>
                  <option value="7">{t('form.ratePresets.us7')}</option>
                  <option value="5">{t('form.ratePresets.ae5')}</option>
                  <option value="0">{t('form.ratePresets.zero')}</option>
                  <option value="custom">{t('form.ratePresets.custom')}</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={customRateInput}
                    onChange={(e) => {
                      setCustomRateInput(e.target.value);
                      const parsed = parseFloat(e.target.value);
                      if (!isNaN(parsed)) {
                        onVatRateChange(parsed);
                      }
                    }}
                    placeholder={t('form.customRateLabel')}
                    className="w-full rounded-xl border border-blue-500 px-3.5 py-2.5 text-sm font-semibold text-slate-900 dark:text-white bg-blue-50/20 dark:bg-blue-950/30 pr-8 font-inter"
                  />
                  <Percent className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                </div>
                <button
                  type="button"
                  onClick={() => setIsCustomRate(false)}
                  className="px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer font-inter"
                >
                  {t('sidebar.allCountries')}
                </button>
              </div>
            )}
          </div>

          {/* Rounding Checkbox */}
          <div className="pt-1">
            <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={roundToTwoDecimals}
                onChange={(e) => onRoundToggle(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
              />
              <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium font-inter">
                {t('form.roundTwoDecimals')}
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* 3. Optional Info for Accountants & Business */}
      <div className="mb-6 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5 mb-3.5">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center font-montserrat">
            3
          </span>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-montserrat">
            {t('additional.stepTitle')}
          </h2>
        </div>

        <div className="space-y-3 font-inter">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              {t('additional.itemName')}
            </label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => onItemNameChange(e.target.value)}
              placeholder={t('additional.itemNamePlaceholder')}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              {t('additional.note')}
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => onNoteChange(e.target.value)}
              placeholder={t('additional.notePlaceholder')}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Toggle Table View */}
          <div className="pt-1 flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
              {t('examples.title')}
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={showTableView}
              onClick={() => onToggleTableView(!showTableView)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                showTableView ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  showTableView ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons: Calculate & Reset */}
      <div className="flex items-center gap-2.5 sm:gap-3 pt-3 font-montserrat">
        <button
          type="button"
          onClick={onCalculate}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 sm:py-2.5 min-h-[46px] rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm shadow-blue-600/25 active:scale-[0.98] transition-all cursor-pointer"
        >
          <CalcIcon className="w-4 h-4 shrink-0" />
          <span>{t('additional.calculate')}</span>
        </button>

        <button
          type="button"
          onClick={onReset}
          className="flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-3 sm:py-2.5 min-h-[46px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm active:scale-[0.98] transition-all cursor-pointer shrink-0"
        >
          <RotateCcw className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
          <span>{t('additional.reset')}</span>
        </button>
      </div>
    </div>
  );
};

