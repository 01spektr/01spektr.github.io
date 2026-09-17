import React from 'react';
import { X, Check, BookOpen, AlertCircle } from 'lucide-react';
import { BarcodeFormatInfo } from '../utils/barcode';
import { useI18n } from '@/lib/i18n';

interface FormatInfoModalProps {
  format: BarcodeFormatInfo | null;
  isOpen: boolean;
  onClose: () => void;
}

export const FormatInfoModal: React.FC<FormatInfoModalProps> = ({
  format,
  isOpen,
  onClose
}) => {
  const { locale } = useI18n();
  const en = locale === 'en';
  const tr = (ru: string, english: string) => en ? english : ru;
  if (!isOpen || !format) return null;

  const english = ENGLISH_FORMATS[format.id] ?? ENGLISH_FORMATS.default;

  return (
    <div
      id="format-info-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="format-info-modal-dialog"
        className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full p-6 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg border border-blue-100">
              #
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">{format.name}</h3>
              <p className="text-xs text-slate-500">{tr('Спецификация и назначение стандарта', 'Standard specification and use')}</p>
            </div>
          </div>
          <button
            id="close-format-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label={tr('Закрыть', 'Close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-4 text-sm text-slate-600 max-h-[70vh] overflow-y-auto pr-1">
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              {tr('Описание формата', 'Format description')}
            </h4>
            <p className="leading-relaxed text-slate-800">{en ? english.description : format.description}</p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
            <div className="flex items-start gap-2">
              <BookOpen className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold text-slate-800">{tr('Область применения: ', 'Typical use: ')}</span>
                <span className="text-slate-600">{en ? english.usage : format.usage}</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold text-slate-800">{tr('Требования к данным: ', 'Data requirements: ')}</span>
                <span className="text-slate-600">{en ? english.hint : format.rulesHint}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              {tr('Преимущества стандарта', 'Standard benefits')}
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{tr('Международное признание сканерами всех производителей (Honeywell, Zebra, Datalogic)', 'Widely supported by scanners from Honeywell, Zebra, Datalogic and other vendors')}</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{tr('Автоматическая валидация контрольной суммы для защиты от ошибок считывания', 'Automatic check-digit validation reduces scanning errors')}</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{tr('Высокая скорость распознавания при любой ориентации луча сканера', 'Fast recognition with common scanner orientations')}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            id="format-modal-ok-btn"
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors cursor-pointer"
          >
            {tr('Понятно', 'Done')}
          </button>
        </div>
      </div>
    </div>
  );
};

const ENGLISH_FORMATS: Record<string, { description: string; usage: string; hint: string }> = {
  'EAN-13': { description: 'The international retail product identifier used worldwide.', usage: 'Retail, supermarkets and finished consumer goods.', hint: 'Enter 12 or 13 digits; the check digit is calculated automatically.' },
  'EAN-8': { description: 'A compact EAN format for products with limited label space.', usage: 'Small retail items, bottles and blister packs.', hint: 'Enter 7 or 8 digits.' },
  Code128: { description: 'A high-density variable-length barcode supporting the full ASCII character set.', usage: 'Logistics, shipping labels, serial numbers and inventory.', hint: 'Use Latin letters, digits and ASCII symbols.' },
  Code39: { description: 'A reliable industrial barcode for uppercase Latin letters, digits and a small symbol set.', usage: 'Industrial assets, automotive and inventory control.', hint: 'Use uppercase Latin letters, digits and - . $ / + %.' },
  'ITF-14': { description: 'A 14-digit shipping-container barcode designed for corrugated packaging.', usage: 'Wholesale boxes, pallets and shipping containers.', hint: 'Enter exactly 13 or 14 digits.' },
  'UPC-A': { description: 'The 12-digit retail product standard used in the United States and Canada.', usage: 'Products intended for the US and Canadian retail markets.', hint: 'Enter 11 or 12 digits.' },
  Codabar: { description: 'A simple discrete barcode with A–D start and stop characters.', usage: 'Libraries, laboratories and courier documents.', hint: 'Start and end with A, B, C or D.' },
  default: { description: 'Barcode standard.', usage: 'Product and logistics identification.', hint: 'Enter valid barcode data.' },
};
