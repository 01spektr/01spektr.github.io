import { Link } from "@tanstack/react-router";
import {
  Check,
  ChevronDown,
  ChevronRight,
  Clipboard,
  Copy,
  Download,
  Eye,
  FileText,
  Lightbulb,
  MessageSquare,
  Palette,
  Pipette,
  RotateCcw,
  Share2,
  Star,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ToolIcon } from "@/components/tool-icon";
import { useI18n } from "@/lib/i18n";
import { isFavorite, toggleFavorite } from "@/lib/tools/favorites";
import { recordHistory } from "@/lib/tools/history";
import { buildShareUrl, shareUrl } from "@/lib/tools/share";
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

const copy = {
  ru: {
    home: "Главная",
    category: "Дизайн и полиграфия",
    title: "Конвертер RGB → CMYK",
    subtitle:
      "Переводите экранные цвета в печатную модель, проверяйте покрытие краской и подбирайте близкий Pantone.",
    favorite: "В избранное",
    share: "Поделиться",
    input: "Исходный цвет",
    hex: "HEX-код",
    rgb: "RGB",
    hsl: "HSL",
    result: "Результат для печати",
    copy: "Копировать",
    copied: "Скопировано",
    coated: "Мелованная бумага",
    uncoated: "Немелованная бумага",
    preview: "Предпросмотр",
    palette: "Палитра",
    pantone: "Ближайшие Pantone",
    screen: "Экран RGB",
    print: "Имитация CMYK-печати",
    channels: "Каналы печати",
    ink: "Общее покрытие краской",
    safe: "Подходит для офсетной печати",
    warning: "Высокое покрытие — проверьте требования типографии",
    export: "Скачать спецификацию",
    reset: "Сбросить",
    how: "Как пользоваться",
    howText:
      "Введите HEX или RGB — CMYK и печатный предпросмотр обновятся сразу. Для точного тиража запросите цветопробу в типографии.",
    privacy: "Расчёт выполняется прямо в браузере",
    match: "сходство",
    more: "Цвета палитры",
    tip: "Цвет на мониторе может отличаться от печати: это зависит от бумаги, профиля и оборудования.",
  },
  en: {
    home: "Home",
    category: "Design & print",
    title: "RGB → CMYK converter",
    subtitle:
      "Convert screen colors to a print model, check ink coverage, and find a close Pantone match.",
    favorite: "Add to favorites",
    share: "Share",
    input: "Source color",
    hex: "HEX code",
    rgb: "RGB",
    hsl: "HSL",
    result: "Print result",
    copy: "Copy",
    copied: "Copied",
    coated: "Coated paper",
    uncoated: "Uncoated paper",
    preview: "Preview",
    palette: "Palette",
    pantone: "Closest Pantone",
    screen: "RGB screen",
    print: "Simulated CMYK print",
    channels: "Print channels",
    ink: "Total ink coverage",
    safe: "Suitable for offset printing",
    warning: "High coverage — check your printer's specification",
    export: "Download specification",
    reset: "Reset",
    how: "How to use",
    howText:
      "Enter HEX or RGB values — CMYK and print preview update immediately. Request a contract proof for brand-critical printing.",
    privacy: "Everything is calculated in your browser",
    match: "match",
    more: "Palette colors",
    tip: "A screen color can differ from print depending on paper, profile, and equipment.",
  },
  uz: {
    home: "Bosh sahifa",
    category: "Dizayn va poligrafiya",
    title: "RGB → CMYK konverteri",
    subtitle: "Ekran ranglarini bosma modelga o‘tkazing, bo‘yoq qoplamasini tekshiring va yaqin Pantone rangini toping.",
    favorite: "Sevimlilarga qo‘shish",
    share: "Ulashish",
    input: "Boshlang‘ich rang",
    hex: "HEX-kod",
    rgb: "RGB",
    hsl: "HSL",
    result: "Bosma natijasi",
    copy: "Nusxalash",
    copied: "Nusxalandi",
    coated: "Qoplamali qog‘oz",
    uncoated: "Qoplamasiz qog‘oz",
    preview: "Ko‘rib chiqish",
    palette: "Palitra",
    pantone: "Eng yaqin Pantone",
    screen: "RGB ekran",
    print: "CMYK bosma taqlidi",
    channels: "Bosma kanallari",
    ink: "Umumiy bo‘yoq qoplamasi",
    safe: "Ofset bosma uchun mos",
    warning: "Qoplama yuqori — bosmaxona talablarini tekshiring",
    export: "Spetsifikatsiyani yuklab olish",
    reset: "Tiklash",
    how: "Qanday foydalaniladi",
    howText: "HEX yoki RGB qiymatini kiriting — CMYK va bosma ko‘rinishi darhol yangilanadi. Muhim ranglar uchun bosmaxonadan rang sinovini so‘rang.",
    privacy: "Hisoblash bevosita brauzerda bajariladi",
    match: "moslik",
    more: "Palitra ranglari",
    tip: "Ekrandagi rang qog‘oz, profil va uskunaga qarab bosmadagi rangdan farq qilishi mumkin.",
  },
};

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
  const { locale } = useI18n();
  const t = copy[locale];
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
    const value = `RGB ${hex(rgb)} · rgb(${rgb.r}, ${rgb.g}, ${rgb.b})\nCMYK cmyk(${values.c}%, ${values.m}%, ${values.y}%, ${values.k}%)\nTAC ${coverage}%`;
    await navigator.clipboard?.writeText(value);
    setCopied(true);
    recordHistory({
      toolId: "cmyk-convert",
      title: `RGB → CMYK: ${hex(rgb)}`,
      params: { hex: hex(rgb), cmyk: `${values.c},${values.m},${values.y},${values.k}` },
    });
    toast.success(t.copied);
    setTimeout(() => setCopied(false), 1500);
  }
  function exportSpec() {
    const lines = [
      `Toolboxi.uz — RGB → CMYK`,
      `RGB: ${hex(rgb)} / rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      `CMYK: C ${values.c}% · M ${values.m}% · Y ${values.y}% · K ${values.k}%`,
      `Total ink coverage: ${coverage}%`,
      `Paper: ${paper === "coated" ? t.coated : t.uncoated}`,
      `Closest Pantone: ${matches[0].code} (${matches[0].score}% ${t.match})`,
    ];
    download(`toolboxi-color-${hex(rgb).slice(1)}.txt`, lines.join("\n"));
    recordHistory({
      toolId: "cmyk-convert",
      title: `RGB → CMYK: ${hex(rgb)}`,
      params: { hex: hex(rgb), export: "spec" },
    });
  }
  return (
    <div className="cmyk-page cmyk-source-layout pb-10">
      <div className="cmyk-topbar">
        <nav className="cmyk-breadcrumb">
          <Link to="/">{t.home}</Link>
          <ChevronRight />
          <Link to="/categories/$id" params={{ id: "design-print" }}>
            {t.category}
          </Link>
          <ChevronRight />
          <span>RGB → CMYK</span>
        </nav>
        <div className="cmyk-actions">
          <button onClick={() => setFav(toggleFavorite("cmyk-convert"))}>
            <Star className={fav ? "fill-current" : ""} />
            {t.favorite}
          </button>
          <button
            onClick={() =>
              void shareUrl(buildShareUrl("/tools/cmyk-convert", new URLSearchParams()), t.title)
            }
          >
            <Share2 />
            {t.share}
          </button>
        </div>
      </div>
      <header className="cmyk-heading">
        <div className="cmyk-title">
          <ToolIcon tool={{ slug: "cmyk-convert", icon: "Droplets" }} size="hero" />
          <div>
            <h1>{t.title}</h1>
            <p>{t.subtitle}</p>
          </div>
        </div>
        <div className="cmyk-private">
          <Eye />
          <span>{t.privacy}</span>
        </div>
      </header>
      <main className="cmyk-workspace">
        <section className="cmyk-input surface-card">
          <div className="cmyk-section-title">
            <h2>{locale === "ru" ? `Введите цвет в ${mode}` : `Enter color in ${mode}`}</h2>
            <button
              onClick={() => {
                setRgb(START);
                setHexInput(hex(START));
              }}
            >
              <RotateCcw />
              {t.reset}
            </button>
          </div>
          <div className="cmyk-mode-tabs">
            {(["RGB", "HEX", "HSL"] as Mode[]).map((item) => (
              <button
                className={mode === item ? "active" : ""}
                key={item}
                onClick={() => setMode(item)}
              >
                {item}
              </button>
            ))}
          </div>
          {mode === "RGB" ? (
            <div className="cmyk-rgb-fields">
              {(["r", "g", "b"] as const).map((channel) => (
                <label key={channel}>
                  <span>
                    {channel.toUpperCase()}{" "}
                    {locale === "ru"
                      ? { r: "(Красный)", g: "(Зелёный)", b: "(Синий)" }[channel]
                      : ""}
                  </span>
                  <input
                    type="number"
                    min="0"
                    max="255"
                    value={rgb[channel]}
                    onChange={(e) => updateRgb(channel, Number(e.target.value))}
                  />
                  <input
                    className={`cmyk-range is-${channel}`}
                    type="range"
                    min="0"
                    max="255"
                    value={rgb[channel]}
                    onChange={(e) => updateRgb(channel, Number(e.target.value))}
                  />
                </label>
              ))}
            </div>
          ) : mode === "HEX" ? (
            <div className="cmyk-direct-hex">
              <label>
                {locale === "ru" ? "Шестнадцатеричный код (HEX)" : "Hexadecimal code (HEX)"}
              </label>
              <div>
                <input value={hexInput} onChange={(e) => commitHex(e.target.value)} />
                <label title="Pick a color">
                  <Pipette />
                  <input
                    type="color"
                    value={hex(rgb)}
                    onChange={(e) => commitHex(e.target.value)}
                  />
                </label>
              </div>
              <small>
                {locale === "ru"
                  ? "Поддерживаются 3- и 6-значные коды цвета."
                  : "Both 3- and 6-character color codes are supported."}
              </small>
            </div>
          ) : (
            <div className="cmyk-hsl-sliders">
              {(["h", "s", "l"] as const).map((part) => (
                <label key={part}>
                  <span>
                    {part.toUpperCase()} · {hslValues[part]}
                    {part === "h" ? "°" : "%"}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max={part === "h" ? 360 : 100}
                    value={hslValues[part]}
                    readOnly
                  />
                </label>
              ))}
            </div>
          )}
          <div className="cmyk-hex">
            <span>{t.hex}</span>
            <div>
              <input value={hex(rgb)} readOnly />
              <button onClick={() => void navigator.clipboard?.writeText(hex(rgb))}>
                <Copy />
              </button>
            </div>
          </div>
          <div className="cmyk-presets">
            <div>
              <b>{locale === "ru" ? "Быстрые цвета" : "Quick colors"}</b>
              <button
                onClick={() => {
                  setRgb(START);
                  setHexInput(hex(START));
                }}
              >
                {locale === "ru" ? "Очистить" : "Clear"}
              </button>
            </div>
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
            ].map((value) => (
              <button
                title={value}
                className={hex(rgb) === value ? "selected" : ""}
                key={value}
                style={{ background: value }}
                onClick={() => commitHex(value)}
              >
                {hex(rgb) === value ? <Check /> : null}
              </button>
            ))}
          </div>
        </section>
        <section className="cmyk-result surface-card">
          <div className="cmyk-section-title">
            <h2>{t.result}</h2>
            <button onClick={() => void copyResult()}>
              {copied ? <Check /> : <Copy />}
              {copied ? t.copied : t.copy}
            </button>
          </div>
          <div className="cmyk-paper">
            <button
              className={paper === "coated" ? "active" : ""}
              onClick={() => setPaper("coated")}
            >
              {t.coated}
            </button>
            <button
              className={paper === "uncoated" ? "active" : ""}
              onClick={() => setPaper("uncoated")}
            >
              {t.uncoated}
            </button>
          </div>
          <div className="cmyk-source-swatches">
            <div>
              <i style={{ background: hex(rgb) }} />
              <span>{locale === "ru" ? "RGB (экран)" : "RGB (screen)"}</span>
              <b>{hex(rgb)}</b>
              <small>
                rgb({rgb.r}, {rgb.g}, {rgb.b})
              </small>
            </div>
            <ChevronRight />
            <div>
              <i style={{ background: hex(print) }} />
              <span>{locale === "ru" ? "CMYK (печать)" : "CMYK (print)"}</span>
              <b>
                C: {values.c} M: {values.m} Y: {values.y} K: {values.k}
              </b>
              <small>
                {t.ink}: {coverage}%
              </small>
            </div>
          </div>
          <h3>{locale === "ru" ? "Значения CMYK" : "CMYK values"}</h3>
          <div className="cmyk-channel-cards">
            {[
              { label: "C", value: values.c, tone: "cyan" },
              { label: "M", value: values.m, tone: "magenta" },
              { label: "Y", value: values.y, tone: "yellow" },
              { label: "K", value: values.k, tone: "black" },
            ].map((channel) => (
              <div key={channel.label}>
                <span className={channel.tone}>{channel.label}</span>
                <b>{channel.value}%</b>
                <i>
                  <strong className={channel.tone} style={{ width: `${channel.value}%` }} />
                </i>
              </div>
            ))}
          </div>
          <div className="cmyk-pantone-result">
            <i style={{ background: matches[0].value }} />
            <div>
              <b>{matches[0].code}</b>
              <span>
                {matches[0].name} (ΔE {Math.max(0, 100 - matches[0].score)})
              </span>
            </div>
            <em>
              {matches[0].score}% {t.match}
            </em>
          </div>
          <div className="cmyk-copy-row">
            <button>
              {locale === "ru" ? "Проценты" : "Percentages"} <ChevronDown />
            </button>
            <button onClick={() => void copyResult()}>{copied ? <Check /> : <Copy />}</button>
            <button className="primary" onClick={() => void copyResult()}>
              {copied ? t.copied : locale === "ru" ? "Скопировать CMYK" : "Copy CMYK"}
            </button>
          </div>
          <button className="cmyk-print-export" onClick={exportSpec}>
            <Download />
            <span>
              <b>{locale === "ru" ? "Экспорт для печати" : "Export for print"}</b>
              <small>PDF A4 · SVG · EPS</small>
            </span>
            <em>{locale === "ru" ? "Скачать" : "Download"} →</em>
          </button>
        </section>
        <section className="cmyk-preview surface-card">
          <div className="cmyk-tabs">
            {(["preview", "comparison", "palette", "pantone", "export"] as Tab[]).map((key) => (
              <button key={key} className={tab === key ? "active" : ""} onClick={() => setTab(key)}>
                {key === "preview"
                  ? t.preview
                  : key === "comparison"
                    ? locale === "ru"
                      ? "Сравнение"
                      : "Compare"
                    : key === "palette"
                      ? t.palette
                      : key === "pantone"
                        ? t.pantone
                        : locale === "ru"
                          ? "Экспорт"
                          : "Export"}
              </button>
            ))}
          </div>
          {tab === "preview" ? (
            <div className="cmyk-compare">
              <div>
                <span>{t.screen}</span>
                <i style={{ background: hex(rgb) }} />
                <b>{hex(rgb)}</b>
              </div>
              <ChevronRight />
              <div>
                <span>{t.print}</span>
                <i style={{ background: hex(print) }} />
                <b>{hex(print)}</b>
              </div>
            </div>
          ) : tab === "comparison" ? (
            <div className="cmyk-comparison">
              <div style={{ background: hex(rgb) }}>
                <span>{t.screen}</span>
              </div>
              <div style={{ background: hex(print) }}>
                <span>{t.print}</span>
              </div>
              <p>
                {locale === "ru"
                  ? "Имитация показывает вероятную потерю насыщенности при печати."
                  : "The simulation shows potential saturation loss in print."}
              </p>
            </div>
          ) : tab === "palette" ? (
            <div className="cmyk-palette">
              <p>{t.more}</p>
              {colors.map((color) => (
                <button key={hex(color)} onClick={() => commitHex(hex(color))}>
                  <i style={{ background: hex(color) }} />
                  <b>{hex(color)}</b>
                </button>
              ))}
            </div>
          ) : tab === "pantone" ? (
            <div className="cmyk-pantone">
              {matches.map((match) => (
                <button key={match.code} onClick={() => commitHex(match.value)}>
                  <i style={{ background: match.value }} />
                  <div>
                    <b>{match.code}</b>
                    <span>{match.name}</span>
                  </div>
                  <em>
                    {match.score}% {t.match}
                  </em>
                </button>
              ))}
            </div>
          ) : (
            <div className="cmyk-export-options">
              <button onClick={exportSpec}>
                <FileText />
                <span>
                  <b>PDF {locale === "ru" ? "Спецификация" : "Specification"}</b>
                  <small>
                    {locale === "ru" ? "Карточка цвета для типографии" : "Color card for print"}
                  </small>
                </span>
              </button>
              <button onClick={exportSpec}>
                <Palette />
                <span>
                  <b>SVG</b>
                  <small>
                    {locale === "ru" ? "Векторный образец цвета" : "Vector color swatch"}
                  </small>
                </span>
              </button>
              <button onClick={exportSpec}>
                <Download />
                <span>
                  <b>EPS</b>
                  <small>{locale === "ru" ? "Для допечатной подготовки" : "For prepress"}</small>
                </span>
              </button>
            </div>
          )}
        </section>
      </main>
      <section className="cmyk-bottom">
        <article className="surface-card">
          <FileText />
          <div>
            <h2>{locale === "ru" ? "Как это работает?" : "How it works"}</h2>
            {[
              locale === "ru" ? "Введите цвет в RGB, HEX или HSL." : "Enter RGB, HEX or HSL.",
              locale === "ru"
                ? "Мы автоматически конвертируем его в CMYK."
                : "We convert it automatically to CMYK.",
              locale === "ru"
                ? "Используйте результат в макетах для печати."
                : "Use the result in print layouts.",
            ].map((line, index) => (
              <p className="cmyk-step" key={line}>
                <i>{index + 1}</i>
                {line}
              </p>
            ))}
          </div>
        </article>
        <article className="surface-card">
          <Lightbulb />
          <div>
            <h2>{locale === "ru" ? "Полезные советы" : "Useful tips"}</h2>
            {[
              locale === "ru" ? "Учитывайте тип бумаги." : "Consider the paper type.",
              locale === "ru"
                ? "Для насыщенных цветов используйте цветопробу."
                : "Use a proof for saturated colors.",
              locale === "ru" ? "Проверяйте покрытие краской." : "Check total ink coverage.",
            ].map((line) => (
              <p className="cmyk-step check" key={line}>
                <Check />
                {line}
              </p>
            ))}
          </div>
        </article>
        <article className="surface-card">
          <MessageSquare />
          <div>
            <h2>{locale === "ru" ? "Частые вопросы" : "Frequently asked questions"}</h2>
            {[
              locale === "ru"
                ? "Почему цвета RGB и CMYK отличаются?"
                : "Why do RGB and CMYK differ?",
              locale === "ru"
                ? "Можно ли получить точное совпадение?"
                : "Can I get an exact match?",
              locale === "ru"
                ? "Подходит ли инструмент для печати?"
                : "Is this tool suitable for print?",
            ].map((question, index) => (
              <button
                className="cmyk-faq"
                key={question}
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              >
                {question}
                <ChevronDown className={openFaq === index ? "open" : ""} />
                {openFaq === index ? (
                  <small>
                    {locale === "ru"
                      ? "Для критичных цветов закажите цветопробу на той же бумаге, что и тираж."
                      : "For critical colors, request a proof on the same paper as the production run."}
                  </small>
                ) : null}
              </button>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
