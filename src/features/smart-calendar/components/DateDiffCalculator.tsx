import React, { useState } from 'react';
import { GitCompare } from 'lucide-react';
import { CountryCode, WorkWeekType } from '../types/calendar';
import { calculateWorkDaysBetween } from '../utils/calendarCalculations';
import { DatePickerInput } from './DatePickerInput';
import { useTranslation } from '../i18n/LanguageContext';

interface DateDiffCalculatorProps {
  country: CountryCode;
  workWeekType: WorkWeekType;
  onSaveToHistory?: (item: any) => void;
}

export const DateDiffCalculator: React.FC<DateDiffCalculatorProps> = ({
  country,
  workWeekType,
  onSaveToHistory,
}) => {
  const { t } = useTranslation();
  const [date1Str, setDate1Str] = useState('26.09.2026');
  const [date2Str, setDate2Str] = useState('31.12.2026');

  const [result, setResult] = useState(() => {
    return calculateWorkDaysBetween('26.09.2026', '31.12.2026', country, workWeekType);
  });

  const handleCalculate = () => {
    const res = calculateWorkDaysBetween(date1Str, date2Str, country, workWeekType);
    setResult(res);

    if (onSaveToHistory) {
      onSaveToHistory({
        id: `diff-${Date.now()}`,
        type: 'diff',
        title: `${t('tab_date_diff')} (${date1Str} — ${date2Str})`,
        summary: `${res.calendarDays} ${t('days_count')} (${res.workDays} ${t('work_days_count')})`,
        timestamp: Date.now(),
        data: res,
      });
    }
  };

  const weeks = Math.floor(result.calendarDays / 7);
  const remainingDays = result.calendarDays % 7;

  return (
    <div className="bg-white dark:bg-[#151D2E] border border-[#E2E8F0] dark:border-[#232E42] rounded-xl p-4 sm:p-5 shadow-xs space-y-4 transition-colors">
      <div className="flex items-center gap-2.5 pb-3 border-b border-[#F1F5F9] dark:border-[#232E42]">
        <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] dark:bg-blue-950/60 text-[#0066FF] dark:text-blue-400 flex items-center justify-center">
          <GitCompare className="w-4 h-4 stroke-[2.2]" />
        </div>
        <div>
          <h2 className="font-primary text-[15px] sm:text-[16px] font-bold text-[#0F172A] dark:text-slate-100">
            {t('dd_title')}
          </h2>
          <p className="font-secondary text-[11px] text-[#64748B] dark:text-slate-400 mt-0.5">
            {t('dd_subtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block font-primary text-[10.5px] font-medium text-[#475569] dark:text-slate-300 mb-1">
            {t('dd_first_date')}
          </label>
          <DatePickerInput
            value={date1Str}
            onChange={setDate1Str}
            placeholder="26.09.2026"
          />
        </div>

        <div>
          <label className="block font-primary text-[10.5px] font-medium text-[#475569] dark:text-slate-300 mb-1">
            {t('dd_second_date')}
          </label>
          <DatePickerInput
            value={date2Str}
            onChange={setDate2Str}
            placeholder="31.12.2026"
          />
        </div>
      </div>

      <button
        onClick={handleCalculate}
        className="w-full sm:w-auto px-4 py-1.5 bg-[#0066FF] hover:bg-blue-700 text-white rounded-lg font-primary text-[11.5px] font-bold shadow-xs transition-colors cursor-pointer"
      >
        {t('btn_calculate')}
      </button>

      {/* Results grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
        <div className="p-3 rounded-lg bg-[#F8FAFC] dark:bg-[#1E293B]/70 border border-[#E2E8F0] dark:border-[#232E42]">
          <span className="font-secondary text-[10px] text-[#64748B] dark:text-slate-400 block">
            {t('wd_calendar_days')}
          </span>
          <span className="font-primary text-[20px] font-bold text-[#0F172A] dark:text-slate-100 tabular-nums mt-0.5 block">
            {result.calendarDays}
          </span>
          <span className="font-secondary text-[10px] text-[#94A3B8] dark:text-slate-500 mt-0.5 block">
            {weeks} {t('wq_week_prefix').toLowerCase()}. {remainingDays > 0 ? `+ ${remainingDays} ${t('days_count')}` : ''}
          </span>
        </div>

        <div className="p-3 rounded-lg bg-[#F0FDF4] dark:bg-emerald-950/40 border border-[#A7F3D0]/70 dark:border-emerald-800/50">
          <span className="font-secondary text-[10px] text-[#065F46] dark:text-emerald-400 font-medium block">
            {t('wd_work_days')}
          </span>
          <span className="font-primary text-[20px] font-bold text-[#065F46] dark:text-emerald-300 tabular-nums mt-0.5 block">
            {result.workDays}
          </span>
          <span className="font-secondary text-[10px] text-[#059669] dark:text-emerald-400 mt-0.5 block">
            {result.totalHours40} {t('hours_count')}
          </span>
        </div>

        <div className="p-3 rounded-lg bg-[#F8FAFC] dark:bg-[#1E293B]/70 border border-[#E2E8F0] dark:border-[#232E42]">
          <span className="font-secondary text-[10px] text-[#64748B] dark:text-slate-400 block">
            {t('legend_weekend')}
          </span>
          <span className="font-primary text-[20px] font-bold text-[#0F172A] dark:text-slate-100 tabular-nums mt-0.5 block">
            {result.weekendDays}
          </span>
          <span className="font-secondary text-[10px] text-[#94A3B8] dark:text-slate-500 mt-0.5 block">
            {result.weekendDays} {t('days_count')}
          </span>
        </div>

        <div className="p-3 rounded-lg bg-[#FEF2F2] dark:bg-rose-950/40 border border-[#FEE2E2] dark:border-rose-900/50">
          <span className="font-secondary text-[10px] text-[#991B1B] dark:text-rose-400 font-medium block">
            {t('tab_holidays')}
          </span>
          <span className="font-primary text-[20px] font-bold text-[#DC2626] dark:text-rose-400 tabular-nums mt-0.5 block">
            {result.holidayDays}
          </span>
          <span className="font-secondary text-[10px] text-[#DC2626] dark:text-rose-400 mt-0.5 block">
            {result.holidayDays} {t('days_count')}
          </span>
        </div>
      </div>
    </div>
  );
};
