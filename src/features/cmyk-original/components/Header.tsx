import React from 'react';
import { Target, Zap, Infinity as InfinityIcon, Download } from 'lucide-react';

interface HeaderProps {
  onOpenExport?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenExport }) => {
  return (
    <header className="w-full bg-white border-b border-slate-200/80 py-4 px-4 sm:px-6 lg:px-8 mb-6 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left: Logo and Title */}
        <div className="flex items-start sm:items-center gap-4">
          {/* Logo icon: Magenta rounded box with 3 intersecting Venn circles */}
          <div
            id="app-logo"
            className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-tr from-[#f43f5e] via-[#e11d48] to-[#ec4899] flex items-center justify-center shadow-md shadow-rose-500/20"
          >
            <svg
              className="w-8 h-8 text-white"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Three intersecting circles for CMY/RGB */}
              <circle cx="24" cy="18" r="11" stroke="currentColor" strokeWidth="2.2" strokeOpacity="0.9" />
              <circle cx="17" cy="29" r="11" stroke="currentColor" strokeWidth="2.2" strokeOpacity="0.9" />
              <circle cx="31" cy="29" r="11" stroke="currentColor" strokeWidth="2.2" strokeOpacity="0.9" />
            </svg>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              RGB <span className="text-slate-400 font-normal">→</span> CMYK
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-relaxed">
              <span className="font-semibold text-slate-800">Перевод цветов в печатную модель CMYK.</span>{' '}
              <span className="text-slate-500">
                Узнайте, как ваш цвет будет выглядеть при печати. Подходит для дизайна, полиграфии и подготовки макетов.
              </span>
            </p>
          </div>
        </div>

        {/* Right: Badges & Prominent Export Button */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap lg:flex-nowrap">
          {/* Prominent Export Button */}
          {onOpenExport && (
            <button
              id="header-export-btn"
              type="button"
              onClick={onOpenExport}
              className="order-first lg:order-none flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-98"
            >
              <Download className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">Экспорт для печати</span>
              <span className="hidden sm:inline-block text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-normal whitespace-nowrap">
                PDF / SVG / EPS
              </span>
            </button>
          )}

          {/* Badge 1: Точно */}
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 hover:bg-slate-100/70 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <Target className="w-4 h-4" />
            </div>
            <div className="leading-tight">
              <div className="text-xs font-bold text-slate-900">Точно</div>
              <div className="text-[11px] text-slate-500 whitespace-nowrap">Надёжное преобразование</div>
            </div>
          </div>

          {/* Badge 2: Быстро */}
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 hover:bg-slate-100/70 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 fill-blue-600/30" />
            </div>
            <div className="leading-tight">
              <div className="text-xs font-bold text-slate-900">Быстро</div>
              <div className="text-[11px] text-slate-500 whitespace-nowrap">Мгновенный результат</div>
            </div>
          </div>

          {/* Badge 3: Бесплатно */}
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 hover:bg-slate-100/70 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <InfinityIcon className="w-4 h-4" />
            </div>
            <div className="leading-tight">
              <div className="text-xs font-bold text-slate-900">Бесплатно</div>
              <div className="text-[11px] text-slate-500 whitespace-nowrap">Без регистрации</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
