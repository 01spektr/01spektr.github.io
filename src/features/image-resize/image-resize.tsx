import { type ChangeEvent, type DragEvent, useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import {
  Barcode,
  Check,
  ChevronDown,
  ChevronRight,
  Download,
  FileImage,
  Image,
  Info,
  Lock,
  Maximize2,
  Palette,
  QrCode,
  ShieldCheck,
  Share2,
  Star,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { toast } from "sonner";
import { ToolIcon } from "@/components/tool-icon";
import { Button } from "@/components/ui/button";
import { isFavorite, subscribeFavorites, toggleFavorite } from "@/lib/tools/favorites";
import { recordHistory } from "@/lib/tools/history";
import { buildShareUrl, shareUrl } from "@/lib/tools/share";
import { useI18n } from "@/lib/i18n";
import "./image-resize.css";

type OutputFormat = "image/jpeg" | "image/png" | "image/webp" | "image/avif";

const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_FILE_SIZE = 20 * 1024 * 1024;
const FORMAT_OPTIONS: { type: OutputFormat; label: string; accent: string }[] = [
  { type: "image/jpeg", label: "JPG", accent: "#f79018" },
  { type: "image/png", label: "PNG", accent: "#2878f5" },
  { type: "image/webp", label: "WebP", accent: "#a53ee8" },
  { type: "image/avif", label: "AVIF", accent: "#22b970" },
];

const EN: Record<string, string> = {
  "Не удалось прочитать изображение.": "Could not read the image.",
  "Поддерживаются JPG, PNG и WebP.": "JPG, PNG, and WebP are supported.",
  "Размер файла не должен превышать 20 МБ.": "The file must not exceed 20 MB.",
  "Не удалось открыть изображение.": "Could not open the image.",
  "Сначала выберите изображение.": "Choose an image first.",
  "AVIF не поддерживается в этом браузере.": "AVIF is not supported by this browser.",
  "Не удалось обработать изображение.": "Could not process the image.",
  "Изображение обработано": "Image processed",
  "Ресайз изображений": "Image resize",
  "Ссылка скопирована": "Link copied",
  "Не удалось поделиться ссылкой": "Could not share the link",
  "Полноэкранный режим недоступен в этом браузере.":
    "Fullscreen mode is unavailable in this browser.",
  Главная: "Home",
  "Дизайн и полиграфия": "Design & print",
  "Ресайз и конвертер изображений": "Image resize & converter",
  "В избранном": "Saved",
  "В избранное": "Save",
  Поделиться: "Share",
  "Изменяйте размер изображений, конвертируйте в нужный формат и уменьшайте вес. Быстро. Удобно. Бесплатно.":
    "Resize images, convert them to the format you need, and reduce file size. Fast. Convenient. Free.",
  "Обработка происходит прямо в вашем браузере.": "Processing happens directly in your browser.",
  "Файлы не загружаются на сервер.": "Files are never uploaded to a server.",
  "Загрузите изображение": "Upload an image",
  "Перетащите изображение сюда": "Drag an image here",
  или: "or",
  "выберите файл": "choose a file",
  "с компьютера": "from your computer",
  "Поддерживаются: JPG, PNG, WebP (макс. 20 МБ)": "Supported: JPG, PNG, WebP (max. 20 MB)",
  "Выбранное изображение": "Selected image",
  "Удалить изображение": "Remove image",
  "Размер изображения": "Image size",
  Ширина: "Width",
  Высота: "Height",
  "Сохранять пропорции": "Keep aspect ratio",
  "Исходное соотношение:": "Original ratio:",
  "Формат и качество": "Format & quality",
  "Качество:": "Quality:",
  "Качество изображения": "Image quality",
  "Дополнительные настройки": "Advanced settings",
  "Обрабатываем…": "Processing…",
  "Обработать изображение": "Process image",
  Информация: "Information",
  "Изменяйте размер изображений и конвертируйте их в современные форматы. Все операции выполняются в браузере, без загрузки на сервер.":
    "Resize images and convert them to modern formats. All operations run in your browser without uploads to a server.",
  Предпросмотр: "Preview",
  Сравнение: "Compare",
  Исходное: "Original",
  Результат: "Result",
  "На весь экран": "Fullscreen",
  "ещё не обработано": "not processed yet",
  "Здесь появится предпросмотр": "Your preview will appear here",
  "Загрузите изображение, чтобы начать обработку.": "Upload an image to begin processing.",
  "Размер файла": "File size",
  Экономия: "Savings",
  Размеры: "Dimensions",
  "Изображение успешно обработано!": "Image processed successfully!",
  "Результат будет готов после обработки": "Your result will be ready after processing",
  "Скачать изображение": "Download image",
  Преимущества: "Benefits",
  "Быстрая обработка в браузере": "Fast browser-based processing",
  "Поддержка JPG, PNG, WebP, AVIF*": "JPG, PNG, WebP, AVIF support*",
  "Сохранение качества": "Quality control",
  "Контроль размера файла": "File-size control",
  "Никаких загрузок на сервер": "No uploads to a server",
  "Похожие инструменты": "Related tools",
  "Смотреть все": "See all",
  "Генератор QR-кодов": "QR code generator",
  "Палитра цветов": "Color palette",
  "Генератор штрихкодов": "Barcode generator",
};

function formatBytes(value: number, locale: "ru" | "en") {
  const kb = locale === "en" ? "KB" : "КБ";
  const mb = locale === "en" ? "MB" : "МБ";
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
  const { locale } = useI18n();
  const tr = (value: string) => (locale === "en" ? (EN[value] ?? value) : value);
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
      toast.error(tr("Поддерживаются JPG, PNG и WebP."));
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error(tr("Размер файла не должен превышать 20 МБ."));
      return;
    }
    const url = URL.createObjectURL(file);
    try {
      const image = await loadImage(url, tr("Не удалось прочитать изображение."));
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
    } catch {
      URL.revokeObjectURL(url);
      toast.error(tr("Не удалось открыть изображение."));
    }
  }

  function changeWidth(next: number) {
    const safe = Math.max(1, Math.min(10000, next || 1));
    setWidth(safe);
    if (keepRatio) setHeight(Math.max(1, Math.round(safe / ratio)));
  }

  function changeHeight(next: number) {
    const safe = Math.max(1, Math.min(10000, next || 1));
    setHeight(safe);
    if (keepRatio) setWidth(Math.max(1, Math.round(safe * ratio)));
  }

  async function processImage() {
    if (!sourceUrl || !sourceFile) {
      toast.error(tr("Сначала выберите изображение."));
      fileInput.current?.click();
      return;
    }
    setIsProcessing(true);
    try {
      const image = await loadImage(sourceUrl, tr("Не удалось прочитать изображение."));
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
        if (format === "image/avif") throw new Error(tr("AVIF не поддерживается в этом браузере."));
        throw new Error(tr("Не удалось обработать изображение."));
      }
      if (resultObjectUrl.current) URL.revokeObjectURL(resultObjectUrl.current);
      const url = URL.createObjectURL(blob);
      resultObjectUrl.current = url;
      setResultUrl(url);
      setResultSize(blob.size);
      recordHistory({
        toolId: "image-resize",
        title: `${locale === "en" ? "Image" : "Изображение"} ${width} × ${height}`,
        params: { width: String(width), height: String(height), format },
      });
      toast.success(tr("Изображение обработано"));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : tr("Не удалось обработать изображение."),
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
  }

  async function onShare() {
    const result = await shareUrl(
      buildShareUrl("/tools/image-resize", new URLSearchParams()),
      tr("Ресайз изображений"),
    );
    if (result === "copied") toast.success(tr("Ссылка скопирована"));
    if (result === "failed") toast.error(tr("Не удалось поделиться ссылкой"));
  }

  async function togglePreviewFullscreen() {
    const preview = document.querySelector(".image-compare");
    if (!preview) return;
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await preview.requestFullscreen();
    } catch {
      toast.error(tr("Полноэкранный режим недоступен в этом браузере."));
    }
  }

  const saving =
    resultSize && sourceSize.bytes
      ? Math.max(0, Math.round((1 - resultSize / sourceSize.bytes) * 1000) / 10)
      : 0;
  const activeImage = resultUrl ?? sourceUrl ?? "";
  return (
    <div className="image-resize-page tool-page-frame pb-10">
      <div className="image-topbar">
        <nav aria-label="Breadcrumb" className="image-breadcrumb">
          <Link to="/">{tr("Главная")}</Link>
          <ChevronRight />
          <Link to="/categories/$id" params={{ id: "design-print" }}>
            {tr("Дизайн и полиграфия")}
          </Link>
          <ChevronRight />
          <span>{tr("Ресайз и конвертер изображений")}</span>
        </nav>
        <div className="image-actions">
          <Button variant="outline" onClick={() => setFav(toggleFavorite("image-resize"))}>
            <Star className={fav ? "fill-primary text-primary" : ""} />
            {tr(fav ? "В избранном" : "В избранное")}
          </Button>
          <Button variant="outline" onClick={() => void onShare()}>
            <Share2 />
            {tr("Поделиться")}
          </Button>
        </div>
      </div>
      <header className="image-page-heading">
        <div className="image-title">
          <ToolIcon tool={{ slug: "image-resize", icon: "Image" }} size="hero" />
          <div>
            <h1>{tr("Ресайз и конвертер изображений")}</h1>
            <p>
              {tr(
                "Изменяйте размер изображений, конвертируйте в нужный формат и уменьшайте вес. Быстро. Удобно. Бесплатно.",
              )}
            </p>
          </div>
        </div>
        <aside>
          <Info />
          <p>
            {tr("Обработка происходит прямо в вашем браузере.")}
            <br />
            {tr("Файлы не загружаются на сервер.")}
          </p>
        </aside>
      </header>
      <main className="image-workspace">
        <section className="image-settings surface-card">
          <div className="setting-section upload-section">
            <h2>
              <i>1</i>
              {tr("Загрузите изображение")}
            </h2>
            <input
              ref={fileInput}
              className="sr-only"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                void acceptFile(event.target.files?.[0])
              }
            />
            <button
              className="image-dropzone"
              type="button"
              onClick={() => fileInput.current?.click()}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event: DragEvent<HTMLButtonElement>) => {
                event.preventDefault();
                void acceptFile(event.dataTransfer.files[0]);
              }}
            >
              <UploadCloud />
              <strong>{tr("Перетащите изображение сюда")}</strong>
              <span>
                {tr("или")} <b>{tr("выберите файл")}</b> {tr("с компьютера")}
              </span>
              <small>{tr("Поддерживаются: JPG, PNG, WebP (макс. 20 МБ)")}</small>
            </button>
            {sourceFile && sourceUrl ? (
              <div className="image-file">
                <img src={sourceUrl} alt={tr("Выбранное изображение")} />
                <div>
                  <b>{sourceFile.name}</b>
                  <span>
                    {sourceSize.width} × {sourceSize.height} · {bytes(sourceSize.bytes)} ·{" "}
                    {sourceFile.type.replace("image/", "").toUpperCase()}
                  </span>
                </div>
                <button type="button" onClick={removeImage} aria-label={tr("Удалить изображение")}>
                  <Trash2 />
                </button>
              </div>
            ) : null}
          </div>
          <div className="setting-section">
            <h2>
              <i>2</i>
              {tr("Размер изображения")}
            </h2>
            <div className="size-fields">
              <label>
                {tr("Ширина")}
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={width}
                  onChange={(event) => changeWidth(Number(event.target.value))}
                />
                <small>px</small>
              </label>
              <button
                type="button"
                className="ratio-lock"
                onClick={() => setKeepRatio(!keepRatio)}
                aria-label={tr("Сохранять пропорции")}
              >
                <Lock className={keepRatio ? "text-primary" : ""} />
              </button>
              <label>
                {tr("Высота")}
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={height}
                  onChange={(event) => changeHeight(Number(event.target.value))}
                />
                <small>px</small>
              </label>
            </div>
            <div className="keep-ratio">
              <button
                type="button"
                className={keepRatio ? "is-on" : ""}
                onClick={() => setKeepRatio(!keepRatio)}
              >
                <span />
              </button>
              <span>{tr("Сохранять пропорции")}</span>
              <em>
                {tr("Исходное соотношение:")}{" "}
                {sourceSize.width && sourceSize.height
                  ? `${sourceSize.width}:${sourceSize.height}`
                  : "—"}
              </em>
            </div>
          </div>
          <div className="setting-section format-section">
            <h2>
              <i>3</i>
              {tr("Формат и качество")}
            </h2>
            <div className="format-grid">
              {FORMAT_OPTIONS.map((option) => (
                <button
                  key={option.type}
                  type="button"
                  className={format === option.type ? "is-active" : ""}
                  onClick={() => setFormat(option.type)}
                >
                  <span style={{ background: option.accent }}>
                    <FileImage />
                  </span>
                  {option.label}
                </button>
              ))}
            </div>
            <div className="quality-row">
              <b>
                {tr("Качество:")} {quality}%
              </b>
              <div>
                <input
                  aria-label={tr("Качество изображения")}
                  type="range"
                  min="30"
                  max="100"
                  value={quality}
                  onChange={(event) => setQuality(Number(event.target.value))}
                />
                <output>{quality}</output>
              </div>
            </div>
          </div>
          <button type="button" className="extra-settings">
            <span>
              <ChevronDown />
              {tr("Дополнительные настройки")}
            </span>
          </button>
          <Button
            className="image-process"
            onClick={() => void processImage()}
            disabled={isProcessing}
          >
            {isProcessing ? (
              tr("Обрабатываем…")
            ) : (
              <>
                <Maximize2 />
                {tr("Обработать изображение")}
              </>
            )}
          </Button>
          <div className="image-info">
            <Info />
            <p>
              <b>{tr("Информация")}</b>
              <br />
              {tr(
                "Изменяйте размер изображений и конвертируйте их в современные форматы. Все операции выполняются в браузере, без загрузки на сервер.",
              )}
            </p>
          </div>
        </section>
        <section className="image-preview-panel surface-card">
          <div className="preview-heading">
            <h2>{tr("Предпросмотр")}</h2>
            <div>
              <button
                className={previewMode === "compare" ? "is-active" : ""}
                type="button"
                onClick={() => setPreviewMode("compare")}
              >
                {tr("Сравнение")}
              </button>
              <button
                className={previewMode === "source" ? "is-active" : ""}
                type="button"
                onClick={() => setPreviewMode("source")}
              >
                {tr("Исходное")}
              </button>
              <button
                className={previewMode === "result" ? "is-active" : ""}
                type="button"
                disabled={!resultUrl}
                onClick={() => setPreviewMode("result")}
              >
                {tr("Результат")}
              </button>
              <button
                type="button"
                onClick={() => void togglePreviewFullscreen()}
                aria-label={tr("На весь экран")}
              >
                <Maximize2 />
              </button>
            </div>
          </div>
          <div className={`image-compare is-${previewMode}`}>
            {sourceUrl ? (
              previewMode === "compare" ? (
                <div className="compare-panes">
                  <div className="compare-pane">
                    <img src={sourceUrl} alt={tr("Исходное")} />
                    <span className="compare-label">
                      {tr("Исходное")}
                      <br />
                      <small>
                        {sourceSize.width} × {sourceSize.height} · {bytes(sourceSize.bytes)}
                      </small>
                    </span>
                  </div>
                  <div className="compare-pane">
                    <img src={activeImage} alt={tr("Результат")} />
                    <span className="compare-label">
                      {tr("Результат")}
                      <br />
                      <small>
                        {width} × {height} ·{" "}
                        {resultSize ? bytes(resultSize) : tr("ещё не обработано")}
                      </small>
                    </span>
                  </div>
                </div>
              ) : (
                <div className="single-image">
                  <img
                    src={previewMode === "source" ? sourceUrl : activeImage}
                    alt={tr(previewMode === "source" ? "Исходное" : "Результат")}
                  />
                  <span className="compare-label">
                    {tr(previewMode === "source" ? "Исходное" : "Результат")}
                  </span>
                </div>
              )
            ) : (
              <div className="image-empty-preview">
                <Image />
                <b>{tr("Здесь появится предпросмотр")}</b>
                <span>{tr("Загрузите изображение, чтобы начать обработку.")}</span>
              </div>
            )}
          </div>
          <div className="image-metrics">
            <div>
              <span>
                <Download />
              </span>
              <p>
                {tr("Размер файла")}
                <b>
                  {sourceSize.bytes
                    ? `${bytes(sourceSize.bytes)} → ${resultSize ? bytes(resultSize) : "—"}`
                    : "—"}
                </b>
              </p>
            </div>
            <div>
              <span className="metric-green">
                <Check />
              </span>
              <p>
                {tr("Экономия")}
                <b>{resultSize ? `${saving}%` : "—"}</b>
              </p>
            </div>
            <div>
              <span>
                <Maximize2 />
              </span>
              <p>
                {tr("Размеры")}
                <b>
                  {sourceSize.width
                    ? `${sourceSize.width} × ${sourceSize.height} → ${width} × ${height}`
                    : "—"}
                </b>
              </p>
            </div>
          </div>
          <div className="image-result-action">
            <p>
              {resultUrl ? (
                <>
                  <Check /> {tr("Изображение успешно обработано!")}
                </>
              ) : (
                tr("Результат будет готов после обработки")
              )}
            </p>
            <Button disabled={!resultUrl} onClick={download}>
              <Download />
              {tr("Скачать изображение")}
            </Button>
          </div>
          <div className="image-bottom">
            <article>
              <h3>
                <ShieldCheck />
                {tr("Преимущества")}
              </h3>
              <ul>
                <li>{tr("Быстрая обработка в браузере")}</li>
                <li>{tr("Поддержка JPG, PNG, WebP, AVIF*")}</li>
                <li>{tr("Сохранение качества")}</li>
                <li>{tr("Контроль размера файла")}</li>
                <li>{tr("Никаких загрузок на сервер")}</li>
              </ul>
            </article>
            <article className="related-tools">
              <h3>
                <Image />
                {tr("Похожие инструменты")}{" "}
                <Link to="/tools">
                  {tr("Смотреть все")} <ChevronRight />
                </Link>
              </h3>
              <div>
                <Related
                  slug="qr-generator"
                  label={tr("Генератор QR-кодов")}
                  Icon={QrCode}
                  color="#2f77f4"
                />
                <Related
                  slug="color-palette"
                  label={tr("Палитра цветов")}
                  Icon={Palette}
                  color="#a33ee8"
                />
                <Related
                  slug="barcode-generator"
                  label={tr("Генератор штрихкодов")}
                  Icon={Barcode}
                  color="#f31b88"
                />
              </div>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}

function Related({
  slug,
  label,
  Icon,
  color,
}: {
  slug: "qr-generator" | "color-palette" | "barcode-generator";
  label: string;
  Icon: LucideIcon;
  color: string;
}) {
  return (
    <Link to="/tools/$slug" params={{ slug }}>
      <span style={{ background: color }}>
        <Icon />
      </span>
      <b>{label}</b>
    </Link>
  );
}
