import React from 'react';
import { X, CheckCircle2, AlertTriangle, Printer, Scan, ShieldCheck } from 'lucide-react';

interface TipsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TipsModal: React.FC<TipsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      id="tips-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="tips-modal-dialog"
        className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-xl w-full p-6 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <Scan className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Советы по штрихкодированию</h3>
              <p className="text-xs text-slate-500">Руководство по идеальной печати и считыванию</p>
            </div>
          </div>
          <button
            id="close-tips-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Закрыть"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-4 text-sm text-slate-600 max-h-[70vh] overflow-y-auto pr-1">
          <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-100">
            <div className="flex items-center gap-2 text-blue-800 font-semibold mb-1">
              <Printer className="w-4 h-4 text-blue-600" />
              <span>1. Векторный формат для полиграфии</span>
            </div>
            <p className="text-xs text-slate-600">
              Для печати на упаковке, этикетках и термопринтерах скачивайте штрихкод в формате <strong>SVG</strong>. Это предотвратит размытие краев штрихов и обеспечит максимальный класс считываемости (Grade A/ISO 15416).
            </p>
          </div>

          <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-100">
            <div className="flex items-center gap-2 text-emerald-800 font-semibold mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>2. Поля безопасности (Quiet Zone)</span>
            </div>
            <p className="text-xs text-slate-600">
              Слева и справа от штрихкода всегда должна оставаться свободная белая область шириной не менее 2.5–3.5 мм (для EAN-13 — не менее 11 модулей). Никогда не обрезайте эти поля!
            </p>
          </div>

          <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-100">
            <div className="flex items-center gap-2 text-amber-800 font-semibold mb-1">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>3. Контрастность и цветопередача</span>
            </div>
            <p className="text-xs text-slate-600">
              Лазерные сканеры работают в красном спектре (~630–670 нм). Поэтому штрихи должны быть черными или темно-синими на строго белом или желтом фоне. Никогда не делайте красные штрихи на белом фоне — лазер их "не увидит"!
            </p>
          </div>

          <div className="border-t border-slate-100 pt-3">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Чек-лист перед отправкой в тираж
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Проверьте штрихкод реальным сканером или камерой смартфона в тестовом образце</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Убедитесь в соответствии пропорций (минимальная высота штрихов EAN-13 — 22.85 мм по стандарту)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Контрольная сумма должна строго совпадать с данными в учетной системе (1С, ERP)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            id="tips-modal-ok-btn"
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors cursor-pointer"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
