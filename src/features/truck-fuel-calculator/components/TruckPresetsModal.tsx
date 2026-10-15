import React, { useState, useMemo } from 'react';
import { X, Truck, Check, Search, Zap } from 'lucide-react';
import { TruckPreset } from '../types/calculator';
import { TRUCK_PRESETS } from '../utils/constants';
import { TranslationData } from '../locales/i18n';

interface TruckPresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedModel?: string;
  onSelectPreset: (preset: TruckPreset) => void;
  t: TranslationData['modals'];
}

export const TruckPresetsModal: React.FC<TruckPresetsModalProps> = ({
  isOpen,
  onClose,
  selectedModel,
  onSelectPreset,
  t,
}) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: t.trucksAll },
    { id: 'tractor', label: t.trucksTractors },
    { id: 'dump', label: t.trucksDumps },
    { id: 'medium', label: t.trucksMedium },
    { id: 'light', label: t.trucksLight },
  ];

  const filteredTrucks = useMemo(() => {
    return TRUCK_PRESETS.filter((truck) => {
      const matchCat =
        activeCategory === 'all' ||
        truck.category === activeCategory ||
        (activeCategory === 'tractor' && (!truck.category || truck.category === 'tractor'));

      const query = search.toLowerCase();
      const matchSearch =
        !search ||
        truck.brand.toLowerCase().includes(query) ||
        truck.model.toLowerCase().includes(query) ||
        (truck.wheelFormula && truck.wheelFormula.toLowerCase().includes(query));

      return matchCat && matchSearch;
    });
  }, [search, activeCategory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[85vh] animate-in fade-in zoom-in-95 duration-150 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                {t.trucksTitle}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {t.trucksSub} ({TRUCK_PRESETS.length})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.trucksSearch}
              className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* List of Models */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredTrucks.length === 0 ? (
            <div className="col-span-2 py-12 text-center text-slate-400 text-xs">
              {t.trucksSearch}
            </div>
          ) : (
            filteredTrucks.map((truck) => {
              const isSelected =
                selectedModel === truck.model ||
                selectedModel === `${truck.brand} ${truck.model}` ||
                (selectedModel && selectedModel.includes(truck.brand) && selectedModel.includes(truck.model));

              return (
                <button
                  key={truck.id}
                  type="button"
                  onClick={() => {
                    onSelectPreset(truck);
                    onClose();
                  }}
                  className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 ring-2 ring-blue-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                          {truck.brand}
                        </span>
                        {truck.wheelFormula && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                            {truck.wheelFormula}
                          </span>
                        )}
                      </div>
                      {isSelected && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400">
                          <Check className="w-3.5 h-3.5" /> {t.trucksSelected}
                        </span>
                      )}
                    </div>
                    <div className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white leading-snug">
                      {truck.model}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700/60 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">{t.trucksBase}</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {truck.baseConsumption} L/100 km
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">{t.trucksPerTon}</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        +{truck.cargoNormPerTon} L/100km
                      </span>
                    </div>
                    <div className="col-span-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-amber-500" /> {truck.enginePowerHp} {t.trucksHp}
                      </span>
                      <span className="capitalize">
                        {truck.fuelType}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>{t.trucksHint}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg cursor-pointer"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
