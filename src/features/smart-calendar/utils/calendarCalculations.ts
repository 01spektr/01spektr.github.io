import {
  CountryCode,
  DayInfo,
  Holiday,
  MonthLaborNorms,
  WorkWeekType,
  YearLaborNorms,
} from '../types/calendar';
import {
  MONTH_NAMES_GENITIVE,
  MONTH_NAMES_RU,
  WEEKDAYS_FULL,
  getHolidaysForYear,
} from '../data/holidays';

export const pad = (n: number): string => (n < 10 ? `0${n}` : `${n}`);

export function toDateString(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function parseDate(str: string): Date {
  if (!str) return new Date();
  // Handles YYYY-MM-DD or DD.MM.YYYY
  if (str.includes('.')) {
    const parts = str.split('.');
    if (parts.length === 3) {
      return new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
    }
  }
  const parts = str.split('-');
  if (parts.length === 3) {
    return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  }
  return new Date(str);
}

export function formatDateRu(d: Date): string {
  return `${d.getDate()} ${MONTH_NAMES_GENITIVE[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatDateShort(d: Date): string {
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
}

export function getDayOfWeekName(d: Date): string {
  return WEEKDAYS_FULL[d.getDay()];
}

// Calculate ISO 8601 week number
export function getISOWeek(date: Date): number {
  const target = new Date(date.valueOf());
  const dayNumber = (date.getDay() + 6) % 7; // Monday = 0, Sunday = 6
  target.setDate(target.getDate() - dayNumber + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
  }
  return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
}

// Calculate day of the year (1-366)
export function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

// Check if a year is leap year
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

// Check if a day is weekend based on work week type
export function isWeekendDay(date: Date, workWeekType: WorkWeekType): boolean {
  const day = date.getDay(); // 0 is Sunday, 6 is Saturday, 5 is Friday
  if (workWeekType === '5_DAYS') {
    return day === 0 || day === 6;
  }
  if (workWeekType === '5_DAYS_SUN_THU') {
    return day === 5 || day === 6; // Friday and Saturday weekend
  }
  if (workWeekType === '4_DAYS') {
    return day === 0 || day === 5 || day === 6; // Mon-Thu work days
  }
  // 6_DAYS: only Sunday is regular weekend
  return day === 0;
}

// Check day status
export function getDayStatus(
  date: Date,
  country: CountryCode,
  workWeekType: WorkWeekType,
  holidaysList?: Holiday[]
) {
  const dateStr = toDateString(date);
  const year = date.getFullYear();
  const holidays = holidaysList || getHolidaysForYear(country, year);
  const holiday = holidays.find((h) => h.date === dateStr);
  const isWeekend = isWeekendDay(date, workWeekType);

  let isDayOff = isWeekend;
  let isHoliday = false;
  let isShortened = false;
  let isTransferred = false;

  if (holiday) {
    if (holiday.type === 'holiday') {
      isHoliday = true;
      if (holiday.isDayOff) isDayOff = true;
    } else if (holiday.type === 'transferred') {
      isTransferred = true;
      if (holiday.isDayOff) isDayOff = true;
    } else if (holiday.type === 'shortened') {
      isShortened = true;
    }
  }

  // Calculate standard work hours
  let workHours = 0;
  if (!isDayOff) {
    if (workWeekType === '4_DAYS') {
      workHours = isShortened ? 9 : 10;
    } else if (workWeekType === '5_DAYS' || workWeekType === '5_DAYS_SUN_THU') {
      workHours = isShortened ? 7 : 8;
    } else {
      // 6-day week: Mon-Fri 7h, Sat 5h
      const day = date.getDay();
      if (day === 6) {
        workHours = isShortened ? 4 : 5;
      } else {
        workHours = isShortened ? 6 : 7;
      }
    }
  }

  return {
    isWeekend,
    isDayOff,
    isHoliday,
    isShortened,
    isTransferred,
    holiday,
    workHours,
  };
}

// Generate calendar days grid for a given year & month (0-11)
export function getMonthCalendarDays(
  year: number,
  month: number,
  country: CountryCode,
  workWeekType: WorkWeekType,
  today: Date = new Date(2026, 8, 26), // Default 26 Sept 2026 as per screenshot context
  firstDayOfWeek: 0 | 1 = 1 // 1 = Monday, 0 = Sunday
): DayInfo[] {
  const holidays = [
    ...getHolidaysForYear(country, year - 1),
    ...getHolidaysForYear(country, year),
    ...getHolidaysForYear(country, year + 1),
  ];

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Calculate start day of week based on firstDayOfWeek (1: Mon=0..Sun=6; 0: Sun=0..Sat=6)
  const startDayOfWeek = firstDayOfWeek === 1
    ? (firstDay.getDay() + 6) % 7
    : firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const days: DayInfo[] = [];

  // Previous month trailing days
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const prevDate = new Date(year, month - 1, prevMonthLastDay - i);
    const dateStr = toDateString(prevDate);
    const status = getDayStatus(prevDate, country, workWeekType, holidays);
    days.push({
      date: prevDate,
      dateStr,
      dayNumber: prevDate.getDate(),
      dayOfWeek: prevDate.getDay(),
      isCurrentMonth: false,
      isToday: toDateString(prevDate) === toDateString(today),
      isWeekend: status.isWeekend,
      isHoliday: status.isHoliday,
      isShortened: status.isShortened,
      isTransferred: status.isTransferred,
      isDayOff: status.isDayOff,
      holiday: status.holiday,
      isoWeek: getISOWeek(prevDate),
      workHours: status.workHours,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const currDate = new Date(year, month, d);
    const dateStr = toDateString(currDate);
    const status = getDayStatus(currDate, country, workWeekType, holidays);
    days.push({
      date: currDate,
      dateStr,
      dayNumber: d,
      dayOfWeek: currDate.getDay(),
      isCurrentMonth: true,
      isToday: toDateString(currDate) === toDateString(today),
      isWeekend: status.isWeekend,
      isHoliday: status.isHoliday,
      isShortened: status.isShortened,
      isTransferred: status.isTransferred,
      isDayOff: status.isDayOff,
      holiday: status.holiday,
      isoWeek: getISOWeek(currDate),
      workHours: status.workHours,
    });
  }

  // Next month leading days to complete full grid (multiples of 7, 35 or 42 cells)
  const remaining = (7 - (days.length % 7)) % 7;
  for (let n = 1; n <= remaining; n++) {
    const nextDate = new Date(year, month + 1, n);
    const dateStr = toDateString(nextDate);
    const status = getDayStatus(nextDate, country, workWeekType, holidays);
    days.push({
      date: nextDate,
      dateStr,
      dayNumber: n,
      dayOfWeek: nextDate.getDay(),
      isCurrentMonth: false,
      isToday: toDateString(nextDate) === toDateString(today),
      isWeekend: status.isWeekend,
      isHoliday: status.isHoliday,
      isShortened: status.isShortened,
      isTransferred: status.isTransferred,
      isDayOff: status.isDayOff,
      holiday: status.holiday,
      isoWeek: getISOWeek(nextDate),
      workHours: status.workHours,
    });
  }

  return days;
}

// Calculate work days between two dates inclusive
export function calculateWorkDaysBetween(
  startDateStr: string,
  endDateStr: string,
  country: CountryCode,
  workWeekType: WorkWeekType
) {
  let start = parseDate(startDateStr);
  let end = parseDate(endDateStr);

  const isReversed = start.getTime() > end.getTime();
  if (isReversed) {
    const temp = start;
    start = end;
    end = temp;
  }

  const holidays = [
    ...getHolidaysForYear(country, start.getFullYear() - 1),
    ...getHolidaysForYear(country, start.getFullYear()),
    ...getHolidaysForYear(country, end.getFullYear()),
    ...getHolidaysForYear(country, end.getFullYear() + 1),
  ];

  let calendarDays = 0;
  let workDays = 0;
  let weekendDays = 0;
  let holidayDays = 0;
  let shortenedDays = 0;
  let totalHours40 = 0;

  const current = new Date(start.getTime());
  while (current.getTime() <= end.getTime()) {
    calendarDays++;
    const status = getDayStatus(current, country, workWeekType, holidays);

    if (status.isDayOff) {
      if (status.isHoliday || status.isTransferred) {
        holidayDays++;
      } else {
        weekendDays++;
      }
    } else {
      workDays++;
      if (status.isShortened) shortenedDays++;
      totalHours40 += status.workHours;
    }

    current.setDate(current.getDate() + 1);
  }

  return {
    calendarDays,
    workDays,
    weekendDays,
    holidayDays,
    shortenedDays,
    totalHours40,
    startDateStr: toDateString(start),
    endDateStr: toDateString(end),
    isReversed,
  };
}

// Add or subtract days
export function addOrSubtractDays(
  startDateStr: string,
  count: number,
  isAdd: boolean,
  isWorkDaysOnly: boolean,
  country: CountryCode,
  workWeekType: WorkWeekType
) {
  const start = parseDate(startDateStr);
  const step = isAdd ? 1 : -1;
  const current = new Date(start.getTime());

  const holidays = [
    ...getHolidaysForYear(country, start.getFullYear() - 1),
    ...getHolidaysForYear(country, start.getFullYear()),
    ...getHolidaysForYear(country, start.getFullYear() + 1),
    ...getHolidaysForYear(country, start.getFullYear() + 2),
  ];

  let added = 0;
  let skippedWeekends = 0;
  let skippedHolidays = 0;

  if (isWorkDaysOnly) {
    while (added < count) {
      current.setDate(current.getDate() + step);
      const status = getDayStatus(current, country, workWeekType, holidays);
      if (status.isDayOff) {
        if (status.isHoliday || status.isTransferred) {
          skippedHolidays++;
        } else {
          skippedWeekends++;
        }
      } else {
        added++;
      }
    }
  } else {
    for (let i = 0; i < count; i++) {
      current.setDate(current.getDate() + step);
      const status = getDayStatus(current, country, workWeekType, holidays);
      if (status.isDayOff) {
        if (status.isHoliday || status.isTransferred) {
          skippedHolidays++;
        } else {
          skippedWeekends++;
        }
      }
    }
  }

  return {
    resultDate: current,
    resultDateStr: toDateString(current),
    formattedDateRu: formatDateRu(current),
    dayOfWeekName: getDayOfWeekName(current),
    skippedWeekends,
    skippedHolidays,
    isoWeek: getISOWeek(current),
  };
}

// Calculate deadline with duration and optional buffer
export function calculateDeadline(
  startDateStr: string,
  durationCount: number,
  durationType: 'work_days' | 'calendar_days',
  bufferCount: number = 0,
  bufferType: 'work_days' | 'calendar_days' = 'work_days',
  country: CountryCode,
  workWeekType: WorkWeekType
) {
  const isWorkDaysDuration = durationType === 'work_days';
  const durationResult = addOrSubtractDays(
    startDateStr,
    durationCount,
    true,
    isWorkDaysDuration,
    country,
    workWeekType
  );

  let finalResult = durationResult;
  if (bufferCount > 0) {
    const isWorkDaysBuffer = bufferType === 'work_days';
    finalResult = addOrSubtractDays(
      durationResult.resultDateStr,
      bufferCount,
      true,
      isWorkDaysBuffer,
      country,
      workWeekType
    );
  }

  const totalCalculatedDays = durationCount + bufferCount;

  return {
    durationDateStr: durationResult.resultDateStr,
    finalDate: finalResult.resultDate,
    finalDateStr: finalResult.resultDateStr,
    formattedDateRu: formatDateRu(finalResult.resultDate),
    dayOfWeekName: getDayOfWeekName(finalResult.resultDate),
    durationCount,
    bufferCount,
    totalDays: totalCalculatedDays,
    skippedWeekends: durationResult.skippedWeekends + (bufferCount > 0 ? finalResult.skippedWeekends : 0),
    skippedHolidays: durationResult.skippedHolidays + (bufferCount > 0 ? finalResult.skippedHolidays : 0),
  };
}

// Calculate month labor norms
export function getMonthLaborNorms(
  year: number,
  month: number,
  country: CountryCode,
  workWeekType: WorkWeekType
): MonthLaborNorms {
  const lastDay = new Date(year, month + 1, 0).getDate();
  const holidays = getHolidaysForYear(country, year);

  let workDays = 0;
  let weekendDays = 0;
  let holidayDays = 0;
  let shortenedDays = 0;

  for (let d = 1; d <= lastDay; d++) {
    const curr = new Date(year, month, d);
    const status = getDayStatus(curr, country, workWeekType, holidays);
    if (status.isDayOff) {
      if (status.isHoliday || status.isTransferred) {
        holidayDays++;
      } else {
        weekendDays++;
      }
    } else {
      workDays++;
      if (status.isShortened) shortenedDays++;
    }
  }

  // Work hour standard calculation:
  // 40 hours/week: 5-day is 8h/day, 6-day is 7h Mon-Fri + 5h Sat.
  // Shortened pre-holiday days are -1 hour.
  const hours40 = workDays * 8 - shortenedDays;
  const hours36 = workDays * 7.2 - shortenedDays;
  const hours24 = workDays * 4.8 - shortenedDays;

  return {
    month,
    monthName: MONTH_NAMES_RU[month],
    calendarDays: lastDay,
    workDays,
    weekendDays,
    holidayDays,
    shortenedDays,
    hours40: Math.round(hours40 * 10) / 10,
    hours36: Math.round(hours36 * 10) / 10,
    hours24: Math.round(hours24 * 10) / 10,
  };
}

// Get full year labor norms
export function getYearLaborNorms(
  year: number,
  country: CountryCode,
  workWeekType: WorkWeekType
): YearLaborNorms {
  const months: MonthLaborNorms[] = [];
  for (let m = 0; m < 12; m++) {
    months.push(getMonthLaborNorms(year, m, country, workWeekType));
  }

  const quarters = [
    { quarter: 1, months: [0, 1, 2] },
    { quarter: 2, months: [3, 4, 5] },
    { quarter: 3, months: [6, 7, 8] },
    { quarter: 4, months: [9, 10, 11] },
  ].map((q) => {
    const qMonths = q.months.map((m) => months[m]);
    return {
      quarter: q.quarter,
      calendarDays: qMonths.reduce((acc, cur) => acc + cur.calendarDays, 0),
      workDays: qMonths.reduce((acc, cur) => acc + cur.workDays, 0),
      weekendDays: qMonths.reduce((acc, cur) => acc + cur.weekendDays, 0),
      hours40: Math.round(qMonths.reduce((acc, cur) => acc + cur.hours40, 0) * 10) / 10,
      hours36: Math.round(qMonths.reduce((acc, cur) => acc + cur.hours36, 0) * 10) / 10,
      hours24: Math.round(qMonths.reduce((acc, cur) => acc + cur.hours24, 0) * 10) / 10,
    };
  });

  const totalCalendarDays = months.reduce((acc, m) => acc + m.calendarDays, 0);
  const totalWorkDays = months.reduce((acc, m) => acc + m.workDays, 0);
  const totalWeekendDays = months.reduce((acc, m) => acc + m.weekendDays, 0);
  const totalHolidays = months.reduce((acc, m) => acc + m.holidayDays, 0);
  const totalHours40 = Math.round(months.reduce((acc, m) => acc + m.hours40, 0) * 10) / 10;
  const totalHours36 = Math.round(months.reduce((acc, m) => acc + m.hours36, 0) * 10) / 10;
  const totalHours24 = Math.round(months.reduce((acc, m) => acc + m.hours24, 0) * 10) / 10;

  return {
    year,
    country,
    workWeekType,
    months,
    quarters,
    totalCalendarDays,
    totalWorkDays,
    totalWeekendDays,
    totalHolidays,
    totalHours40,
    totalHours36,
    totalHours24,
  };
}
