import React, { useState, useEffect } from 'react';
import { Search, X, Calculator, Sparkles, FileDown, ArrowRight } from 'lucide-react';
import { CountryCode } from '../types/calendar';
import { getHolidaysForYear } from '../data/holidays';
import { parseDate } from '../utils/calendarCalculations';
import { useTranslation } from '../i18n/LanguageContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: any) => void;
  onSelectDate: (d: Date) => void;
  onOpenPdfModal: () => void;
  country: CountryCode;
  year: number;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onSelectDate,
  onOpenPdfModal,
  country,
  year,
}) => {
  const { t, getHolidayTitle } = useTranslation();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          setQuery('');
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const holidays = getHolidaysForYear(country, year);

  const tools = [
    { id: 'calendar', title: t('tab_calendar'), desc: t('hero_subtitle') },
    { id: 'work_days', title: t('tab_work_days'), desc: t('wd_subtitle') },
    { id: 'add_days', title: t('tab_add_days'), desc: t('ad_subtitle') },
    { id: 'deadline', title: t('tab_deadline'), desc: t('dl_subtitle') },
    { id: 'holidays', title: t('tab_holidays'), desc: t('hc_subtitle') },
    { id: 'weeks', title: t('tab_weeks'), desc: t('wq_subtitle') },
    { id: 'work_hours', title: t('tab_work_hours'), desc: t('wh_subtitle') },
    { id: 'date_diff', title: t('tab_date_diff'), desc: t('dd_subtitle') },
  ];

  const filteredTools = tools.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.desc.toLowerCase().includes(query.toLowerCase())
  );

  const filteredHolidays = holidays.filter((h) => {
    const title = getHolidayTitle(h);
    return title.toLowerCase().includes(query.toLowerCase()) || h.date.includes(query);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 bg-slate-900/60 backdrop-blur-xs p-3 animate-in fade-in duration-150 font-primary">
      <div className="bg-white dark:bg-[#151D2E] rounded-xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-[#232E42] overflow-hidden flex flex-col max-h-[75vh] transition-colors">
        {/* Input Bar */}
        <div className="flex items-center px-3.5 border-b border-slate-100 dark:border-[#232E42]">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('search_placeholder')}
            className="w-full px-3 py-3 text-[12.5px] font-primary font-medium text-slate-900 dark:text-slate-100 bg-transparent focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1E293B] transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-2.5 overflow-y-auto space-y-3 text-[11px]">
          {/* Action shortcut: PDF */}
          <div
            onClick={() => {
              onClose();
              onOpenPdfModal();
            }}
            className="p-2 rounded-lg hover:bg-blue-50/80 dark:hover:bg-blue-950/40 flex items-center justify-between cursor-pointer group transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <FileDown className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-primary font-bold text-slate-900 dark:text-slate-100 block group-hover:text-blue-600 dark:group-hover:text-blue-400 text-[11.5px]">
                  {t('btn_export_pdf')}
                </span>
                <span className="font-secondary text-[10px] text-slate-500 dark:text-slate-400">
                  {year} • {t('exp_subtitle')}
                </span>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
          </div>

          {/* Tools */}
          {filteredTools.length > 0 && (
            <div>
              <span className="px-2 font-primary font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[9.5px] block mb-1">
                {t('cp_tools_title')}
              </span>
              <div className="space-y-0.5">
                {filteredTools.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      onClose();
                    }}
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1E293B] flex items-center justify-between cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center">
                        <Calculator className="w-3 h-3" />
                      </div>
                      <div>
                        <span className="font-primary font-semibold text-slate-900 dark:text-slate-100 block group-hover:text-blue-600 dark:group-hover:text-blue-400 text-[11.5px]">
                          {item.title}
                        </span>
                        <span className="font-secondary text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                          {item.desc}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-3 h-3 text-slate-300 dark:text-slate-600 group-hover:text-slate-600 dark:group-hover:text-slate-300 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Holidays */}
          {filteredHolidays.length > 0 && (
            <div>
              <span className="px-2 font-primary font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[9.5px] block mb-1">
                {t('cp_holidays_title')} ({year})
              </span>
              <div className="space-y-0.5">
                {filteredHolidays.slice(0, 6).map((h, i) => (
                  <div
                    key={`${h.date}-${i}`}
                    onClick={() => {
                      onSelectDate(parseDate(h.date));
                      onClose();
                    }}
                    className="p-2 rounded-lg hover:bg-rose-50/60 dark:hover:bg-rose-950/30 flex items-center justify-between cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-md bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                        <Sparkles className="w-3 h-3" />
                      </div>
                      <div>
                        <span className="font-primary font-semibold text-slate-900 dark:text-slate-100 block group-hover:text-rose-700 dark:group-hover:text-rose-400 text-[11.5px]">
                          {getHolidayTitle(h)}
                        </span>
                        <span className="font-secondary text-[10px] text-slate-500 dark:text-slate-400">
                          {h.date} {h.isDayOff ? `• ${t('legend_holiday')}` : `• ${t('legend_work')}`}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-slate-600 dark:group-hover:text-slate-300 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredTools.length === 0 && filteredHolidays.length === 0 && (
            <div className="py-6 text-center text-slate-400">
              <p className="text-[12px] font-medium">{t('cp_no_results')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
