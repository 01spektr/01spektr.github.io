import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeftRight, 
  Clock, 
  Sun, 
  Moon, 
  Briefcase, 
  Copy, 
  Check, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Calendar as CalendarIcon,
  Sparkles,
  Search,
  ExternalLink
} from 'lucide-react';
import { CityTimezone } from '../types';
import { getTimeInTimezone, getUtcOffsetString, getHourSegmentType } from '../utils/timezone';
import { FlagIcon } from './FlagIcon';
import { useWorldTimezonesI18n } from '../i18n';

interface MainTimeConverterProps {
  allCities: CityTimezone[];
  onOpenAddModal?: () => void;
  externalToCityId?: string;
}

export const MainTimeConverter: React.FC<MainTimeConverterProps> = ({
  allCities,
  externalToCityId,
}) => {
  const { locale, t, tr, cityName, countryName } = useWorldTimezonesI18n();
  // Primary pair of cities
  const [fromCityId, setFromCityId] = useState<string>('tashkent');
  const [toCityId, setToCityId] = useState<string>('london');

  // React to external city selection from map or directory
  useEffect(() => {
    if (externalToCityId) {
      setToCityId(externalToCityId);
    }
  }, [externalToCityId]);
  
  // Optional extra comparison cities
  const [extraCityIds, setExtraCityIds] = useState<string[]>(['new_york', 'tokyo']);

  // Time state in the "from" city
  const [now, setNow] = useState<Date>(new Date());
  const [isLive, setIsLive] = useState<boolean>(true);
  const [selectedHour, setSelectedHour] = useState<number>(() => {
    const cur = getTimeInTimezone('Asia/Tashkent', new Date());
    return cur.hour;
  });
  const [selectedMinute, setSelectedMinute] = useState<number>(() => {
    const cur = getTimeInTimezone('Asia/Tashkent', new Date());
    return cur.minute;
  });

  const [is24h, setIs24h] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [isAddingExtraCity, setIsAddingExtraCity] = useState<boolean>(false);
  const [extraCitySearch, setExtraCitySearch] = useState<string>('');

  // Update clock every second when in live mode
  useEffect(() => {
    const timer = setInterval(() => {
      const current = new Date();
      setNow(current);
      if (isLive) {
        const fromCity = allCities.find((c) => c.id === fromCityId) || allCities[0];
        const cur = getTimeInTimezone(fromCity.timezone, current);
        setSelectedHour(cur.hour);
        setSelectedMinute(cur.minute);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isLive, fromCityId, allCities]);

  const fromCity = allCities.find((c) => c.id === fromCityId) || allCities[0];
  const toCity = allCities.find((c) => c.id === toCityId) || allCities[1];

  // Helper to convert time from fromCity to targetCity
  const convertTime = (targetCity: CityTimezone, srcHour: number, srcMinute: number) => {
    const srcCurrent = getTimeInTimezone(fromCity.timezone, now);
    const targetCurrent = getTimeInTimezone(targetCity.timezone, now);
    
    // Compare complete local date-time values so crossing midnight does not
    // turn a -4 hour offset into +20 hours.
    const srcWallClock = Date.UTC(srcCurrent.year, srcCurrent.month - 1, srcCurrent.day, srcCurrent.hour, srcCurrent.minute);
    const targetWallClock = Date.UTC(targetCurrent.year, targetCurrent.month - 1, targetCurrent.day, targetCurrent.hour, targetCurrent.minute);
    const diffHours = (targetWallClock - srcWallClock) / (60 * 60 * 1000);

    const totalSrcMinutes = srcHour * 60 + srcMinute;
    const totalTargetMinutes = Math.round(totalSrcMinutes + diffHours * 60);

    let dayShift = 0;
    if (totalTargetMinutes >= 24 * 60) {
      dayShift = Math.floor(totalTargetMinutes / (24 * 60));
    } else if (totalTargetMinutes < 0) {
      dayShift = Math.floor(totalTargetMinutes / (24 * 60));
    }

    const normalizedMinutes = (totalTargetMinutes % (24 * 60) + 24 * 60) % (24 * 60);
    const hour = Math.floor(normalizedMinutes / 60);
    const minute = normalizedMinutes % 60;
    const segment = getHourSegmentType(hour);

    return {
      hour,
      minute,
      diffHours: Math.round(diffHours * 10) / 10,
      dayShift,
      segment,
    };
  };

  const toResult = convertTime(toCity, selectedHour, selectedMinute);

  // Swap cities
  const handleSwap = () => {
    setFromCityId(toCityId);
    setToCityId(fromCityId);
    setSelectedHour(toResult.hour);
    setSelectedMinute(toResult.minute);
    setIsLive(false);
  };

  // Reset to current time
  const handleResetNow = () => {
    const cur = getTimeInTimezone(fromCity.timezone, new Date());
    setSelectedHour(cur.hour);
    setSelectedMinute(cur.minute);
    setIsLive(true);
  };

  // Time preset buttons
  const handleSelectPreset = (hour: number, minute: number = 0) => {
    setIsLive(false);
    setSelectedHour(hour);
    setSelectedMinute(minute);
  };

  // Copy converted output
  const handleCopy = () => {
    const formatH = (h: number, m: number) =>
      `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;

    const fromText = `${formatH(selectedHour, selectedMinute)} (${cityName(fromCity)})`;
    const toText = `${formatH(toResult.hour, toResult.minute)} (${cityName(toCity)})${
      toResult.dayShift !== 0 ? ` [${toResult.dayShift > 0 ? `+1 ${tr("день")}` : `-1 ${tr("день")}`}]` : ''
    }`;

    let fullText = `${t("worldTime.conversion")}: ${fromText} = ${toText}`;
    if (extraCityIds.length > 0) {
      const extras = extraCityIds.map((id) => {
        const c = allCities.find((item) => item.id === id);
        if (!c) return '';
        const res = convertTime(c, selectedHour, selectedMinute);
        return ` • ${formatH(res.hour, res.minute)} (${cityName(c)})`;
      }).filter(Boolean).join('');
      fullText += extras;
    }

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Google Calendar link
  const getGoogleCalendarUrl = () => {
    const today = new Date();
    const startYear = today.getFullYear();
    const startMonth = (today.getMonth() + 1).toString().padStart(2, '0');
    const startDay = today.getDate().toString().padStart(2, '0');
    const startHourStr = selectedHour.toString().padStart(2, '0');
    const startMinStr = selectedMinute.toString().padStart(2, '0');

    const endHour = (selectedHour + 1) % 24;
    const endHourStr = endHour.toString().padStart(2, '0');

    const startISO = `${startYear}${startMonth}${startDay}T${startHourStr}${startMinStr}00`;
    const endISO = `${startYear}${startMonth}${startDay}T${endHourStr}${startMinStr}00`;

    const title = encodeURIComponent(`${t("worldTime.meeting")} (${cityName(fromCity)} - ${cityName(toCity)})`);
    const details = encodeURIComponent(
      `${t("worldTime.timeIn")} ${cityName(fromCity)}: ${selectedHour}:${selectedMinute.toString().padStart(2, '0')}\n${t("worldTime.timeIn")} ${cityName(toCity)}: ${toResult.hour}:${toResult.minute.toString().padStart(2, '0')}`
    );

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startISO}/${endISO}&details=${details}`;
  };

  // Add extra city
  const handleAddExtraCity = (city: CityTimezone) => {
    if (!extraCityIds.includes(city.id) && city.id !== fromCityId && city.id !== toCityId) {
      setExtraCityIds([...extraCityIds, city.id]);
    }
    setIsAddingExtraCity(false);
    setExtraCitySearch('');
  };

  // Remove extra city
  const handleRemoveExtraCity = (cityId: string) => {
    setExtraCityIds(extraCityIds.filter((id) => id !== cityId));
  };

  // Format hour label based on 12/24h
  const formatTimeDisplay = (h: number, m: number) => {
    if (is24h) {
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    }
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
  };

  // Verbal time difference phrase
  const getVerbalDifference = () => {
    const diff = toResult.diffHours;
    if (diff === 0) return tr("Города находятся в одном часовом поясе");
    const absDiff = Math.abs(diff);
    const unitKey = absDiff === 1
      ? "worldTime.hourOne"
      : locale === "ru" && absDiff >= 2 && absDiff <= 4
        ? "worldTime.hourFew"
        : "worldTime.hourMany";
    const unit = t(unitKey);
    if (diff > 0) {
      return t("worldTime.ahead", { to: cityName(toCity), from: cityName(fromCity), hours: `${diff} ${unit}` });
    }
    return t("worldTime.behind", { to: cityName(toCity), from: cityName(fromCity), hours: `${absDiff} ${unit}` });
  };

  // Available cities to add as extra
  const filteredAvailableCities = allCities
    .filter((c) => c.id !== fromCityId && c.id !== toCityId && !extraCityIds.includes(c.id))
    .filter((c) => 
      cityName(c).toLowerCase().includes(extraCitySearch.toLowerCase()) ||
      countryName(c).toLowerCase().includes(extraCitySearch.toLowerCase())
    );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 sm:p-6 flex flex-col gap-6">
      
      {/* 1. Header with Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <ArrowLeftRight className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{tr("Конвертер времени")}</h2>
            <p className="text-xs text-slate-500">
              {tr("Точный расчет времени между городами и часовыми поясами мира")}
            </p>
          </div>
        </div>

        {/* Top Control Pills */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* 12h / 24h Toggle */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
            <button
              onClick={() => setIs24h(true)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                is24h ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tr("24 часа")}
            </button>
            <button
              onClick={() => setIs24h(false)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                !is24h ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tr("12 часов")}
            </button>
          </div>

          {/* Reset to current live time */}
          <button
            onClick={handleResetNow}
            title={tr("Перейти к текущему времени")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isLive
                ? 'bg-blue-50 border-blue-200 text-blue-700 font-semibold'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Clock className={`w-3.5 h-3.5 ${isLive ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
            <span>{isLive ? tr("Сейчас (живое)") : tr("Текущее время")}</span>
          </button>
        </div>
      </div>

      {/* 2. Primary Conversion Grid (From City <-> To City) */}
      <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-stretch">
        
        {/* FROM CITY BOX (5 Cols) */}
        <div className="md:col-span-5 bg-slate-50/90 border border-slate-200/90 rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-3.5 relative transition-all focus-within:border-blue-300">
          {/* Label Header */}
          <div className="h-6 flex items-center justify-between">
            <span className="font-accent text-[11px] font-bold uppercase tracking-wider text-slate-500">
              {tr("Исходный город")} {tr("(Из)")}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-mono text-[11px] text-slate-600 font-semibold leading-normal">
              {getUtcOffsetString(fromCity.timezone, now)}
            </span>
          </div>

          {/* City Selection */}
          <div className="h-11 flex items-center gap-2.5 bg-white border border-slate-200 rounded-xl px-3 shadow-2xs">
            <FlagIcon countryCode={fromCity.countryCode} size="md" />
            <select
              value={fromCityId}
              onChange={(e) => {
                setFromCityId(e.target.value);
                setIsLive(false);
              }}
              aria-label={tr("Исходный город")}
              className="w-full bg-transparent font-bold text-sm text-slate-900 focus:outline-hidden cursor-pointer truncate"
            >
              {allCities.map((city) => (
                <option key={city.id} value={city.id}>
                  {cityName(city)} ({countryName(city)})
                </option>
              ))}
            </select>
          </div>

          {/* Time Picker & Display */}
          <div className="h-[76px] flex items-center justify-between bg-white border border-slate-200 rounded-xl p-3 shadow-2xs">
            <div className="flex flex-col justify-center">
              <div className="text-[10px] text-slate-400 font-medium mb-1 leading-none">{tr("Задайте время:")}</div>
              <div className="flex items-center gap-1.5 font-mono">
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={2}
                    value={selectedHour.toString().padStart(2, '0')}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/\D/g, '');
                      if (clean === '') {
                        setSelectedHour(0);
                        setIsLive(false);
                        return;
                      }
                      const val = parseInt(clean, 10);
                      if (!isNaN(val) && val >= 0 && val <= 23) {
                        setSelectedHour(val);
                        setIsLive(false);
                      }
                    }}
                    aria-label={tr("Часы")}
                    className="w-13 h-10 text-center font-mono text-2xl sm:text-3xl font-black text-slate-900 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-hidden transition-all shadow-2xs leading-none"
                  />
                </div>
                <span className="font-mono text-2xl sm:text-3xl font-black text-slate-400 select-none pb-0.5 leading-none">:</span>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={2}
                    value={selectedMinute.toString().padStart(2, '0')}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/\D/g, '');
                      if (clean === '') {
                        setSelectedMinute(0);
                        setIsLive(false);
                        return;
                      }
                      const val = parseInt(clean, 10);
                      if (!isNaN(val) && val >= 0 && val <= 59) {
                        setSelectedMinute(val);
                        setIsLive(false);
                      }
                    }}
                    aria-label={tr("Минуты")}
                    className="w-13 h-10 text-center font-mono text-2xl sm:text-3xl font-black text-slate-900 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-hidden transition-all shadow-2xs leading-none"
                  />
                </div>
              </div>
            </div>

            {/* Segment status badge & date */}
            <div className="text-right flex flex-col justify-center items-end">
              {getHourSegmentType(selectedHour) === 'work' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Briefcase className="w-3 h-3" /> {tr("Рабочее")}
                </span>
              )}
              {getHourSegmentType(selectedHour) === 'day' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                  <Sun className="w-3 h-3 text-amber-500" /> {tr("День")}
                </span>
              )}
              {getHourSegmentType(selectedHour) === 'night' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                  <Moon className="w-3 h-3" /> {tr("Ночь")}
                </span>
              )}
              <div className="text-[11px] text-slate-400 mt-1.5 font-mono">
                {now.toLocaleDateString(locale === "ru" ? "ru-RU" : locale === "uz" ? "uz-UZ" : "en-US", { weekday: 'short', day: 'numeric', month: 'short' })}
              </div>
            </div>
          </div>
        </div>

        {/* SWAP BUTTON & ARROW (1 Col) */}
        <div className="md:col-span-1 flex flex-col items-center justify-center gap-2 py-2">
          <button
            onClick={handleSwap}
            title={tr("Поменять местами")}
            className="w-11 h-11 rounded-full bg-white hover:bg-blue-50 border-2 border-slate-200 hover:border-blue-400 text-slate-600 hover:text-blue-600 flex items-center justify-center transition-all shadow-2xs hover:scale-110 active:scale-95"
          >
            <ArrowLeftRight className="w-5 h-5" />
          </button>
          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600">
            {toResult.diffHours > 0 ? `+${toResult.diffHours}h` : `${toResult.diffHours}h`}
          </span>
        </div>

        {/* TO CITY BOX (5 Cols) */}
        <div className="md:col-span-5 bg-gradient-to-br from-blue-50/80 to-indigo-50/50 border border-blue-200/80 rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-3.5 relative">
          {/* Label Header */}
          <div className="h-6 flex items-center justify-between">
            <span className="font-accent text-[11px] font-bold uppercase tracking-wider text-blue-900">
              {tr("Целевой город")} {tr("(В)")}
            </span>
            <div className="flex items-center gap-1.5">
              {toResult.dayShift !== 0 && (
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold leading-normal ${
                  toResult.dayShift > 0 ? 'bg-amber-100 text-amber-800' : 'bg-purple-100 text-purple-800'
                }`}>
                  {toResult.dayShift > 0 ? `+1 ${tr("день")}` : `-1 ${tr("день")}`}
                </span>
              )}
              <span className="px-2 py-0.5 rounded-md bg-white border border-blue-200 font-mono text-[11px] text-blue-700 font-semibold leading-normal">
                {getUtcOffsetString(toCity.timezone, now)}
              </span>
            </div>
          </div>

          {/* City Selection */}
          <div className="h-11 flex items-center gap-2.5 bg-white border border-blue-200 rounded-xl px-3 shadow-2xs">
            <FlagIcon countryCode={toCity.countryCode} size="md" />
            <select
              value={toCityId}
              onChange={(e) => setToCityId(e.target.value)}
              aria-label={tr("Целевой город")}
              className="w-full bg-transparent font-bold text-sm text-slate-900 focus:outline-hidden cursor-pointer truncate"
            >
              {allCities.map((city) => (
                <option key={city.id} value={city.id}>
                  {cityName(city)} ({countryName(city)})
                </option>
              ))}
            </select>
          </div>

          {/* Result Converted Display */}
          <div className="h-[76px] flex items-center justify-between bg-white border border-blue-200 rounded-xl p-3 shadow-2xs">
            <div className="flex flex-col justify-center">
              <div className="text-[10px] text-blue-600 font-medium mb-1 leading-none">{tr("Точное время:")}</div>
              <div className="h-10 flex items-center">
                <span className="font-mono text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-none">
                  {formatTimeDisplay(toResult.hour, toResult.minute)}
                </span>
              </div>
            </div>

            {/* Segment status badge & day shift */}
            <div className="text-right flex flex-col justify-center items-end">
              {toResult.segment === 'work' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <Briefcase className="w-3 h-3" /> {tr("Рабочее")}
                </span>
              )}
              {toResult.segment === 'day' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 border border-sky-200">
                  <Sun className="w-3 h-3 text-amber-500" /> {tr("День")}
                </span>
              )}
              {toResult.segment === 'night' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-200 text-slate-700">
                  <Moon className="w-3 h-3" /> {tr("Ночь")}
                </span>
              )}
              <div className="text-[11px] text-slate-500 mt-1.5 font-medium">
                {toResult.dayShift > 0
                  ? tr("Завтра")
                  : toResult.dayShift < 0
                  ? tr("Вчера")
                  : tr("Сегодня")}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 3. Verbal Summary Explanation */}
      <div className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
        <span className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-500" />
          <span>{getVerbalDifference()}</span>
        </span>
        <span className="font-mono text-slate-400 hidden sm:inline">
          {fromCity.timezone} ↔ {toCity.timezone}
        </span>
      </div>

      {/* 4. Interactive 24-Hour Comparative Timeline Scrub Slider */}
      <div className="flex flex-col gap-2 bg-slate-50/80 border border-slate-200 rounded-xl p-4">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
          <span className="flex items-center gap-1.5">
            <span>{tr("Интерактивная шкала 24 часов:")}</span>
            <strong className="text-blue-600 font-mono">
              {formatTimeDisplay(selectedHour, selectedMinute)}
            </strong>
          </span>
          <span className="text-[11px] text-slate-400">
            {tr("Перетащите ползунок для быстрого подбора")}
          </span>
        </div>

        {/* Range Slider */}
        <input
          type="range"
          min="0"
          max="23"
          value={selectedHour}
          onChange={(e) => {
            setSelectedHour(parseInt(e.target.value, 10));
            setIsLive(false);
          }}
          aria-label={tr("24-часовая шкала времени")}
          className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
        />

        {/* Dual City Hour Indicators Bar */}
        <div className="relative pt-1 flex flex-col gap-1.5">
          {/* Ruler ticks 0 to 23 */}
          <div className="flex justify-between text-[10px] font-mono text-slate-400 px-1">
            <span>00:00</span>
            <span>04:00</span>
            <span>08:00</span>
            <span>12:00</span>
            <span>16:00</span>
            <span>20:00</span>
            <span>23:00</span>
          </div>

          {/* Color-coded segments guide */}
          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-xs bg-slate-300"></span>
                <span>{tr("Ночь (00-07)")}</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-xs bg-sky-200"></span>
                <span>{tr("Утро/Вечер")}</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-xs bg-emerald-300"></span>
                <span>{tr("Рабочие часы (09-18)")}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Quick Presets Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-200/60 mt-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
            {tr("Пресеты:")}
          </span>
          <button
            onClick={() => handleSelectPreset(9, 0)}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-xs font-medium text-slate-700 transition-colors shadow-2xs"
          >
            09:00 ({tr("Начало дня")})
          </button>
          <button
            onClick={() => handleSelectPreset(12, 0)}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-xs font-medium text-slate-700 transition-colors shadow-2xs"
          >
            12:00 ({tr("Обед")})
          </button>
          <button
            onClick={() => handleSelectPreset(15, 0)}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-xs font-medium text-slate-700 transition-colors shadow-2xs"
          >
            15:00 ({tr("Встреча")})
          </button>
          <button
            onClick={() => handleSelectPreset(18, 0)}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-xs font-medium text-slate-700 transition-colors shadow-2xs"
          >
            18:00 ({tr("Конец дня")})
          </button>
        </div>
      </div>

      {/* 5. Extra Comparison Cities (3rd & 4th cities) */}
      {extraCityIds.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">
              {tr("Дополнительные города")} ({extraCityIds.length}):
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {extraCityIds.map((cityId) => {
              const city = allCities.find((c) => c.id === cityId);
              if (!city) return null;
              const res = convertTime(city, selectedHour, selectedMinute);

              return (
                <div
                  key={city.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <FlagIcon countryCode={city.countryCode} size="sm" />
                    <div>
                      <div className="text-xs font-bold text-slate-900">{cityName(city)}</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {getUtcOffsetString(city.timezone, now)} • {res.diffHours > 0 ? `+${res.diffHours}h` : `${res.diffHours}h`}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="font-mono text-sm font-black text-slate-900">
                        {formatTimeDisplay(res.hour, res.minute)}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {res.dayShift > 0 ? `+1 ${tr("день")}` : res.dayShift < 0 ? `-1 ${tr("день")}` : tr("сегодня")}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveExtraCity(city.id)}
                      title={tr("Удалить город из сравнения")}
                      className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-white transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Extra City Search Dropdown */}
      <div className="relative">
        {!isAddingExtraCity ? (
          <button
            onClick={() => setIsAddingExtraCity(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>+ {tr("Сравнить с еще одним городом")}</span>
          </button>
        ) : (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">{tr("Выберите город для добавления:")}</span>
              <button
                onClick={() => setIsAddingExtraCity(false)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                {tr("Отмена")}
              </button>
            </div>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={extraCitySearch}
                onChange={(e) => setExtraCitySearch(e.target.value)}
                placeholder={tr("Поиск города...")}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:border-blue-400"
              />
            </div>
            <div className="max-h-36 overflow-y-auto flex flex-col gap-1 divide-y divide-slate-100">
              {filteredAvailableCities.slice(0, 10).map((city) => (
                <button
                  key={city.id}
                  onClick={() => handleAddExtraCity(city)}
                  className="flex items-center justify-between p-1.5 hover:bg-white rounded-md text-left transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FlagIcon countryCode={city.countryCode} size="xs" />
                    <span className="text-xs font-medium text-slate-800">{cityName(city)}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({countryName(city)})</span>
                  </div>
                  <span className="text-[10px] font-mono text-blue-600">
                    {getUtcOffsetString(city.timezone, now)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 6. Action Footer Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleCopy}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-all shadow-xs active:scale-98"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? tr("Скопировано в буфер!") : tr("Скопировать результат")}</span>
          </button>

          <a
            href={getGoogleCalendarUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all"
          >
            <CalendarIcon className="w-4 h-4" />
            <span>{tr("Календарь")}</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>

        <div className="text-[11px] text-slate-400 font-mono">
          {tr("Время автоматически обновляется")}
        </div>
      </div>

    </div>
  );
};
