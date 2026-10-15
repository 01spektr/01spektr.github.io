import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import {
  ChevronRight,
  Calculator,
  Star,
  Share2,
  Check,
  Zap,
  Bookmark,
  Sparkles,
  FileDown,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { localeHomePath, localizedCategoryPath } from '@/lib/i18n/config';

interface MathHeroBannerProps {
  favorite: boolean;
  onToggleFavorite: () => void;
  onOpenCheatSheets: () => void;
  onOpenSamples?: () => void;
  onOpenPrint?: () => void;
  onShare: () => Promise<void>;
}

export const MathHeroBanner: React.FC<MathHeroBannerProps> = ({
  favorite,
  onToggleFavorite,
  onOpenCheatSheets,
  onOpenSamples,
  onOpenPrint,
  onShare,
}) => {
  const { locale } = useI18n();
  const [copied, setCopied] = useState(false);

  const labels = {
    ru: {
      home: 'Главная',
      category: 'Математика и точные науки',
      title: 'Математический калькулятор',
      subtitle:
        'Пошаговый онлайн-решатель уравнений, неравенств, интегралов, производных и построитель графиков функций.',
      favAdd: 'В избранное',
      favRemove: 'В избранном',
      cheatsheets: 'Шпаргалки',
      share: 'Поделиться',
      copied: 'Скопировано!',
      b1Title: 'CAS Engine 2026',
      b1Desc: 'Символьные вычисления',
      b2Title: '50+ типов задач',
      b2Desc: 'Алгебра, анализ, матрицы',
      b3Title: 'PDF конспект',
      b3Desc: 'Скачать пошаговое решение',
    },
    uz: {
      home: 'Bosh sahifa',
      category: 'Matematika va aniq fanlar',
      title: 'Matematik kalkulyator',
      subtitle:
        'Tenglamalar, tengsizliklar, integrallar, hosilalar va funksiya grafiklarini bosqichma-bosqich yechish.',
      favAdd: 'Saralangan',
      favRemove: 'Saralangan',
      cheatsheets: 'Shpargalkalar',
      share: 'Ulashish',
      copied: 'Nusxalandi!',
      b1Title: 'CAS Engine 2026',
      b1Desc: 'Simvolli hisoblash',
      b2Title: '50+ masalalar turi',
      b2Desc: 'Algebra, tahlil, matritsalar',
      b3Title: 'PDF konspekt',
      b3Desc: 'Bosqichma-bosqich yuklash',
    },
    en: {
      home: 'Home',
      category: 'Math & exact sciences',
      title: 'Math Solver & Calculator',
      subtitle:
        'Step-by-step solver for equations, inequalities, integrals, derivatives, and interactive 2D function graphs.',
      favAdd: 'Bookmark',
      favRemove: 'Saved',
      cheatsheets: 'Cheat Sheets',
      share: 'Share',
      copied: 'Copied!',
      b1Title: 'CAS Engine 2026',
      b1Desc: 'Symbolic math solving',
      b2Title: '50+ Problem Types',
      b2Desc: 'Algebra, calculus, matrices',
      b3Title: 'PDF Summary',
      b3Desc: 'Export step-by-step notes',
    },
  }[locale] || {
    home: 'Home',
    category: 'Math & exact sciences',
    title: 'Math Solver & Calculator',
    subtitle:
      'Step-by-step solver for equations, inequalities, integrals, derivatives, and interactive 2D function graphs.',
    favAdd: 'Bookmark',
    favRemove: 'Saved',
    cheatsheets: 'Cheat Sheets',
    share: 'Share',
    copied: 'Copied!',
    b1Title: 'CAS Engine 2026',
    b1Desc: 'Symbolic math solving',
    b2Title: '50+ Problem Types',
    b2Desc: 'Algebra, calculus, matrices',
    b3Title: 'PDF Summary',
    b3Desc: 'Export step-by-step notes',
  };

  const handleShareClick = async () => {
    await onShare();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full mb-5">
      {/* Top bar: Breadcrumbs & Quick Actions */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <nav
          aria-label="Breadcrumb"
          className="flex min-w-0 items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-inter overflow-x-auto whitespace-nowrap scrollbar-none"
        >
          <Link
            to={localeHomePath(locale)}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors shrink-0"
          >
            {labels.home}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-slate-600" />
          <Link
            to={localizedCategoryPath('math', locale)}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors shrink-0"
          >
            {labels.category}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-slate-600" />
          <span className="truncate text-slate-700 dark:text-slate-200 font-medium">
            {labels.title}
          </span>
        </nav>

        {/* Favorite, Cheat sheets & Share actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Cheat sheets button */}
          <button
            type="button"
            onClick={onOpenCheatSheets}
            className="inline-flex h-9 items-center gap-1.5 px-3 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Bookmark className="h-3.5 w-3.5 text-indigo-500" />
            <span>{labels.cheatsheets}</span>
          </button>

          {/* Favorite Button */}
          <button
            type="button"
            onClick={onToggleFavorite}
            className={`inline-flex h-9 items-center gap-1.5 rounded-xl border px-3 text-xs font-semibold shadow-2xs transition-colors cursor-pointer ${
              favorite
                ? 'border-amber-200/90 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
                : 'border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
          >
            <Star
              className="h-3.5 w-3.5"
              fill={favorite ? 'currentColor' : 'none'}
            />
            <span>{favorite ? labels.favRemove : labels.favAdd}</span>
          </button>

          {/* Share Button */}
          <button
            type="button"
            onClick={handleShareClick}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-emerald-600 dark:text-emerald-400">
                  {labels.copied}
                </span>
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                <span>{labels.share}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Hero Card Compacted Strictly Like Benchmark */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left: Icon & 1-Row Title */}
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-2xs shrink-0 font-serif font-bold text-lg">
              <Calculator className="w-6 h-6 stroke-[2.2]" />
            </div>

            <div>
              <h1 className="font-heading text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-snug sm:whitespace-nowrap">
                {labels.title}
              </h1>
              <p className="font-body text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 mt-0.5 max-w-xl leading-relaxed font-inter">
                {labels.subtitle}
              </p>
            </div>
          </div>

          {/* Right: 3 Feature Badges matching benchmark */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full lg:w-auto shrink-0 font-inter">
            {/* Badge 1 */}
            <div className="min-w-0 bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/80 rounded-xl px-2.5 sm:px-3 py-2 flex items-center gap-2 sm:gap-2.5 transition-colors">
              <div className="w-7 h-7 rounded-lg bg-indigo-100/70 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <p className="font-heading text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight truncate">
                  {labels.b1Title}
                </p>
                <p className="font-body text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight truncate">
                  {labels.b1Desc}
                </p>
              </div>
            </div>

            {/* Badge 2: 50+ типов задач */}
            <button
              type="button"
              onClick={onOpenSamples}
              className="text-left min-w-0 bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/80 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50/30 dark:hover:bg-slate-800/90 rounded-xl px-2.5 sm:px-3 py-2 flex items-center gap-2 sm:gap-2.5 transition-all cursor-pointer group"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-100/70 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 group-hover:scale-105 flex items-center justify-center shrink-0 transition-transform">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <p className="font-heading text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 leading-tight truncate transition-colors">
                  {labels.b2Title}
                </p>
                <p className="font-body text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight truncate">
                  {labels.b2Desc}
                </p>
              </div>
            </button>

            {/* Badge 3: PDF конспект / Шаги решения */}
            <button
              type="button"
              onClick={onOpenPrint}
              className="hidden sm:flex text-left min-w-0 bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/80 hover:border-emerald-300 dark:hover:border-emerald-600 hover:bg-emerald-50/30 dark:hover:bg-slate-800/90 rounded-xl px-3 py-2 items-center gap-2.5 transition-all cursor-pointer group"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-100/70 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 flex items-center justify-center shrink-0 transition-transform">
                <FileDown className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <p className="font-heading text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 leading-tight truncate transition-colors">
                  {labels.b3Title}
                </p>
                <p className="font-body text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight truncate">
                  {labels.b3Desc}
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
