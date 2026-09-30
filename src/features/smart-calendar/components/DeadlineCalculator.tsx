import React, { useState } from 'react';
import { Clock, Calendar, ChevronDown } from 'lucide-react';
import { CountryCode, WorkWeekType } from '../types/calendar';
import { calculateDeadline } from '../utils/calendarCalculations';
import { DatePickerInput } from './DatePickerInput';
import { useTranslation } from '../i18n/LanguageContext';

interface DeadlineCalculatorProps {
  country: CountryCode;
  workWeekType: WorkWeekType;
  onSaveToHistory?: (item: any) => void;
}

export const DeadlineCalculator: React.FC<DeadlineCalculatorProps> = ({
  country,
  workWeekType,
  onSaveToHistory,
}) => {
  const { t, formatLocalizedDate, weekdaysFull } = useTranslation();
  const [startDateStr, setStartDateStr] = useState('26.09.2026');
  const [duration, setDuration] = useState<number>(20);
  const [durationType, setDurationType] = useState<'work_days' | 'calendar_days'>('work_days');
  const [buffer, setBuffer] = useState<number>(2);
  const [bufferType, setBufferType] = useState<'work_days' | 'calendar_days'>('work_days');

  const [result, setResult] = useState(() =>
    calculateDeadline(
      '26.09.2026',
      20,
      'work_days',
      2,
      'work_days',
      country,
      workWeekType
    )
  );

  const handleCalculate = () => {
    const res = calculateDeadline(
      startDateStr,
      duration,
      durationType,
      buffer,
      bufferType,
      country,
      workWeekType
    );
    setResult(res);

    if (onSaveToHistory) {
      onSaveToHistory({
        id: `dl-${Date.now()}`,
        type: 'deadline',
        title: `${t('tab_deadline')} (${duration} + ${buffer})`,
        summary: `Deadline: ${formatLocalizedDate(res.finalDate)}`,
        timestamp: Date.now(),
        data: res,
      });
    }
  };

  const localizedDateStr = formatLocalizedDate(result.finalDate);
  const dayOfWeekName = weekdaysFull[(result.finalDate.getDay() + 6) % 7];

  return (
    <div className="bg-white dark:bg-[#151D2E] border border-[#E2E8F0] dark:border-[#232E42] rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between transition-colors">
      {/* Header */}
      <div className="flex items-start gap-2.5 mb-3.5">
        <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] dark:bg-amber-950/40 text-[#D97706] dark:text-amber-400 flex items-center justify-center shrink-0">
          <Clock className="w-4 h-4 stroke-[2.2]" />
        </div>
        <div>
          <h3 className="font-primary text-[14px] font-bold text-[#1E293B] dark:text-white leading-tight">
            {t('dl_title')}
          </h3>
          <p className="font-secondary text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">
            {t('dl_subtitle')}
          </p>
        </div>
      </div>

      {/* Internal 2-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 items-stretch flex-1">
        {/* Left column: Inputs + Button */}
        <div className="flex flex-col justify-between space-y-2">
          <div>
            <label className="block font-secondary text-[11px] font-medium text-[#64748B] dark:text-[#94A3B8] mb-1">
              {t('dl_start_date')}
            </label>
            <DatePickerInput
              value={startDateStr}
              onChange={setStartDateStr}
              placeholder="26.09.2026"
            />
          </div>

          <div>
            <label className="block font-secondary text-[11px] font-medium text-[#64748B] dark:text-[#94A3B8] mb-1">
              {t('dl_duration_days')}
            </label>
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
              <input
                type="number"
                min="1"
                max="500"
                value={duration}
                onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value) || 1))}
                className="col-span-2 min-w-0 bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] focus:border-[#0066FF] dark:focus:border-[#38BDF8] rounded-lg px-2 sm:px-2.5 py-1.5 h-[34px] font-primary text-[12px] text-[#1E293B] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#0066FF]/20 transition-all tabular-nums"
              />
              <div className="col-span-3 min-w-0 relative">
                <select
                  value={durationType}
                  onChange={(e) => setDurationType(e.target.value as any)}
                  className="w-full bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] focus:border-[#0066FF] dark:focus:border-[#38BDF8] rounded-lg pl-2 pr-6 py-1.5 h-[34px] font-primary text-[11px] sm:text-[11.5px] text-[#1E293B] dark:text-white appearance-none focus:outline-none focus:ring-1 focus:ring-[#0066FF]/20 transition-all cursor-pointer truncate"
                >
                  <option value="work_days" className="dark:bg-[#1E293B]">{t('wd_work_days')}</option>
                  <option value="calendar_days" className="dark:bg-[#1E293B]">{t('wd_calendar_days')}</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#0066FF] dark:text-[#38BDF8] absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-secondary text-[11px] font-medium text-[#64748B] dark:text-[#94A3B8] mb-1">
              {t('dl_buffer_days')}
            </label>
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
              <input
                type="number"
                min="0"
                max="100"
                value={buffer}
                onChange={(e) => setBuffer(Math.max(0, parseInt(e.target.value) || 0))}
                className="col-span-2 min-w-0 bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] focus:border-[#0066FF] dark:focus:border-[#38BDF8] rounded-lg px-2 sm:px-2.5 py-1.5 h-[34px] font-primary text-[12px] text-[#1E293B] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#0066FF]/20 transition-all tabular-nums"
              />
              <div className="col-span-3 min-w-0 relative">
                <select
                  value={bufferType}
                  onChange={(e) => setBufferType(e.target.value as any)}
                  className="w-full bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] focus:border-[#0066FF] dark:focus:border-[#38BDF8] rounded-lg pl-2 pr-6 py-1.5 h-[34px] font-primary text-[11px] sm:text-[11.5px] text-[#1E293B] dark:text-white appearance-none focus:outline-none focus:ring-1 focus:ring-[#0066FF]/20 transition-all cursor-pointer truncate"
                >
                  <option value="work_days" className="dark:bg-[#1E293B]">{t('wd_work_days')}</option>
                  <option value="calendar_days" className="dark:bg-[#1E293B]">{t('wd_calendar_days')}</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#0066FF] dark:text-[#38BDF8] absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
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
                <Calendar className="w-4 h-4 text-[#16A34A]" />
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
              <span>{t('wd_work_days')}</span>
              <span className="font-primary font-bold text-[#0F172A] dark:text-white tabular-nums">
                {result.durationCount}
              </span>
            </div>
            <div className="flex items-center justify-between text-[#475569] dark:text-[#94A3B8]">
              <span>{t('dl_buffer_days')}</span>
              <span className="font-primary font-bold text-[#0F172A] dark:text-white tabular-nums">
                {result.bufferCount}
              </span>
            </div>
            <div className="flex items-center justify-between text-[#475569] dark:text-[#94A3B8]">
              <span>{t('wd_calendar_days')}</span>
              <span className="font-primary font-bold text-[#0F172A] dark:text-white tabular-nums">
                {result.totalDays}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
