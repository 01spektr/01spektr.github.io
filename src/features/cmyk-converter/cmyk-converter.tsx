import React, { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Check,
  ChevronDown,
  ChevronRight,
  Clipboard,
  Copy,
  Download,
  Droplets,
  Eye,
  FileText,
  HelpCircle,
  Lightbulb,
  MessageSquare,
  Palette,
  Pipette,
  RotateCcw,
  Sliders,
  Sparkles,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useI18n } from "@/lib/i18n";
import { isFavorite, toggleFavorite } from "@/lib/tools/favorites";
import { recordHistory } from "@/lib/tools/history";
import { buildShareUrl, shareUrl } from "@/lib/tools/share";
import { CmykHeroBanner } from "./components/HeroBanner";
import { CmykMetricsCards } from "./components/MetricsCards";
import "./cmyk-converter.css";

type Rgb = { r: number; g: number; b: number };
type Paper = "coated" | "uncoated";
type Tab = "preview" | "comparison" | "palette" | "pantone" | "export";
type Mode = "RGB" | "HEX" | "HSL";

const START: Rgb = { r: 37, g: 99, b: 235 };
const PANTONES = [
  ["PANTONE 2174 C", "Royal Blue", "#2563EB"],
  ["PANTONE 286 C", "True Blue", "#0033A0"],
  ["PANTONE 185 C", "Signal Red", "#E4002B"],
  ["PANTONE 354 C", "Shamrock Green", "#00B140"],
  ["PANTONE 123 C", "Golden Yellow", "#FFC600"],
  ["PANTONE 165 C", "Bright Orange", "#FF671F"],
  ["PANTONE 2597 C", "Violet", "#5F259F"],
  ["PANTONE Black C", "Rich Black", "#2D2926"],
  ["PANTONE Cool Gray 7 C", "Cool Gray", "#97999B"],
  ["PANTONE 7474 C", "Teal", "#007F86"],
] as const;

function clamp(n: number) {
  return Math.max(0, Math.min(255, Math.round(n)));
}

function hex(rgb: Rgb) {
  return `#${[rgb.r, rgb.g, rgb.b]
    .map((v) => clamp(v).toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()}`;
}

function parseHex(value: string): Rgb | null {
  const raw = value.trim().replace("#", "");
  const full =
    raw.length === 3
      ? raw
          .split("")
          .map((x) => x + x)
          .join("")
      : raw;
  return /^[\da-f]{6}$/i.test(full)
    ? {
        r: parseInt(full.slice(0, 2), 16),
        g: parseInt(full.slice(2, 4), 16),
        b: parseInt(full.slice(4, 6), 16),
      }
    : null;
}

function cmyk({ r, g, b }: Rgb) {
  const [R, G, B] = [r / 255, g / 255, b / 255];
  const k = 1 - Math.max(R, G, B);
  return k === 1
    ? { c: 0, m: 0, y: 0, k: 100 }
    : {
        c: Math.round(((1 - R - k) / (1 - k)) * 100),
        m: Math.round(((1 - G - k) / (1 - k)) * 100),
        y: Math.round(((1 - B - k) / (1 - k)) * 100),
        k: Math.round(k * 100),
      };
}

function printed(value: Rgb, paper: Paper) {
  const p = cmyk(value);
  const base = {
    r: 255 * (1 - p.c / 100) * (1 - p.k / 100),
    g: 255 * (1 - p.m / 100) * (1 - p.k / 100),
    b: 255 * (1 - p.y / 100) * (1 - p.k / 100),
  };
  return paper === "coated"
    ? { r: clamp(base.r * 0.96), g: clamp(base.g * 0.95), b: clamp(base.b * 0.94) }
    : { r: clamp(base.r * 0.88 + 15), g: clamp(base.g * 0.88 + 15), b: clamp(base.b * 0.88 + 15) };
}

function hsl({ r, g, b }: Rgb) {
  const [R, G, B] = [r / 255, g / 255, b / 255];
  const max = Math.max(R, G, B),
    min = Math.min(R, G, B),
    l = (max + min) / 2,
    d = max - min;
  let h = 0;
  if (d) {
    h = max === R ? (G - B) / d + (G < B ? 6 : 0) : max === G ? (B - R) / d + 2 : (R - G) / d + 4;
    h *= 60;
  }
  return {
    h: Math.round(h),
    s: Math.round((max === min ? 0 : d / (1 - Math.abs(2 * l - 1))) * 100),
    l: Math.round(l * 100),
  };
}

function distance(a: Rgb, b: Rgb) {
  return Math.sqrt((a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2);
}

function download(name: string, content: string, type = "text/plain") {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([content], { type }));
  link.download = name;
  link.click();
  URL.revokeObjectURL(link.href);
}

export function CmykConverterPage() {
  const { locale, t } = useI18n();
  const tr = (ru: string, uz: string, en: string) =>
    locale === "ru" ? ru : locale === "uz" ? uz : en;

  const [rgb, setRgb] = useState<Rgb>(START);
  const [hexInput, setHexInput] = useState(hex(START));
  const [paper, setPaper] = useState<Paper>("coated");
  const [tab, setTab] = useState<Tab>("preview");
  const [mode, setMode] = useState<Mode>("RGB");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [fav, setFav] = useState(() => isFavorite("cmyk-convert"));
  const [copied, setCopied] = useState(false);

  const values = useMemo(() => cmyk(rgb), [rgb]);
  const print = useMemo(() => printed(rgb, paper), [rgb, paper]);
  const hslValues = useMemo(() => hsl(rgb), [rgb]);
  const coverage = values.c + values.m + values.y + values.k;

  const matches = useMemo(
    () =>
      PANTONES.map(([code, name, value]) => ({
        code,
        name,
        value,
        score: Math.max(0, Math.round(100 - distance(rgb, parseHex(value)!) / 4.42)),
      }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 4),
    [rgb],
  );

  const colors = useMemo(
    () => [
      rgb,
      { r: clamp(rgb.r * 0.72), g: clamp(rgb.g * 0.72), b: clamp(rgb.b * 0.72) },
      { r: clamp((rgb.r + 255) / 2), g: clamp((rgb.g + 255) / 2), b: clamp((rgb.b + 255) / 2) },
      { r: 255 - rgb.r, g: 255 - rgb.g, b: 255 - rgb.b },
    ],
    [rgb],
  );

  function updateRgb(channel: keyof Rgb, value: number) {
    const next = { ...rgb, [channel]: clamp(value) };
    setRgb(next);
    setHexInput(hex(next));
  }

  function commitHex(value: string) {
    setHexInput(value.toUpperCase());
    const next = parseHex(value);
    if (next) setRgb(next);
  }

  async function copyResult() {
    const value = `RGB: ${hex(rgb)} · rgb(${rgb.r}, ${rgb.g}, ${rgb.b})\nCMYK: cmyk(${values.c}%, ${values.m}%, ${values.y}%, ${values.k}%)\nTAC: ${coverage}%\nPaper: ${paper === "coated" ? "Coated" : "Uncoated"}\nPantone: ${matches[0].code} (${matches[0].score}% match)`;
    await navigator.clipboard?.writeText(value);
    setCopied(true);
    recordHistory({
      toolId: "cmyk-convert",
      title: `RGB → CMYK: ${hex(rgb)}`,
      params: { hex: hex(rgb), cmyk: `${values.c},${values.m},${values.y},${values.k}` },
    });
    toast.success(tr("Значения CMYK скопированы", "CMYK qiymatlari nusxalandi", "CMYK values copied"));
    setTimeout(() => setCopied(false), 1500);
  }

  function exportSpec() {
    const lines = [
      `Toolboxi.uz — Спецификация цвета (RGB → CMYK)`,
      `---------------------------------------------`,
      `RGB: ${hex(rgb)} / rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      `CMYK: C ${values.c}% · M ${values.m}% · Y ${values.y}% · K ${values.k}%`,
      `Total ink coverage (TAC): ${coverage}%`,
      `Бумага: ${paper === "coated" ? "Мелованная (Coated)" : "Офсетная (Uncoated)"}`,
      `Ближайший Pantone: ${matches[0].code} — ${matches[0].name} (${matches[0].score}% сходства)`,
      `Дата генерации: ${new Date().toLocaleString()}`,
    ];
    download(`toolboxi-color-${hex(rgb).slice(1)}.txt`, lines.join("\n"));
    recordHistory({
      toolId: "cmyk-convert",
      title: `RGB → CMYK: ${hex(rgb)}`,
      params: { hex: hex(rgb), export: "spec" },
    });
    toast.success(tr("Спецификация скачана", "Spetsifikatsiya yuklandi", "Specification downloaded"));
  }

  async function onShare() {
    const result = await shareUrl(
      buildShareUrl(locale === "en" ? "/en/tools/cmyk-convert" : locale === "uz" ? "/uz/tools/cmyk-convert" : "/tools/cmyk-convert", new URLSearchParams()),
      tr("Конвертер RGB → CMYK", "RGB → CMYK konverteri", "RGB → CMYK Converter"),
    );
    if (result === "copied") toast.success(t("share.copied"));
    if (result === "failed") toast.error(t("share.failed"));
  }

  return (
    <div className="w-full max-w-[1380px] mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6">
      {/* Standard Hero Banner */}
      <CmykHeroBanner
        fav={fav}
        onToggleFav={() => setFav(toggleFavorite("cmyk-convert"))}
        onShare={onShare}
      />

      {/* Main 2-column layout matching loan-calculator benchmark */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Input Color Controls */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs transition-colors">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-heading text-base font-bold text-slate-900 dark:text-slate-100">
                    {tr("Выбор цвета", "Rangni tanlash", "Color input")}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {tr("RGB, HEX или палитра", "RGB, HEX yoki palitra", "RGB, HEX or swatch")}
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setRgb(START);
                  setHexInput(hex(START));
                }}
                className="h-8 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{tr("Сброс", "Tiklash", "Reset")}</span>
              </Button>
            </div>

            {/* Color Swatch & Native Picker */}
            <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800/80 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl shadow-inner border border-black/10 dark:border-white/10 shrink-0 transition-colors"
                  style={{ backgroundColor: hex(rgb) }}
                />
                <div>
                  <div className="font-mono text-base font-bold text-slate-900 dark:text-slate-100">
                    {hex(rgb)}
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    rgb({rgb.r}, {rgb.g}, {rgb.b})
                  </div>
                </div>
              </div>

              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs">
                <Pipette className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span>{tr("Пипетка", "Pipetka", "Eyedropper")}</span>
                <input
                  type="color"
                  value={hex(rgb)}
                  onChange={(e) => commitHex(e.target.value)}
                  className="sr-only"
                />
              </label>
            </div>

            {/* Mode Tabs */}
            <div className="grid grid-cols-3 gap-1.5 mt-4 p-1 bg-slate-100 dark:bg-slate-800/60 rounded-xl">
              {(["RGB", "HEX", "HSL"] as Mode[]).map((item) => (
                <button
                  key={item}
                  onClick={() => setMode(item)}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                    mode === item
                      ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Mode Controls */}
            <div className="mt-4">
              {mode === "RGB" ? (
                <div className="space-y-4">
                  {(["r", "g", "b"] as const).map((ch) => {
                    const colorLabel =
                      ch === "r"
                        ? tr("Red (Красный)", "Red (Qizil)", "Red")
                        : ch === "g"
                        ? tr("Green (Зелёный)", "Green (Yashil)", "Green")
                        : tr("Blue (Синий)", "Blue (Ko'k)", "Blue");
                    const barColor =
                      ch === "r" ? "text-rose-500" : ch === "g" ? "text-emerald-500" : "text-blue-500";
                    return (
                      <div key={ch} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className={`font-bold ${barColor}`}>{colorLabel}</span>
                          <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                            {rgb[ch]}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Slider
                            value={[rgb[ch]]}
                            onValueChange={(val) => updateRgb(ch, val[0])}
                            min={0}
                            max={255}
                            step={1}
                            className="flex-1"
                          />
                          <Input
                            type="number"
                            min={0}
                            max={255}
                            value={rgb[ch]}
                            onChange={(e) => updateRgb(ch, Number(e.target.value) || 0)}
                            className="w-16 h-8 text-center text-xs font-mono font-bold"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : mode === "HEX" ? (
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {tr("Шестнадцатеричный код (HEX)", "O'n oltilik kod (HEX)", "Hexadecimal Code (HEX)")}
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={hexInput}
                      onChange={(e) => commitHex(e.target.value)}
                      placeholder="#2563EB"
                      className="font-mono text-sm font-bold uppercase"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => void navigator.clipboard?.writeText(hex(rgb))}
                      className="h-9 gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {tr("Поддерживаются форматы #RGB и #RRGGBB", "#RGB va #RRGGBB formatlari qo'llab-quvvatlanadi", "Supports #RGB and #RRGGBB formats")}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {(["h", "s", "l"] as const).map((part) => (
                    <div key={part} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-600 dark:text-slate-400">
                          {part.toUpperCase()}{" "}
                          {part === "h" ? "(Цветовой тон)" : part === "s" ? "(Насыщенность)" : "(Светлота)"}
                        </span>
                        <span className="font-mono text-slate-900 dark:text-slate-100">
                          {hslValues[part]}
                          {part === "h" ? "°" : "%"}
                        </span>
                      </div>
                      <Slider
                        value={[hslValues[part]]}
                        min={0}
                        max={part === "h" ? 360 : 100}
                        step={1}
                        disabled
                        className="opacity-80"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Paper Selection */}
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {tr("Тип бумаги для имитации", "Qog'oz turi", "Paper type for print simulation")}
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaper("coated")}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    paper === "coated"
                      ? "border-cyan-500 bg-cyan-500/10 text-cyan-900 dark:text-cyan-200 font-semibold ring-1 ring-cyan-500/30"
                      : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <div className="text-xs font-medium">
                    {tr("Мелованная (Coated)", "Qoplamali (Coated)", "Coated")}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {tr("Глянец, матовая (каталоги)", "Yaltiroq, kataloglar", "Gloss, catalogs, flyers")}
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setPaper("uncoated")}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    paper === "uncoated"
                      ? "border-cyan-500 bg-cyan-500/10 text-cyan-900 dark:text-cyan-200 font-semibold ring-1 ring-cyan-500/30"
                      : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <div className="text-xs font-medium">
                    {tr("Офсетная (Uncoated)", "Qoplamasiz (Uncoated)", "Uncoated")}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {tr("Впитывающая (книги, бланки)", "Kitoblar, blanklar", "Absorbent, books, stationery")}
                  </div>
                </button>
              </div>
            </div>

            {/* Quick Swatches Palette */}
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {tr("Быстрые цвета", "Tezkor ranglar", "Quick colors")}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  "#2563EB",
                  "#EF4444",
                  "#10B981",
                  "#F59E0B",
                  "#EA580C",
                  "#8B5CF6",
                  "#EC4899",
                  "#000000",
                  "#FFFFFF",
                ].map((val) => (
                  <button
                    key={val}
                    title={val}
                    onClick={() => commitHex(val)}
                    className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-transform hover:scale-110 shadow-2xs ${
                      hex(rgb) === val ? "ring-2 ring-cyan-500 ring-offset-1 scale-105" : "border-slate-300 dark:border-slate-700"
                    }`}
                    style={{ backgroundColor: val }}
                  >
                    {hex(rgb) === val && (
                      <Check className={`w-3.5 h-3.5 ${val === "#FFFFFF" ? "text-slate-900" : "text-white"}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Metrics & Print Simulation */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Top Metrics Cards */}
          <CmykMetricsCards
            cmyk={values}
            coverage={coverage}
            closestPantone={matches[0]}
            onCopyAll={copyResult}
            copied={copied}
          />

          {/* Main Simulation & Tabs Card */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs transition-colors">
            {/* Header with Navigation Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <h3 className="font-heading text-sm font-bold text-slate-900 dark:text-slate-100">
                  {tr("Имитация печати и каналы", "Bosma taqlidi va kanallar", "Print simulation & channels")}
                </h3>
              </div>

              {/* Tabs */}
              <div className="flex flex-wrap items-center gap-1">
                {(["preview", "comparison", "palette", "pantone", "export"] as Tab[]).map((k) => {
                  const tabLabel =
                    k === "preview"
                      ? tr("Сравнение", "Taqqoslash", "Compare")
                      : k === "comparison"
                      ? tr("Раздельно", "Alohida", "Split")
                      : k === "palette"
                      ? tr("Палитра", "Palitra", "Palette")
                      : k === "pantone"
                      ? tr("Pantone", "Pantone", "Pantone")
                      : tr("Экспорт", "Eksport", "Export");
                  return (
                    <button
                      key={k}
                      onClick={() => setTab(k)}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                        tab === k
                          ? "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/25"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                      }`}
                    >
                      {tabLabel}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Contents */}
            <div className="mt-4">
              {tab === "preview" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          {tr("Экран (RGB sRGB)", "Ekran (RGB)", "Screen (RGB)")}
                        </span>
                        <span className="font-mono text-xs text-slate-500">{hex(rgb)}</span>
                      </div>
                      <div
                        className="h-24 rounded-lg shadow-inner border border-black/10 dark:border-white/10"
                        style={{ backgroundColor: hex(rgb) }}
                      />
                      <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                        {tr("Светящиеся пиксели монитора", "Monitor piksellari", "Emitted light from screen pixels")}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          {tr("Печать (CMYK имитация)", "Bosma (CMYK taqlid)", "Print (CMYK Simulation)")}
                        </span>
                        <span className="font-mono text-xs text-slate-500">{hex(print)}</span>
                      </div>
                      <div
                        className="h-24 rounded-lg shadow-inner border border-black/10 dark:border-white/10"
                        style={{ backgroundColor: hex(print) }}
                      />
                      <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                        {paper === "coated" ? tr("Мелованная бумага (глянец)", "Qoplamali qog'oz", "Coated paper") : tr("Офсетная бумага (матовая)", "Qoplamasiz qog'oz", "Uncoated paper")}
                      </div>
                    </div>
                  </div>

                  {/* Channel Separation Bars */}
                  <div className="pt-2 space-y-2.5">
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {tr("Красочные каналы CMYK", "CMYK bo'yoq kanallari", "CMYK Ink Separation")}
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {[
                        { name: "Cyan", val: values.c, bg: "bg-cyan-400", text: "text-cyan-700 dark:text-cyan-300" },
                        { name: "Magenta", val: values.m, bg: "bg-pink-500", text: "text-pink-700 dark:text-pink-300" },
                        { name: "Yellow", val: values.y, bg: "bg-yellow-400", text: "text-yellow-700 dark:text-yellow-300" },
                        { name: "Black (K)", val: values.k, bg: "bg-slate-900 dark:bg-slate-200", text: "text-slate-800 dark:text-slate-200" },
                      ].map((ch) => (
                        <div key={ch.name} className="p-2.5 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
                          <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
                            <span className={ch.text}>{ch.name}</span>
                            <span className="font-mono">{ch.val}%</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                            <div className={`h-full ${ch.bg} transition-all duration-300`} style={{ width: `${ch.val}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {tab === "comparison" && (
                <div className="space-y-3">
                  <div className="h-44 rounded-xl overflow-hidden flex border border-slate-200 dark:border-slate-800 shadow-inner">
                    <div
                      className="w-1/2 h-full flex flex-col justify-end p-3 text-white drop-shadow font-bold text-xs"
                      style={{ backgroundColor: hex(rgb) }}
                    >
                      <span>RGB (Screen)</span>
                      <span className="font-mono text-[11px] opacity-90">{hex(rgb)}</span>
                    </div>
                    <div
                      className="w-1/2 h-full flex flex-col justify-end p-3 text-white drop-shadow font-bold text-xs"
                      style={{ backgroundColor: hex(print) }}
                    >
                      <span>CMYK (Print)</span>
                      <span className="font-mono text-[11px] opacity-90">{hex(print)}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {tr(
                      "Имитация наглядно демонстрирует потерю яркости: экран излучает свет напрямую, тогда как краска на бумаге лишь отражает его, поглощая часть спектра.",
                      "Ekran yorug'lik taratadi, qog'ozdagi bo'yoq esa uni aks ettiradi va yorqinlik biroz pasayadi.",
                      "The simulation illustrates gamut loss: monitors emit light directly, while physical ink on paper absorbs portions of the spectrum."
                    )}
                  </p>
                </div>
              )}

              {tab === "palette" && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {tr("Гармоничные оттенки и комплементарные цвета для макета:", "Maket uchun uyg'un ranglar:", "Harmonized tints, shades, and complementary colors:")}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {colors.map((c, i) => (
                      <button
                        key={`${hex(c)}-${i}`}
                        onClick={() => commitHex(hex(c))}
                        className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 hover:border-cyan-400 transition-all text-left group"
                      >
                        <div
                          className="h-14 rounded-lg shadow-inner mb-2 border border-black/10 dark:border-white/10 group-hover:scale-102 transition-transform"
                          style={{ backgroundColor: hex(c) }}
                        />
                        <div className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                          {hex(c)}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {i === 0 ? "Базовый" : i === 1 ? "Тень" : i === 2 ? "Светлый" : "Контраст"}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {tab === "pantone" && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {tr("Ближайшие совпадения из стандартного веера Pantone Formula Guide:", "Pantone Formula Guide dan eng yaqin mos ranglar:", "Closest matches from standard Pantone Formula Guide:")}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {matches.map((m) => (
                      <button
                        key={m.code}
                        onClick={() => commitHex(m.value)}
                        className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 hover:border-indigo-400 flex items-center justify-between gap-3 text-left transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-lg shadow-inner border border-black/10 dark:border-white/10 shrink-0 group-hover:scale-105 transition-transform"
                            style={{ backgroundColor: m.value }}
                          />
                          <div>
                            <div className="font-bold text-xs text-slate-900 dark:text-slate-100">
                              {m.code}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">
                              {m.name}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/40 shrink-0">
                          {m.score}% {tr("сходство", "moslik", "match")}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {tab === "export" && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {tr("Скачайте колористическую карту для типографии или дизайнера:", "Bosmaxona uchun rang kartasini yuklab oling:", "Download color spec sheet for prepress and production:")}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      onClick={exportSpec}
                      className="h-auto p-4 flex flex-col items-start gap-1 text-left justify-start rounded-xl border-slate-200 dark:border-slate-800 hover:border-cyan-500"
                    >
                      <div className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-slate-100">
                        <FileText className="w-4 h-4 text-cyan-600" />
                        <span>{tr("Текстовая спецификация (.txt)", "Matnli spetsifikatsiya (.txt)", "Text Specification (.txt)")}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-normal">
                        {tr("Все каналы CMYK, RGB, TAC и Pantone", "Barcha kanallar va Pantone ma'lumotlari", "Complete RGB, CMYK, TAC, and Pantone report")}
                      </p>
                    </Button>

                    <Button
                      variant="outline"
                      onClick={copyResult}
                      className="h-auto p-4 flex flex-col items-start gap-1 text-left justify-start rounded-xl border-slate-200 dark:border-slate-800 hover:border-cyan-500"
                    >
                      <div className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-slate-100">
                        <Clipboard className="w-4 h-4 text-emerald-600" />
                        <span>{tr("Скопировать в буфер", "Xotiraga nusxalash", "Copy to clipboard")}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-normal">
                        {tr("Форматированный блок для Photoshop / Illustrator", "Photoshop / Illustrator uchun blok", "Ready for Photoshop or Figma swatch notes")}
                      </p>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Bottom informational cards grid */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Info Card */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-colors flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="w-7 h-7 rounded-lg bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <Droplets className="w-4 h-4" />
              </div>
              <h3 className="font-heading text-sm font-bold text-slate-900 dark:text-slate-100">
                {tr("Как устроен CMYK?", "CMYK qanday ishlaydi?", "How CMYK Works")}
              </h3>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              {tr(
                "CMYK — субтрактивная цветовая модель: бумага изначально белая, а слои красителей Cyan, Magenta, Yellow вычитают часть световых волн. Канал Key (Black) добавляется для глубины теней и четкости шрифтов.",
                "CMYK - ayiruvchi rang modeli: oq qog'oz ustiga Moviy, Qizg'ish, Sariq va Qora bo'yoqlar surtiladi.",
                "CMYK is a subtractive color model. Physical inks subtract brightness from the white sheet of paper. Black (Key) is added to provide shadow depth and crisp typography."
              )}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-medium text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
              ISO 12647 Standard <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </section>

        {/* Tips Card */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-colors flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Lightbulb className="w-4 h-4" />
              </div>
              <h3 className="font-heading text-sm font-bold text-slate-900 dark:text-slate-100">
                {tr("Советы для печати", "Bosma uchun maslahatlar", "Print Advice")}
              </h3>
            </div>
            <ul className="mt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {tr("Контролируйте TAC: не более 300% для мелованной бумаги", "TAC 300% dan oshmasligi kerak", "Keep TAC under 300% for coated stock")}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {tr("Для мелкого текста используйте чистый черный: C:0 M:0 Y:0 K:100", "Kichik matnlar uchun faqat 100% K foydalaning", "Use pure 100% K for small typography")}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {tr("Для важных брендовых цветов заказывайте контрактную цветопробу", "Muhim ranglar uchun rang sinovi qildiring", "Order hard-copy proofs for critical corporate colors")}
              </li>
            </ul>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              Prepress Guidelines <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </section>

        {/* FAQ & Related Tools Card */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-colors flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Palette className="w-4 h-4" />
                </div>
                <h3 className="font-heading text-sm font-bold text-slate-900 dark:text-slate-100">
                  {tr("Похожие инструменты", "O'xshash vositalar", "Related Tools")}
                </h3>
              </div>
              <Link
                to="/categories/$id"
                params={{ id: "design-print" }}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5"
              >
                {tr("Все", "Barchasi", "All")} <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link
                to="/tools/$slug"
                params={{ slug: "color-palette" }}
                className="p-2.5 rounded-xl border border-slate-200/70 dark:border-slate-800 hover:border-cyan-300 dark:hover:border-cyan-700 bg-slate-50/50 dark:bg-slate-800/40 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-indigo-500" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 transition-colors">
                    Палитры
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 truncate">
                  {tr("Генератор схем", "Sxemalar generatori", "Palette generator")}
                </p>
              </Link>

              <Link
                to="/tools/$slug"
                params={{ slug: "image-resize" }}
                className="p-2.5 rounded-xl border border-slate-200/70 dark:border-slate-800 hover:border-cyan-300 dark:hover:border-cyan-700 bg-slate-50/50 dark:bg-slate-800/40 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-cyan-500" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-cyan-600 transition-colors">
                    Сжатие фото
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 truncate">
                  {tr("WebP, PNG, JPEG", "WebP, PNG, JPEG", "WebP, PNG, JPEG")}
                </p>
              </Link>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] text-slate-400">
              {tr("Инструменты для полиграфии Toolboxi", "Toolboxi poligrafiya vositalari", "Toolboxi design & prepress")}
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
