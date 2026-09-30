import React from 'react';
import { ChevronRight, ArrowRight, Calendar } from 'lucide-react';
import { CountryCode } from '../types/calendar';
import { getHolidaysForYear } from '../data/holidays';
import { parseDate } from '../utils/calendarCalculations';
import { useTranslation } from '../i18n/LanguageContext';

interface UpcomingHolidaysWidgetProps {
  country: CountryCode;
  year: number;
  currentDate: Date;
  onViewAllHolidays: () => void;
  onSelectHolidayDate: (date: Date) => void;
}

export const UpcomingHolidaysWidget: React.FC<UpcomingHolidaysWidgetProps> = ({
  country,
  year,
  currentDate,
  onViewAllHolidays,
  onSelectHolidayDate,
}) => {
  const { t, monthNames, weekdaysFull, getHolidayTitle } = useTranslation();

  const allHolidays = [
    ...getHolidaysForYear(country, year),
    ...getHolidaysForYear(country, year + 1),
  ];

  const todayStr = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;

  const upcoming = allHolidays
    .filter((h) => h.date >= todayStr)
    .slice(0, 5);

  const formatShortMonthBadge = (dateStr: string) => {
    const d = parseDate(dateStr);
    const day = d.getDate();
    const monthShort = monthNames[d.getMonth()].slice(0, 3).toLowerCase();
    return { day, monthShort };
  };

  return (
    <div className="bg-white dark:bg-[#151D2E] border border-[#E2E8F0] dark:border-[#232E42] rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between flex-1 min-h-0 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9] dark:border-[#232E42]">
        <div className="flex items-center gap-2 text-[#0F172A] dark:text-white font-primary font-bold text-[14px]">
          <div className="w-6 h-6 rounded-lg bg-[#FEF2F2] dark:bg-rose-950/40 text-[#EF4444] dark:text-rose-400 flex items-center justify-center">
            <Calendar className="w-3.5 h-3.5 stroke-[2.2]" />
          </div>
          <span>{t('upcoming_holidays_title')}</span>
        </div>
        <button
          onClick={onViewAllHolidays}
          className="font-primary text-[11px] sm:text-[11.5px] font-semibold text-[#0066FF] dark:text-[#38BDF8] hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 group cursor-pointer"
        >
          {t('all_holidays_link')}
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Holidays List */}
      <div className="flex flex-col divide-y divide-[#F1F5F9] dark:divide-[#232E42] flex-1 justify-around my-1.5">
        {upcoming.length === 0 ? (
          <div className="py-4 text-center text-[12px] font-secondary text-[#94A3B8] dark:text-[#64748B]">
            {t('no_upcoming_holidays')}
          </div>
        ) : (
          upcoming.map((item, index) => {
            const { day, monthShort } = formatShortMonthBadge(item.date);
            const d = parseDate(item.date);
            const dayOfWeek = weekdaysFull[(d.getDay() + 6) % 7];
            const localizedTitle = getHolidayTitle(item);

            const statusText =
              item.type === 'shortened'
                ? `${dayOfWeek} • ${t('shortened_day')}`
                : item.isDayOff
                ? `${dayOfWeek} • ${t('day_off')}`
                : `${dayOfWeek} • ${t('working_day')}`;

            return (
              <button
                key={`${item.date}-${index}`}
                onClick={() => onSelectHolidayDate(d)}
                className="py-2 flex items-center justify-between text-left hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B] -mx-1.5 px-1.5 rounded-lg transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {/* Date badge */}
                  <div className="w-7 h-7 rounded-lg bg-[#FEF2F2] dark:bg-rose-950/40 border border-[#FEE2E2] dark:border-rose-900/60 text-[#EF4444] dark:text-rose-400 flex flex-col items-center justify-center shrink-0">
                    <span className="font-primary text-[11px] font-bold leading-none">{day}</span>
                    <span className="font-secondary text-[8px] font-medium leading-none mt-0.5">
                      {monthShort}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <h4 className="font-primary text-[11.5px] sm:text-[12px] font-bold text-[#0F172A] dark:text-[#F1F5F9] truncate group-hover:text-[#0066FF] dark:group-hover:text-[#38BDF8] transition-colors leading-tight">
                      {localizedTitle}
                    </h4>
                    <p className="font-secondary text-[9.5px] text-[#64748B] dark:text-[#94A3B8] leading-tight mt-0.5">
                      {statusText}
                    </p>
                  </div>
                </div>

                <ChevronRight className="w-3 h-3 text-[#94A3B8] dark:text-[#64748B] group-hover:text-[#475569] dark:group-hover:text-[#CBD5E1] group-hover:translate-x-0.5 transition-all shrink-0 ml-1.5" />
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
