import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { COUNTRIES, getCountryName } from '../data/countries';
import { CountryFlag } from './CountryFlags';
import { useApp } from '../context/AppContext';

interface CountryRatesSidebarProps {
  currentRate: number;
  onSelectRate: (rate: number, countryName?: string) => void;
}

export const CountryRatesSidebar: React.FC<CountryRatesSidebarProps> = ({
  currentRate,
  onSelectRate,
}) => {
  const { t, language } = useApp();
  const [showMoreModal, setShowMoreModal] = useState(false);
  const [selectedOther, setSelectedOther] = useState<string>('');

  const mainCountries = COUNTRIES.slice(0, 8);
  const otherCountries = COUNTRIES.slice(8);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-6 shadow-2xs transition-colors">
      <div className="flex items-center justify-between mb-3.5 sm:mb-4">
        <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-montserrat">
          {t('sidebar.title')}
        </h2>
      </div>

      <div className="space-y-1 sm:space-y-1.5 text-xs sm:text-sm">
        {mainCountries.map((country) => {
          const isSelected = currentRate === country.standardRate;
          const countryDisplayName = getCountryName(country, language);

          return (
            <button
              key={country.id}
              type="button"
              onClick={() => onSelectRate(country.standardRate, countryDisplayName)}
              className={`w-full flex items-center justify-between px-3 py-2.5 sm:py-2 rounded-xl transition-all text-left cursor-pointer active:scale-[0.99] ${
                isSelected
                  ? 'bg-blue-50/80 dark:bg-blue-950/50 text-blue-900 dark:text-blue-200 font-semibold border border-blue-200/80 dark:border-blue-800'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <CountryFlag countryId={country.id} size={20} />
                <span className="truncate font-inter font-medium text-slate-800 dark:text-slate-200">
                  {countryDisplayName}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className={`font-bold font-montserrat tabular-nums ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-white'}`}>
                  {country.standardRate}%
                </span>
                {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 ml-0.5" />}
              </div>
            </button>
          );
        })}

        {/* Other / More countries selector */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowMoreModal(!showMoreModal)}
            className="w-full flex items-center justify-between px-3 py-2.5 sm:py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/70 dark:border-slate-700 text-left transition-colors cursor-pointer active:scale-[0.99]"
          >
            <div className="flex items-center gap-2.5">
              <CountryFlag countryId="other" size={20} />
              <span className="font-medium font-inter">{t('sidebar.other')}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-400 text-xs font-inter">
              <span className="truncate max-w-[120px]">{selectedOther ? selectedOther : t('sidebar.allCountries')}</span>
              <ChevronDown className="w-3.5 h-3.5 shrink-0" />
            </div>
          </button>

          {showMoreModal && (
            <div className="mt-2 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl space-y-1 animate-in fade-in slide-in-from-top-1">
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 px-2 py-1 font-montserrat">
                {t('sidebar.allCountries')}
              </div>
              {otherCountries.map((c) => {
                const cName = getCountryName(c, language);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setSelectedOther(`${cName} (${c.standardRate}%)`);
                      onSelectRate(c.standardRate, cName);
                      setShowMoreModal(false);
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs transition-colors cursor-pointer font-inter"
                  >
                    <span className="flex items-center gap-2 min-w-0 pr-2">
                      <CountryFlag countryId={c.id} size={18} />
                      <span className="truncate">{cName}</span>
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white font-montserrat shrink-0">{c.standardRate}%</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

