import React from 'react';
import { HarmonyMode, PaletteStyle } from '../types';
import { HARMONY_OPTIONS, QUICK_PALETTES, QuickPresetCategory } from '../data/presets';

interface SidebarProps {
  currentHarmony: HarmonyMode;
  onSelectHarmony: (harmony: HarmonyMode) => void;
  onSelectQuickPalette: (preset: QuickPresetCategory) => void;
  activeQuickId?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentHarmony,
  onSelectHarmony,
  onSelectQuickPalette,
  activeQuickId,
}) => {
  return (
    <aside className="w-full lg:w-64 shrink-0 space-y-6">
      {/* Color Harmonies Section */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 px-2">
          Цветовые схемы
        </h2>
        <div className="space-y-1">
          {HARMONY_OPTIONS.map((item) => {
            const isActive = currentHarmony === item.id;
            return (
              <button
                key={item.id}
                id={`btn-harmony-${item.id}`}
                onClick={() => onSelectHarmony(item.id)}
                className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  isActive
                    ? 'bg-blue-50/80 border border-blue-200 text-blue-900 shadow-2xs font-semibold'
                    : 'text-slate-700 hover:bg-slate-50 border border-transparent'
                }`}
              >
                {/* Visual harmony indicator dot cluster */}
                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                  <div className="flex -space-x-1 items-center">
                    {item.dots.slice(0, 3).map((dotColor, idx) => (
                      <span
                        key={idx}
                        className="w-2.5 h-2.5 rounded-full border border-white shadow-2xs"
                        style={{ backgroundColor: dotColor }}
                      />
                    ))}
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="text-xs font-medium leading-tight truncate">
                    {item.name}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate leading-tight mt-0.5">
                    {item.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Palettes Section */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 px-2">
          Быстрые палитры
        </h2>
        <div className="space-y-1.5">
          {QUICK_PALETTES.map((preset) => {
            const isActive = activeQuickId === preset.id;
            return (
              <button
                key={preset.id}
                id={`btn-quick-${preset.id}`}
                onClick={() => onSelectQuickPalette(preset)}
                className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                  isActive
                    ? 'bg-slate-100 border border-slate-300 font-semibold'
                    : 'hover:bg-slate-50 border border-transparent'
                }`}
              >
                {/* 5-stripe preview strip */}
                <div className="flex w-14 h-5 rounded-md overflow-hidden shrink-0 shadow-2xs border border-black/5">
                  {preset.colors.map((c, i) => (
                    <div
                      key={i}
                      className="flex-1 h-full"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>

                <span className="text-xs font-medium text-slate-700 truncate">
                  {preset.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
