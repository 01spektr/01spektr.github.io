export type CountryCode =
  | 'UZ'
  | 'KZ'
  | 'RU'
  | 'KG'
  | 'BY'
  | 'US'
  | 'GB'
  | 'DE'
  | 'FR'
  | 'AE'
  | 'TR'
  | 'CN'
  | 'JP'
  | 'CA'
  | 'IN'
  | 'ES'
  | 'IT'
  | 'BR'
  | 'GLOBAL';

export type Language = 'ru' | 'uz' | 'en';

export type WorkWeekType = '5_DAYS' | '6_DAYS' | '4_DAYS' | '5_DAYS_SUN_THU';

export type FirstDayOfWeek = 0 | 1; // 0 = Sunday, 1 = Monday

export type HolidayType = 'holiday' | 'shortened' | 'transferred' | 'memorial';

export interface Holiday {
  date: string; // YYYY-MM-DD
  title: string;
  type: HolidayType;
  isDayOff: boolean;
  note?: string;
}

export interface DayInfo {
  date: Date;
  dateStr: string; // YYYY-MM-DD
  dayNumber: number;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, ...
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  isHoliday: boolean;
  isShortened: boolean;
  isTransferred: boolean;
  isDayOff: boolean;
  holiday?: Holiday;
  isoWeek: number;
  workHours: number;
}

export interface MonthLaborNorms {
  month: number; // 0-11
  monthName: string;
  calendarDays: number;
  workDays: number;
  weekendDays: number;
  holidayDays: number;
  shortenedDays: number;
  hours40: number;
  hours36: number;
  hours24: number;
}

export interface YearLaborNorms {
  year: number;
  country: CountryCode;
  workWeekType: WorkWeekType;
  months: MonthLaborNorms[];
  quarters: {
    quarter: number;
    calendarDays: number;
    workDays: number;
    weekendDays: number;
    hours40: number;
    hours36: number;
    hours24: number;
  }[];
  totalCalendarDays: number;
  totalWorkDays: number;
  totalWeekendDays: number;
  totalHolidays: number;
  totalHours40: number;
  totalHours36: number;
  totalHours24: number;
}

export interface CalculationHistoryItem {
  id: string;
  type: 'work_days' | 'add_days' | 'deadline' | 'diff';
  title: string;
  summary: string;
  timestamp: number;
  data: Record<string, any>;
}
