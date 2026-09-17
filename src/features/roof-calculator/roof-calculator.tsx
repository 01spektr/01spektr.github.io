import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowUpRight,
  Bookmark,
  Box,
  Calculator,
  Check,
  ChevronDown,
  ChevronRight,
  Download,
  FileText,
  History,
  House,
  Info,
  Layers,
  LockKeyhole,
  Printer,
  RotateCcw,
  Ruler,
  Share2,
  ShieldCheck,
  Star,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { ToolIcon } from "@/components/tool-icon";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { recordHistory } from "@/lib/tools/history";
import { buildShareUrl, shareUrl } from "@/lib/tools/share";
import { DEFAULTS, MATERIALS, ROOF_NAMES, fmt, type RoofInput, type RoofType } from "./model";
import { calculateGeometry, polygonArea } from "./geometry";
import { calculateMaterials } from "./materials";
import { estimate } from "./pricing";
import { validate } from "./validation";
import { deserialize, readProjects, serialize, writeProjects, type SavedRoof } from "./storage";
import { RoofView } from "./roof-view";
import "./roof-calculator.css";
type Tab = "result" | "drawing" | "materials" | "estimate";

const EN: Record<string, string> = {
  Главная: "Home",
  "Строительство и ремонт": "Construction & repair",
  "Калькулятор крыши": "Roof calculator",
  "ПЛАНИРУЙТЕ С УВЕРЕННОСТЬЮ": "PLAN WITH CONFIDENCE",
  "От размеров здания — к площади, материалам и смете.":
    "From building dimensions to area, materials and an estimate.",
  "В избранное": "Favorite",
  Поделиться: "Share",
  "Параметры крыши": "Roof settings",
  "Выберите крышу": "Choose a roof",
  Двускатная: "Gable",
  Вальмовая: "Hip",
  Односкатная: "Shed",
  Мансардная: "Mansard",
  "Размеры здания": "Building dimensions",
  "Длина здания · A": "Building length · A",
  "Ширина здания · B": "Building width · B",
  "Размеры по наружным стенам, без свесов.": "Outer wall dimensions, excluding overhangs.",
  "Геометрия крыши": "Roof geometry",
  "Способ расчёта": "Calculation method",
  "По углу наклона": "By pitch",
  "По высоте": "By height",
  "Симметричная ломаная крыша": "Symmetric mansard roof",
  "Верхний угол": "Upper pitch",
  "Угол наклона": "Roof pitch",
  "Высота над стенами · H": "Height above walls · H",
  "Рассчитывается автоматически": "Calculated automatically",
  "Нижний угол": "Lower pitch",
  "До излома по горизонтали": "Horizontal break distance",
  "От наружной стены внутрь здания": "From the outer wall inward",
  "Свес по периметру": "Perimeter overhang",
  "Карнизный свес": "Eave overhang",
  "Фронтонный свес": "Gable overhang",
  "У всех скатов одинаковый угол и общий уровень карниза.":
    "All slopes have the same pitch and eave level.",
  "Свесы измеряются по горизонтали. H — от верха стен.":
    "Overhangs are measured horizontally. H is above the wall top.",
  "Кровельный материал": "Roofing material",
  Материал: "Material",
  Металлочерепица: "Metal tile",
  Профнастил: "Profiled sheet",
  "Рабочая ширина листа": "Usable sheet width",
  "Длина листа": "Sheet length",
  "Нахлёст и запас": "Overlap and allowance",
  "Продольный нахлёст": "Lengthwise overlap",
  "Дополнительный запас": "Extra allowance",
  "Саморезов на м²": "Screws per m²",
  "Параметры материала — пример. Уточните их у поставщика.":
    "Material settings are examples. Confirm them with your supplier.",
  "Сбросить параметры": "Reset settings",
  "Показать расчёт": "Show calculation",
  "Результат обновляется при изменении параметров": "The result updates as you change settings.",
  Результат: "Result",
  Чертёж: "Drawing",
  Материалы: "Materials",
  Смета: "Estimate",
  Локально: "Local",
  "Проверьте параметры": "Check the settings",
  "Исправьте отмеченные поля — и здесь появится расчёт.":
    "Correct the highlighted fields to see the calculation.",
  "Повернуть схему": "Rotate drawing",
  крыша: "roof",
  "Площадь крыши": "Roof area",
  "Со свесами": "With overhangs",
  "Длина двух частей ската": "Two-part slope length",
  "Длина ската": "Slope length",
  "Проекция со свесами": "Projection with overhangs",
  "Длина конька": "Ridge length",
  "Что понадобится": "Materials needed",
  "С запасом": "Including",
  "Кровельные листы": "Roofing sheets",
  "Конёк и рёбра": "Ridge and hips",
  Саморезы: "Screws",
  "в запас": "allowance",
  "Планки 2 м, нахлёст 0,1 м": "2 m trims, 0.1 m overlap",
  "шт.": "pcs",
  лист: "sheet",
  полос: "strips",
  листов: "sheets",
  "Площадь покрытия с запасом:": "Coverage area with allowance:",
  "Условная площадь заказанных листов по рабочей ширине:":
    "Indicative ordered-sheet area by usable width:",
  "Предварительная смета": "Preliminary estimate",
  "Введите цены вашего поставщика. Нулевые цены не означают бесплатные материалы.":
    "Enter your supplier prices. Zero prices do not mean the materials are free.",
  "Цена за единицу": "Unit price",
  "Итого по введённым ценам": "Total at entered prices",
  "Скачать смету CSV": "Download estimate CSV",
  "Сохранить расчёт": "Save calculation",
  Печать: "Print",
  "Мои расчёты": "My calculations",
  "Только на этом устройстве": "Only on this device",
  "Сохраните первый расчёт, чтобы вернуться к нему позже.":
    "Save your first calculation to return to it later.",
  "Как пользоваться": "How to use",
  "Как мы считаем": "How we calculate",
  "Частые вопросы": "Frequently asked questions",
  "Конёк и вальмовые планки, 2 м": "Ridge and hip trims, 2 m",
  "Кровельные саморезы": "Roofing screws",
  "Выберите тип крыши и размеры здания.": "Choose the roof type and building dimensions.",
  "Задайте угол или высоту и свесы.": "Set the pitch or height and overhangs.",
  "Уточните размеры листа и нахлёст.": "Confirm sheet dimensions and overlap.",
  "Проверьте материалы и введите цены.": "Check the materials and enter prices.",
  "Площадь — сумма площадей скатов. Для двускатной крыши:":
    "Area is the sum of slope areas. For a gable roof:",
  "Это точная смета?": "Is this an exact estimate?",
  "Что сохраняется по ссылке?": "What is saved in the link?",
  "Куда отправляются данные?": "Where does the data go?",
};
export function RoofCalculatorPage() {
  const { locale } = useI18n();
  const tr = (value: string) => (locale === "en" ? (EN[value] ?? value) : value);
  const f = (value: number, digits = 2) =>
    new Intl.NumberFormat(locale === "en" ? "en-US" : "ru-RU", {
      maximumFractionDigits: digits,
    }).format(value);
  const [input, setInput] = useState<RoofInput>({ ...DEFAULTS });
  const [tab, setTab] = useState<Tab>("result");
  const [flat, setFlat] = useState(false);
  const [rotate, setRotate] = useState(false);
  const [saved, setSaved] = useState<SavedRoof[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const resultRef = useRef<HTMLElement>(null);
  useEffect(() => {
    setSaved(readProjects());
    const params = new URLSearchParams(location.search);
    const restored = deserialize(params);
    if (restored) setInput(restored);
    else if (params.has("type")) toast.error("В ссылке некорректные параметры. Загружен пример.");
  }, []);
  const errors = validate(input),
    valid = Object.keys(errors).length === 0;
  const result = useMemo(() => {
    if (Object.keys(validate(input)).some((k) => !k.endsWith("Price"))) return null;
    const g = calculateGeometry(input),
      m = calculateMaterials(input, g);
    return { g, m, rows: estimate(input, m) };
  }, [input]);
  const patch = (p: Partial<RoofInput>) => setInput((i) => ({ ...i, ...p }));
  const update = (k: keyof RoofInput, value: number) => patch({ [k]: value });
  function field(
    key: keyof RoofInput,
    label: string,
    unit = locale === "en" ? "m" : "м",
    hint?: string,
  ) {
    return (
      <label className="rc-field" key={key}>
        <span>{label}</span>
        <div>
          <input
            type="number"
            inputMode="decimal"
            step="any"
            value={Number.isFinite(input[key]) ? String(input[key]) : ""}
            onChange={(e) => update(key, e.target.value === "" ? NaN : Number(e.target.value))}
            aria-invalid={!!errors[key]}
            aria-describedby={errors[key] ? `roof-error-${key}` : undefined}
          />
          <span>{unit}</span>
        </div>
        {errors[key] ? (
          <small className="rc-error" id={`roof-error-${key}`}>
            {errors[key]}
          </small>
        ) : hint ? (
          <small>{hint}</small>
        ) : null}
      </label>
    );
  }
  function changeType(type: RoofType) {
    patch({
      type,
      mode: type === "mansard" ? "angle" : input.mode,
      breakRun: Math.min(input.breakRun, input.width / 2 - 0.1),
    });
  }
  function save(favorite = false) {
    if (!result || !valid) return;
    const project: SavedRoof = {
      id: crypto.randomUUID(),
      at: Date.now(),
      input: { ...input },
      area: result.g.area,
      favorite,
    };
    const next = [project, ...saved].slice(0, 30);
    try {
      writeProjects(next);
      setSaved(next);
      recordHistory({
        toolId: "roof-calculator",
        title: `${tr(ROOF_NAMES[input.type])} · ${f(result.g.area)} м²`,
        params: serialize(input),
      });
      toast.success(
        favorite ? "Расчёт добавлен в избранное" : "Расчёт сохранён на этом устройстве",
      );
    } catch {
      toast.error("Браузер не разрешил сохранить данные. Можно скопировать ссылку.");
    }
  }
  async function share() {
    if (!valid) return;
    const status = await shareUrl(
      buildShareUrl("/tools/roof-calculator", new URLSearchParams(serialize(input))),
      "Расчёт крыши · Toolboxi",
    );
    if (status === "copied") toast.success("Ссылка на этот расчёт скопирована");
    if (status === "failed") toast.error("Не удалось поделиться ссылкой");
  }
  function changeSaved(next: SavedRoof[]) {
    try {
      writeProjects(next);
      setSaved(next);
    } catch {
      toast.error("Не удалось изменить сохранённые расчёты");
    }
  }
  function download() {
    if (!result || !valid) return;
    const rows = [
      [`${tr("Смета")} · Toolboxi.uz`],
      [tr(ROOF_NAMES[input.type]), `${f(input.length)} × ${f(input.width)} m`],
      [tr("Площадь крыши"), f(result.g.area), "m²"],
      [
        tr("Материал"),
        locale === "en" ? "Quantity" : "Количество",
        locale === "en" ? "Unit" : "Ед.",
        locale === "en" ? "Unit price, USD" : "Цена за единицу, USD",
        locale === "en" ? "Total, USD" : "Стоимость, USD",
      ],
      ...result.rows.map((r) => [r.name, r.quantity, r.unit, r.price, r.total]),
      [locale === "en" ? "Total" : "Итого", result.rows.reduce((s, r) => s + r.total, 0)],
      [
        locale === "en"
          ? "Excludes labor, delivery, drainage and structural work"
          : "Без работ, доставки, водостока и несущих конструкций",
      ],
    ];
    const csv =
      "\uFEFF" +
      rows
        .map((row) => row.map((v) => '"' + String(v).replaceAll('"', '""') + '"').join(";"))
        .join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "Toolboxi-смета-кровли.csv";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <div className="roof-shell">
      <div className="rc-app">
        <nav className="rc-breadcrumb" aria-label="Навигация">
          <Link to="/">
            <House size={15} />
            {tr("Главная")}
          </Link>
          <ChevronRight />
          <Link to="/categories/$id" params={{ id: "construction" }}>
            {tr("Строительство и ремонт")}
          </Link>
          <ChevronRight />
          <span>{tr("Калькулятор крыши")}</span>
        </nav>
        <header className="rc-heading">
          <ToolIcon
            tool={{ slug: "roof-calculator", icon: "House" }}
            size="hero"
            className="rc-heading-icon"
          />
          <div>
            <div className="rc-eyebrow">{tr("ПЛАНИРУЙТЕ С УВЕРЕННОСТЬЮ")}</div>
            <h1>{tr("Калькулятор крыши")}</h1>
            <p>{tr("От размеров здания — к площади, материалам и смете.")}</p>
          </div>
          <div className="rc-heading-actions">
            <Button variant="outline" disabled={!valid} onClick={() => save(true)}>
              <Star />
              {tr("В избранное")}
            </Button>
            <Button variant="outline" disabled={!valid} onClick={share}>
              <Share2 />
              {tr("Поделиться")}
            </Button>
          </div>
        </header>
        <div className="rc-workspace">
          <section className="rc-form rc-card" aria-label={tr("Параметры крыши")}>
            <Step n="01" title={tr("Выберите крышу")}>
              <div className="rc-roof-types">
                {(Object.keys(ROOF_NAMES) as RoofType[]).map((type) => (
                  <button
                    key={type}
                    className={input.type === type ? "selected" : ""}
                    aria-pressed={input.type === type}
                    onClick={() => changeType(type)}
                  >
                    <RoofIcon type={type} />
                    <span>{tr(ROOF_NAMES[type])}</span>
                    {input.type === type && <Check className="rc-selected-check" />}
                  </button>
                ))}
              </div>
            </Step>
            <Step n="02" title={tr("Размеры здания")}>
              <div className="rc-fields">
                {field("length", tr("Длина здания · A"))}
                {field("width", tr("Ширина здания · B"))}
              </div>
              <p className="rc-help">{tr("Размеры по наружным стенам, без свесов.")}</p>
            </Step>
            <Step n="03" title={tr("Геометрия крыши")}>
              <div className="rc-mode" aria-label={tr("Способ расчёта")}>
                {input.type !== "mansard" ? (
                  <>
                    <button
                      aria-pressed={input.mode === "angle"}
                      className={input.mode === "angle" ? "selected" : ""}
                      onClick={() => patch({ mode: "angle", angle: result?.g.angle ?? 30 })}
                    >
                      {tr("По углу наклона")}
                    </button>
                    <button
                      aria-pressed={input.mode === "height"}
                      className={input.mode === "height" ? "selected" : ""}
                      onClick={() => patch({ mode: "height", height: result?.g.height ?? 2 })}
                    >
                      {tr("По высоте")}
                    </button>
                  </>
                ) : (
                  <span>{tr("Симметричная ломаная крыша")}</span>
                )}
              </div>
              <div className="rc-fields">
                {input.mode === "angle" || input.type === "mansard"
                  ? field(
                      "angle",
                      tr(input.type === "mansard" ? "Верхний угол" : "Угол наклона"),
                      "°",
                    )
                  : field("height", tr("Высота над стенами · H"))}
                <div className="rc-derived">
                  <span>
                    {tr(input.mode === "angle" ? "Высота над стенами · H" : "Угол наклона")}
                  </span>
                  <b>
                    {result
                      ? `${f(input.mode === "angle" ? result.g.height : result.g.angle)} ${input.mode === "angle" ? "m" : "°"}`
                      : "—"}
                  </b>
                  <small>{tr("Рассчитывается автоматически")}</small>
                </div>
              </div>
              {input.type === "mansard" && (
                <div className="rc-fields rc-extra-row">
                  {field("lowerAngle", tr("Нижний угол"), "°")}
                  {field(
                    "breakRun",
                    tr("До излома по горизонтали"),
                    "m",
                    tr("От наружной стены внутрь здания"),
                  )}
                </div>
              )}
              <div className="rc-fields rc-extra-row">
                {field("eaves", tr(input.type === "hip" ? "Свес по периметру" : "Карнизный свес"))}
                {input.type !== "hip" ? (
                  field("gable", tr("Фронтонный свес"))
                ) : (
                  <div className="rc-inline-note">
                    <Info />
                    {tr("У всех скатов одинаковый угол и общий уровень карниза.")}
                  </div>
                )}
              </div>
              <p className="rc-help">
                <Info />
                {tr("Свесы измеряются по горизонтали. H — от верха стен.")}
              </p>
            </Step>
            <Step n="04" title={tr("Кровельный материал")}>
              <label className="rc-material-label">
                {tr("Материал")}
                <select
                  value={input.material}
                  onChange={(e) => {
                    const material = e.target.value as RoofInput["material"];
                    const m = MATERIALS[material];
                    patch({
                      material,
                      sheetWidth: m.sheetWidth,
                      sheetLength: m.sheetLength,
                      overlap: m.overlap,
                      screws: m.screws,
                    });
                  }}
                >
                  {Object.entries(MATERIALS).map(([id, m]) => (
                    <option key={id} value={id}>
                      {tr(m.name)}
                    </option>
                  ))}
                </select>
              </label>
              <div className="rc-fields rc-extra-row">
                {field("sheetWidth", tr("Рабочая ширина листа"), "m")}
                {field("sheetLength", tr("Длина листа"), "m")}
              </div>
              <details className="rc-advanced">
                <summary>
                  {tr("Нахлёст и запас")}
                  <ChevronDown />
                </summary>
                <div className="rc-fields">
                  {field("overlap", tr("Продольный нахлёст"), "m")}
                  {field("waste", tr("Дополнительный запас"), "%")}
                  {field("screws", tr("Саморезов на м²"), locale === "en" ? "pcs" : "шт.")}
                </div>
                <p className="rc-help">
                  {tr("Параметры материала — пример. Уточните их у поставщика.")}
                </p>
              </details>
            </Step>
            <div className="rc-form-footer">
              <Button
                variant="outline"
                aria-label={tr("Сбросить параметры")}
                onClick={() => setInput({ ...DEFAULTS })}
              >
                <RotateCcw />
              </Button>
              <Button
                disabled={!valid}
                onClick={() => {
                  setTab("result");
                  resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                <Calculator />
                {tr("Показать расчёт")}
                <ArrowDown />
              </Button>
            </div>
            <p className="rc-live">
              <span />
              {tr("Результат обновляется при изменении параметров")}
            </p>
          </section>
          <section
            className="rc-result rc-card"
            ref={resultRef}
            aria-label={locale === "en" ? "Calculation results" : "Результаты расчёта"}
          >
            <div className="rc-result-top">
              <div
                className="rc-tabs"
                role="tablist"
                aria-label={locale === "en" ? "Results" : "Результаты"}
              >
                {(
                  [
                    ["result", tr("Результат")],
                    ["drawing", tr("Чертёж")],
                    ["materials", tr("Материалы")],
                    ["estimate", tr("Смета")],
                  ] as [Tab, string][]
                ).map(([id, label]) => (
                  <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)}>
                    {label}
                  </button>
                ))}
              </div>
              <span className="rc-local">
                <LockKeyhole />
                {tr("Локально")}
              </span>
            </div>
            {!result ? (
              <div className="rc-invalid" role="status">
                <Info />
                <h2>{tr("Проверьте параметры")}</h2>
                <p>{tr("Исправьте отмеченные поля — и здесь появится расчёт.")}</p>
              </div>
            ) : (
              <>
                <div
                  role="tabpanel"
                  aria-label={
                    {
                      result: "Результат",
                      drawing: "Чертёж",
                      materials: "Материалы",
                      estimate: "Смета",
                    }[tab]
                  }
                >
                  {(tab === "result" || tab === "drawing") && (
                    <>
                      <div className="rc-preview-toolbar">
                        <span>
                          <span className="rc-status-dot" />
                          {tr(ROOF_NAMES[input.type])} {tr("крыша")}
                        </span>
                        <div>
                          <button
                            title={tr("Повернуть схему")}
                            aria-label={tr("Повернуть схему")}
                            onClick={() => setRotate(!rotate)}
                          >
                            <RotateCcw size={15} />
                          </button>
                          <button
                            className={!flat && tab !== "drawing" ? "selected" : ""}
                            onClick={() => {
                              setFlat(false);
                              setTab("result");
                            }}
                          >
                            3D
                          </button>
                          <button
                            className={flat || tab === "drawing" ? "selected" : ""}
                            onClick={() => setFlat(true)}
                          >
                            2D
                          </button>
                        </div>
                      </div>
                      <div className="rc-visual">
                        <RoofView
                          input={input}
                          geometry={result.g}
                          flat={flat || tab === "drawing"}
                          rotate={rotate}
                        />
                      </div>
                      <div className="rc-total-area">
                        <div className="rc-total-icon">
                          <Box />
                        </div>
                        <div>
                          <span>{tr("Площадь крыши")}</span>
                          <strong>
                            {f(result.g.area)} <small>m²</small>
                          </strong>
                        </div>
                        <span className="rc-included">
                          <Check />
                          {tr("Со свесами")}
                        </span>
                      </div>
                      <div className="rc-metrics">
                        <Metric
                          label={tr(
                            input.type === "mansard" ? "Длина двух частей ската" : "Длина ската",
                          )}
                          value={`${f(result.g.slope)} m`}
                        />
                        <Metric
                          label={tr("Проекция со свесами")}
                          value={`${f(result.g.projection)} m²`}
                        />
                        <Metric label={tr("Длина конька")} value={`${f(result.g.ridge)} m`} />
                      </div>
                      {tab === "drawing" && (
                        <div className="rc-panel-list">
                          {result.g.panels.map((p) => (
                            <div key={p.name}>
                              <span>{p.name}</span>
                              <b>{f(polygonArea(p.points))} m²</b>
                            </div>
                          ))}
                          <p>
                            Контур строится по введённым размерам. Это геометрическая схема, не
                            расчёт несущей способности.
                          </p>
                        </div>
                      )}
                    </>
                  )}
                  {(tab === "result" || tab === "materials") && (
                    <div className="rc-material-results">
                      <div className="rc-section-title">
                        <h2>{tr("Что понадобится")}</h2>
                        <span>
                          {tr("С запасом")} {input.waste}%
                        </span>
                      </div>
                      <div className="rc-material-grid">
                        <Material
                          icon={<Layers />}
                          title={tr("Кровельные листы")}
                          value={`${result.m.sheets} ${tr("шт.")}`}
                          note={`${result.m.baseSheets} + ${result.m.reserve} ${tr("в запас")}`}
                        />
                        <Material
                          icon={<Ruler />}
                          title={tr("Конёк и рёбра")}
                          value={`${result.m.ridgePieces + result.m.hipPieces} ${tr("шт.")}`}
                          note={tr("Планки 2 м, нахлёст 0,1 м")}
                        />
                        <Material
                          icon={<Box />}
                          title={tr("Саморезы")}
                          value={`${result.m.screws} ${tr("шт.")}`}
                          note={`${input.screws} ${locale === "en" ? "pcs/m² + allowance" : "шт./м² + запас"}`}
                        />
                      </div>
                      {tab === "materials" && (
                        <>
                          <div className="rc-panel-list">
                            {result.m.layout.map((p) => (
                              <div key={p.name}>
                                <span>
                                  {p.name} · {p.columns} полос
                                </span>
                                <b>{p.sheets} листов</b>
                              </div>
                            ))}
                          </div>
                          <p className="rc-help">
                            Каждая полоса покрывается целыми листами по её максимальной длине.
                            Обрезки между скатами не используются повторно. Для вальм итог
                            консервативный, без оптимизации раскроя.
                          </p>
                          <p className="rc-help">
                            {tr("Площадь покрытия с запасом:")} {f(result.m.materialArea)} m².{" "}
                            {tr("Условная площадь заказанных листов по рабочей ширине:")}{" "}
                            {f(result.m.purchasedWorkingArea)} m².
                          </p>
                        </>
                      )}
                    </div>
                  )}
                  {tab === "estimate" && (
                    <div className="rc-estimate">
                      <div className="rc-section-title">
                        <h2>{tr("Предварительная смета")}</h2>
                        <span>USD · $</span>
                      </div>
                      <p>
                        {tr(
                          "Введите цены вашего поставщика. Нулевые цены не означают бесплатные материалы.",
                        )}
                      </p>
                      {result.rows.map((row) => (
                        <div className="rc-price-row" key={row.key}>
                          <div>
                            <b>{tr(row.name)}</b>
                            <span>
                              {row.quantity} {tr(row.unit)}
                            </span>
                          </div>
                          {field(row.key, tr("Цена за единицу"), "$")}
                          <strong>${f(row.total, 0)}</strong>
                        </div>
                      ))}
                      <div className="rc-estimate-total">
                        <span>{tr("Итого по введённым ценам")}</span>
                        <b>
                          $
                          {f(
                            result.rows.reduce((s, r) => s + r.total, 0),
                            0,
                          )}
                          <small> USD</small>
                        </b>
                      </div>
                      <Button onClick={download} variant="outline">
                        <Download />
                        {tr("Скачать смету CSV")}
                      </Button>
                    </div>
                  )}
                </div>
                <div className="rc-notice">
                  <ShieldCheck />
                  <p>
                    <b>Геометрия и ориентировочный заказ материалов.</b> Без стропил, обрешётки,
                    утепления, водостока, работ и доставки.
                    {input.type === "mansard" ? " Планки излома также не включены." : ""}
                  </p>
                </div>
                <div className="rc-result-actions">
                  <Button onClick={() => save()}>
                    <Bookmark />
                    {tr("Сохранить расчёт")}
                  </Button>
                  <Button variant="outline" onClick={() => window.print()}>
                    <Printer />
                    {tr("Печать")}
                  </Button>
                </div>
              </>
            )}
          </section>
        </div>
        <section className="rc-saved rc-card">
          <button
            className="rc-saved-toggle"
            onClick={() => setHistoryOpen(!historyOpen)}
            aria-expanded={historyOpen}
          >
            <History />
            <span>
              {tr("Мои расчёты")} <small>{saved.length}</small>
            </span>
            <span className="rc-device-note">{tr("Только на этом устройстве")}</span>
            <ChevronDown />
          </button>
          {historyOpen && (
            <div className="rc-saved-list">
              {!saved.length ? (
                <p>{tr("Сохраните первый расчёт, чтобы вернуться к нему позже.")}</p>
              ) : (
                saved.map((p) => (
                  <div key={p.id}>
                    <button
                      onClick={() => {
                        setInput(p.input);
                        setTab("result");
                        toast.success("Параметры восстановлены");
                      }}
                    >
                      <b>
                        {tr(ROOF_NAMES[p.input.type])} · {f(p.area)} m²
                      </b>
                      <span>
                        {f(p.input.length)} × {f(p.input.width)} m ·{" "}
                        {new Date(p.at).toLocaleDateString(locale === "en" ? "en-US" : "ru-RU")}
                      </span>
                      <ArrowUpRight />
                    </button>
                    <button
                      aria-label={
                        p.favorite ? "Убрать расчёт из избранного" : "Добавить расчёт в избранное"
                      }
                      onClick={() =>
                        changeSaved(
                          saved.map((s) => (s.id === p.id ? { ...s, favorite: !s.favorite } : s)),
                        )
                      }
                    >
                      <Star fill={p.favorite ? "currentColor" : "none"} />
                    </button>
                    <button
                      aria-label="Удалить сохранённый расчёт"
                      onClick={() => changeSaved(saved.filter((s) => s.id !== p.id))}
                    >
                      <Trash2 />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </section>
        <section className="rc-guide">
          <article className="rc-card">
            <h2>
              <FileText />
              {tr("Как пользоваться")}
            </h2>
            <ol>
              <li>{tr("Выберите тип крыши и размеры здания.")}</li>
              <li>{tr("Задайте угол или высоту и свесы.")}</li>
              <li>{tr("Уточните размеры листа и нахлёст.")}</li>
              <li>{tr("Проверьте материалы и введите цены.")}</li>
            </ol>
          </article>
          <article className="rc-card">
            <h2>
              <Ruler />
              {tr("Как мы считаем")}
            </h2>
            <p>{tr("Площадь — сумма площадей скатов. Для двускатной крыши:")}</p>
            <code>S = 2 × (A + 2g) × (B/2 + e) / cos α</code>
            <p>e — карнизный свес, g — фронтонный. Промежуточные значения не округляются.</p>
          </article>
          <article className="rc-card">
            <h2>
              <Info />
              {tr("Частые вопросы")}
            </h2>
            <details>
              <summary>{tr("Это точная смета?")}</summary>
              <p>
                Это предварительная оценка по геометрии. Заказ и раскрой уточняются с поставщиком,
                несущие конструкции — с проектировщиком.
              </p>
            </details>
            <details>
              <summary>{tr("Что сохраняется по ссылке?")}</summary>
              <p>
                Размеры, тип крыши, параметры материала и ваши цены. Получатель увидит тот же
                расчёт.
              </p>
            </details>
            <details>
              <summary>{tr("Куда отправляются данные?")}</summary>
              <p>
                Вычисления выполняются в браузере. Сохранённые расчёты находятся на этом устройстве;
                ссылка передаёт параметры только когда вы ею делитесь.
              </p>
            </details>
          </article>
        </section>
      </div>
    </div>
  );
}
function Step({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <section className="rc-step">
      <h2>
        <span>{n}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}
function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span>{label}</span>
      <b>{value}</b>
    </div>
  );
}
function Material({
  icon,
  title,
  value,
  note,
}: {
  icon: ReactNode;
  title: string;
  value: string;
  note: string;
}) {
  return (
    <div>
      {icon}
      <span>{title}</span>
      <b>{value}</b>
      <small>{note}</small>
    </div>
  );
}
function RoofIcon({ type }: { type: RoofType }) {
  const outlines = {
    gable: "M8 30 L32 12 L56 30 M14 26 V47 H50 V26",
    hip: "M6 30 L23 13 H41 L58 30 Z M23 13 L18 30 M41 13 L47 30 M13 31 V47 H51 V31",
    shed: "M6 28 L57 13 M13 27 V47 H51 V16",
    mansard: "M6 32 L17 17 L32 9 L47 17 L58 32 M13 30 V47 H51 V30",
  };
  return (
    <svg viewBox="0 0 64 54" aria-hidden="true">
      <path
        d={outlines[type]}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
