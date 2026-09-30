import React, { useState } from 'react';
import { Calendar, CheckSquare } from 'lucide-react';
import { CountryCode, WorkWeekType } from '../types/calendar';
import { calculateWorkDaysBetween } from '../utils/calendarCalculations';
import { DatePickerInput } from './DatePickerInput';
import { useTranslation } from '../i18n/LanguageContext';

interface WorkDaysCalculatorProps {
  country: CountryCode;
  workWeekType: WorkWeekType;
  onSaveToHistory?: (item: any) => void;
  onOpenPdfModal?: () => void;
}

export const WorkDaysCalculator: React.FC<WorkDaysCalculatorProps> = ({
  country,
  workWeekType,
  onSaveToHistory,
}) => {
  const { t } = useTranslation();
  const [startDateStr, setStartDateStr] = useState('01.09.2026');
  const [endDateStr, setEndDateStr] = useState('30.09.2026');
  const [result, setResult] = useState(() =>
    calculateWorkDaysBetween('01.09.2026', '30.09.2026', country, workWeekType)
  );

  const handleCalculate = () => {
    const res = calculateWorkDaysBetween(startDateStr, endDateStr, country, workWeekType);
    setResult(res);

    if (onSaveToHistory) {
      onSaveToHistory({
        id: `wd-${Date.now()}`,
        type: 'work_days',
        title: `${t('tab_work_days')} (${startDateStr} — ${endDateStr})`,
        summary: `${res.workDays} ${t('work_days_count')} / ${res.calendarDays} ${t('days_count')}`,
        timestamp: Date.now(),
        data: res,
      });
    }
  };

  return (
    <div className="bg-white dark:bg-[#151D2E] border border-[#E2E8F0] dark:border-[#232E42] rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between transition-colors">
      {/* Header */}
      <div className="flex items-start gap-2.5 mb-3.5">
        <div className="w-8 h-8 rounded-lg bg-[#DCFCE7] dark:bg-emerald-950/40 text-[#16A34A] dark:text-emerald-400 flex items-center justify-center shrink-0">
          <Calendar className="w-4 h-4 stroke-[2.2]" />
        </div>
        <div>
          <h3 className="font-primary text-[14px] font-bold text-[#1E293B] dark:text-white leading-tight">
            {t('wd_title')}
          </h3>
          <p className="font-secondary text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">
            {t('wd_subtitle')}
          </p>
        </div>
      </div>

      {/* Internal 2-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 items-stretch flex-1">
        {/* Left column: Inputs + Button */}
        <div className="flex flex-col justify-between space-y-2">
          <div>
            <label className="block font-secondary text-[11px] font-medium text-[#64748B] dark:text-[#94A3B8] mb-1">
              {t('wd_start_date')}
            </label>
            <DatePickerInput
              value={startDateStr}
              onChange={setStartDateStr}
              placeholder="01.09.2026"
            />
          </div>

          <div>
            <label className="block font-secondary text-[11px] font-medium text-[#64748B] dark:text-[#94A3B8] mb-1">
              {t('wd_end_date')}
            </label>
            <DatePickerInput
              value={endDateStr}
              onChange={setEndDateStr}
              placeholder="30.09.2026"
            />
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
                <CheckSquare className="w-4 h-4 text-[#16A34A] dark:text-emerald-400" />
              </div>
              <div>
                <div className="font-primary text-[24px] font-bold text-[#14532D] dark:text-emerald-300 leading-none tabular-nums">
                  {result.workDays}
                </div>
                <span className="font-secondary text-[11px] font-medium text-[#16A34A] dark:text-emerald-400 mt-0.5 block">
                  {t('work_days_count')}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#DCFCE7] dark:border-emerald-900/40 space-y-1 text-[11px] font-secondary mt-2">
            <div className="flex items-center justify-between text-[#475569] dark:text-[#94A3B8]">
              <span>{t('wd_calendar_days')}</span>
              <span className="font-primary font-bold text-[#0F172A] dark:text-white tabular-nums">
                {result.calendarDays}
              </span>
            </div>
            <div className="flex items-center justify-between text-[#475569] dark:text-[#94A3B8]">
              <span>{t('wd_work_days')}</span>
              <span className="font-primary font-bold text-[#0F172A] dark:text-white tabular-nums">
                {result.workDays}
              </span>
            </div>
            <div className="flex items-center justify-between text-[#475569] dark:text-[#94A3B8]">
              <span>{t('legend_weekend')}</span>
              <span className="font-primary font-bold text-[#0F172A] dark:text-white tabular-nums">
                {result.weekendDays}
              </span>
            </div>
            <div className="flex items-center justify-between text-[#475569] dark:text-[#94A3B8]">
              <span>{t('legend_holiday')}</span>
              <span className="font-primary font-bold text-[#0F172A] dark:text-white tabular-nums">
                {result.holidayDays}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
