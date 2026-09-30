import React, { useState } from 'react';
import { Calendar, Sliders, ChevronDown } from 'lucide-react';
import { CountryCode, WorkWeekType } from '../types/calendar';
import { addOrSubtractDays } from '../utils/calendarCalculations';
import { DatePickerInput } from './DatePickerInput';
import { useTranslation } from '../i18n/LanguageContext';

interface AddDaysCalculatorProps {
  country: CountryCode;
  workWeekType: WorkWeekType;
  onSaveToHistory?: (item: any) => void;
}

export const AddDaysCalculator: React.FC<AddDaysCalculatorProps> = ({
  country,
  workWeekType,
  onSaveToHistory,
}) => {
  const { t, formatLocalizedDate, weekdaysFull } = useTranslation();
  const [startDateStr, setStartDateStr] = useState('26.09.2026');
  const [action, setAction] = useState<'add' | 'sub'>('add');
  const [count, setCount] = useState<number>(30);
  const [daysType, setDaysType] = useState<'work' | 'calendar'>('work');

  const [result, setResult] = useState(() =>
    addOrSubtractDays('26.09.2026', 30, true, true, country, workWeekType)
  );

  const handleCalculate = () => {
    const isAdd = action === 'add';
    const isWorkDaysOnly = daysType === 'work';
    const res = addOrSubtractDays(startDateStr, count, isAdd, isWorkDaysOnly, country, workWeekType);
    setResult(res);

    if (onSaveToHistory) {
      onSaveToHistory({
        id: `add-${Date.now()}`,
        type: 'add_days',
        title: `${action === 'add' ? t('ad_add') : t('ad_subtract')} ${count} ${
          daysType === 'work' ? t('wd_work_days') : t('wd_calendar_days')
        }`,
        summary: `Result: ${formatLocalizedDate(res.resultDate)}`,
        timestamp: Date.now(),
        data: res,
      });
    }
  };

  const localizedDateStr = formatLocalizedDate(result.resultDate);
  const dayOfWeekName = weekdaysFull[(result.resultDate.getDay() + 6) % 7];

  return (
    <div className="bg-white dark:bg-[#151D2E] border border-[#E2E8F0] dark:border-[#232E42] rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between transition-colors">
      {/* Header */}
      <div className="flex items-start gap-2.5 mb-3.5">
        <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] dark:bg-[#1E3A8A]/40 text-[#0066FF] dark:text-[#38BDF8] flex items-center justify-center shrink-0">
          <Sliders className="w-4 h-4 stroke-[2.2]" />
        </div>
        <div>
          <h3 className="font-primary text-[14px] font-bold text-[#1E293B] dark:text-white leading-tight">
            {t('ad_title')}
          </h3>
          <p className="font-secondary text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">
            {t('ad_subtitle')}
          </p>
        </div>
      </div>

      {/* Internal 2-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 items-stretch flex-1">
        {/* Left column: Inputs + Button */}
        <div className="flex flex-col justify-between space-y-2">
          <div>
            <label className="block font-secondary text-[11px] font-medium text-[#64748B] dark:text-[#94A3B8] mb-1">
              {t('ad_base_date')}
            </label>
            <DatePickerInput
              value={startDateStr}
              onChange={setStartDateStr}
              placeholder="26.09.2026"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-secondary text-[11px] font-medium text-[#64748B] dark:text-[#94A3B8] mb-1">
                {t('ad_operation')}
              </label>
              <div className="relative">
                <select
                  value={action}
                  onChange={(e) => setAction(e.target.value as 'add' | 'sub')}
                  className="w-full bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] focus:border-[#0066FF] dark:focus:border-[#38BDF8] rounded-lg px-2.5 py-1.5 h-[34px] font-primary text-[12px] text-[#1E293B] dark:text-white appearance-none focus:outline-none focus:ring-1 focus:ring-[#0066FF]/20 transition-all cursor-pointer pr-6"
                >
                  <option value="add" className="dark:bg-[#1E293B]">{t('ad_add')}</option>
                  <option value="sub" className="dark:bg-[#1E293B]">{t('ad_subtract')}</option>
                </select>
                <ChevronDown className="w-3 h-3 text-[#0066FF] dark:text-[#38BDF8] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block font-secondary text-[11px] font-medium text-[#64748B] dark:text-[#94A3B8] mb-1">
                {t('ad_days_amount')}
              </label>
              <input
                type="number"
                min="1"
                max="1000"
                value={count}
                onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] focus:border-[#0066FF] dark:focus:border-[#38BDF8] rounded-lg px-2.5 py-1.5 h-[34px] font-primary text-[12px] text-[#1E293B] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#0066FF]/20 transition-all tabular-nums"
              />
            </div>
          </div>

          {/* Row 3: Day Type Dropdown */}
          <div className="grid grid-cols-2 gap-2 items-center">
            <div className="font-secondary text-[11px] text-[#1E293B] dark:text-[#CBD5E1] font-medium px-0.5">
              {daysType === 'work' ? t('ad_work_type') : t('ad_calendar_type')}
            </div>
            <div className="relative">
              <select
                value={daysType}
                onChange={(e) => setDaysType(e.target.value as 'work' | 'calendar')}
                className="w-full bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] focus:border-[#0066FF] dark:focus:border-[#38BDF8] rounded-lg px-2.5 py-1.5 h-[34px] font-primary text-[12px] text-[#1E293B] dark:text-white appearance-none focus:outline-none focus:ring-1 focus:ring-[#0066FF]/20 transition-all cursor-pointer pr-6"
              >
                <option value="work" className="dark:bg-[#1E293B]">{t('ad_work_type')}</option>
                <option value="calendar" className="dark:bg-[#1E293B]">{t('ad_calendar_type')}</option>
              </select>
              <ChevronDown className="w-3 h-3 text-[#0066FF] dark:text-[#38BDF8] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <button
            onClick={handleCalculate}
            className="w-full mt-2 h-[34px] bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-lg font-primary text-[12px] font-bold shadow-xs transition-colors cursor-pointer"
          >
            {t('btn_calculate')}
          </button>
        </div>

        {/* Right column: Light-green result box */}
        <div className="bg-[#F0FDF4] dark:bg-emerald-950/20 border border-[#DCFCE7] dark:border-emerald-900/40 rounded-xl p-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-[#15803D] dark:text-emerald-400 font-primary text-[11px] font-bold">
              <Calendar className="w-3.5 h-3.5 text-[#16A34A] dark:text-emerald-400" />
              <span>{t('calc_result_title')}</span>
            </div>

            <div className="mt-2 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg border border-[#86EFAC] dark:border-emerald-700/50 text-[#16A34A] dark:text-emerald-400 flex items-center justify-center shrink-0 bg-white/70 dark:bg-[#151D2E]">
                <Calendar className="w-4 h-4 text-[#16A34A] dark:text-emerald-400" />
              </div>
              <div>
                <div className="font-primary text-[16px] font-bold text-[#14532D] dark:text-emerald-300 leading-tight">
                  {localizedDateStr}
                </div>
                <span className="font-secondary text-[11px] font-medium text-[#16A34A] dark:text-emerald-400 mt-0.5 block">
                  {dayOfWeekName}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#DCFCE7] dark:border-emerald-900/40 space-y-1 text-[11px] font-secondary mt-2">
            <div className="flex items-center justify-between text-[#475569] dark:text-[#94A3B8]">
              <span>{t('legend_weekend')}</span>
              <span className="font-primary font-bold text-[#0F172A] dark:text-white tabular-nums">
                {result.skippedWeekends}
              </span>
            </div>
            <div className="flex items-center justify-between text-[#475569] dark:text-[#94A3B8]">
              <span>{t('legend_holiday')}</span>
              <span className="font-primary font-bold text-[#0F172A] dark:text-white tabular-nums">
                {result.skippedHolidays}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
