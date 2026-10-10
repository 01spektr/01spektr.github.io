import React, { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Braces,
  Check,
  ChevronRight,
  Clipboard,
  Copy,
  Download,
  FileDown,
  FileText,
  Fingerprint,
  Hash,
  HelpCircle,
  Info,
  KeyRound,
  QrCode,
  RefreshCw,
  Sliders,
  Sparkles,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { isFavorite, subscribeFavorites, toggleFavorite } from "@/lib/tools/favorites";
import { recordHistory } from "@/lib/tools/history";
import { buildShareUrl, shareUrl } from "@/lib/tools/share";
import { useI18n } from "@/lib/i18n";
import { UuidHeroBanner } from "./components/HeroBanner";
import { UuidMetricsCards } from "./components/MetricsCards";
import "./uuid-generator.css";

type Format = "standard" | "compact";

function secureUuid() {
  if (typeof crypto === "undefined" || typeof crypto.randomUUID !== "function") {
    throw new Error("Secure UUID generation is not supported in this browser.");
  }
  return crypto.randomUUID();
}

function formatUuid(uuid: string, format: Format) {
  if (format === "compact") return uuid.replaceAll("-", "");
  return uuid;
}

export function UuidGeneratorPage() {
  const { locale, t } = useI18n();
  const tr = (ru: string, uz: string, en: string) =>
    locale === "ru" ? ru : locale === "uz" ? uz : en;

  const [amount, setAmount] = useState(1);
  const [format, setFormat] = useState<Format>("standard");
  const [uppercase, setUppercase] = useState(false);
  const [timestamp, setTimestamp] = useState(false);
  const [uuids, setUuids] = useState<string[]>([]);
  const [fav, setFav] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => setFav(isFavorite("uuid-generator"));
    sync();
    return subscribeFavorites(sync);
  }, []);

  useEffect(() => {
    try {
      setUuids([secureUuid()]);
    } catch {
      // Handled gracefully in UI
    }
  }, []);

  function generate() {
    const count = Math.min(100, Math.max(1, Number.isFinite(amount) ? Math.round(amount) : 1));
    try {
      const next = Array.from({ length: count }, () => {
        const uuid = formatUuid(secureUuid(), format);
        return uppercase ? uuid.toUpperCase() : uuid;
      });
      setUuids(next);
      setAmount(count);
      recordHistory({
        toolId: "uuid-generator",
        title: `UUID v4: ${count} ${tr("шт.", "dona", "items")}`,
        params: { amount: String(count), format, uppercase: String(uppercase) },
      });
      toast.success(
        count === 1
          ? tr("UUID успешно сгенерирован", "UUID muvaffaqiyatli yaratildi", "UUID created")
          : tr(`Сгенерировано UUID: ${count}`, `${count} ta UUID yaratildi`, `Created ${count} UUIDs`)
      );
    } catch {
      toast.error(
        tr(
          "В этом браузере недоступна безопасная генерация UUID.",
          "Ushbu brauzerda xavfsiz UUID yaratish qo'llab-quvvatlanmaydi.",
          "Secure UUID generation is unavailable in this browser."
        )
      );
    }
  }

  async function copyText(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey(null), 1500);
      toast.success(tr("Скопировано в буфер обмена", "Nusxa olindi", "Copied to clipboard"));
    } catch {
      toast.error(
        tr(
          "Не удалось скопировать. Выделите текст вручную.",
          "Nusxalab bo'lmadi. Matnni qo'lda tanlang.",
          "Could not copy. Select the text manually."
        )
      );
    }
  }

  function exportList(extension: "txt" | "csv") {
    if (!uuids.length) return;
    const createdAt = timestamp
      ? `${tr("Создано", "Yaratilgan", "Created")}: ${new Date().toLocaleString(
          locale === "ru" ? "ru-RU" : locale === "uz" ? "uz-UZ" : "en-US"
        )}\n`
      : "";
    const content =
      extension === "csv" ? `UUID\n${uuids.join("\n")}` : `${createdAt}${uuids.join("\n")}`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `toolbox-uuid-v4.${extension}`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success(tr(`Файл .${extension} скачан`, `.${extension} fayl yuklandi`, `.${extension} file downloaded`));
  }

  async function onShare() {
    const result = await shareUrl(
      buildShareUrl(locale === "en" ? "/en/tools/uuid-generator" : locale === "uz" ? "/uz/tools/uuid-generator" : "/tools/uuid-generator", new URLSearchParams()),
      tr("Генератор UUID", "UUID generatori", "UUID generator"),
    );
    if (result === "copied") toast.success(t("share.copied"));
    if (result === "failed") toast.error(t("share.failed"));
  }

  const current = uuids[0];

  return (
    <div className="w-full max-w-[1380px] mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6">
      {/* Hero standard banner */}
      <UuidHeroBanner
        fav={fav}
        onToggleFav={() => setFav(toggleFavorite("uuid-generator"))}
        onShare={onShare}
      />

      {/* Main 2-column layout matching loan-calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left column: Controls & Configuration */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs transition-colors">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-heading text-base font-bold text-slate-900 dark:text-slate-100">
                  {tr("Параметры генерации", "Generatsiya parametrlari", "Generation parameters")}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {tr("Версия, количество и формат", "Versiya, miqdor va format", "Version, quantity and format")}
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-5">
              {/* Version Selector */}
              <div>
                <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {tr("Версия UUID", "UUID versiyasi", "UUID version")}
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                  <button
                    type="button"
                    className="p-2.5 rounded-xl border border-violet-500 bg-violet-500/10 text-left transition-all ring-2 ring-violet-500/20"
                  >
                    <div className="font-bold text-xs text-violet-700 dark:text-violet-300">v4</div>
                    <div className="text-[10px] text-violet-600/80 dark:text-violet-400/80 mt-0.5 truncate">
                      {tr("Случайный", "Tasodifiy", "Random")}
                    </div>
                  </button>
                  <div className="p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-left opacity-60">
                    <div className="font-bold text-xs text-slate-700 dark:text-slate-300">v1</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                      {tr("Время + MAC", "Vaqtga asosiy", "Time-based")}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-left opacity-60">
                    <div className="font-bold text-xs text-slate-700 dark:text-slate-300">v3</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                      MD5 Hash
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-left opacity-60">
                    <div className="font-bold text-xs text-slate-700 dark:text-slate-300">v5</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                      SHA-1 Hash
                    </div>
                  </div>
                </div>
              </div>

              {/* Amount slider & input */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="amount-input" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {tr("Количество UUID", "UUID soni", "Number of UUIDs")}
                  </Label>
                  <span className="text-xs font-bold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/40 px-2 py-0.5 rounded-md border border-violet-200/60 dark:border-violet-800/40">
                    {amount} {tr("шт.", "dona", "items")}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Slider
                    value={[amount]}
                    onValueChange={(val) => setAmount(val[0])}
                    min={1}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <Input
                    id="amount-input"
                    type="number"
                    min={1}
                    max={100}
                    value={amount}
                    onChange={(e) => setAmount(Math.max(1, Math.min(100, Number(e.target.value) || 1)))}
                    className="w-16 h-8 text-center text-xs font-semibold"
                  />
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                  {tr("От 1 до 100 за один клик", "1 tadan 100 tagacha", "From 1 to 100 in one click")}
                </p>
              </div>

              {/* Output format */}
              <div>
                <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {tr("Формат вывода", "Chiqish formati", "Output format")}
                </Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setFormat("standard")}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      format === "standard"
                        ? "border-violet-500 bg-violet-500/10 text-violet-900 dark:text-violet-200 font-semibold ring-1 ring-violet-500/30"
                        : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <div className="text-xs font-medium">
                      {tr("Стандартный", "Standart", "Standard")}
                    </div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                      36 {tr("символов (с дефисами)", "belgi (chiziqlar bilan)", "characters with hyphens")}
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormat("compact")}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      format === "compact"
                        ? "border-violet-500 bg-violet-500/10 text-violet-900 dark:text-violet-200 font-semibold ring-1 ring-violet-500/30"
                        : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <div className="text-xs font-medium">
                      {tr("Компактный", "Ixcham", "Compact")}
                    </div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                      32 {tr("символа (без дефисов)", "belgi (chiziqsiz)", "characters without hyphens")}
                    </div>
                  </button>
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="uppercase-toggle" className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                      {tr("Верхний регистр (UPPERCASE)", "Katta harflar (UPPERCASE)", "Uppercase")}
                    </Label>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">
                      {tr("Например: 4F19B8...", "Masalan: 4F19B8...", "e.g. 4F19B8...")}
                    </p>
                  </div>
                  <Switch
                    id="uppercase-toggle"
                    checked={uppercase}
                    onCheckedChange={setUppercase}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="timestamp-toggle" className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                      {tr("Добавить дату и время в экспорт", "Eksportga sana va vaqtni qo'shish", "Include timestamp in export")}
                    </Label>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">
                      {tr("Заголовок с отметкой времени в TXT/CSV", "TXT/CSV da vaqt belgisi", "Timestamp header in export files")}
                    </p>
                  </div>
                  <Switch
                    id="timestamp-toggle"
                    checked={timestamp}
                    onCheckedChange={setTimestamp}
                  />
                </div>
              </div>

              {/* Generate button */}
              <Button
                size="lg"
                onClick={generate}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-6 rounded-xl shadow-md shadow-violet-500/20 flex items-center justify-center gap-2 text-sm transition-all"
              >
                <Fingerprint className="w-5 h-5" />
                <span>{tr("Сгенерировать UUID", "UUID yaratish", "Generate UUID")}</span>
              </Button>
            </div>
          </section>
        </div>

        {/* Right column: Results & Output */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Metrics summary cards */}
          <UuidMetricsCards
            count={uuids.length}
            format={format}
            uppercase={uppercase}
            currentUuid={current}
            onCopySingle={() => current && copyText(current, "current")}
            singleCopied={copiedKey === "current"}
          />

          {/* Primary Result Box */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs transition-colors">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-violet-500" />
                <h3 className="font-heading text-sm font-bold text-slate-900 dark:text-slate-100">
                  {tr("Основной результат", "Asosiy natija", "Primary result")}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {uuids.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setUuids([])}
                    className="h-7 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 gap-1 px-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{tr("Очистить", "Tozalash", "Clear")}</span>
                  </Button>
                )}
              </div>
            </div>

            <div className="mt-4">
              {current ? (
                <div className="relative group">
                  <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 font-mono text-sm sm:text-base md:text-lg font-bold text-slate-900 dark:text-slate-100 break-all select-all transition-all">
                    <span>{current}</span>
                    <Button
                      size="sm"
                      onClick={() => copyText(current, "current")}
                      className={`shrink-0 gap-1.5 transition-all ${
                        copiedKey === "current"
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                          : "bg-violet-600 hover:bg-violet-700 text-white"
                      }`}
                    >
                      {copiedKey === "current" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === "current" ? tr("Скопировано", "Nusxalandi", "Copied") : tr("Копировать", "Nusxalash", "Copy")}</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 dark:text-slate-500 text-xs">
                  {tr(
                    "Нажмите «Сгенерировать UUID», чтобы получить новый идентификатор",
                    "Yangi identifikator olish uchun «UUID yaratish» tugmasini bosing",
                    "Click “Generate UUID” to get a new identifier"
                  )}
                </div>
              )}

              {/* Action buttons bar */}
              {uuids.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyText(uuids.join("\n"), "all")}
                    className="h-8 text-xs font-semibold gap-1.5"
                  >
                    {copiedKey === "all" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Clipboard className="w-3.5 h-3.5" />}
                    <span>{tr(`Скопировать все (${uuids.length})`, `Hammasini nusxalash (${uuids.length})`, `Copy all (${uuids.length})`)}</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportList("txt")}
                    className="h-8 text-xs font-semibold gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>TXT</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportList("csv")}
                    className="h-8 text-xs font-semibold gap-1.5"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    <span>CSV</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={generate}
                    className="h-8 text-xs font-semibold gap-1.5 ml-auto text-violet-600 dark:text-violet-400"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{tr("Ещё раз", "Yana bir bor", "Regenerate")}</span>
                  </Button>
                </div>
              )}
            </div>

            {/* List of all generated UUIDs */}
            {uuids.length > 1 && (
              <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {tr("Все сгенерированные UUID", "Barcha yaratilgan UUIDlar", "All generated UUIDs")} ({uuids.length})
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    {tr("Кликните для копирования", "Nusxalash uchun bosing", "Click to copy")}
                  </span>
                </div>

                <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1">
                  {uuids.map((uuid, idx) => (
                    <div
                      key={`${uuid}-${idx}`}
                      className="group flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-slate-50/70 dark:bg-slate-950/40 hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-slate-150 dark:border-slate-800/60 transition-colors"
                    >
                      <span className="text-[11px] font-mono text-slate-400 w-6 text-right shrink-0">
                        {idx + 1}.
                      </span>
                      <code
                        onClick={() => copyText(uuid, `row-${idx}`)}
                        className="font-mono text-xs text-slate-800 dark:text-slate-200 select-all cursor-pointer flex-1 truncate"
                        title={uuid}
                      >
                        {uuid}
                      </code>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => copyText(uuid, `row-${idx}`)}
                          className="h-7 w-7 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                          title={tr("Копировать", "Nusxalash", "Copy")}
                        >
                          {copiedKey === `row-${idx}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setUuids((prev) => prev.filter((_, i) => i !== idx))}
                          className="h-7 w-7 text-slate-400 hover:text-rose-500"
                          title={tr("Удалить", "O'chirish", "Delete")}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Bottom informational cards grid */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Info Card */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-colors flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Info className="w-4 h-4" />
              </div>
              <h3 className="font-heading text-sm font-bold text-slate-900 dark:text-slate-100">
                {tr("Что такое UUID v4?", "UUID v4 nima?", "What is UUID v4?")}
              </h3>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              {tr(
                "UUID (Universally Unique Identifier) версии 4 генерируется на основе 122 случайных бит. Вероятность дублирования практически равна нулю: для получения одной коллизии потребуется создавать миллиарды UUID в секунду на протяжении сотен лет.",
                "UUID 4-versiyasi 122 ta tasodifiy bit asosida yaratiladi. Bir xil chiqish ehtimoli deyarli nolga teng.",
                "UUID version 4 is generated using 122 cryptographically random bits according to RFC 4122. The chance of generating a duplicate is practically zero."
              )}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-medium text-violet-600 dark:text-violet-400 flex items-center gap-1">
              RFC 4122 Standard <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </section>

        {/* Use Cases Card */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-colors flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Braces className="w-4 h-4" />
              </div>
              <h3 className="font-heading text-sm font-bold text-slate-900 dark:text-slate-100">
                {tr("Области применения", "Qo'llash sohalari", "Common use cases")}
              </h3>
            </div>
            <ul className="mt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {tr("Первичные ключи в PostgreSQL, MySQL, MongoDB", "PostgreSQL, MySQL va MongoDB da kalitlar", "Primary keys in databases")}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {tr("Идентификаторы сессий, токенов и транзакций", "Sessiyalar, tokenlar va tranzaksiya ID lari", "Session IDs and authentication tokens")}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {tr("Микросервисы, распределённые REST API", "Mikroservislar va REST API tizimlari", "Microservices and distributed systems")}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {tr("Уникальные имена загружаемых файлов в S3/CDN", "S3/CDN ga yuklanuvchi fayl nomlari", "Unique file names in object storage")}
              </li>
            </ul>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              128-bit Distributed ID <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </section>

        {/* Related Tools Card */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-colors flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Hash className="w-4 h-4" />
                </div>
                <h3 className="font-heading text-sm font-bold text-slate-900 dark:text-slate-100">
                  {tr("Похожие инструменты", "O'xshash vositalar", "Related tools")}
                </h3>
              </div>
              <Link
                to="/categories/$id"
                params={{ id: "developers" }}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5"
              >
                {tr("Все", "Barchasi", "All")} <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link
                to="/tools/$slug"
                params={{ slug: "qr-generator" }}
                className="p-2.5 rounded-xl border border-slate-200/70 dark:border-slate-800 hover:border-violet-300 dark:hover:border-violet-700 bg-slate-50/50 dark:bg-slate-800/40 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-violet-500" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-violet-600 transition-colors">
                    QR-код
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 truncate">
                  {tr("Ссылки, текст, Wi-Fi", "Havolalar, matn, Wi-Fi", "Links, text, Wi-Fi")}
                </p>
              </Link>

              <Link
                to="/tools/$slug"
                params={{ slug: "barcode-generator" }}
                className="p-2.5 rounded-xl border border-slate-200/70 dark:border-slate-800 hover:border-violet-300 dark:hover:border-violet-700 bg-slate-50/50 dark:bg-slate-800/40 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 transition-colors">
                    Штрихкод
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 truncate">
                  {tr("EAN-13, CODE128", "EAN-13, CODE128", "EAN-13, CODE128")}
                </p>
              </Link>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] text-slate-400">
              {tr("Клиентские утилиты Toolboxi", "Toolboxi mijoz utilitalari", "Toolboxi developer utilities")}
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
