import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ColorItem, HsvColor } from '../types';
import { rgbToHsv, hsvToRgb, rgbToHex, hexToRgb, clamp, rgbToHsl, hslToRgb, rgbToCmyk } from '../utils/colorUtils';
import { Copy, Trash2, Check } from 'lucide-react';

interface ColorPickerProps {
  currentColor: ColorItem;
  onChangeColor: (hex: string) => void;
  recentColors: string[];
  onClearRecentColors: () => void;
  onCopyText: (text: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  currentColor,
  onChangeColor,
  recentColors,
  onClearRecentColors,
  onCopyText,
}) => {
  const [activeTab, setActiveTab] = useState<'wheel' | 'sliders' | 'inputs'>('wheel');
  const [copiedHex, setCopiedHex] = useState(false);

  // HSV representation of current color
  const hsv = rgbToHsv(currentColor.rgb);

  // SV box reference
  const svBoxRef = useRef<HTMLDivElement>(null);
  const hueRingRef = useRef<HTMLDivElement>(null);
  const isDraggingSV = useRef(false);
  const isDraggingHue = useRef(false);

  // Handle Hue ring drag/click
  const updateHueFromEvent = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!hueRingRef.current) return;
      const rect = hueRingRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const dx = clientX - centerX;
      const dy = clientY - centerY;

      let angle = Math.atan2(dy, dx) * (180 / Math.PI);
      angle = (angle + 360 + 90) % 360; // 0 at top

      const newRgb = hsvToRgb({ h: angle, s: hsv.s, v: hsv.v });
      onChangeColor(rgbToHex(newRgb));
    },
    [hsv.s, hsv.v, onChangeColor]
  );

  // Handle Saturation/Value box drag/click
  const updateSVFromEvent = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!svBoxRef.current) return;
      const rect = svBoxRef.current.getBoundingClientRect();

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const x = clamp(clientX - rect.left, 0, rect.width);
      const y = clamp(clientY - rect.top, 0, rect.height);

      const s = (x / rect.width) * 100;
      const v = (1 - y / rect.height) * 100;

      const newRgb = hsvToRgb({ h: hsv.h, s, v });
      onChangeColor(rgbToHex(newRgb));
    },
    [hsv.h, onChangeColor]
  );

  useEffect(() => {
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (isDraggingHue.current) {
        updateHueFromEvent(e);
      } else if (isDraggingSV.current) {
        updateSVFromEvent(e);
      }
    };

    const handlePointerUp = () => {
      isDraggingHue.current = false;
      isDraggingSV.current = false;
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchmove', handlePointerMove);
    window.addEventListener('touchend', handlePointerUp);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [updateHueFromEvent, updateSVFromEvent]);

  const handleCopy = () => {
    onCopyText(currentColor.hex);
    setCopiedHex(true);
    setTimeout(() => setCopiedHex(false), 1500);
  };

  // Pure Hue color for background of SV box
  const pureHueHex = rgbToHex(hsvToRgb({ h: hsv.h, s: 100, v: 100 }));

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between h-full">
      <div>
        {/* Header & Tabs */}
        <div className="mb-4">
          <h2 className="text-sm font-bold text-slate-900 mb-3">Выбор цвета</h2>
          <div className="grid grid-cols-3 gap-1 bg-slate-100/90 p-1 rounded-xl text-xs font-medium">
            <button
              type="button"
              id="tab-wheel"
              onClick={() => setActiveTab('wheel')}
              className={`py-1.5 rounded-lg transition-all ${
                activeTab === 'wheel'
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Круг
            </button>
            <button
              type="button"
              id="tab-sliders"
              onClick={() => setActiveTab('sliders')}
              className={`py-1.5 rounded-lg transition-all ${
                activeTab === 'sliders'
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Слайдеры
            </button>
            <button
              type="button"
              id="tab-inputs"
              onClick={() => setActiveTab('inputs')}
              className={`py-1.5 rounded-lg transition-all ${
                activeTab === 'inputs'
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ввод значения
            </button>
          </div>
        </div>

        {/* Tab 1: Circular Color Wheel */}
        {activeTab === 'wheel' && (
          <div className="flex flex-col items-center py-2">
            {/* Color Wheel Outer Ring with SV box inside */}
            <div
              ref={hueRingRef}
              onMouseDown={(e) => {
                isDraggingHue.current = true;
                updateHueFromEvent(e.nativeEvent);
              }}
              onTouchStart={(e) => {
                isDraggingHue.current = true;
                updateHueFromEvent(e.nativeEvent);
              }}
              className="relative w-52 h-52 sm:w-56 sm:h-56 rounded-full flex items-center justify-center cursor-crosshair shadow-inner"
              style={{
                background:
                  'conic-gradient(from 0deg, #FF0000, #FFFF00, #00FF00, #00FFFF, #0000FF, #FF00FF, #FF0000)',
              }}
            >
              {/* Hue Indicator Needle / Pip */}
              {(() => {
                // Hue in radians (-90 offset)
                const rad = ((hsv.h - 90) * Math.PI) / 180;
                const ringRadius = 100; // px
                return (
                  <div
                    className="absolute w-4 h-4 rounded-full border-2 border-white shadow-md pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `calc(50% + ${Math.cos(rad) * ringRadius * 0.9}px)`,
                      top: `calc(50% + ${Math.sin(rad) * ringRadius * 0.9}px)`,
                      backgroundColor: pureHueHex,
                    }}
                  />
                );
              })()}

              {/* Inner Saturation-Brightness Box */}
              <div
                ref={svBoxRef}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  isDraggingSV.current = true;
                  updateSVFromEvent(e.nativeEvent);
                }}
                onTouchStart={(e) => {
                  e.stopPropagation();
                  isDraggingSV.current = true;
                  updateSVFromEvent(e.nativeEvent);
                }}
                className="w-32 h-32 sm:w-36 sm:h-36 rounded-xl relative cursor-crosshair overflow-hidden shadow-md"
                style={{ backgroundColor: pureHueHex }}
              >
                {/* Horizontal White to Transparent gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent" />
                {/* Vertical Transparent to Black gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />

                {/* SV Picker Pin */}
                <div
                  className="absolute w-4 h-4 rounded-full border-2 border-white shadow-md pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${hsv.s}%`,
                    top: `${100 - hsv.v}%`,
                    backgroundColor: currentColor.hex,
                  }}
                />
              </div>
            </div>

            {/* Quick Value & Swatch Preview */}
            <div className="flex items-center gap-2 mt-4 w-full max-w-[220px]">
              <div
                className="w-9 h-9 rounded-full shrink-0 border border-slate-200 shadow-2xs"
                style={{ backgroundColor: currentColor.hex }}
              />
              <div className="flex-1 flex items-center justify-between px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold text-slate-800">
                <span>{currentColor.hex}</span>
                <button
                  type="button"
                  title="Копировать HEX"
                  onClick={handleCopy}
                  className="text-slate-400 hover:text-blue-600 transition-colors"
                >
                  {copiedHex ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Sliders (RGB & HSL) */}
        {activeTab === 'sliders' && (
          <div className="space-y-4 py-2 text-xs">
            <div className="space-y-2">
              <div className="font-semibold text-slate-700">RGB каналы</div>
              {/* Red */}
              <div className="flex items-center gap-2">
                <span className="w-4 font-mono text-red-600 font-bold">R</span>
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={currentColor.rgb.r}
                  onChange={(e) => {
                    const r = parseInt(e.target.value, 10);
                    onChangeColor(rgbToHex({ ...currentColor.rgb, r }));
                  }}
                  className="flex-1 accent-red-600"
                />
                <span className="w-8 text-right font-mono">{currentColor.rgb.r}</span>
              </div>
              {/* Green */}
              <div className="flex items-center gap-2">
                <span className="w-4 font-mono text-emerald-600 font-bold">G</span>
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={currentColor.rgb.g}
                  onChange={(e) => {
                    const g = parseInt(e.target.value, 10);
                    onChangeColor(rgbToHex({ ...currentColor.rgb, g }));
                  }}
                  className="flex-1 accent-emerald-600"
                />
                <span className="w-8 text-right font-mono">{currentColor.rgb.g}</span>
              </div>
              {/* Blue */}
              <div className="flex items-center gap-2">
                <span className="w-4 font-mono text-blue-600 font-bold">B</span>
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={currentColor.rgb.b}
                  onChange={(e) => {
                    const b = parseInt(e.target.value, 10);
                    onChangeColor(rgbToHex({ ...currentColor.rgb, b }));
                  }}
                  className="flex-1 accent-blue-600"
                />
                <span className="w-8 text-right font-mono">{currentColor.rgb.b}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="font-semibold text-slate-700">HSL параметры</div>
              {/* Hue */}
              <div className="flex items-center gap-2">
                <span className="w-4 font-mono font-bold text-slate-700">H</span>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={currentColor.hsl.h}
                  onChange={(e) => {
                    const h = parseInt(e.target.value, 10);
                    const newRgb = hslToRgb({ ...currentColor.hsl, h });
                    onChangeColor(rgbToHex(newRgb));
                  }}
                  className="flex-1 accent-blue-600"
                />
                <span className="w-8 text-right font-mono">{currentColor.hsl.h}°</span>
              </div>
              {/* Saturation */}
              <div className="flex items-center gap-2">
                <span className="w-4 font-mono font-bold text-slate-700">S</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={currentColor.hsl.s}
                  onChange={(e) => {
                    const s = parseInt(e.target.value, 10);
                    const newRgb = hslToRgb({ ...currentColor.hsl, s });
                    onChangeColor(rgbToHex(newRgb));
                  }}
                  className="flex-1 accent-blue-600"
                />
                <span className="w-8 text-right font-mono">{currentColor.hsl.s}%</span>
              </div>
              {/* Lightness */}
              <div className="flex items-center gap-2">
                <span className="w-4 font-mono font-bold text-slate-700">L</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={currentColor.hsl.l}
                  onChange={(e) => {
                    const l = parseInt(e.target.value, 10);
                    const newRgb = hslToRgb({ ...currentColor.hsl, l });
                    onChangeColor(rgbToHex(newRgb));
                  }}
                  className="flex-1 accent-blue-600"
                />
                <span className="w-8 text-right font-mono">{currentColor.hsl.l}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Direct Values Input */}
        {activeTab === 'inputs' && (
          <div className="space-y-3 py-2 text-xs">
            <div>
              <label className="block text-slate-500 font-medium mb-1">HEX код</label>
              <input
                type="text"
                value={currentColor.hex}
                onChange={(e) => {
                  let val = e.target.value.trim();
                  if (!val.startsWith('#')) val = '#' + val;
                  if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                    if (val.length === 7) {
                      onChangeColor(val);
                    }
                  }
                }}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 font-mono text-sm uppercase focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-medium mb-1">RGB (Красный, Зеленый, Синий)</label>
              <input
                type="text"
                readOnly
                value={`${currentColor.rgb.r}, ${currentColor.rgb.g}, ${currentColor.rgb.b}`}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-xs text-slate-700"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-medium mb-1">HSL (Тон, Насыщенность, Яркость)</label>
              <input
                type="text"
                readOnly
                value={`${currentColor.hsl.h}°, ${currentColor.hsl.s}%, ${currentColor.hsl.l}%`}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-xs text-slate-700"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-medium mb-1">CMYK (Печать)</label>
              <input
                type="text"
                readOnly
                value={`${currentColor.cmyk.c}, ${currentColor.cmyk.m}, ${currentColor.cmyk.y}, ${currentColor.cmyk.k}`}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-xs text-slate-700"
              />
            </div>
          </div>
        )}
      </div>

      {/* Recent Colors */}
      <div className="pt-4 border-t border-slate-100 mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-600">Недавние цвета</span>
          {recentColors.length > 0 && (
            <button
              type="button"
              onClick={onClearRecentColors}
              title="Очистить историю"
              className="text-slate-400 hover:text-red-500 transition-colors p-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {recentColors.slice(0, 8).map((hex, idx) => (
            <button
              key={`${hex}-${idx}`}
              type="button"
              onClick={() => onChangeColor(hex)}
              className="w-7 h-7 rounded-lg border border-slate-200/80 shadow-2xs hover:scale-110 transition-transform cursor-pointer"
              style={{ backgroundColor: hex }}
              title={hex}
            />
          ))}
          {recentColors.length === 0 && (
            <span className="text-[11px] text-slate-400 italic">История пуста</span>
          )}
        </div>
      </div>
    </div>
  );
};
