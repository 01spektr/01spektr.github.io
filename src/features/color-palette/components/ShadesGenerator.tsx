import React, { useState } from 'react';
import { ColorItem } from '../types';
import { generateShades, exportTailwindConfig, ShadeStep } from '../utils/shadesUtils';
import { Copy, Check, Code, FileText } from 'lucide-react';

interface ShadesGeneratorProps {
  colors: ColorItem[];
  selectedIndex: number;
  onSelectColorIndex: (index: number) => void;
  onReplaceCurrentColor: (newHex: string) => void;
  onNotify: (msg: string) => void;
}

export const ShadesGenerator: React.FC<ShadesGeneratorProps> = ({
  colors,
  selectedIndex,
  onSelectColorIndex,
  onReplaceCurrentColor,
  onNotify,
}) => {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);
  const [showTailwindCode, setShowTailwindCode] = useState(false);

  const activeColor = colors[selectedIndex] || colors[0];
  const shades = generateShades(activeColor.hex);

  const handleCopyShade = (shade: ShadeStep) => {
    navigator.clipboard.writeText(shade.hex);
    setCopiedStep(shade.step);
    onNotify(`Скопирован оттенок ${shade.step}: ${shade.hex}`);
    setTimeout(() => setCopiedStep(null), 1500);
  };

  const handleCopyTailwind = () => {
    const config = exportTailwindConfig(colors);
    navigator.clipboard.writeText(config);
    onNotify('Tailwind конфигурация скопирована в буфер!');
  };

  return (
    <div className="flex flex-col justify-between h-full space-y-3">
      <div>
        {/* Header & Swatch selector */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-xs font-bold text-slate-900">Шкала оттенков (50–950)</h3>
            <p className="text-[11px] text-slate-500">Дизайн-токены для Tailwind и CSS</p>
          </div>
          <button
            type="button"
            onClick={handleCopyTailwind}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/80 rounded-lg transition-colors cursor-pointer"
            title="Скопировать Tailwind config"
          >
            <Code className="w-3.5 h-3.5" />
            <span>Tailwind</span>
          </button>
        </div>

        {/* Color Switcher Bar */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl mb-3">
          {colors.map((c, idx) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelectColorIndex(idx)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1 px-1.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                idx === selectedIndex
                  ? 'bg-white shadow-xs text-slate-900 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span
                className="w-3 h-3 rounded-full shrink-0 border border-black/10"
                style={{ backgroundColor: c.hex }}
              />
              <span className="truncate hidden sm:inline">{c.role}</span>
            </button>
          ))}
        </div>

        {/* 11 Shades Vertical/Horizontal Stack */}
        <div className="space-y-1">
          {shades.map((shade) => {
            const isBase = shade.isBase;
            const isCopied = copiedStep === shade.step;
            const isDark = shade.step >= 600;

            return (
              <div
                key={shade.step}
                onClick={() => handleCopyShade(shade)}
                className={`group flex items-center justify-between px-3 py-1.5 rounded-lg transition-all cursor-pointer border ${
                  isBase
                    ? 'border-blue-400 ring-2 ring-blue-500/20 shadow-xs'
                    : 'border-transparent hover:scale-[1.01]'
                }`}
                style={{ backgroundColor: shade.hex }}
                title={`Нажмите, чтобы скопировать ${shade.hex}`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono text-xs font-bold ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {shade.step}
                  </span>
                  {isBase && (
                    <span
                      className={`text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.2 rounded ${
                        isDark ? 'bg-white/20 text-white' : 'bg-black/10 text-slate-800'
                      }`}
                    >
                      Базовый
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono text-xs ${
                      isDark ? 'text-white/90' : 'text-slate-800'
                    }`}
                  >
                    {shade.hex}
                  </span>
                  <div
                    className={`p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
                      isDark ? 'text-white hover:bg-white/20' : 'text-slate-800 hover:bg-black/10'
                    }`}
                  >
                    {isCopied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
        <span>Клик по строке копирует значение</span>
        <button
          type="button"
          onClick={() => onReplaceCurrentColor(shades[5].hex)}
          className="text-blue-600 hover:underline font-medium cursor-pointer"
        >
          Применить шаг 500
        </button>
      </div>
    </div>
  );
};
