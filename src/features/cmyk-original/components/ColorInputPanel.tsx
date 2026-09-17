import React, { useState } from "react";
import { Copy, Check, Pipette } from "lucide-react";
import { RGB, InputMode } from "../types";
import { rgbToHex, hexToRgb, rgbToHsl, hslToRgb } from "../utils/colorConversion";
import { useI18n } from "@/lib/i18n";

interface ColorInputPanelProps {
  rgb: RGB;
  onChangeRgb: (newRgb: RGB) => void;
}

const PRESET_COLORS = [
  { hex: "#2563EB", name: "Синий" },
  { hex: "#EF4444", name: "Красный" },
  { hex: "#10B981", name: "Зелёный" },
  { hex: "#F59E0B", name: "Жёлтый" },
  { hex: "#EA580C", name: "Оранжевый" },
  { hex: "#8B5CF6", name: "Фиолетовый" },
  { hex: "#EC4899", name: "Розовый" },
  { hex: "#000000", name: "Чёрный" },
  { hex: "#FFFFFF", name: "Белый" },
];

export const ColorInputPanel: React.FC<ColorInputPanelProps> = ({ rgb, onChangeRgb }) => {
  const { locale } = useI18n();
  const en = locale === "en";
  const [mode, setMode] = useState<InputMode>("RGB");
  const [copiedHex, setCopiedHex] = useState(false);
  const hexValue = rgbToHex(rgb);
  const hslValue = rgbToHsl(rgb);

  const handleCopyHex = async () => {
    try {
      await navigator.clipboard.writeText(hexValue);
      setCopiedHex(true);
      setTimeout(() => setCopiedHex(false), 1800);
    } catch {
      // Fallback
      setCopiedHex(true);
      setTimeout(() => setCopiedHex(false), 1800);
    }
  };

  const handleSliderChange = (channel: keyof RGB, val: number) => {
    onChangeRgb({
      ...rgb,
      [channel]: Math.max(0, Math.min(255, val)),
    });
  };

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (!val.startsWith("#")) {
      val = "#" + val;
    }
    const parsed = hexToRgb(val);
    if (parsed) {
      onChangeRgb(parsed);
    }
  };

  const handleHslChange = (h: number, s: number, l: number) => {
    const newRgb = hslToRgb({ h, s, l });
    onChangeRgb(newRgb);
  };

  const handleClear = () => {
    // Reset to screenshot default: #2563EB (R:37, G:99, B:235)
    onChangeRgb({ r: 37, g: 99, b: 235 });
  };

  return (
    <div
      id="color-input-card"
      className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6 flex flex-col justify-between"
    >
      <div>
        {/* Title */}
        <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-4">
          {en ? `Enter colour in ${mode}` : `Введите цвет в ${mode}`}
        </h2>

        {/* Mode Tabs: RGB / HEX / HSL */}
        <div className="grid grid-cols-3 bg-slate-100/90 p-1 rounded-xl mb-6">
          {(["RGB", "HEX", "HSL"] as InputMode[]).map((tab) => (
            <button
              key={tab}
              id={`tab-${tab.toLowerCase()}`}
              type="button"
              onClick={() => setMode(tab)}
              className={`py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                mode === tab
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Mode-specific Controls */}
        {mode === "RGB" && (
          <div className="space-y-4">
            {/* R (Красный) */}
            <div>
              <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-slate-700 mb-1.5">
                <span>{en ? "R (Red)" : "R (Красный)"}</span>
                <input
                  id="input-r"
                  type="number"
                  min="0"
                  max="255"
                  value={rgb.r}
                  onChange={(e) => handleSliderChange("r", parseInt(e.target.value) || 0)}
                  className="w-14 h-8 px-2 text-center text-xs sm:text-sm font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>
              <div className="relative flex items-center">
                <input
                  id="slider-r"
                  type="range"
                  min="0"
                  max="255"
                  value={rgb.r}
                  onChange={(e) => handleSliderChange("r", parseInt(e.target.value))}
                  className="w-full h-2.5 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, rgb(0, ${rgb.g}, ${rgb.b}), rgb(255, ${rgb.g}, ${rgb.b}))`,
                  }}
                />
              </div>
            </div>

            {/* G (Зелёный) */}
            <div>
              <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-slate-700 mb-1.5">
                <span>{en ? "G (Green)" : "G (Зелёный)"}</span>
                <input
                  id="input-g"
                  type="number"
                  min="0"
                  max="255"
                  value={rgb.g}
                  onChange={(e) => handleSliderChange("g", parseInt(e.target.value) || 0)}
                  className="w-14 h-8 px-2 text-center text-xs sm:text-sm font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>
              <div className="relative flex items-center">
                <input
                  id="slider-g"
                  type="range"
                  min="0"
                  max="255"
                  value={rgb.g}
                  onChange={(e) => handleSliderChange("g", parseInt(e.target.value))}
                  className="w-full h-2.5 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, rgb(${rgb.r}, 0, ${rgb.b}), rgb(${rgb.r}, 255, ${rgb.b}))`,
                  }}
                />
              </div>
            </div>

            {/* B (Синий) */}
            <div>
              <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-slate-700 mb-1.5">
                <span>{en ? "B (Blue)" : "B (Синий)"}</span>
                <input
                  id="input-b"
                  type="number"
                  min="0"
                  max="255"
                  value={rgb.b}
                  onChange={(e) => handleSliderChange("b", parseInt(e.target.value) || 0)}
                  className="w-14 h-8 px-2 text-center text-xs sm:text-sm font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>
              <div className="relative flex items-center">
                <input
                  id="slider-b"
                  type="range"
                  min="0"
                  max="255"
                  value={rgb.b}
                  onChange={(e) => handleSliderChange("b", parseInt(e.target.value))}
                  className="w-full h-2.5 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, rgb(${rgb.r}, ${rgb.g}, 0), rgb(${rgb.r}, ${rgb.g}, 255))`,
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {mode === "HEX" && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {en ? "Hexadecimal code (HEX)" : "Шестнадцатеричный код (HEX)"}
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="input-hex-direct"
                  type="text"
                  maxLength={7}
                  defaultValue={hexValue}
                  key={hexValue}
                  onChange={handleHexInputChange}
                  placeholder="#2563EB"
                  className="flex-1 h-10 px-3 text-sm font-mono font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
                <label
                  title={en ? "Pick a colour" : "Выбрать пипеткой"}
                  className="w-10 h-10 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors relative"
                >
                  <Pipette className="w-4 h-4 text-slate-600" />
                  <input
                    type="color"
                    value={hexValue}
                    onChange={(e) => {
                      const res = hexToRgb(e.target.value);
                      if (res) onChangeRgb(res);
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                </label>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              {en
                ? "Three- and six-digit colour codes are supported (for example, #00F or #2563EB)."
                : "Поддерживаются 3-значные и 6-значные коды цветов (например #00F или #2563EB)."}
            </p>
          </div>
        )}

        {mode === "HSL" && (
          <div className="space-y-4">
            {/* H */}
            <div>
              <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-1">
                <span>{en ? `H (Hue: ${hslValue.h}°)` : `H (Оттенок: ${hslValue.h}°)`}</span>
                <span className="text-slate-500">{hslValue.h}°</span>
              </div>
              <input
                id="slider-h"
                type="range"
                min="0"
                max="360"
                value={hslValue.h}
                onChange={(e) => handleHslChange(parseInt(e.target.value), hslValue.s, hslValue.l)}
                className="w-full h-2.5 rounded-lg appearance-none cursor-pointer"
                style={{
                  background:
                    "linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)",
                }}
              />
            </div>
            {/* S */}
            <div>
              <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-1">
                <span>
                  {en ? `S (Saturation: ${hslValue.s}%)` : `S (Насыщенность: ${hslValue.s}%)`}
                </span>
                <span className="text-slate-500">{hslValue.s}%</span>
              </div>
              <input
                id="slider-s"
                type="range"
                min="0"
                max="100"
                value={hslValue.s}
                onChange={(e) => handleHslChange(hslValue.h, parseInt(e.target.value), hslValue.l)}
                className="w-full h-2.5 rounded-lg appearance-none cursor-pointer bg-slate-200"
              />
            </div>
            {/* L */}
            <div>
              <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-1">
                <span>{en ? `L (Lightness: ${hslValue.l}%)` : `L (Светлота: ${hslValue.l}%)`}</span>
                <span className="text-slate-500">{hslValue.l}%</span>
              </div>
              <input
                id="slider-l"
                type="range"
                min="0"
                max="100"
                value={hslValue.l}
                onChange={(e) => handleHslChange(hslValue.h, hslValue.s, parseInt(e.target.value))}
                className="w-full h-2.5 rounded-lg appearance-none cursor-pointer bg-slate-200"
              />
            </div>
          </div>
        )}

        {/* HEX Code input row */}
        <div className="mt-5">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            {en ? "HEX code" : "HEX-код"}
          </label>
          <div className="relative flex items-center">
            <input
              id="input-hex-display"
              type="text"
              readOnly
              value={hexValue}
              className="w-full h-10 px-3 pr-10 text-sm font-mono font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
            />
            <button
              id="btn-copy-hex"
              type="button"
              onClick={handleCopyHex}
              title={en ? "Copy HEX" : "Скопировать HEX"}
              className="absolute right-1.5 p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-200/60 transition-colors"
            >
              {copiedHex ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Быстрые цвета (Preset Swatches) */}
      <div className="mt-6 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-700">
            {en ? "Quick colours" : "Быстрые цвета"}
          </span>
          <button
            id="btn-clear-colors"
            type="button"
            onClick={handleClear}
            className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
          >
            {en ? "Reset" : "Очистить"}
          </button>
        </div>

        <div className="flex items-center justify-between gap-1.5 sm:gap-2">
          {PRESET_COLORS.map((preset) => {
            const isSelected = hexValue.toUpperCase() === preset.hex.toUpperCase();
            const isWhite = preset.hex.toUpperCase() === "#FFFFFF";
            return (
              <button
                key={preset.hex}
                id={`preset-${preset.hex.replace("#", "")}`}
                type="button"
                onClick={() => {
                  const parsed = hexToRgb(preset.hex);
                  if (parsed) onChangeRgb(parsed);
                }}
                title={
                  en
                    ? ({
                        Синий: "Blue",
                        Красный: "Red",
                        Зелёный: "Green",
                        Жёлтый: "Yellow",
                        Оранжевый: "Orange",
                        Фиолетовый: "Purple",
                        Розовый: "Pink",
                        Чёрный: "Black",
                        Белый: "White",
                      }[preset.name] ?? preset.name)
                    : preset.name
                }
                style={{ backgroundColor: preset.hex }}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-transform hover:scale-110 cursor-pointer ${
                  isWhite ? "border border-slate-300" : "border border-black/10"
                } ${isSelected ? "ring-2 ring-blue-500 ring-offset-2" : ""}`}
              >
                {isSelected && (
                  <Check className={`w-4 h-4 ${isWhite ? "text-slate-900" : "text-white"}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
