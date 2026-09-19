import React from 'react';
import { Link } from '@tanstack/react-router';
import { Home, ChevronRight, Zap, BarChart2, Calculator } from 'lucide-react';
import { ToolIcon } from '@/components/tool-icon';

interface HeroSectionProps {
  t: {
    home: string;
    finance: string;
    currencyRates: string;
    title: string;
    description: string;
    badge1Title: string;
    badge1Desc: string;
    badge2Title: string;
    badge2Desc: string;
    badge3Title: string;
    badge3Desc: string;
  };
}

export const HeroSection: React.FC<HeroSectionProps> = ({ t }) => {
  return (
    <section className="relative pt-4 sm:pt-6 pb-2 sm:pb-4">
      {/* Subtle world map background watermark */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.035] bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:16px_16px] -z-10"
      />

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-500 mb-3 sm:mb-5 font-normal overflow-x-auto whitespace-nowrap scrollbar-none pb-1">
        <Link to="/" className="hover:text-blue-600 flex items-center gap-1 transition-colors">
          <Home className="w-3.5 h-3.5 text-slate-400" />
          <span>{t.home}</span>
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
        <Link to="/categories/$id" params={{ id: "finance" }} className="hover:text-blue-600 transition-colors">
          {t.finance}
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
        <span className="font-semibold text-slate-800">
          {t.currencyRates}
        </span>
      </nav>

      {/* Main Hero Header Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6 relative">
        {/* Left: Icon & Title */}
        <div className="flex items-start gap-3 sm:gap-4">
          <ToolIcon tool={{ slug: 'currency-rates', icon: 'ArrowLeftRight' }} size="hero" />

          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight font-montserrat">
              {t.title}
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5 sm:mt-1 max-w-xl leading-relaxed">
              {t.description}
            </p>
          </div>
        </div>

        {/* Right: 3 Feature Badges */}
        <div className="w-full lg:w-auto relative">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 w-full lg:w-auto">
            {/* Feature 1 */}
            <div className="bg-white border border-slate-200/80 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 flex items-center gap-3 shadow-2xs hover:shadow-xs transition-shadow">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-blue-600/15" />
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900 leading-tight">{t.badge1Title}</div>
                <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">{t.badge1Desc}</div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white border border-slate-200/80 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 flex items-center gap-3 shadow-2xs hover:shadow-xs transition-shadow">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <BarChart2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900 leading-tight">{t.badge2Title}</div>
                <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">{t.badge2Desc}</div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white border border-slate-200/80 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 flex items-center gap-3 shadow-2xs hover:shadow-xs transition-shadow">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Calculator className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900 leading-tight">{t.badge3Title}</div>
                <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">{t.badge3Desc}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
