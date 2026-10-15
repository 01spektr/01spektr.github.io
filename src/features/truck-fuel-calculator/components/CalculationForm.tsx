import React, { useState } from 'react';
import {
  Car,
  Truck,
  FileText,
  Fuel,
  Droplet,
  Clock,
  Route,
  Package,
  Layers,
  Mountain,
  TrendingUp,
  TrendingDown,
  Snowflake,
  Thermometer,
  Compass,
  Building2,
  SlidersHorizontal,
  Wind,
  Fan,
  RotateCcw,
  Calculator as CalculatorIcon,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Sparkles,
  Tag,
} from 'lucide-react';
import {
  CalculatorState,
  CalcMode,
  FuelType,
  TerrainType,
  MountainCondition,
  SeasonType,
  RoadCondition,
  WindCondition,
  EquipmentCondition,
} from '../types/calculator';
import { CURRENCIES, TRUCK_PRESETS } from '../utils/constants';
import { TranslationData } from '../locales/i18n';

interface CalculationFormProps {
  state: CalculatorState;
  onChange: (patch: Partial<CalculatorState>) => void;
  onReset: () => void;
  onCalculate: () => void;
  onOpenTruckPresets: () => void;
  t: TranslationData['form'];
}

export const CalculationForm: React.FC<CalculationFormProps> = ({
  state,
  onChange,
  onReset,
  onCalculate,
  onOpenTruckPresets,
  t,
}) => {
  const [extraConditionsOpen, setExtraConditionsOpen] = useState(false);

  const handleModeChange = (newMode: CalcMode) => {
    onChange({ mode: newMode });
  };

  const handleLoadedChange = (val: number) => {
    const loaded = Math.max(0, val);
    onChange({
      loadedDistance: loaded,
      totalDistance: loaded + state.emptyDistance,
    });
  };

  const handleEmptyChange = (val: number) => {
    const empty = Math.max(0, val);
    onChange({
      emptyDistance: empty,
      totalDistance: state.loadedDistance + empty,
    });
  };

  const handleTotalDistanceChange = (val: number) => {
    const total = Math.max(0, val);
    if (state.totalDistance > 0) {
      const ratio = state.loadedDistance / state.totalDistance;
      const newLoaded = Math.round(total * ratio);
      onChange({
        totalDistance: total,
        loadedDistance: newLoaded,
        emptyDistance: Math.max(0, total - newLoaded),
      });
    } else {
      onChange({ totalDistance: total, loadedDistance: total, emptyDistance: 0 });
    }
  };

  const distanceUnitLabel = state.distanceUnit === 'miles' ? 'miles' : 'km';
  const currencySymbol = CURRENCIES[state.currency].symbol;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-3.5 sm:p-6 flex flex-col gap-5 sm:gap-6 transition-colors">
      {/* Mode Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
        {/* Tab 1: Quick */}
        <button
          type="button"
          onClick={() => handleModeChange('quick')}
          className={`flex items-center gap-3 p-3.5 rounded-xl text-left transition-all cursor-pointer ${
            state.mode === 'quick'
              ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-600'
              : 'bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700'
          }`}
        >
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
              state.mode === 'quick'
                ? 'bg-white/20 text-white'
                : 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
            }`}
          >
            <Car className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-xs sm:text-sm leading-tight">{t.tabQuick}</div>
            <div
              className={`text-[11px] mt-0.5 ${
                state.mode === 'quick' ? 'text-blue-100' : 'text-slate-400 dark:text-slate-400'
              }`}
            >
              {t.tabQuickSub}
            </div>
          </div>
        </button>

        {/* Tab 2: Freight */}
        <button
          type="button"
          onClick={() => handleModeChange('freight')}
          className={`flex items-center gap-3 p-3.5 rounded-xl text-left transition-all cursor-pointer ${
            state.mode === 'freight'
              ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-600'
              : 'bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700'
          }`}
        >
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
              state.mode === 'freight'
                ? 'bg-white/20 text-white'
                : 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
            }`}
          >
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-xs sm:text-sm leading-tight">{t.tabFreight}</div>
            <div
              className={`text-[11px] mt-0.5 ${
                state.mode === 'freight' ? 'text-blue-100' : 'text-slate-400 dark:text-slate-400'
              }`}
            >
              {t.tabFreightSub}
            </div>
          </div>
        </button>

        {/* Tab 3: Normative */}
        <button
          type="button"
          onClick={() => handleModeChange('normative')}
          className={`flex items-center gap-3 p-3.5 rounded-xl text-left transition-all cursor-pointer ${
            state.mode === 'normative'
              ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-600'
              : 'bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700'
          }`}
        >
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
              state.mode === 'normative'
                ? 'bg-white/20 text-white'
                : 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
            }`}
          >
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-xs sm:text-sm leading-tight">{t.tabNormative}</div>
            <div
              className={`text-[11px] mt-0.5 ${
                state.mode === 'normative' ? 'text-blue-100' : 'text-slate-400 dark:text-slate-400'
              }`}
            >
              {t.tabNormativeSub}
            </div>
          </div>
        </button>
      </div>

      {/* Normative Model Quick Selector Banner */}
      {state.mode === 'normative' && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 rounded-xl">
          <div className="flex items-center gap-2.5">
            <Truck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {t.modelBannerTitle}{' '}
              <span className="text-blue-700 dark:text-blue-300 font-bold">{state.selectedTruckModel || 'MAN TGX 18.480'}</span>
            </span>
          </div>
          <button
            type="button"
            onClick={onOpenTruckPresets}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-blue-200 dark:border-blue-700 shadow-2xs hover:bg-blue-50 dark:hover:bg-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.modelBannerBtn} ({TRUCK_PRESETS.length})</span>
          </button>
        </div>
      )}

      {/* ----------------- SECTION 1: Основные параметры ----------------- */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold shrink-0">
            1
          </span>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">{t.sec1Title}</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 items-end">
          {/* Fuel type */}
          <div>
            <div className="h-9 flex flex-col justify-end mb-1">
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 leading-tight">
                {t.fuelTypeLabel}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight h-3.5 select-none">
                &nbsp;
              </span>
            </div>
            <div className="relative h-10">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Fuel className="w-4 h-4" />
              </div>
              <select
                value={state.fuelType}
                onChange={(e) => onChange({ fuelType: e.target.value as FuelType })}
                className="w-full h-full pl-9 pr-8 bg-white dark:bg-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800 focus:bg-white text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="diesel">{t.fuelDiesel}</option>
                <option value="petrol95">{t.fuelPetrol95}</option>
                <option value="petrol92">{t.fuelPetrol92}</option>
                <option value="lpg">{t.fuelLpg}</option>
                <option value="cng">{t.fuelCng}</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Average consumption */}
          <div>
            <div className="h-9 flex flex-col justify-end mb-1">
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 leading-tight truncate">
                {t.avgConsumptionLabel}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight h-3.5">
                {t.avgConsumptionUnit}
              </span>
            </div>
            <div className="relative h-10">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Droplet className="w-4 h-4" />
              </div>
              <input
                type="number"
                min="1"
                step="0.5"
                value={state.avgConsumption || ''}
                onChange={(e) => onChange({ avgConsumption: parseFloat(e.target.value) || 0 })}
                className="w-full h-full pl-9 pr-3 bg-white dark:bg-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all tabular-nums"
                placeholder="32"
              />
            </div>
          </div>

          {/* Total Distance */}
          <div>
            <div className="h-9 flex flex-col justify-end mb-1">
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 leading-tight truncate">
                {t.totalDistanceLabel}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight h-3.5">
                {distanceUnitLabel}
              </span>
            </div>
            <div className="relative h-10">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Clock className="w-4 h-4" />
              </div>
              <input
                type="number"
                min="0"
                step="1"
                value={state.totalDistance || ''}
                onChange={(e) => handleTotalDistanceChange(parseFloat(e.target.value) || 0)}
                className="w-full h-full pl-9 pr-3 bg-white dark:bg-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all tabular-nums"
                placeholder="450"
              />
            </div>
          </div>

          {/* Fuel price (NO DOLLAR SIGN - using neutral Tag icon as requested) */}
          <div>
            <div className="h-9 flex flex-col justify-end mb-1">
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 leading-tight truncate">
                {t.fuelPriceLabel}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight h-3.5 truncate">
                {t.fuelPriceSub} ({currencySymbol})
              </span>
            </div>
            <div className="relative h-10">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Tag className="w-4 h-4" />
              </div>
              <input
                type="number"
                min="0"
                step={state.currency === 'UZS' ? 100 : 0.05}
                value={state.fuelPrice || ''}
                onChange={(e) => onChange({ fuelPrice: parseFloat(e.target.value) || 0 })}
                className="w-full h-full pl-9 pr-3 bg-white dark:bg-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all tabular-nums"
                placeholder="1.20"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ----------------- SECTION 2: Загрузка и маршрут ----------------- */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold shrink-0">
            2
          </span>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">{t.sec2Title}</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 items-end">
          {/* Loaded distance */}
          <div>
            <div className="h-9 flex flex-col justify-end mb-1">
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 leading-tight truncate">
                {t.loadedDistLabel}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight h-3.5">
                {distanceUnitLabel}
              </span>
            </div>
            <div className="relative h-10">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Route className="w-4 h-4" />
              </div>
              <input
                type="number"
                min="0"
                step="1"
                value={state.loadedDistance || ''}
                onChange={(e) => handleLoadedChange(parseFloat(e.target.value) || 0)}
                className="w-full h-full pl-9 pr-3 bg-white dark:bg-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all tabular-nums"
                placeholder="350"
              />
            </div>
          </div>

          {/* Empty distance */}
          <div>
            <div className="h-9 flex flex-col justify-end mb-1">
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 leading-tight truncate">
                {t.emptyDistLabel}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight h-3.5">
                {distanceUnitLabel}
              </span>
            </div>
            <div className="relative h-10">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Route className="w-4 h-4" />
              </div>
              <input
                type="number"
                min="0"
                step="1"
                value={state.emptyDistance || ''}
                onChange={(e) => handleEmptyChange(parseFloat(e.target.value) || 0)}
                className="w-full h-full pl-9 pr-3 bg-white dark:bg-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all tabular-nums"
                placeholder="100"
              />
            </div>
          </div>

          {/* Cargo weight */}
          <div>
            <div className="h-9 flex flex-col justify-end mb-1">
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 leading-tight truncate">
                {t.cargoWeightLabel}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight h-3.5">
                {t.cargoWeightUnit}
              </span>
            </div>
            <div className="relative h-10">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Package className="w-4 h-4" />
              </div>
              <input
                type="number"
                min="0"
                step="0.5"
                value={state.cargoWeight || ''}
                onChange={(e) => onChange({ cargoWeight: parseFloat(e.target.value) || 0 })}
                className="w-full h-full pl-9 pr-3 bg-white dark:bg-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all tabular-nums"
                placeholder="20"
              />
            </div>
          </div>

          {/* Trailer weight */}
          <div>
            <div className="h-9 flex flex-col justify-end mb-1">
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 leading-tight truncate">
                {t.trailerWeightLabel}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight h-3.5">
                {t.trailerWeightUnit}
              </span>
            </div>
            <div className="relative h-10">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Layers className="w-4 h-4" />
              </div>
              <input
                type="number"
                min="0"
                step="0.5"
                value={state.trailerWeight || ''}
                onChange={(e) => onChange({ trailerWeight: parseFloat(e.target.value) || 0 })}
                className="w-full h-full pl-9 pr-3 bg-white dark:bg-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all tabular-nums"
                placeholder="10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ----------------- SECTION 3: Рельеф и высота ----------------- */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold shrink-0">
            3
          </span>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            {t.sec3Title} <span className="text-slate-400 dark:text-slate-500 font-normal text-xs">{t.sec3Sub}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 items-end">
          {/* Terrain Type */}
          <div>
            <div className="h-9 flex flex-col justify-end mb-1">
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 leading-tight">
                {t.terrainLabel}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight h-3.5 select-none">
                &nbsp;
              </span>
            </div>
            <div className="relative h-10">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mountain className="w-4 h-4" />
              </div>
              <select
                value={state.terrainType}
                onChange={(e) => onChange({ terrainType: e.target.value as TerrainType })}
                className="w-full h-full pl-9 pr-8 bg-white dark:bg-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="mixed">{t.terrainMixed}</option>
                <option value="flat">{t.terrainFlat}</option>
                <option value="hilly">{t.terrainHilly}</option>
                <option value="mountainous">{t.terrainMountainous}</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Total Ascent */}
          <div>
            <div className="h-9 flex flex-col justify-end mb-1">
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 leading-tight truncate">
                {t.ascentLabel}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight h-3.5">
                {t.ascentUnit}
              </span>
            </div>
            <div className="relative h-10">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-600">
                <TrendingUp className="w-4 h-4" />
              </div>
              <input
                type="number"
                min="0"
                step="50"
                value={state.totalAscent || ''}
                onChange={(e) => onChange({ totalAscent: parseFloat(e.target.value) || 0 })}
                className="w-full h-full pl-9 pr-3 bg-white dark:bg-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all tabular-nums"
                placeholder="800"
              />
            </div>
          </div>

          {/* Total Descent */}
          <div>
            <div className="h-9 flex flex-col justify-end mb-1">
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 leading-tight truncate">
                {t.descentLabel}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight h-3.5">
                {t.descentUnit}
              </span>
            </div>
            <div className="relative h-10">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-600">
                <TrendingDown className="w-4 h-4" />
              </div>
              <input
                type="number"
                min="0"
                step="50"
                value={state.totalDescent || ''}
                onChange={(e) => onChange({ totalDescent: parseFloat(e.target.value) || 0 })}
                className="w-full h-full pl-9 pr-3 bg-white dark:bg-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all tabular-nums"
                placeholder="600"
              />
            </div>
          </div>

          {/* Mountain Conditions */}
          <div>
            <div className="h-9 flex flex-col justify-end mb-1">
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 leading-tight truncate">
                {t.mountainCondLabel}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight h-3.5 select-none">
                &nbsp;
              </span>
            </div>
            <div className="relative h-10">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mountain className="w-4 h-4" />
              </div>
              <select
                value={state.mountainCondition}
                onChange={(e) => onChange({ mountainCondition: e.target.value as MountainCondition })}
                className="w-full h-full pl-9 pr-8 bg-white dark:bg-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="none">{t.mountainNone}</option>
                <option value="moderate">{t.mountainModerate}</option>
                <option value="high">{t.mountainHigh}</option>
                <option value="extreme">{t.mountainExtreme}</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ----------------- SECTION 4: Дополнительные условия ----------------- */}
      <div className="border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 bg-slate-50/40 dark:bg-slate-800/40">
        <button
          type="button"
          onClick={() => setExtraConditionsOpen(!extraConditionsOpen)}
          className="w-full flex items-center justify-between text-left group cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold shrink-0">
              4
            </span>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>{t.sec4Title}</span>
                <span className="text-slate-400 dark:text-slate-500 font-normal text-xs">{t.sec4Sub}</span>
              </div>
              <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                {t.sec4Desc}
              </div>
            </div>
          </div>
          <div className="p-1 rounded-lg text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700 transition-colors">
            {extraConditionsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {extraConditionsOpen && (
          <div className="mt-4 pt-4 border-t border-slate-200/70 dark:border-slate-800 flex flex-col gap-4">
            {/* Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 items-end">
              {/* Season */}
              <div>
                <div className="h-7 flex flex-col justify-end mb-1">
                  <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 leading-tight">
                    {t.seasonLabel}
                  </span>
                </div>
                <div className="relative h-10">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Snowflake className="w-4 h-4" />
                  </div>
                  <select
                    value={state.season}
                    onChange={(e) => onChange({ season: e.target.value as SeasonType })}
                    className="w-full h-full pl-9 pr-8 bg-white dark:bg-slate-800 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="summer">{t.seasonSummer}</option>
                    <option value="transition">{t.seasonTransition}</option>
                    <option value="winter_mild">{t.seasonWinterMild}</option>
                    <option value="winter_severe">{t.seasonWinterSevere}</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Temperature */}
              <div>
                <div className="h-7 flex flex-col justify-end mb-1">
                  <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 leading-tight truncate">
                    {t.tempLabel}
                  </span>
                </div>
                <div className="relative h-10">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Thermometer className="w-4 h-4" />
                  </div>
                  <input
                    type="number"
                    value={state.temperature}
                    onChange={(e) => onChange({ temperature: parseFloat(e.target.value) || 0 })}
                    className="w-full h-full pl-9 pr-3 bg-white dark:bg-slate-800 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all tabular-nums"
                    placeholder="+20"
                  />
                </div>
              </div>

              {/* Road conditions */}
              <div>
                <div className="h-7 flex flex-col justify-end mb-1">
                  <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 leading-tight truncate">
                    {t.roadLabel}
                  </span>
                </div>
                <div className="relative h-10">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Compass className="w-4 h-4" />
                  </div>
                  <select
                    value={state.roadCondition}
                    onChange={(e) => onChange({ roadCondition: e.target.value as RoadCondition })}
                    className="w-full h-full pl-9 pr-8 bg-white dark:bg-slate-800 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="good">{t.roadGood}</option>
                    <option value="medium">{t.roadMedium}</option>
                    <option value="bad">{t.roadBad}</option>
                    <option value="offroad">{t.roadOffroad}</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Idle hours */}
              <div>
                <div className="h-7 flex flex-col justify-end mb-1">
                  <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 leading-tight truncate">
                    {t.idleLabel} <span className="text-slate-400 dark:text-slate-500 font-normal">{t.idleUnit}</span>
                  </span>
                </div>
                <div className="relative h-10">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Clock className="w-4 h-4" />
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={state.idleHours}
                    onChange={(e) => onChange({ idleHours: parseFloat(e.target.value) || 0 })}
                    className="w-full h-full pl-9 pr-3 bg-white dark:bg-slate-800 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all tabular-nums"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 items-end">
              {/* City cycle */}
              <div>
                <div className="h-7 flex flex-col justify-end mb-1">
                  <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 leading-tight truncate">
                    {t.cityLabel}
                  </span>
                </div>
                <div className="relative h-10">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="5"
                    value={state.cityCyclePercent}
                    onChange={(e) => onChange({ cityCyclePercent: parseFloat(e.target.value) || 0 })}
                    className="w-full h-full pl-9 pr-8 bg-white dark:bg-slate-800 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all tabular-nums"
                    placeholder="0"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 text-xs font-semibold">
                    %
                  </div>
                </div>
              </div>

              {/* Additional coeff */}
              <div>
                <div className="h-7 flex flex-col justify-end mb-1">
                  <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 leading-tight truncate">
                    {t.coeffLabel}
                  </span>
                </div>
                <div className="relative h-10">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <SlidersHorizontal className="w-4 h-4" />
                  </div>
                  <input
                    type="number"
                    min="-50"
                    max="100"
                    step="1"
                    value={state.additionalCoeffPercent}
                    onChange={(e) => onChange({ additionalCoeffPercent: parseFloat(e.target.value) || 0 })}
                    className="w-full h-full pl-9 pr-8 bg-white dark:bg-slate-800 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all tabular-nums"
                    placeholder="0"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 text-xs font-semibold">
                    %
                  </div>
                </div>
              </div>

              {/* Headwind */}
              <div>
                <div className="h-7 flex flex-col justify-end mb-1">
                  <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 leading-tight truncate">
                    {t.windLabel}
                  </span>
                </div>
                <div className="relative h-10">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Wind className="w-4 h-4" />
                  </div>
                  <select
                    value={state.headwind}
                    onChange={(e) => onChange({ headwind: e.target.value as WindCondition })}
                    className="w-full h-full pl-9 pr-8 bg-white dark:bg-slate-800 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="none">{t.windNone}</option>
                    <option value="moderate">{t.windModerate}</option>
                    <option value="strong">{t.windStrong}</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Equipment */}
              <div>
                <div className="h-7 flex flex-col justify-end mb-1">
                  <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 leading-tight truncate">
                    {t.equipLabel}
                  </span>
                </div>
                <div className="relative h-10">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Fan className="w-4 h-4" />
                  </div>
                  <select
                    value={state.equipment}
                    onChange={(e) => onChange({ equipment: e.target.value as EquipmentCondition })}
                    className="w-full h-full pl-9 pr-8 bg-white dark:bg-slate-800 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="none">{t.equipNone}</option>
                    <option value="ac">{t.equipAc}</option>
                    <option value="refrigeration">{t.equipRef}</option>
                    <option value="pto">{t.equipPto}</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ----------------- BOTTOM ACTIONS ----------------- */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        {/* Reset button */}
        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto h-11 flex items-center justify-center gap-2 px-5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xs transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          <span>{t.btnReset}</span>
        </button>

        {/* Calculate button */}
        <button
          type="button"
          onClick={onCalculate}
          className="w-full sm:w-auto h-11 flex items-center justify-center gap-2.5 px-8 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-xs shadow-blue-500/25 transition-all cursor-pointer group"
        >
          <CalculatorIcon className="w-4 h-4 text-white/90" />
          <span>{t.btnCalculate}</span>
          <ArrowRight className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
