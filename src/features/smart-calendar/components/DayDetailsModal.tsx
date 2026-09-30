import React from 'react';
import { X, Info, ArrowRight, Copy, Check } from 'lucide-react';
import { CountryCode, WorkWeekType } from '../types/calendar';
import {
  getDayStatus,
  getISOWeek,
  getDayOfYear,
} from '../utils/calendarCalculations';
import { useTranslation } from '../i18n/LanguageContext';

interface DayDetailsModalProps {
  date: Date | null;
  onClose: () => void;
  country: CountryCode;
  workWeekType: WorkWeekType;
  onSetAsCalculatorDate: (dateStr: string) => void;
}

export const DayDetailsModal: React.FC<DayDetailsModalProps> = ({
  date,
  onClose,
  country,
  workWeekType,
  onSetAsCalculatorDate,
}) => {
  const { t, formatLocalizedDate, weekdaysFull, getHolidayTitle, monthNames } = useTranslation();
  const [copied, setCopied] = React.useState(false);

  if (!date) return null;

  const status = getDayStatus(date, country, workWeekType);
  const formatted = formatLocalizedDate(date);
  const dayName = weekdaysFull[(date.getDay() + 6) % 7];
  const isoWeek = getISOWeek(date);
  const dayOfYear = getDayOfYear(date);
  const dateDMY = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}.${date.getFullYear()}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(dateDMY);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150 font-primary">
      <div className="bg-white dark:bg-[#151D2E] rounded-[22px] max-w-md w-full p-6 shadow-2xl border border-[#E2E8F0] dark:border-[#232E42] flex flex-col gap-4 transition-colors">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#F1F5F9] dark:border-[#232E42] pb-3.5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] dark:bg-blue-950/60 text-[#1A73E8] dark:text-blue-400 flex flex-col items-center justify-center font-bold">
              <span className="text-lg leading-none">{date.getDate()}</span>
              <span className="text-[10px] text-[#3B82F6] dark:text-blue-300 font-medium leading-none mt-0.5">
                {monthNames[date.getMonth()].slice(0, 3)}
              </span>
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#0F172A] dark:text-slate-100 leading-tight">
                {formatted}
              </h3>
              <p className="text-[12.5px] font-medium text-[#64748B] dark:text-slate-400 mt-0.5">
                {dayName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#94A3B8] hover:text-[#475569] dark:hover:text-slate-200 p-1 rounded-lg hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status badges */}
        <div className="flex flex-wrap items-center gap-2">
          {status.isDayOff ? (
            <span className="px-2.5 py-1 rounded-lg text-[11.5px] font-bold bg-[#FEF2F2] dark:bg-rose-950/40 text-[#DC2626] dark:text-rose-400 border border-[#FEE2E2] dark:border-rose-900/50">
              {status.isHoliday ? t('day_type_holiday') : t('day_type_weekend')}
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-lg text-[11.5px] font-bold bg-[#ECFDF5] dark:bg-emerald-950/40 text-[#065F46] dark:text-emerald-400 border border-[#A7F3D0] dark:border-emerald-800/50">
              {t('day_type_work')} ({status.workHours} {t('hours_short')})
            </span>
          )}

          {status.isHoliday && (
            <span className="px-2.5 py-1 rounded-lg text-[11.5px] font-bold bg-[#FEF2F2] dark:bg-rose-950/40 text-[#B91C1C] dark:text-rose-300">
              {t('legend_holiday')}
            </span>
          )}

          {status.isShortened && (
            <span className="px-2.5 py-1 rounded-lg text-[11.5px] font-bold bg-[#FFFBEB] dark:bg-amber-950/40 text-[#D97706] dark:text-amber-400 border border-[#FEF3C7] dark:border-amber-800/50">
              {t('day_type_shortened')}
            </span>
          )}

          {status.isTransferred && (
            <span className="px-2.5 py-1 rounded-lg text-[11.5px] font-bold bg-[#FFFBEB] dark:bg-amber-950/40 text-[#D97706] dark:text-amber-400 border border-[#FEF3C7] dark:border-amber-800/50">
              {t('day_type_transferred')}
            </span>
          )}
        </div>

        {/* Holiday Details */}
        {status.holiday && (
          <div className="p-3.5 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A]/70 border border-[#E2E8F0] dark:border-[#232E42]">
            <div className="flex items-center gap-1.5 text-[13px] font-bold text-[#0F172A] dark:text-slate-100 mb-1">
              <Info className="w-3.5 h-3.5 text-[#1A73E8] dark:text-blue-400" />
              <span>{getHolidayTitle(status.holiday)}</span>
            </div>
            {status.holiday.note && (
              <p className="text-[12px] text-[#64748B] dark:text-slate-400 leading-relaxed">
                {status.holiday.note}
              </p>
            )}
          </div>
        )}

        {/* Calendar Metadata */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A]/70 border border-[#F1F5F9] dark:border-[#232E42]">
            <span className="text-[11px] text-[#94A3B8] dark:text-slate-400 block">{t('iso_week_label')}</span>
            <span className="font-bold text-[#0F172A] dark:text-slate-100 text-[13.5px]">
              {isoWeek}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A]/70 border border-[#F1F5F9] dark:border-[#232E42]">
            <span className="text-[11px] text-[#94A3B8] dark:text-slate-400 block">{t('day_of_year_label')}</span>
            <span className="font-bold text-[#0F172A] dark:text-slate-100 text-[13.5px]">
              {dayOfYear}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="pt-2 flex items-center gap-2.5">
          <button
            onClick={handleCopy}
            className="flex-1 py-2.5 px-3 border border-[#E2E8F0] dark:border-[#232E42] hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B] rounded-xl text-[12.5px] font-bold text-[#475569] dark:text-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-[#10B981]" /> : <Copy className="w-4 h-4" />}
            {copied ? t('copied_label') : t('btn_copy_date')}
          </button>

          <button
            onClick={() => {
              onSetAsCalculatorDate(dateDMY);
              onClose();
            }}
            className="flex-1 py-2.5 px-3 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-xl text-[12.5px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <span>{t('btn_use_in_calculator')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
