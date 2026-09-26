import React, { useState } from "react";
import { Calculator, RotateCcw, Info, ChevronDown, Check } from "lucide-react";
import { LoanParams, Currency, CURRENCY_OPTIONS } from "../types";
import { formatCurrencyNumber } from "../utils/loanCalculations";
import { useLanguage } from "../context/LanguageContext";

interface CalculatorFormProps {
  params: LoanParams;
  onChange: (updated: Partial<LoanParams>) => void;
  onReset: () => void;
  onCalculate: () => void;
  onScrollToRates: () => void;
}

export const CalculatorForm: React.FC<CalculatorFormProps> = ({
  params,
  onChange,
  onReset,
  onCalculate,
  onScrollToRates,
}) => {
  const { t, language } = useLanguage();
  const [showAdditional, setShowAdditional] = useState(false);

  // Find currency config for slider bounds
  const currentCurrencyOpt =
    CURRENCY_OPTIONS.find((c) => c.code === params.currency) || CURRENCY_OPTIONS[0];

  const handleAmountChange = (valStr: string) => {
    const cleaned = valStr.replace(/\D/g, "");
    const num = cleaned ? parseInt(cleaned, 10) : 0;
    onChange({ amount: Math.min(100000000000, num) });
  };

  const handleAddAmount = (addVal: number) => {
    onChange({ amount: params.amount + addVal });
  };

  const handleSetAmount = (setVal: number) => {
    onChange({ amount: setVal });
  };

  const handleSetTerm = (months: number) => {
    onChange({ termMonths: months });
  };

  const handleSetRate = (rate: number) => {
    onChange({ interestRate: rate });
  };

  const handleDownPaymentChange = (valStr: string) => {
    const cleaned = valStr.replace(/\D/g, "");
    const num = cleaned ? parseInt(cleaned, 10) : 0;
    onChange({ downPayment: Math.min(params.amount, num) });
  };

  const getQuickAmounts = () => {
    if (params.currency === "$" || params.currency === "€") {
      return [
        { label: "+5k", add: 5000 },
        { label: "+10k", add: 10000 },
        { label: "25 000", set: 25000 },
        { label: "50 000", set: 50000 },
        { label: "100 000", set: 100000 },
        { label: "300 000", set: 300000 },
      ];
    }
    if (params.currency === "₽") {
      const kSuffix = language === "en" ? "k" : language === "uz" ? " ming" : " тыс";
      const mSuffix = language === "en" ? "M" : language === "uz" ? " mln" : " млн";
      return [
        { label: `+300${kSuffix}`, add: 300000 },
        { label: `+1${mSuffix}`, add: 1000000 },
        { label: `1.5${mSuffix}`, set: 1500000 },
        { label: `3${mSuffix}`, set: 3000000 },
        { label: `5${mSuffix}`, set: 5000000 },
        { label: `10${mSuffix}`, set: 10000000 },
      ];
    }
    if (params.currency === "₸") {
      const mSuffix = language === "en" ? "M" : language === "uz" ? " mln" : " млн";
      return [
        { label: `+1${mSuffix}`, add: 1000000 },
        { label: `+5${mSuffix}`, add: 5000000 },
        { label: `10${mSuffix}`, set: 10000000 },
        { label: `25${mSuffix}`, set: 25000000 },
        { label: `50${mSuffix}`, set: 50000000 },
      ];
    }
    // Default UZS
    const mSuffix = language === "en" ? "M" : language === "uz" ? " mln" : " млн";
    const bSuffix = language === "en" ? "B" : language === "uz" ? " mlrd" : " млрд";
    return [
      { label: `+10${mSuffix}`, add: 10000000 },
      { label: `+50${mSuffix}`, add: 50000000 },
      { label: `100${mSuffix}`, set: 100000000 },
      { label: `300${mSuffix}`, set: 300000000 },
      { label: `1${bSuffix}`, set: 1000000000 },
    ];
  };

  const quickAmounts = getQuickAmounts();

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/85 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs transition-colors">
      {/* 1. Режим расчёта */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-2.5">
          <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-heading text-xs font-bold flex items-center justify-center shrink-0">
            1
          </span>
          <h2 className="font-heading text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
            {t.form.step1Title}
          </h2>
        </div>

        {/* 2 Mode Cards side-by-side */}
        <div className="grid grid-cols-2 gap-2">
          {/* Card 1: Annuity */}
          <button
            id="mode-annuity"
            type="button"
            onClick={() => onChange({ paymentType: "annuity" })}
            className={`p-3 rounded-xl text-left transition-all border cursor-pointer ${
              params.paymentType === "annuity"
                ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50/50 dark:hover:bg-slate-800/80"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-heading text-xs sm:text-sm font-bold block leading-snug">
                {t.form.annuityTitle}
              </span>
              {params.paymentType === "annuity" && (
                <span className="w-4 h-4 rounded-full bg-white/25 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white stroke-[3]" />
                </span>
              )}
            </div>
            <span
              className={`font-body text-[11px] block mt-1 leading-tight ${
                params.paymentType === "annuity"
                  ? "text-blue-100"
                  : "text-slate-400 dark:text-slate-500"
              }`}
            >
              {t.form.annuityDesc}
            </span>
          </button>

          {/* Card 2: Differentiated */}
          <button
            id="mode-diff"
            type="button"
            onClick={() => onChange({ paymentType: "differentiated" })}
            className={`p-3 rounded-xl text-left transition-all border cursor-pointer ${
              params.paymentType === "differentiated"
                ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50/50 dark:hover:bg-slate-800/80"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-heading text-xs sm:text-sm font-bold block leading-snug">
                {t.form.diffTitle}
              </span>
              {params.paymentType === "differentiated" && (
                <span className="w-4 h-4 rounded-full bg-white/25 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white stroke-[3]" />
                </span>
              )}
            </div>
            <span
              className={`font-body text-[11px] block mt-1 leading-tight ${
                params.paymentType === "differentiated"
                  ? "text-blue-100"
                  : "text-slate-400 dark:text-slate-500"
              }`}
            >
              {t.form.diffDesc}
            </span>
          </button>
        </div>
      </div>

      {/* 2. Введите данные */}
      <div className="mb-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-heading text-xs font-bold flex items-center justify-center shrink-0">
            2
          </span>
          <h2 className="font-heading text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
            {t.form.step2Title}
          </h2>
        </div>

        {/* 1. Поле и ползунок: Сумма кредита */}
        <div>
          <label
            htmlFor="loan-amount-input"
            className="font-heading text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1"
          >
            {t.form.loanAmount}
          </label>
          <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 focus-within:border-blue-600 dark:focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 bg-white dark:bg-slate-950 transition-all overflow-hidden shadow-2xs">
            <input
              id="loan-amount-input"
              type="text"
              inputMode="numeric"
              value={formatCurrencyNumber(params.amount)}
              onChange={(e) => handleAmountChange(e.target.value)}
              className="w-full px-3 py-2 font-heading text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 outline-none bg-transparent"
            />
            <select
              aria-label={t.form.currencyLabel}
              value={params.currency}
              onChange={(e) => {
                const newCur = e.target.value as Currency;
                const opt = CURRENCY_OPTIONS.find((c) => c.code === newCur);
                onChange({
                  currency: newCur,
                  amount: opt ? opt.defaultAmount : params.amount,
                });
              }}
              className="bg-slate-50 dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 px-2.5 py-1.5 font-heading text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {CURRENCY_OPTIONS.map((c) => (
                <option
                  key={c.code}
                  value={c.code}
                  className="dark:bg-slate-900 dark:text-slate-100"
                >
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Ползунок для суммы */}
          <div className="mt-2 px-0.5">
            <input
              type="range"
              min={currentCurrencyOpt.sliderStep}
              max={currentCurrencyOpt.sliderMax}
              step={currentCurrencyOpt.sliderStep}
              value={Math.min(
                currentCurrencyOpt.sliderMax,
                Math.max(currentCurrencyOpt.sliderStep, params.amount),
              )}
              onChange={(e) => onChange({ amount: Number(e.target.value) })}
              className="w-full cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between items-center text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5 font-mono">
              <span>{formatCurrencyNumber(currentCurrencyOpt.sliderStep)}</span>
              <span>
                {formatCurrencyNumber(currentCurrencyOpt.sliderMax)} {params.currency}
              </span>
            </div>
          </div>

          {/* Quick Amount Buttons */}
          <div className="flex flex-wrap items-center gap-1 mt-1.5 text-[11px] text-slate-500">
            <span className="font-medium text-slate-400 dark:text-slate-500 text-[10px]">
              {t.form.quick}
            </span>
            {quickAmounts.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => (q.add ? handleAddAmount(q.add) : q.set && handleSetAmount(q.set))}
                className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-colors text-[10px] cursor-pointer"
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Поле и ползунок: Срок кредита */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label
              htmlFor="loan-term-input"
              className="font-heading text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              {t.form.loanTerm}
            </label>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-body">
              {Math.floor(params.termMonths / 12) > 0 ? (
                <>
                  {(params.termMonths / 12).toFixed(params.termMonths % 12 === 0 ? 0 : 1)}{" "}
                  {t.form.yearsUnit} ({params.termMonths} {t.form.monthsUnit})
                </>
              ) : (
                `${params.termMonths} ${t.form.monthsUnit}`
              )}
            </span>
          </div>

          <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 focus-within:border-blue-600 dark:focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 bg-white dark:bg-slate-950 transition-all overflow-hidden shadow-2xs">
            <input
              id="loan-term-input"
              type="number"
              min={1}
              max={600}
              value={params.termMonths || ""}
              onChange={(e) => onChange({ termMonths: Math.max(1, Number(e.target.value)) })}
              className="w-full px-3 py-2 font-heading text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 outline-none bg-transparent"
            />
            <span className="bg-slate-50 dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 px-3 py-1.5 flex items-center font-heading text-xs font-semibold text-slate-600 dark:text-slate-300">
              {t.form.monthsUnit}
            </span>
          </div>

          {/* Ползунок для срока кредита */}
          <div className="mt-2 px-0.5">
            <input
              type="range"
              min={1}
              max={360}
              step={1}
              value={Math.min(360, Math.max(1, params.termMonths))}
              onChange={(e) => onChange({ termMonths: Number(e.target.value) })}
              className="w-full cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between items-center text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5 font-mono">
              <span>1 {t.form.monthsUnit}</span>
              <span>
                120 {t.form.monthsUnit} (10 {t.form.yearsUnit})
              </span>
              <span>
                360 {t.form.monthsUnit} (30 {t.form.yearsUnit})
              </span>
            </div>
          </div>

          {/* Quick Term Buttons */}
          <div className="flex flex-wrap items-center gap-1 mt-1.5 text-[11px] text-slate-500">
            <span className="font-medium text-slate-400 dark:text-slate-500 text-[10px]">
              {t.form.quick}
            </span>
            {[
              { label: `12 ${t.form.monthsUnit}`, val: 12 },
              { label: `24 ${t.form.monthsUnit}`, val: 24 },
              { label: `36 ${t.form.monthsUnit}`, val: 36 },
              { label: `5 ${t.form.yearsUnit}`, val: 60 },
              { label: `10 ${t.form.yearsUnit}`, val: 120 },
              { label: `20 ${t.form.yearsUnit}`, val: 240 },
              { label: `30 ${t.form.yearsUnit}`, val: 360 },
            ].map((termItem) => (
              <button
                key={termItem.val}
                type="button"
                onClick={() => handleSetTerm(termItem.val)}
                className={`px-1.5 py-0.5 rounded font-medium transition-colors text-[10px] cursor-pointer ${
                  params.termMonths === termItem.val
                    ? "bg-blue-600 text-white font-bold"
                    : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                }`}
              >
                {termItem.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Поле и ползунок: Процентная ставка */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label
              htmlFor="loan-rate-input"
              className="font-heading text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              {t.form.interestRate}
            </label>
            <button
              type="button"
              onClick={onScrollToRates}
              className="text-[11px] text-blue-600 dark:text-blue-400 hover:text-blue-700 font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Info className="w-3 h-3" />
              <span>{t.form.worldRates}</span>
            </button>
          </div>

          <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 focus-within:border-blue-600 dark:focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 bg-white dark:bg-slate-950 transition-all overflow-hidden shadow-2xs">
            <input
              id="loan-rate-input"
              type="number"
              step="0.1"
              min={0.1}
              max={100}
              value={params.interestRate || ""}
              onChange={(e) => onChange({ interestRate: Math.max(0, Number(e.target.value)) })}
              className="w-full px-3 py-2 font-heading text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 outline-none bg-transparent"
            />
            <span className="bg-slate-50 dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 px-3 py-1.5 flex items-center font-heading text-xs font-bold text-slate-600 dark:text-slate-300">
              %
            </span>
          </div>

          {/* Ползунок для процентной ставки */}
          <div className="mt-2 px-0.5">
            <input
              type="range"
              min={0.5}
              max={45}
              step={0.1}
              value={Math.min(45, Math.max(0.5, params.interestRate))}
              onChange={(e) => onChange({ interestRate: Number(e.target.value) })}
              className="w-full cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between items-center text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5 font-mono">
              <span>0.5%</span>
              <span>15%</span>
              <span>45%</span>
            </div>
          </div>

          {/* Quick Rate Buttons */}
          <div className="flex flex-wrap items-center gap-1 mt-1.5 text-[11px] text-slate-500">
            <span className="font-medium text-slate-400 dark:text-slate-500 text-[10px]">
              {t.form.quick}
            </span>
            {[3.5, 5.5, 6.8, 8.5, 12, 17.5, 19, 22].map((rate) => (
              <button
                key={rate}
                type="button"
                onClick={() => handleSetRate(rate)}
                className={`px-1.5 py-0.5 rounded font-medium transition-colors text-[10px] cursor-pointer ${
                  params.interestRate === rate
                    ? "bg-blue-600 text-white font-bold"
                    : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                }`}
              >
                {rate}%
              </button>
            ))}
          </div>
        </div>

        {/* Checkbox: Округлять до целых */}
        <div className="pt-0.5">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={params.roundToInteger}
              onChange={(e) => onChange({ roundToInteger: e.target.checked })}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-700 dark:bg-slate-900 transition-colors"
            />
            <span className="font-body text-xs font-medium text-slate-700 dark:text-slate-300">
              {t.form.roundToInteger}
            </span>
          </label>
        </div>
      </div>

      {/* 3. Дополнительно (необязательно) */}
      <div className="mb-5 border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/40 dark:bg-slate-800/40">
        <button
          id="btn-toggle-extra"
          type="button"
          onClick={() => setShowAdditional(!showAdditional)}
          className="w-full px-3 py-2 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-700 text-white font-heading text-[10px] font-bold flex items-center justify-center shrink-0">
              3
            </span>
            <span className="font-heading text-xs font-bold text-slate-800 dark:text-slate-200">
              {t.form.step3Title}
            </span>
          </div>
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
              showAdditional ? "rotate-180 text-blue-600 dark:text-blue-400" : ""
            }`}
          />
        </button>

        {showAdditional && (
          <div className="p-3 pt-1 space-y-2.5 border-t border-slate-200/70 dark:border-slate-700/70">
            {/* Первоначальный взнос */}
            <div>
              <label
                htmlFor="input-downpayment"
                className="font-heading text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-0.5"
              >
                {t.form.downPayment}
              </label>
              <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 overflow-hidden focus-within:border-blue-500">
                <input
                  id="input-downpayment"
                  type="text"
                  inputMode="numeric"
                  value={formatCurrencyNumber(params.downPayment)}
                  onChange={(e) => handleDownPaymentChange(e.target.value)}
                  className="w-full px-2.5 py-1 text-xs font-semibold text-slate-900 dark:text-slate-100 outline-none bg-transparent"
                  placeholder="0"
                />
                <span className="px-2.5 flex items-center bg-slate-50 dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  {params.currency}
                </span>
              </div>
            </div>

            {/* Назначение */}
            <div>
              <label
                htmlFor="input-purpose"
                className="font-heading text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-0.5"
              >
                {t.form.loanPurpose}
              </label>
              <input
                id="input-purpose"
                type="text"
                placeholder={t.form.loanPurposePlaceholder}
                value={params.purpose || ""}
                onChange={(e) => onChange({ purpose: e.target.value })}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-2.5 py-1 text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-blue-500"
              />
            </div>

            {/* Примечание */}
            <div>
              <label
                htmlFor="input-notes"
                className="font-heading text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-0.5"
              >
                {t.form.loanNotes}
              </label>
              <input
                id="input-notes"
                type="text"
                placeholder={t.form.loanNotesPlaceholder}
                value={params.notes || ""}
                onChange={(e) => onChange({ notes: e.target.value })}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-2.5 py-1 text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-blue-500"
              />
            </div>

            {/* Страховка и комиссии */}
            <div className="grid grid-cols-2 gap-2 pt-0.5">
              <div>
                <label
                  htmlFor="input-fees"
                  className="font-heading text-[10px] font-semibold text-slate-600 dark:text-slate-400 block mb-0.5"
                >
                  {t.form.oneTimeFees}
                </label>
                <input
                  id="input-fees"
                  type="text"
                  value={formatCurrencyNumber(params.oneTimeFees)}
                  onChange={(e) => {
                    const c = e.target.value.replace(/\D/g, "");
                    onChange({ oneTimeFees: c ? parseInt(c, 10) : 0 });
                  }}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-2 py-1 text-xs text-slate-800 dark:text-slate-100 outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="input-insurance"
                  className="font-heading text-[10px] font-semibold text-slate-600 dark:text-slate-400 block mb-0.5"
                >
                  {t.form.annualInsurance}
                </label>
                <input
                  id="input-insurance"
                  type="text"
                  value={formatCurrencyNumber(params.annualInsurance)}
                  onChange={(e) => {
                    const c = e.target.value.replace(/\D/g, "");
                    onChange({ annualInsurance: c ? parseInt(c, 10) : 0 });
                  }}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-2 py-1 text-xs text-slate-800 dark:text-slate-100 outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons: Рассчитать + Сбросить */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
        <button
          id="btn-calculate-main"
          type="button"
          onClick={onCalculate}
          className="sm:col-span-8 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-heading font-bold text-xs sm:text-sm rounded-xl shadow-2xs flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Calculator className="w-4 h-4" />
          <span>{t.form.calculate}</span>
        </button>

        <button
          id="btn-reset-main"
          type="button"
          onClick={onReset}
          className="sm:col-span-4 py-2.5 px-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-heading font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          <span>{t.form.reset}</span>
        </button>
      </div>
    </div>
  );
};
