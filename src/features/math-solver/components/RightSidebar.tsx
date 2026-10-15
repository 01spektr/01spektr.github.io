import {
  ChevronRight,
  Zap,
  Maximize2,
  LineChart as LineChartIcon,
  Layers,
  ArrowRight,
  TrendingUp,
  Table as TableIcon,
  SquareRadical,
  FunctionSquare,
  Sigma,
  Braces,
} from 'lucide-react';
import { MathView } from './MathView';
import { InteractiveGraph } from './InteractiveGraph';
import { MathSolution, ActiveCategory } from '../types/math';
import { toolsConfig } from '../utils/toolsConfig';
import { useLanguage } from '../context/LanguageContext';

interface RightSidebarProps {
  solution: MathSolution;
  activeCategory: ActiveCategory;
  onSelectSample: (expression: string) => void;
  onSelectAction: (actionKey: string) => void;
  onOpenAllSamples: () => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  solution,
  activeCategory,
  onSelectSample,
  onSelectAction,
  onOpenAllSamples,
}) => {
  const { t } = useLanguage();
  const currentConfig = toolsConfig[activeCategory] || toolsConfig.algebra;
  const sampleProblems = currentConfig.sampleProblems || toolsConfig.algebra.sampleProblems;

  const quickActions = [
    {
      id: 'simplify',
      title: t.rightSidebar.actions.simplifyTitle,
      subtitle: t.rightSidebar.actions.simplifySub,
      color: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 hover:bg-purple-100/70 dark:hover:bg-purple-900/50 border-purple-100 dark:border-purple-900/40',
      icon: Layers,
    },
    {
      id: 'factor',
      title: t.rightSidebar.actions.factorTitle,
      subtitle: t.rightSidebar.actions.factorSub,
      color: 'bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-300 hover:bg-pink-100/70 dark:hover:bg-pink-900/50 border-pink-100 dark:border-pink-900/40',
      icon: ArrowRight,
    },
    {
      id: 'rationalize',
      title: t.rightSidebar.actions.rationalizeTitle,
      subtitle: t.rightSidebar.actions.rationalizeSub,
      color: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-100/70 dark:hover:bg-emerald-900/50 border-emerald-100 dark:border-emerald-900/40',
      icon: SquareRadical,
    },
    {
      id: 'derivative',
      title: t.rightSidebar.actions.derivativeTitle,
      subtitle: t.rightSidebar.actions.derivativeSub,
      color: 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-300 hover:bg-orange-100/70 dark:hover:bg-orange-900/50 border-orange-100 dark:border-orange-900/40',
      icon: FunctionSquare,
    },
    {
      id: 'integral',
      title: t.rightSidebar.actions.integralTitle,
      subtitle: t.rightSidebar.actions.integralSub,
      color: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-300 hover:bg-amber-100/70 dark:hover:bg-amber-900/50 border-amber-100 dark:border-amber-900/40',
      icon: Sigma,
    },
    {
      id: 'system',
      title: t.rightSidebar.actions.systemTitle,
      subtitle: t.rightSidebar.actions.systemSub,
      color: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 hover:bg-blue-100/70 dark:hover:bg-blue-900/50 border-blue-100 dark:border-blue-900/40',
      icon: Braces,
    },
    {
      id: 'table',
      title: t.rightSidebar.actions.tableTitle,
      subtitle: t.rightSidebar.actions.tableSub,
      color: 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-300 hover:bg-cyan-100/70 dark:hover:bg-cyan-900/50 border-cyan-100 dark:border-cyan-900/40',
      icon: TableIcon,
    },
    {
      id: 'graph',
      title: t.rightSidebar.actions.graphTitle,
      subtitle: t.rightSidebar.actions.graphSub,
      color: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100/70 dark:hover:bg-indigo-900/50 border-indigo-100 dark:border-indigo-900/40',
      icon: TrendingUp,
    },
  ];


  return (
    <div className="w-full xl:w-[380px] shrink-0 space-y-5">
      {/* 1. TOP CARD: График (с авто-масштабированием) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-2xs transition-colors">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-2">
          <div className="flex items-center gap-2">
            <LineChartIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">{t.rightSidebar.graphTitle}</h3>
          </div>
          <button
            onClick={() => onSelectAction('graph')}
            aria-label={t.rightSidebar.expandGraph}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition"
            title={t.rightSidebar.expandGraph}
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Embedded Interactive Graph preview with smart bounds */}
        <InteractiveGraph
          expression={solution.plotData?.functionExpression || 'y = x² - x - 6'}
          fn={solution.plotData?.fn || ((x) => x * x - x - 6)}
          roots={solution.plotData?.roots || [{ x: -2, label: 'x₁ = -2' }, { x: 3, label: 'x₂ = 3' }]}
          vertex={solution.plotData?.vertex}
        />
      </div>

      {/* 2. Примеры задач */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 shadow-2xs transition-colors">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400"></div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
              {t.rightSidebar.samplesPrefix} {(t.sidebar.tools as Record<string, string>)[activeCategory] || activeCategory}
            </h3>
          </div>
          <button
            onClick={onOpenAllSamples}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition cursor-pointer"
          >
            {t.rightSidebar.showAll}
          </button>
        </div>

        <div className="space-y-2">
          {sampleProblems.map((prob) => (
            <button
              key={prob.id}
              onClick={() => onSelectSample(prob.expr)}
              className="w-full text-left p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50/30 dark:hover:bg-slate-800/60 transition flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div
                  className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">{prob.title}</div>
                  <div className="text-xs font-serif text-slate-600 dark:text-slate-400 mt-0.5 truncate max-w-[220px]">
                    <MathView latex={prob.latex} displayMode={false} />
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition shrink-0 ml-1" />
            </button>
          ))}
        </div>

        <button
          onClick={onOpenAllSamples}
          className="w-full mt-3 py-2 border border-dashed border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/20 dark:hover:bg-slate-800/50 transition flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>{t.rightSidebar.openCatalog}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3. Полезные действия */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 shadow-2xs transition-colors">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
          <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">{t.rightSidebar.usefulActions}</h3>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((act) => {
            const Icon = act.icon;
            return (
              <button
                key={act.id}
                onClick={() => onSelectAction(act.id)}
                className={`p-2.5 rounded-xl border ${act.color} text-left transition flex flex-col justify-between cursor-pointer group min-w-0 overflow-hidden`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-6 h-6 rounded-md bg-white/90 dark:bg-slate-800 shadow-2xs flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                  </div>
                  <ChevronRight className="w-3 h-3 opacity-40 group-hover:opacity-100 transition shrink-0" />
                </div>
                <div className="min-w-0 w-full">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight group-hover:text-slate-950 dark:group-hover:text-white truncate">
                    {act.title}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">{act.subtitle}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Шпаргалки Card Banner */}
      <div className="bg-gradient-to-br from-emerald-50/80 via-white to-blue-50/50 dark:from-emerald-950/30 dark:via-slate-900 dark:to-blue-950/30 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/60 p-4 shadow-2xs transition-colors">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{t.rightSidebar.cheatsheetsTitle}</h4>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">{t.rightSidebar.cheatsheetsBadge}</span>
            </div>
          </div>
        </div>
        <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
          {t.rightSidebar.cheatsheetsDesc}
        </p>
        <button
          onClick={() => onSelectAction('cheatsheets')}
          className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
        >
          <span>{t.rightSidebar.cheatsheetsBtn}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
