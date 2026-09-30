import React, { useState } from 'react';
import { Search, FileDown } from 'lucide-react';
import { CountryCode } from '../types/calendar';
import { getHolidaysForYear, COUNTRIES } from '../data/holidays';
import { parseDate } from '../utils/calendarCalculations';
import { useTranslation } from '../i18n/LanguageContext';

interface HolidaysCatalogProps {
  country: CountryCode;
  year: number;
  onSelectDate: (d: Date) => void;
  onOpenPdfModal: () => void;
}

export const HolidaysCatalog: React.FC<HolidaysCatalogProps> = ({
  country,
  year,
  onSelectDate,
  onOpenPdfModal,
}) => {
  const { t, getHolidayTitle, formatLocalizedDate, weekdaysFull } = useTranslation();
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const holidays = getHolidaysForYear(country, year);
  const countryObj = COUNTRIES.find((c) => c.code === country);

  const filteredHolidays = holidays.filter((h) => {
    if (filterType === 'dayoff' && !h.isDayOff) return false;
    if (filterType === 'shortened' && h.type !== 'shortened') return false;
    if (filterType === 'transferred' && h.type !== 'transferred') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const localized = getHolidayTitle(h).toLowerCase();
      return h.title.toLowerCase().includes(q) || localized.includes(q) || h.date.includes(q);
    }
    return true;
  });

  return (
    <div className="bg-white dark:bg-[#151D2E] border border-[#E2E8F0] dark:border-[#232E42] rounded-xl p-4 sm:p-5 shadow-xs transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-[#F1F5F9] dark:border-[#232E42]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">{countryObj?.flag}</span>
            <h2 className="font-primary text-[16px] sm:text-[17px] font-bold text-[#0F172A] dark:text-white">
              {t('hc_title')} ({year})
            </h2>
          </div>
          <p className="font-secondary text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">
            {countryObj?.officialCalendarName}
          </p>
        </div>

        <button
          onClick={onOpenPdfModal}
          className="px-3 py-1.5 bg-[#EFF6FF] dark:bg-[#1E3A8A]/40 text-[#0066FF] dark:text-[#38BDF8] hover:bg-[#DBEAFE] dark:hover:bg-[#1E3A8A]/60 rounded-lg font-primary text-[11px] font-semibold transition-colors flex items-center gap-1.5 self-start cursor-pointer border border-[#BFDBFE] dark:border-[#1E3A8A]"
        >
          <FileDown className="w-3.5 h-3.5" />
          {t('exp_btn_download_pdf')}
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="mt-3.5 flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder={t('hc_search_placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-lg pl-8 pr-3 py-1.5 font-secondary text-[11px] text-[#0F172A] dark:text-white placeholder:text-[#94A3B8] focus:outline-none focus:ring-1.5 focus:ring-[#0066FF]/20 focus:border-[#0066FF] dark:focus:border-[#38BDF8]"
          />
          <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterType('all')}
            className={`px-2.5 py-1 rounded-md font-primary text-[10.5px] font-semibold transition-colors cursor-pointer ${
              filterType === 'all'
                ? 'bg-[#0066FF] text-white'
                : 'bg-[#F1F5F9] dark:bg-[#1E293B] text-[#475569] dark:text-[#CBD5E1] hover:bg-[#E2E8F0] dark:hover:bg-[#28354D]'
            }`}
          >
            {t('hc_filter_all')} ({holidays.length})
          </button>
          <button
            onClick={() => setFilterType('dayoff')}
            className={`px-2.5 py-1 rounded-md font-primary text-[10.5px] font-semibold transition-colors cursor-pointer ${
              filterType === 'dayoff'
                ? 'bg-[#EF4444] text-white'
                : 'bg-[#F1F5F9] dark:bg-[#1E293B] text-[#475569] dark:text-[#CBD5E1] hover:bg-[#E2E8F0] dark:hover:bg-[#28354D]'
            }`}
          >
            {t('hc_filter_off')}
          </button>
          <button
            onClick={() => setFilterType('transferred')}
            className={`px-2.5 py-1 rounded-md font-primary text-[10.5px] font-semibold transition-colors cursor-pointer ${
              filterType === 'transferred'
                ? 'bg-[#F59E0B] text-white'
                : 'bg-[#F1F5F9] dark:bg-[#1E293B] text-[#475569] dark:text-[#CBD5E1] hover:bg-[#E2E8F0] dark:hover:bg-[#28354D]'
            }`}
          >
            {t('legend_transferred')}
          </button>
          <button
            onClick={() => setFilterType('shortened')}
            className={`px-2.5 py-1 rounded-md font-primary text-[10.5px] font-semibold transition-colors cursor-pointer ${
              filterType === 'shortened'
                ? 'bg-[#10B981] text-white'
                : 'bg-[#F1F5F9] dark:bg-[#1E293B] text-[#475569] dark:text-[#CBD5E1] hover:bg-[#E2E8F0] dark:hover:bg-[#28354D]'
            }`}
          >
            {t('hc_filter_shortened')}
          </button>
        </div>
      </div>

      {/* Holidays Grid */}
      <div className="mt-3.5 grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {filteredHolidays.map((h, idx) => {
          const d = parseDate(h.date);
          const dayOfWeek = weekdaysFull[(d.getDay() + 6) % 7];
          const localizedTitle = getHolidayTitle(h);

          return (
            <div
              key={`${h.date}-${idx}`}
              onClick={() => onSelectDate(d)}
              className="p-3 rounded-lg border border-[#E2E8F0] dark:border-[#232E42] hover:border-[#BFDBFE] dark:hover:border-[#1E3A8A] hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B] transition-colors cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-10 h-10 rounded-lg flex flex-col items-center justify-center shrink-0 border ${
                    h.type === 'shortened'
                      ? 'bg-[#ECFDF5] dark:bg-emerald-950/40 border-[#A7F3D0] dark:border-emerald-800 text-[#065F46] dark:text-emerald-400'
                      : h.isDayOff
                      ? 'bg-[#FEF2F2] dark:bg-rose-950/40 border-[#FEE2E2] dark:border-rose-900/60 text-[#DC2626] dark:text-rose-400'
                      : 'bg-[#EFF6FF] dark:bg-[#1E3A8A]/40 border-[#BFDBFE] dark:border-[#1E3A8A] text-[#0066FF] dark:text-[#38BDF8]'
                  }`}
                >
                  <span className="font-primary text-[13px] font-bold leading-none">
                    {d.getDate()}
                  </span>
                  <span className="font-secondary text-[8.5px] font-medium leading-none mt-0.5">
                    {h.date.split('-')[1]}
                  </span>
                </div>

                <div className="min-w-0">
                  <h4 className="font-primary text-[12.5px] font-bold text-[#0F172A] dark:text-white truncate">
                    {localizedTitle}
                  </h4>
                  <p className="font-secondary text-[10px] text-[#64748B] dark:text-[#94A3B8]">
                    {formatLocalizedDate(d)} • {dayOfWeek}
                  </p>
                </div>
              </div>

              <span
                className={`px-2 py-0.5 text-[9.5px] font-primary font-semibold rounded shrink-0 ml-2 ${
                  h.type === 'shortened'
                    ? 'bg-[#ECFDF5] dark:bg-emerald-950/40 text-[#065F46] dark:text-emerald-400'
                    : h.type === 'transferred'
                    ? 'bg-[#FFFBEB] dark:bg-amber-950/40 text-[#B45309] dark:text-amber-400'
                    : h.isDayOff
                    ? 'bg-[#FEF2F2] dark:bg-rose-950/40 text-[#DC2626] dark:text-rose-400'
                    : 'bg-[#F1F5F9] dark:bg-[#1E293B] text-[#475569] dark:text-[#CBD5E1]'
                }`}
              >
                {h.type === 'shortened'
                  ? t('legend_shortened')
                  : h.type === 'transferred'
                  ? t('legend_transferred')
                  : h.isDayOff
                  ? t('legend_weekend')
                  : t('legend_work')}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
