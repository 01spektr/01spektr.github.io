import React, { type ChangeEvent, type DragEvent, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Barcode,
  Check,
  ChevronRight,
  Download,
  FileImage,
  Image as ImageIcon,
  Info,
  Lock,
  Maximize2,
  Minimize2,
  Palette,
  QrCode,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Trash2,
  Unlock,
  UploadCloud,
  Zap,
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
import type { Locale } from "@/lib/i18n/config";
import { ImageHeroBanner } from "./components/HeroBanner";
import { ImageMetricsCards } from "./components/MetricsCards";
import "./image-resize.css";

type OutputFormat = "image/jpeg" | "image/png" | "image/webp" | "image/avif";

const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_FILE_SIZE = 25 * 1024 * 1024;
const FORMAT_OPTIONS: { type: OutputFormat; label: string; accent: string }[] = [
  { type: "image/webp", label: "WebP", accent: "#8B5CF6" },
  { type: "image/jpeg", label: "JPG", accent: "#F97316" },
  { type: "image/png", label: "PNG", accent: "#3B82F6" },
  { type: "image/avif", label: "AVIF", accent: "#10B981" },
];

function formatBytes(value: number, locale: Locale) {
  const kb = locale === "en" ? "KB" : locale === "uz" ? "KB" : "КБ";
  const mb = locale === "en" ? "MB" : locale === "uz" ? "MB" : "МБ";
  if (!value) return `0 ${kb}`;
  return value >= 1024 * 1024
    ? `${(value / (1024 * 1024)).toFixed(value >= 10 * 1024 * 1024 ? 0 : 1)} ${mb}`
    : `${Math.max(1, Math.round(value / 1024))} ${kb}`;
}

function extensionFor(type: OutputFormat) {
  return type === "image/jpeg" ? "jpg" : type.replace("image/", "");
}

function loadImage(src: string, errorMessage = "Не удалось прочитать изображение.") {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(errorMessage));
    image.src = src;
  });
}

export function ImageResizePage() {
  const { locale, t } = useI18n();
  const tr = (ru: string, uz: string, en: string) =>
    locale === "ru" ? ru : locale === "uz" ? uz : en;

  const bytes = (value: number) => formatBytes(value, locale);
  const fileInput = useRef<HTMLInputElement>(null);
  const sourceObjectUrl = useRef<string | null>(null);
  const resultObjectUrl = useRef<string | null>(null);

  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [sourceSize, setSourceSize] = useState({ width: 0, height: 0, bytes: 0 });
  const [resultSize, setResultSize] = useState(0);
  const [width, setWidth] = useState(1200);
  const [height, setHeight] = useState(800);
  const [ratio, setRatio] = useState(1.5);
  const [keepRatio, setKeepRatio] = useState(true);
  const [format, setFormat] = useState<OutputFormat>("image/webp");
  const [quality, setQuality] = useState(80);
  const [previewMode, setPreviewMode] = useState<"compare" | "source" | "result">("compare");
  const [isProcessing, setIsProcessing] = useState(false);
  const [fav, setFav] = useState(false);

  useEffect(() => {
    const sync = () => setFav(isFavorite("image-resize"));
    sync();
    return subscribeFavorites(sync);
  }, []);

  useEffect(
    () => () => {
      if (sourceObjectUrl.current) URL.revokeObjectURL(sourceObjectUrl.current);
      if (resultObjectUrl.current) URL.revokeObjectURL(resultObjectUrl.current);
    },
    [],
  );

  async function acceptFile(file?: File) {
    if (!file) return;
    if (!ACCEPTED_TYPES.has(file.type)) {
      toast.error(tr("Поддерживаются JPG, PNG и WebP.", "JPG, PNG va WebP formatlari qo'llab-quvvatlanadi.", "Only JPG, PNG and WebP are supported."));
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error(tr("Размер файла не должен превышать 25 МБ.", "Fayl hajmi 25 MB dan oshmasligi kerak.", "File size must not exceed 25 MB."));
      return;
    }
    const url = URL.createObjectURL(file);
    try {
      const image = await loadImage(url, tr("Не удалось прочитать изображение.", "Rasmni o'qib bo'lmadi.", "Failed to load image."));
      if (sourceObjectUrl.current) URL.revokeObjectURL(sourceObjectUrl.current);
      if (resultObjectUrl.current) URL.revokeObjectURL(resultObjectUrl.current);
      sourceObjectUrl.current = url;
      resultObjectUrl.current = null;
      setSourceFile(file);
      setSourceUrl(url);
      setResultUrl(null);
      setResultSize(0);
      setSourceSize({ width: image.naturalWidth, height: image.naturalHeight, bytes: file.size });
      setWidth(image.naturalWidth);
      setHeight(image.naturalHeight);
      setRatio(image.naturalWidth / image.naturalHeight);
      toast.success(tr("Изображение загружено", "Rasm yuklandi", "Image loaded"));
    } catch {
      URL.revokeObjectURL(url);
      toast.error(tr("Не удалось открыть изображение.", "Rasmni ochib bo'lmadi.", "Failed to open image."));
    }
  }

  function changeWidth(next: number) {
    const safe = Math.max(1, Math.min(10000, next || 1));
    setWidth(safe);
    if (keepRatio && ratio) setHeight(Math.max(1, Math.round(safe / ratio)));
  }

  function changeHeight(next: number) {
    const safe = Math.max(1, Math.min(10000, next || 1));
    setHeight(safe);
    if (keepRatio && ratio) setWidth(Math.max(1, Math.round(safe * ratio)));
  }

  function applyPresetRatio(multiplier: number) {
    if (!sourceSize.width) return;
    const nextW = Math.round(sourceSize.width * multiplier);
    const nextH = Math.round(sourceSize.height * multiplier);
    setWidth(nextW);
    setHeight(nextH);
  }

  async function processImage() {
    if (!sourceUrl || !sourceFile) {
      toast.error(tr("Сначала выберите изображение.", "Avval rasmni tanlang.", "Please select an image first."));
      fileInput.current?.click();
      return;
    }
    setIsProcessing(true);
    try {
      const image = await loadImage(sourceUrl, tr("Не удалось прочитать изображение.", "Rasmni o'qib bo'lmadi.", "Failed to load image."));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas is unavailable");
      if (format === "image/jpeg") {
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, width, height);
      }
      context.drawImage(image, 0, 0, width, height);
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, format, quality / 100),
      );
      if (!blob) {
        if (format === "image/avif") {
          throw new Error(tr("AVIF не поддерживается в этом браузере.", "Ushbu brauzerda AVIF qo'llab-quvvatlanmaydi.", "AVIF is not supported in this browser."));
        }
        throw new Error(tr("Не удалось обработать изображение.", "Rasmni qayta ishlab bo'lmadi.", "Failed to process image."));
      }
      if (resultObjectUrl.current) URL.revokeObjectURL(resultObjectUrl.current);
      const url = URL.createObjectURL(blob);
      resultObjectUrl.current = url;
      setResultUrl(url);
      setResultSize(blob.size);
      recordHistory({
        toolId: "image-resize",
        title: `${locale === "en" ? "Image" : locale === "uz" ? "Rasm" : "Изображение"} ${width} × ${height}`,
        params: { width: String(width), height: String(height), format },
      });
      toast.success(tr("Изображение успешно обработано!", "Rasm muvaffaqiyatli ishlandi!", "Image processed successfully!"));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : tr("Не удалось обработать изображение.", "Xatolik yuz berdi.", "Failed to process image."),
      );
    } finally {
      setIsProcessing(false);
    }
  }

  function removeImage() {
    if (sourceObjectUrl.current) URL.revokeObjectURL(sourceObjectUrl.current);
    if (resultObjectUrl.current) URL.revokeObjectURL(resultObjectUrl.current);
    sourceObjectUrl.current = null;
    resultObjectUrl.current = null;
    setSourceFile(null);
    setSourceUrl(null);
    setResultUrl(null);
    setResultSize(0);
    if (fileInput.current) fileInput.current.value = "";
  }

  function download() {
    if (!resultUrl || !sourceFile) return;
    const link = document.createElement("a");
    link.href = resultUrl;
    link.download = `${sourceFile.name.replace(/\.[^.]+$/, "")}-${width}x${height}.${extensionFor(format)}`;
    link.click();
    toast.success(tr("Файл скачан", "Fayl yuklandi", "File downloaded"));
  }

  async function onShare() {
    const result = await shareUrl(
      buildShareUrl(locale === "en" ? "/en/tools/image-resize" : locale === "uz" ? "/uz/tools/image-resize" : "/tools/image-resize", new URLSearchParams()),
      tr("Ресайз изображений", "Rasm hajmini o'zgartirish", "Image Resizer"),
    );
    if (result === "copied") toast.success(t("share.copied"));
    if (result === "failed") toast.error(t("share.failed"));
  }

  const saving =
    resultSize && sourceSize.bytes
      ? Math.max(0, Math.round((1 - resultSize / sourceSize.bytes) * 1000) / 10)
      : 0;
  const activeImage = resultUrl ?? sourceUrl ?? "";

  return (
    <div className="w-full max-w-[1380px] mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6">
      {/* Standard Hero Banner */}
      <ImageHeroBanner
        fav={fav}
        onToggleFav={() => setFav(toggleFavorite("image-resize"))}
        onShare={onShare}
      />

      {/* Main 2-column layout matching loan-calculator benchmark */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Image Upload & Parameters */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs transition-colors">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                  <Maximize2 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-heading text-base font-bold text-slate-900 dark:text-slate-100">
                    {tr("Параметры сжатия", "Siqish parametrlari", "Resize Parameters")}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {tr("Разрешение, формат и качество", "O'lcham, format va sifat", "Resolution, format & quality")}
                  </p>
                </div>
              </div>

              {sourceFile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeImage}
                  className="h-8 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{tr("Очистить", "O'chirish", "Clear")}</span>
                </Button>
              )}
            </div>

            <div className="mt-4 space-y-5">
              {/* Dropzone / Upload area */}
              <div>
                <input
                  ref={fileInput}
                  className="sr-only"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => void acceptFile(e.target.files?.[0])}
                />

                {!sourceFile ? (
                  <button
                    type="button"
                    onClick={() => fileInput.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e: DragEvent<HTMLButtonElement>) => {
                      e.preventDefault();
                      void acceptFile(e.dataTransfer.files[0]);
                    }}
                    className="w-full p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-orange-500 dark:hover:border-orange-500 rounded-xl bg-slate-50/50 dark:bg-slate-950/40 hover:bg-orange-500/5 transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <span className="font-heading font-bold text-sm text-slate-800 dark:text-slate-200">
                      {tr("Перетащите фото сюда", "Rasmni shu yerga tashlang", "Drop image here")}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {tr("или нажмите для выбора с устройства", "yoki qurilmadan tanlang", "or click to browse from device")}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-2">
                      JPG, PNG, WebP (макс. 25 МБ)
                    </span>
                  </button>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={sourceUrl!}
                        alt="Preview"
                        className="w-12 h-12 rounded-lg object-cover border border-slate-200 dark:border-slate-800 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">
                          {sourceFile.name}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {sourceSize.width} × {sourceSize.height} px · {bytes(sourceSize.bytes)}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => fileInput.current?.click()}
                      className="text-xs shrink-0 text-primary"
                    >
                      {tr("Заменить", "O'zgartirish", "Change")}
                    </Button>
                  </div>
                )}
              </div>

              {/* Resolution Dimensions */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {tr("Разрешение (пиксели)", "O'lcham (piksellar)", "Target Dimensions (px)")}
                  </Label>
                  <button
                    type="button"
                    onClick={() => setKeepRatio(!keepRatio)}
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded transition-colors ${
                      keepRatio
                        ? "bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                    }`}
                  >
                    {keepRatio ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                    <span>{keepRatio ? tr("Пропорции зафиксированы", "Nisbat qulflangan", "Ratio locked") : tr("Свободные пропорции", "Erkin nisbat", "Free ratio")}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-500">{tr("Ширина (px)", "Kenglik (px)", "Width (px)")}</span>
                    <Input
                      type="number"
                      min={1}
                      max={10000}
                      value={width}
                      onChange={(e) => changeWidth(Number(e.target.value))}
                      className="font-mono text-sm font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-500">{tr("Высота (px)", "Balandlik (px)", "Height (px)")}</span>
                    <Input
                      type="number"
                      min={1}
                      max={10000}
                      value={height}
                      onChange={(e) => changeHeight(Number(e.target.value))}
                      className="font-mono text-sm font-bold"
                    />
                  </div>
                </div>

                {/* Quick Presets */}
                {sourceSize.width > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <button
                      type="button"
                      onClick={() => applyPresetRatio(0.75)}
                      className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300"
                    >
                      75%
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPresetRatio(0.5)}
                      className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300"
                    >
                      50%
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPresetRatio(0.25)}
                      className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300"
                    >
                      25%
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setWidth(sourceSize.width);
                        setHeight(sourceSize.height);
                      }}
                      className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300 ml-auto"
                    >
                      100% (1:1)
                    </button>
                  </div>
                )}
              </div>

              {/* Output Format */}
              <div>
                <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {tr("Формат сохранения", "Saqlash formati", "Output Format")}
                </Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {FORMAT_OPTIONS.map((opt) => (
                    <button
                      key={opt.type}
                      type="button"
                      onClick={() => setFormat(opt.type)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        format === opt.type
                          ? "border-orange-500 bg-orange-500/10 text-orange-950 dark:text-orange-200 font-bold ring-1 ring-orange-500/30"
                          : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <div className="text-xs font-bold">{opt.label}</div>
                      <div className="text-[9px] text-slate-400 mt-0.5">
                        {opt.label === "WebP" ? "Web Best" : opt.label === "AVIF" ? "Ultra" : opt.label === "JPG" ? "Photo" : "Alpha"}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality Slider */}
              {format !== "image/png" && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {tr("Качество сжатия", "Siqish sifati", "Compression Quality")}
                    </Label>
                    <span className="text-xs font-bold font-mono text-orange-600 dark:text-orange-400">
                      {quality}%
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Slider
                      value={[quality]}
                      onValueChange={(val) => setQuality(val[0])}
                      min={20}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      min={20}
                      max={100}
                      value={quality}
                      onChange={(e) => setQuality(Math.max(20, Math.min(100, Number(e.target.value) || 20)))}
                      className="w-16 h-8 text-center text-xs font-mono font-bold"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {tr("80% — идеальный баланс веса и четкости", "80% — hajm va sifatning eng yaxshi balansi", "80% is the optimal balance of size and fidelity")}
                  </p>
                </div>
              )}

              {/* Process Button */}
              <Button
                size="lg"
                onClick={() => void processImage()}
                disabled={isProcessing || !sourceFile}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-6 rounded-xl shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 text-sm transition-all"
              >
                {isProcessing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{tr("Обработка…", "Ishlanmoqda…", "Processing…")}</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-5 h-5" />
                    <span>{tr("Обработать изображение", "Rasmni qayta ishlash", "Process Image")}</span>
                  </>
                )}
              </Button>
            </div>
          </section>
        </div>

        {/* Right Column: Metrics & Preview */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Top Metrics Cards */}
          <ImageMetricsCards
            hasImage={Boolean(resultUrl)}
            sourceDim={{ width: sourceSize.width, height: sourceSize.height }}
            sourceBytes={bytes(sourceSize.bytes)}
            resultDim={{ width, height }}
            resultBytes={resultSize ? bytes(resultSize) : ""}
            savingPercent={saving}
            formatLabel={format.replace("image/", "").toUpperCase()}
            onDownload={download}
          />

          {/* Preview Panel Card */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <h3 className="font-heading text-sm font-bold text-slate-900 dark:text-slate-100">
                  {tr("Предпросмотр результата", "Natijani ko'rish", "Preview & Result")}
                </h3>
              </div>

              {/* Preview Modes */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPreviewMode("compare")}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    previewMode === "compare"
                      ? "bg-orange-500/10 text-orange-700 dark:text-orange-300 border border-orange-500/25"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  {tr("Сравнение", "Taqqoslash", "Compare")}
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode("source")}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    previewMode === "source"
                      ? "bg-orange-500/10 text-orange-700 dark:text-orange-300 border border-orange-500/25"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  {tr("Исходное", "Asl nusxa", "Source")}
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode("result")}
                  disabled={!resultUrl}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors disabled:opacity-40 ${
                    previewMode === "result"
                      ? "bg-orange-500/10 text-orange-700 dark:text-orange-300 border border-orange-500/25"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  {tr("Результат", "Natija", "Result")}
                </button>
              </div>
            </div>

            {/* Preview Canvas / Area */}
            <div className="mt-4">
              {sourceUrl ? (
                previewMode === "compare" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                        <span>{tr("Исходное", "Asl nusxa", "Original")}</span>
                        <span className="font-mono text-[11px] text-slate-400">{bytes(sourceSize.bytes)}</span>
                      </div>
                      <div className="h-56 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center overflow-hidden">
                        <img src={sourceUrl} alt="Original" className="max-h-full max-w-full object-contain" />
                      </div>
                      <div className="mt-2 text-[11px] text-slate-400 truncate">
                        {sourceSize.width} × {sourceSize.height} px · {sourceFile?.type.replace("image/", "").toUpperCase()}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                        <span>{tr("Обработанное", "Qayta ishlangan", "Processed")}</span>
                        <span className="font-mono text-[11px] text-slate-400">
                          {resultSize ? bytes(resultSize) : tr("Ожидание…", "Kutilmoqda…", "Pending…")}
                        </span>
                      </div>
                      <div className="h-56 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center overflow-hidden">
                        <img src={activeImage} alt="Result" className="max-h-full max-w-full object-contain" />
                      </div>
                      <div className="mt-2 text-[11px] text-slate-400 truncate">
                        {width} × {height} px · {format.replace("image/", "").toUpperCase()}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800">
                    <div className="h-80 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center overflow-hidden">
                      <img
                        src={previewMode === "source" ? sourceUrl : activeImage}
                        alt="View"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  </div>
                )
              ) : (
                <div className="py-16 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 dark:text-slate-500 text-xs flex flex-col items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-2" />
                  <span>{tr("Загрузите изображение для предпросмотра", "Rasmni ko'rish uchun fayl yuklang", "Upload an image to see preview")}</span>
                </div>
              )}

              {/* Download Bar */}
              {resultUrl && (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {width} × {height} px · {format.replace("image/", "").toUpperCase()} ({bytes(resultSize)})
                    </span>
                  </div>

                  <Button
                    onClick={download}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 text-xs"
                  >
                    <Download className="w-4 h-4" />
                    <span>{tr("Скачать файл", "Faylni yuklab olish", "Download File")}</span>
                  </Button>
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
              <div className="w-7 h-7 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                <FileImage className="w-4 h-4" />
              </div>
              <h3 className="font-heading text-sm font-bold text-slate-900 dark:text-slate-100">
                {tr("Почему WebP и AVIF?", "Nega WebP va AVIF?", "Why WebP & AVIF?")}
              </h3>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              {tr(
                "Форматы WebP и AVIF обеспечивают сжатие на 30–70% лучше традиционных JPEG и PNG без видимой потери качества. Это значительно ускоряет загрузку сайтов и экономит трафик пользователей.",
                "WebP va AVIF formatlari sifatni yo'qotmasdan rasmlarni 30–70% gacha kichraytiradi va yuklanish tezligini oshiradi.",
                "Modern WebP and AVIF codecs reduce file weight by 30–70% compared to legacy JPEG and PNG without visible loss in sharpness."
              )}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-medium text-orange-600 dark:text-orange-400 flex items-center gap-1">
              Google WebP & AOMedia <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </section>

        {/* Security Card */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-colors flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="font-heading text-sm font-bold text-slate-900 dark:text-slate-100">
                {tr("100% Конфиденциально", "100% Maxfiylik", "100% Private Processing")}
              </h3>
            </div>
            <ul className="mt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {tr("Ресайз и конвертация через HTML5 Canvas API", "HTML5 Canvas API orqali ishlanadi", "Processed directly via HTML5 Canvas API")}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {tr("Файлы не отправляются на удаленный сервер", "Fayllar tashqi serverga yuborilmaydi", "Files never leave your local browser sandbox")}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {tr("Мгновенная работа без очередей и ожидания", "Navbatlarsiz darhol ishlaydi", "Instant speed with zero server queue")}
              </li>
            </ul>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              Local Hardware Acceleration <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </section>

        {/* Related Tools Card */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-colors flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
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
                params={{ slug: "cmyk-convert" }}
                className="p-2.5 rounded-xl border border-slate-200/70 dark:border-slate-800 hover:border-orange-300 dark:hover:border-orange-700 bg-slate-50/50 dark:bg-slate-800/40 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-cyan-500" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-cyan-600 transition-colors">
                    CMYK
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 truncate">
                  RGB → CMYK
                </p>
              </Link>

              <Link
                to="/tools/$slug"
                params={{ slug: "color-palette" }}
                className="p-2.5 rounded-xl border border-slate-200/70 dark:border-slate-800 hover:border-orange-300 dark:hover:border-orange-700 bg-slate-50/50 dark:bg-slate-800/40 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-indigo-500" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 transition-colors">
                    Палитры
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 truncate">
                  Генератор схем
                </p>
              </Link>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] text-slate-400">
              {tr("Графические утилиты Toolboxi", "Toolboxi grafik utilitalari", "Toolboxi graphic tools")}
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
