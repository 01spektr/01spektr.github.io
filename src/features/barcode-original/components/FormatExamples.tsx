import React, { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import { useI18n } from '@/lib/i18n';

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
    formatId: 'EAN-13',
    name: 'EAN-13',
    sampleValue: '4780123456781',
    jsFormat: 'EAN13',
  },
  {
    formatId: 'EAN-8',
    name: 'EAN-8',
    sampleValue: '45678901',
    jsFormat: 'EAN8',
  },
  {
    formatId: 'Code128',
    name: 'Code 128',
    sampleValue: 'Toolboxi',
    jsFormat: 'CODE128',
  },
  {
    formatId: 'Code39',
    name: 'Code 39',
    sampleValue: 'TOOLBOXI',
    jsFormat: 'CODE39',
  },
  {
    formatId: 'ITF-14',
    name: 'ITF-14',
    sampleValue: '04780123456789',
    jsFormat: 'ITF14',
    hasBearerBox: true,
  },
];

export const FormatExamples: React.FC<FormatExamplesProps> = ({
  currentFormatId,
  onSelectFormat,
}) => {
  const { locale } = useI18n();
  const en = locale === 'en';
  const svgRefs = useRef<(SVGSVGElement | null)[]>([]);

  useEffect(() => {
    EXAMPLES.forEach((item, index) => {
      const svg = svgRefs.current[index];
      if (svg) {
        try {
          JsBarcode(svg, item.sampleValue, {
            format: item.jsFormat,
            width: item.formatId === 'ITF-14' || item.formatId === 'Code39' ? 0.95 : 1.1,
            height: 28,
            displayValue: true,
            fontSize: 9,
            margin: 2,
            textMargin: 1,
            lineColor: '#0f172a',
            font: 'monospace',
          });
        } catch (e) {
          console.warn('Mini barcode render error:', item.formatId, e);
        }
      }
    });
  }, []);

  return (
    <div
      id="format-examples-card"
      className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-900">
          {en ? 'Other barcode formats' : 'Примеры других форматов'}
        </h3>
        <span className="text-xs text-slate-400 hidden sm:inline">
          {en ? 'Click to select' : 'Нажмите для быстрого выбора'}
        </span>
      </div>

      {/* 5 Barcode items neatly in a row, proportioned to barcode dimensions */}
      <div className="overflow-x-auto pb-1 -mx-1 px-1">
        <div className="grid grid-cols-5 gap-2.5 sm:gap-3.5 min-w-[500px] sm:min-w-0">
          {EXAMPLES.map((item, idx) => {
            const isSelected = currentFormatId === item.formatId;
            return (
              <button
                key={item.formatId}
                id={`example-format-btn-${item.formatId.toLowerCase()}`}
                onClick={() => onSelectFormat(item.formatId, item.sampleValue)}
                className={`group flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50/40 ring-2 ring-blue-500/20 shadow-2xs'
                    : 'border-slate-200/90 bg-white hover:border-blue-300 hover:bg-slate-50/70 hover:shadow-2xs'
                }`}
              >
                <div className="w-full flex items-center justify-center py-1 px-1 bg-slate-50/70 rounded-lg group-hover:bg-white transition-colors">
                  <svg
                    ref={(el) => {
                      svgRefs.current[idx] = el;
                    }}
                    className={`max-h-[36px] w-auto max-w-full object-contain mx-auto ${
                      item.hasBearerBox ? 'border-2 border-slate-900 p-0.5 rounded-xs' : ''
                    }`}
                  />
                </div>
                <span
                  className={`mt-1.5 text-xs font-semibold tracking-tight transition-colors ${
                    isSelected ? 'text-blue-600' : 'text-slate-700 group-hover:text-blue-600'
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
