import React, { useState } from 'react';
import { Currency, AlertNotification, UsefulTool } from '../types';
import { FlagIcon } from './FlagIcon';
import {
  X,
  Bell,
  Search,
  Download,
  Calculator,
  ArrowLeftRight,
  Sparkles,
  SlidersHorizontal,
  Bitcoin,
  Boxes,
  Check,
} from 'lucide-react';

// Alert Modal
interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (alert: Omit<AlertNotification, 'id' | 'createdAt'>, id?: string) => void;
  editingAlert?: AlertNotification | null;
  currencies: Currency[];
  t?: any;
  getCurrencyName?: (code: string, fallback: string) => string;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingAlert,
  currencies,
  t,
  getCurrencyName,
}) => {
  if (!isOpen) return null;

  const [base, setBase] = useState(editingAlert?.baseCurrency || 'USD');
  const [target, setTarget] = useState(editingAlert?.targetCurrency || 'UZS');
  const [condition, setCondition] = useState<'>=' | '<='>(editingAlert?.condition || '>=');
  const [threshold, setThreshold] = useState<string>(
    editingAlert ? editingAlert.threshold.toString() : '13000'
  );
  const [enabled, setEnabled] = useState(editingAlert ? editingAlert.enabled : true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(threshold.replace(/\s+/g, '')) || 0;
    onSave(
      {
        baseCurrency: base,
        targetCurrency: target,
        condition,
        threshold: num,
        enabled,
      },
      editingAlert?.id
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Bell className="w-4.5 h-4.5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">
              {editingAlert
                ? (t?.modals?.alert?.editTitle || 'Редактировать уведомление')
                : (t?.modals?.alert?.newTitle || 'Новое уведомление о курсе')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t?.modals?.alert?.currencyPair || 'Валютная пара'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={base}
                onChange={(e) => setBase(e.target.value)}
                className="border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 bg-white font-medium"
              >
                {currencies
                  .filter((c) => c.code !== 'UZS')
                  .map((c) => (
                    <option key={`alert-base-${c.code}`} value={c.code}>
                      {c.code} — {getCurrencyName ? getCurrencyName(c.code, c.name) : c.name}
                    </option>
                  ))}
              </select>

              <select
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 bg-white font-medium"
              >
                <option value="UZS">UZS — {getCurrencyName ? getCurrencyName('UZS', 'Узбекский сум') : 'Узбекский сум'}</option>
                <option value="USD">USD — {getCurrencyName ? getCurrencyName('USD', 'Доллар США') : 'Доллар США'}</option>
                <option value="EUR">EUR — {getCurrencyName ? getCurrencyName('EUR', 'Евро') : 'Евро'}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t?.modals?.alert?.conditionLabel || 'Условие срабатывания'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCondition('>=')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  condition === '>='
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {t?.modals?.alert?.greaterOrEqual || 'Курс ≥ (больше или равен)'}
              </button>
              <button
                type="button"
                onClick={() => setCondition('<=')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  condition === '<='
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {t?.modals?.alert?.lessOrEqual || 'Курс ≤ (меньше или равен)'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t?.modals?.alert?.thresholdLabel || 'Пороговое значение'} ({target})
            </label>
            <input
              type="text"
              required
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              placeholder="13 000"
              className="w-full border border-slate-200 rounded-xl p-2.5 text-sm font-bold text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none"
            />
          </div>

          <div className="flex items-center justify-between py-2 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-700">
              {t?.modals?.alert?.enableAlert || 'Включить уведомление'}
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enabled}
                onChange={() => setEnabled(!enabled)}
                className="sr-only"
              />
              <div
                className={`w-8 h-4.5 rounded-full transition-colors relative ${
                  enabled ? 'bg-blue-600' : 'bg-slate-200'
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full bg-white shadow-2xs absolute top-0.5 transition-transform ${
                    enabled ? 'left-4' : 'left-0.5'
                  }`}
                />
              </div>
            </label>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-slate-200 text-slate-600 font-semibold text-xs rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            >
              {t?.modals?.alert?.cancel || 'Отмена'}
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {editingAlert
                ? (t?.modals?.alert?.saveChanges || 'Сохранить изменения')
                : (t?.modals?.alert?.createAlert || 'Создать уведомление')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Search Dialog (Ctrl+K)
interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  currencies: Currency[];
  onSelectCurrency: (code: string) => void;
  onSelectTool: (tool: UsefulTool) => void;
  t?: any;
  getCurrencyName?: (code: string, fallback: string) => string;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  currencies,
  onSelectCurrency,
  onSelectTool,
  t,
  getCurrencyName,
}) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');

  const filteredCurrencies = currencies.filter(
    (c) =>
      c.code.toLowerCase().includes(query.toLowerCase()) ||
      c.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-20 p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center gap-2.5 sm:gap-3 border-b border-slate-100 pb-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t?.modals?.search?.placeholder || 'Поиск валют, конвертеров или графиков...'}
            className="w-full text-xs sm:text-sm outline-none text-slate-800 placeholder-slate-400 font-medium"
          />
          <button
            type="button"
            onClick={onClose}
            className="sm:hidden text-slate-400 p-1 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          <kbd className="hidden sm:inline-block text-[10px] bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded border border-slate-200">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto mt-2 space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
            {t?.modals?.search?.currencies || 'Валюты'}
          </div>
          {filteredCurrencies.map((c) => {
            const localizedName = getCurrencyName ? getCurrencyName(c.code, c.name) : c.name;
            return (
              <button
                key={`search-${c.code}`}
                onClick={() => {
                  onSelectCurrency(c.code);
                  onClose();
                }}
                className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <FlagIcon code={c.code} size="sm" />
                  <div>
                    <span className="font-bold text-xs text-slate-900 mr-2">{c.code}</span>
                    <span className="text-xs text-slate-500">{localizedName}</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-900">
                  {c.rate.toLocaleString('ru-RU')} UZS
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Interactive Tool Modal (Salary calculator, comparison, crypto, CSV export)
interface ToolModalProps {
  tool: UsefulTool | null;
  onClose: () => void;
  currencies: Currency[];
  t?: any;
}

export const ToolModal: React.FC<ToolModalProps> = ({ tool, onClose, currencies, t }) => {
  if (!tool) return null;

  const toolData = t?.tools?.items?.[tool.id];
  const title = toolData?.title || tool.title;
  const description = toolData?.description || tool.description;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">{title}</h3>
              <p className="text-xs text-slate-400">{description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Tool Content */}
        {tool.id === 'salary' && <SalaryCalculatorTool currencies={currencies} t={t} />}
        {tool.id === 'history' && <HistoryExportTool currencies={currencies} t={t} />}
        {tool.id === 'compare' && <CompareTool currencies={currencies} t={t} />}
        {tool.id === 'crypto' && <CryptoRatesTool t={t} />}
        {tool.id === 'metals' && <MetalsRatesTool t={t} />}
        {tool.id === 'converter' && <div className="text-xs text-slate-600">{t?.modals?.tool?.converterNotice || 'Основной конвертер уже доступен на главном экране слева!'}</div>}
      </div>
    </div>
  );
};

// Sub-component: Salary Calculator
const SalaryCalculatorTool: React.FC<{ currencies: Currency[]; t?: any }> = ({ currencies, t }) => {
  const [salaryUsd, setSalaryUsd] = useState('1500');
  const usdRate = currencies.find((c) => c.code === 'USD')?.rate || 12650;
  const num = parseFloat(salaryUsd.replace(/\s+/g, '')) || 0;
  const inUzs = num * usdRate;
  const annualUzs = inUzs * 12;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          {t?.modals?.tool?.salaryUsdLabel || 'Зарплата в долларах США (USD / месяц)'}
        </label>
        <div className="border border-slate-200 rounded-xl p-2.5 flex items-center gap-2">
          <span className="font-bold text-slate-400 text-sm">$</span>
          <input
            type="text"
            value={salaryUsd}
            onChange={(e) => setSalaryUsd(e.target.value)}
            className="font-bold text-base text-slate-900 outline-none w-full"
          />
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-500">{t?.modals?.tool?.salaryAtRate || 'По курсу ЦБ РУз (1 USD = {rate} UZS):'?.replace('{rate}', usdRate.toString())}</span>
          <span className="font-bold text-slate-900 text-sm">{Math.round(inUzs).toLocaleString('ru-RU')} {t?.converter?.som || 'сум'}</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-500">{t?.modals?.tool?.salaryPerYear || 'За год (12 месяцев):'}</span>
          <span className="font-bold text-blue-600 text-sm">{Math.round(annualUzs).toLocaleString('ru-RU')} {t?.converter?.som || 'сум'}</span>
        </div>
        <div className="flex justify-between items-center text-xs border-t border-slate-200/60 pt-2">
          <span className="text-slate-500">{t?.modals?.tool?.salaryPerDay || 'В день (22 рабочих дня):'}</span>
          <span className="font-semibold text-slate-800">{Math.round(inUzs / 22).toLocaleString('ru-RU')} {t?.converter?.som || 'сум'} / {t?.modals?.tool?.day || 'день'}</span>
        </div>
      </div>
    </div>
  );
};

// Sub-component: History CSV Export
const HistoryExportTool: React.FC<{ currencies: Currency[]; t?: any }> = ({ currencies, t }) => {
  const [downloaded, setDownloaded] = useState(false);

  const handleExport = () => {
    const header = 'Дата,Валюта,Курс к UZS\n';
    const rows = currencies
      .map((c) => `15.09.2026,${c.code},${c.rate}`)
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'cbu_rates_history_2026.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <div className="space-y-4 text-xs text-slate-600">
      <p>
        {t?.modals?.tool?.exportDescription || 'Вы можете экспортировать актуальные официальные котировки валют Центрального банка в формате CSV для Excel, Google Таблиц или 1С.'}
      </p>
      <button
        type="button"
        onClick={handleExport}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
      >
        {downloaded ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
        <span>{downloaded ? (t?.modals?.tool?.fileDownloaded || 'Файл скачан!') : (t?.modals?.tool?.downloadCsv || 'Скачать CSV (Excel)')}</span>
      </button>
    </div>
  );
};

// Sub-component: Compare Tool
const CompareTool: React.FC<{ currencies: Currency[]; t?: any }> = ({ currencies, t }) => {
  const usd = currencies.find((c) => c.code === 'USD');
  const eur = currencies.find((c) => c.code === 'EUR');

  return (
    <div className="space-y-3 text-xs">
      <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FlagIcon code="USD" size="sm" />
          <span className="font-bold text-slate-900">USD (USD)</span>
        </div>
        <span className="font-bold text-slate-900">{usd?.rate.toLocaleString('ru-RU')} UZS</span>
      </div>

      <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FlagIcon code="EUR" size="sm" />
          <span className="font-bold text-slate-900">EUR (EUR)</span>
        </div>
        <span className="font-bold text-slate-900">{eur?.rate.toLocaleString('ru-RU')} UZS</span>
      </div>

      <div className="text-slate-500 text-[11px] leading-relaxed">
        {t?.modals?.tool?.compareDifference || 'Разница между курсами:'}{' '}
        <strong className="text-slate-800">
          {eur && usd ? Math.round(eur.rate - usd.rate) : 874} UZS
        </strong>{' '}
        (EUR/USD ≈ 1.069).
      </div>
    </div>
  );
};

// Sub-component: Crypto
const CryptoRatesTool: React.FC<{ t?: any }> = ({ t }) => {
  const mlnSom = t?.converter?.som ? `млн ${t.converter.som}` : 'млн сум';
  const som = t?.converter?.som || 'сум';
  return (
    <div className="space-y-2 text-xs">
      {[
        { code: 'BTC', name: 'Bitcoin', usd: '$64,250', uzs: `812.7 ${mlnSom}`, change: '+2.4%' },
        { code: 'ETH', name: 'Ethereum', usd: '$3,480', uzs: `44.0 ${mlnSom}`, change: '+1.8%' },
        { code: 'TON', name: 'Toncoin', usd: '$5.65', uzs: `71 472 ${som}`, change: '+4.1%' },
        { code: 'USDT', name: 'Tether USD', usd: '$1.00', uzs: `12 650 ${som}`, change: '+0.0%' },
      ].map((coin) => (
        <div key={coin.code} className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between">
          <div>
            <div className="font-bold text-slate-900">{coin.name} ({coin.code})</div>
            <div className="text-[11px] text-slate-400">{coin.uzs}</div>
          </div>
          <div className="text-right">
            <div className="font-bold text-slate-900">{coin.usd}</div>
            <div className="text-[11px] text-emerald-600 font-semibold">{coin.change}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Sub-component: Metals
const MetalsRatesTool: React.FC<{ t?: any }> = ({ t }) => {
  const som = t?.converter?.som || 'сум';
  return (
    <div className="space-y-2 text-xs">
      {[
        { name: 'Золото (Gold, 1г)', code: 'XAU', uzs: `1 085 000 ${som}`, change: '+0.45%' },
        { name: 'Серебро (Silver, 1г)', code: 'XAG', uzs: `13 800 ${som}`, change: '+1.10%' },
        { name: 'Платина (Platinum, 1г)', code: 'XPT', uzs: `418 000 ${som}`, change: '-0.15%' },
      ].map((metal) => (
        <div key={metal.code} className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between">
          <div>
            <div className="font-bold text-slate-900">{metal.name}</div>
            <div className="text-[11px] text-slate-400">{t?.dataSource?.officialBadge || 'ЦБ Республики Узбекистан'}</div>
          </div>
          <div className="text-right">
            <div className="font-bold text-slate-900">{metal.uzs}</div>
            <div className={`text-[11px] font-semibold ${metal.change.startsWith('+') ? 'text-emerald-600' : 'text-rose-500'}`}>
              {metal.change}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
