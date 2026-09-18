import React, { useState } from 'react';
import { Search, X, Plus, Check } from 'lucide-react';
import { CityTimezone } from '../types';
import { getTimeInTimezone, getUtcOffsetString } from '../utils/timezone';
import { FlagIcon } from './FlagIcon';
import { useWorldTimezonesI18n } from '../i18n';

interface AddCityModalProps {
  isOpen: boolean;
  onClose: () => void;
  allCities: CityTimezone[];
  timelineCityIds: string[];
  onAddCity: (city: CityTimezone) => void;
}

export const AddCityModal: React.FC<AddCityModalProps> = ({
  isOpen,
  onClose,
  allCities,
  timelineCityIds,
  onAddCity,
}) => {
  const { t, tr, cityName, countryName } = useWorldTimezonesI18n();
  const [search, setSearch] = useState('');
  if (!isOpen) return null;

  const now = new Date();
  const filtered = allCities.filter((c) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      cityName(c).toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q) ||
      countryName(c).toLowerCase().includes(q) ||
      c.country.toLowerCase().includes(q) ||
      c.timezone.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">{t("worldTime.addCityTitle")}</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {t("worldTime.addCitySubtitle")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("worldTime.addCityPlaceholder")}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500 transition-colors shadow-2xs"
            />
          </div>
        </div>

        {/* Cities List */}
        <div className="overflow-y-auto divide-y divide-slate-100 flex-1 p-2">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-400">
              {t("worldTime.cityNotFound")}
            </div>
          ) : (
            filtered.map((city) => {
              const isAdded = timelineCityIds.includes(city.id);
              const time = getTimeInTimezone(city.timezone, now);
              const timeStr = `${time.hour.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}`;
              const utcStr = getUtcOffsetString(city.timezone, now);

              return (
                <div
                  key={city.id}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FlagIcon countryCode={city.countryCode} size="md" />
                    <div>
                      <div className="text-sm font-bold text-slate-900">{cityName(city)}</div>
                      <div className="text-xs text-slate-500">
                        {countryName(city)} • <span className="font-mono">{utcStr}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md">
                      {timeStr}
                    </span>

                    {isAdded ? (
                      <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                        <Check className="w-3.5 h-3.5" />
                        {tr("Добавлен")}
                      </span>
                    ) : (
                      <button
                        onClick={() => onAddCity(city)}
                        className="flex items-center gap-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg transition-colors shadow-2xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        {tr("Добавить")}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            {t("common.close")}
          </button>
        </div>
      </div>
    </div>
  );
};
