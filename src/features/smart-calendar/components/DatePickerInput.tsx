import React, { useState, useRef, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  X,
} from 'lucide-react';
import { formatDateShort, parseDate } from '../utils/calendarCalculations';
import { useTranslation } from '../i18n/LanguageContext';

interface DatePickerInputProps {
  value: string; // "DD.MM.YYYY"
  onChange: (newValue: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}

export const DatePickerInput: React.FC<DatePickerInputProps> = ({
  value,
  onChange,
  placeholder = '26.09.2026',
  className = '',
  id,
}) => {
  const { t, monthNames, weekdaysShort } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const nativeDateInputRef = useRef<HTMLInputElement>(null);

  // Parse currently selected date
  const parsedDate = parseDate(value || formatDateShort(new Date()));
  const [viewYear, setViewYear] = useState<number>(() => parsedDate.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(() => parsedDate.getMonth());

  // Keep view in sync when value changes externally
  useEffect(() => {
    if (value && value.length === 10) {
      const d = parseDate(value);
      if (!isNaN(d.getTime())) {
        setViewYear(d.getFullYear());
        setViewMonth(d.getMonth());
      }
    }
  }, [value]);

  // Close on click outside or Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    const selected = new Date(viewYear, viewMonth, day);
    onChange(formatDateShort(selected));
    setIsOpen(false);
  };

  const handleSelectToday = () => {
    const today = new Date();
    onChange(formatDateShort(today));
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    setIsOpen(false);
  };

  const handleAddDays = (daysToAdd: number) => {
    const base = parseDate(value || formatDateShort(new Date()));
    base.setDate(base.getDate() + daysToAdd);
    onChange(formatDateShort(base));
    setViewYear(base.getFullYear());
    setViewMonth(base.getMonth());
    setIsOpen(false);
  };

  // Convert "DD.MM.YYYY" to "YYYY-MM-DD" for native picker sync
  const getIsoDateString = (valStr: string) => {
    if (!valStr || valStr.length !== 10) return '';
    const parts = valStr.split('.');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return '';
  };

  const handleNativeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isoVal = e.target.value; // "YYYY-MM-DD"
    if (isoVal) {
      const parts = isoVal.split('-');
      if (parts.length === 3) {
        const formatted = `${parts[2]}.${parts[1]}.${parts[0]}`;
        onChange(formatted);
      }
    }
  };

  // Calculate calendar days for viewMonth and viewYear
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  // Day of week: 0 = Mon, 6 = Sun
  const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;

  // Previous month trailing days
  const prevMonthDays: number[] = [];
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    prevMonthDays.push(daysInPrevMonth - i);
  }

  // Current month days
  const currentDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Next month leading days to complete the 35 or 42 grid
  const totalSlots = prevMonthDays.length + currentDays.length;
  const remainingSlots = totalSlots <= 35 ? 35 - totalSlots : 42 - totalSlots;
  const nextMonthDays = Array.from({ length: remainingSlots }, (_, i) => i + 1);

  const today = new Date();
  const isSelectedDate = (day: number) => {
    return (
      parsedDate.getDate() === day &&
      parsedDate.getMonth() === viewMonth &&
      parsedDate.getFullYear() === viewYear
    );
  };

  const isTodayDate = (day: number) => {
    return (
      today.getDate() === day &&
      today.getMonth() === viewMonth &&
      today.getFullYear() === viewYear
    );
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Input container */}
      <div className="relative flex items-center">
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] hover:border-[#CBD5E1] dark:hover:border-[#475569] focus:border-[#0066FF] dark:focus:border-[#38BDF8] rounded-lg pl-2.5 pr-8 py-1.5 h-[34px] font-primary text-[12px] text-[#1E293B] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#0066FF]/20 transition-all tabular-nums"
        />

        {/* Clickable Calendar Button */}
        <button
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
            // If on mobile browser with native showPicker, attempt to trigger
            if ('ontouchstart' in window && nativeDateInputRef.current) {
              try {
                nativeDateInputRef.current.showPicker?.();
              } catch {
                // fallback to our custom popover
              }
            }
          }}
          className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md hover:bg-blue-50 dark:hover:bg-[#1E3A8A]/40 text-[#0066FF] dark:text-[#38BDF8] flex items-center justify-center transition-colors cursor-pointer"
          title={t('picker_open')}
        >
          <CalendarIcon className="w-3.5 h-3.5 stroke-[2.2]" />
        </button>

        {/* Hidden native input for mobile touch integration */}
        <input
          ref={nativeDateInputRef}
          type="date"
          value={getIsoDateString(value)}
          onChange={handleNativeChange}
          className="sr-only pointer-events-none"
          tabIndex={-1}
          aria-hidden="true"
        />
      </div>

      {/* Popover Calendar Modal / Dropdown */}
      {isOpen && (
        <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-1.5 z-50 bg-white dark:bg-[#151D2E] border border-[#E2E8F0] dark:border-[#232E42] rounded-2xl shadow-xl p-3 w-[min(280px,calc(100vw-28px))] max-w-[calc(100vw-28px)] animate-in fade-in zoom-in-95 duration-150">
          {/* Popover Header */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#F1F5F9] dark:border-[#232E42]">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="w-7 h-7 rounded-lg border border-[#E2E8F0] dark:border-[#334155] hover:bg-slate-50 dark:hover:bg-[#1E293B] flex items-center justify-center text-[#0066FF] dark:text-[#38BDF8] transition-colors cursor-pointer"
                title={t('previous_month')}
              >
                <ChevronLeft className="w-3.5 h-3.5 stroke-[2.2]" />
              </button>

              <div className="font-primary text-[13px] font-bold text-[#1E293B] dark:text-white min-w-[120px] text-center">
                {monthNames[viewMonth]} {viewYear}
              </div>

              <button
                type="button"
                onClick={handleNextMonth}
                className="w-7 h-7 rounded-lg border border-[#E2E8F0] dark:border-[#334155] hover:bg-slate-50 dark:hover:bg-[#1E293B] flex items-center justify-center text-[#0066FF] dark:text-[#38BDF8] transition-colors cursor-pointer"
                title={t('next_month')}
              >
                <ChevronRight className="w-3.5 h-3.5 stroke-[2.2]" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-6 h-6 rounded-md hover:bg-slate-100 dark:hover:bg-[#1E293B] flex items-center justify-center text-[#94A3B8] hover:text-[#334155] dark:hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Year Stepper Controls */}
          <div className="flex items-center justify-between px-1 mb-2 text-[11px] font-secondary text-[#64748B] dark:text-[#94A3B8]">
            <button
              type="button"
              onClick={() => setViewYear(viewYear - 1)}
              className="hover:text-[#0066FF] dark:hover:text-[#38BDF8] transition-colors cursor-pointer"
            >
              ← {viewYear - 1}
            </button>
            <span className="font-semibold text-[#1E293B] dark:text-white">{viewYear}</span>
            <button
              type="button"
              onClick={() => setViewYear(viewYear + 1)}
              className="hover:text-[#0066FF] dark:hover:text-[#38BDF8] transition-colors cursor-pointer"
            >
              {viewYear + 1} →
            </button>
          </div>

          {/* Weekday headers: Пн ... Вс */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {weekdaysShort.map((wd, idx) => {
              const isWeekend = idx >= 5;
              return (
                <div
                  key={wd}
                  className={`text-[11px] font-primary font-bold py-1 ${
                    isWeekend ? 'text-[#EF4444] dark:text-rose-400' : 'text-[#64748B] dark:text-[#94A3B8]'
                  }`}
                >
                  {wd}
                </div>
              );
            })}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {/* Prev month days */}
            {prevMonthDays.map((d) => (
              <button
                key={`prev-${d}`}
                type="button"
                onClick={() => {
                  handlePrevMonth();
                  setTimeout(() => handleSelectDay(d), 0);
                }}
                className="h-7 rounded-lg text-[11.5px] font-primary text-[#CBD5E1] dark:text-[#475569] hover:bg-slate-50 dark:hover:bg-[#1E293B] flex items-center justify-center transition-colors cursor-pointer"
              >
                {d}
              </button>
            ))}

            {/* Current month days */}
            {currentDays.map((d) => {
              const isSelected = isSelectedDate(d);
              const isToday = isTodayDate(d);
              const dayOfWeek = (new Date(viewYear, viewMonth, d).getDay() + 6) % 7;
              const isWeekend = dayOfWeek >= 5;

              return (
                <button
                  key={`curr-${d}`}
                  type="button"
                  onClick={() => handleSelectDay(d)}
                  className={`h-7 rounded-lg text-[12px] font-primary font-medium flex items-center justify-center transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-[#0066FF] text-white font-bold shadow-2xs'
                      : isToday
                      ? 'border border-[#0066FF] dark:border-[#38BDF8] text-[#0066FF] dark:text-[#38BDF8] font-bold hover:bg-blue-50 dark:hover:bg-[#1E3A8A]/40'
                      : isWeekend
                      ? 'text-[#EF4444] dark:text-rose-400 hover:bg-[#FFF5F5] dark:hover:bg-rose-950/30'
                      : 'text-[#1E293B] dark:text-[#F1F5F9] hover:bg-slate-100 dark:hover:bg-[#1E293B]'
                  }`}
                >
                  {d}
                  {isToday && !isSelected && (
                    <span className="w-1 h-1 rounded-full bg-[#0066FF] dark:bg-[#38BDF8] absolute bottom-0.5" />
                  )}
                </button>
              );
            })}

            {/* Next month days */}
            {nextMonthDays.map((d) => (
              <button
                key={`next-${d}`}
                type="button"
                onClick={() => {
                  handleNextMonth();
                  setTimeout(() => handleSelectDay(d), 0);
                }}
                className="h-7 rounded-lg text-[11.5px] font-primary text-[#CBD5E1] dark:text-[#475569] hover:bg-slate-50 dark:hover:bg-[#1E293B] flex items-center justify-center transition-colors cursor-pointer"
              >
                {d}
              </button>
            ))}
          </div>

          {/* Quick Shortcuts Footer */}
          <div className="mt-2.5 pt-2 border-t border-[#F1F5F9] dark:border-[#232E42] flex items-center justify-between text-[11px] font-primary">
            <button
              type="button"
              onClick={handleSelectToday}
              className="text-[#0066FF] dark:text-[#38BDF8] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              {t('picker_today')}
            </button>

            <div className="flex items-center gap-1.5 text-[#64748B] dark:text-[#94A3B8]">
              <button
                type="button"
                onClick={() => handleAddDays(7)}
                className="px-1.5 py-0.5 bg-slate-100 dark:bg-[#1E293B] hover:bg-blue-50 dark:hover:bg-[#1E3A8A]/40 hover:text-[#0066FF] dark:hover:text-[#38BDF8] rounded transition-colors cursor-pointer"
              >
                {t('picker_add_7d')}
              </button>
              <button
                type="button"
                onClick={() => handleAddDays(30)}
                className="px-1.5 py-0.5 bg-slate-100 dark:bg-[#1E293B] hover:bg-blue-50 dark:hover:bg-[#1E3A8A]/40 hover:text-[#0066FF] dark:hover:text-[#38BDF8] rounded transition-colors cursor-pointer"
              >
                {t('picker_add_30d')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
