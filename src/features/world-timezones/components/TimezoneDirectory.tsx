import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Star, 
  ArrowUpRight, 
  Check, 
  ChevronDown, 
  Sun, 
  Moon, 
  Briefcase, 
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Globe,
  Clock
} from 'lucide-react';
import { CityTimezone } from '../types';
import { getTimeInTimezone, getUtcOffsetString, getHourSegmentType } from '../utils/timezone';
import { FlagIcon } from './FlagIcon';

interface TimezoneDirectoryProps {
  allCities: CityTimezone[];
  timelineCityIds: string[];
  favoriteCityIds: string[];
  onToggleFavorite: (cityId: string) => void;
  onAddToTimeline: (city: CityTimezone) => void;
  onSelectForConverter?: (city: CityTimezone) => void;
}

export const TimezoneDirectory: React.FC<TimezoneDirectoryProps> = ({
  allCities,
  timelineCityIds,
  favoriteCityIds,
  onToggleFavorite,
  onAddToTimeline,
  onSelectForConverter,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContinent, setSelectedContinent] = useState('Все');
  const [selectedUtc, setSelectedUtc] = useState('Все UTC');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [onlyWorkingHours, setOnlyWorkingHours] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Live seconds ticker
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const continents = [
    'Все',
    'Европа',
    'Азия',
    'Северная Америка',
    'Южная Америка',
    'Африка',
    'Океания',
  ];

  const utcOptions = [
    'Все UTC',
    'UTC -10',
    'UTC -7',
    'UTC -6',
    'UTC -5',
    'UTC -4',
    'UTC -3',
    'UTC +0',
    'UTC +1',
    'UTC +2',
    'UTC +3',
    'UTC +4',
    'UTC +5',
    'UTC +6',
    'UTC +7',
    'UTC +8',
    'UTC +9',
    'UTC +10',
    'UTC +12',
  ];

  // Filter cities
  const filteredCities = allCities.filter((city) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      city.cityRu.toLowerCase().includes(q) ||
      city.city.toLowerCase().includes(q) ||
      city.countryRu.toLowerCase().includes(q) ||
      city.country.toLowerCase().includes(q) ||
      city.timezone.toLowerCase().includes(q);

    const matchesContinent =
      selectedContinent === 'Все' || city.continent === selectedContinent;

    const offsetStr = getUtcOffsetString(city.timezone, now);
    const matchesUtc = selectedUtc === 'Все UTC' || offsetStr === selectedUtc;

    const isFav = favoriteCityIds.includes(city.id);
    const matchesFav = !onlyFavorites || isFav;

    const timeData = getTimeInTimezone(city.timezone, now);
    const seg = getHourSegmentType(timeData.hour);
    const matchesWork = !onlyWorkingHours || seg === 'work';

    return matchesSearch && matchesContinent && matchesUtc && matchesFav && matchesWork;
  });

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedContinent, selectedUtc, onlyFavorites, onlyWorkingHours]);

  // Paginated slice
  const totalPages = Math.max(1, Math.ceil(filteredCities.length / itemsPerPage));
  const paginatedCities = filteredCities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 flex flex-col">
      {/* Top Title & Quick Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Каталог городов и часовых поясов мира
              </h3>
              <p className="text-xs text-slate-500">
                Актуальное местное время, смещение UTC и статус рабочих часов в городах мира
              </p>
            </div>
          </div>
        </div>

        {/* Global Stats Counter */}
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl font-medium">
            Найдено: <strong className="text-slate-900 font-bold">{filteredCities.length}</strong> из {allCities.length}
          </span>
          <button
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              onlyFavorites
                ? 'bg-amber-50 text-amber-800 border-amber-300 shadow-2xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-amber-400 text-amber-500' : 'text-slate-400'}`} />
            <span>Избранные ({favoriteCityIds.length})</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar: Search, Continents, UTC */}
      <div className="py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Continent Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {continents.map((continent) => {
            const count =
              continent === 'Все'
                ? allCities.length
                : allCities.filter((c) => c.continent === continent).length;

            return (
              <button
                key={continent}
                onClick={() => setSelectedContinent(continent)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedContinent === continent
                    ? 'bg-blue-600 text-white shadow-2xs shadow-blue-500/20'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                {continent}
                <span
                  className={`ml-1.5 text-[10px] px-1.5 py-0.2 rounded-md ${
                    selectedContinent === continent
                      ? 'bg-blue-700/50 text-blue-100'
                      : 'bg-slate-200/70 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Secondary Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Working hours toggle */}
          <button
            onClick={() => setOnlyWorkingHours(!onlyWorkingHours)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              onlyWorkingHours
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
            <span>Сейчас работают (09-18)</span>
          </button>

          {/* UTC Selector */}
          <div className="relative">
            <select
              value={selectedUtc}
              onChange={(e) => setSelectedUtc(e.target.value)}
              aria-label="Фильтр по смещению UTC"
              className="appearance-none bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-semibold text-slate-700 hover:border-slate-300 focus:outline-hidden cursor-pointer transition-colors shadow-2xs"
            >
              {utcOptions.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск города, страны..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Full-Width Structured Table: No horizontal scroll on desktop */}
      <div className="w-full mt-2 rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/90 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-3.5 px-4 w-[22%]">Город</th>
              <th className="py-3.5 px-4 w-[16%]">Страна и континент</th>
              <th className="py-3.5 px-4 w-[18%]">Часовой пояс (IANA)</th>
              <th className="py-3.5 px-4 w-[12%]">Смещение UTC</th>
              <th className="py-3.5 px-4 w-[16%]">Текущее время</th>
              <th className="py-3.5 px-4 w-[16%] text-right">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {paginatedCities.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Search className="w-6 h-6 text-slate-300" />
                    <span className="font-medium text-slate-600">Города не найдены</span>
                    <span className="text-xs text-slate-400">Попробуйте изменить поисковый запрос или сбросить фильтры</span>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedCities.map((city) => {
                const time = getTimeInTimezone(city.timezone, now);
                const timeStr = `${time.hour.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}:${time.second.toString().padStart(2, '0')}`;
                const utcStr = getUtcOffsetString(city.timezone, now);
                const isFavorite = favoriteCityIds.includes(city.id);
                const isInTimeline = timelineCityIds.includes(city.id);
                const seg = getHourSegmentType(time.hour);

                let statusBadge = {
                  label: 'Рабочие часы',
                  icon: Briefcase,
                  bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                };
                if (seg === 'night') {
                  statusBadge = {
                    label: 'Ночь (отдых)',
                    icon: Moon,
                    bg: 'bg-slate-100 text-slate-700 border-slate-200',
                  };
                } else if (seg === 'day') {
                  statusBadge = {
                    label: 'Утро / Вечер',
                    icon: Sun,
                    bg: 'bg-sky-50 text-sky-700 border-sky-200',
                  };
                }

                const StatusIcon = statusBadge.icon;

                return (
                  <tr
                    key={city.id}
                    className="hover:bg-blue-50/40 transition-colors group"
                  >
                    {/* City name & flag */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <FlagIcon countryCode={city.countryCode} size="md" />
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                            {city.cityRu}
                          </div>
                          <div className="text-[11px] text-slate-400 font-medium">
                            {city.city}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Country & Continent */}
                    <td className="py-3 px-4">
                      <div className="text-slate-800 font-medium">{city.countryRu}</div>
                      <div className="text-[10px] text-slate-400">{city.continent}</div>
                    </td>

                    {/* Timezone */}
                    <td className="py-3 px-4">
                      <span className="font-mono text-[11px] text-slate-600 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md">
                        {city.timezone}
                      </span>
                    </td>

                    {/* UTC offset */}
                    <td className="py-3 px-4">
                      <span className="inline-block px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 font-mono text-xs font-bold border border-blue-200/60">
                        {utcStr}
                      </span>
                    </td>

                    {/* Current Local Time */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-black text-slate-900">
                          {timeStr}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md border ${statusBadge.bg}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          <span>{statusBadge.label}</span>
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Favorite button */}
                        <button
                          onClick={() => onToggleFavorite(city.id)}
                          title={isFavorite ? 'В избранном' : 'Добавить в избранное'}
                          className={`p-1.5 rounded-lg border transition-all ${
                            isFavorite
                              ? 'bg-amber-50 text-amber-500 border-amber-200 shadow-2xs'
                              : 'bg-white text-slate-400 hover:text-amber-500 hover:bg-slate-50 border-slate-200'
                          }`}
                        >
                          <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-400' : ''}`} />
                        </button>

                        {/* Pick into Converter */}
                        {onSelectForConverter && (
                          <button
                            onClick={() => onSelectForConverter(city)}
                            title="Сравнить в конвертере времени"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-2xs"
                          >
                            <span>В конвертер</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Add to Timeline / Meeting */}
                        {!isInTimeline ? (
                          <button
                            onClick={() => onAddToTimeline(city)}
                            title="Добавить в планировщик встречи"
                            className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors border border-slate-200"
                          >
                            <span>+ Встреча</span>
                          </button>
                        ) : (
                          <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 text-[11px] font-semibold px-2 py-1 rounded-lg">
                            ✓ Добавлен
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Показаны города{' '}
            <strong className="text-slate-800">
              {(currentPage - 1) * itemsPerPage + 1}–
              {Math.min(currentPage * itemsPerPage, filteredCities.length)}
            </strong>{' '}
            из <strong className="text-slate-800">{filteredCities.length}</strong>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                    currentPage === pageNum
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
