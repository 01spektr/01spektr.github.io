import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Download,
  Award,
} from 'lucide-react';
import { MathSolution } from '../types/math';
import { MathView } from './MathView';
import { useLanguage } from '../context/LanguageContext';

interface SolutionViewProps {
  solution: MathSolution;
  onOpenPrint: () => void;
  onOpenQuiz: () => void;
}

export const SolutionView: React.FC<SolutionViewProps> = ({
  solution,
  onOpenPrint,
  onOpenQuiz,
}) => {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<'step_by_step' | 'short'>('step_by_step');
  const [collapsedSteps, setCollapsedSteps] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState<boolean>(false);

  const toggleStep = (id: number) => {
    setCollapsedSteps((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCopyAnswer = () => {
    navigator.clipboard.writeText(solution.finalAnswerText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="solution-view-card"
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs p-5 sm:p-6 mt-6 transition-all scroll-mt-6"
    >
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-2xs">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">{t.solution.title}</h2>
        </div>

        {/* Action Controls: Download PDF, Quiz, Mode Selector */}
        <div className="flex items-center gap-2 text-xs">
          {/* Quiz Button (Feature 4) */}
          <button
            onClick={onOpenQuiz}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60 rounded-lg font-medium transition cursor-pointer"
            title={t.solution.quizBtn}
          >
            <Award className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>{t.solution.quizBtn}</span>
          </button>

          {/* PDF Download Button */}
          <button
            onClick={onOpenPrint}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg font-medium transition cursor-pointer"
            title={t.solution.printBtn}
          >
            <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="hidden sm:inline">{t.solution.printBtn}</span>
          </button>

          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 pl-1 border-l border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 dark:text-slate-500 hidden md:inline">{t.solution.viewLabel}</span>
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as any)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="step_by_step">{t.solution.stepByStep}</option>
              <option value="short">{t.solution.shortAnswer}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Steps List */}
      <div className="mt-4 space-y-3">
        {viewMode === 'short' ? (
          <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/90 dark:border-emerald-800/60 rounded-xl p-4 sm:p-5">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                ✓
              </span>
              <span className="text-sm font-bold text-emerald-900 dark:text-emerald-300">{t.solution.finalAnswer}</span>
            </div>
            <div className="text-base sm:text-lg font-serif text-slate-900 dark:text-white pl-8">
              <MathView latex={solution.finalAnswerLatex} />
            </div>
          </div>
        ) : (
          <>
            {/* Step 1: Исходное уравнение */}
            <div className="bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 rounded-xl p-3.5 sm:p-4 hover:border-slate-300 dark:hover:border-slate-700 transition">
              <div
                onClick={() => toggleStep(1)}
                className="flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 font-semibold text-xs flex items-center justify-center shrink-0">
                    1
                  </span>
                  <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">{t.solution.step1}</h3>
                </div>
                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1">
                  {collapsedSteps[1] ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </button>
              </div>
              {!collapsedSteps[1] && (
                <div className="mt-2.5 pl-9">
                  <div className="text-base sm:text-lg font-serif text-slate-900 dark:text-slate-100">
                    <MathView latex={solution.canonicalForm || solution.originalInput} />
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Разложим на множители / Преобразование */}
            <div className="bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 rounded-xl p-3.5 sm:p-4 hover:border-slate-300 dark:hover:border-slate-700 transition">
              <div
                onClick={() => toggleStep(2)}
                className="flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 font-semibold text-xs flex items-center justify-center shrink-0">
                    2
                  </span>
                  <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                    {solution.type === 'factor' || solution.type === 'equation'
                      ? t.solution.step2Factor
                      : t.solution.step2Transform}
                  </h3>
                </div>
                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1">
                  {collapsedSteps[2] ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </button>
              </div>
              {!collapsedSteps[2] && (
                <div className="mt-2.5 pl-9">
                  <div className="text-base sm:text-lg font-serif text-slate-900 dark:text-slate-100">
                    {solution.plotData?.roots && solution.plotData.roots.length === 2 ? (
                      <MathView
                        latex={`(x - ${solution.plotData.roots[0].x >= 0 ? solution.plotData.roots[0].x : `(${solution.plotData.roots[0].x})`})(x - ${solution.plotData.roots[1].x >= 0 ? solution.plotData.roots[1].x : `(${solution.plotData.roots[1].x})`}) = 0`}
                      />
                    ) : (
                      <MathView latex={solution.steps[1]?.latex || solution.canonicalForm} />
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: Найдём корни */}
            <div className="bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 rounded-xl p-3.5 sm:p-4 hover:border-slate-300 dark:hover:border-slate-700 transition">
              <div
                onClick={() => toggleStep(3)}
                className="flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 font-semibold text-xs flex items-center justify-center shrink-0">
                    3
                  </span>
                  <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">{t.solution.step3}</h3>
                </div>
                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1">
                  {collapsedSteps[3] ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </button>
              </div>

              {!collapsedSteps[3] && (
                <div className="mt-3 pl-9">
                  {solution.plotData?.roots && solution.plotData.roots.length === 2 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Root Card 1 */}
                      <div className="bg-slate-100/70 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 rounded-xl p-3.5 text-center font-serif">
                        <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                          <MathView
                            latex={`x - ${solution.plotData.roots[0].x} = 0`}
                            displayMode={false}
                          />
                        </div>
                        <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                          <MathView
                            latex={`x_1 = ${solution.plotData.roots[0].x}`}
                            displayMode={false}
                          />
                        </div>
                      </div>

                      {/* Root Card 2 */}
                      <div className="bg-slate-100/70 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 rounded-xl p-3.5 text-center font-serif">
                        <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                          <MathView
                            latex={`x + ${Math.abs(solution.plotData.roots[1].x)} = 0`}
                            displayMode={false}
                          />
                        </div>
                        <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                          <MathView
                            latex={`x_2 = ${solution.plotData.roots[1].x}`}
                            displayMode={false}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm sm:text-base font-serif text-slate-900 dark:text-slate-100 py-1">
                      <MathView latex={solution.steps[2]?.latex || solution.finalAnswerLatex} />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Step 4 (Answer Green Box) */}
            <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 rounded-xl p-4 sm:p-5 flex items-center justify-between transition hover:border-emerald-300 dark:hover:border-emerald-700">
              <div className="flex items-center gap-3.5">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-emerald-950 dark:text-emerald-300 uppercase tracking-wider mb-1">{t.solution.step4}</h4>
                  <div className="text-base sm:text-lg font-serif font-bold text-slate-900 dark:text-white">
                    <MathView latex={solution.finalAnswerLatex} />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenPrint}
                  className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-emerald-100/70 dark:hover:bg-emerald-900/40 rounded-lg transition"
                  title={t.solution.printBtn}
                >
                  <Download className="w-4 h-4 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400" />
                </button>
                <button
                  onClick={handleCopyAnswer}
                  aria-label={t.solution.copyAnswer}
                  className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-emerald-100/70 dark:hover:bg-emerald-900/40 rounded-lg transition"
                  title={copied ? t.solution.copied : t.solution.copyAnswer}
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-600 dark:text-slate-300" />}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
