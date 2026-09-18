import React, { useState } from 'react';
import { 
  Users, 
  Copy, 
  Check, 
  Plus, 
  X, 
  Calendar as CalendarIcon,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { CityTimezone } from '../types';
import { 
  calculateBestMeetingTime, 
  getTimeInTimezone,
  getHourSegmentType
} from '../utils/timezone';
import { FlagIcon } from './FlagIcon';

interface MeetingPlannerProps {
  allCities: CityTimezone[];
  selectedCities: CityTimezone[];
  onAddCity: (city: CityTimezone) => void;
  onRemoveCity: (cityId: string) => void;
  onOpenAddModal: () => void;
}

export const MeetingPlanner: React.FC<MeetingPlannerProps> = ({
  allCities,
  selectedCities,
  onAddCity,
  onRemoveCity,
  onOpenAddModal,
}) => {
  const [copied, setCopied] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);

  // Reference city for meeting recommendation (first selected or Tashkent)
  const referenceCity = selectedCities[0] || {
    id: 'tashkent',
    city: 'Tashkent',
    cityRu: 'Ташкент',
    country: 'Uzbekistan',
    countryRu: 'Узбекистан',
    countryCode: 'uz',
    flag: '🇺🇿',
    timezone: 'Asia/Tashkent',
    utcOffsetHours: 5,
    continent: 'Азия' as const,
    lat: 41.2995,
    lng: 69.2401,
  };

  const recommendation = calculateBestMeetingTime(selectedCities, referenceCity);

  // Remaining cities not yet in selected
  const availableToAdd = allCities.filter(
    (c) => !selectedCities.some((sc) => sc.id === c.id)
  );

  // Copy meeting details
  const handleCopy = () => {
    const textLines = [
      `📅 Встреча: ${recommendation.startTime}:00 – ${recommendation.endTime}:00 (${recommendation.referenceCityName})`,
      'Разбивка по городам:',
      ...recommendation.breakdown.map((b) => `• ${b.cityRu}: ${b.timeRange}`),
      '\nСоздано в сервисе «Часовые пояса мира»',
    ];
    navigator.clipboard.writeText(textLines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Google Calendar URL generator
  const handleAddToCalendar = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const y = tomorrow.getFullYear();
    const m = (tomorrow.getMonth() + 1).toString().padStart(2, '0');
    const d = tomorrow.getDate().toString().padStart(2, '0');
    const sH = recommendation.startTime.toString().padStart(2, '0');
    const eH = recommendation.endTime.toString().padStart(2, '0');
    
    const details = encodeURIComponent(
      `Международная онлайн-встреча\n\n` +
      recommendation.breakdown.map((b) => `${b.cityRu}: ${b.timeRange}`).join('\n')
    );
    const title = encodeURIComponent(`Международная встреча (${selectedCities.map(c => c.cityRu).join(', ')})`);
    const calUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${y}${m}${d}T${sH}0000/${y}${m}${d}T${eH}0000`;
    window.open(calUrl, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">Удобное время для встречи</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Выберите города и найдите общее удобное время
          </p>
        </div>
      </div>

      {/* Selected City Chips */}
      <div className="flex flex-wrap items-center gap-1.5">
        {selectedCities.map((city) => (
          <span
            key={city.id}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-800 transition-colors shadow-2xs"
          >
            <FlagIcon countryCode={city.countryCode} size="xs" />
            <span>{city.cityRu}</span>
            {selectedCities.length > 1 && (
              <button
                onClick={() => onRemoveCity(city.id)}
                className="text-slate-400 hover:text-rose-600 p-0.5 transition-colors ml-0.5"
                title="Убрать город"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </span>
        ))}

        {/* Dropdown to add more */}
        <div className="relative">
          <button
            onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-dashed border-slate-300 hover:border-blue-400 text-xs font-medium text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <Plus className="w-3 h-3" />
            <span>Добавить</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isCityDropdownOpen && (
            <div className="absolute left-0 mt-1 w-52 max-h-56 overflow-y-auto bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-40">
              {availableToAdd.length === 0 ? (
                <div className="px-3 py-2 text-xs text-slate-400">Все города уже добавлены</div>
              ) : (
                availableToAdd.slice(0, 10).map((city) => (
                  <button
                    key={city.id}
                    onClick={() => {
                      onAddCity(city);
                      setIsCityDropdownOpen(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <FlagIcon countryCode={city.countryCode} size="xs" />
                      <span>{city.cityRu}</span>
                    </div>
                    <span className="text-slate-400 text-[10px] font-mono">{city.countryCode.toUpperCase()}</span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mini Visual Stacked Timeline Chart */}
      <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200">
        <div className="flex items-start gap-2.5">
          {/* Left Column: City Names (dedicated width, no highlight overlap) */}
          <div className="w-24 shrink-0 flex flex-col gap-2 pt-5">
            {selectedCities.map((city) => (
              <div
                key={city.id}
                className="h-4 flex items-center gap-1.5 text-[11px] font-bold text-slate-700 truncate"
                title={city.cityRu}
              >
                <FlagIcon countryCode={city.countryCode} size="xs" />
                <span className="truncate">{city.cityRu}</span>
              </div>
            ))}
          </div>

          {/* Right Column: Timeline Header + Stacked Bars */}
          <div className="flex-1 min-w-0 flex flex-col gap-1">
            {/* Timeline Header Hours (strictly aligned with the bars) */}
            <div className="h-4 flex justify-between text-[10px] font-mono text-slate-400 px-0.5">
              <span>00</span>
              <span>06</span>
              <span>12</span>
              <span>18</span>
              <span>24</span>
            </div>

            {/* Stacked Rows with Overlap Highlight Box */}
            <div className="relative flex flex-col gap-2 select-none">
              {/* Green Overlap Highlight Box: strictly bounded to bars */}
              {recommendation.endTime > recommendation.startTime && (
                <div
                  style={{
                    left: `${(recommendation.startTime / 24) * 100}%`,
                    width: `${Math.max(4, ((recommendation.endTime - recommendation.startTime) / 24) * 100)}%`,
                  }}
                  className="absolute -top-1 -bottom-1 border-2 border-dashed border-emerald-500 bg-emerald-500/15 rounded-md pointer-events-none z-10"
                />
              )}

              {selectedCities.map((city) => {
                const now = new Date();
                const refTime = getTimeInTimezone(referenceCity.timezone, now);
                const cityTime = getTimeInTimezone(city.timezone, now);
                const diffHours = (cityTime.hour + cityTime.minute / 60) - (refTime.hour + refTime.minute / 60);

                return (
                  <div key={city.id} className="h-4 flex rounded overflow-hidden bg-slate-200">
                    {Array.from({ length: 24 }).map((_, h) => {
                      const localCityHour = (h + Math.round(diffHours) + 24) % 24;
                      const seg = getHourSegmentType(localCityHour);

                      let col = 'bg-sky-200';
                      if (seg === 'night') col = 'bg-[#3b5175]';
                      if (seg === 'work') col = 'bg-emerald-500';

                      return <div key={h} className={`flex-1 ${col}`} />;
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Time Callout Box */}
      <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4">
        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-emerald-800">
              Рекомендуемое время
            </div>
            <div className="text-base font-extrabold text-slate-900 mt-0.5 font-mono">
              {recommendation.startTime.toString().padStart(2, '0')}:00 –{' '}
              {recommendation.endTime.toString().padStart(2, '0')}:00 ({recommendation.referenceCityName})
            </div>
            
            {/* Breakdown per city */}
            <div className="mt-2 text-[11px] text-slate-600 leading-relaxed font-mono">
              {recommendation.breakdown.map((b, idx) => (
                <span key={b.cityRu}>
                  {b.timeRange} ({b.cityRu})
                  {idx < recommendation.breakdown.length - 1 && ' | '}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition-all shadow-xs active:scale-[0.98]"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Скопировано!' : 'Скопировать время'}</span>
        </button>

        <button
          onClick={handleAddToCalendar}
          title="Открыть в Google Календаре"
          className="flex items-center justify-center px-3 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors"
        >
          <CalendarIcon className="w-4 h-4 text-slate-600" />
        </button>
      </div>

    </div>
  );
};
