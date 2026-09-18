import React from 'react';
import { PaletteStyle } from '../types';
import { Shuffle, RotateCcw } from 'lucide-react';

interface SettingsPanelProps {
  autoGenerate: boolean;
  onToggleAutoGenerate: () => void;
  colorCount: number;
  onChangeColorCount: (count: number) => void;
  style: PaletteStyle;
  onChangeStyle: (style: PaletteStyle) => void;
  saturation: number;
  onChangeSaturation: (val: number) => void;
  brightness: number;
  onChangeBrightness: (val: number) => void;
  onGenerate: () => void;
  onReset: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  autoGenerate,
  onToggleAutoGenerate,
  colorCount,
  onChangeColorCount,
  style,
  onChangeStyle,
  saturation,
  onChangeSaturation,
  brightness,
  onChangeBrightness,
  onGenerate,
  onReset,
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between h-full">
      <div className="space-y-5">
        {/* Header */}
        <h2 className="text-sm font-bold text-slate-900">Настройки</h2>

        {/* Autogeneration Toggle */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs font-semibold text-slate-900 leading-tight">
              Автогенерация
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
              Автоматически создаёт гармоничную палитру
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={autoGenerate}
            onClick={onToggleAutoGenerate}
            className={`w-11 h-6 shrink-0 rounded-full transition-colors relative focus:outline-hidden p-0.5 ${
              autoGenerate ? 'bg-blue-600' : 'bg-slate-200'
            }`}
          >
            <span
              className={`block w-5 h-5 rounded-full bg-white shadow-xs transform transition-transform ${
                autoGenerate ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Color Count Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Количество цветов
          </label>
          <div className="grid grid-cols-4 gap-1.5 bg-slate-100 p-1 rounded-xl">
            {[3, 4, 5, 6].map((count) => {
              const isActive = colorCount === count;
              return (
                <button
                  key={count}
                  type="button"
                  id={`btn-count-${count}`}
                  onClick={() => onChangeColorCount(count)}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {count}
                </button>
              );
            })}
          </div>
        </div>

        {/* Style Dropdown */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Стиль
          </label>
          <div className="relative">
            <select
              value={style}
              onChange={(e) => onChangeStyle(e.target.value as PaletteStyle)}
              className="w-full appearance-none bg-white border border-slate-200 hover:border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 pr-8 focus:outline-hidden focus:border-blue-500 transition-colors cursor-pointer"
            >
              <option value="modern">Современный</option>
              <option value="pastel">Пастельный</option>
              <option value="vintage">Винтажный</option>
              <option value="neon">Неоновый</option>
              <option value="corporate">Корпоративный</option>
              <option value="warm">Тёплый</option>
              <option value="cool">Холодный</option>
              <option value="minimal">Минималистичный</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Saturation Slider */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="font-semibold text-slate-700">Насыщенность</span>
            <span className="font-mono text-slate-500">{saturation}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="150"
            value={saturation}
            onChange={(e) => onChangeSaturation(parseInt(e.target.value, 10))}
            className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
          />
        </div>

        {/* Brightness Slider */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="font-semibold text-slate-700">Яркость</span>
            <span className="font-mono text-slate-500">{brightness}%</span>
          </div>
          <input
            type="range"
            min="20"
            max="150"
            value={brightness}
            onChange={(e) => onChangeBrightness(parseInt(e.target.value, 10))}
            className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="pt-6 space-y-2">
        <button
          type="button"
          id="btn-generate-palette"
          onClick={onGenerate}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold text-xs py-3 rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <Shuffle className="w-4 h-4" />
          <span>Сгенерировать палитру</span>
        </button>

        <button
          type="button"
          id="btn-reset-palette"
          onClick={onReset}
          className="w-full flex items-center justify-center gap-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-50 active:scale-[0.98] text-xs font-medium py-2 rounded-xl transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Сбросить</span>
        </button>
      </div>
    </div>
  );
};
