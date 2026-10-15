import React, { useState, useEffect } from 'react';
import { X, Award, CheckCircle2, AlertCircle, ArrowRight, RefreshCw, HelpCircle, Trophy } from 'lucide-react';
import { MathView } from './MathView';
import { ActiveCategory } from '../types/math';
import { useLanguage } from '../context/LanguageContext';

interface QuizTrainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: ActiveCategory;
}

interface Question {
  type: string;
  problemLatex: string;
  problemRaw: string;
  expectedAnswers: string[]; // accepted string variants
  hint: string;
  solutionLatex: string;
}

export const QuizTrainerModal: React.FC<QuizTrainerModalProps> = ({
  isOpen,
  onClose,
  category,
}) => {
  const { t } = useLanguage();
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [showSolution, setShowSolution] = useState<boolean>(false);

  // Generate question according to selected category
  const generateQuestion = () => {
    setStatus('idle');
    setUserAnswer('');
    setShowSolution(false);

    if (category === 'derivatives') {
      const a = Math.floor(Math.random() * 4) + 2;
      const b = Math.floor(Math.random() * 6) + 1;
      const sign = Math.random() > 0.5 ? '+' : '-';
      const bSigned = sign === '+' ? b : -b;
      setCurrentQuestion({
        type: 'Производная функции',
        problemLatex: `f(x) = ${a}x^2 ${sign} ${b}x`,
        problemRaw: `d/dx (${a}x^2 ${sign} ${b}x)`,
        expectedAnswers: [
          `${2 * a}x${sign}${b}`,
          `${2 * a}x ${sign} ${b}`,
          `${2 * a}*x${sign}${b}`,
        ],
        hint: `Используйте правило степени: (x²)' = 2x, (${b}x)' = ${b}`,
        solutionLatex: `f'(x) = ${2 * a}x ${sign} ${b}`,
      });
      return;
    }

    if (category === 'equations' || category === 'inequalities') {
      const a = Math.floor(Math.random() * 4) + 2;
      const xVal = Math.floor(Math.random() * 10) - 4;
      const b = -a * xVal;
      const bSign = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
      setCurrentQuestion({
        type: 'Линейное уравнение',
        problemLatex: `${a}x ${bSign} = 0`,
        problemRaw: `${a}x ${bSign} = 0`,
        expectedAnswers: [`${xVal}`, `x=${xVal}`, `x = ${xVal}`],
        hint: `Перенесите свободный член вправо: ${a}x = ${-b}, затем разделите на ${a}`,
        solutionLatex: `x = \\frac{${-b}}{${a}} = ${xVal}`,
      });
      return;
    }

    // Default: Quadratic equation with nice integer roots
    const r1 = Math.floor(Math.random() * 7) - 3; // e.g. 3
    let r2 = Math.floor(Math.random() * 7) - 3; // e.g. -2
    if (r1 === r2) r2 += 1;

    // x^2 - (r1+r2)x + r1*r2 = 0
    const b = -(r1 + r2);
    const c = r1 * r2;
    const bSign = b === 0 ? '' : b > 0 ? `+ ${b === 1 ? '' : b}x` : `- ${b === -1 ? '' : Math.abs(b)}x`;
    const cSign = c === 0 ? '' : c > 0 ? `+ ${c}` : `- ${Math.abs(c)}`;

    const problemLatex = `x^2 ${bSign} ${cSign} = 0`.replace(/\s+/g, ' ');

    setCurrentQuestion({
      type: 'Квадратное уравнение',
      problemLatex,
      problemRaw: problemLatex,
      expectedAnswers: [
        `${r1}, ${r2}`,
        `${r2}, ${r1}`,
        `${r1},${r2}`,
        `${r2},${r1}`,
        `x1=${r1}, x2=${r2}`,
        `x1=${r2}, x2=${r1}`,
        `${r1} и ${r2}`,
        `${r2} и ${r1}`,
        `${r1} ${r2}`,
        `${r2} ${r1}`,
      ],
      hint: `Теорема Виета: x₁ + x₂ = ${-b}, x₁ · x₂ = ${c}`,
      solutionLatex: `x_1 = ${Math.max(r1, r2)}, \\quad x_2 = ${Math.min(r1, r2)}`,
    });
  };

  useEffect(() => {
    if (isOpen) {
      generateQuestion();
    }
  }, [isOpen, category]);

  const handleCheck = () => {
    if (!currentQuestion) return;
    const cleanUser = userAnswer.trim().replace(/\s+/g, ' ').toLowerCase();

    const isMatch = currentQuestion.expectedAnswers.some(
      (ans) => ans.toLowerCase().replace(/\s+/g, ' ') === cleanUser
    );

    if (isMatch) {
      setStatus('correct');
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
    } else {
      setStatus('wrong');
      setStreak(0);
    }
  };

  if (!isOpen || !currentQuestion) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={onClose} />

      <div className="relative bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 p-6 z-10 animate-in fade-in zoom-in-95 transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{t.modals.quiz.title}</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.modals.quiz.subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Streak Bar */}
        <div className="mt-4 flex items-center justify-between bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 rounded-xl px-4 py-2 text-xs text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="font-semibold">{t.modals.quiz.streak} {streak}</span>
          </div>
          <span className="text-amber-700 dark:text-amber-400">{t.modals.quiz.record} {bestStreak}</span>
        </div>

        {/* Question Card */}
        <div className="mt-4 bg-slate-50/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
            {currentQuestion.type}
          </span>
          <div className="text-xl sm:text-2xl font-serif text-slate-900 dark:text-white py-2">
            <MathView latex={currentQuestion.problemLatex} />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {t.modals.quiz.placeholder}
          </p>
        </div>

        {/* Input & Check */}
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCheck();
              }}
              placeholder={t.modals.quiz.placeholder}
              className="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            />
            <button
              onClick={handleCheck}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
            >
              {t.modals.quiz.check}
            </button>
          </div>

          {/* Feedback */}
          {status === 'correct' && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl flex items-center gap-2.5 text-xs text-emerald-900 dark:text-emerald-200 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <strong className="block">{t.modals.quiz.correct}</strong>
                <span>{userAnswer}</span>
              </div>
            </div>
          )}

          {status === 'wrong' && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-xl flex items-center gap-2.5 text-xs text-rose-900 dark:text-rose-200 animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
              <div>
                <strong className="block">{t.modals.quiz.wrong}</strong>
                <span>{currentQuestion.hint}</span>
              </div>
            </div>
          )}

          {/* Solution display */}
          {showSolution && (
            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 rounded-xl text-xs text-blue-900 dark:text-blue-200 animate-in fade-in">
              <span className="font-bold block mb-1">{t.solution.title}:</span>
              <div className="font-serif text-sm">
                <MathView latex={currentQuestion.solutionLatex} />
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={() => setShowSolution(!showSolution)}
            className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{showSolution ? t.modals.quiz.hideSolution : t.modals.quiz.showSolution}</span>
          </button>

          <button
            onClick={generateQuestion}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{t.modals.quiz.nextProblem}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
