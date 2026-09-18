import React, { useState } from 'react';
import { ColorItem, PreviewMode, ColorBlindnessType } from '../types';
import { Box, ArrowRight, CheckCircle, Smartphone, CreditCard, LayoutDashboard, Sun, Moon } from 'lucide-react';
import { getContrastTextColor } from '../utils/colorUtils';
import { simulateColorBlindness } from '../utils/accessibilityUtils';

interface LivePreviewProps {
  colors: ColorItem[];
  colorBlindness?: ColorBlindnessType;
}

export const LivePreview: React.FC<LivePreviewProps> = ({
  colors,
  colorBlindness = 'none',
}) => {
  const [mode, setMode] = useState<PreviewMode>('logo');
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);

  // Derive semantic colors from current palette and apply blindness if active
  const rawPrimary = colors[0]?.hex || '#2563EB';
  const rawSecondary = colors[1]?.hex || '#60A5FA';
  const rawBackground = colors[2]?.hex || '#DBEAFE';
  const rawLight = colors[3]?.hex || '#F8FAFC';
  const rawDark = colors[4]?.hex || colors[colors.length - 1]?.hex || '#0F172A';

  const primary = simulateColorBlindness(rawPrimary, colorBlindness);
  const secondary = simulateColorBlindness(rawSecondary, colorBlindness);
  const background = simulateColorBlindness(rawBackground, colorBlindness);
  const light = simulateColorBlindness(rawLight, colorBlindness);
  const dark = simulateColorBlindness(rawDark, colorBlindness);

  const primaryTextColor = getContrastTextColor(primary);
  const darkTextColor = getContrastTextColor(dark);

  // Background for preview container
  const containerBg = isDarkTheme ? dark : '#FFFFFF';
  const containerBorder = isDarkTheme ? `${secondary}30` : '#E2E8F0';

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between h-full">
      <div>
        {/* Header with Mode Selector & Dark/Light Toggle */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900">Предпросмотр</h2>
            {colorBlindness !== 'none' && (
              <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-1.5 py-0.5 rounded">
                Симуляция
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Dark / Light Mode Toggle */}
            <button
              type="button"
              onClick={() => setIsDarkTheme(!isDarkTheme)}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                isDarkTheme
                  ? 'bg-slate-800 border-slate-700 text-amber-300'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
              title={isDarkTheme ? 'Переключить на светлую тему' : 'Переключить на тёмную тему'}
            >
              {isDarkTheme ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            <div className="relative">
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as PreviewMode)}
                className="appearance-none bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700 pr-7 focus:outline-hidden cursor-pointer"
              >
                <option value="logo">Логотип</option>
                <option value="website">Веб-сайт</option>
                <option value="mobile">Приложение</option>
                <option value="card">Визитка</option>
                <option value="ui">UI Интерфейс</option>
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Container Screen */}
        <div
          className="relative rounded-xl border overflow-hidden min-h-[240px] flex items-center justify-center p-4 transition-colors"
          style={{ backgroundColor: containerBg, borderColor: containerBorder }}
        >

        {/* Mode 1: Логотип (matching the screenshot exactly) */}
        {mode === 'logo' && (
          <div className="w-full relative py-2 overflow-hidden">
            {/* Background geometric decorative shapes */}
            <div
              className="absolute -right-8 -top-8 w-44 h-44 rounded-full opacity-35 pointer-events-none"
              style={{ backgroundColor: background }}
            />
            <div
              className="absolute right-12 bottom-0 w-20 h-16 opacity-80 pointer-events-none"
              style={{
                clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                backgroundColor: secondary,
              }}
            />

            <div className="relative z-10 flex items-start justify-between">
              {/* Left Logo and Title */}
              <div className="space-y-2 max-w-[190px] sm:max-w-[210px]">
                {/* 3D Isometric Cube Icon */}
                <div className="w-10 h-10 relative">
                  <svg viewBox="0 0 48 48" className="w-full h-full drop-shadow-xs">
                    {/* Top face */}
                    <polygon points="24,4 42,14 24,24 6,14" fill={secondary} />
                    {/* Left face */}
                    <polygon points="6,14 24,24 24,44 6,34" fill={primary} />
                    {/* Right face */}
                    <polygon points="24,24 42,14 42,34 24,44" fill={dark} opacity="0.8" />
                  </svg>
                </div>

                <div>
                  <div
                    className="text-lg font-extrabold tracking-tight"
                    style={{ color: dark }}
                  >
                    Toolboxi
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                    Простые инструменты для больших задач
                  </p>
                </div>
              </div>

              {/* Right CTA and Links */}
              <div className="flex flex-col items-end space-y-2 shrink-0">
                <button
                  type="button"
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-transform active:scale-95"
                  style={{
                    backgroundColor: primary,
                    color: primaryTextColor,
                  }}
                >
                  Начать
                </button>
                <div className="flex flex-col items-end space-y-1 text-[11px] font-medium text-slate-600">
                  <span className="hover:text-blue-600 cursor-pointer">Инструменты</span>
                  <span className="hover:text-blue-600 cursor-pointer">Категории</span>
                  <span className="hover:text-blue-600 cursor-pointer">О проекте</span>
                </div>
              </div>
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center items-center gap-1.5 mt-6">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primary }} />
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: secondary, opacity: 0.5 }} />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            </div>
          </div>
        )}

        {/* Mode 2: Веб-сайт / Landing */}
        {mode === 'website' && (
          <div className="w-full space-y-3">
            <div
              className="p-3 rounded-lg flex items-center justify-between shadow-2xs"
              style={{ backgroundColor: light, border: `1px solid ${secondary}40` }}
            >
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md" style={{ backgroundColor: primary }} />
                <span className="text-xs font-bold" style={{ color: dark }}>Acme Brand</span>
              </div>
              <div className="flex gap-2">
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-semibold"
                  style={{ backgroundColor: primary, color: primaryTextColor }}
                >
                  Купить
                </span>
              </div>
            </div>

            <div
              className="p-4 rounded-xl relative overflow-hidden"
              style={{ backgroundColor: background }}
            >
              <h4 className="text-sm font-bold" style={{ color: dark }}>
                Современный дизайн для вашего бизнеса
              </h4>
              <p className="text-[11px] text-slate-600 mt-1">
                Гармония цвета увеличивает конверсию и узнаваемость.
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  className="px-3 py-1 text-[11px] font-semibold rounded-lg shadow-2xs"
                  style={{ backgroundColor: primary, color: primaryTextColor }}
                >
                  Узнать больше
                </button>
                <button
                  type="button"
                  className="px-3 py-1 text-[11px] font-semibold rounded-lg border"
                  style={{ borderColor: primary, color: primary }}
                >
                  Портфолио
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mode 3: Приложение */}
        {mode === 'mobile' && (
          <div
            className="w-full max-w-[240px] rounded-2xl p-3 shadow-md border"
            style={{ backgroundColor: light, borderColor: `${secondary}30` }}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold text-slate-500">9:41</span>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: primary }} />
            </div>

            <div
              className="p-3 rounded-xl text-white mb-2 shadow-2xs"
              style={{ backgroundColor: primary }}
            >
              <div className="text-[10px] opacity-80">Баланс аккаунта</div>
              <div className="text-base font-bold">148 500 ₽</div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div
                className="p-2 rounded-lg text-center text-[10px] font-semibold"
                style={{ backgroundColor: background, color: dark }}
              >
                Перевод
              </div>
              <div
                className="p-2 rounded-lg text-center text-[10px] font-semibold"
                style={{ backgroundColor: secondary, color: primaryTextColor }}
              >
                Пополнить
              </div>
            </div>
          </div>
        )}

        {/* Mode 4: Визитка / Печать */}
        {mode === 'card' && (
          <div
            className="w-full max-w-[280px] h-[160px] rounded-xl p-4 shadow-md relative overflow-hidden flex flex-col justify-between border"
            style={{ backgroundColor: light, borderColor: `${secondary}40` }}
          >
            {/* Color accent strip */}
            <div
              className="absolute left-0 top-0 bottom-0 w-2.5"
              style={{ backgroundColor: primary }}
            />
            <div
              className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-20"
              style={{ backgroundColor: secondary }}
            />

            <div>
              <div className="text-sm font-bold tracking-tight" style={{ color: dark }}>
                Александр Соколов
              </div>
              <div className="text-[11px] font-medium" style={{ color: primary }}>
                Арт-директор & Дизайнер
              </div>
            </div>

            <div className="text-[10px] text-slate-500 space-y-0.5 z-10">
              <div>hello@designstudio.ru</div>
              <div>+7 (999) 000-12-34</div>
              <div className="flex gap-1 pt-1">
                {colors.map((c, i) => (
                  <span
                    key={i}
                    className="w-3 h-1.5 rounded-xs"
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mode 5: UI Интерфейс */}
        {mode === 'ui' && (
          <div className="w-full space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold" style={{ color: dark }}>Прогресс задачи</span>
              <span className="font-bold" style={{ color: primary }}>74%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: '74%', backgroundColor: primary }}
              />
            </div>
            <div className="flex gap-2 pt-2">
              <span
                className="px-2.5 py-1 rounded-full text-[10px] font-bold"
                style={{ backgroundColor: background, color: dark }}
              >
                В процессе
              </span>
              <span
                className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white"
                style={{ backgroundColor: dark }}
              >
                Приоритет
              </span>
            </div>
          </div>
        )}
        </div>
      </div>

      {/* Active Palette Roles Mapping */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span className="font-medium text-slate-600">Цвета в макете:</span>
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {colors.slice(0, 5).map((c) => (
            <div
              key={c.id}
              className="flex items-center gap-1 bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded-md"
              title={`${c.role}: ${c.hex}`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
                style={{ backgroundColor: c.hex }}
              />
              <span className="font-mono text-[10px] text-slate-700 font-semibold">{c.hex}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
