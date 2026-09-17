import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Copy,
  Check,
  ChevronDown,
  Sparkles,
  Download,
} from "lucide-react";
import { RGB, CMYK, OutputFormat, PantoneMatch, PaperType } from "../types";
import {
  rgbToHex,
  formatCmyk,
  getTotalInkCoverage,
  checkGamutWarning,
} from "../utils/colorConversion";
import { useI18n } from "@/lib/i18n";

interface ColorResultPanelProps {
  rgb: RGB;
  cmyk: CMYK;
  simulatedRgb: RGB;
  pantoneMatch?: PantoneMatch;
  paperType: PaperType;
  onChangePaperType: (paper: PaperType) => void;
  onOpenPantoneTab: () => void;
  onOpenExport?: () => void;
}

export const ColorResultPanel: React.FC<ColorResultPanelProps> = ({
  rgb,
  cmyk,
  simulatedRgb,
  pantoneMatch,
  paperType,
  onChangePaperType,
  onOpenPantoneTab,
  onOpenExport,
}) => {
  const { locale } = useI18n();
  const en = locale === "en";
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("percent_separated");
  const [copiedFormat, setCopiedFormat] = useState(false);
  const [copiedCmykMain, setCopiedCmykMain] = useState(false);
  const [copiedInline, setCopiedInline] = useState(false);

  const hexString = rgbToHex(rgb);
  const formattedCmykText = formatCmyk(cmyk, outputFormat);
  const inlineCmykText = `C: ${cmyk.c}  M: ${cmyk.m}  Y: ${cmyk.y}  K: ${cmyk.k}`;
  const gamutStatus = useMemo(
    () => checkGamutWarning(rgb, simulatedRgb),
    [rgb, simulatedRgb],
  );

  const copyToClipboard = async (text: string, setStatus: (val: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus(true);
      setTimeout(() => setStatus(false), 1800);
    } catch {
      setStatus(true);
      setTimeout(() => setStatus(false), 1800);
    }
  };

  const tic = getTotalInkCoverage(cmyk);

  return (
    <div
      id="color-result-card"
      className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6 flex flex-col justify-between"
    >
      <div>
        {/* Title */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            {en ? "Conversion result" : "Результат преобразования"}
          </h2>
          {/* Paper Type pill switch */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-[11px] font-semibold text-slate-600">
            <button
              id="btn-paper-coated"
              type="button"
              onClick={() => onChangePaperType("coated")}
              className={`px-2 py-0.5 rounded-md transition-all ${
                paperType === "coated"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "hover:text-slate-900"
              }`}
            >
              {en ? "Coated" : "Мелованная"}
            </button>
            <button
              id="btn-paper-uncoated"
              type="button"
              onClick={() => onChangePaperType("uncoated")}
              className={`px-2 py-0.5 rounded-md transition-all ${
                paperType === "uncoated"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "hover:text-slate-900"
              }`}
            >
              {en ? "Uncoated" : "Офсетная"}
            </button>
          </div>
        </div>

        {/* Swatches Comparison Box */}
        <div className="mb-6">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 mb-2.5">
            {/* Left Box: Screen RGB */}
            <div
              id="swatch-screen-rgb"
              style={{ backgroundColor: hexString }}
              className="h-24 sm:h-28 rounded-xl shadow-inner border border-black/5 transition-colors duration-200"
            />

            {/* Middle arrow */}
            <div className="flex items-center justify-center text-blue-600 font-bold px-1">
              <ArrowRight className="w-5 h-5" />
            </div>

            {/* Right Box: CMYK simulated print */}
            <div
              id="swatch-print-cmyk"
              style={{
                backgroundColor: `rgb(${simulatedRgb.r}, ${simulatedRgb.g}, ${simulatedRgb.b})`,
              }}
              className="h-24 sm:h-28 rounded-xl shadow-inner border border-black/5 transition-colors duration-200 relative overflow-hidden"
            >
              {paperType === "uncoated" && (
                <div className="absolute inset-0 bg-amber-900/5 mix-blend-multiply pointer-events-none" />
              )}
            </div>
          </div>

          {/* Labels underneath the swatches */}
          <div className="grid grid-cols-[1fr_auto_1fr] gap-3">
            {/* Left labels */}
            <div>
              <div className="text-[11px] font-medium text-slate-500">
                {en ? "RGB (screen)" : "RGB (экран)"}
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-900">{hexString}</div>
              <div className="text-[11px] text-slate-500 font-mono">
                rgb({rgb.r}, {rgb.g}, {rgb.b})
              </div>
            </div>

            {/* Spacer */}
            <div className="w-5" />

            {/* Right labels */}
            <div>
              <div className="text-[11px] font-medium text-slate-500">
                {en ? "CMYK (print)" : "CMYK (печать)"}
              </div>
              <div className="flex items-center gap-1 text-xs sm:text-sm font-bold text-slate-900">
                <span>{inlineCmykText}</span>
                <button
                  id="btn-copy-inline-cmyk"
                  type="button"
                  onClick={() => copyToClipboard(inlineCmykText, setCopiedInline)}
                  title={en ? "Copy" : "Скопировать"}
                  className="p-1 text-slate-400 hover:text-blue-600 rounded-md hover:bg-slate-100 transition-colors"
                >
                  {copiedInline ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              <div className="text-[11px] text-slate-500">
                {en ? "Total ink coverage (TIC): " : "Плотность краски (TIC): "}
                <span className="font-semibold">{tic}%</span>
              </div>
            </div>
          </div>
        </div>

        {gamutStatus.isOutOfGamut && (
          <div
            id="gamut-warning-banner"
            className={`mb-6 flex items-start gap-2.5 rounded-xl border p-3 text-xs leading-relaxed transition-colors ${
              gamutStatus.level === "severe"
                ? "border-amber-200/90 bg-amber-50/90 text-amber-900"
                : "border-blue-200/80 bg-blue-50/80 text-blue-900"
            }`}
          >
            <AlertTriangle
              className={`mt-0.5 size-4 shrink-0 ${
                gamutStatus.level === "severe" ? "text-amber-600" : "text-blue-600"
              }`}
            />
            <div className="min-w-0 flex-1">
              <div className="mb-0.5 flex flex-wrap items-center gap-2 font-bold">
                <span>
                  {gamutStatus.level === "severe"
                    ? en
                      ? "Colour outside the CMYK gamut"
                      : "Цвет вне охвата CMYK"
                    : en
                      ? "Noticeable print shift"
                      : "Заметный сдвиг при печати"}
                </span>
                <span className="rounded-full border border-current/20 bg-white/70 px-1.5 py-0.5 font-mono text-[10px]">
                  ΔE: {gamutStatus.deltaE}
                </span>
              </div>
              <p className="text-[11px] leading-normal opacity-90">
                {gamutStatus.level === "severe"
                  ? en
                    ? "Offset inks cannot reproduce this screen saturation; the printed colour will be noticeably more restrained."
                    : "Офсетные краски не могут воспроизвести такую экранную насыщенность — цвет на бумаге будет заметно спокойнее."
                  : en
                    ? "The printed colour will be less saturated than the screen original."
                    : "На бумаге цвет будет менее насыщенным, чем экранный оригинал."}
              </p>
            </div>
          </div>
        )}

        {/* Значения CMYK Cards (C, M, Y, K) */}
        <div className="mb-6">
          <div className="text-xs font-bold text-slate-800 mb-2.5">
            {en ? "CMYK values" : "Значения CMYK"}
          </div>
          <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
            {/* C Card */}
            <div className="bg-slate-50/90 border border-slate-200/80 rounded-xl p-2.5 text-center">
              <div className="text-xs font-bold text-sky-500 mb-0.5">C</div>
              <div className="text-base sm:text-lg font-bold text-slate-900 mb-2">{cmyk.c}%</div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-sky-500 rounded-full transition-all duration-300"
                  style={{ width: `${cmyk.c}%` }}
                />
              </div>
            </div>

            {/* M Card */}
            <div className="bg-slate-50/90 border border-slate-200/80 rounded-xl p-2.5 text-center">
              <div className="text-xs font-bold text-pink-500 mb-0.5">M</div>
              <div className="text-base sm:text-lg font-bold text-slate-900 mb-2">{cmyk.m}%</div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-pink-500 rounded-full transition-all duration-300"
                  style={{ width: `${cmyk.m}%` }}
                />
              </div>
            </div>

            {/* Y Card */}
            <div className="bg-slate-50/90 border border-slate-200/80 rounded-xl p-2.5 text-center">
              <div className="text-xs font-bold text-amber-500 mb-0.5">Y</div>
              <div className="text-base sm:text-lg font-bold text-slate-900 mb-2">{cmyk.y}%</div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-300"
                  style={{ width: `${cmyk.y}%` }}
                />
              </div>
            </div>

            {/* K Card */}
            <div className="bg-slate-50/90 border border-slate-200/80 rounded-xl p-2.5 text-center">
              <div className="text-xs font-bold text-slate-800 mb-0.5">K</div>
              <div className="text-base sm:text-lg font-bold text-slate-900 mb-2">{cmyk.k}%</div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-slate-800 rounded-full transition-all duration-300"
                  style={{ width: `${cmyk.k}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Pantone Quick Preview Badge */}
        {pantoneMatch && (
          <div
            onClick={onOpenPantoneTab}
            className="mb-5 bg-gradient-to-r from-slate-50 to-blue-50/40 border border-slate-200/90 rounded-xl p-2.5 flex items-center justify-between cursor-pointer hover:border-blue-300 transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-5 h-5 rounded-md border border-black/10 shrink-0"
                style={{ backgroundColor: pantoneMatch.pantone.hex }}
              />
              <div className="leading-tight">
                <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
                  <span>{pantoneMatch.pantone.code}</span>
                  <span className="text-[10px] font-medium text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded-sm">
                    {pantoneMatch.matchScore}% {en ? "match" : "совпадение"}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  {pantoneMatch.pantone.name} (ΔE {pantoneMatch.deltaE})
                </div>
              </div>
            </div>
            <div className="text-xs font-semibold text-blue-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              <span>{en ? "Pantone" : "Пантон"}</span>
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>
        )}
      </div>

      {/* Format Select & Main Copy Button */}
      <div className="pt-2">
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          {en ? "Output format" : "Формат вывода"}
        </label>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Dropdown container */}
          <div className="relative flex-1">
            <select
              id="select-cmyk-format"
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value as OutputFormat)}
              className="w-full h-11 appearance-none bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-8 text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="percent_separated">
                {en ? "Percentages (C, M, Y, K)" : "Проценты (C, M, Y, K)"}
              </option>
              <option value="cmyk_function">
                {en ? "cmyk(C%, M%, Y%, K%) function" : "Функция cmyk(C%, M%, Y%, K%)"}
              </option>
              <option value="comma_percent">
                {en ? "Comma-separated (84%, 58%, 0%, 8%)" : "Через запятую (84%, 58%, 0%, 8%)"}
              </option>
              <option value="normalized">
                {en ? "Decimals (0.84, 0.58, 0, 0.08)" : "Десятичные (0.84, 0.58, 0, 0.08)"}
              </option>
              <option value="css_device_cmyk">CSS device-cmyk(...)</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
          </div>

          {/* Quick copy icon button */}
          <button
            id="btn-copy-format-icon"
            type="button"
            onClick={() => copyToClipboard(formattedCmykText, setCopiedFormat)}
            title={en ? "Copy in this format" : "Скопировать в этом формате"}
            className="h-11 w-11 shrink-0 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors"
          >
            {copiedFormat ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>

          {/* Primary Action Button: "Скопировать CMYK" */}
          <button
            id="btn-copy-cmyk-main"
            type="button"
            onClick={() => copyToClipboard(formattedCmykText, setCopiedCmykMain)}
            className="h-11 px-4 sm:px-5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all shrink-0 cursor-pointer"
          >
            {copiedCmykMain ? (
              <>
                <Check className="w-4 h-4" />
                <span>{en ? "Copied!" : "Скопировано!"}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>{en ? "Copy CMYK" : "Скопировать CMYK"}</span>
              </>
            )}
          </button>
          {onOpenExport && (
            <button
              id="btn-export-quick-result"
              type="button"
              onClick={onOpenExport}
              title={en ? "Export for print" : "Экспорт для печати"}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 transition-colors hover:bg-emerald-100"
            >
              <Download className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
