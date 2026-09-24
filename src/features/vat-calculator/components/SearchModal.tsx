import React, { useState, useEffect } from 'react';
import { Search, X, Calculator, ArrowRight } from 'lucide-react';
import { COUNTRIES, getCountryName } from '../data/countries';
import { VatMode } from '../types';
import { useApp } from '../context/AppContext';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCountryRate: (rate: number, countryName: string) => void;
  onSelectMode: (mode: VatMode) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectCountryRate,
  onSelectMode,
}) => {
  const { t, language } = useApp();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredCountries = COUNTRIES.filter((c) => {
    const localizedName = getCountryName(c, language);
    return (
      localizedName.toLowerCase().includes(query.toLowerCase()) ||
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.standardRate.toString().includes(query)
    );
  });

  const modesList: { mode: VatMode; title: string; desc: string }[] = [
    { mode: 'add', title: t('modes.add'), desc: t('modes.addDesc') },
    { mode: 'extract', title: t('modes.extract'), desc: t('modes.extractDesc') },
    { mode: 'calculate_only', title: t('modes.calculateVatOnly'), desc: t('modes.calculateVatOnlyDesc') },
  ];

  const filteredModes = modesList.filter(
    (m) =>
      m.title.toLowerCase().includes(query.toLowerCase()) ||
      m.desc.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in slide-in-from-top-4 duration-150">
        <div className="p-3.5 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('sidebar.searchPlaceholder')}
            className="w-full text-sm outline-hidden text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 bg-transparent font-inter"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-md cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 space-y-1 font-inter">
          {/* Modes */}
          {filteredModes.length > 0 && (
            <div className="px-2 py-1 text-[11px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
              {t('modes.stepTitle')}
            </div>
          )}
          {filteredModes.map((m) => (
            <button
              key={m.mode}
              type="button"
              onClick={() => {
                onSelectMode(m.mode);
                onClose();
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800 text-left group transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Calculator className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-700 dark:group-hover:text-blue-400">
                    {m.title}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">{m.desc}</div>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
            </button>
          ))}

          {/* Countries */}
          {filteredCountries.length > 0 && (
            <div className="px-2 pt-2 py-1 text-[11px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
              {t('sidebar.title')}
            </div>
          )}
          {filteredCountries.map((c) => {
            const countryName = getCountryName(c, language);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  onSelectCountryRate(c.standardRate, countryName);
                  onClose();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800 text-left group transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">{c.flag}</span>
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-700 dark:group-hover:text-blue-400">
                      {countryName}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{c.note || `Rate ${c.standardRate}%`}</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/60 px-2 py-0.5 rounded-md">
                  {c.standardRate}%
                </span>
              </button>
            );
          })}

          {filteredCountries.length === 0 && filteredModes.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
              {t('sidebar.noCountriesFound')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

