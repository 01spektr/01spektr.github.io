import React, { useState } from 'react';
import {
  Check,
  Copy,
  CheckCircle2,
  RotateCcw,
  Binary,
  Layers,
  LineChart,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { MathSolution } from '../types/math';

interface MathMetricsCardsProps {
  categoryTitle: string;
  solution: MathSolution | null;
  onReset: () => void;
  onScrollToSteps?: () => void;
}

export const MathMetricsCards: React.FC<MathMetricsCardsProps> = ({
  categoryTitle,
  solution,
  onReset,
  onScrollToSteps,
}) => {
  const { locale } = useI18n();
  const [copied, setCopied] = useState(false);

  const stepsCount = solution?.steps?.length || 0;
  const answerPreview = solution?.finalAnswerText || '—';
  const hasPlot = Boolean(solution?.plotData);

  const labels = {
    ru: {
      statusSuccess: 'Символьный CAS движок 2026 активен · Точные вычисления в браузере',
      copySummary: 'Скопировать ответ',
      copied: 'Скопировано!',
      reset: 'Сбросить',
      card1Title: 'Активный раздел',
      card1Sub: 'Символьные методы',
      card2Title: 'Шаги решения',
      card2Sub: `${stepsCount} ${stepsCount === 1 ? 'шаг' : stepsCount < 5 ? 'шага' : 'шагов'} доказательства`,
      card3Title: 'Итоговый результат',
      card3Sub: hasPlot ? '2D график f(x) доступен' : 'Аналитический ответ',
    },
    uz: {
      statusSuccess: 'Simvolli CAS 2026 dvigateli faol · Brauzerda aniq hisoblash',
      copySummary: 'Javobni nusxalash',
      copied: 'Nusxalandi!',
      reset: 'Qayta o‘rnatish',
      card1Title: 'Faol bo‘lim',
      card1Sub: 'Simvolli usullar',
      card2Title: 'Yechim bosqichlari',
      card2Sub: `${stepsCount} ta yechim bosqichi`,
      card3Title: 'Yakuniy natija',
      card3Sub: hasPlot ? '2D f(x) grafigi mavjud' : 'Analitik javob',
    },
    en: {
      statusSuccess: 'Symbolic CAS Engine 2026 active · In-browser analytical precision',
      copySummary: 'Copy Answer',
      copied: 'Copied!',
      reset: 'Reset',
      card1Title: 'Active Toolset',
      card1Sub: 'Symbolic methods',
      card2Title: 'Solution Steps',
      card2Sub: `${stepsCount} step-by-step proofs`,
      card3Title: 'Final Result',
      card3Sub: hasPlot ? '2D plot ready' : 'Closed form answer',
    },
  }[locale] || {
    statusSuccess: 'Symbolic CAS Engine 2026 active · In-browser analytical precision',
    copySummary: 'Copy Answer',
    copied: 'Copied!',
    reset: 'Reset',
    card1Title: 'Active Toolset',
    card1Sub: 'Symbolic methods',
    card2Title: 'Solution Steps',
    card2Sub: `${stepsCount} step-by-step proofs`,
    card3Title: 'Final Result',
    card3Sub: hasPlot ? '2D plot ready' : 'Closed form answer',
  };

  const handleCopy = () => {
    if (!solution) return;
    const summaryText = [
      `Toolboxi.uz - ${categoryTitle}`,
      `Выражение: ${solution.originalInput}`,
      `Ответ: ${solution.finalAnswerText}`,
      `Шагов решения: ${stepsCount}`,
    ].join('\n');

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        {/* Card 1: Active Section */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-4.5 shadow-2xs transition-colors flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-100/60 dark:border-indigo-900/50">
            <Binary className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider font-inter">
              {labels.card1Title}
            </div>
            <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-heading tracking-tight leading-tight mt-0.5 truncate">
              {categoryTitle}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-inter">
              {labels.card1Sub}
            </div>
          </div>
        </div>

        {/* Card 2: Solution Steps / Calculation Breakdown */}
        <button
          type="button"
          onClick={() => {
            if (onScrollToSteps) {
              onScrollToSteps();
            } else {
              document.getElementById('solution-view-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
          className="text-left bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-xs rounded-2xl p-4 sm:p-4.5 shadow-2xs transition-all flex items-center gap-3.5 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/60 flex items-center justify-center shrink-0 border border-blue-100/60 dark:border-blue-900/50 transition-colors">
            <Layers className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider font-inter group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {labels.card2Title}
            </div>
            <div className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400 font-heading tracking-tight leading-tight mt-0.5">
              {stepsCount > 0 ? `${stepsCount} этапа` : 'Готово'}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-inter">
              {labels.card2Sub}
            </div>
          </div>
        </button>

        {/* Card 3: Final Answer / Plot */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-4.5 shadow-2xs transition-colors flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100/60 dark:border-emerald-900/50">
            <LineChart className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider font-inter">
              {labels.card3Title}
            </div>
            <div className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400 font-heading tracking-tight leading-tight mt-0.5 truncate font-mono">
              {answerPreview}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-inter">
              {labels.card3Sub}
            </div>
          </div>
        </div>
    </div>
  );
};
