import React, { useState, useMemo } from "react";
import {
  X,
  Search,
  Clock,
  Heart,
  Trash2,
  ExternalLink,
  Truck,
  Box,
  Coins,
  Check,
  RotateCcw,
} from "lucide-react";
import { HistoryItem, HsCodeItem } from "../types";
import { searchAllHsCodes } from "../data/hsDatabase";
import { formatUZS, formatUSD } from "../utils/calculator";
import { useTranslation } from "../context/LanguageContext";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCode: (code: HsCodeItem) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectCode }) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");

  if (!isOpen) return null;

  const results = useMemo(() => {
    return searchAllHsCodes(query);
  }, [query]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-3 sm:px-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-3.5 sm:p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("modals.searchPlaceholder")}
            className="flex-1 bg-transparent text-sm font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none min-w-0"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg ml-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-2 divide-y divide-slate-100 dark:divide-slate-800">
          {query.trim().length > 1 &&
            ("курсы валют".includes(query.toLowerCase()) ||
              "конвертер".includes(query.toLowerCase()) ||
              "валют".includes(query.toLowerCase()) ||
              "курс".includes(query.toLowerCase()) ||
              "доллар".includes(query.toLowerCase()) ||
              "usd".includes(query.toLowerCase()) ||
              "rate".includes(query.toLowerCase()) ||
              "currency".includes(query.toLowerCase()) ||
              "exchange".includes(query.toLowerCase()) ||
              "valyuta".includes(query.toLowerCase())) && (
              <a
                href="https://toolboxi.uz/tools/currency-rates"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-left p-3 hover:bg-blue-50/80 dark:hover:bg-blue-950/60 rounded-xl transition-colors flex items-center justify-between cursor-pointer group border border-blue-100 dark:border-blue-900 bg-blue-50/40 dark:bg-blue-950/30 mb-2"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#0066FF] text-white flex items-center justify-center shrink-0">
                    <Coins className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-[#0066FF] dark:text-blue-400">
                      Toolboxi.uz
                    </div>
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#0066FF] dark:group-hover:text-blue-400 truncate">
                      {t("bottomGrid.currencyRates")}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      toolboxi.uz/tools/currency-rates
                    </div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-[#0066FF] dark:group-hover:text-blue-400 shrink-0 ml-2" />
              </a>
            )}

          <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            {t("modals.hsDatabase")}
          </div>
          {results.map((item) => (
            <button
              key={item.code}
              onClick={() => {
                onSelectCode(item);
                onClose();
              }}
              className="w-full text-left p-3 hover:bg-blue-50 dark:hover:bg-slate-800/80 rounded-xl transition-colors flex items-center justify-between cursor-pointer group"
            >
              <div className="min-w-0 flex-1 pr-2">
                <div className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                  {item.code}
                </div>
                <div className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                  {t(`goods.${item.code.replace(/\s+/g, "")}`, item.name)}
                </div>
                <div className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">
                  {t("modals.category")}: {item.category} • {t("modals.duty")}: {item.dutyRate}% •{" "}
                  {t("modals.vat")}: {item.vatRate}%
                </div>
              </div>
            </button>
          ))}
          {results.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-sm">
              {t("calculator.nothingFound")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelectHistory: (item: HistoryItem) => void;
  onClearHistory: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onSelectHistory,
  onClearHistory,
}) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100 text-base sm:text-lg">
            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>{t("history.title")}</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-3.5 sm:p-4 space-y-2.5">
          {history.length > 0 ? (
            history.map((item) => (
              <div
                key={item.id}
                className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50/40 dark:hover:bg-slate-800 transition-all flex items-center justify-between gap-3 group"
              >
                <div
                  className="cursor-pointer flex-1 min-w-0"
                  onClick={() => {
                    onSelectHistory(item);
                    onClose();
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                      {item.hsCode}
                    </span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">
                      {item.date}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 line-clamp-1 mt-0.5">
                    {t(`goods.${item.hsCode.replace(/\s+/g, "")}`, item.productName)}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {t("modals.total")}:{" "}
                    <strong className="text-slate-900 dark:text-slate-100">
                      {formatUZS(item.totalUZS)}
                    </strong>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">
              {t("history.empty")}
            </div>
          )}
        </div>

        {history.length > 0 && (
          <div className="p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              onClick={onClearHistory}
              className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 font-semibold cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>{t("history.clear")}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

interface RateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRate: number;
  onSaveRate: (rate: number) => void;
}

export const RateModal: React.FC<RateModalProps> = ({
  isOpen,
  onClose,
  currentRate,
  onSaveRate,
}) => {
  const { t } = useTranslation();
  const [val, setVal] = useState(currentRate.toString());

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-sm w-full p-4 sm:p-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
            {t("modals.rateTitle")}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4 space-y-3">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">
            {t("modals.rateValue")}
          </label>
          <input
            type="number"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-base font-bold text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-750 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />

          <div className="flex gap-2">
            {[12650, 12700, 12850].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setVal(preset.toString())}
                className="flex-1 py-1 text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-200 font-medium cursor-pointer"
              >
                {preset}
              </button>
            ))}
          </div>

          <a
            href="https://toolboxi.uz/tools/currency-rates"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between text-xs text-[#0066FF] dark:text-blue-400 hover:text-blue-700 bg-blue-50/60 dark:bg-blue-950/50 hover:bg-blue-50 dark:hover:bg-blue-900/60 px-3 py-2 rounded-xl transition-colors border border-blue-100 dark:border-blue-900"
          >
            <div className="flex items-center gap-2">
              <Coins className="w-3.5 h-3.5 text-[#0066FF] dark:text-blue-400" />
              <span className="font-medium">{t("modals.checkRates")}</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
          >
            {t("common.cancel")}
          </button>
          <button
            onClick={() => {
              const num = Number(val);
              if (num > 0) onSaveRate(num);
              onClose();
            }}
            className="flex-1 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl cursor-pointer shadow-xs"
          >
            {t("common.apply")}
          </button>
        </div>
      </div>
    </div>
  );
};

interface RelatedToolModalProps {
  toolType: "shipping" | "volumetric" | "currency" | null;
  onClose: () => void;
}

export const RelatedToolModal: React.FC<RelatedToolModalProps> = ({ toolType, onClose }) => {
  const { t } = useTranslation();
  // Shipping state
  const [shippingWeight, setShippingWeight] = useState(15);
  const [shippingTransport, setShippingTransport] = useState<"air" | "auto" | "rail">("air");

  // Volumetric state
  const [length, setLength] = useState(40);
  const [width, setWidth] = useState(30);
  const [height, setHeight] = useState(25);

  // Currency state
  const [currAmount, setCurrAmount] = useState(1000);
  const [currency, setCurrency] = useState<"USD" | "EUR" | "RUB" | "CNY">("USD");

  if (!toolType) return null;

  const ratesToUZS: Record<string, number> = {
    USD: 12650,
    EUR: 13800,
    RUB: 135,
    CNY: 1780,
  };

  // Volumetric formula L*W*H / 5000 (kg)
  const volWeight = ((length * width * height) / 5000).toFixed(2);

  // Shipping estimate formula
  const transportCostPerKg: Record<string, number> = {
    air: 8.5,
    auto: 3.2,
    rail: 1.8,
  };
  const estimatedShippingCost = Math.round(shippingWeight * transportCostPerKg[shippingTransport]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-4 sm:p-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            {toolType === "shipping" && (
              <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            )}
            {toolType === "volumetric" && (
              <Box className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            )}
            {toolType === "currency" && (
              <Coins className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            )}
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base sm:text-lg">
              {toolType === "shipping" && t("modals.shippingCalc")}
              {toolType === "volumetric" && t("modals.volumetricCalc")}
              {toolType === "currency" && t("modals.currencyConverter")}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 sm:py-5">
          {toolType === "shipping" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  {t("modals.cargoWeight")}
                </label>
                <input
                  type="number"
                  value={shippingWeight}
                  onChange={(e) => setShippingWeight(Number(e.target.value) || 1)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  {t("modals.transportType")}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setShippingTransport("air")}
                    className={`py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                      shippingTransport === "air"
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {t("modals.airDays")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShippingTransport("auto")}
                    className={`py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                      shippingTransport === "auto"
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {t("modals.autoDays")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShippingTransport("rail")}
                    className={`py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                      shippingTransport === "rail"
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {t("modals.railDays")}
                  </button>
                </div>
              </div>

              <div className="p-4 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 rounded-xl text-center">
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {t("modals.estimatedFreight")}
                </div>
                <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">
                  ~ {estimatedShippingCost} USD
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  ({(estimatedShippingCost * 12650).toLocaleString("ru-RU")} UZS)
                </div>
              </div>
            </div>
          )}

          {toolType === "volumetric" && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    {t("modals.length")}
                  </label>
                  <input
                    type="number"
                    value={length}
                    onChange={(e) => setLength(Number(e.target.value) || 0)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 sm:px-3 py-2 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    {t("modals.width")}
                  </label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value) || 0)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 sm:px-3 py-2 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    {t("modals.height")}
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value) || 0)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 sm:px-3 py-2 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="p-4 bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 rounded-xl text-center">
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {t("modals.volumetricWeight")}
                </div>
                <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
                  {volWeight} {t("common.kg")}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  {t("modals.iataFormula")}
                </div>
              </div>
            </div>
          )}

          {toolType === "currency" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    {t("modals.amount")}
                  </label>
                  <input
                    type="number"
                    value={currAmount}
                    onChange={(e) => setCurrAmount(Number(e.target.value) || 0)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    {t("modals.currency")}
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="RUB">RUB</option>
                    <option value="CNY">CNY</option>
                  </select>
                </div>
              </div>

              <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900 rounded-xl text-center">
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {t("modals.cbuRate")}
                </div>
                <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                  {formatUZS(currAmount * ratesToUZS[currency])}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  1 {currency} = {ratesToUZS[currency].toLocaleString("ru-RU")} UZS
                </div>
              </div>

              <a
                href="https://toolboxi.uz/tools/currency-rates"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#0066FF] hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-xs"
              >
                <span>{t("modals.openCurrencyTool")}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 text-sm font-bold text-white bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 rounded-xl cursor-pointer transition-colors"
        >
          {t("common.close")}
        </button>
      </div>
    </div>
  );
};
