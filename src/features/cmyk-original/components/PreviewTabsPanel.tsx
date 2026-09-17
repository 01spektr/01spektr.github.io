import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Info,
  Download,
  FileText,
  FileCode,
  Sparkles,
  Copy,
  Check,
  Printer,
  Layers,
  Palette,
  ExternalLink,
} from "lucide-react";
import { RGB, CMYK, ActiveTab, PantoneMatch, PaperType } from "../types";
import {
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  rgbToCmyk,
  getTotalInkCoverage,
} from "../utils/colorConversion";
import { getQualityLabel } from "../utils/pantoneMatcher";
import { exportToPdf, downloadSvg, exportToEps, generateVectorSvg } from "../utils/vectorExport";
import { useI18n } from "@/lib/i18n";

interface PreviewTabsPanelProps {
  rgb: RGB;
  cmyk: CMYK;
  simulatedRgb: RGB;
  pantoneMatches: PantoneMatch[];
  paperType: PaperType;
  onChangePaperType: (paper: PaperType) => void;
  onSelectColor: (rgb: RGB) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const PreviewTabsPanel: React.FC<PreviewTabsPanelProps> = ({
  rgb,
  cmyk,
  simulatedRgb,
  pantoneMatches,
  paperType,
  onChangePaperType,
  onSelectColor,
  activeTab,
  setActiveTab,
}) => {
  const { locale } = useI18n();
  const en = locale === "en";
  // Split slider state (0 to 100%)
  const [splitPos, setSplitPos] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Export states
  const [copiedSvg, setCopiedSvg] = useState(false);
  const [copiedPantoneCode, setCopiedPantoneCode] = useState<string | null>(null);

  const hexString = rgbToHex(rgb);
  const bestPantone = pantoneMatches[0];

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateSplitFromPointer(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    updateSplitFromPointer(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignored
    }
  };

  const updateSplitFromPointer = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pos = ((clientX - rect.left) / rect.width) * 100;
    setSplitPos(Math.max(5, Math.min(95, pos)));
  }, []);

  const handleCopySvgCode = async () => {
    const svgCode = generateVectorSvg({
      rgb,
      cmyk,
      cmykSimulatedRgb: simulatedRgb,
      pantoneMatch: bestPantone,
    });
    try {
      await navigator.clipboard.writeText(svgCode);
      setCopiedSvg(true);
      setTimeout(() => setCopiedSvg(false), 1800);
    } catch {
      setCopiedSvg(true);
      setTimeout(() => setCopiedSvg(false), 1800);
    }
  };

  const handleCopyPantone = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedPantoneCode(code);
      setTimeout(() => setCopiedPantoneCode(null), 1800);
    } catch {
      setCopiedPantoneCode(code);
      setTimeout(() => setCopiedPantoneCode(null), 1800);
    }
  };

  // Generate color harmonies for the "Палитра" tab
  const hsl = rgbToHsl(rgb);
  const paletteHarmonies = [
    { name: en ? "Primary" : "Основной", rgb },
    {
      name: en ? "Light shade" : "Светлый оттенок",
      rgb: hslToRgb({ h: hsl.h, s: Math.max(10, hsl.s - 20), l: Math.min(90, hsl.l + 25) }),
    },
    {
      name: en ? "Dark shade" : "Тёмный оттенок",
      rgb: hslToRgb({ h: hsl.h, s: Math.min(100, hsl.s + 10), l: Math.max(15, hsl.l - 25) }),
    },
    {
      name: en ? "Analogous +30°" : "Аналоговый +30°",
      rgb: hslToRgb({ h: (hsl.h + 30) % 360, s: hsl.s, l: hsl.l }),
    },
    {
      name: en ? "Analogous -30°" : "Аналоговый -30°",
      rgb: hslToRgb({ h: (hsl.h + 330) % 360, s: hsl.s, l: hsl.l }),
    },
    {
      name: en ? "Complementary" : "Комплементарный",
      rgb: hslToRgb({ h: (hsl.h + 180) % 360, s: hsl.s, l: hsl.l }),
    },
  ];

  return (
    <div
      id="preview-tabs-card"
      className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6 flex flex-col justify-between"
    >
      <div>
        {/* Top Tab Navigation Header */}
        <div className="cmyk-tabs-nav flex items-center gap-1 sm:gap-2 border-b border-slate-100 pb-3 mb-5 overflow-x-auto no-scrollbar">
          <button
            id="tab-btn-preview"
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeTab === "preview"
                ? "text-blue-600 bg-blue-50/80"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            {en ? "Preview" : "Предпросмотр"}
          </button>
          <button
            id="tab-btn-comparison"
            type="button"
            onClick={() => setActiveTab("comparison")}
            className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeTab === "comparison"
                ? "text-blue-600 bg-blue-50/80"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            {en ? "Compare" : "Сравнение"}
          </button>
          <button
            id="tab-btn-palette"
            type="button"
            onClick={() => setActiveTab("palette")}
            className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeTab === "palette"
                ? "text-blue-600 bg-blue-50/80"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            {en ? "Palette" : "Палитра"}
          </button>
          <button
            id="tab-btn-pantone"
            type="button"
            onClick={() => setActiveTab("pantone")}
            className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center gap-1 whitespace-nowrap ${
              activeTab === "pantone"
                ? "text-blue-600 bg-blue-50/80"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <span>{en ? "Pantone" : "Пантоны"}</span>
            <span className="h-1.5 w-1.5 self-center rounded-full bg-rose-500 animate-pulse" />
          </button>
        </div>

        {/* 1. Tab: Предпросмотр (Interactive split screen slider) */}
        {activeTab === "preview" && (
          <div className="space-y-4">
            {/* Split Screen Slider Box */}
            <div
              ref={containerRef}
              id="split-screen-preview"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className="w-full h-56 sm:h-64 rounded-xl relative overflow-hidden cursor-ew-resize select-none shadow-inner border border-black/5"
            >
              {/* Right Background (CMYK simulated print) */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundColor: `rgb(${simulatedRgb.r}, ${simulatedRgb.g}, ${simulatedRgb.b})`,
                }}
              >
                {paperType === "uncoated" && (
                  <div className="absolute inset-0 bg-stone-900/5 mix-blend-multiply" />
                )}
              </div>

              {/* Left Layer (RGB screen) with clip-path */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundColor: hexString,
                  clipPath: `polygon(0 0, ${splitPos}% 0, ${splitPos}% 100%, 0 100%)`,
                }}
              />

              {/* Divider Line & Circular Drag Handle */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg pointer-events-none"
                style={{ left: `${splitPos}%`, transform: "translateX(-50%)" }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center text-slate-700 pointer-events-auto cursor-ew-resize transition-transform hover:scale-110 active:scale-95">
                  <svg
                    className="w-4 h-4 text-slate-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="8 7 3 12 8 17" />
                    <polyline points="16 7 21 12 16 17" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Labels below split screen */}
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 px-1">
              <span>{en ? "On screen (RGB)" : "На экране (RGB)"}</span>
              <span>{en ? "In print (CMYK)" : "При печати (CMYK)"}</span>
            </div>

            {/* Info alert card */}
            <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3.5 flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <Info className="w-3.5 h-3.5" />
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {en
                  ? "Colours on screen and in print can differ because of colour models, paper and equipment."
                  : "Цвет на экране и в печати может отличаться из-за особенностей цветовых моделей, бумаги и оборудования."}
              </p>
            </div>
          </div>
        )}

        {/* 2. Tab: Сравнение (Gamut & Paper comparison) */}
        {activeTab === "comparison" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {/* RGB Card */}
              <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50">
                <div
                  className="w-full h-16 rounded-lg mb-2.5 border border-black/5"
                  style={{ backgroundColor: hexString }}
                />
                <div className="text-xs font-bold text-slate-900">
                  {en ? "sRGB monitor" : "Монитор sRGB"}
                </div>
                <div className="text-[11px] text-slate-500">
                  {en ? "Additive light model" : "Аддитивный синтез (свет)"}
                </div>
                <div className="text-[11px] font-mono text-slate-700 mt-1">{hexString}</div>
              </div>

              {/* CMYK Card */}
              <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50">
                <div
                  className="w-full h-16 rounded-lg mb-2.5 border border-black/5"
                  style={{
                    backgroundColor: `rgb(${simulatedRgb.r}, ${simulatedRgb.g}, ${simulatedRgb.b})`,
                  }}
                />
                <div className="text-xs font-bold text-slate-900">
                  {en ? "CMYK print" : "Печать CMYK"}
                </div>
                <div className="text-[11px] text-slate-500">
                  {paperType === "coated"
                    ? en
                      ? "Coated paper"
                      : "Мелованная бумага"
                    : en
                      ? "Uncoated paper"
                      : "Офсетная бумага"}
                </div>
                <div className="text-[11px] font-mono text-slate-700 mt-1">
                  TIC: {getTotalInkCoverage(cmyk)}%
                </div>
              </div>
            </div>

            {/* Paper Selection */}
            <div className="border border-slate-200/80 rounded-xl p-3.5 bg-white">
              <div className="text-xs font-bold text-slate-900 mb-2">
                {en ? "Paper simulation" : "Симуляция типа бумаги"}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onChangePaperType("coated")}
                  className={`p-2.5 rounded-lg text-left border transition-all ${
                    paperType === "coated"
                      ? "border-blue-500 bg-blue-50/50 ring-1 ring-blue-500"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="text-xs font-semibold text-slate-900">
                    {en ? "Coated" : "Мелованная (Coated)"}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {en
                      ? "Glossy magazines, brochures and catalogues (FOGRA39)"
                      : "Глянцевые журналы, буклеты, каталоги (FOGRA39)"}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => onChangePaperType("uncoated")}
                  className={`p-2.5 rounded-lg text-left border transition-all ${
                    paperType === "uncoated"
                      ? "border-blue-500 bg-blue-50/50 ring-1 ring-blue-500"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="text-xs font-semibold text-slate-900">
                    {en ? "Uncoated" : "Офсетная (Uncoated)"}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {en
                      ? "Books, forms and kraft paper (more ink absorption)"
                      : "Книги, бланки, крафт (краска впитывается сильнее)"}
                  </div>
                </button>
              </div>
            </div>

            {/* Prepress Checklist */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
              <div className="text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
                <span>{en ? "Prepress parameters" : "Препресс-параметры"}</span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    getTotalInkCoverage(cmyk) <= 300
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {getTotalInkCoverage(cmyk) <= 300
                    ? en
                      ? "TIC within range"
                      : "TIC в норме"
                    : en
                      ? "High ink coverage"
                      : "Высокая плотность"}
                </span>
              </div>
              <div className="text-[11px] text-slate-600 space-y-1">
                <p>
                  • Сумма красок (TIC):{" "}
                  <span className="font-semibold">{getTotalInkCoverage(cmyk)}%</span> (макс. 300%
                  для меловки, 260% для офсета)
                </p>
                <p>• Растрирование: Стохастическое или регулярное (150-175 lpi)</p>
              </div>
            </div>
          </div>
        )}

        {/* 3. Tab: Палитра (Harmonies & CMYK formulas) */}
        {activeTab === "palette" && (
          <div className="space-y-3">
            <div className="text-xs font-semibold text-slate-700 mb-1">
              {en ? "Print palette and colour harmonies" : "Печатная палитра и гармонии цвета"}
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {paletteHarmonies.map((item, idx) => {
                const itemHex = rgbToHex(item.rgb);
                const itemCmyk = rgbToCmyk(item.rgb);
                return (
                  <div
                    key={idx}
                    onClick={() => onSelectColor(item.rgb)}
                    className="p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-blue-400 hover:shadow-xs transition-all cursor-pointer group"
                  >
                    <div
                      className="w-full h-10 rounded-lg mb-1.5 border border-black/5"
                      style={{ backgroundColor: itemHex }}
                    />
                    <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {item.name}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      C:{itemCmyk.c} M:{itemCmyk.m} Y:{itemCmyk.y} K:{itemCmyk.k}
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-500 text-center">
              {en
                ? "Select a shade to load it into the converter."
                : "Нажмите на любой оттенок, чтобы загрузить его в конвертер."}
            </p>
          </div>
        )}

        {/* 4. Tab: Пантоны (Pantone Matching System) */}
        {activeTab === "pantone" && (
          <div className="space-y-4">
            {/* Top Best Pantone Hero Chip */}
            {bestPantone ? (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    {/* Authentic Pantone Swatch with white bottom tab */}
                    <div className="w-16 h-22 rounded-lg bg-white border border-slate-300 overflow-hidden shadow-xs shrink-0 flex flex-col">
                      <div
                        className="flex-1"
                        style={{ backgroundColor: bestPantone.pantone.hex }}
                      />
                      <div className="p-1 bg-white text-center">
                        <div className="text-[7px] font-black tracking-wider text-slate-900">
                          PANTONE®
                        </div>
                        <div className="text-[6px] font-bold text-slate-700 truncate">
                          {bestPantone.pantone.code.replace("PANTONE ", "")}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-slate-500 font-medium">
                        {en ? "Recommended guide" : "Рекомендованный веер"}
                      </div>
                      <div className="text-base font-extrabold text-slate-900">
                        {bestPantone.pantone.code}
                      </div>
                      <div className="text-xs text-slate-600">{bestPantone.pantone.name}</div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${getQualityLabel(bestPantone.quality).colorClass}`}
                        >
                          {getQualityLabel(bestPantone.quality).text}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          ΔE = {bestPantone.deltaE}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopyPantone(bestPantone.pantone.code)}
                    className="p-2 text-slate-500 hover:text-blue-600 hover:bg-white rounded-lg border border-slate-200 transition-colors shrink-0"
                    title={en ? "Copy Pantone code" : "Скопировать код Pantone"}
                  >
                    {copiedPantoneCode === bestPantone.pantone.code ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Spot formula details */}
                <div className="bg-white rounded-lg p-2.5 border border-slate-200/80 text-[11px] grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-400">Формула CMYK:</span>{" "}
                    <span className="font-semibold text-slate-800">
                      {bestPantone.pantone.cmyk.c}/{bestPantone.pantone.cmyk.m}/
                      {bestPantone.pantone.cmyk.y}/{bestPantone.pantone.cmyk.k}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">HEX:</span>{" "}
                    <span className="font-semibold text-slate-800 font-mono">
                      {bestPantone.pantone.hex}
                    </span>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Alternative closest pantones */}
            <div>
              <div className="text-xs font-semibold text-slate-700 mb-2">
                {en ? "Closest alternative Pantones:" : "Ближайшие альтернативные пантоны:"}
              </div>
              <div className="space-y-2">
                {pantoneMatches.slice(1, 5).map((match, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-xl border border-slate-200/80 hover:border-blue-400 hover:bg-slate-50/80 transition-all cursor-pointer"
                    onClick={() => onSelectColor(match.pantone.rgb)}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-lg border border-black/10 shrink-0"
                        style={{ backgroundColor: match.pantone.hex }}
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900">{match.pantone.code}</div>
                        <div className="text-[10px] text-slate-500">
                          {match.pantone.name} • ΔE {match.deltaE}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-blue-600">{match.matchScore}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. Tab: Векторный экспорт (Print Vector Export) */}
        {activeTab === "export" && (
          <div className="space-y-4">
            <div className="text-xs font-semibold text-slate-700">
              {en
                ? "Vector formats for print production and plotters"
                : "Векторные форматы для типографии и плоттерной печати"}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* PDF Export Button */}
              <button
                id="btn-export-pdf"
                type="button"
                onClick={() =>
                  exportToPdf({
                    rgb,
                    cmyk,
                    cmykSimulatedRgb: simulatedRgb,
                    pantoneMatch: bestPantone,
                    paperName: paperType === "coated" ? "Мелованная бумага" : "Офсетная бумага",
                  })
                }
                className="p-3 bg-slate-50 hover:bg-blue-50/50 hover:border-blue-400 border border-slate-200 rounded-xl flex items-start gap-3 text-left transition-all group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600">
                    PDF Спецификация
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Готовый лист формата A4 с метками реза, CMYK-разбивкой и Pantone
                  </div>
                </div>
              </button>

              {/* SVG Export Button */}
              <button
                id="btn-export-svg"
                type="button"
                onClick={() =>
                  downloadSvg({
                    rgb,
                    cmyk,
                    cmykSimulatedRgb: simulatedRgb,
                    pantoneMatch: bestPantone,
                  })
                }
                className="p-3 bg-slate-50 hover:bg-blue-50/50 hover:border-blue-400 border border-slate-200 rounded-xl flex items-start gap-3 text-left transition-all group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <FileCode className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600">
                    Векторный SVG
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Масштабируемый векторный образец цвета для Illustrator и Figma
                  </div>
                </div>
              </button>

              {/* EPS Export Button */}
              <button
                id="btn-export-eps"
                type="button"
                onClick={() =>
                  exportToEps({
                    rgb,
                    cmyk,
                    cmykSimulatedRgb: simulatedRgb,
                    pantoneMatch: bestPantone,
                  })
                }
                className="p-3 bg-slate-50 hover:bg-blue-50/50 hover:border-blue-400 border border-slate-200 rounded-xl flex items-start gap-3 text-left transition-all group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600">
                    Векторный EPS
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Encapsulated PostScript с операторами CMYK для допечатной подготовки
                  </div>
                </div>
              </button>

              {/* Copy SVG Code Button */}
              <button
                id="btn-copy-svg-code"
                type="button"
                onClick={handleCopySvgCode}
                className="p-3 bg-slate-50 hover:bg-blue-50/50 hover:border-blue-400 border border-slate-200 rounded-xl flex items-start gap-3 text-left transition-all group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  {copiedSvg ? (
                    <Check className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600">
                    {copiedSvg
                      ? en
                        ? "Copied!"
                        : "Скопировано!"
                      : en
                        ? "Copy SVG"
                        : "Копировать SVG"}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Вставить векторную плашку прямо в буфер обмена
                  </div>
                </div>
              </button>
            </div>

            {/* Print browser direct trigger */}
            <div className="pt-2">
              <button
                id="btn-browser-print"
                type="button"
                onClick={() => window.print()}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>
                  {en ? "Print colour card (Ctrl + P)" : "Распечатать карточку цвета (Ctrl + P)"}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
