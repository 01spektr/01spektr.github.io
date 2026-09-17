import React, { useState, useEffect, useRef } from "react";
import {
  Home,
  ChevronRight,
  Zap,
  ShieldCheck,
  Infinity as InfinityIcon,
  Info,
  Settings,
  Settings2,
  Copy,
  Download,
  Check,
  CheckCircle2,
  Lightbulb,
  FileCode,
  FileImage,
  FileText,
  AlertCircle,
  Sparkles,
  ChevronDown,
  Palette,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import confetti from "canvas-confetti";
import {
  BARCODE_FORMATS,
  BarcodeFormatInfo,
  renderBarcodeToSvg,
  downloadSvgAsFile,
  downloadSvgAsPng,
  copyBarcodeImageToClipboard,
  downloadBarcodePdf,
  calculateEan13Checksum,
  calculateEan8Checksum,
  calculateItf14Checksum,
} from "./utils/barcode";
import { FormatExamples } from "./components/FormatExamples";
import { AccordionSections } from "./components/AccordionSections";
import { FormatInfoModal } from "./components/FormatInfoModal";
import { Link } from "@tanstack/react-router";
import { ToolIcon } from "@/components/tool-icon";
import { Button } from "@/components/ui/button";
import { isFavorite, toggleFavorite } from "@/lib/tools/favorites";
import { buildShareUrl, shareUrl } from "@/lib/tools/share";
import { Star, Share2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const COLOR_OPTIONS = [
  { id: "black", name: "Чёрный", hex: "#000000" },
  { id: "navy", name: "Тёмно-синий", hex: "#1e3a8a" },
  { id: "slate", name: "Тёмно-серый", hex: "#334155" },
  { id: "green", name: "Зелёный", hex: "#059669" },
  { id: "red", name: "Красный", hex: "#dc2626" },
  { id: "custom", name: "Свой цвет...", hex: "#000000" },
];

const SIZE_OPTIONS = [
  { id: "small", label: "Маленький (200 px)", barWidth: 1.5, height: 70, scale: 1 },
  { id: "medium", label: "Средний (300 px)", barWidth: 2, height: 100, scale: 2 },
  { id: "large", label: "Большой (450 px)", barWidth: 2.8, height: 130, scale: 3 },
  { id: "xlarge", label: "Очень большой (600 px)", barWidth: 3.5, height: 160, scale: 4 },
];

function colourLabel(id: string) {
  return ({ black: "Black", navy: "Dark blue", slate: "Dark grey", green: "Green", red: "Red", custom: "Custom colour…" } as Record<string, string>)[id] ?? id;
}

function sizeLabel(id: string) {
  return ({ small: "Small (200 px)", medium: "Medium (300 px)", large: "Large (450 px)", xlarge: "Extra large (600 px)" } as Record<string, string>)[id] ?? id;
}

function barcodeDescription(id: string) {
  return ({
    "EAN-13": "Standard 13-digit code used for retail products.",
    "EAN-8": "Compact 8-digit code for small packages.",
    Code128: "High-density code for letters, numbers and symbols.",
    Code39: "Popular industrial barcode for Latin letters and numbers.",
    "ITF-14": "Barcode for shipping packages and cardboard boxes.",
    "UPC-A": "American 12-digit retail barcode standard.",
    Codabar: "Simple barcode used by libraries, laboratories and logistics.",
  } as Record<string, string>)[id] ?? "Barcode format";
}

function barcodeHint(id: string) {
  return ({
    "EAN-13": "Enter 12 or 13 digits; the check digit is calculated automatically.",
    "EAN-8": "Enter 7 or 8 digits.",
    Code128: "Supports Latin letters, numbers and special characters.",
    Code39: "Supports uppercase Latin letters, numbers and - . $ / + %.",
    "ITF-14": "Enter exactly 13 or 14 digits.",
    "UPC-A": "Enter 11 or 12 digits.",
    Codabar: "Supports digits and the symbols - $ : / . +.",
  } as Record<string, string>)[id] ?? "Enter barcode data.";
}

function englishRuntimeMessage(message: string) {
  return message
    .replace("Введите данные для штрихкода", "Enter barcode data")
    .replace(/Введено (\d+) из (\d+) цифр\./, "Entered $1 of $2 digits.")
    .replace(/Для (EAN-13|EAN-8|ITF-14) требуется/, "$1 requires")
    .replace(/13-я цифра '(.+)' неверна по стандарту GS1\. Для кодирования использована верная контрольная сумма '(.+)'\./, "The 13th digit '$1' is invalid under GS1. The correct check digit '$2' is used for encoding.")
    .replace(/8-я цифра '(.+)' скорректирована на верную сумму '(.+)'\./, "The 8th digit '$1' was corrected to '$2'.")
    .replace(/14-я контрольная цифра скорректирована на '(.+)'\./, "The 14th check digit was corrected to '$1'.")
    .replace(/Ошибка формата данных для (.+)\. Проверьте введенные символы\./, "Invalid $1 data. Check the entered characters.");
}

export default function App() {
  const { locale, t } = useI18n();
  const en = locale === "en";
  const tr = (ru: string, english: string) => (en ? english : ru);
  const [favorite, setFavorite] = useState(() => isFavorite("barcode-generator"));
  // State
  const [selectedFormatId, setSelectedFormatId] = useState<string>("EAN-13");
  const [inputValue, setInputValue] = useState<string>("4780123456789");
  const [selectedSizeId, setSelectedSizeId] = useState<string>("medium");
  const [selectedColorId, setSelectedColorId] = useState<string>("black");
  const [customHexColor, setCustomHexColor] = useState<string>("#000000");
  const [fileFormat, setFileFormat] = useState<"PNG" | "SVG" | "PDF">("PNG");
  const [showText, setShowText] = useState<boolean>(true);
  const [addQuietZone, setAddQuietZone] = useState<boolean>(true);

  // Modals & Popups
  const [isFormatModalOpen, setIsFormatModalOpen] = useState<boolean>(false);
  const [isPngDropdownOpen, setIsPngDropdownOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Barcode Preview Reference & Render Status
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [checksumWarning, setChecksumWarning] = useState<string | null>(null);

  // Selected format definition
  const currentFormat =
    BARCODE_FORMATS.find((f) => f.id === selectedFormatId) || BARCODE_FORMATS[0];

  const activeColorHex =
    selectedColorId === "custom"
      ? customHexColor
      : COLOR_OPTIONS.find((c) => c.id === selectedColorId)?.hex || "#000000";

  const activeSize = SIZE_OPTIONS.find((s) => s.id === selectedSizeId) || SIZE_OPTIONS[1];

  // Helper toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  // Re-render barcode whenever parameters change
  useEffect(() => {
    if (!svgRef.current) return;

    setRenderError(null);
    setChecksumWarning(null);

    let encodeVal = inputValue.trim();

    if (!encodeVal) {
      setRenderError("Введите данные для штрихкода");
      return;
    }

    // Specific format sanitization and checksum auto-handling
    if (selectedFormatId === "EAN-13") {
      const digits = encodeVal.replace(/\D/g, "");
      if (digits.length < 12) {
        setRenderError(
          `Введено ${digits.length} из 12 цифр. Для EAN-13 требуется минимум 12 цифр.`,
        );
        return;
      }
      const first12 = digits.slice(0, 12);
      const expectedChecksum = calculateEan13Checksum(first12);
      if (digits.length === 12) {
        encodeVal = first12 + expectedChecksum;
      } else if (digits.length >= 13) {
        if (digits[12] !== expectedChecksum) {
          setChecksumWarning(
            `13-я цифра '${digits[12]}' неверна по стандарту GS1. Для кодирования использована верная контрольная сумма '${expectedChecksum}'.`,
          );
        }
        encodeVal = first12 + expectedChecksum;
      }
    } else if (selectedFormatId === "EAN-8") {
      const digits = encodeVal.replace(/\D/g, "");
      if (digits.length < 7) {
        setRenderError(`Введено ${digits.length} из 7 цифр. Для EAN-8 требуется 7 или 8 цифр.`);
        return;
      }
      const first7 = digits.slice(0, 7);
      const expectedChecksum = calculateEan8Checksum(first7);
      if (digits.length === 7) {
        encodeVal = first7 + expectedChecksum;
      } else if (digits.length >= 8) {
        if (digits[7] !== expectedChecksum) {
          setChecksumWarning(
            `8-я цифра '${digits[7]}' скорректирована на верную сумму '${expectedChecksum}'.`,
          );
        }
        encodeVal = first7 + expectedChecksum;
      }
    } else if (selectedFormatId === "ITF-14") {
      const digits = encodeVal.replace(/\D/g, "");
      if (digits.length < 13) {
        setRenderError(`Введено ${digits.length} из 13 цифр. Для ITF-14 требуется 13 или 14 цифр.`);
        return;
      }
      const first13 = digits.slice(0, 13);
      const expectedChecksum = calculateItf14Checksum(first13);
      if (digits.length === 13) {
        encodeVal = first13 + expectedChecksum;
      } else if (digits.length >= 14) {
        if (digits[13] !== expectedChecksum) {
          setChecksumWarning(`14-я контрольная цифра скорректирована на '${expectedChecksum}'.`);
        }
        encodeVal = first13 + expectedChecksum;
      }
    } else if (selectedFormatId === "Code39") {
      encodeVal = encodeVal.toUpperCase();
    }

    const success = renderBarcodeToSvg(svgRef.current, encodeVal, {
      format: currentFormat.barcodeType,
      width: activeSize.barWidth,
      height: activeSize.height,
      displayValue: showText,
      margin: addQuietZone ? 16 : 4,
      lineColor: activeColorHex,
      fontSize: 16,
    });

    if (!success) {
      setRenderError(`Ошибка формата данных для ${selectedFormatId}. Проверьте введенные символы.`);
    }
  }, [
    selectedFormatId,
    inputValue,
    selectedSizeId,
    selectedColorId,
    customHexColor,
    showText,
    addQuietZone,
    currentFormat,
    activeSize,
    activeColorHex,
  ]);

  // Handler to select a format from examples or dropdown
  const handleSelectFormat = (formatId: string, sampleValue?: string) => {
    setSelectedFormatId(formatId);
    const targetFormat = BARCODE_FORMATS.find((f) => f.id === formatId);
    if (sampleValue) {
      setInputValue(sampleValue);
    } else if (targetFormat) {
      setInputValue(targetFormat.sampleValue);
    }
  };

  // Auto-fix checksum action in UI
  const handleFixChecksum = () => {
    const digits = inputValue.replace(/\D/g, "");
    if (selectedFormatId === "EAN-13" && digits.length >= 12) {
      const first12 = digits.slice(0, 12);
      const correct = first12 + calculateEan13Checksum(first12);
      setInputValue(correct);
      setChecksumWarning(null);
      showToast("Контрольная цифра обновлена");
    } else if (selectedFormatId === "EAN-8" && digits.length >= 7) {
      const first7 = digits.slice(0, 7);
      const correct = first7 + calculateEan8Checksum(first7);
      setInputValue(correct);
      setChecksumWarning(null);
      showToast("Контрольная цифра обновлена");
    } else if (selectedFormatId === "ITF-14" && digits.length >= 13) {
      const first13 = digits.slice(0, 13);
      const correct = first13 + calculateItf14Checksum(first13);
      setInputValue(correct);
      setChecksumWarning(null);
      showToast("Контрольная цифра обновлена");
    }
  };

  // Copy to clipboard
  const handleCopyImage = async () => {
    if (!svgRef.current) return;
    try {
      const ok = await copyBarcodeImageToClipboard(svgRef.current);
      if (ok) {
        showToast("Штрихкод скопирован в буфер обмена!");
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.7 },
        });
      } else {
        // Fallback: download if copy not permitted in frame
        await downloadSvgAsPng(svgRef.current, `barcode_${selectedFormatId}_${inputValue}`, 2);
        showToast("Изображение сохранено (копирование недоступно в этом браузере)");
      }
    } catch {
      await downloadSvgAsPng(svgRef.current, `barcode_${selectedFormatId}_${inputValue}`, 2);
      showToast("Изображение сохранено");
    }
  };

  // Download PNG with quality multiplier
  const handleDownloadPng = async (scaleMultiplier = 2) => {
    if (!svgRef.current) return;
    setIsPngDropdownOpen(false);
    try {
      await downloadSvgAsPng(
        svgRef.current,
        `barcode_${selectedFormatId}_${inputValue}`,
        scaleMultiplier,
      );
      showToast(`PNG файл скачан (${scaleMultiplier * 300} DPI)`);
    } catch (err) {
      console.error(err);
      showToast("Не удалось скачать файл");
    }
  };

  // Download SVG
  const handleDownloadSvg = () => {
    if (!svgRef.current) return;
    try {
      downloadSvgAsFile(svgRef.current, `barcode_${selectedFormatId}_${inputValue}`);
      showToast("Векторный файл SVG скачан");
    } catch (err) {
      console.error(err);
      showToast("Ошибка при скачивании SVG");
    }
  };

  // Download PDF
  const handleDownloadPdf = async () => {
    if (!svgRef.current) return;
    try {
      await downloadBarcodePdf(svgRef.current, selectedFormatId, inputValue);
      showToast("PDF документ со штрихкодом сформирован");
    } catch (err) {
      console.error(err);
      showToast("Ошибка при создании PDF");
    }
  };

  // Quick download according to selected format
  const handleQuickDownload = () => {
    if (fileFormat === "PNG") {
      handleDownloadPng(activeSize.scale);
    } else if (fileFormat === "SVG") {
      handleDownloadSvg();
    } else if (fileFormat === "PDF") {
      handleDownloadPdf();
    }
  };

  return (
    <div className="barcode-integrated tool-page-frame text-slate-800 pb-14 font-sans antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          id="toast-notification"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg text-sm animate-in slide-in-from-bottom-5 duration-200"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Format Info Modal */}
      <FormatInfoModal
        format={currentFormat}
        isOpen={isFormatModalOpen}
        onClose={() => setIsFormatModalOpen(false)}
      />

      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-4 px-4 pb-5 pt-1 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500">
            <Link to={en ? "/en" : "/"} className="hover:text-blue-600">{t("breadcrumb.home")}</Link>
            <span>›</span>
            <Link
              to="/categories/$id"
              params={{ id: "design-print" }}
              className="hover:text-blue-600"
            >
              {tr("Дизайн и полиграфия", "Design & print")}
            </Link>
            <span>›</span>
            <span>{tr("Генератор штрихкодов", "Barcode generator")}</span>
          </nav>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFavorite(toggleFavorite("barcode-generator"))}
            >
              <Star className={favorite ? "fill-primary text-primary" : ""} />
              {favorite ? t("fav.remove") : t("fav.add")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                void shareUrl(
                  buildShareUrl("/tools/barcode-generator", new URLSearchParams()),
                  tr("Генератор штрихкодов", "Barcode generator"),
                )
              }
            >
              <Share2 />
              {t("share")}
            </Button>
          </div>
        </div>
        <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div className="flex items-start gap-4">
            <ToolIcon tool={{ slug: "barcode-generator", icon: "Barcode" }} size="hero" />
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                {tr("Генератор штрихкодов", "Barcode generator")}
              </h1>
              <p className="mt-1 max-w-3xl text-sm leading-relaxed text-slate-500">
                {tr("Создавайте штрихкоды EAN, Code128, Code39 и других форматов. Генерация и экспорт происходят прямо в браузере.", "Create EAN, Code 128, Code 39 and other barcodes. Generation and export happen directly in your browser.")}
              </p>
            </div>
          </div>
          <aside className="flex shrink-0 items-center gap-3 rounded-xl bg-blue-50 px-4 py-3 text-xs leading-relaxed text-slate-600">
            <Info className="size-5 shrink-0 text-blue-600" />
            <p>
              {tr("Работает прямо в вашем браузере.", "Works directly in your browser.")}
              <br />
              {tr("Данные не отправляются на сервер.", "No data is sent to a server.")}
            </p>
          </aside>
        </header>
      </div>
      {/* Main Container */}
      <main className="mx-auto max-w-[1440px] space-y-6 px-4 pt-1 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav
          id="breadcrumbs-nav"
          aria-label="Навигация"
          className="hidden flex items-center gap-2 text-xs text-slate-500 font-medium"
        >
          <a href="#" className="flex items-center gap-1 hover:text-slate-800 transition-colors">
            <Home className="w-3.5 h-3.5 text-blue-600" />
            <span>Главная</span>
          </a>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="hover:text-slate-800 cursor-pointer">Категории</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="hover:text-slate-800 cursor-pointer">Дизайн и полиграфия</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-700 font-semibold">Генератор штрихкодов</span>
        </nav>

        {/* Top Header Section */}
        <header className="hidden flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">
          {/* Title & App Icon */}
          <div className="flex items-center gap-4">
            <div
              id="app-logo-badge"
              className="w-13 h-13 rounded-2xl bg-blue-600 shadow-sm flex items-center justify-center shrink-0"
            >
              {/* Barcode icon glyph with vertical bars */}
              <div className="flex items-center gap-0.5 h-7">
                <div className="w-1.5 h-full bg-white rounded-xs"></div>
                <div className="w-0.5 h-full bg-white rounded-xs"></div>
                <div className="w-1 h-full bg-white rounded-xs"></div>
                <div className="w-2 h-full bg-white rounded-xs"></div>
                <div className="w-0.5 h-full bg-white rounded-xs"></div>
                <div className="w-1.5 h-full bg-white rounded-xs"></div>
              </div>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Генератор штрихкодов
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-xl leading-relaxed">
                Создавайте штрихкоды в форматах EAN, Code128, Code39 и других. Скачивайте в нужном
                формате и используйте в своих проектах.
              </p>
            </div>
          </div>

          {/* 3 Top Feature Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Fast */}
            <div
              id="badge-fast"
              className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 fill-blue-600 text-blue-600" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 leading-tight">Быстро</div>
                <div className="text-[11px] text-slate-500 truncate">Генерация за секунды</div>
              </div>
            </div>

            {/* Convenient */}
            <div
              id="badge-convenient"
              className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 leading-tight">Удобно</div>
                <div className="text-[11px] text-slate-500 truncate">
                  Поддержка популярных форматов
                </div>
              </div>
            </div>

            {/* Free */}
            <div
              id="badge-free"
              className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <InfinityIcon className="w-4 h-4 text-blue-600" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 leading-tight">Бесплатно</div>
                <div className="text-[11px] text-slate-500 truncate">Без регистрации</div>
              </div>
            </div>
          </div>
        </header>

        {/* Primary Generator Workspace: 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Configuration Controls */}
          <section
            id="generator-config-card"
            className="lg:col-span-6 xl:col-span-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6 flex flex-col justify-between"
          >
            <div className="space-y-6">
              {/* STEP 1: Select Barcode Type */}
              <div id="step-1-container" className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    1
                  </span>
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                    {tr("Выберите тип штрихкода", "Choose a barcode type")}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-stretch">
                  {/* Format Dropdown Selector */}
                  <div className="relative flex items-center">
                    <select
                      id="barcode-format-select"
                      value={selectedFormatId}
                      onChange={(e) => handleSelectFormat(e.target.value)}
                      className="w-full bg-white border border-slate-200 hover:border-slate-300 text-slate-900 text-sm font-medium rounded-xl px-4 py-3 pr-10 appearance-none focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors cursor-pointer shadow-2xs"
                    >
                      {BARCODE_FORMATS.map((fmt) => (
                        <option key={fmt.id} value={fmt.id}>
                          {fmt.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3.5 pointer-events-none" />
                  </div>

                  {/* Format Info Callout Box */}
                  <div
                    id="format-info-callout"
                    className="bg-[#f0f6ff] border border-blue-100/70 rounded-xl p-3.5 flex gap-3 items-start text-xs"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                      <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[11px]">
                        i
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-slate-900 text-sm leading-tight">
                        {currentFormat.name}
                      </div>
                      <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                        {en
                          ? barcodeDescription(currentFormat.id)
                          : currentFormat.id === "EAN-13"
                            ? "Стандартный 13-значный код, используется для товаров в розничной торговле."
                            : currentFormat.shortDesc}
                      </p>
                      <button
                        id="open-format-details-btn"
                        onClick={() => setIsFormatModalOpen(true)}
                        className="mt-1.5 text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1 cursor-pointer transition-colors text-xs"
                      >
                        <span>{tr("Подробнее", "Details")}</span>
                        <span>→</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* STEP 2: Input Barcode Data */}
              <div id="step-2-container" className="space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    2
                  </span>
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                    {tr("Введите данные", "Enter data")}
                  </h2>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <input
                      id="barcode-data-input"
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="4780123456789"
                      className="w-full bg-white border border-slate-200 hover:border-slate-300 text-slate-900 font-mono text-sm sm:text-base rounded-xl px-4 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors shadow-2xs"
                    />
                  </div>
                  <button
                    id="generate-barcode-btn"
                    onClick={() => {
                      showToast(tr("Штрихкод сгенерирован", "Barcode generated"));
                    }}
                    className="bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white px-6 py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer shrink-0"
                  >
                    <Settings className="w-4 h-4" />
                    <span>{tr("Сгенерировать", "Generate")}</span>
                  </button>
                </div>

                {/* Helper hint & warnings */}
                <div className="space-y-1 text-xs">
                  <p className="text-slate-500">
                    {en
                      ? barcodeHint(currentFormat.id)
                      : currentFormat.id === "EAN-13"
                        ? "Для EAN-13 введите 12 цифр, контрольная сумма будет добавлена автоматически."
                        : currentFormat.rulesHint}
                  </p>

                  {checksumWarning && (
                    <div className="flex items-center justify-between gap-2 p-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
                      <div className="flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                        <span>{en ? englishRuntimeMessage(checksumWarning) : checksumWarning}</span>
                      </div>
                      <button
                        onClick={handleFixChecksum}
                        className="text-amber-900 font-semibold underline underline-offset-2 hover:text-amber-950 shrink-0 cursor-pointer ml-2"
                      >
                        {tr("Применить к полю", "Apply")}
                      </button>
                    </div>
                  )}

                  {renderError && (
                    <div className="flex items-center gap-1.5 text-rose-600 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{en ? englishRuntimeMessage(renderError) : renderError}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* STEP 3: Optional Settings */}
              <div id="step-3-container" className="space-y-3.5 pt-1 border-t border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    3
                  </span>
                  <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                    {tr("Настройки", "Settings")} <span className="font-normal text-slate-500">{tr("(опционально)", "(optional)")}</span>
                  </h2>
                </div>

                {/* 3 Selectors Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Size Selector */}
                  <div className="space-y-1.5">
                    <label htmlFor="select-size" className="text-xs font-medium text-slate-600">
                      {tr("Размер", "Size")}
                    </label>
                    <div className="relative">
                      <select
                        id="select-size"
                        value={selectedSizeId}
                        onChange={(e) => setSelectedSizeId(e.target.value)}
                        className="w-full bg-slate-50/80 border border-slate-200 hover:border-slate-300 text-slate-800 text-xs font-medium rounded-xl px-3 py-2 pr-7 appearance-none focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors cursor-pointer"
                      >
                        {SIZE_OPTIONS.map((s) => (
                          <option key={s.id} value={s.id}>
                            {en ? sizeLabel(s.id) : s.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
                    </div>
                  </div>

                  {/* Color Selector */}
                  <div className="space-y-1.5">
                    <label htmlFor="select-color" className="text-xs font-medium text-slate-600">
                      {tr("Цвет", "Colour")}
                    </label>
                    <div className="relative flex items-center">
                      <select
                        id="select-color"
                        value={selectedColorId}
                        onChange={(e) => setSelectedColorId(e.target.value)}
                        className="w-full bg-slate-50/80 border border-slate-200 hover:border-slate-300 text-slate-800 text-xs font-medium rounded-xl pl-7 pr-7 py-2 appearance-none focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors cursor-pointer"
                      >
                        {COLOR_OPTIONS.map((c) => (
                          <option key={c.id} value={c.id}>
                            {en ? colourLabel(c.id) : c.name}
                          </option>
                        ))}
                      </select>
                      {/* Color Preview Swatch Dot */}
                      <span
                        className="w-3 h-3 rounded-full absolute left-2.5 pointer-events-none border border-black/10"
                        style={{ backgroundColor: activeColorHex }}
                      />
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
                    </div>
                  </div>

                  {/* File Format Selector */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="select-file-format"
                      className="text-xs font-medium text-slate-600"
                    >
                      {tr("Формат файла", "File format")}
                    </label>
                    <div className="relative">
                      <select
                        id="select-file-format"
                        value={fileFormat}
                        onChange={(e) => setFileFormat(e.target.value as "PNG" | "SVG" | "PDF")}
                        className="w-full bg-slate-50/80 border border-slate-200 hover:border-slate-300 text-slate-800 text-xs font-semibold rounded-xl px-3 py-2 pr-7 appearance-none focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors cursor-pointer"
                      >
                        <option value="PNG">PNG</option>
                        <option value="SVG">SVG</option>
                        <option value="PDF">PDF</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Custom Color Input if custom selected */}
                {selectedColorId === "custom" && (
                  <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <Palette className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-600">{tr("Выберите оттенок:", "Choose a colour:")}</span>
                    <input
                      type="color"
                      value={customHexColor}
                      onChange={(e) => setCustomHexColor(e.target.value)}
                      className="w-7 h-7 rounded-lg border-0 cursor-pointer p-0 bg-transparent"
                    />
                    <span className="font-mono text-slate-700">{customHexColor}</span>
                  </div>
                )}

                {/* Checkboxes Row */}
                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <label
                    id="checkbox-label-show-text"
                    className="flex items-center gap-2 cursor-pointer select-none text-xs font-medium text-slate-700 hover:text-slate-900"
                  >
                    <input
                      id="checkbox-show-text"
                      type="checkbox"
                      checked={showText}
                      onChange={(e) => setShowText(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                    />
                    <span>{tr("Показать текст под кодом", "Show text below the code")}</span>
                  </label>

                  <label
                    id="checkbox-label-quiet-zone"
                    className="flex items-center gap-2 cursor-pointer select-none text-xs font-medium text-slate-700 hover:text-slate-900"
                  >
                    <input
                      id="checkbox-quiet-zone"
                      type="checkbox"
                      checked={addQuietZone}
                      onChange={(e) => setAddQuietZone(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                    />
                    <span>{tr("Добавить отступы (quiet zone)", "Add quiet zone")}</span>
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* Right Column: Barcode Live Preview & Action Downloads */}
          <section
            id="generator-preview-card"
            className="lg:col-span-6 xl:col-span-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between"
          >
            {/* Header: Title & Copy Image */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-sm sm:text-base font-bold text-slate-900">{tr("Предпросмотр", "Preview")}</h2>
              <button
                id="copy-barcode-image-btn"
                onClick={handleCopyImage}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-lg shadow-2xs transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>{tr("Скопировать изображение", "Copy image")}</span>
              </button>
            </div>

            {/* Central Barcode Stage */}
            <div className="py-6 flex flex-col items-center justify-center">
              <div
                id="barcode-preview-stage"
                className="w-full bg-slate-50/70 border border-slate-200/60 rounded-xl p-6 sm:p-8 flex flex-col items-center justify-center min-h-[260px]"
              >
                <div
                  id="barcode-render-box"
                  className={`bg-white p-4 sm:p-6 rounded-lg shadow-2xs border border-slate-200/50 flex flex-col items-center justify-center transition-all ${
                    selectedFormatId === "ITF-14" ? "border-4 border-black" : ""
                  }`}
                >
                  {/* SVG Barcode Output */}
                  <svg
                    ref={svgRef}
                    id="barcode-svg-element"
                    className="max-w-full h-auto mx-auto"
                  />
                </div>

                {/* Status footer for standard */}
                <div className="mt-3 text-center">
                  <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-slate-400">
                    {selectedFormatId} • {showText ? tr("С текстом", "With text") : tr("Без текста", "Without text")} •{" "}
                    {addQuietZone ? tr("Quiet zone вкл.", "Quiet zone on") : tr("Без полей", "No quiet zone")}
                  </span>
                </div>
              </div>
            </div>

            {/* Download Buttons Row */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2.5">
              {/* Primary Download Button with Quality Caret */}
              <div className="relative inline-flex flex-1 sm:flex-initial">
                <button
                  id="primary-download-btn"
                  onClick={handleQuickDownload}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white px-5 py-2.5 rounded-l-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>{tr("Скачать", "Download")} {fileFormat}</span>
                </button>
                <button
                  id="png-quality-toggle-btn"
                  onClick={() => setIsPngDropdownOpen(!isPngDropdownOpen)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-2.5 rounded-r-xl border-l border-blue-500/40 transition-colors cursor-pointer"
                  title={tr("Выбрать разрешение", "Choose resolution")}
                >
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Resolution Popover */}
                {isPngDropdownOpen && (
                  <div
                    id="png-resolution-dropdown"
                    className="absolute bottom-full left-0 mb-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-20 text-xs space-y-1"
                  >
                    <div className="px-3 py-1 font-semibold text-slate-400 uppercase text-[10px]">
                      {tr("Разрешение для экспорта", "Export resolution")}
                    </div>
                    <button
                      onClick={() => handleDownloadPng(1)}
                      className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700 hover:text-slate-900 flex items-center justify-between cursor-pointer"
                    >
                      <span>{tr("Стандартное (1x - экран)", "Standard (1x — screen)")}</span>
                      <span className="text-slate-400">300 px</span>
                    </button>
                    <button
                      onClick={() => handleDownloadPng(2)}
                      className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700 hover:text-slate-900 flex items-center justify-between cursor-pointer font-medium"
                    >
                      <span>{tr("Оптимальное (2x - этикетки)", "Optimal (2x — labels)")}</span>
                      <span className="text-blue-600">600 px</span>
                    </button>
                    <button
                      onClick={() => handleDownloadPng(4)}
                      className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700 hover:text-slate-900 flex items-center justify-between cursor-pointer"
                    >
                      <span>{tr("Полиграфия (4x - 1200 DPI)", "Print (4x — 1200 DPI)")}</span>
                      <span className="text-slate-400">1200 px</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Vector SVG Download */}
              <button
                id="download-svg-btn"
                onClick={handleDownloadSvg}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl shadow-2xs transition-colors cursor-pointer"
              >
                <FileCode className="w-4 h-4 text-slate-500" />
                <span>{tr("Скачать SVG", "Download SVG")}</span>
              </button>

              {/* PDF Print Document */}
              <button
                id="download-pdf-btn"
                onClick={handleDownloadPdf}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl shadow-2xs transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4 text-slate-500" />
                <span>{tr("Скачать PDF", "Download PDF")}</span>
              </button>
            </div>
          </section>
        </div>

        {/* Examples of other formats (in a single horizontal row, sized to barcodes) */}
        <section id="format-examples-section">
          <FormatExamples currentFormatId={selectedFormatId} onSelectFormat={handleSelectFormat} />
        </section>

        {/* Footer Sections: FAQ, Guide, Commercial Use (3 in a row) */}
        <section id="faq-and-guides-section" className="pt-1">
          <AccordionSections />
        </section>
      </main>
    </div>
  );
}
