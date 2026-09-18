export interface CityTimezone {
  id: string;
  city: string;
  cityRu: string;
  country: string;
  countryRu: string;
  countryCode: string;
  flag: string;
  timezone: string; // IANA timezone e.g. "Asia/Tashkent"
  utcOffsetHours: number; // approximate base standard offset
  continent: 'Европа' | 'Азия' | 'Северная Америка' | 'Южная Америка' | 'Африка' | 'Океания';
  lat: number;
  lng: number;
  isHome?: boolean;
  isFavorite?: boolean;
}

export interface CityRowState extends CityTimezone {
  localTimeString: string;
  localTimeFormatted12: string;
  localTimeFormatted24: string;
  localDateFormatted: string;
  currentHourFloat: number; // e.g. 10.45
  currentHourInt: number; // 10
  currentMinute: number; // 27
  utcOffsetDisplay: string; // e.g. "UTC +5"
}

export interface MeetingRecommendation {
  startTime: number; // hour (0-23)
  endTime: number;
  referenceCityName: string;
  breakdown: {
    cityRu: string;
    timeRange: string;
  }[];
  quality: 'optimal' | 'acceptable' | 'challenging';
}
