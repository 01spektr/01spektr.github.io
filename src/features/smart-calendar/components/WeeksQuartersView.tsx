import React from 'react';
import { Layers } from 'lucide-react';
import { CountryCode, WorkWeekType } from '../types/calendar';
import { getYearLaborNorms, formatDateShort } from '../utils/calendarCalculations';
import { useTranslation } from '../i18n/LanguageContext';

interface WeeksQuartersViewProps {
  year: number;
  country: CountryCode;
  workWeekType: WorkWeekType;
  onSelectDate: (d: Date) => void;
}

export const WeeksQuartersView: React.FC<WeeksQuartersViewProps> = ({
  year,
  country,
  workWeekType,
  onSelectDate,
}) => {
  const { t, monthNames } = useTranslation();
  const yearNorms = getYearLaborNorms(year, country, workWeekType);

  const isoWeeksList = [];
  const startOfYear = new Date(year, 0, 1);
  const dayOfWeek = (startOfYear.getDay() + 6) % 7;
  const firstMonday = new Date(startOfYear);
  firstMonday.setDate(firstMonday.getDate() - dayOfWeek);

  const currentMonday = new Date(firstMonday);
  for (let w = 1; w <= 52; w++) {
    const monday = new Date(currentMonday);
    const sunday = new Date(currentMonday);
    sunday.setDate(sunday.getDate() + 6);

    const isCurrentWeek = w === 39; // 39th week in Sept 2026

    isoWeeksList.push({
      weekNum: w,
      monday,
      sunday,
      isCurrentWeek,
    });

    currentMonday.setDate(currentMonday.getDate() + 7);
  }

  const quarterTitles = [
    `I ${t('wq_quarter_prefix')} (${monthNames[0].slice(0, 3)} — ${monthNames[2].slice(0, 3)})`,
    `II ${t('wq_quarter_prefix')} (${monthNames[3].slice(0, 3)} — ${monthNames[5].slice(0, 3)})`,
    `III ${t('wq_quarter_prefix')} (${monthNames[6].slice(0, 3)} — ${monthNames[8].slice(0, 3)})`,
    `IV ${t('wq_quarter_prefix')} (${monthNames[9].slice(0, 3)} — ${monthNames[11].slice(0, 3)})`,
  ];

  return (
    <div className="bg-white dark:bg-[#151D2E] border border-[#E2E8F0] dark:border-[#232E42] rounded-xl p-4 sm:p-5 shadow-xs space-y-4 transition-colors">
      <div className="flex items-center gap-2.5 pb-3 border-b border-[#F1F5F9] dark:border-[#232E42]">
        <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] dark:bg-[#1E3A8A]/40 text-[#0066FF] dark:text-[#38BDF8] flex items-center justify-center">
          <Layers className="w-4 h-4 stroke-[2.2]" />
        </div>
        <div>
          <h2 className="font-primary text-[15px] sm:text-[16px] font-bold text-[#0F172A] dark:text-white">
            {t('wq_title')} ({year})
          </h2>
          <p className="font-secondary text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">
            {t('wq_subtitle')}
          </p>
        </div>
      </div>

      {/* 4 Quarters Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {yearNorms.quarters.map((q, idx) => {
          const isCurrentQuarter = idx === 2; // Q3 (July-Sept)
          return (
            <div
              key={q.quarter}
              className={`p-3 rounded-xl border transition-all ${
                isCurrentQuarter
                  ? 'border-[#0066FF] dark:border-[#38BDF8] bg-[#EFF6FF]/40 dark:bg-[#1E3A8A]/30 ring-1 ring-[#0066FF]/20'
                  : 'border-[#E2E8F0] dark:border-[#232E42] bg-white dark:bg-[#1E293B] hover:border-[#CBD5E1] dark:hover:border-[#334155]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-primary text-[12px] font-bold text-[#0F172A] dark:text-white">
                  {quarterTitles[idx]}
                </span>
                {isCurrentQuarter && (
                  <span className="font-primary text-[9px] font-bold px-1.5 py-0.2 bg-[#0066FF] text-white rounded">
                    Active
                  </span>
                )}
              </div>

              <div className="space-y-1 font-secondary text-[10.5px]">
                <div className="flex justify-between text-[#475569] dark:text-[#94A3B8]">
                  <span>{t('wd_calendar_days')}:</span>
                  <span className="font-primary font-bold text-[#0F172A] dark:text-white tabular-nums">
                    {q.calendarDays}
                  </span>
                </div>
                <div className="flex justify-between text-[#475569] dark:text-[#94A3B8]">
                  <span>{t('wd_work_days')}:</span>
                  <span className="font-primary font-bold text-[#065F46] dark:text-emerald-400 tabular-nums">
                    {q.workDays}
                  </span>
                </div>
                <div className="flex justify-between text-[#475569] dark:text-[#94A3B8]">
                  <span>{t('legend_weekend')}:</span>
                  <span className="font-primary font-bold text-[#64748B] dark:text-[#94A3B8] tabular-nums">
                    {q.weekendDays}
                  </span>
                </div>
                <div className="flex justify-between text-[#475569] dark:text-[#94A3B8] pt-1 border-t border-[#F1F5F9] dark:border-[#334155]">
                  <span>{t('wh_col_h40')}:</span>
                  <span className="font-primary font-bold text-[#0066FF] dark:text-[#38BDF8] tabular-nums">
                    {q.hours40} {t('hours_short')}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ISO Weeks Interactive Grid */}
      <div className="pt-2">
        <h3 className="font-primary text-[13px] font-bold text-[#0F172A] dark:text-white mb-2">
          {t('toggle_iso_weeks')} (1 — 52)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1.5">
          {isoWeeksList.map((w) => {
            return (
              <div
                key={w.weekNum}
                onClick={() => onSelectDate(w.monday)}
                className={`p-2 rounded-lg border text-left cursor-pointer transition-all ${
                  w.isCurrentWeek
                    ? 'bg-[#0066FF] text-white border-[#0066FF] shadow-xs'
                    : 'bg-[#F8FAFC] dark:bg-[#1E293B] border-[#E2E8F0] dark:border-[#334155] hover:bg-white dark:hover:bg-[#28354D] hover:border-[#CBD5E1] dark:hover:border-[#475569]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-primary text-[11px] font-bold ${
                      w.isCurrentWeek ? 'text-white' : 'text-[#0F172A] dark:text-white'
                    }`}
                  >
                    {t('wq_week_prefix')} {w.weekNum}
                  </span>
                  {w.isCurrentWeek && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  )}
                </div>
                <div
                  className={`font-secondary text-[9px] mt-0.5 ${
                    w.isCurrentWeek ? 'text-blue-100' : 'text-[#64748B] dark:text-[#94A3B8]'
                  }`}
                >
                  {formatDateShort(w.monday)} — {formatDateShort(w.sunday)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
