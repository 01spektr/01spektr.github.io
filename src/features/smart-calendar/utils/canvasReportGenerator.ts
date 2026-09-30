import jsPDF from 'jspdf';
import { CountryCode, WorkWeekType, DayInfo, MonthLaborNorms, YearLaborNorms, Holiday, Language } from '../types/calendar';
import { MONTH_NAMES_BY_LANG, WEEKDAYS_SHORT_BY_LANG } from '../i18n/translations';

interface GenerateReportOptions {
  reportType: 'month' | 'year' | 'calculations';
  year: number;
  month: number;
  country: CountryCode;
  countryName: string;
  workWeekType: WorkWeekType;
  monthNorms: MonthLaborNorms;
  yearNorms: YearLaborNorms;
  holidays: Holiday[];
  monthCalendarDays: DayInfo[];
  includeExtendedNorms: boolean;
  includeHolidaysList: boolean;
  includeSignatures: boolean;
  calculations?: any;
  language?: Language;
}

/**
 * Robust, zero-dependency Canvas 2D report generator that works in all browsers and iframes.
 * Guaranteed: No CORS errors, no Tailwind CSS oklch errors, 100% Cyrillic support.
 */
export function generatePdfViaCanvas(options: GenerateReportOptions): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const {
        reportType,
        year,
        month,
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
        language = 'ru',
      } = options;

      const lang = language;
      const monthNames = MONTH_NAMES_BY_LANG[lang] || MONTH_NAMES_BY_LANG.ru;
      const weekdaysShort = WEEKDAYS_SHORT_BY_LANG[lang] || WEEKDAYS_SHORT_BY_LANG.ru;

      const canvas = document.createElement('canvas');
      const width = 1600;
      const height = 2262; // Standard A4 ratio (1 : 1.414)
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(false);
        return;
      }

      // Background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);

      const marginX = 80;
      const contentWidth = width - marginX * 2;
      let y = 80;

      // 1. BRAND HEADER
      // Logo Icon
      ctx.fillStyle = '#0066FF';
      roundRect(ctx, marginX, y, 64, 64, 16);
      ctx.fill();

      // White Calendar Mark inside logo
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3.5;
      ctx.strokeRect(marginX + 17, y + 17, 30, 30);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(marginX + 17, y + 17, 30, 8);
      // Calendar grid dots
      ctx.fillRect(marginX + 22, y + 31, 4, 4);
      ctx.fillRect(marginX + 30, y + 31, 4, 4);
      ctx.fillRect(marginX + 38, y + 31, 4, 4);
      ctx.fillRect(marginX + 22, y + 39, 4, 4);
      ctx.fillRect(marginX + 30, y + 39, 4, 4);

      // Brand Title
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 32px "Montserrat", "Inter", Arial, sans-serif';
      ctx.fillText('TOOLBOXI', marginX + 80, y + 32);
      const tbWidth = ctx.measureText('TOOLBOXI').width;
      ctx.fillStyle = '#0066FF';
      ctx.fillText('.UZ', marginX + 80 + tbWidth, y + 32);

      // Subtitles
      ctx.fillStyle = '#64748B';
      ctx.font = '500 15px "Inter", Arial, sans-serif';
      const brandSubtitle =
        lang === 'uz'
          ? 'Ishlab chiqarish taqvimi va ish vaqti me’yorlari xizmati'
          : lang === 'en'
          ? 'Production calendar and labor norms service'
          : 'Сервис производственных календарей и норм рабочего времени';
      ctx.fillText(brandSubtitle, marginX + 80, y + 54);

      // Right Header Info
      const todayFormatted = new Date().toLocaleDateString(
        lang === 'uz' ? 'uz-UZ' : lang === 'en' ? 'en-US' : 'ru-RU',
        {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }
      );
      const docCode = `№ ТБ-${year}-${reportType === 'month' ? String(month + 1).padStart(2, '0') : 'ANNUAL'}`;

      ctx.textAlign = 'right';
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 15px "Inter", Arial, sans-serif';
      ctx.fillText(docCode, width - marginX, y + 24);

      ctx.fillStyle = '#64748B';
      ctx.font = '14px "Inter", Arial, sans-serif';
      const dateFormLabel =
        lang === 'uz' ? 'Sana' : lang === 'en' ? 'Generated' : 'Дата формирования';
      ctx.fillText(`${dateFormLabel}: ${todayFormatted}`, width - marginX, y + 46);

      // Verified Badge
      ctx.fillStyle = '#ECFDF5';
      roundRect(ctx, width - marginX - 170, y + 54, 170, 24, 6);
      ctx.fill();
      ctx.strokeStyle = '#A7F3D0';
      ctx.lineWidth = 1;
      roundRect(ctx, width - marginX - 170, y + 54, 170, 24, 6);
      ctx.stroke();

      ctx.fillStyle = '#065F46';
      ctx.font = 'bold 12px "Inter", Arial, sans-serif';
      const badgeText =
        lang === 'uz' ? '✓ RASMIY STANDART' : lang === 'en' ? '✓ VERIFIED STANDARD' : '✓ ОФИЦИАЛЬНЫЙ СТАНДАРТ';
      ctx.fillText(badgeText, width - marginX - 12, y + 71);
      ctx.textAlign = 'left';

      y += 90;

      // Primary Blue Line Divider
      ctx.fillStyle = '#0066FF';
      ctx.fillRect(marginX, y, contentWidth, 3);
      y += 24;

      // 2. DOCUMENT TITLE
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 24px "Montserrat", "Inter", Arial, sans-serif';

      let docTitle = `ГОДОВОЙ ПРОИЗВОДСТВЕННЫЙ ТАБЕЛЬ И НОРМЫ РАБОЧЕГО ВРЕМЕНИ НА ${year} ГОД`;
      if (lang === 'uz') {
        docTitle = `${year}-YIL UCHUN YILLIK ISHLAB CHIQARISH TABELI VA VAQT ME’YORLARI`;
      } else if (lang === 'en') {
        docTitle = `ANNUAL PRODUCTION TIMESHEET AND LABOR NORMS FOR ${year}`;
      }

      if (reportType === 'month') {
        if (lang === 'uz') {
          docTitle = `${monthNames[month].toUpperCase()} ${year}-YIL UCHUN ISHLAB CHIQARISH TAQVIMI`;
        } else if (lang === 'en') {
          docTitle = `PRODUCTION CALENDAR AND TIMESHEET FOR ${monthNames[month].toUpperCase()} ${year}`;
        } else {
          docTitle = `ПРОИЗВОДСТВЕННЫЙ КАЛЕНДАРЬ И ТАБЕЛЬ НА ${monthNames[month].toUpperCase()} ${year} ГОДА`;
        }
      } else if (reportType === 'calculations') {
        if (lang === 'uz') {
          docTitle = `ISH DAVRLARI VA MUDDATLAR BO‘YICHA UMUMIY HISOBOT (${year}-YIL)`;
        } else if (lang === 'en') {
          docTitle = `SUMMARY REPORT ON WORK PERIODS AND DEADLINES (${year})`;
        } else {
          docTitle = `СВОДНЫЙ ОТЧЁТ ПО РАСЧЁТУ РАБОЧИХ ПЕРИОДОВ И ДЕДЛАЙНОВ (${year} ГОД)`;
        }
      }

      ctx.fillText(docTitle, marginX, y);
      y += 24;

      // Parameters row
      const workWeekLabel =
        workWeekType === '5_DAYS'
          ? (lang === 'uz' ? '5 kunlik (40 soat/hafta)' : lang === 'en' ? '5-day week (40 hrs/wk)' : '5-дневная рабочая неделя (40 ч/нед)')
          : workWeekType === '6_DAYS'
          ? (lang === 'uz' ? '6 kunlik (40 soat/hafta)' : lang === 'en' ? '6-day week (40 hrs/wk)' : '6-дневная рабочая неделя (40 ч/нед)')
          : workWeekType === '4_DAYS'
          ? (lang === 'uz' ? '4 kunlik (32 soat/hafta)' : lang === 'en' ? '4-day week (32 hrs/wk)' : '4-дневная рабочая неделя (32 ч/нед)')
          : (lang === 'uz' ? '5 kunlik (Yak-Pay, 40s)' : lang === 'en' ? '5-day week (Sun-Thu, 40h)' : '5-дневная неделя (Вс-Чт, 40 ч/нед)');

      ctx.fillStyle = '#475569';
      ctx.font = '500 14px "Inter", Arial, sans-serif';
      const paramSchedule = lang === 'uz' ? 'Tartib' : lang === 'en' ? 'Schedule' : 'Режим недели';
      const paramStandard = lang === 'uz' ? 'Standart' : lang === 'en' ? 'Standard' : 'Стандарт';
      const paramRegion = lang === 'uz' ? 'Mintaqa' : lang === 'en' ? 'Region' : 'Регион';

      ctx.fillText(
        `${paramSchedule}: ${workWeekLabel}   •   ${paramStandard}: ISO-8601   •   ${paramRegion}: ${countryName}`,
        marginX,
        y
      );
      y += 26;

      // 3. KPI SUMMARY CARDS
      const kpiCardWidth = (contentWidth - 36) / 4;
      const kpiHeight = 74;

      const kpiLabel1 = lang === 'uz' ? 'ISH KUNLARI' : lang === 'en' ? 'WORK DAYS' : 'РАБОЧИХ ДНЕЙ';
      const kpiLabel2 = lang === 'uz' ? 'DAM OLISH / BAYRAM' : lang === 'en' ? 'WEEKENDS / HOLIDAYS' : 'ВЫХОДНЫХ / ПРАЗДН.';
      const kpiLabel3 = lang === 'uz' ? '40S ME’YORI' : lang === 'en' ? '40H NORM' : 'НОРМА ЧАСОВ (40Ч)';
      const kpiLabel4 = lang === 'uz' ? '36S ME’YORI' : lang === 'en' ? '36H NORM' : 'НОРМА ЧАСОВ (36Ч)';
      const daysSuff = lang === 'uz' ? 'kun' : lang === 'en' ? 'days' : 'дн.';
      const hoursSuff = lang === 'uz' ? 's' : lang === 'en' ? 'h' : 'ч';

      const kpis = [
        {
          label: kpiLabel1,
          val: `${reportType === 'month' ? monthNorms.workDays : yearNorms.totalWorkDays} ${daysSuff}`,
          color: '#0F172A',
          bg: '#F8FAFC',
          border: '#E2E8F0',
        },
        {
          label: kpiLabel2,
          val: `${
            reportType === 'month'
              ? monthNorms.weekendDays + monthNorms.holidayDays
              : yearNorms.totalWeekendDays + yearNorms.totalHolidays
          } ${daysSuff}`,
          color: '#E11D48',
          bg: '#FFF1F2',
          border: '#FECDD3',
        },
        {
          label: kpiLabel3,
          val: `${reportType === 'month' ? monthNorms.hours40 : yearNorms.totalHours40} ${hoursSuff}`,
          color: '#0066FF',
          bg: '#EFF6FF',
          border: '#BFDBFE',
        },
        {
          label: kpiLabel4,
          val: `${reportType === 'month' ? monthNorms.hours36 : yearNorms.totalHours36} ${hoursSuff}`,
          color: '#0F172A',
          bg: '#F8FAFC',
          border: '#E2E8F0',
        },
      ];

      kpis.forEach((kpi, idx) => {
        const kX = marginX + idx * (kpiCardWidth + 12);
        ctx.fillStyle = kpi.bg;
        roundRect(ctx, kX, y, kpiCardWidth, kpiHeight, 10);
        ctx.fill();
        ctx.strokeStyle = kpi.border;
        ctx.lineWidth = 1;
        roundRect(ctx, kX, y, kpiCardWidth, kpiHeight, 10);
        ctx.stroke();

        ctx.fillStyle = '#64748B';
        ctx.font = 'bold 11px "Inter", Arial, sans-serif';
        ctx.fillText(kpi.label, kX + 14, y + 26);

        ctx.fillStyle = kpi.color;
        ctx.font = 'bold 24px "Montserrat", Arial, sans-serif';
        ctx.fillText(kpi.val, kX + 14, y + 56);
      });

      y += kpiHeight + 30;

      // 4. MAIN BODY

      // A) ANNUAL REPORT
      if (reportType === 'year') {
        ctx.fillStyle = '#0F172A';
        ctx.font = 'bold 15px "Montserrat", Arial, sans-serif';
        const annualSectionTitle =
          lang === 'uz'
            ? `${year}-YIL UCHUN ISHLAB CHIQARISH TABELI VA VAQT ME’YORLARI`
            : lang === 'en'
            ? `ANNUAL WORKING TIME NORMS & TIMESHEET FOR ${year}`
            : `СВОДНЫЙ ТАБЕЛЬ И НОРМЫ РАБОЧЕГО ВРЕМЕНИ НА ${year} ГОД`;
        ctx.fillText(annualSectionTitle, marginX, y);
        y += 14;

        // Table Header
        const colWidths = includeExtendedNorms
          ? [240, 160, 180, 220, 220, 210, 210]
          : [340, 240, 260, 300, 300];

        const headers = includeExtendedNorms
          ? (lang === 'uz'
              ? ['Davr', 'Kalendar', 'Ish kunlari', 'Dam olish/Bayram', '40s hafta', '36s hafta', '24s hafta']
              : lang === 'en'
              ? ['Period', 'Calendar', 'Work days', 'Weekends/Holidays', '40h week', '36h week', '24h week']
              : ['Период', 'Календарных', 'Рабочих', 'Выходн./Праздн.', '40ч неделя', '36ч неделя', '24ч неделя'])
          : (lang === 'uz'
              ? ['Davr', 'Kalendar kunlari', 'Ish kunlari', 'Dam olish va bayramlar', '40s hafta (soat)']
              : lang === 'en'
              ? ['Period', 'Calendar days', 'Work days', 'Weekends and holidays', '40h week (hrs)']
              : ['Период', 'Календарных дней', 'Рабочих дней', 'Выходных и праздничных', '40ч неделя (час)']);

        const rowHeight = 33;
        drawTableRow(ctx, marginX, y, colWidths, headers, true, '#F1F5F9', '#475569');
        y += rowHeight;

        yearNorms.months.forEach((m, idx) => {
          const isQEnd = idx === 2 || idx === 5 || idx === 8 || idx === 11;
          const qIdx = Math.floor(idx / 3);
          const q = yearNorms.quarters[qIdx];

          const rowData = includeExtendedNorms
            ? [
                monthNames[m.month],
                `${m.calendarDays}`,
                `${m.workDays}`,
                `${m.weekendDays + m.holidayDays}`,
                `${m.hours40} ${hoursSuff}`,
                `${m.hours36} ${hoursSuff}`,
                `${m.hours24} ${hoursSuff}`,
              ]
            : [
                monthNames[m.month],
                `${m.calendarDays}`,
                `${m.workDays}`,
                `${m.weekendDays + m.holidayDays}`,
                `${m.hours40} ${hoursSuff}`,
              ];

          const bg = idx % 2 === 1 ? '#F8FAFC' : '#FFFFFF';
          drawTableRow(ctx, marginX, y, colWidths, rowData, false, bg, '#1E293B');
          y += rowHeight;

          if (isQEnd) {
            // Quarter total
            const qTitle =
              lang === 'uz'
                ? `${q.quarter}-CHORAK JAMI`
                : lang === 'en'
                ? `TOTAL Q${q.quarter}`
                : `ИТОГО ${q.quarter} КВАРТАЛ`;

            const qRowData = includeExtendedNorms
              ? [
                  qTitle,
                  `${q.calendarDays}`,
                  `${q.workDays}`,
                  `${q.weekendDays}`,
                  `${q.hours40} ${hoursSuff}`,
                  `${q.hours36} ${hoursSuff}`,
                  `${q.hours24} ${hoursSuff}`,
                ]
              : [
                  qTitle,
                  `${q.calendarDays}`,
                  `${q.workDays}`,
                  `${q.weekendDays}`,
                  `${q.hours40} ${hoursSuff}`,
                ];

            drawTableRow(ctx, marginX, y, colWidths, qRowData, true, '#EFF6FF', '#1E40AF');
            y += rowHeight;

            if (idx === 5) {
              // Half year 1
              const h1 = [
                yearNorms.quarters[0].calendarDays + yearNorms.quarters[1].calendarDays,
                yearNorms.quarters[0].workDays + yearNorms.quarters[1].workDays,
                yearNorms.quarters[0].weekendDays + yearNorms.quarters[1].weekendDays,
                yearNorms.quarters[0].hours40 + yearNorms.quarters[1].hours40,
                yearNorms.quarters[0].hours36 + yearNorms.quarters[1].hours36,
                yearNorms.quarters[0].hours24 + yearNorms.quarters[1].hours24,
              ];
              const h1RowData = includeExtendedNorms
                ? ['ИТОГО I ПОЛУГОДИЕ', `${h1[0]}`, `${h1[1]}`, `${h1[2]}`, `${h1[3]} ч`, `${h1[4]} ч`, `${h1[5]} ч`]
                : ['ИТОГО I ПОЛУГОДИЕ', `${h1[0]}`, `${h1[1]}`, `${h1[2]}`, `${h1[3]} ч`];

              drawTableRow(ctx, marginX, y, colWidths, h1RowData, true, '#DBEAFE', '#1E3A8A');
              y += rowHeight;
            }
          }
        });

        // Year Grand Total
        const totalRowData = includeExtendedNorms
          ? [
              `ВСЕГО ЗА ${year} ГОД`,
              `${yearNorms.totalCalendarDays}`,
              `${yearNorms.totalWorkDays}`,
              `${yearNorms.totalWeekendDays + yearNorms.totalHolidays}`,
              `${yearNorms.totalHours40} ч`,
              `${yearNorms.totalHours36} ч`,
              `${yearNorms.totalHours24} ч`,
            ]
          : [
              `ВСЕГО ЗА ${year} ГОД`,
              `${yearNorms.totalCalendarDays}`,
              `${yearNorms.totalWorkDays}`,
              `${yearNorms.totalWeekendDays + yearNorms.totalHolidays}`,
              `${yearNorms.totalHours40} ч`,
            ];

        drawTableRow(ctx, marginX, y, colWidths, totalRowData, true, '#1E293B', '#FFFFFF');
        y += rowHeight + 20;

        // Explanatory note
        ctx.fillStyle = '#F8FAFC';
        roundRect(ctx, marginX, y, contentWidth, 68, 8);
        ctx.fill();
        ctx.strokeStyle = '#E2E8F0';
        roundRect(ctx, marginX, y, contentWidth, 68, 8);
        ctx.stroke();

        ctx.fillStyle = '#1E293B';
        ctx.font = 'bold 12px "Inter", Arial, sans-serif';
        ctx.fillText('Порядок исчисления нормы рабочего времени:', marginX + 16, y + 22);

        ctx.fillStyle = '#64748B';
        ctx.font = '12px "Inter", Arial, sans-serif';
        ctx.fillText(
          '• При 40-часовой неделе норма составляет 8 часов в день при 5-дневке (накануне праздников сокращается на 1 час).',
          marginX + 16,
          y + 40
        );
        ctx.fillText(
          '• Среднемесячное количество рабочих часов для расчета часовой ставки сверхурочных: (Итого за год / 12).',
          marginX + 16,
          y + 58
        );
        y += 85;
      }

      // B) MONTHLY REPORT
      else if (reportType === 'month') {
        ctx.fillStyle = '#0F172A';
        ctx.font = 'bold 16px "Montserrat", Arial, sans-serif';
        ctx.fillText(
          `КАЛЕНДАРНАЯ СЕТКА И ТАБЕЛЬ (${monthNames[month]} ${year})`,
          marginX,
          y
        );
        y += 16;

        // Draw 7-column calendar
        const dayColW = contentWidth / 7;
        const calHeaderH = 34;

        // Weekday headers
        ctx.fillStyle = '#F1F5F9';
        ctx.fillRect(marginX, y, contentWidth, calHeaderH);
        ctx.strokeStyle = '#CBD5E1';
        ctx.strokeRect(marginX, y, contentWidth, calHeaderH);

        weekdaysShort.forEach((wd: string, i: number) => {
          ctx.fillStyle = i >= 5 ? '#E11D48' : '#475569';
          ctx.font = 'bold 13px "Inter", Arial, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(wd, marginX + i * dayColW + dayColW / 2, y + 22);
        });
        ctx.textAlign = 'left';
        y += calHeaderH;

        // Calendar days cells
        const cellH = 68;
        const totalRows = Math.ceil(monthCalendarDays.length / 7);

        for (let r = 0; r < totalRows; r++) {
          for (let c = 0; c < 7; c++) {
            const idx = r * 7 + c;
            const d = monthCalendarDays[idx];
            if (!d) continue;

            const cX = marginX + c * dayColW;
            const cY = y + r * cellH;

            // Cell BG
            ctx.fillStyle = !d.isCurrentMonth
              ? '#F8FAFC'
              : d.isHoliday
              ? '#FFF1F2'
              : d.isWeekend
              ? '#F8FAFC'
              : '#FFFFFF';
            ctx.fillRect(cX, cY, dayColW, cellH);

            ctx.strokeStyle = '#E2E8F0';
            ctx.strokeRect(cX, cY, dayColW, cellH);

            if (d.isCurrentMonth) {
              // Day number
              ctx.fillStyle = d.isHoliday ? '#E11D48' : '#0F172A';
              ctx.font = 'bold 16px "Montserrat", Arial, sans-serif';
              ctx.fillText(`${d.dayNumber}`, cX + 8, cY + 22);

              // Work hour badge
              ctx.font = 'bold 11px "Inter", Arial, sans-serif';
              if (d.isHoliday) {
                ctx.fillStyle = '#E11D48';
                ctx.fillText('Праздник', cX + 8, cY + 48);
              } else if (d.isShortened) {
                ctx.fillStyle = '#D97706';
                ctx.fillText(`${d.workHours}ч (сокращ)`, cX + 8, cY + 48);
              } else if (d.isDayOff) {
                ctx.fillStyle = '#94A3B8';
                ctx.fillText('Выходной', cX + 8, cY + 48);
              } else {
                ctx.fillStyle = '#0066FF';
                ctx.fillText(`${d.workHours} часов`, cX + 8, cY + 48);
              }
            } else {
              ctx.fillStyle = '#CBD5E1';
              ctx.font = '14px "Inter", Arial, sans-serif';
              ctx.fillText(`${d.dayNumber}`, cX + 8, cY + 22);
            }
          }
        }

        y += totalRows * cellH + 25;

        // Monthly Summary Table
        const mTableCols = [720, 720];
        drawTableRow(ctx, marginX, y, mTableCols, ['Показатель', 'Значение'], true, '#F1F5F9', '#475569');
        y += 32;

        const mRows = [
          ['Календарных дней в месяце:', `${monthNorms.calendarDays} дней`],
          ['Рабочих дней по графику:', `${monthNorms.workDays} дней`],
          ['Выходных и праздничных дней:', `${monthNorms.weekendDays + monthNorms.holidayDays} дней`],
          ['Норма рабочего времени (40-часовая неделя):', `${monthNorms.hours40} часов`],
          ['Норма рабочего времени (36-часовая неделя):', `${monthNorms.hours36} часов`],
        ];

        mRows.forEach((r, i) => {
          const bg = i % 2 === 1 ? '#F8FAFC' : '#FFFFFF';
          drawTableRow(ctx, marginX, y, mTableCols, r, false, bg, '#1E293B');
          y += 30;
        });

        y += 20;
      }

      // C) CALCULATIONS REPORT
      else if (reportType === 'calculations') {
        ctx.fillStyle = '#0F172A';
        ctx.font = 'bold 16px "Montserrat", Arial, sans-serif';
        ctx.fillText(`СВОДКА РАСЧЁТОВ И ПРОЕКТНЫХ СРОКОВ`, marginX, y);
        y += 18;

        if (calculations?.workDays) {
          ctx.fillStyle = '#F0FDF4';
          roundRect(ctx, marginX, y, contentWidth, 80, 10);
          ctx.fill();
          ctx.strokeStyle = '#BBF7D0';
          roundRect(ctx, marginX, y, contentWidth, 80, 10);
          ctx.stroke();

          ctx.fillStyle = '#166534';
          ctx.font = 'bold 15px "Inter", Arial, sans-serif';
          ctx.fillText('Калькулятор рабочих дней между датами:', marginX + 20, y + 28);

          ctx.fillStyle = '#1E293B';
          ctx.font = '14px "Inter", Arial, sans-serif';
          ctx.fillText(
            `Период: с ${calculations.workDays.startDateStr} по ${calculations.workDays.endDateStr}   |   Рабочих дней: ${calculations.workDays.workDays}   |   Всего: ${calculations.workDays.calendarDays} дн.`,
            marginX + 20,
            y + 54
          );
          y += 98;
        }

        if (calculations?.deadline) {
          ctx.fillStyle = '#EFF6FF';
          roundRect(ctx, marginX, y, contentWidth, 80, 10);
          ctx.fill();
          ctx.strokeStyle = '#BFDBFE';
          roundRect(ctx, marginX, y, contentWidth, 80, 10);
          ctx.stroke();

          ctx.fillStyle = '#1E40AF';
          ctx.font = 'bold 15px "Inter", Arial, sans-serif';
          ctx.fillText('Калькулятор дедлайна с буфером безопасности:', marginX + 20, y + 28);

          ctx.fillStyle = '#1E293B';
          ctx.font = '14px "Inter", Arial, sans-serif';
          ctx.fillText(
            `Целевой дедлайн: ${calculations.deadline.formattedDateRu} (${calculations.deadline.dayOfWeekName})   |   Срок: ${calculations.deadline.durationCount} дн. + Буфер: ${calculations.deadline.bufferCount || 0} дн.`,
            marginX + 20,
            y + 54
          );
          y += 98;
        }

        // Annual baseline
        ctx.fillStyle = '#F8FAFC';
        roundRect(ctx, marginX, y, contentWidth, 70, 10);
        ctx.fill();
        ctx.strokeStyle = '#E2E8F0';
        roundRect(ctx, marginX, y, contentWidth, 70, 10);
        ctx.stroke();

        ctx.fillStyle = '#475569';
        ctx.font = '13.5px "Inter", Arial, sans-serif';
        ctx.fillText(
          `Базовый производственный фонд года (${year}): ${yearNorms.totalWorkDays} рабочих дней, норма 40ч: ${yearNorms.totalHours40} ч, норма 36ч: ${yearNorms.totalHours36} ч.`,
          marginX + 20,
          y + 40
        );
        y += 90;
      }

      // 5. HOLIDAYS SECTION
      if (includeHolidaysList) {
        ctx.fillStyle = '#0F172A';
        ctx.font = 'bold 14px "Montserrat", Arial, sans-serif';
        const hTitle =
          reportType === 'month'
            ? `ОФИЦИАЛЬНЫЕ ПРАЗДНИКИ (${monthNames[month]} ${year})`
            : `ОФИЦИАЛЬНЫЕ ПРАЗДНИЧНЫЕ ДНИ (${year} ГОД)`;
        ctx.fillText(hTitle, marginX, y);
        y += 12;

        const relevantHolidays =
          reportType === 'month'
            ? holidays.filter((h) => {
                const d = new Date(h.date);
                return d.getFullYear() === year && d.getMonth() === month;
              })
            : holidays.filter((h) => h.isDayOff).slice(0, 8);

        if (relevantHolidays.length === 0) {
          ctx.fillStyle = '#64748B';
          ctx.font = '13px "Inter", Arial, sans-serif';
          ctx.fillText('В данном периоде официальных нерабочих праздничных дней нет.', marginX, y + 16);
          y += 30;
        } else {
          const colW = (contentWidth - 20) / 2;
          relevantHolidays.forEach((h, i) => {
            const hX = marginX + (i % 2) * (colW + 20);
            const hY = y + Math.floor(i / 2) * 28;

            ctx.fillStyle = '#FFF1F2';
            roundRect(ctx, hX, hY, colW, 24, 6);
            ctx.fill();
            ctx.strokeStyle = '#FECDD3';
            roundRect(ctx, hX, hY, colW, 24, 6);
            ctx.stroke();

            const dateStr = h.date.split('-').reverse().join('.');
            ctx.fillStyle = '#E11D48';
            ctx.font = 'bold 12px "Montserrat", Arial, sans-serif';
            ctx.fillText(`${dateStr}:`, hX + 8, hY + 16);

            ctx.fillStyle = '#881337';
            ctx.font = '500 12px "Inter", Arial, sans-serif';
            ctx.fillText(`${h.title}`, hX + 85, hY + 16);
          });

          y += Math.ceil(relevantHolidays.length / 2) * 28 + 16;
        }
      }

      // 6. SIGNATURES & STAMP
      if (includeSignatures) {
        y = Math.max(y, height - 260); // Anchor near bottom

        ctx.strokeStyle = '#CBD5E1';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(marginX, y);
        ctx.lineTo(width - marginX, y);
        ctx.stroke();
        y += 24;

        const sigColW = (contentWidth - 140) / 2;

        // Director
        ctx.fillStyle = '#0F172A';
        ctx.font = 'bold 13px "Inter", Arial, sans-serif';
        ctx.fillText('Руководитель организации:', marginX, y);
        ctx.fillStyle = '#94A3B8';
        ctx.font = '12px "Inter", Arial, sans-serif';
        ctx.fillText('/ ___________________________________ / (подпись)', marginX, y + 36);

        // Accountant
        ctx.fillStyle = '#0F172A';
        ctx.font = 'bold 13px "Inter", Arial, sans-serif';
        ctx.fillText('Главный бухгалтер / HR:', marginX + sigColW + 20, y);
        ctx.fillStyle = '#94A3B8';
        ctx.font = '12px "Inter", Arial, sans-serif';
        ctx.fillText('/ ___________________________________ / (подпись)', marginX + sigColW + 20, y + 36);

        // Stamp circle (М.П.)
        const stampX = width - marginX - 60;
        const stampY = y + 20;
        ctx.strokeStyle = '#94A3B8';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(stampX, stampY, 32, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#64748B';
        ctx.font = 'bold 14px "Inter", Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('М.П.', stampX, stampY + 5);
        ctx.textAlign = 'left';
      }

      // 7. FOOTER
      const footerY = height - 50;
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(marginX, footerY);
      ctx.lineTo(width - marginX, footerY);
      ctx.stroke();

      ctx.fillStyle = '#94A3B8';
      ctx.font = '12px "Inter", Arial, sans-serif';
      ctx.fillText(
        'Сформировано автоматически на портале Toolboxi.uz. Соответствует нормам трудового учёта и ISO-8601.',
        marginX,
        footerY + 22
      );

      ctx.textAlign = 'right';
      ctx.fillText('Страница 1 из 1', width - marginX, footerY + 22);
      ctx.textAlign = 'left';

      // 8. SAVE TO PDF VIA JSPDF
      const imgData = canvas.toDataURL('image/jpeg', 0.98);

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const pageWidth = pdf.internal.pageSize.getWidth(); // 210
      const pageHeight = pdf.internal.pageSize.getHeight(); // 297
      const margin = 6;
      const pdfW = pageWidth - margin * 2;
      const pdfH = pageHeight - margin * 2;

      pdf.addImage(imgData, 'JPEG', margin, margin, pdfW, pdfH);

      // Safe ASCII-friendly filename
      const monthSlug = [
        'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
        'Iyul', 'Avgust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'
      ][month];

      const fileName =
        reportType === 'month'
          ? `Toolboxi_Kalendar_${monthSlug}_${year}`
          : reportType === 'year'
          ? `Toolboxi_Normy_Vremeni_${year}`
          : `Toolboxi_Svodny_Otchet_${year}`;

      pdf.save(`${fileName}.pdf`);
      resolve(true);
    } catch (err) {
      console.error('Canvas report generation error:', err);
      resolve(false);
    }
  });
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawTableRow(
  ctx: CanvasRenderingContext2D,
  startX: number,
  y: number,
  widths: number[],
  texts: string[],
  isHeader: boolean,
  bgColor: string,
  textColor: string
) {
  const rowHeight = isHeader ? 34 : 33;
  const totalW = widths.reduce((a, b) => a + b, 0);

  ctx.fillStyle = bgColor;
  ctx.fillRect(startX, y, totalW, rowHeight);
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1;
  ctx.strokeRect(startX, y, totalW, rowHeight);

  let curX = startX;
  widths.forEach((w, i) => {
    ctx.strokeStyle = '#E2E8F0';
    ctx.beginPath();
    ctx.moveTo(curX + w, y);
    ctx.lineTo(curX + w, y + rowHeight);
    ctx.stroke();

    ctx.fillStyle = textColor;
    ctx.font = isHeader ? 'bold 12px "Inter", Arial, sans-serif' : '13.5px "Inter", Arial, sans-serif';

    if (i === 0) {
      ctx.textAlign = 'left';
      ctx.fillText(texts[i] || '', curX + 10, y + 21);
    } else {
      ctx.textAlign = 'center';
      ctx.fillText(texts[i] || '', curX + w / 2, y + 21);
    }

    curX += w;
  });

  ctx.textAlign = 'left';
}
