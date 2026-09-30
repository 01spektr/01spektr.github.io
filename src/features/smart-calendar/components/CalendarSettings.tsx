import React, { useState, useRef, useEffect } from 'react';
import {
  Settings,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  FileDown,
  Check,
} from 'lucide-react';
import { CountryCode, WorkWeekType } from '../types/calendar';
import { COUNTRIES, getCountryName } from '../data/holidays';
import { CountryFlag } from './CountryFlag';
import { useTranslation } from '../i18n/LanguageContext';

interface CalendarSettingsProps {
  country: CountryCode;
  onChangeCountry: (country: CountryCode) => void;
  year: number;
  onChangeYear: (year: number) => void;
  workWeekType: WorkWeekType;
  onChangeWorkWeekType: (type: WorkWeekType) => void;
  firstDayOfWeek?: 0 | 1;
  onChangeFirstDayOfWeek?: (val: 0 | 1) => void;
  showHolidays: boolean;
  onToggleShowHolidays: (val: boolean) => void;
  showTransferred: boolean;
  onToggleShowTransferred: (val: boolean) => void;
  showIsoWeeks: boolean;
  onToggleShowIsoWeeks: (val: boolean) => void;
  onReset: () => void;
  onOpenPdfModal: () => void;
}

export const CalendarSettings: React.FC<CalendarSettingsProps> = ({
  country,
  onChangeCountry,
  year,
  onChangeYear,
  workWeekType,
  onChangeWorkWeekType,
  showHolidays,
  onToggleShowHolidays,
  showTransferred,
  onToggleShowTransferred,
  showIsoWeeks,
  onToggleShowIsoWeeks,
  onReset,
  onOpenPdfModal,
}) => {
  const { t, language } = useTranslation();
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      return false;
    }
    return true;
  });
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  const currentCountry = COUNTRIES.find((c) => c.code === country) || COUNTRIES[0];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(e.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
    };
    if (isCountryDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCountryDropdownOpen]);

  return (
    <div className="bg-white dark:bg-[#151D2E] border border-[#E2E8F0] dark:border-[#232E42] rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between transition-colors">
      <div>
        {/* Card Header matching reference: settings title & collapse */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-[#F1F5F9] dark:border-[#232E42] cursor-pointer group select-none"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-[#EFF6FF] dark:bg-[#1E3A8A]/40 border border-[#BFDBFE]/60 dark:border-[#1E3A8A] text-[#0066FF] dark:text-[#38BDF8] flex items-center justify-center">
              <Settings className="w-3.5 h-3.5 stroke-[2.2]" />
            </div>
            <h2 className="font-primary text-[14.5px] font-bold text-[#1E3A8A] dark:text-[#93C5FD]">
              {t('settings_title')}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {!isOpen && (
              <span className="text-[11px] font-secondary text-[#64748B] dark:text-[#94A3B8] hidden sm:inline">
                {getCountryName(currentCountry.code, language)} · {year}
              </span>
            )}
            <button
              type="button"
              aria-label={isOpen ? 'Collapse settings' : 'Expand settings'}
              className="text-[#0066FF] dark:text-[#38BDF8] hover:text-blue-700 dark:hover:text-blue-300 p-1 rounded-lg transition-colors"
            >
              {isOpen ? <ChevronUp className="w-4 h-4 stroke-[2.2]" /> : <ChevronDown className="w-4 h-4 stroke-[2.2]" />}
            </button>
          </div>
        </div>

        {/* Collapsed mobile summary bar */}
        {!isOpen && (
          <div className="flex items-center justify-between py-1 text-[11.5px] text-[#475569] dark:text-[#CBD5E1]">
            <div className="flex items-center gap-2 min-w-0">
              <CountryFlag country={currentCountry.code} className="w-4 h-3 rounded-xs shrink-0" />
              <span className="font-medium truncate">{getCountryName(currentCountry.code, language)}</span>
              <span className="text-slate-300 dark:text-slate-600">·</span>
              <span className="font-bold text-[#0066FF] dark:text-[#38BDF8] tabular-nums">{year}</span>
              <span className="text-slate-300 dark:text-slate-600">·</span>
              <span className="truncate text-[10.5px] text-[#64748B] dark:text-[#94A3B8]">
                {workWeekType === '5_DAYS' ? '5-day' : workWeekType === '6_DAYS' ? '6-day' : '4-day'}
              </span>
            </div>
            <span className="text-[#0066FF] dark:text-[#38BDF8] font-semibold text-[11px] shrink-0 ml-2">
              {t('change_settings')}
            </span>
          </div>
        )}

        {isOpen && (
          <div className="flex flex-col gap-3.5 sm:gap-4">
            {/* Country Selector */}
            <div className="flex items-center justify-between">
              <span className="font-primary text-[12.5px] text-[#334155] dark:text-[#CBD5E1] font-medium">
                {t('country_label').split('/')[0].trim()}
              </span>
              <div className="relative w-[155px]" ref={countryDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                  className="w-full bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] hover:border-[#CBD5E1] dark:hover:border-[#475569] rounded-xl px-2.5 h-[34px] font-primary text-[12px] text-[#1E293B] dark:text-white flex items-center justify-between gap-1.5 transition-all cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <CountryFlag country={currentCountry.code} className="w-5 h-3.5" />
                    <span className="truncate">{getCountryName(currentCountry.code, language)}</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#0066FF] dark:text-[#38BDF8] shrink-0" />
                </button>

                {/* Dropdown list */}
                {isCountryDropdownOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-[210px] max-w-[calc(100vw-36px)] bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-xl shadow-lg z-50 py-1 max-h-[260px] overflow-y-auto">
                    {COUNTRIES.map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => {
                          onChangeCountry(c.code);
                          setIsCountryDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left text-[12px] flex items-center justify-between hover:bg-slate-50 dark:hover:bg-[#28354D] transition-colors cursor-pointer ${
                          c.code === country
                            ? 'bg-[#EFF6FF] dark:bg-[#1E3A8A]/40 text-[#0066FF] dark:text-[#38BDF8] font-semibold'
                            : 'text-[#1E293B] dark:text-[#E2E8F0]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <CountryFlag country={c.code} className="w-5 h-3.5" />
                          <span className="truncate">{getCountryName(c.code, language)}</span>
                        </div>
                        {c.code === country && <Check className="w-3.5 h-3.5 text-[#0066FF] dark:text-[#38BDF8] shrink-0" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Year Stepper */}
            <div className="flex items-center justify-between">
              <span className="font-primary text-[12.5px] text-[#334155] dark:text-[#CBD5E1] font-medium">
                {t('year_label')}
              </span>
              <div className="flex items-center justify-between w-[155px] h-[34px] rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] px-1.5 shadow-2xs">
                <button
                  type="button"
                  onClick={() => onChangeYear(year - 1)}
                  className="w-6 h-6 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-[#0066FF] dark:text-[#38BDF8] transition-colors cursor-pointer"
                  title="Previous year"
                >
                  <ChevronLeft className="w-3.5 h-3.5 stroke-[2.2]" />
                </button>
                <span className="font-primary font-bold text-[#1E293B] dark:text-white text-[13px] select-none">
                  {year}
                </span>
                <button
                  type="button"
                  onClick={() => onChangeYear(year + 1)}
                  className="w-6 h-6 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-[#0066FF] dark:text-[#38BDF8] transition-colors cursor-pointer"
                  title="Next year"
                >
                  <ChevronRight className="w-3.5 h-3.5 stroke-[2.2]" />
                </button>
              </div>
            </div>

            {/* Work Week Dropdown */}
            <div className="flex items-center justify-between">
              <span className="font-primary text-[12.5px] text-[#334155] dark:text-[#CBD5E1] font-medium">
                {t('schedule_label')}
              </span>
              <div className="relative w-[155px]">
                <select
                  value={workWeekType}
                  onChange={(e) => onChangeWorkWeekType(e.target.value as WorkWeekType)}
                  className="w-full bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] hover:border-[#CBD5E1] dark:hover:border-[#475569] rounded-xl px-2.5 h-[34px] font-primary text-[11.5px] text-[#1E293B] dark:text-white appearance-none focus:outline-none focus:ring-1 focus:ring-[#0066FF] transition-all cursor-pointer pr-7 shadow-2xs"
                >
                  <option value="5_DAYS" className="dark:bg-[#1E293B]">{t('schedule_5_days')}</option>
                  <option value="6_DAYS" className="dark:bg-[#1E293B]">{t('schedule_6_days')}</option>
                  <option value="4_DAYS" className="dark:bg-[#1E293B]">{t('schedule_4_days')}</option>
                  <option value="5_DAYS_SUN_THU" className="dark:bg-[#1E293B]">{t('schedule_5_days_sun')}</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#0066FF] dark:text-[#38BDF8] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Toggles */}
            <div className="pt-3.5 flex flex-col gap-3.5 sm:gap-4 border-t border-[#F1F5F9] dark:border-[#232E42]">
              {/* Show holidays */}
              <div className="flex items-center justify-between">
                <span className="font-primary text-[12px] text-[#334155] dark:text-[#CBD5E1]">
                  {t('toggle_holidays')}
                </span>
                <button
                  type="button"
                  onClick={() => onToggleShowHolidays(!showHolidays)}
                  className={`w-[36px] h-[20px] flex items-center rounded-full p-[2px] transition-colors duration-200 cursor-pointer ${
                    showHolidays ? 'bg-[#0066FF]' : 'bg-[#CBD5E1] dark:bg-[#475569]'
                  }`}
                >
                  <div
                    className={`bg-white w-[16px] h-[16px] rounded-full shadow-2xs transform transition-transform duration-200 ${
                      showHolidays ? 'translate-x-[16px]' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Show transferred days */}
              <div className="flex items-center justify-between">
                <span className="font-primary text-[12px] text-[#334155] dark:text-[#CBD5E1]">
                  {t('toggle_transfers')}
                </span>
                <button
                  type="button"
                  onClick={() => onToggleShowTransferred(!showTransferred)}
                  className={`w-[36px] h-[20px] flex items-center rounded-full p-[2px] transition-colors duration-200 cursor-pointer ${
                    showTransferred ? 'bg-[#0066FF]' : 'bg-[#CBD5E1] dark:bg-[#475569]'
                  }`}
                >
                  <div
                    className={`bg-white w-[16px] h-[16px] rounded-full shadow-2xs transform transition-transform duration-200 ${
                      showTransferred ? 'translate-x-[16px]' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Show ISO week numbers */}
              <div className="flex items-center justify-between">
                <span className="font-primary text-[12px] text-[#334155] dark:text-[#CBD5E1]">
                  {t('toggle_iso_weeks')}
                </span>
                <button
                  type="button"
                  onClick={() => onToggleShowIsoWeeks(!showIsoWeeks)}
                  className={`w-[36px] h-[20px] flex items-center rounded-full p-[2px] transition-colors duration-200 cursor-pointer ${
                    showIsoWeeks ? 'bg-[#0066FF]' : 'bg-[#CBD5E1] dark:bg-[#475569]'
                  }`}
                >
                  <div
                    className={`bg-white w-[16px] h-[16px] rounded-full shadow-2xs transform transition-transform duration-200 ${
                      showIsoWeeks ? 'translate-x-[16px]' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action buttons pinned at bottom */}
      <div className="pt-3 mt-auto flex flex-col gap-1.5 border-t border-[#F1F5F9] dark:border-[#232E42]">
        <button
          onClick={onReset}
          className="w-full h-[36px] rounded-xl border border-[#DBEAFE] dark:border-[#1E3A8A] bg-white dark:bg-[#1E293B] hover:bg-[#F8FAFC] dark:hover:bg-[#28354D] text-[12px] font-primary font-medium text-[#1E3A8A] dark:text-[#93C5FD] flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#1E3A8A] dark:text-[#93C5FD]" />
          {t('btn_reset_settings')}
        </button>

        <button
          onClick={onOpenPdfModal}
          className="w-full h-[32px] rounded-xl bg-[#EFF6FF] dark:bg-[#1E3A8A]/40 hover:bg-[#DBEAFE] dark:hover:bg-[#1E3A8A]/60 text-[#0066FF] dark:text-[#38BDF8] text-[11px] font-primary font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[#BFDBFE] dark:border-[#1E3A8A]"
        >
          <FileDown className="w-3.5 h-3.5" />
          {t('btn_export_pdf')}
        </button>
      </div>
    </div>
  );
};
