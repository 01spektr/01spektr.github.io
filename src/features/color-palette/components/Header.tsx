import React from 'react';
import { Palette, Zap, ShieldCheck, Infinity as InfinityIcon, ChevronRight, Home } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="mb-6">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 mb-4 font-medium">
        <span className="flex items-center gap-1.5 hover:text-blue-600 transition-colors cursor-pointer">
          <Home className="w-3.5 h-3.5" />
          Главная
        </span>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="hover:text-blue-600 transition-colors cursor-pointer">Категории</span>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="hover:text-blue-600 transition-colors cursor-pointer">Дизайн и полиграфия</span>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="text-slate-700 font-semibold">Палитра цветов</span>
      </nav>

      {/* Main Header Card */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        {/* Title & Description */}
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 flex items-center justify-center shadow-md shadow-pink-500/20 shrink-0 text-white">
            <Palette className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Палитра цветов</h1>
            <p className="text-slate-600 text-sm mt-1 max-w-2xl leading-relaxed">
              Подбор гармоничных цветов для бренда и печати.
              <br className="hidden sm:inline" />
              Создавайте красивые цветовые сочетания, настраивайте их и используйте в своих проектах.
            </p>
          </div>
        </div>

        {/* Feature Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 shrink-0">
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 fill-blue-600" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 leading-none">Быстро</div>
              <div className="text-[11px] text-slate-500 mt-1 leading-none">Генерация в один клик</div>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 leading-none">Удобно</div>
              <div className="text-[11px] text-slate-500 mt-1 leading-none">Готовые цветовые схемы</div>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <InfinityIcon className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 leading-none">Профессионально</div>
              <div className="text-[11px] text-slate-500 mt-1 leading-none">HEX, RGB, HSL, CMYK</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
