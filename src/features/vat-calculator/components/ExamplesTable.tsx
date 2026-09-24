import React, { useState } from 'react';
import { VatMode } from '../types';
import { formatNumber } from '../utils/vatCalculations';
import { useApp } from '../context/AppContext';

interface ExamplesTableProps {
  currentRate: number;
  currency: string;
  onApplyExample: (amount: number, mode: VatMode) => void;
}

export const ExamplesTable: React.FC<ExamplesTableProps> = ({
  currentRate,
  currency,
  onApplyExample,
}) => {
  const { t } = useApp();
  const [tab, setTab] = useState<VatMode>('add');

  const isMajorUnitCurrency = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'CHF'].includes(currency);
  const baseAmounts = isMajorUnitCurrency ? [100, 500, 1000, 5000] : [100000, 500000, 1000000, 5000000];

  const getRowData = (base: number) => {
    const rateFraction = currentRate / 100;
    if (tab === 'add') {
      const withoutVat = base;
      const vat = base * rateFraction;
      const withVat = withoutVat + vat;
      return { col1: withoutVat, col2: vat, col3: withVat, inputVal: base };
    } else if (tab === 'extract') {
      const withVat = base;
      const withoutVat = currentRate > 0 ? withVat / (1 + rateFraction) : withVat;
      const vat = withVat - withoutVat;
      return { col1: withVat, col2: vat, col3: withoutVat, inputVal: base };
    } else {
      const baseVal = base;
      const vat = baseVal * rateFraction;
      const total = baseVal + vat;
      return { col1: baseVal, col2: vat, col3: total, inputVal: base };
    }
  };

  const getCol1Header = () => {
    if (tab === 'add') return t('result.netAmount');
    if (tab === 'extract') return t('result.grossTotal');
    return t('examples.colBase');
  };

  const getCol3Header = () => {
    if (tab === 'add') return t('result.grossTotal');
    if (tab === 'extract') return t('result.netAmount');
    return t('examples.colTotal');
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-6 shadow-2xs transition-colors overflow-hidden">
      <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-3 sm:mb-3.5 font-montserrat">
        {t('examples.title')}
      </h2>

      {/* Mini tabs */}
      <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-100/90 dark:bg-slate-800 p-1 mb-3.5 text-[11px] sm:text-xs font-semibold font-montserrat">
        <button
          type="button"
          onClick={() => setTab('add')}
          title={t('examples.tabAdd')}
          className={`w-full py-2 sm:py-1.5 px-1 rounded-lg text-center transition-all cursor-pointer truncate active:scale-95 ${
            tab === 'add'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          {t('examples.tabAdd')}
        </button>
        <button
          type="button"
          onClick={() => setTab('extract')}
          title={t('examples.tabExtract')}
          className={`w-full py-2 sm:py-1.5 px-1 rounded-lg text-center transition-all cursor-pointer truncate active:scale-95 ${
            tab === 'extract'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          {t('examples.tabExtract')}
        </button>
        <button
          type="button"
          onClick={() => setTab('calculate_only')}
          title={t('examples.tabOnly')}
          className={`w-full py-2 sm:py-1.5 px-1 rounded-lg text-center transition-all cursor-pointer truncate active:scale-95 ${
            tab === 'calculate_only'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          {t('examples.tabOnly')}
        </button>
      </div>

      {/* Table */}
      <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden text-xs font-inter">
        <div className="grid grid-cols-3 bg-slate-50 dark:bg-slate-800 px-3 py-2 font-semibold text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 text-[11px] font-montserrat">
          <div className="truncate">{getCol1Header()}</div>
          <div className="text-center truncate">{t('result.vatRate')} ({currentRate}%)</div>
          <div className="text-right truncate">{getCol3Header()}</div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {baseAmounts.map((amt) => {
            const data = getRowData(amt);
            return (
              <button
                key={amt}
                type="button"
                onClick={() => onApplyExample(data.inputVal, tab)}
                className="w-full grid grid-cols-3 px-3 py-2.5 sm:py-2 text-slate-700 dark:text-slate-300 hover:bg-blue-50/60 dark:hover:bg-slate-800/80 transition-colors text-left group cursor-pointer active:bg-blue-100/50"
              >
                <div className="font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 whitespace-nowrap tabular-nums">
                  {formatNumber(data.col1, 0, false)}
                </div>
                <div className="text-center text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 whitespace-nowrap tabular-nums">
                  {formatNumber(data.col2, 0, false)}
                </div>
                <div className="text-right font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 whitespace-nowrap tabular-nums">
                  {formatNumber(data.col3, 0, false)}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

