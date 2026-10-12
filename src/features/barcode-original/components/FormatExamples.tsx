import React, { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";
import { useI18n } from "@/lib/i18n";

interface FormatExamplesProps {
  currentFormatId: string;
  onSelectFormat: (formatId: string, sampleValue: string) => void;
}

interface ExampleItem {
  formatId: string;
  name: string;
  sampleValue: string;
  jsFormat: string;
  hasBearerBox?: boolean;
}

const EXAMPLES: ExampleItem[] = [
  {
    formatId: "EAN-13",
    name: "EAN-13",
    sampleValue: "4780123456781",
    jsFormat: "EAN13",
  },
  {
    formatId: "EAN-8",
    name: "EAN-8",
    sampleValue: "45678901",
    jsFormat: "EAN8",
  },
  {
    formatId: "Code128",
    name: "Code 128",
    sampleValue: "Toolboxi",
    jsFormat: "CODE128",
  },
  {
    formatId: "Code39",
    name: "Code 39",
    sampleValue: "TOOLBOXI",
    jsFormat: "CODE39",
  },
  {
    formatId: "ITF-14",
    name: "ITF-14",
    sampleValue: "04780123456789",
    jsFormat: "ITF14",
    hasBearerBox: true,
  },
  {
    formatId: "UPC-A",
    name: "UPC-A",
    sampleValue: "012345678905",
    jsFormat: "UPC",
  },
  {
    formatId: "Codabar",
    name: "Codabar",
    sampleValue: "A12345678B",
    jsFormat: "codabar",
  },
];

export const FormatExamples: React.FC<FormatExamplesProps> = ({
  currentFormatId,
  onSelectFormat,
}) => {
  const { locale } = useI18n();
  const en = locale === "en";
  const uz = locale === "uz";
  const svgRefs = useRef<(SVGSVGElement | null)[]>([]);

  useEffect(() => {
    EXAMPLES.forEach((item, index) => {
      const svg = svgRefs.current[index];
      if (svg) {
        try {
          JsBarcode(svg, item.sampleValue, {
            format: item.jsFormat,
            width: item.formatId === "ITF-14" || item.formatId === "Code39" ? 1.0 : 1.2,
            height: 32,
            displayValue: true,
            fontSize: 10,
            margin: 4,
            textMargin: 2,
            lineColor: "#0f172a",
            background: "#ffffff",
            font: "monospace",
          });
        } catch (e) {
          console.warn("Mini barcode render error:", item.formatId, e);
        }
      }
    });
  }, []);

  const title = en
    ? "Other Barcode Formats"
    : uz
      ? "Boshqa shtrix-kod formatlari"
      : "Примеры других форматов";

  const hint = en
    ? "Click to select"
    : uz
      ? "Tanlash uchun bosing"
      : "Нажмите для быстрого выбора";

  return (
    <div
      id="format-examples-card"
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs p-4 sm:p-5 transition-colors"
    >
      <div className="flex items-center justify-between mb-3.5">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-heading">
          {title}
        </h3>
        <span className="text-xs text-slate-400 dark:text-slate-500 hidden sm:inline">
          {hint}
        </span>
      </div>

      {/* Grid with clean white background cards for barcodes in both light & dark themes */}
      <div className="overflow-x-auto pb-1.5 -mx-1 px-1 scrollbar-none">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3 min-w-[560px] sm:min-w-0">
          {EXAMPLES.map((item, idx) => {
            const isSelected = currentFormatId === item.formatId;
            return (
              <button
                type="button"
                key={item.formatId}
                id={`example-format-btn-${item.formatId.toLowerCase()}`}
                onClick={() => onSelectFormat(item.formatId, item.sampleValue)}
                className={`group flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? "border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 ring-2 ring-blue-500/20 shadow-xs"
                    : "border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-white dark:hover:bg-slate-800 hover:shadow-2xs"
                }`}
              >
                {/* Barcode preview container with dedicated crisp white card */}
                <div
                  className={`w-full flex items-center justify-center p-1.5 rounded-lg bg-white border shadow-2xs transition-all ${
                    item.hasBearerBox
                      ? "border-2 border-slate-900"
                      : "border-slate-200/60"
                  }`}
                >
                  <svg
                    ref={(el) => {
                      svgRefs.current[idx] = el;
                    }}
                    className="max-h-[38px] w-auto max-w-full object-contain mx-auto shrink-0"
                  />
                </div>
                <span
                  className={`mt-2 text-xs font-bold tracking-tight transition-colors truncate w-full ${
                    isSelected
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                  }`}
                >
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
