import React, { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { Info, Share2, Star } from "lucide-react";
import { RGB, ActiveTab, PaperType } from "./types";
import { rgbToCmyk, cmykToSimulatedPrintRgb } from "./utils/colorConversion";
import { findClosestPantone } from "./utils/pantoneMatcher";
import { ColorInputPanel } from "./components/ColorInputPanel";
import { ColorResultPanel } from "./components/ColorResultPanel";
import { PreviewTabsPanel } from "./components/PreviewTabsPanel";
import { InfoAndFaqSection } from "./components/InfoAndFaqSection";
import { ExportModal } from "./components/ExportModal";
import { ToolIcon } from "@/components/tool-icon";
import { Button } from "@/components/ui/button";
import { isFavorite, toggleFavorite } from "@/lib/tools/favorites";
import { buildShareUrl, shareUrl } from "@/lib/tools/share";
import { useI18n } from "@/lib/i18n";

export default function App() {
  const { locale } = useI18n();
  const en = locale === "en";
  // Initialize with #2563EB (R: 37, G: 99, B: 235) from the screenshot
  const [rgb, setRgb] = useState<RGB>({ r: 37, g: 99, b: 235 });
  const [paperType, setPaperType] = useState<PaperType>("coated");
  const [activeTab, setActiveTab] = useState<ActiveTab>("preview");
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [favorite, setFavorite] = useState(() => isFavorite("cmyk-convert"));

  // Compute CMYK values
  const cmyk = useMemo(() => rgbToCmyk(rgb), [rgb]);

  // Compute simulated print RGB on paper
  const simulatedRgb = useMemo(() => cmykToSimulatedPrintRgb(cmyk, paperType), [cmyk, paperType]);

  // Compute closest Pantone matches
  const pantoneMatches = useMemo(() => findClosestPantone(rgb, "all", 6), [rgb]);

  const handleOpenExport = () => {
    setIsExportModalOpen(true);
  };

  return (
    <div className="cmyk-integrated tool-page-frame text-slate-800 flex flex-col font-sans">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-4 px-4 pb-5 pt-1 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500">
            <Link to="/" className="hover:text-blue-600">
              {en ? "Home" : "Главная"}
            </Link>
            <span>›</span>
            <Link
              to="/categories/$id"
              params={{ id: "design-print" }}
              className="hover:text-blue-600"
            >
              {en ? "Design & print" : "Дизайн и полиграфия"}
            </Link>
            <span>›</span>
            <span>RGB → CMYK</span>
          </nav>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFavorite(toggleFavorite("cmyk-convert"))}
            >
              <Star className={favorite ? "fill-primary text-primary" : ""} />
              {favorite ? (en ? "Saved" : "В избранном") : en ? "Save" : "В избранное"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                void shareUrl(
                  buildShareUrl("/tools/cmyk-convert", new URLSearchParams()),
                  "RGB → CMYK",
                )
              }
            >
              <Share2 />
              {en ? "Share" : "Поделиться"}
            </Button>
          </div>
        </div>
        <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div className="flex items-start gap-4">
            <ToolIcon tool={{ slug: "cmyk-convert", icon: "Droplets" }} size="hero" />
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                {en ? "RGB → CMYK converter" : "Конвертер RGB → CMYK"}
              </h1>
              <p className="mt-1 max-w-3xl text-sm leading-relaxed text-slate-500">
                {en
                  ? "Convert screen colours to the CMYK print model, check ink coverage, and find a close Pantone match."
                  : "Переводите экранные цвета в печатную модель CMYK, проверяйте покрытие краской и подбирайте близкий Pantone."}
              </p>
            </div>
          </div>
          <aside className="flex shrink-0 items-center gap-3 rounded-xl bg-blue-50 px-4 py-3 text-xs leading-relaxed text-slate-600">
            <Info className="size-5 shrink-0 text-blue-600" />
            <p>
              {en
                ? "Processing happens directly in your browser."
                : "Обработка происходит прямо в вашем браузере."}
              <br />
              {en ? "Your data is not sent to a server." : "Данные не отправляются на сервер."}
            </p>
          </aside>
        </header>
      </div>

      {/* Main Content Area */}
      <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 pb-12 sm:px-6 lg:px-8">
        {/* 3-Column Core Workspace matching screenshot */}
        <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-3">
          {/* Column 1: Введите цвет в RGB */}
          <ColorInputPanel rgb={rgb} onChangeRgb={setRgb} />

          {/* Column 2: Результат преобразования */}
          <ColorResultPanel
            rgb={rgb}
            cmyk={cmyk}
            simulatedRgb={simulatedRgb}
            pantoneMatch={pantoneMatches[0]}
            paperType={paperType}
            onChangePaperType={setPaperType}
            onOpenPantoneTab={() => setActiveTab("pantone")}
            onOpenExport={handleOpenExport}
          />

          {/* Column 3: Предпросмотр, Сравнение, Палитра, Пантоны, Экспорт */}
          <PreviewTabsPanel
            rgb={rgb}
            cmyk={cmyk}
            simulatedRgb={simulatedRgb}
            pantoneMatches={pantoneMatches}
            paperType={paperType}
            onChangePaperType={setPaperType}
            onSelectColor={setRgb}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>

        {/* Bottom 3 Information & FAQ Cards */}
        <InfoAndFaqSection />
      </main>

      {/* Prepress Vector Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        rgb={rgb}
        cmyk={cmyk}
        simulatedRgb={simulatedRgb}
        pantoneMatch={pantoneMatches[0]}
        paperType={paperType}
      />
    </div>
  );
}
