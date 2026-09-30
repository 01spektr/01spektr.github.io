import React from 'react';
import { Calendar } from 'lucide-react';
import {
  getISOWeek,
  getDayOfYear,
  isLeapYear,
  isWeekendDay,
} from '../utils/calendarCalculations';
import { CountryCode, WorkWeekType } from '../types/calendar';
import { useTranslation } from '../i18n/LanguageContext';

interface TodayWidgetProps {
  todayDate: Date;
  country: CountryCode;
  workWeekType: WorkWeekType;
  onSelectDate: (d: Date) => void;
}

export const TodayWidget: React.FC<TodayWidgetProps> = ({
  todayDate,
  workWeekType,
}) => {
  const { t, weekdaysFull, formatLocalizedDate } = useTranslation();
  const dayName = weekdaysFull[(todayDate.getDay() + 6) % 7];
  const formattedToday = formatLocalizedDate(todayDate);
  const isoWeek = getISOWeek(todayDate);
  const dayOfYear = getDayOfYear(todayDate);
  const totalDaysInYear = isLeapYear(todayDate.getFullYear()) ? 366 : 365;

  const lastDayOfMonth = new Date(
    todayDate.getFullYear(),
    todayDate.getMonth() + 1,
    0
  ).getDate();
  const daysTillEndOfMonth = lastDayOfMonth - todayDate.getDate();
  const daysTillEndOfYear = totalDaysInYear - dayOfYear;

  const currentMonth = todayDate.getMonth();
  const quarterEndMonth = Math.floor(currentMonth / 3) * 3 + 2;
  const quarterEndDate = new Date(todayDate.getFullYear(), quarterEndMonth + 1, 0);
  const diffTime = quarterEndDate.getTime() - todayDate.getTime();
  const daysTillNextQuarter = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const isWeekend = isWeekendDay(todayDate, workWeekType);

  return (
    <div className="bg-[#EFF6FF] dark:bg-[#151D2E] border border-[#BFDBFE] dark:border-[#232E42] rounded-2xl p-3 sm:p-3.5 shadow-xs shrink-0 flex flex-col justify-between transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#DBEAFE] dark:border-[#232E42]">
        <div className="flex items-center gap-2 text-[#0F172A] dark:text-white font-primary font-bold text-[13.5px]">
          <div className="w-6 h-6 rounded-lg bg-[#DBEAFE] dark:bg-[#1E3A8A]/50 text-[#0066FF] dark:text-[#38BDF8] flex items-center justify-center">
            <Calendar className="w-3.5 h-3.5 stroke-[2.2]" />
          </div>
          <span>{t('today_widget_title')}</span>
        </div>
        <span className="font-primary text-[11px] font-bold text-[#334155] dark:text-[#E2E8F0] bg-white/80 dark:bg-[#1E293B] border border-[#BFDBFE]/60 dark:border-[#334155] px-2 py-0.5 rounded-md">
          {formattedToday}
        </span>
      </div>

      {/* Main Content: Left details + Right countdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 my-auto">
        {/* Left column */}
        <div>
          <h3 className="font-primary text-[14px] sm:text-[14.5px] font-bold text-[#0F172A] dark:text-white leading-tight">
            {formattedToday}
          </h3>
          <p className="font-secondary text-[11px] mt-0.5 font-medium">
            <span className="text-[#475569] dark:text-[#94A3B8]">{dayName}</span>
            <span className="text-[#94A3B8] dark:text-[#64748B] mx-1">•</span>
            <span className={isWeekend ? 'text-[#EF4444] dark:text-rose-400 font-semibold' : 'text-[#16A34A] dark:text-emerald-400 font-semibold'}>
              {isWeekend ? t('day_off') : t('working_day')}
            </span>
          </p>
          <div className="mt-1.5 font-secondary text-[9.5px] text-[#64748B] dark:text-[#94A3B8]">
            <p>{todayDate.getFullYear()}, {isoWeek} (ISO)</p>
            <p>{dayOfYear} / {totalDaysInYear}</p>
          </div>
        </div>

        {/* Right column: metrics separated by border */}
        <div className="sm:border-l sm:border-[#DBEAFE] dark:sm:border-[#232E42] sm:pl-2.5 flex flex-col justify-between space-y-1">
          <div>
            <span className="font-secondary text-[8.5px] text-[#64748B] dark:text-[#94A3B8] uppercase font-semibold block leading-tight">
              {t('left_in_month')}
            </span>
            <span className="font-primary text-[12px] sm:text-[12.5px] font-bold text-[#0F172A] dark:text-white tabular-nums block leading-tight">
              {daysTillEndOfMonth} {t('days_count')}
            </span>
          </div>

          <div>
            <span className="font-secondary text-[8.5px] text-[#64748B] dark:text-[#94A3B8] uppercase font-semibold block leading-tight">
              {t('left_in_year')}
            </span>
            <span className="font-primary text-[12px] sm:text-[12.5px] font-bold text-[#0F172A] dark:text-white tabular-nums block leading-tight">
              {daysTillEndOfYear} {t('days_count')}
            </span>
          </div>

          <div>
            <span className="font-secondary text-[8.5px] text-[#64748B] dark:text-[#94A3B8] uppercase font-semibold block leading-tight">
              Q{Math.floor(currentMonth / 3) + 1}
            </span>
            <span className="font-primary text-[12px] sm:text-[12.5px] font-bold text-[#0066FF] dark:text-[#38BDF8] tabular-nums block leading-tight">
              {daysTillNextQuarter} {t('days_count')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
