import React, { useState, useEffect } from 'react';
import {
  X,
  FileDown,
  Printer,
  Calendar,
  Sparkles,
  Loader2,
  Check,
  Copy,
  Table,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Eye,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from 'lucide-react';
import { CountryCode, WorkWeekType } from '../types/calendar';
import { MONTH_NAMES_RU, WEEKDAYS_SHORT, getCountryName, getHolidaysForYear } from '../data/holidays';
import {
  getMonthLaborNorms,
  getYearLaborNorms,
  getMonthCalendarDays,
} from '../utils/calendarCalculations';
import {
  exportHtmlElementToPdf,
  copyTableToClipboard,
  downloadCsvFile,
} from '../utils/pdfExport';
import { generatePdfViaCanvas } from '../utils/canvasReportGenerator';
import { useTranslation } from '../i18n/LanguageContext';

interface PdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  year: number;
  month: number;
  country: CountryCode;
  workWeekType: WorkWeekType;
  calculations?: any;
  initialReportType?: 'month' | 'year' | 'calculations';
}

type ReportType = 'month' | 'year' | 'calculations';

export const PdfExportModal: React.FC<PdfExportModalProps> = ({
  isOpen,
  onClose,
  year: initialYear,
  month: initialMonth,
  country,
  workWeekType: initialWorkWeekType,
  calculations,
  initialReportType = 'year',
}) => {
  const { language, t, monthNames } = useTranslation();
  const [reportType, setReportType] = useState<ReportType>(initialReportType);
  const [selectedYear, setSelectedYear] = useState<number>(initialYear);
  const [selectedMonth, setSelectedMonth] = useState<number>(initialMonth);
  const [workWeekType, setWorkWeekType] = useState<WorkWeekType>(initialWorkWeekType);
  const [includeExtendedNorms, setIncludeExtendedNorms] = useState<boolean>(true);
  const [includeHolidaysList, setIncludeHolidaysList] = useState<boolean>(true);
  const [includeSignatures, setIncludeSignatures] = useState<boolean>(true);

  // Mobile view switcher: 'preview' (default: document view is hero) or 'settings'
  const [mobileTab, setMobileTab] = useState<'preview' | 'settings'>('preview');
  // Zoom scale for preview sheet (100% default, min 75%, max 125%)
  const [zoomScale, setZoomScale] = useState<number>(100);

  useEffect(() => {
    if (isOpen) {
      if (initialReportType) {
        setReportType(initialReportType);
      }
      setSelectedYear(initialYear);
      setSelectedMonth(initialMonth);
      setWorkWeekType(initialWorkWeekType);
      setMobileTab('preview');
      setZoomScale(100);
    }
  }, [isOpen, initialReportType, initialYear, initialMonth, initialWorkWeekType]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const countryName = getCountryName(country, language);

  const monthNorms = getMonthLaborNorms(selectedYear, selectedMonth, country, workWeekType);
  const yearNorms = getYearLaborNorms(selectedYear, country, workWeekType);
  const holidays = getHolidaysForYear(country, selectedYear);
  const monthHolidays = holidays.filter((h) => {
    const d = new Date(h.date);
    return d.getFullYear() === selectedYear && d.getMonth() === selectedMonth;
  });

  const monthCalendarDays = getMonthCalendarDays(
    selectedYear,
    selectedMonth,
    country,
    workWeekType,
    new Date(selectedYear, selectedMonth, 1),
    1
  );

  const workWeekLabel =
    workWeekType === '5_DAYS'
      ? '5-дневная рабочая неделя (40 ч/нед)'
      : workWeekType === '6_DAYS'
      ? '6-дневная рабочая неделя (40 ч/нед)'
      : workWeekType === '4_DAYS'
      ? '4-дневная рабочая неделя (32 ч/нед)'
      : '5-дневная неделя (Вс-Чт, 40 ч/нед)';

  const currentDateFormatted = new Date().toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Handle PDF Download
  const handleDownloadPdf = async () => {
    setIsGenerating(true);
    setErrorMessage(null);

    const monthSlug = [
      'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
      'Iyul', 'Avgust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'
    ][selectedMonth];

    const fileName =
      reportType === 'month'
        ? `Toolboxi_Kalendar_${monthSlug}_${selectedYear}`
        : reportType === 'year'
        ? `Toolboxi_Normy_Vremeni_${selectedYear}`
        : `Toolboxi_Svodny_Otchet_${selectedYear}`;

    try {
      // Primary: bulletproof Canvas 2D engine (no CORS, no Tailwind oklch crashes)
      const ok = await generatePdfViaCanvas({
        reportType,
        year: selectedYear,
        month: selectedMonth,
        country,
        countryName,
        workWeekType,
        monthNorms,
        yearNorms,
        holidays,
        monthCalendarDays,
        includeExtendedNorms,
        includeHolidaysList,
        includeSignatures,
        calculations,
        language,
      });

      if (ok) {
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 3000);
      } else {
        // Fallback: sanitized HTML element export
        const fallbackOk = await exportHtmlElementToPdf('printable-report-sheet', fileName);
        if (fallbackOk) {
          setDownloadSuccess(true);
          setTimeout(() => setDownloadSuccess(false), 3000);
        } else {
          setErrorMessage('Браузер ограничил прямое скачивание. Попробуйте нажать «Скопировать для Excel» или используйте «Печать».');
          setTimeout(() => setErrorMessage(null), 5000);
        }
      }
    } catch (err: any) {
      console.error('Error generating PDF report:', err);
      try {
        const fallbackOk = await exportHtmlElementToPdf('printable-report-sheet', fileName);
        if (fallbackOk) {
          setDownloadSuccess(true);
          setTimeout(() => setDownloadSuccess(false), 3000);
        } else {
          setErrorMessage('Не удалось скачать файл. Воспользуйтесь кнопкой «Печать» или «Скопировать для Excel».');
        }
      } catch (fErr) {
        console.error('Fallback export error:', fErr);
        setErrorMessage('Ошибка формирования PDF. Используйте кнопку «Скопировать для Excel» или сделайте снимок экрана.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle Print with safe sandbox iframe fallback
  const handlePrint = () => {
    try {
      window.print();
    } catch (e) {
      console.warn('Direct print blocked by sandbox iframe, downloading PDF instead:', e);
      handleDownloadPdf();
    }
  };

  // Build table data array for Excel copy and CSV
  const getTableData = (): (string | number)[][] => {
    if (reportType === 'year') {
      const headers = [
        'Период',
        'Календарных дней',
        'Рабочих дней',
        'Выходных и праздничных',
        'Норма 40ч (час)',
      ];
      if (includeExtendedNorms) {
        headers.push('Норма 36ч (час)', 'Норма 24ч (час)');
      }

      const rows: (string | number)[][] = [headers];

      yearNorms.months.forEach((m, idx) => {
        const row: (string | number)[] = [
          MONTH_NAMES_RU[m.month],
          m.calendarDays,
          m.workDays,
          m.weekendDays + m.holidayDays,
          m.hours40,
        ];
        if (includeExtendedNorms) {
          row.push(m.hours36, m.hours24);
        }
        rows.push(row);

        if (idx === 2 || idx === 5 || idx === 8 || idx === 11) {
          const qIdx = Math.floor(idx / 3);
          const q = yearNorms.quarters[qIdx];
          const qRow: (string | number)[] = [
            `ИТОГО ${q.quarter} КВАРТАЛ`,
            q.calendarDays,
            q.workDays,
            q.weekendDays,
            q.hours40,
          ];
          if (includeExtendedNorms) {
            qRow.push(q.hours36, q.hours24);
          }
          rows.push(qRow);

          if (idx === 5) {
            const h1Days = yearNorms.quarters[0].calendarDays + yearNorms.quarters[1].calendarDays;
            const h1Work = yearNorms.quarters[0].workDays + yearNorms.quarters[1].workDays;
            const h1Off = yearNorms.quarters[0].weekendDays + yearNorms.quarters[1].weekendDays;
            const h1H40 = yearNorms.quarters[0].hours40 + yearNorms.quarters[1].hours40;
            const h1H36 = yearNorms.quarters[0].hours36 + yearNorms.quarters[1].hours36;
            const h1H24 = yearNorms.quarters[0].hours24 + yearNorms.quarters[1].hours24;
            const h1Row = ['ИТОГО I ПОЛУГОДИЕ', h1Days, h1Work, h1Off, h1H40];
            if (includeExtendedNorms) h1Row.push(h1H36, h1H24);
            rows.push(h1Row);
          }
        }
      });

      // Annual total
      const totalRow: (string | number)[] = [
        `ИТОГО ЗА ${selectedYear} ГОД`,
        yearNorms.totalCalendarDays,
        yearNorms.totalWorkDays,
        yearNorms.totalWeekendDays + yearNorms.totalHolidays,
        yearNorms.totalHours40,
      ];
      if (includeExtendedNorms) {
        totalRow.push(yearNorms.totalHours36, yearNorms.totalHours24);
      }
      rows.push(totalRow);

      return rows;
    } else {
      const headers = ['Показатель', 'Значение'];
      return [
        headers,
        ['Месяц и год', `${MONTH_NAMES_RU[selectedMonth]} ${selectedYear}`],
        ['Календарных дней', monthNorms.calendarDays],
        ['Рабочих дней', monthNorms.workDays],
        ['Выходных и праздничных', monthNorms.weekendDays + monthNorms.holidayDays],
        ['Норма 40ч (час)', monthNorms.hours40],
        ['Норма 36ч (час)', monthNorms.hours36],
        ['Норма 24ч (час)', monthNorms.hours24],
        ['Сокращённых предпраздничных дней', monthNorms.shortenedDays],
      ];
    }
  };

  const handleCopyExcel = async () => {
    const data = getTableData();
    const ok = await copyTableToClipboard(data);
    if (ok) {
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 2500);
    }
  };

  const handleDownloadCsv = () => {
    const data = getTableData();
    const fileName =
      reportType === 'month'
        ? `Toolboxi_Normy_${MONTH_NAMES_RU[selectedMonth]}_${selectedYear}`
        : `Toolboxi_Normy_Goda_${selectedYear}`;
    downloadCsvFile(fileName, data);
  };

  // Safe fallback calculation info for calculations report
  const safeWorkDaysCalc = calculations?.workDays || {
    startDateStr: `01.01.${selectedYear}`,
    endDateStr: `31.12.${selectedYear}`,
    calendarDays: yearNorms.totalCalendarDays,
    workDays: yearNorms.totalWorkDays,
    weekendDays: yearNorms.totalWeekendDays,
    holidayDays: yearNorms.totalHolidays,
    workHours: yearNorms.totalHours40,
  };

  const safeDeadlineCalc = calculations?.deadline || {
    formattedDateRu: `${monthNorms.workDays} рабочих дней`,
    dayOfWeekName: 'Рабочий день',
    durationCount: 30,
    bufferCount: 3,
    totalDays: 33,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-0 sm:p-4 overflow-hidden no-print animate-in fade-in duration-150 font-primary">
      <div className="bg-white dark:bg-[#151D2E] rounded-none sm:rounded-3xl max-w-5xl w-full h-[100dvh] sm:h-auto sm:max-h-[94vh] shadow-2xl border-0 sm:border border-[#CBD5E1] dark:border-[#232E42] flex flex-col overflow-hidden transition-colors">
        
        {/* ========================================================
            MODAL TOP HEADER
        ======================================================== */}
        <div className="flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3.5 border-b border-[#F1F5F9] dark:border-[#232E42] shrink-0 bg-white dark:bg-[#151D2E]">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#0066FF] text-white flex items-center justify-center shadow-xs shrink-0">
              <FileDown className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <h2 className="font-primary text-[14px] sm:text-[16px] font-bold text-[#0F172A] dark:text-slate-100 truncate">
                {t('exp_title')}
              </h2>
              <p className="font-secondary text-[10px] sm:text-[11.5px] text-[#64748B] dark:text-slate-400 truncate">
                {t('exp_subtitle')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#64748B] dark:text-slate-300 hover:text-[#0F172A] dark:hover:text-slate-100 flex items-center justify-center transition-colors cursor-pointer shrink-0 ml-2"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ========================================================
            SUB-HEADER: REPORT TYPE SELECTOR & QUICK CONTROLS
        ======================================================== */}
        <div className="px-3 sm:px-6 py-2 border-b border-[#F1F5F9] dark:border-[#232E42] bg-[#F8FAFC] dark:bg-[#0B0F19]/80 shrink-0 space-y-2">
          {/* Main 3 Report Types Switcher (Desktop & Mobile Unified) */}
          <div className="grid grid-cols-3 gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => {
                setReportType('month');
                setMobileTab('preview');
              }}
              className={`py-2 px-1.5 sm:py-2.5 sm:px-3 rounded-xl border text-center font-primary text-[11px] sm:text-[12.5px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                reportType === 'month'
                  ? 'border-[#0066FF] bg-[#EFF6FF] dark:bg-blue-950/50 text-[#0066FF] dark:text-[#38BDF8] ring-1 ring-[#0066FF]/30 shadow-xs'
                  : 'border-[#E2E8F0] dark:border-[#232E42] bg-white dark:bg-[#151D2E] text-slate-700 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2] shrink-0" />
              <span className="truncate">{t('exp_tab_month')}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setReportType('year');
                setMobileTab('preview');
              }}
              className={`py-2 px-1.5 sm:py-2.5 sm:px-3 rounded-xl border text-center font-primary text-[11px] sm:text-[12.5px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                reportType === 'year'
                  ? 'border-[#0066FF] bg-[#EFF6FF] dark:bg-blue-950/50 text-[#0066FF] dark:text-[#38BDF8] ring-1 ring-[#0066FF]/30 shadow-xs'
                  : 'border-[#E2E8F0] dark:border-[#232E42] bg-white dark:bg-[#151D2E] text-slate-700 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              <Table className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2] shrink-0" />
              <span className="truncate">{t('exp_tab_year')}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setReportType('calculations');
                setMobileTab('preview');
              }}
              className={`py-2 px-1.5 sm:py-2.5 sm:px-3 rounded-xl border text-center font-primary text-[11px] sm:text-[12.5px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                reportType === 'calculations'
                  ? 'border-[#0066FF] bg-[#EFF6FF] dark:bg-blue-950/50 text-[#0066FF] dark:text-[#38BDF8] ring-1 ring-[#0066FF]/30 shadow-xs'
                  : 'border-[#E2E8F0] dark:border-[#232E42] bg-white dark:bg-[#151D2E] text-slate-700 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2] shrink-0" />
              <span className="truncate">{t('exp_tab_calc')}</span>
            </button>
          </div>

          {/* Secondary Quick Controls Strip */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#E2E8F0]/70 dark:border-[#232E42]/70">
            {/* Year Stepper & Mode */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <div className="flex items-center gap-1 bg-white dark:bg-[#151D2E] px-1.5 py-0.5 rounded-lg border border-[#E2E8F0] dark:border-[#232E42]">
                <button
                  type="button"
                  onClick={() => setSelectedYear((y) => y - 1)}
                  className="w-6 h-6 rounded flex items-center justify-center text-slate-600 hover:text-slate-900 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Предыдущий год"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="font-primary text-[12px] font-bold text-[#0066FF] dark:text-blue-400 tabular-nums px-1">
                  {selectedYear}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedYear((y) => y + 1)}
                  className="w-6 h-6 rounded flex items-center justify-center text-slate-600 hover:text-slate-900 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Следующий год"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Work Week Mode Toggle (Compact) */}
              <div className="flex items-center bg-white dark:bg-[#151D2E] p-0.5 rounded-lg border border-[#E2E8F0] dark:border-[#232E42]">
                <button
                  type="button"
                  onClick={() => setWorkWeekType('5_DAYS')}
                  className={`px-2 py-0.5 rounded text-[10.5px] font-semibold transition-colors ${
                    workWeekType === '5_DAYS'
                      ? 'bg-[#0066FF] text-white shadow-2xs'
                      : 'text-[#64748B] dark:text-slate-400 hover:text-slate-800'
                  }`}
                >
                  5-дн (40ч)
                </button>
                <button
                  type="button"
                  onClick={() => setWorkWeekType('6_DAYS')}
                  className={`px-2 py-0.5 rounded text-[10.5px] font-semibold transition-colors ${
                    workWeekType === '6_DAYS'
                      ? 'bg-[#0066FF] text-white shadow-2xs'
                      : 'text-[#64748B] dark:text-slate-400 hover:text-slate-800'
                  }`}
                >
                  6-дн (40ч)
                </button>
              </div>

              {/* Desktop Quick Checkboxes */}
              <div className="hidden md:flex items-center gap-2.5 ml-2 font-secondary text-[11px] text-[#334155] dark:text-slate-300">
                <label className="flex items-center gap-1 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={includeExtendedNorms}
                    onChange={(e) => setIncludeExtendedNorms(e.target.checked)}
                    className="rounded border-[#CBD5E1] text-[#0066FF] focus:ring-[#0066FF]"
                  />
                  <span>Нормы 36ч/24ч</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={includeHolidaysList}
                    onChange={(e) => setIncludeHolidaysList(e.target.checked)}
                    className="rounded border-[#CBD5E1] text-[#0066FF] focus:ring-[#0066FF]"
                  />
                  <span>Праздники</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={includeSignatures}
                    onChange={(e) => setIncludeSignatures(e.target.checked)}
                    className="rounded border-[#CBD5E1] text-[#0066FF] focus:ring-[#0066FF]"
                  />
                  <span>Подписи (М.П.)</span>
                </label>
              </div>
            </div>

            {/* Mobile View Toggle: [📄 Документ] vs [⚙️ Опции] */}
            <div className="flex md:hidden items-center gap-1">
              <button
                type="button"
                onClick={() => setMobileTab('preview')}
                className={`py-1 px-2 rounded-lg text-[10.5px] font-primary font-bold flex items-center gap-1 transition-all ${
                  mobileTab === 'preview'
                    ? 'bg-[#0066FF] text-white shadow-xs'
                    : 'bg-white dark:bg-[#151D2E] text-slate-600 dark:text-slate-300 border border-[#E2E8F0] dark:border-[#232E42]'
                }`}
              >
                <Eye className="w-3 h-3" />
                <span>Документ</span>
              </button>
              <button
                type="button"
                onClick={() => setMobileTab('settings')}
                className={`py-1 px-2 rounded-lg text-[10.5px] font-primary font-bold flex items-center gap-1 transition-all ${
                  mobileTab === 'settings'
                    ? 'bg-[#0066FF] text-white shadow-xs'
                    : 'bg-white dark:bg-[#151D2E] text-slate-600 dark:text-slate-300 border border-[#E2E8F0] dark:border-[#232E42]'
                }`}
              >
                <SlidersHorizontal className="w-3 h-3" />
                <span>Параметры</span>
              </button>
            </div>
          </div>

          {/* Month Chips (Active when Monthly report is selected) */}
          {reportType === 'month' && (
            <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none pt-0.5">
              <span className="font-primary text-[10.5px] font-bold text-[#475569] dark:text-slate-300 shrink-0 mr-1">
                Месяц:
              </span>
              {monthNames.map((mName, mIdx) => (
                <button
                  key={mIdx}
                  type="button"
                  onClick={() => setSelectedMonth(mIdx)}
                  className={`px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-primary font-medium shrink-0 transition-colors cursor-pointer ${
                    selectedMonth === mIdx
                      ? 'bg-[#0066FF] text-white shadow-2xs font-bold'
                      : 'bg-white dark:bg-[#151D2E] border border-[#E2E8F0] dark:border-[#232E42] text-[#475569] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1E293B]'
                  }`}
                >
                  {mName}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ========================================================
            MAIN MODAL BODY (Single unified scroll container)
        ======================================================== */}
        <div className="flex-1 overflow-y-auto bg-[#F1F5F9] dark:bg-[#0B0F19] p-2 sm:p-5">
          {/* MOBILE SETTINGS VIEW (when tab === 'settings' on mobile) */}
          {mobileTab === 'settings' && (
            <div className="md:hidden max-w-lg mx-auto bg-white dark:bg-[#151D2E] p-4 rounded-2xl border border-[#E2E8F0] dark:border-[#232E42] space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0] dark:border-[#232E42]">
                <h3 className="font-primary font-bold text-[13px] text-[#0F172A] dark:text-slate-100 flex items-center gap-1.5">
                  <SlidersHorizontal className="w-4 h-4 text-[#0066FF]" />
                  Параметры формирования отчёта
                </h3>
                <span className="text-[10px] text-slate-500">Toolboxi.uz</span>
              </div>

              {/* Year Selector */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Календарный год:
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[2024, 2025, 2026, 2027].map((y) => (
                    <button
                      key={y}
                      type="button"
                      onClick={() => setSelectedYear(y)}
                      className={`py-1.5 rounded-lg text-[11px] font-bold transition-colors ${
                        selectedYear === y
                          ? 'bg-[#0066FF] text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-[#1E293B] text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              </div>

              {/* Work Week Mode */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  График рабочей недели:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setWorkWeekType('5_DAYS')}
                    className={`p-2.5 rounded-xl border text-left text-[11px] font-bold transition-colors ${
                      workWeekType === '5_DAYS'
                        ? 'border-[#0066FF] bg-blue-50/60 dark:bg-blue-950/40 text-[#0066FF] dark:text-blue-400'
                        : 'border-slate-200 dark:border-[#232E42] text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    5-дневная неделя
                    <span className="block text-[10px] font-normal text-slate-500 mt-0.5">
                      40 часов / 8ч в день
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setWorkWeekType('6_DAYS')}
                    className={`p-2.5 rounded-xl border text-left text-[11px] font-bold transition-colors ${
                      workWeekType === '6_DAYS'
                        ? 'border-[#0066FF] bg-blue-50/60 dark:bg-blue-950/40 text-[#0066FF] dark:text-blue-400'
                        : 'border-slate-200 dark:border-[#232E42] text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    6-дневная неделя
                    <span className="block text-[10px] font-normal text-slate-500 mt-0.5">
                      40 часов / 7ч в день
                    </span>
                  </button>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-[#232E42]">
                <label className="flex items-center gap-2 text-[11.5px] text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeExtendedNorms}
                    onChange={(e) => setIncludeExtendedNorms(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#0066FF]"
                  />
                  <span>Включать нормы 36ч и 24ч (сокращённые недели)</span>
                </label>

                <label className="flex items-center gap-2 text-[11.5px] text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeHolidaysList}
                    onChange={(e) => setIncludeHolidaysList(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#0066FF]"
                  />
                  <span>Включать официальный список нерабочих праздников</span>
                </label>

                <label className="flex items-center gap-2 text-[11.5px] text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeSignatures}
                    onChange={(e) => setIncludeSignatures(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#0066FF]"
                  />
                  <span>Включать блок визирования (Руководитель, Главбух, М.П.)</span>
                </label>
              </div>

              <button
                type="button"
                onClick={() => setMobileTab('preview')}
                className="w-full py-2.5 rounded-xl bg-[#0066FF] text-white font-primary font-bold text-[12px] flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>Перейти к предпросмотру отчёта</span>
              </button>
            </div>
          )}

          {/* DOCUMENT PREVIEW VIEW (Desktop always, or mobile when mobileTab === 'preview') */}
          {(mobileTab === 'preview' || typeof window === 'undefined') && (
            <div className="flex flex-col items-center">
              {/* Preview Status & Zoom Bar */}
              <div className="w-full max-w-[800px] flex items-center justify-between pb-2 mb-2 text-[#64748B] dark:text-slate-400 text-[11px] font-secondary">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse shrink-0" />
                  <span className="font-primary font-bold text-[#1E293B] dark:text-slate-200 truncate">
                    {reportType === 'month'
                      ? `Табель за ${MONTH_NAMES_RU[selectedMonth]} ${selectedYear} г.`
                      : reportType === 'year'
                      ? `Годовой табель за ${selectedYear} г.`
                      : `Сводный отчёт расчётов (${selectedYear} г.)`}
                  </span>
                </div>

                {/* Scale buttons for mobile / desktop zooming */}
                <div className="flex items-center gap-1 bg-white dark:bg-[#151D2E] p-0.5 rounded-lg border border-[#CBD5E1] dark:border-[#232E42] shrink-0">
                  <button
                    type="button"
                    onClick={() => setZoomScale((s) => Math.max(70, s - 10))}
                    className="w-6 h-6 rounded flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                    title="Уменьшить"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono text-[10px] font-bold px-1 tabular-nums">
                    {zoomScale}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setZoomScale((s) => Math.min(130, s + 10))}
                    className="w-6 h-6 rounded flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                    title="Увеличить"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  {zoomScale !== 100 && (
                    <button
                      type="button"
                      onClick={() => setZoomScale(100)}
                      className="w-6 h-6 rounded flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                      title="Сбросить масштаб"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* The Actual Printable Sheet (Clean A4 Paper) */}
              <div
                style={{
                  transform: zoomScale !== 100 ? `scale(${zoomScale / 100})` : undefined,
                  transformOrigin: 'top center',
                  transition: 'transform 0.15s ease-out',
                }}
                className="w-full max-w-[800px] transition-all"
              >
                <div
                  id="printable-report-sheet"
                  className="bg-white text-[#0F172A] w-full p-4 sm:p-8 rounded-2xl shadow-md border border-[#E2E8F0] font-secondary space-y-4 sm:space-y-5"
                >
                  {/* Document Brand Header */}
                  <div className="flex flex-col sm:flex-row items-start justify-between pb-3 sm:pb-4 border-b-2 border-[#0066FF] gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#0066FF] text-white flex items-center justify-center shadow-xs shrink-0">
                        <Calendar className="w-5 h-5 sm:w-7 sm:h-7 stroke-[2.2]" />
                      </div>
                      <div>
                        <div className="font-primary text-[17px] sm:text-[20px] font-black tracking-tight text-[#0F172A] leading-tight flex items-center gap-1.5">
                          <span>TOOLBOXI</span>
                          <span className="text-[#0066FF]">.UZ</span>
                        </div>
                        <p className="text-[9.5px] sm:text-[10px] text-[#64748B] font-medium uppercase tracking-wider mt-0.5">
                          Сервис производственных календарей и норм рабочего времени
                        </p>
                        <p className="text-[9px] sm:text-[10px] text-[#94A3B8]">
                          Международный стандарт ISO-8601 • Официальные производственные данные
                        </p>
                      </div>
                    </div>

                    <div className="text-left sm:text-right text-[10px] sm:text-[10.5px] text-[#64748B] space-y-0.5 self-start sm:self-auto">
                      <div className="font-primary font-bold text-[#0F172A]">
                        Документ № ТБ-{selectedYear}-
                        {reportType === 'month' ? String(selectedMonth + 1).padStart(2, '0') : 'ANNUAL'}
                      </div>
                      <div>Дата формирования: {currentDateFormatted}</div>
                      <div className="inline-block px-2 py-0.5 rounded bg-[#ECFDF5] text-[#065F46] font-bold text-[9.5px] border border-[#A7F3D0]">
                        ✓ ВЕРИФИЦИРОВАНО
                      </div>
                    </div>
                  </div>

                  {/* Document Title Banner */}
                  <div className="space-y-1">
                    <h1 className="font-primary text-[15px] sm:text-[18px] font-black text-[#0F172A] tracking-tight uppercase">
                      {reportType === 'month' &&
                        `Производственный календарь и табель на ${MONTH_NAMES_RU[selectedMonth]} ${selectedYear} года`}
                      {reportType === 'year' &&
                        `Годовой производственный табель и нормы рабочего времени на ${selectedYear} год`}
                      {reportType === 'calculations' &&
                        `Сводный отчёт по расчёту рабочих периодов и дедлайнов (${selectedYear} год)`}
                    </h1>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px] sm:text-[11px] text-[#475569] font-medium">
                      <span>
                        <strong>Режим недели:</strong> {workWeekLabel}
                      </span>
                      <span>•</span>
                      <span>
                        <strong>Регион:</strong> {countryName}
                      </span>
                      <span>•</span>
                      <span>
                        <strong>Формат листа:</strong> А4 книжная ориентация
                      </span>
                    </div>
                  </div>

                  {/* KPI Summary Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
                    <div className="p-2 sm:p-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
                      <span className="text-[9.5px] sm:text-[10px] font-primary font-semibold text-[#64748B] block uppercase tracking-wider">
                        Рабочих дней
                      </span>
                      <span className="font-primary text-[16px] sm:text-[18px] font-black text-[#0F172A] block mt-0.5 tabular-nums">
                        {reportType === 'month' ? monthNorms.workDays : yearNorms.totalWorkDays}
                        <span className="text-[10.5px] font-normal text-[#64748B] ml-1">дн.</span>
                      </span>
                    </div>

                    <div className="p-2 sm:p-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
                      <span className="text-[9.5px] sm:text-[10px] font-primary font-semibold text-[#64748B] block uppercase tracking-wider">
                        Выходных / Праздн.
                      </span>
                      <span className="font-primary text-[16px] sm:text-[18px] font-black text-[#E11D48] block mt-0.5 tabular-nums">
                        {reportType === 'month'
                          ? monthNorms.weekendDays + monthNorms.holidayDays
                          : yearNorms.totalWeekendDays + yearNorms.totalHolidays}
                        <span className="text-[10.5px] font-normal text-[#64748B] ml-1">дн.</span>
                      </span>
                    </div>

                    <div className="p-2 sm:p-2.5 rounded-xl border border-[#BFDBFE] bg-[#EFF6FF]">
                      <span className="text-[9.5px] sm:text-[10px] font-primary font-semibold text-[#1E40AF] block uppercase tracking-wider">
                        Норма часов (40ч)
                      </span>
                      <span className="font-primary text-[16px] sm:text-[18px] font-black text-[#0066FF] block mt-0.5 tabular-nums">
                        {reportType === 'month' ? monthNorms.hours40 : yearNorms.totalHours40}
                        <span className="text-[10.5px] font-normal text-[#1E40AF] ml-1">ч</span>
                      </span>
                    </div>

                    <div className="p-2 sm:p-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
                      <span className="text-[9.5px] sm:text-[10px] font-primary font-semibold text-[#64748B] block uppercase tracking-wider">
                        Норма часов (36ч)
                      </span>
                      <span className="font-primary text-[16px] sm:text-[18px] font-black text-[#0F172A] block mt-0.5 tabular-nums">
                        {reportType === 'month' ? monthNorms.hours36 : yearNorms.totalHours36}
                        <span className="text-[10.5px] font-normal text-[#64748B] ml-1">ч</span>
                      </span>
                    </div>
                  </div>

                  {/* ========================================================
                      REPORT BODY 1: MONTHLY VIEW
                  ======================================================== */}
                  {reportType === 'month' && (
                    <div className="space-y-4">
                      {/* Month Calendar Grid */}
                      <div>
                        <h3 className="font-primary text-[11.5px] sm:text-[12px] font-bold text-[#0F172A] uppercase tracking-wider mb-2">
                          Календарная сетка месяца ({MONTH_NAMES_RU[selectedMonth]} {selectedYear})
                        </h3>

                        <div className="border border-[#CBD5E1] rounded-xl overflow-hidden shadow-2xs">
                          {/* Day of Week Headers */}
                          <div className="grid grid-cols-7 bg-[#F1F5F9] border-b border-[#CBD5E1] text-center font-primary text-[10px] sm:text-[11px] font-bold text-[#475569] py-1.5">
                            {WEEKDAYS_SHORT.map((wd, idx) => (
                              <div key={idx} className={idx >= 5 ? 'text-[#E11D48]' : ''}>
                                {wd}
                              </div>
                            ))}
                          </div>

                          {/* Days Cells */}
                          <div className="grid grid-cols-7 divide-x divide-y divide-[#E2E8F0] bg-white">
                            {monthCalendarDays.map((d, i) => {
                              const isThisMonth = d.isCurrentMonth;
                              return (
                                <div
                                  key={i}
                                  className={`min-h-[46px] sm:min-h-[58px] p-1 sm:p-1.5 flex flex-col justify-between ${
                                    !isThisMonth
                                      ? 'bg-slate-50/70 text-[#94A3B8]'
                                      : d.isHoliday
                                      ? 'bg-[#FFF1F2] text-[#9F1239]'
                                      : d.isWeekend
                                      ? 'bg-[#F8FAFC] text-[#475569]'
                                      : 'bg-white text-[#0F172A]'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span
                                      className={`font-primary font-bold text-[11px] sm:text-[12px] ${
                                        d.isHoliday ? 'text-[#E11D48]' : ''
                                      }`}
                                    >
                                      {d.dayNumber}
                                    </span>
                                    {d.isHoliday && (
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48]" />
                                    )}
                                  </div>

                                  {/* Badge */}
                                  {isThisMonth && (
                                    <div className="text-[8px] sm:text-[9px] font-primary font-semibold mt-0.5 sm:mt-1">
                                      {d.isHoliday ? (
                                        <span className="text-[#E11D48] leading-tight block truncate">
                                          {d.holiday?.title || 'Праздник'}
                                        </span>
                                      ) : d.isShortened ? (
                                        <span className="text-[#D97706] font-bold bg-[#FEF3C7] px-1 py-0.2 rounded">
                                          {d.workHours}ч (сокращ)
                                        </span>
                                      ) : d.isDayOff ? (
                                        <span className="text-[#94A3B8]">Выходной</span>
                                      ) : (
                                        <span className="text-[#0066FF] font-bold">{d.workHours}ч</span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Monthly Indicators Table */}
                      <div>
                        <h3 className="font-primary text-[11.5px] sm:text-[12px] font-bold text-[#0F172A] uppercase tracking-wider mb-2">
                          Сводные нормы рабочего времени за {MONTH_NAMES_RU[selectedMonth]} {selectedYear} г.
                        </h3>
                        <div className="border border-[#CBD5E1] rounded-xl overflow-hidden shadow-2xs">
                          <table className="w-full border-collapse text-[10.5px] sm:text-[11px]">
                            <tbody>
                              <tr className="border-b border-[#E2E8F0]">
                                <td className="p-2 sm:p-2.5 bg-[#F8FAFC] font-semibold text-[#475569] w-1/2">
                                  Календарных дней:
                                </td>
                                <td className="p-2 sm:p-2.5 font-primary font-bold text-[#0F172A]">
                                  {monthNorms.calendarDays} дн.
                                </td>
                              </tr>
                              <tr className="border-b border-[#E2E8F0]">
                                <td className="p-2 sm:p-2.5 bg-[#F8FAFC] font-semibold text-[#475569]">
                                  Рабочих дней:
                                </td>
                                <td className="p-2 sm:p-2.5 font-primary font-bold text-[#065F46]">
                                  {monthNorms.workDays} дн.
                                </td>
                              </tr>
                              <tr className="border-b border-[#E2E8F0]">
                                <td className="p-2 sm:p-2.5 bg-[#F8FAFC] font-semibold text-[#475569]">
                                  Выходных и праздничных дней:
                                </td>
                                <td className="p-2 sm:p-2.5 font-primary font-bold text-[#E11D48]">
                                  {monthNorms.weekendDays + monthNorms.holidayDays} дн.
                                </td>
                              </tr>
                              <tr className="border-b border-[#E2E8F0]">
                                <td className="p-2 sm:p-2.5 bg-[#F8FAFC] font-semibold text-[#475569]">
                                  Норма рабочего времени (40-часовая неделя):
                                </td>
                                <td className="p-2 sm:p-2.5 font-primary font-bold text-[#0066FF]">
                                  {monthNorms.hours40} часов
                                </td>
                              </tr>
                              {includeExtendedNorms && (
                                <>
                                  <tr className="border-b border-[#E2E8F0]">
                                    <td className="p-2 sm:p-2.5 bg-[#F8FAFC] font-semibold text-[#475569]">
                                      Норма рабочего времени (36-часовая неделя):
                                    </td>
                                    <td className="p-2 sm:p-2.5 font-primary font-bold text-[#0F172A]">
                                      {monthNorms.hours36} часов
                                    </td>
                                  </tr>
                                  <tr className="border-b border-[#E2E8F0]">
                                    <td className="p-2 sm:p-2.5 bg-[#F8FAFC] font-semibold text-[#475569]">
                                      Норма рабочего времени (24-часовая неделя):
                                    </td>
                                    <td className="p-2 sm:p-2.5 font-primary font-bold text-[#0F172A]">
                                      {monthNorms.hours24} часов
                                    </td>
                                  </tr>
                                </>
                              )}
                              <tr>
                                <td className="p-2 sm:p-2.5 bg-[#F8FAFC] font-semibold text-[#475569]">
                                  Сокращённых предпраздничных дней:
                                </td>
                                <td className="p-2 sm:p-2.5 font-primary font-bold text-[#D97706]">
                                  {monthNorms.shortenedDays} дн. (-{monthNorms.shortenedDays} ч)
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ========================================================
                      REPORT BODY 2: ANNUAL VIEW (ГОДОВОЙ ТАБЕЛЬ)
                  ======================================================== */}
                  {reportType === 'year' && (
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-primary text-[11.5px] sm:text-[12px] font-bold text-[#0F172A] uppercase tracking-wider">
                            Сводный табель и нормы рабочего времени ({selectedYear} год)
                          </h3>
                          <span className="sm:hidden text-[9.5px] text-[#0066FF] font-semibold">
                            ↔ Прокручивайте вправо
                          </span>
                        </div>

                        {/* Scrollable table container to guarantee zero truncation on mobile */}
                        <div className="border border-[#CBD5E1] rounded-xl overflow-x-auto shadow-2xs">
                          <table className="w-full text-left text-[10.5px] sm:text-[11px] border-collapse min-w-[560px]">
                            <thead>
                              <tr className="bg-[#F1F5F9] text-[#475569] font-primary font-bold border-b border-[#CBD5E1] text-[9.5px] sm:text-[10px] uppercase">
                                <th className="py-2 px-2.5 sm:py-2.5 sm:px-3">Период</th>
                                <th className="py-2 px-1.5 sm:py-2.5 sm:px-2 text-center">Календ.</th>
                                <th className="py-2 px-1.5 sm:py-2.5 sm:px-2 text-center text-[#065F46]">Рабочих</th>
                                <th className="py-2 px-1.5 sm:py-2.5 sm:px-2 text-center text-[#E11D48]">Выходн.</th>
                                <th className="py-2 px-2 sm:py-2.5 sm:px-3 text-right text-[#0066FF]">40ч неделя</th>
                                {includeExtendedNorms && (
                                  <>
                                    <th className="py-2 px-2 sm:py-2.5 sm:px-3 text-right">36ч неделя</th>
                                    <th className="py-2 px-2 sm:py-2.5 sm:px-3 text-right">24ч неделя</th>
                                  </>
                                )}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E2E8F0]">
                              {yearNorms.months.map((m, idx) => {
                                const isQEnd = idx === 2 || idx === 5 || idx === 8 || idx === 11;
                                const qIdx = Math.floor(idx / 3);
                                const qData = yearNorms.quarters[qIdx];

                                return (
                                  <React.Fragment key={m.month}>
                                    <tr className={idx % 2 === 1 ? 'bg-[#F8FAFC]' : 'bg-white'}>
                                      <td className="py-1.5 px-2.5 sm:px-3 font-medium text-[#1E293B]">
                                        {MONTH_NAMES_RU[m.month]}
                                      </td>
                                      <td className="py-1.5 px-1.5 sm:px-2 text-center tabular-nums text-[#64748B]">
                                        {m.calendarDays}
                                      </td>
                                      <td className="py-1.5 px-1.5 sm:px-2 text-center tabular-nums font-bold text-[#0F172A]">
                                        {m.workDays}
                                      </td>
                                      <td className="py-1.5 px-1.5 sm:px-2 text-center tabular-nums text-[#64748B]">
                                        {m.weekendDays + m.holidayDays}
                                      </td>
                                      <td className="py-1.5 px-2 sm:px-3 text-right tabular-nums font-bold text-[#0066FF]">
                                        {m.hours40} ч
                                      </td>
                                      {includeExtendedNorms && (
                                        <>
                                          <td className="py-1.5 px-2 sm:px-3 text-right tabular-nums text-[#475569]">
                                            {m.hours36} ч
                                          </td>
                                          <td className="py-1.5 px-2 sm:px-3 text-right tabular-nums text-[#475569]">
                                            {m.hours24} ч
                                          </td>
                                        </>
                                      )}
                                    </tr>

                                    {/* Quarter Subtotal Row */}
                                    {isQEnd && (
                                      <tr className="bg-[#EFF6FF] border-y-2 border-[#BFDBFE] font-primary font-bold text-[#1E40AF]">
                                        <td className="py-1.5 sm:py-2 px-2.5 sm:px-3">ИТОГО {qData.quarter} КВАРТАЛ</td>
                                        <td className="py-1.5 sm:py-2 px-1.5 sm:px-2 text-center tabular-nums">
                                          {qData.calendarDays}
                                        </td>
                                        <td className="py-1.5 sm:py-2 px-1.5 sm:px-2 text-center tabular-nums text-[#065F46]">
                                          {qData.workDays}
                                        </td>
                                        <td className="py-1.5 sm:py-2 px-1.5 sm:px-2 text-center tabular-nums">
                                          {qData.weekendDays}
                                        </td>
                                        <td className="py-1.5 sm:py-2 px-2 sm:px-3 text-right tabular-nums text-[#0066FF]">
                                          {qData.hours40} ч
                                        </td>
                                        {includeExtendedNorms && (
                                          <>
                                            <td className="py-1.5 sm:py-2 px-2 sm:px-3 text-right tabular-nums">
                                              {qData.hours36} ч
                                            </td>
                                            <td className="py-1.5 sm:py-2 px-2 sm:px-3 text-right tabular-nums">
                                              {qData.hours24} ч
                                            </td>
                                          </>
                                        )}
                                      </tr>
                                    )}

                                    {/* Half-Year Subtotal */}
                                    {idx === 5 && (
                                      <tr className="bg-[#DBEAFE]/80 border-b-2 border-[#93C5FD] font-primary font-extrabold text-[#1E3A8A]">
                                        <td className="py-1.5 sm:py-2 px-2.5 sm:px-3">ИТОГО ЗА I ПОЛУГОДИЕ</td>
                                        <td className="py-1.5 sm:py-2 px-1.5 sm:px-2 text-center tabular-nums">
                                          {yearNorms.quarters[0].calendarDays + yearNorms.quarters[1].calendarDays}
                                        </td>
                                        <td className="py-1.5 sm:py-2 px-1.5 sm:px-2 text-center tabular-nums">
                                          {yearNorms.quarters[0].workDays + yearNorms.quarters[1].workDays}
                                        </td>
                                        <td className="py-1.5 sm:py-2 px-1.5 sm:px-2 text-center tabular-nums">
                                          {yearNorms.quarters[0].weekendDays + yearNorms.quarters[1].weekendDays}
                                        </td>
                                        <td className="py-1.5 sm:py-2 px-2 sm:px-3 text-right tabular-nums">
                                          {yearNorms.quarters[0].hours40 + yearNorms.quarters[1].hours40} ч
                                        </td>
                                        {includeExtendedNorms && (
                                          <>
                                            <td className="py-1.5 sm:py-2 px-2 sm:px-3 text-right tabular-nums">
                                              {yearNorms.quarters[0].hours36 + yearNorms.quarters[1].hours36} ч
                                            </td>
                                            <td className="py-1.5 sm:py-2 px-2 sm:px-3 text-right tabular-nums">
                                              {yearNorms.quarters[0].hours24 + yearNorms.quarters[1].hours24} ч
                                            </td>
                                          </>
                                        )}
                                      </tr>
                                    )}
                                  </React.Fragment>
                                );
                              })}

                              {/* Grand Total Row */}
                              <tr className="bg-[#1E293B] text-white font-primary font-black text-[11px] sm:text-[12px] border-t-2 border-[#0F172A]">
                                <td className="py-2.5 sm:py-3 px-2.5 sm:px-3 uppercase tracking-wider">
                                  ВСЕГО ЗА {selectedYear} ГОД
                                </td>
                                <td className="py-2.5 sm:py-3 px-1.5 sm:px-2 text-center tabular-nums">
                                  {yearNorms.totalCalendarDays}
                                </td>
                                <td className="py-2.5 sm:py-3 px-1.5 sm:px-2 text-center tabular-nums text-[#34D399]">
                                  {yearNorms.totalWorkDays}
                                </td>
                                <td className="py-2.5 sm:py-3 px-1.5 sm:px-2 text-center tabular-nums text-[#FDA4AF]">
                                  {yearNorms.totalWeekendDays + yearNorms.totalHolidays}
                                </td>
                                <td className="py-2.5 sm:py-3 px-2 sm:px-3 text-right tabular-nums text-[#60A5FA]">
                                  {yearNorms.totalHours40} ч
                                </td>
                                {includeExtendedNorms && (
                                  <>
                                    <td className="py-2.5 sm:py-3 px-2 sm:px-3 text-right tabular-nums text-slate-300">
                                      {yearNorms.totalHours36} ч
                                    </td>
                                    <td className="py-2.5 sm:py-3 px-2 sm:px-3 text-right tabular-nums text-slate-300">
                                      {yearNorms.totalHours24} ч
                                    </td>
                                  </>
                                )}
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Formulas and Legal Basis Footnote */}
                      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-2.5 sm:p-3 text-[9.5px] sm:text-[10px] text-[#64748B] space-y-1">
                        <div className="font-primary font-bold text-[#1E293B]">
                          Порядок исчисления нормы рабочего времени:
                        </div>
                        <div>
                          • При 40-часовой рабочей неделе норма составляет 8 часов в день при 5-дневной
                          неделе (в предпраздничные дни сокращается на 1 час).
                        </div>
                        <div>
                          • При 36-часовой неделе: 7.2 часа в день; при 24-часовой неделе: 4.8 часа в день.
                        </div>
                        <div>
                          • Среднемесячное количество рабочих часов: {(yearNorms.totalHours40 / 12).toFixed(1)} ч.
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ========================================================
                      REPORT BODY 3: CALCULATIONS VIEW (СВОДНЫЙ ОТЧЁТ)
                  ======================================================== */}
                  {reportType === 'calculations' && (
                    <div className="space-y-4">
                      <div className="border border-[#CBD5E1] rounded-xl p-3 sm:p-4 bg-[#F8FAFC] space-y-3">
                        <h3 className="font-primary text-[11.5px] sm:text-[12px] font-bold text-[#0F172A] uppercase tracking-wider">
                          Результаты расчёта калькуляторов дедлайнов и рабочих периодов
                        </h3>

                        {/* Calculation 1: Range of work days */}
                        <div className="bg-white p-3 rounded-xl border border-[#A7F3D0] space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-primary font-bold text-[11.5px] sm:text-[12px] text-[#065F46]">
                              Период между датами:
                            </span>
                            <span className="font-primary font-black text-[12.5px] sm:text-[13px] text-[#0066FF]">
                              {safeWorkDaysCalc.workDays} рабочих дней
                            </span>
                          </div>
                          <div className="text-[10.5px] sm:text-[11px] text-[#475569]">
                            С {safeWorkDaysCalc.startDateStr} по {safeWorkDaysCalc.endDateStr} (Календарных:{' '}
                            {safeWorkDaysCalc.calendarDays} дн., выходных: {safeWorkDaysCalc.weekendDays} дн.,
                            праздничных: {safeWorkDaysCalc.holidayDays} дн.)
                          </div>
                        </div>

                        {/* Calculation 2: Deadline */}
                        <div className="bg-white p-3 rounded-xl border border-[#BFDBFE] space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-primary font-bold text-[11.5px] sm:text-[12px] text-[#1E40AF]">
                              Расчёт дедлайна проекта с буфером:
                            </span>
                            <span className="font-primary font-black text-[12.5px] sm:text-[13px] text-[#0066FF]">
                              {safeDeadlineCalc.formattedDateRu} ({safeDeadlineCalc.dayOfWeekName})
                            </span>
                          </div>
                          <div className="text-[10.5px] sm:text-[11px] text-[#475569]">
                            Длительность задачи: {safeDeadlineCalc.durationCount} дн. + Запасной буфер:{' '}
                            {safeDeadlineCalc.bufferCount || 0} дн. (Итого: {safeDeadlineCalc.totalDays} дн.)
                          </div>
                        </div>

                        {/* Quarterly Labor Norms Breakdown */}
                        <div className="bg-white p-3 rounded-xl border border-[#E2E8F0] space-y-2">
                          <div className="font-primary font-bold text-[11px] text-[#0F172A]">
                            Сводка нормативов по кварталам ({selectedYear} год):
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                            {yearNorms.quarters.map((q) => (
                              <div key={q.quarter} className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                                <span className="font-bold text-[#0F172A] block">{q.quarter} Квартал</span>
                                <span className="text-[#065F46] font-semibold">{q.workDays} раб. дн.</span>
                                <span className="text-[#0066FF] block font-bold">{q.hours40} ч (40ч)</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ========================================================
                      HOLIDAYS BREAKDOWN SECTION (IF ENABLED)
                  ======================================================== */}
                  {includeHolidaysList && (
                    <div className="pt-2 border-t border-[#E2E8F0] space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-primary text-[10.5px] sm:text-[11px] font-bold text-[#0F172A] uppercase tracking-wider">
                          {reportType === 'month'
                            ? `Официальные праздники (${MONTH_NAMES_RU[selectedMonth]} ${selectedYear})`
                            : `Официальные праздничные дни (${selectedYear} год)`}
                        </h4>
                        <span className="text-[9.5px] sm:text-[10px] text-[#64748B]">
                          Всего:{' '}
                          {reportType === 'month'
                            ? monthHolidays.length
                            : holidays.filter((h) => h.isDayOff).length}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 text-[10px] sm:text-[10.5px]">
                        {(reportType === 'month'
                          ? monthHolidays
                          : holidays.filter((h) => h.isDayOff).slice(0, 10)
                        ).map((h, idx) => (
                          <div
                            key={idx}
                            className="p-1.5 sm:p-2 rounded-lg bg-[#FFF1F2] border border-[#FECDD3] flex items-center gap-2"
                          >
                            <span className="font-primary font-bold text-[#E11D48] shrink-0 tabular-nums">
                              {h.date.split('-').reverse().join('.')}:
                            </span>
                            <span className="text-[#881337] font-medium truncate">
                              {h.title} {h.note ? `(${h.note})` : ''}
                            </span>
                          </div>
                        ))}
                        {reportType === 'month' && monthHolidays.length === 0 && (
                          <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-[#64748B] text-[10px]">
                            В данном месяце официальных нерабочих праздников нет.
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ========================================================
                      SIGNATURES & OFFICIAL SEAL SECTION (IF ENABLED)
                  ======================================================== */}
                  {includeSignatures && (
                    <div className="pt-3 sm:pt-4 border-t-2 border-[#CBD5E1] space-y-3 sm:space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-[10px] sm:text-[10.5px] text-[#334155]">
                        <div className="space-y-2 sm:space-y-4">
                          <div className="font-primary font-bold text-[#0F172A]">
                            Руководитель организации:
                          </div>
                          <div className="border-b border-[#0F172A] pb-0.5 text-[#94A3B8] text-[9px] sm:text-[9.5px]">
                            / ___________________ / (подпись)
                          </div>
                        </div>

                        <div className="space-y-2 sm:space-y-4">
                          <div className="font-primary font-bold text-[#0F172A]">
                            Главный бухгалтер:
                          </div>
                          <div className="border-b border-[#0F172A] pb-0.5 text-[#94A3B8] text-[9px] sm:text-[9.5px]">
                            / ___________________ / (подпись)
                          </div>
                        </div>

                        <div className="flex items-center justify-start sm:justify-end">
                          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-dashed border-[#94A3B8] flex items-center justify-center text-[#64748B] font-primary font-bold text-[9px] sm:text-[10px]">
                            М.П.
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Document Legal Footer */}
                  <div className="pt-2 sm:pt-3 border-t border-[#CBD5E1] flex flex-col sm:flex-row items-center justify-between gap-1 text-[9px] sm:text-[9.5px] text-[#94A3B8]">
                    <div>
                      Сформировано на портале <strong>Toolboxi.uz</strong>. Соответствует нормам трудового учёта и ISO-8601.
                    </div>
                    <div className="font-primary font-semibold">Страница 1 из 1</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================
            STATUS NOTIFICATIONS
        ======================================================== */}
        {downloadSuccess && (
          <div className="p-2 sm:p-2.5 bg-[#ECFDF5] text-[#065F46] font-primary text-[11px] sm:text-[11.5px] font-bold text-center border-t border-[#A7F3D0] animate-in fade-in flex items-center justify-center gap-2 shrink-0">
            <Check className="w-4 h-4 text-[#16A34A]" />
            <span>{t('exp_success_pdf')}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-2 sm:p-2.5 bg-[#FFF1F2] text-[#9F1239] font-primary text-[11px] sm:text-[11.5px] font-bold text-center border-t border-[#FECDD3] animate-in fade-in flex items-center justify-center gap-2 shrink-0">
            <X className="w-4 h-4 text-[#E11D48]" />
            <span>{errorMessage}</span>
          </div>
        )}

        {copiedSuccess && (
          <div className="p-2 sm:p-2.5 bg-[#EFF6FF] dark:bg-blue-950/60 text-[#1E40AF] dark:text-blue-300 font-primary text-[11px] sm:text-[11.5px] font-bold text-center border-t border-[#BFDBFE] dark:border-blue-900/60 animate-in fade-in flex items-center justify-center gap-2 shrink-0">
            <Check className="w-4 h-4 text-[#0066FF] dark:text-blue-400" />
            <span>{t('exp_success_excel')}</span>
          </div>
        )}

        {/* ========================================================
            MODAL BOTTOM ACTION BAR (Clean, Balanced, Mobile-Friendly)
        ======================================================== */}
        <div className="p-2.5 sm:p-3 bg-white dark:bg-[#151D2E] border-t border-[#F1F5F9] dark:border-[#232E42] shrink-0 flex items-center justify-between gap-2">
          {/* Secondary Actions: Excel, CSV, Print */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={handleCopyExcel}
              className="py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-xl border border-[#CBD5E1] dark:border-[#232E42] bg-white dark:bg-[#151D2E] hover:bg-slate-50 dark:hover:bg-[#1E293B] font-primary text-[11px] sm:text-[12px] font-medium text-[#334155] dark:text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              title="Скопировать для Excel (Ctrl+V)"
            >
              <Copy className="w-3.5 h-3.5 text-[#64748B] dark:text-slate-400" />
              <span className="hidden sm:inline">{t('exp_btn_copy_excel')}</span>
              <span className="sm:hidden">Excel</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadCsv}
              className="py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-xl border border-[#CBD5E1] dark:border-[#232E42] bg-white dark:bg-[#151D2E] hover:bg-slate-50 dark:hover:bg-[#1E293B] font-primary text-[11px] sm:text-[12px] font-medium text-[#334155] dark:text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              title="Скачать в формате CSV"
            >
              <Table className="w-3.5 h-3.5 text-[#64748B] dark:text-slate-400" />
              <span>CSV</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-xl border border-[#CBD5E1] dark:border-[#232E42] bg-white dark:bg-[#151D2E] hover:bg-slate-50 dark:hover:bg-[#1E293B] font-primary text-[11px] sm:text-[12px] font-medium text-[#334155] dark:text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              title="Печать"
            >
              <Printer className="w-3.5 h-3.5 text-[#64748B] dark:text-slate-400" />
              <span className="hidden sm:inline">{t('exp_btn_print')}</span>
            </button>
          </div>

          {/* Primary Action: Download Button (Simple, clean, standard size) */}
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isGenerating}
            className="py-1.5 sm:py-2 px-3.5 sm:px-5 rounded-xl bg-[#0066FF] hover:bg-blue-700 text-white font-primary text-[11.5px] sm:text-[12.5px] font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs hover:shadow cursor-pointer disabled:opacity-50 shrink-0"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                <span>{t('exp_generating')}</span>
              </>
            ) : (
              <>
                <FileDown className="w-3.5 h-3.5 stroke-[2.2] shrink-0" />
                <span>{t('exp_btn_download_pdf')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
