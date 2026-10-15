import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Calculator,
  LineChart,
  Table as TableIcon,
  Grid as MatrixIcon,
  Bookmark,
  BookOpen,
  Award,
  ArrowRight,
  X,
} from 'lucide-react';
import { ActiveCategory, WorkspaceTab, MathSolution, ActionChipItem } from './types/math';
import { solveMath } from './utils/mathSolver';
import { toolsConfig } from './utils/toolsConfig';
import { MathHeroBanner } from './components/MathHeroBanner';
import { MathMetricsCards } from './components/MathMetricsCards';
import { MathBottomCards } from './components/MathBottomCards';
import { Sidebar } from './components/Sidebar';
import { RightSidebar } from './components/RightSidebar';
import { VirtualKeyboard } from './components/VirtualKeyboard';
import { ActionChips } from './components/ActionChips';
import { SolutionView } from './components/SolutionView';
import { GraphTab } from './components/GraphTab';
import { TableTab } from './components/TableTab';
import { MatrixTab } from './components/MatrixTab';
import { SampleProblemsModal } from './components/SampleProblemsModal';
import { CheatSheetsModal } from './components/CheatSheetsModal';
import { PrintSolutionModal } from './components/PrintSolutionModal';
import { QuizTrainerModal } from './components/QuizTrainerModal';
import { FeedbackModal } from './components/FeedbackModal';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { isFavorite, toggleFavorite } from '@/lib/tools/favorites';
import { recordHistory } from '@/lib/tools/history';
import { buildShareUrl, shareUrl } from '@/lib/tools/share';

function MathSolverContent() {
  const { t } = useLanguage();
  const [activeMathCategory, setActiveMathCategory] = useState<ActiveCategory>('algebra');
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('solve');

  const currentConfig = toolsConfig[activeMathCategory] || toolsConfig.algebra;
  const [activeChipId, setActiveChipId] = useState<string>(
    currentConfig.actionChips[0]?.id || 'equation'
  );

  const [inputFormula, setInputFormula] = useState<string>(currentConfig.defaultExpr);
  const [solution, setSolution] = useState<MathSolution>(() =>
    solveMath(currentConfig.defaultExpr, 'algebra')
  );

  const [favorite, setFavorite] = useState(() => isFavorite('math-solver'));

  // Modals state
  const [isSamplesCatalogOpen, setIsSamplesCatalogOpen] = useState<boolean>(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [isQuizTrainerOpen, setIsQuizTrainerOpen] = useState<boolean>(false);
  const [isCheatSheetsOpen, setIsCheatSheetsOpen] = useState<boolean>(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleToggleFavorite = () => {
    toggleFavorite('math-solver');
    setFavorite(isFavorite('math-solver'));
  };

  const handleSolve = (exprToSolve?: string, categoryToUse?: ActiveCategory) => {
    const target = exprToSolve !== undefined ? exprToSolve : inputFormula;
    if (!target.trim()) return;
    const cat = categoryToUse || activeMathCategory;
    const res = solveMath(target, cat);
    setSolution(res);

    recordHistory({
      toolId: 'math-solver',
      title: `${target} (${(t.sidebar.tools as Record<string, string>)[cat] || cat})`,
      params: { f: target, c: cat },
    });
  };

  const handleReset = () => {
    const cfg = toolsConfig[activeMathCategory] || toolsConfig.algebra;
    setInputFormula(cfg.defaultExpr);
    setActiveChipId(cfg.actionChips[0]?.id || '');
    handleSolve(cfg.defaultExpr, activeMathCategory);
  };

  const handleShare = async () => {
    const params = new URLSearchParams({
      f: inputFormula,
      c: activeMathCategory,
      tab: activeTab,
    });
    const url = buildShareUrl(
      typeof window !== 'undefined' ? window.location.pathname : '/tools/math-solver',
      params
    );
    await shareUrl(url, 'Toolboxi.uz - ' + currentConfig.title);
  };

  // URL query params synchronization on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const params = new URLSearchParams(window.location.search);
      const f = params.get('f');
      const c = params.get('c') as ActiveCategory | null;
      const tab = params.get('tab') as WorkspaceTab | null;

      if (c && toolsConfig[c]) {
        setActiveMathCategory(c);
      }
      if (tab && ['solve', 'graph', 'table', 'matrices'].includes(tab)) {
        setActiveTab(tab);
      }
      if (f) {
        setInputFormula(f);
        handleSolve(f, c || 'algebra');
      }
    } catch {
      // ignore
    }
  }, []);

  const handleInsert = (value: string) => {
    if (!inputRef.current) {
      setInputFormula((prev) => prev + value);
      return;
    }
    const input = inputRef.current;
    const start = input.selectionStart || inputFormula.length;
    const end = input.selectionEnd || inputFormula.length;
    const nextVal = inputFormula.substring(0, start) + value + inputFormula.substring(end);
    setInputFormula(nextVal);

    setTimeout(() => {
      input.focus();
      const nextPos = start + value.length;
      input.setSelectionRange(nextPos, nextPos);
    }, 10);
  };

  const handleBackspace = () => {
    if (!inputRef.current) {
      setInputFormula((prev) => prev.slice(0, -1));
      return;
    }
    const input = inputRef.current;
    const start = input.selectionStart || inputFormula.length;
    const end = input.selectionEnd || inputFormula.length;
    if (start === end && start > 0) {
      const nextVal = inputFormula.substring(0, start - 1) + inputFormula.substring(end);
      setInputFormula(nextVal);
      setTimeout(() => {
        input.focus();
        input.setSelectionRange(start - 1, start - 1);
      }, 10);
    } else if (start !== end) {
      const nextVal = inputFormula.substring(0, start) + inputFormula.substring(end);
      setInputFormula(nextVal);
      setTimeout(() => {
        input.focus();
        input.setSelectionRange(start, start);
      }, 10);
    }
  };

  const handleClear = () => {
    setInputFormula('');
    if (inputRef.current) inputRef.current.focus();
  };

  const handleSelectCategory = (cat: ActiveCategory) => {
    setActiveMathCategory(cat);
    const cfg = toolsConfig[cat] || toolsConfig.algebra;
    setInputFormula(cfg.defaultExpr);
    setActiveChipId(cfg.actionChips[0]?.id || '');
    handleSolve(cfg.defaultExpr, cat);
    setActiveTab('solve');
  };

  const handleSelectChip = (chip: ActionChipItem) => {
    setActiveChipId(chip.id);
    if (chip.templateExpr) {
      setInputFormula(chip.templateExpr);
      handleSolve(chip.templateExpr);
    }
  };

  const handleSelectSample = (sampleExpr: string, targetCat?: ActiveCategory) => {
    const cat = targetCat || activeMathCategory;
    if (targetCat && targetCat !== activeMathCategory) {
      setActiveMathCategory(targetCat);
    }
    setInputFormula(sampleExpr);
    handleSolve(sampleExpr, cat);
    setActiveTab('solve');
  };

  // Subtools ribbon matching Toolboxi standards
  const subtoolsRibbon = useMemo(
    () => [
      {
        id: 'solve',
        title: t.subtools.solveTitle,
        subtitle: t.subtools.solveSub,
        icon: <Calculator className="w-4 h-4" />,
        isActive: activeTab === 'solve',
        onClick: () => setActiveTab('solve'),
      },
      {
        id: 'graph',
        title: t.subtools.graphTitle,
        subtitle: t.subtools.graphSub,
        icon: <LineChart className="w-4 h-4" />,
        isActive: activeTab === 'graph',
        onClick: () => setActiveTab('graph'),
      },
      {
        id: 'table',
        title: t.subtools.tableTitle,
        subtitle: t.subtools.tableSub,
        icon: <TableIcon className="w-4 h-4" />,
        isActive: activeTab === 'table',
        onClick: () => setActiveTab('table'),
      },
      {
        id: 'matrices',
        title: t.subtools.matrixTitle,
        subtitle: t.subtools.matrixSub,
        icon: <MatrixIcon className="w-4 h-4" />,
        isActive: activeTab === 'matrices',
        onClick: () => setActiveTab('matrices'),
      },
      {
        id: 'cheatsheets',
        title: t.rightSidebar.cheatsheetsTitle,
        subtitle: t.rightSidebar.cheatsheetsBadge,
        icon: <Bookmark className="w-4 h-4" />,
        isActive: false,
        onClick: () => setIsCheatSheetsOpen(true),
      },
      {
        id: 'samples',
        title: t.modals.samples?.title || 'Каталог примеров',
        subtitle: t.modals.samples?.subtitle || '50+ задач',
        icon: <BookOpen className="w-4 h-4" />,
        isActive: false,
        onClick: () => setIsSamplesCatalogOpen(true),
      },
      {
        id: 'quiz',
        title: t.subtools.quizTitle,
        subtitle: t.subtools.quizSub,
        icon: <Award className="w-4 h-4" />,
        isActive: false,
        onClick: () => setIsQuizTrainerOpen(true),
      },
    ],
    [activeTab, t]
  );

  const activeCategoryTitle =
    (t.sidebar.tools as Record<string, string>)[activeMathCategory] || currentConfig.title;

  return (
    <main className="max-w-[1380px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-6 text-slate-900 dark:text-slate-100 selection:bg-blue-100 dark:selection:bg-blue-900 transition-colors">
      {/* 1. Standard Benchmark Hero Banner */}
      <MathHeroBanner
        favorite={favorite}
        onToggleFavorite={handleToggleFavorite}
        onOpenCheatSheets={() => setIsCheatSheetsOpen(true)}
        onOpenSamples={() => setIsSamplesCatalogOpen(true)}
        onOpenPrint={() => setIsPrintModalOpen(true)}
        onShare={handleShare}
      />

      {/* 2. Standard Benchmark Metrics Cards */}
      <MathMetricsCards
        categoryTitle={activeCategoryTitle}
        solution={solution}
        onReset={handleReset}
        onScrollToSteps={() => {
          if (activeTab !== 'solve') setActiveTab('solve');
          setTimeout(() => {
            document.getElementById('solution-view-card')?.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
          }, 60);
        }}
      />

      {/* 3. Subtools Horizontal Ribbon */}
      <div className="mb-5 w-full">
        <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-1 scrollbar-none">
          {subtoolsRibbon.map((item) => (
            <button
              key={item.id}
              onClick={item.onClick}
              className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl flex items-center gap-2.5 sm:gap-3 transition cursor-pointer shrink-0 ${
                item.isActive
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50/20 dark:hover:bg-slate-800'
              }`}
            >
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  item.isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {item.icon}
              </div>
              <div className="text-left">
                <div className="text-xs font-bold leading-tight">{item.title}</div>
                <div
                  className={`text-[10px] mt-0.5 truncate max-w-[120px] ${
                    item.isActive ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {item.subtitle}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Main 3-Column Workspace */}
      <div className="flex flex-col lg:flex-row gap-5 items-start">
        {/* Left Column: Categories List (16 items) */}
        <Sidebar
          activeCategory={activeMathCategory}
          onSelectCategory={handleSelectCategory}
        />

        {/* Center Column: Interactive Workspace */}
        <div className="flex-1 min-w-0 w-full space-y-5">
          {/* TAB 1: Решатель */}
          {activeTab === 'solve' && (
            <>
              {/* Formula Input Card */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-2xs transition-colors">
                {/* Single Clean Input Row: Formula + (X) + Решить -> */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex-1 min-w-0 flex items-center bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700 rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus-within:border-blue-500 dark:focus-within:border-blue-400 focus-within:bg-white dark:focus-within:bg-slate-800 focus-within:ring-2 focus-within:ring-blue-500/20 transition">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputFormula}
                      onChange={(e) => setInputFormula(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSolve();
                      }}
                      placeholder={`${t.workspace.inputPlaceholder} ${activeCategoryTitle}`}
                      className="flex-1 bg-transparent border-none text-base sm:text-xl font-serif text-slate-900 dark:text-white focus:outline-hidden placeholder-slate-400 dark:placeholder-slate-500 min-w-0"
                    />

                    {inputFormula && (
                      <button
                        onClick={handleClear}
                        aria-label={t.workspace.clearInput}
                        className="w-7 h-7 rounded-full bg-slate-200/80 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 flex items-center justify-center transition cursor-pointer shrink-0 ml-1"
                        title={t.workspace.clearInput}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => handleSolve()}
                    className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-6 py-2.5 sm:py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition shadow-2xs cursor-pointer shrink-0"
                  >
                    <span>{t.workspace.solve}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Horizontal Action Chips: dynamic per active tool */}
                <ActionChips
                  chips={currentConfig.actionChips}
                  activeChipId={activeChipId}
                  onSelectChip={handleSelectChip}
                />

                {/* Context-aware 10-column Virtual Math Keyboard (Collapsed by default per checkup rule 6) */}
                <VirtualKeyboard
                  activeCategory={activeMathCategory}
                  onInsert={handleInsert}
                  onBackspace={handleBackspace}
                  onClear={handleClear}
                />
              </div>

              {/* Solution View with Steps & LaTeX */}
              {solution && (
                <SolutionView
                  solution={solution}
                  onOpenPrint={() => setIsPrintModalOpen(true)}
                  onOpenQuiz={() => setIsQuizTrainerOpen(true)}
                />
              )}
            </>
          )}

          {/* TAB 2: Dedicated Full Graph Explorer */}
          {activeTab === 'graph' && <GraphTab />}

          {/* TAB 3: Table of Values */}
          {activeTab === 'table' && <TableTab />}

          {/* TAB 4: Matrices */}
          {activeTab === 'matrices' && <MatrixTab />}
        </div>

        {/* Right Column: Preview graph, adaptive sample problems, shortcuts */}
        <RightSidebar
          solution={solution}
          activeCategory={activeMathCategory}
          onSelectSample={handleSelectSample}
          onOpenAllSamples={() => setIsSamplesCatalogOpen(true)}
          onSelectAction={(actionKey) => {
            if (actionKey === 'graph') {
              setActiveTab('graph');
            } else if (actionKey === 'table') {
              setActiveTab('table');
            } else if (actionKey === 'simplify') {
              handleSelectSample('(x² - 9)/(x - 3)', 'fractions');
            } else if (actionKey === 'factor') {
              handleSelectSample('x² - x - 6', 'algebra');
            } else if (actionKey === 'rationalize') {
              handleSelectSample('1/(x - 1) + 2/(x + 1)', 'rational_expressions');
            } else if (actionKey === 'derivative') {
              handleSelectCategory('derivatives');
            } else if (actionKey === 'integral') {
              handleSelectCategory('integrals');
            } else if (actionKey === 'system') {
              handleSelectCategory('systems');
            } else if (actionKey === 'cheatsheets') {
              setIsCheatSheetsOpen(true);
            }
          }}
        />
      </div>

      {/* 5. Standard Benchmark Bottom Cards: Formulas, FAQ Accordion, Tips, Feedback Banner */}
      <MathBottomCards onOpenFeedback={() => setIsFeedbackOpen(true)} />

      {/* Modals */}
      <SampleProblemsModal
        isOpen={isSamplesCatalogOpen}
        onClose={() => setIsSamplesCatalogOpen(false)}
        onSelectProblem={(expr, cat) => handleSelectSample(expr, cat)}
        initialCategory={activeMathCategory}
      />
      <CheatSheetsModal
        isOpen={isCheatSheetsOpen}
        onClose={() => setIsCheatSheetsOpen(false)}
        onApplyFormula={(expr, cat) => {
          handleSelectSample(expr, cat);
          setActiveTab('solve');
        }}
      />
      <PrintSolutionModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        solution={solution}
      />
      <QuizTrainerModal
        isOpen={isQuizTrainerOpen}
        onClose={() => setIsQuizTrainerOpen(false)}
        category={activeMathCategory}
      />
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
    </main>
  );
}

export function MathSolverPage() {
  return (
    <LanguageProvider>
      <MathSolverContent />
    </LanguageProvider>
  );
}
