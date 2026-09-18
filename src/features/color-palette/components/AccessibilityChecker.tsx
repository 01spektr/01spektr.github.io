import React, { useState } from 'react';
import { ColorItem, ColorBlindnessType } from '../types';
import { evaluateWcag, simulateColorBlindness } from '../utils/accessibilityUtils';
import { ShieldCheck, Eye, CheckCircle2, XCircle, Info } from 'lucide-react';

interface AccessibilityCheckerProps {
  colors: ColorItem[];
  colorBlindness: ColorBlindnessType;
  onChangeColorBlindness: (type: ColorBlindnessType) => void;
  onNotify: (msg: string) => void;
}

const BLINDNESS_OPTIONS: { id: ColorBlindnessType; label: string; desc: string }[] = [
  { id: 'none', label: 'Обычное зрение', desc: 'Стандартное восприятие цветов' },
  { id: 'deuteranopia', label: 'Дейтеранопия', desc: 'Сниженная чувствительность к зеленому (~5% мужчин)' },
  { id: 'protanopia', label: 'Протанопия', desc: 'Сниженная чувствительность к красному (~1% мужчин)' },
  { id: 'tritanopia', label: 'Тританопия', desc: 'Сниженная чувствительность к синему/желтому (редко)' },
  { id: 'achromatopsia', label: 'Ахроматопсия', desc: 'Полная цветовая слепота (оттенки серого)' },
];

export const AccessibilityChecker: React.FC<AccessibilityCheckerProps> = ({
  colors,
  colorBlindness,
  onChangeColorBlindness,
  onNotify,
}) => {
  const [bgIndex, setBgIndex] = useState(2); // Default to background swatch
  const [textIndex, setTextIndex] = useState(4); // Default to dark swatch

  const bgColor = colors[bgIndex] || colors[2] || colors[0];
  const textColor = colors[textIndex] || colors[4] || colors[1];

  // Apply blindness simulation if active
  const effectiveBgHex = simulateColorBlindness(bgColor.hex, colorBlindness);
  const effectiveTextHex = simulateColorBlindness(textColor.hex, colorBlindness);

  const rating = evaluateWcag(effectiveTextHex, effectiveBgHex);

  return (
    <div className="flex flex-col justify-between h-full space-y-4">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-xs font-bold text-slate-900">Доступность & Контраст (WCAG)</h3>
            <p className="text-[11px] text-slate-500">Проверка читаемости текста и симуляция дальтонизма</p>
          </div>
          <div className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md text-[11px] font-semibold text-slate-700">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>WCAG 2.1</span>
          </div>
        </div>

        {/* Color Blindness Simulator Mode */}
        <div className="mb-4">
          <label className="text-[11px] font-semibold text-slate-600 flex items-center gap-1.5 mb-1.5">
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span>Симулятор нарушений зрения:</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {BLINDNESS_OPTIONS.map((opt) => {
              const isActive = colorBlindness === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    onChangeColorBlindness(opt.id);
                    if (opt.id !== 'none') {
                      onNotify(`Включен режим: ${opt.label}`);
                    }
                  }}
                  className={`text-left p-1.5 rounded-lg border transition-all text-xs cursor-pointer ${
                    isActive
                      ? 'border-blue-500 bg-blue-50/80 text-blue-950 font-semibold shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                  title={opt.desc}
                >
                  <div className="truncate text-[11px] leading-tight">{opt.label}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Contrast Card Pair Tester */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
            <span>Пара для проверки контраста:</span>
            <span className="font-mono text-slate-900 font-bold">
              Коэффициент: {rating.ratio}:1
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block mb-1">Фон:</span>
              <select
                value={bgIndex}
                onChange={(e) => setBgIndex(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-800 focus:outline-hidden"
              >
                {colors.map((c, i) => (
                  <option key={c.id} value={i}>
                    {c.role} ({c.hex})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block mb-1">Текст:</span>
              <select
                value={textIndex}
                onChange={(e) => setTextIndex(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-800 focus:outline-hidden"
              >
                {colors.map((c, i) => (
                  <option key={c.id} value={i}>
                    {c.role} ({c.hex})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Interactive Contrast Box */}
          <div
            className="p-4 rounded-xl border border-black/10 transition-colors shadow-inner"
            style={{ backgroundColor: effectiveBgHex, color: effectiveTextHex }}
          >
            <div className="text-base font-bold mb-1">
              Пример крупного заголовка (Bold 18px)
            </div>
            <div className="text-xs leading-relaxed opacity-95">
              Обычный текст для чтения абзацев интерфейса. Читаемость и комфорт восприятия важны для всех пользователей.
            </div>
          </div>

          {/* WCAG Compliance Badges */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs">
              <span className="text-slate-600 font-medium">AA (обычный ≥4.5:1)</span>
              {rating.aaNormal ? (
                <span className="flex items-center gap-1 text-emerald-600 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Пройдено
                </span>
              ) : (
                <span className="flex items-center gap-1 text-rose-500 font-bold">
                  <XCircle className="w-3.5 h-3.5" /> Слабо
                </span>
              )}
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs">
              <span className="text-slate-600 font-medium">AAA (строгий ≥7.0:1)</span>
              {rating.aaaNormal ? (
                <span className="flex items-center gap-1 text-emerald-600 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Отлично
                </span>
              ) : (
                <span className="flex items-center gap-1 text-amber-600 font-bold">
                  <Info className="w-3.5 h-3.5" /> {rating.ratio >= 4.5 ? 'Допустимо' : 'Нет'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400">
        Стандарты соответствуют международным нормам веб-доступности W3C WCAG 2.1
      </div>
    </div>
  );
};
