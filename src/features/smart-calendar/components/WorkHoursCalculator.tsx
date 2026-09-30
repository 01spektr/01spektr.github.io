import React, { useState } from 'react';
import { Watch, Calculator, FileDown } from 'lucide-react';
import { CountryCode, WorkWeekType } from '../types/calendar';
import { getYearLaborNorms } from '../utils/calendarCalculations';
import { getCountryName } from '../data/holidays';
import { useTranslation } from '../i18n/LanguageContext';

interface WorkHoursCalculatorProps {
  year: number;
  country: CountryCode;
  workWeekType: WorkWeekType;
  onOpenPdfModal: () => void;
}

export const WorkHoursCalculator: React.FC<WorkHoursCalculatorProps> = ({
  year,
  country,
  workWeekType,
  onOpenPdfModal,
}) => {
  const { t, monthNames, language } = useTranslation();
  const [selectedMonth, setSelectedMonth] = useState<number>(8); // September
  const [salary, setSalary] = useState<number>(5000000);
  const [overtimeHours, setOvertimeHours] = useState<number>(4);

  const yearNorms = getYearLaborNorms(year, country, workWeekType);
  const currentMonthNorms = yearNorms.months[selectedMonth];

  // Hourly rate calculation
  const hourlyRate40 = currentMonthNorms.hours40 > 0 ? salary / currentMonthNorms.hours40 : 0;
  const overtimePay = overtimeHours * hourlyRate40 * 1.5;
  const totalPay = salary + overtimePay;

  return (
    <div className="bg-white dark:bg-[#151D2E] border border-[#E2E8F0] dark:border-[#232E42] rounded-xl p-4 sm:p-5 shadow-xs space-y-4 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F1F5F9] dark:border-[#232E42]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] dark:bg-blue-950/60 text-[#0066FF] dark:text-blue-400 flex items-center justify-center">
            <Watch className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="font-primary text-[15px] sm:text-[16px] font-bold text-[#0F172A] dark:text-slate-100">
              {t('wh_title')} ({year})
            </h2>
            <p className="font-secondary text-[11px] text-[#64748B] dark:text-slate-400 mt-0.5">
              {getCountryName(country, language)}, ISO-8601
            </p>
          </div>
        </div>

        <button
          onClick={onOpenPdfModal}
          className="px-3 py-1.5 bg-[#EFF6FF] dark:bg-blue-950/50 text-[#0066FF] dark:text-blue-400 hover:bg-[#DBEAFE] dark:hover:bg-blue-900/60 rounded-lg font-primary text-[11px] font-semibold transition-colors flex items-center gap-1.5 self-start cursor-pointer border border-[#BFDBFE] dark:border-blue-900/60"
        >
          <FileDown className="w-3.5 h-3.5" />
          {t('exp_btn_download_pdf')}
        </button>
      </div>

      {/* Monthly Interactive Norms Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left font-secondary text-[11px]">
          <thead>
            <tr className="bg-[#F8FAFC] dark:bg-[#1E293B]/70 text-[#475569] dark:text-slate-300 font-primary font-bold border-b border-[#E2E8F0] dark:border-[#232E42] text-[10.5px]">
              <th className="py-2 px-2.5">{t('wh_period')}</th>
              <th className="py-2 px-2.5 text-center">{t('wh_col_calendar')}</th>
              <th className="py-2 px-2.5 text-center">{t('wh_col_work')}</th>
              <th className="py-2 px-2.5 text-center">{t('wh_col_off')}</th>
              <th className="py-2 px-2.5 text-right">{t('wh_col_h40')}</th>
              <th className="py-2 px-2.5 text-right">{t('wh_col_h36')}</th>
              <th className="py-2 px-2.5 text-right">{t('wh_col_h24')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9] dark:divide-[#232E42]">
            {yearNorms.months.map((m) => {
              const isSelected = m.month === selectedMonth;
              return (
                <tr
                  key={m.month}
                  onClick={() => setSelectedMonth(m.month)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-[#EFF6FF] dark:bg-blue-950/40 font-semibold text-[#0066FF] dark:text-blue-400'
                      : 'hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B]/50 text-[#0F172A] dark:text-slate-200'
                  }`}
                >
                  <td className="py-1.5 px-2.5 flex items-center gap-1.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? 'bg-[#0066FF]' : 'bg-transparent'
                      }`}
                    />
                    <span className="font-primary font-medium">{monthNames[m.month]}</span>
                  </td>
                  <td className="py-1.5 px-2.5 text-center tabular-nums">{m.calendarDays}</td>
                  <td className="py-1.5 px-2.5 text-center tabular-nums font-primary font-bold text-[#065F46] dark:text-emerald-400">
                    {m.workDays}
                  </td>
                  <td className="py-1.5 px-2.5 text-center tabular-nums text-[#64748B] dark:text-slate-400">
                    {m.weekendDays + m.holidayDays}
                  </td>
                  <td className="py-1.5 px-2.5 text-right tabular-nums font-primary font-semibold">
                    {m.hours40} {t('hours_short')}
                  </td>
                  <td className="py-1.5 px-2.5 text-right tabular-nums font-primary text-[#64748B] dark:text-slate-400">
                    {m.hours36} {t('hours_short')}
                  </td>
                  <td className="py-1.5 px-2.5 text-right tabular-nums font-primary text-[#94A3B8] dark:text-slate-500">
                    {m.hours24} {t('hours_short')}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-[#F8FAFC] dark:bg-[#1E293B]/70 font-primary font-bold text-[#0F172A] dark:text-slate-100 border-t-2 border-[#CBD5E1] dark:border-[#334155] text-[11px]">
              <td className="py-2 px-2.5">{t('wh_total_year')}</td>
              <td className="py-2 px-2.5 text-center tabular-nums">{yearNorms.totalCalendarDays}</td>
              <td className="py-2 px-2.5 text-center tabular-nums text-[#065F46] dark:text-emerald-400">
                {yearNorms.totalWorkDays}
              </td>
              <td className="py-2 px-2.5 text-center tabular-nums text-[#64748B] dark:text-slate-400">
                {yearNorms.totalWeekendDays + yearNorms.totalHolidays}
              </td>
              <td className="py-2 px-2.5 text-right tabular-nums font-primary text-[#0066FF] dark:text-blue-400">
                {yearNorms.totalHours40} {t('hours_short')}
              </td>
              <td className="py-2 px-2.5 text-right tabular-nums font-primary">
                {yearNorms.totalHours36} {t('hours_short')}
              </td>
              <td className="py-2 px-2.5 text-right tabular-nums font-primary text-[#64748B] dark:text-slate-400">
                {Math.round(yearNorms.totalWorkDays * 4.8)} {t('hours_short')}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Salary & Overtime Rate Calculator for Selected Month */}
      <div className="bg-[#F8FAFC] dark:bg-[#0F172A]/70 border border-[#E2E8F0] dark:border-[#232E42] rounded-xl p-3.5 sm:p-4">
        <div className="flex items-center gap-1.5 mb-2.5 text-[#0F172A] dark:text-slate-100 font-primary font-bold text-[12px]">
          <Calculator className="w-3.5 h-3.5 text-[#0066FF] dark:text-blue-400" />
          <span>
            {monthNames[selectedMonth]} {year}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block font-primary text-[10.5px] font-medium text-[#475569] dark:text-slate-300 mb-1">
              {t('wd_work_hours')}
            </label>
            <input
              type="number"
              step="100000"
              value={salary}
              onChange={(e) => setSalary(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full bg-white dark:bg-[#151D2E] border border-[#E2E8F0] dark:border-[#232E42] rounded-lg px-2.5 py-1.5 font-primary text-[11.5px] text-[#0F172A] dark:text-slate-100 focus:outline-none focus:ring-1.5 focus:ring-[#0066FF]/20 tabular-nums"
            />
          </div>

          <div>
            <label className="block font-primary text-[10.5px] font-medium text-[#475569] dark:text-slate-300 mb-1">
              {t('hours_count')}
            </label>
            <input
              type="number"
              min="0"
              max="200"
              value={overtimeHours}
              onChange={(e) => setOvertimeHours(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full bg-white dark:bg-[#151D2E] border border-[#E2E8F0] dark:border-[#232E42] rounded-lg px-2.5 py-1.5 font-primary text-[11.5px] text-[#0F172A] dark:text-slate-100 focus:outline-none focus:ring-1.5 focus:ring-[#0066FF]/20 tabular-nums"
            />
          </div>

          <div className="bg-white dark:bg-[#151D2E] border border-[#E2E8F0] dark:border-[#232E42] rounded-lg p-2.5 flex flex-col justify-between">
            <div className="font-secondary text-[10px] text-[#64748B] dark:text-slate-400">
              1 {t('hours_short')} (40):
              <span className="font-primary font-bold text-[#0F172A] dark:text-slate-100 ml-1 block text-[13px] tabular-nums mt-0.5">
                {Math.round(hourlyRate40).toLocaleString()}
              </span>
            </div>
            <div className="font-secondary text-[10px] text-[#64748B] dark:text-slate-400 pt-1.5 border-t border-[#F1F5F9] dark:border-[#232E42] mt-1.5">
              {t('calc_result_title')}:
              <span className="font-primary font-bold text-[#0066FF] dark:text-blue-400 block text-[14px] tabular-nums mt-0.5">
                {Math.round(totalPay).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
