import { CityTimezone, CityRowState, MeetingRecommendation } from '../types';

/**
 * Gets exact current date & time parts in a given IANA timezone
 */
export function getTimeInTimezone(timezone: string, baseDate: Date = new Date()): {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  dayOfWeek: number;
  dayOfWeekShortRu: string;
  monthShortRu: string;
} {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      weekday: 'short',
      hour12: false,
    });

    const parts = formatter.formatToParts(baseDate);
    const getPart = (type: string) => {
      const p = parts.find((pt) => pt.type === type);
      return p ? p.value : '0';
    };

    let hour = parseInt(getPart('hour'), 10);
    if (hour === 24) hour = 0;
    const minute = parseInt(getPart('minute'), 10);
    const second = parseInt(getPart('second'), 10);
    const year = parseInt(getPart('year'), 10);
    const month = parseInt(getPart('month'), 10);
    const day = parseInt(getPart('day'), 10);

    // Get Russian day of week and month
    const ruFormatter = new Intl.DateTimeFormat('ru-RU', {
      timeZone: timezone,
      weekday: 'short',
      month: 'short',
    });
    const ruParts = ruFormatter.formatToParts(baseDate);
    const dayOfWeekShortRu = ruParts.find((p) => p.type === 'weekday')?.value || 'Пн';
    const monthShortRu = ruParts.find((p) => p.type === 'month')?.value || 'янв';

    return {
      year,
      month,
      day,
      hour,
      minute,
      second,
      dayOfWeek: baseDate.getDay(),
      dayOfWeekShortRu: capitalizeFirst(dayOfWeekShortRu),
      monthShortRu,
    };
  } catch {
    // Fallback if timezone not supported
    return {
      year: baseDate.getFullYear(),
      month: baseDate.getMonth() + 1,
      day: baseDate.getDate(),
      hour: baseDate.getHours(),
      minute: baseDate.getMinutes(),
      second: baseDate.getSeconds(),
      dayOfWeek: baseDate.getDay(),
      dayOfWeekShortRu: 'Пн',
      monthShortRu: 'янв',
    };
  }
}

function capitalizeFirst(str: string) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Calculates current UTC offset string like "UTC +5", "UTC -4", "UTC +0"
 */
export function getUtcOffsetString(timezone: string, baseDate: Date = new Date()): string {
  try {
    const tzDate = new Date(baseDate.toLocaleString('en-US', { timeZone: timezone }));
    const utcDate = new Date(baseDate.toLocaleString('en-US', { timeZone: 'UTC' }));
    const diffHours = (tzDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60);

    const rounded = Math.round(diffHours * 2) / 2;
    if (rounded === 0) return 'UTC +0';
    if (rounded > 0) {
      return Number.isInteger(rounded) ? `UTC +${rounded}` : `UTC +${rounded}`;
    } else {
      return Number.isInteger(rounded) ? `UTC ${rounded}` : `UTC ${rounded}`;
    }
  } catch {
    return 'UTC';
  }
}

/**
 * Formats time in 24h ("10:24") or 12h ("10:24 AM")
 */
export function formatTimeDisplay(hour: number, minute: number, is24h: boolean = true): string {
  const padH = hour.toString().padStart(2, '0');
  const padM = minute.toString().padStart(2, '0');
  if (is24h) {
    return `${padH}:${padM}`;
  }
  const period = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 || 12;
  return `${h12}:${padM} ${period}`;
}

/**
 * Calculates full state for a city row
 */
export function getCityRowState(
  city: CityTimezone,
  baseDate: Date = new Date(),
  scrubHourOffset: number | null = null,
  referenceTimezone: string = 'Asia/Tashkent'
): CityRowState {
  let targetDate = new Date(baseDate);

  // If user is scrubbing the timeline relative to the reference timezone
  if (scrubHourOffset !== null) {
    // Determine how much scrubHourOffset differs from current reference hour
    const refNow = getTimeInTimezone(referenceTimezone, baseDate);
    const currentRefFraction = refNow.hour + refNow.minute / 60;
    const diffHours = scrubHourOffset - currentRefFraction;
    targetDate = new Date(baseDate.getTime() + diffHours * 60 * 60 * 1000);
  }

  const timeData = getTimeInTimezone(city.timezone, targetDate);
  const currentHourFloat = timeData.hour + timeData.minute / 60;

  const padH = timeData.hour.toString().padStart(2, '0');
  const padM = timeData.minute.toString().padStart(2, '0');
  const localTimeFormatted24 = `${padH}:${padM}`;

  const period = timeData.hour >= 12 ? 'PM' : 'AM';
  const h12 = timeData.hour % 12 || 12;
  const localTimeFormatted12 = `${h12}:${padM} ${period}`;

  const localDateFormatted = `${timeData.dayOfWeekShortRu}, ${timeData.day} ${timeData.monthShortRu}`;
  const utcOffsetDisplay = getUtcOffsetString(city.timezone, targetDate);

  return {
    ...city,
    localTimeString: `${padH}:${padM}:${timeData.second.toString().padStart(2, '0')}`,
    localTimeFormatted12,
    localTimeFormatted24,
    localDateFormatted,
    currentHourFloat,
    currentHourInt: timeData.hour,
    currentMinute: timeData.minute,
    utcOffsetDisplay,
  };
}

/**
 * Determines whether a given hour (0-23) in a city is:
 * - 'night': 22:00 - 06:00
 * - 'work': 09:00 - 18:00
 * - 'day': 06:00 - 09:00 or 18:00 - 22:00
 */
export function getHourSegmentType(hour: number): 'night' | 'day' | 'work' {
  const normHour = (hour + 24) % 24;
  if (normHour >= 9 && normHour < 18) {
    return 'work';
  }
  if (normHour >= 22 || normHour < 6) {
    return 'night';
  }
  return 'day';
}

/**
 * Calculates the best meeting window for selected cities
 * Evaluates candidate 2-hour slots in reference city (00:00 to 23:00)
 */
export function calculateBestMeetingTime(
  cities: CityTimezone[],
  referenceCity: CityTimezone = cities[0] || {
    id: 'tashkent',
    city: 'Tashkent',
    cityRu: 'Ташкент',
    country: 'Uzbekistan',
    countryRu: 'Узбекистан',
    countryCode: 'uz',
    flag: '🇺🇿',
    timezone: 'Asia/Tashkent',
    utcOffsetHours: 5,
    continent: 'Азия',
    lat: 41.2995,
    lng: 69.2401,
  },
  baseDate: Date = new Date()
): MeetingRecommendation {
  if (cities.length === 0) {
    return {
      startTime: 15,
      endTime: 17,
      referenceCityName: referenceCity.cityRu,
      breakdown: [],
      quality: 'optimal',
    };
  }

  let bestSlotStart = 15;
  let maxScore = -9999;

  // Evaluate slots starting from 08:00 to 22:00 in reference city
  for (let startH = 8; startH <= 20; startH++) {
    const endH = startH + 2;
    let slotScore = 0;

    for (const city of cities) {
      // Calculate local hours for start and end in this city
      const sampleRefDate = new Date(baseDate);
      const refTime = getTimeInTimezone(referenceCity.timezone, sampleRefDate);
      const diffHours = startH - (refTime.hour + refTime.minute / 60);
      const testDate = new Date(sampleRefDate.getTime() + diffHours * 60 * 60 * 1000);

      const cityTime = getTimeInTimezone(city.timezone, testDate);
      const cityHour = cityTime.hour;

      // Score based on local convenience:
      // Ideal work hours 09:00 - 18:00 (+10)
      // Extended acceptable 08:00 - 09:00 or 18:00 - 20:00 (+4)
      // Evening 20:00 - 22:00 or morning 07:00 - 08:00 (-2)
      // Late night / sleep 22:00 - 07:00 (-20)
      if (cityHour >= 9 && cityHour + 2 <= 18) {
        slotScore += 10;
      } else if (cityHour >= 8 && cityHour + 2 <= 20) {
        slotScore += 4;
      } else if (cityHour >= 7 && cityHour + 2 <= 22) {
        slotScore += 0;
      } else {
        slotScore -= 20;
      }
    }

    if (slotScore > maxScore) {
      maxScore = slotScore;
      bestSlotStart = startH;
    }
  }

  const bestSlotEnd = bestSlotStart + 2;

  // Build breakdown for each city
  const breakdown = cities.map((city) => {
    const sampleRefDate = new Date(baseDate);
    const refTime = getTimeInTimezone(referenceCity.timezone, sampleRefDate);
    const diffHours = bestSlotStart - (refTime.hour + refTime.minute / 60);
    const testDateStart = new Date(sampleRefDate.getTime() + diffHours * 60 * 60 * 1000);
    const testDateEnd = new Date(testDateStart.getTime() + 2 * 60 * 60 * 1000);

    const cStart = getTimeInTimezone(city.timezone, testDateStart);
    const cEnd = getTimeInTimezone(city.timezone, testDateEnd);

    const sH = cStart.hour.toString().padStart(2, '0');
    const sM = cStart.minute.toString().padStart(2, '0');
    const eH = cEnd.hour.toString().padStart(2, '0');
    const eM = cEnd.minute.toString().padStart(2, '0');

    return {
      cityRu: city.cityRu,
      timeRange: `${sH}:${sM} – ${eH}:${eM}`,
    };
  });

  return {
    startTime: bestSlotStart,
    endTime: bestSlotEnd,
    referenceCityName: referenceCity.cityRu,
    breakdown,
    quality: maxScore >= cities.length * 8 ? 'optimal' : maxScore >= 0 ? 'acceptable' : 'challenging',
  };
}
