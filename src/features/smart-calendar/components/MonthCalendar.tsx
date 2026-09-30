import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, Search, RotateCcw, FileDown } from 'lucide-react';
import { CountryCode, DayInfo, WorkWeekType } from '../types/calendar';
import { getMonthCalendarDays } from '../utils/calendarCalculations';
import { useTranslation } from '../i18n/LanguageContext';

interface MonthCalendarProps {
  year: number;
  month: number;
  country: CountryCode;
  workWeekType: WorkWeekType;
  firstDayOfWeek?: 0 | 1;
  showHolidays: boolean;
  showTransferred: boolean;
  showIsoWeeks: boolean;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onGoToToday: () => void;
  todayDate: Date;
  onChangeMonth?: (month: number) => void;
  onChangeYear?: (year: number) => void;
  onOpenPdfModal?: (type?: 'month' | 'year' | 'calculations') => void;
}

const DECADES_LIST = [1960, 1970, 1980, 1990, 2000, 2010, 2020, 2030, 2040];

export const MonthCalendar: React.FC<MonthCalendarProps> = ({
  year,
  month,
  country,
  workWeekType,
  firstDayOfWeek = 1,
  showHolidays,
  showTransferred,
  showIsoWeeks,
  selectedDate,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
  onGoToToday,
  todayDate,
  onChangeMonth,
  onChangeYear,
  onOpenPdfModal,
}) => {
  const { t, monthNames, weekdaysShort, getHolidayTitle } = useTranslation();
  const [viewMode, setViewMode] = useState<'days' | 'months' | 'years'>('days');
  const [yearSearchQuery, setYearSearchQuery] = useState<string>('');
  const yearScrollContainerRef = useRef<HTMLDivElement>(null);
  const selectedYearRef = useRef<HTMLButtonElement>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (viewMode !== 'days') return;
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (viewMode !== 'days' || touchStartXRef.current === null || touchStartYRef.current === null) return;
    const diffX = e.changedTouches[0].clientX - touchStartXRef.current;
    const diffY = e.changedTouches[0].clientY - touchStartYRef.current;
    if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY) * 1.3) {
      if (diffX < 0) {
        onNextMonth();
      } else {
        onPrevMonth();
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  // Auto scroll to selected year when switching to years view
  useEffect(() => {
    if (viewMode === 'years') {
      setTimeout(() => {
        selectedYearRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 50);
    }
  }, [viewMode]);

  const days = getMonthCalendarDays(year, month, country, workWeekType, todayDate, firstDayOfWeek);

  const weeks: DayInfo[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const weekdays = firstDayOfWeek === 1
    ? weekdaysShort
    : [weekdaysShort[6], ...weekdaysShort.slice(0, 6)];

  const selectedDateStr = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}`;

  const isTodayDate = (date: Date) => {
    return (
      date.getDate() === todayDate.getDate() &&
      date.getMonth() === todayDate.getMonth() &&
      date.getFullYear() === todayDate.getFullYear()
    );
  };

  // Month Statistics for filling empty space with real value
  const currentMonthDays = days.filter((d) => d.isCurrentMonth);
  const workDaysCount = currentMonthDays.filter((d) => !d.isDayOff).length;
  const weekendDaysCount = currentMonthDays.filter((d) => d.isDayOff && !d.isHoliday).length;
  const holidayDaysCount = currentMonthDays.filter((d) => d.isHoliday).length;
  const dailyHours = workWeekType === '6_DAYS' ? 7 : workWeekType === '4_DAYS' ? 9 : 8;
  const workHoursCount = workDaysCount * dailyHours;

  const scrollToDecade = (decYear: number) => {
    const el = document.getElementById(`decade-${decYear}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleYearSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(yearSearchQuery.trim(), 10);
    if (!isNaN(parsed) && parsed >= 1950 && parsed <= 2050) {
      if (onChangeYear) onChangeYear(parsed);
      setYearSearchQuery('');
      setViewMode('months');
    }
  };

  return (
    <div
      id="printable-calendar"
      className="bg-white dark:bg-[#151D2E] border border-[#E2E8F0] dark:border-[#232E42] rounded-2xl p-2.5 sm:p-5 shadow-xs h-full flex flex-col justify-between transition-colors select-none overflow-hidden"
    >
      <div className="flex-1 flex flex-col justify-between">
        {/* Navigation Header matching user request */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 mb-2.5 sm:mb-3 pb-1 border-b border-transparent">
          {viewMode === 'days' && (
            <>
              <div className="flex items-center justify-between sm:justify-start gap-1 sm:gap-2 w-full sm:w-auto">
                <button
                  onClick={onPrevMonth}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-[#E2E8F0] dark:border-[#334155] hover:bg-slate-50 dark:hover:bg-[#1E293B] flex items-center justify-center transition-colors cursor-pointer text-[#0066FF] dark:text-[#38BDF8] shrink-0"
                  title={t('prev_month')}
                >
                  <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
                </button>

                {/* Interactive Month and Year clickable triggers */}
                <div className="flex items-center gap-0.5 sm:gap-1 min-w-0">
                  <button
                    type="button"
                    onClick={() => setViewMode('months')}
                    className="px-2 sm:px-2.5 py-1 rounded-xl font-primary text-[14px] sm:text-[17px] font-bold text-[#1E293B] dark:text-white hover:text-[#0066FF] dark:hover:text-[#38BDF8] hover:bg-[#EFF6FF] dark:hover:bg-[#1E3A8A]/30 border border-transparent hover:border-[#BFDBFE] dark:hover:border-[#1E3A8A] transition-all cursor-pointer flex items-center gap-0.5 sm:gap-1 group truncate"
                    title={t('select_month_view')}
                  >
                    <span className="truncate">{monthNames[month]}</span>
                    <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#94A3B8] dark:text-[#64748B] group-hover:text-[#0066FF] dark:group-hover:text-[#38BDF8] transition-transform duration-200 shrink-0" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode('years')}
                    className="px-1.5 sm:px-2.5 py-1 rounded-xl font-primary text-[14px] sm:text-[17px] font-bold text-[#1E293B] dark:text-white hover:text-[#0066FF] dark:hover:text-[#38BDF8] hover:bg-[#EFF6FF] dark:hover:bg-[#1E3A8A]/30 border border-transparent hover:border-[#BFDBFE] dark:hover:border-[#1E3A8A] transition-all cursor-pointer flex items-center gap-0.5 sm:gap-1 group shrink-0"
                    title={t('select_year_view')}
                  >
                    <span>{year}</span>
                    <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#94A3B8] dark:text-[#64748B] group-hover:text-[#0066FF] dark:group-hover:text-[#38BDF8] transition-transform duration-200 shrink-0" />
                  </button>
                </div>

                <button
                  onClick={onNextMonth}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-[#E2E8F0] dark:border-[#334155] hover:bg-slate-50 dark:hover:bg-[#1E293B] flex items-center justify-center transition-colors cursor-pointer text-[#0066FF] dark:text-[#38BDF8] shrink-0"
                  title={t('next_month')}
                >
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
                </button>
              </div>

              <div className="flex items-center justify-end gap-1.5 self-end sm:self-auto shrink-0">
                {onOpenPdfModal && (
                  <button
                    type="button"
                    onClick={() => onOpenPdfModal('month')}
                    className="px-2.5 py-1 sm:py-1.5 text-[11px] sm:text-[11.5px] font-primary font-medium text-[#475569] dark:text-[#CBD5E1] hover:text-[#0066FF] dark:hover:text-[#38BDF8] hover:bg-[#EFF6FF] dark:hover:bg-[#1E3A8A]/30 border border-[#E2E8F0] dark:border-[#334155] hover:border-[#BFDBFE] dark:hover:border-[#1E3A8A] rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                    title={t('btn_export_pdf')}
                  >
                    <FileDown className="w-3.5 h-3.5 text-[#0066FF] dark:text-[#38BDF8]" />
                    <span className="hidden sm:inline">PDF</span>
                  </button>
                )}
                <button
                  onClick={onGoToToday}
                  className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-[11.5px] sm:text-[12px] font-primary font-semibold text-[#0066FF] dark:text-[#38BDF8] hover:bg-[#EFF6FF] dark:hover:bg-[#1E3A8A]/30 border border-[#BFDBFE] dark:border-[#1E3A8A] rounded-lg transition-colors cursor-pointer"
                >
                  {t('today')}
                </button>
              </div>
            </>
          )}

          {viewMode === 'months' && (
            <>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onChangeYear && onChangeYear(year - 1)}
                  className="w-8 h-8 rounded-lg border border-[#E2E8F0] dark:border-[#334155] hover:bg-slate-50 dark:hover:bg-[#1E293B] flex items-center justify-center transition-colors cursor-pointer text-[#0066FF] dark:text-[#38BDF8]"
                  title="Previous year"
                >
                  <ChevronLeft className="w-4 h-4 stroke-[2.2]" />
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode('years')}
                  className="px-3 py-1 rounded-xl bg-[#EFF6FF] dark:bg-[#1E3A8A]/40 hover:bg-blue-100 dark:hover:bg-[#1E3A8A]/60 text-[#0066FF] dark:text-[#38BDF8] border border-[#BFDBFE] dark:border-[#1E3A8A] font-primary text-[15px] sm:text-[16px] font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  title={t('select_year_view')}
                >
                  <span>{year}</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onChangeYear && onChangeYear(year + 1)}
                  className="w-8 h-8 rounded-lg border border-[#E2E8F0] dark:border-[#334155] hover:bg-slate-50 dark:hover:bg-[#1E293B] flex items-center justify-center transition-colors cursor-pointer text-[#0066FF] dark:text-[#38BDF8]"
                  title="Next year"
                >
                  <ChevronRight className="w-4 h-4 stroke-[2.2]" />
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setViewMode('days')}
                  className="px-3 py-1.5 text-[12px] font-primary font-semibold text-[#475569] dark:text-[#CBD5E1] hover:bg-slate-100 dark:hover:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-lg transition-colors cursor-pointer"
                >
                  {t('return_to_calendar')}
                </button>
                <button
                  onClick={() => {
                    onGoToToday();
                    setViewMode('days');
                  }}
                  className="px-3 py-1.5 text-[12px] font-primary font-semibold text-[#0066FF] dark:text-[#38BDF8] hover:bg-[#EFF6FF] dark:hover:bg-[#1E3A8A]/30 border border-[#BFDBFE] dark:border-[#1E3A8A] rounded-lg transition-colors cursor-pointer"
                >
                  {t('today')}
                </button>
              </div>
            </>
          )}

          {viewMode === 'years' && (
            <>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const target = Math.max(1960, year - 10);
                    if (onChangeYear) onChangeYear(target);
                    scrollToDecade(Math.floor(target / 10) * 10);
                  }}
                  className="w-8 h-8 rounded-lg border border-[#E2E8F0] dark:border-[#334155] hover:bg-slate-50 dark:hover:bg-[#1E293B] flex items-center justify-center transition-colors cursor-pointer text-[#0066FF] dark:text-[#38BDF8]"
                  title="-10"
                >
                  <ChevronLeft className="w-4 h-4 stroke-[2.2]" />
                </button>

                <div className="px-2 py-0.5 rounded-lg bg-[#EFF6FF] dark:bg-[#1E3A8A]/40 border border-[#BFDBFE] dark:border-[#1E3A8A] text-[#0066FF] dark:text-[#38BDF8] font-primary text-[14px] sm:text-[15.5px] font-bold">
                  {t('select_year_view')} (1960 — 2050)
                </div>

                <button
                  onClick={() => {
                    const target = Math.min(2050, year + 10);
                    if (onChangeYear) onChangeYear(target);
                    scrollToDecade(Math.floor(target / 10) * 10);
                  }}
                  className="w-8 h-8 rounded-lg border border-[#E2E8F0] dark:border-[#334155] hover:bg-slate-50 dark:hover:bg-[#1E293B] flex items-center justify-center transition-colors cursor-pointer text-[#0066FF] dark:text-[#38BDF8]"
                  title="+10"
                >
                  <ChevronRight className="w-4 h-4 stroke-[2.2]" />
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setViewMode('days')}
                  className="px-3 py-1.5 text-[12px] font-primary font-semibold text-[#475569] dark:text-[#CBD5E1] hover:bg-slate-100 dark:hover:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-lg transition-colors cursor-pointer"
                >
                  {t('return_to_calendar')}
                </button>
                <button
                  onClick={() => {
                    onGoToToday();
                    setViewMode('days');
                  }}
                  className="px-3 py-1.5 text-[12px] font-primary font-semibold text-[#0066FF] dark:text-[#38BDF8] hover:bg-[#EFF6FF] dark:hover:bg-[#1E3A8A]/30 border border-[#BFDBFE] dark:border-[#1E3A8A] rounded-lg transition-colors cursor-pointer"
                >
                  {t('today')}
                </button>
              </div>
            </>
          )}
        </div>

        {/* View Mode 1: MONTHS SELECTION GRID */}
        {viewMode === 'months' && (
          <div className="flex-1 flex flex-col justify-between py-1">
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 sm:gap-3 flex-1 items-stretch">
              {monthNames.map((mName, mIdx) => {
                const isSelected = mIdx === month;
                const isCurrentMonthNow =
                  todayDate.getMonth() === mIdx && todayDate.getFullYear() === year;

                return (
                  <button
                    key={mName}
                    type="button"
                    onClick={() => {
                      if (onChangeMonth) onChangeMonth(mIdx);
                      setViewMode('days');
                    }}
                    className={`rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-[#0066FF] border-[#0066FF] text-white font-bold shadow-sm ring-2 ring-[#0066FF]/20'
                        : isCurrentMonthNow
                        ? 'bg-[#EFF6FF] dark:bg-[#1E3A8A]/40 border-[#BFDBFE] dark:border-[#1E3A8A] text-[#0066FF] dark:text-[#38BDF8] font-bold hover:bg-[#DBEAFE] dark:hover:bg-[#1E3A8A]/60'
                        : 'bg-[#F8FAFC] dark:bg-[#1E293B] border-[#E2E8F0] dark:border-[#334155] text-[#1E293B] dark:text-[#F1F5F9] font-semibold hover:bg-white dark:hover:bg-[#28354D] hover:border-[#CBD5E1] hover:shadow-2xs'
                    }`}
                  >
                    <span
                      className={`text-[11px] font-mono tracking-wider mb-1 ${
                        isSelected ? 'text-blue-100' : 'text-[#64748B] dark:text-[#94A3B8]'
                      }`}
                    >
                      {(mIdx + 1).toString().padStart(2, '0')}
                    </span>
                    <span className="font-primary text-[14px] sm:text-[15px] leading-tight">
                      {mName}
                    </span>
                    {isCurrentMonthNow && !isSelected && (
                      <span className="text-[10px] text-[#0066FF] dark:text-[#38BDF8] font-medium mt-1">
                        Текущий
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-3 pt-2 text-center text-[12px] font-secondary text-[#64748B] dark:text-[#94A3B8] flex items-center justify-center gap-1.5">
              <span>💡 Нажмите на месяц для перехода к его календарю или на год в шапке для смены года</span>
            </div>
          </div>
        )}

        {/* View Mode 2: COMPREHENSIVE YEARS SELECTION GRID (1960 - 2050) */}
        {viewMode === 'years' && (
          <div className="flex-1 flex flex-col justify-between py-1 min-h-[360px]">
            {/* Decade Quick Jump Chips & Search */}
            <div className="space-y-2 mb-2">
              {/* Quick Decade Jump Bar */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-primary scrollbar-none">
                <span className="text-[#64748B] dark:text-[#94A3B8] font-medium text-[10.5px] shrink-0 mr-1">Десятилетия:</span>
                {DECADES_LIST.map((dec) => {
                  const isCurrentDecade = year >= dec && year < dec + 10;
                  return (
                    <button
                      key={dec}
                      type="button"
                      onClick={() => scrollToDecade(dec)}
                      className={`px-2 py-1 rounded-lg shrink-0 transition-all cursor-pointer font-medium ${
                        isCurrentDecade
                          ? 'bg-[#0066FF] text-white font-bold shadow-2xs'
                          : 'bg-[#F1F5F9] dark:bg-[#1E293B] hover:bg-[#E2E8F0] dark:hover:bg-[#28354D] text-[#334155] dark:text-[#CBD5E1]'
                      }`}
                    >
                      {dec}-е
                    </button>
                  );
                })}
              </div>

              {/* Direct Year Search / Input */}
              <form onSubmit={handleYearSearchSubmit} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="number"
                    min="1950"
                    max="2050"
                    value={yearSearchQuery}
                    onChange={(e) => setYearSearchQuery(e.target.value)}
                    placeholder="Быстрый ввод года (напр. 1998, 2010, 2035)..."
                    className="w-full pl-8 pr-3 py-1.5 bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-xl text-[12px] font-primary text-[#1E293B] dark:text-white focus:outline-none focus:border-[#0066FF] dark:focus:border-[#38BDF8] focus:bg-white dark:focus:bg-[#151D2E] transition-all placeholder:text-[#94A3B8]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-[#0066FF] hover:bg-blue-700 text-white rounded-xl text-[12px] font-primary font-semibold transition-colors cursor-pointer shrink-0"
                >
                  Перейти
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const nowY = todayDate.getFullYear();
                    if (onChangeYear) onChangeYear(nowY);
                    scrollToDecade(Math.floor(nowY / 10) * 10);
                  }}
                  className="px-2.5 py-1.5 bg-[#EFF6FF] dark:bg-[#1E3A8A]/40 hover:bg-blue-100 dark:hover:bg-[#1E3A8A]/60 text-[#0066FF] dark:text-[#38BDF8] border border-[#BFDBFE] dark:border-[#1E3A8A] rounded-xl text-[11px] font-primary font-semibold transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                  title="К текущему году"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Сегодня ({todayDate.getFullYear()})</span>
                </button>
              </form>
            </div>

            {/* Scrollable Years Grid (1960 to 2050) with Decade Dividers */}
            <div
              ref={yearScrollContainerRef}
              className="max-h-[300px] sm:max-h-[340px] overflow-y-auto pr-1 space-y-3.5 scroll-smooth"
            >
              {DECADES_LIST.map((decade) => {
                const decadeYears = Array.from({ length: 10 }, (_, i) => decade + i).filter(
                  (y) => y <= 2050
                );

                return (
                  <div key={decade} id={`decade-${decade}`} className="space-y-1.5">
                    <div className="flex items-center gap-2 px-1">
                      <span className="font-primary text-[11.5px] font-bold text-[#1E3A8A] dark:text-[#93C5FD] bg-[#EFF6FF] dark:bg-[#1E3A8A]/40 px-2 py-0.5 rounded-md">
                        {decade}-е годы ({decade} — {Math.min(2050, decade + 9)})
                      </span>
                      <div className="flex-1 h-px bg-[#E2E8F0] dark:bg-[#232E42]" />
                    </div>

                    <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                      {decadeYears.map((yVal) => {
                        const isSelected = yVal === year;
                        const isCurrentYearNow = todayDate.getFullYear() === yVal;

                        return (
                          <button
                            key={yVal}
                            ref={isSelected ? selectedYearRef : undefined}
                            type="button"
                            onClick={() => {
                              if (onChangeYear) onChangeYear(yVal);
                              setViewMode('months');
                            }}
                            className={`rounded-xl py-2 px-1 flex flex-col items-center justify-center transition-all cursor-pointer border text-center ${
                              isSelected
                                ? 'bg-[#0066FF] border-[#0066FF] text-white font-bold shadow-sm ring-2 ring-[#0066FF]/20 scale-[1.02]'
                                : isCurrentYearNow
                                ? 'bg-[#EFF6FF] dark:bg-[#1E3A8A]/40 border-[#BFDBFE] dark:border-[#1E3A8A] text-[#0066FF] dark:text-[#38BDF8] font-bold hover:bg-[#DBEAFE] dark:hover:bg-[#1E3A8A]/60'
                                : 'bg-[#F8FAFC] dark:bg-[#1E293B] border-[#E2E8F0] dark:border-[#334155] text-[#1E293B] dark:text-[#F1F5F9] font-semibold hover:bg-white dark:hover:bg-[#28354D] hover:border-[#CBD5E1] hover:shadow-2xs'
                            }`}
                          >
                            <span className="font-primary text-[14px] sm:text-[15px] font-bold leading-none">
                              {yVal}
                            </span>
                            {isCurrentYearNow && (
                              <span
                                className={`text-[9px] font-medium mt-1 leading-none ${
                                  isSelected ? 'text-blue-100' : 'text-[#0066FF] dark:text-[#38BDF8]'
                                }`}
                              >
                                Текущий
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-2.5 pt-2 border-t border-[#F1F5F9] dark:border-[#232E42] text-center text-[11.5px] font-secondary text-[#64748B] dark:text-[#94A3B8] flex items-center justify-center gap-1.5">
              <span>💡 Доступны все года от 1960 до 2050: прокручивайте список, выбирайте десятилетие или введите год</span>
            </div>
          </div>
        )}

        {/* View Mode 3: STANDARD DAYS TABLE */}
        {viewMode === 'days' && (
          <>
            <div
              className="w-full flex-1 flex flex-col justify-between touch-pan-y"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* Weekday headers matching screenshot: plain text for weekdays, borderless red blocks for weekends */}
              <div className={`grid ${showIsoWeeks ? 'grid-cols-8' : 'grid-cols-7'} gap-1 sm:gap-2 text-center mb-1 sm:mb-1.5`}>
                {showIsoWeeks && (
                  <div className="text-[10px] sm:text-[11px] font-primary font-medium text-[#94A3B8] flex items-center justify-center py-1 sm:py-2">
                    №
                  </div>
                )}
                {weekdays.map((wd, idx) => {
                  const isWeekendHeader = firstDayOfWeek === 1 ? idx >= 5 : idx === 0 || idx === 6;
                  return (
                    <div
                      key={`${wd}-${idx}`}
                      className={`text-[11.5px] sm:text-[13px] font-primary font-bold py-1.5 sm:py-2 rounded-lg sm:rounded-xl flex items-center justify-center transition-colors ${
                        isWeekendHeader
                          ? 'text-[#EF4444] dark:text-rose-400 bg-[#FFF5F5] dark:bg-rose-950/30'
                          : 'text-[#334155] dark:text-[#CBD5E1]'
                      }`}
                    >
                      {wd}
                    </div>
                  );
                })}
              </div>

              {/* Weeks and days matching screenshot */}
              <div className="flex flex-col flex-1 justify-between gap-1 sm:gap-2">
                {weeks.map((week, wIdx) => {
                  const isoWeekNum = week[0]?.isoWeek || 1;

                  return (
                    <div
                      key={wIdx}
                      className={`grid ${showIsoWeeks ? 'grid-cols-8' : 'grid-cols-7'} gap-1 sm:gap-2 items-stretch flex-1`}
                    >
                      {showIsoWeeks && (
                        <div className="text-[9.5px] sm:text-[11px] font-mono text-[#94A3B8] flex items-center justify-center py-0.5 sm:py-1">
                          {isoWeekNum}
                        </div>
                      )}

                      {week.map((day, dIdx) => {
                        const isSelected = day.dateStr === selectedDateStr;
                        const isToday = isTodayDate(day.date);
                        const isWeekendCol = firstDayOfWeek === 1 ? dIdx >= 5 : dIdx === 0 || dIdx === 6;

                        // Days from previous or next month: very light gray square blocks WITHOUT contour/border
                        if (!day.isCurrentMonth) {
                          return (
                            <button
                              key={day.dateStr}
                              onClick={() => {
                                onSelectDate(day.date);
                                if (onChangeMonth && day.date.getMonth() !== month) {
                                  onChangeMonth(day.date.getMonth());
                                }
                                if (onChangeYear && day.date.getFullYear() !== year) {
                                  onChangeYear(day.date.getFullYear());
                                }
                              }}
                              title={`${day.dayNumber} ${monthNames[day.date.getMonth()]}`}
                              className={`h-full min-h-[38px] sm:min-h-[46px] rounded-lg sm:rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer bg-[#F8FAFC] dark:bg-[#1E293B]/40 hover:bg-slate-100 dark:hover:bg-[#1E293B] min-w-0 ${
                                isWeekendCol ? 'text-[#FCA5A5] dark:text-rose-900/80' : 'text-[#94A3B8] dark:text-[#64748B]'
                              }`}
                            >
                              <span className="font-primary text-[12.5px] sm:text-[14.5px] leading-none">
                                {day.dayNumber}
                              </span>
                            </button>
                          );
                        }

                        // Dot indicators matching screenshot
                        let dotColor = null;
                        if (day.isHoliday && showHolidays) {
                          dotColor = 'bg-[#EF4444]'; // Red for holidays
                        } else if (day.isTransferred && showTransferred) {
                          dotColor = 'bg-[#F59E0B]'; // Orange for transferred
                        } else if (day.dayNumber === 1 && !day.isDayOff) {
                          dotColor = 'bg-[#16A34A]'; // Green for standard work day
                        }

                        const holidayName = day.holiday ? getHolidayTitle(day.holiday) : '';

                        // Selected / Today: solid blue fill as before
                        if (isSelected || isToday) {
                          return (
                            <button
                              key={day.dateStr}
                              onClick={() => onSelectDate(day.date)}
                              title={
                                day.holiday
                                  ? `${holidayName} (${day.isDayOff ? t('day_off') : t('working_day')})`
                                  : `${day.dayNumber} ${monthNames[day.date.getMonth()]}`
                              }
                              className="h-full min-h-[40px] sm:min-h-[48px] rounded-lg sm:rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer bg-[#0066FF] text-white font-bold shadow-xs min-w-0"
                            >
                              <span className="font-primary text-[13.5px] sm:text-[15.5px] leading-none">
                                {day.dayNumber}
                              </span>
                              {/* Dot if needed */}
                              {dotColor && (
                                <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full mt-0.5 sm:mt-1 bg-white/80" />
                              )}
                            </button>
                          );
                        }

                        // Weekend: Saturday and Sunday individual red blocks WITHOUT contour/border
                        if (isWeekendCol) {
                          return (
                            <button
                              key={day.dateStr}
                              onClick={() => onSelectDate(day.date)}
                              title={
                                day.holiday
                                  ? `${holidayName} (${day.isDayOff ? t('day_off') : t('working_day')})`
                                  : `${day.dayNumber} ${monthNames[day.date.getMonth()]} (${t('day_off')})`
                              }
                              className="h-full min-h-[40px] sm:min-h-[48px] rounded-lg sm:rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer bg-[#FFF5F5] dark:bg-rose-950/25 hover:bg-red-100/70 dark:hover:bg-rose-950/45 text-[#EF4444] dark:text-rose-400 font-semibold min-w-0"
                            >
                              <span className="font-primary text-[13.5px] sm:text-[15.5px] leading-none">
                                {day.dayNumber}
                              </span>

                              {dotColor && (
                                <span className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full mt-0.5 sm:mt-1 ${dotColor}`} />
                              )}
                            </button>
                          );
                        }

                        // Regular weekdays (Mon-Fri, including mid-week holidays like Tue/Wed):
                        return (
                          <button
                            key={day.dateStr}
                            onClick={() => onSelectDate(day.date)}
                            title={
                              day.holiday
                              ? `${holidayName} (${day.isDayOff ? t('day_off') : t('working_day')})`
                              : `${day.dayNumber} ${monthNames[day.date.getMonth()]}`
                          }
                          className="h-full min-h-[40px] sm:min-h-[48px] rounded-lg sm:rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer text-[#1E293B] dark:text-[#F1F5F9] hover:bg-slate-100 dark:hover:bg-[#1E293B] font-semibold min-w-0"
                        >
                          <span className="font-primary text-[13.5px] sm:text-[15.5px] leading-none">
                            {day.dayNumber}
                          </span>

                          {dotColor && (
                            <span className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full mt-0.5 sm:mt-1 ${dotColor}`} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Month Statistics Strip */}
          <div className="mt-2.5 sm:mt-3 pt-2 sm:pt-2.5 border-t border-[#F1F5F9] dark:border-[#232E42] grid grid-cols-3 gap-1.5 sm:gap-2 text-center">
            <div className="bg-[#F0FDF4] dark:bg-emerald-950/20 border border-[#DCFCE7] dark:border-emerald-900/40 rounded-lg sm:rounded-xl py-1 sm:py-1.5 px-1 sm:px-2 min-w-0">
              <span className="font-secondary text-[8.5px] sm:text-[10px] text-[#16A34A] dark:text-emerald-400 block font-medium truncate">{t('legend_work')}</span>
              <span className="font-primary text-[11px] sm:text-[13px] font-bold text-[#15803D] dark:text-emerald-300 tabular-nums block leading-tight truncate">
                {workDaysCount} {t('days_count')}
              </span>
              <span className="font-secondary text-[8px] sm:text-[9.5px] text-[#16A34A] dark:text-emerald-400 block font-normal truncate mt-0.5 opacity-90">
                ({workHoursCount}{t('hours_short')})
              </span>
            </div>
            <div className="bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-lg sm:rounded-xl py-1 sm:py-1.5 px-1 sm:px-2 min-w-0 flex flex-col justify-center">
              <span className="font-secondary text-[8.5px] sm:text-[10px] text-[#64748B] dark:text-[#94A3B8] block font-medium truncate">{t('legend_weekend')}</span>
              <span className="font-primary text-[11px] sm:text-[13px] font-bold text-[#334155] dark:text-[#E2E8F0] tabular-nums block leading-tight truncate mt-0.5">
                {weekendDaysCount} {t('days_count')}
              </span>
            </div>
            <div className="bg-[#FEF2F2] dark:bg-rose-950/20 border border-[#FEE2E2] dark:border-rose-900/40 rounded-lg sm:rounded-xl py-1 sm:py-1.5 px-1 sm:px-2 min-w-0 flex flex-col justify-center">
              <span className="font-secondary text-[8.5px] sm:text-[10px] text-[#EF4444] dark:text-rose-400 block font-medium truncate">{t('legend_holiday')}</span>
              <span className="font-primary text-[11px] sm:text-[13px] font-bold text-[#DC2626] dark:text-rose-300 tabular-nums block leading-tight truncate mt-0.5">
                {holidayDaysCount} {t('days_count')}
              </span>
            </div>
          </div>
        </>
      )}
    </div>

      {/* Legend matching screenshot */}
      <div className="mt-2.5 sm:mt-3 pt-2 sm:pt-2.5 border-t border-[#F1F5F9] dark:border-[#232E42] flex flex-wrap items-center justify-start gap-x-2.5 sm:gap-x-4 gap-y-1 text-[10px] sm:text-[11px] font-secondary text-[#475569] dark:text-[#94A3B8]">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
          <span>{t('legend_work')}</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FCA5A5]" />
          <span>{t('legend_weekend')}</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
          <span>{t('legend_holiday')}</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
          <span>{t('legend_transferred')}</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF]" />
          <span>{t('today')}</span>
        </div>
      </div>
    </div>
  );
};
