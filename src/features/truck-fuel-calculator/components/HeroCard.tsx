import React from 'react';
import { Calculator, Sliders, PieChart } from 'lucide-react';

interface HeroCardProps {
  t: {
    title: string;
    subtitle: string;
    badge1Title: string;
    badge1Desc: string;
    badge2Title: string;
    badge2Desc: string;
    badge3Title: string;
    badge3Desc: string;
  };
}

export const HeroCard: React.FC<HeroCardProps> = ({ t }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-4 sm:p-6 mb-4 sm:mb-6 transition-colors">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 lg:gap-6">
        {/* Left header with fuel pump icon */}
        <div className="flex items-start sm:items-center gap-3.5 sm:gap-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 border border-blue-100/60 dark:border-blue-900/50 shadow-2xs">
            <svg
              className="w-6 h-6 sm:w-8 sm:h-8 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M19 5h-1V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18h14V11h1a2 2 0 0 1 2 2v6a1 1 0 0 0 2 0v-6a4 4 0 0 0-4-4zm-5 6H6V5h8v6zm4-3a1 1 0 0 1-1-1V5a1 1 0 0 1 2 0v2a1 1 0 0 1-1 1z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              {t.title}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed font-inter">
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* Right 3 feature badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:flex items-center gap-5 xl:gap-6 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
          {/* Item 1 */}
          <div className="flex items-center gap-3 min-h-[44px]">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100/50 dark:border-blue-900/40">
              <Calculator className="w-5 h-5" />
            </div>
            <div className="flex flex-col justify-center">
              <div className="font-bold text-slate-800 dark:text-slate-100 text-xs leading-tight">{t.badge1Title}</div>
              <div className="text-slate-400 dark:text-slate-400 text-[11px] leading-tight mt-0.5">{t.badge1Desc}</div>
            </div>
          </div>

          {/* Item 2 */}
          <div className="flex items-center gap-3 min-h-[44px]">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100/50 dark:border-blue-900/40">
              <Sliders className="w-5 h-5" />
            </div>
            <div className="flex flex-col justify-center">
              <div className="font-bold text-slate-800 dark:text-slate-100 text-xs leading-tight">{t.badge2Title}</div>
              <div className="text-slate-400 dark:text-slate-400 text-[11px] leading-tight mt-0.5">{t.badge2Desc}</div>
            </div>
          </div>

          {/* Item 3 */}
          <div className="flex items-center gap-3 min-h-[44px]">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100/50 dark:border-blue-900/40">
              <PieChart className="w-5 h-5" />
            </div>
            <div className="flex flex-col justify-center">
              <div className="font-bold text-slate-800 dark:text-slate-100 text-xs leading-tight">{t.badge3Title}</div>
              <div className="text-slate-400 dark:text-slate-400 text-[11px] leading-tight mt-0.5">{t.badge3Desc}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
