import React, { useState } from 'react';
import { Plus, Trash2, RotateCcw, LineChart } from 'lucide-react';
import { InteractiveGraph } from './InteractiveGraph';
import { useLanguage } from '../context/LanguageContext';

export const GraphTab: React.FC = () => {
  const { t } = useLanguage();
  const [fn1, setFn1] = useState<string>('x^2 - x - 6');
  const [fn2, setFn2] = useState<string>('2*x + 1');
  const [showSecond, setShowSecond] = useState<boolean>(false);
  const [xMin, setXMin] = useState<number>(-6);
  const [xMax, setXMax] = useState<number>(6);

  // Compile expression to JS function safely
  const compileFn = (expr: string) => {
    return (x: number) => {
      try {
        let clean = expr
          .replace(/\^/g, '**')
          .replace(/sin/g, 'Math.sin')
          .replace(/cos/g, 'Math.cos')
          .replace(/tan/g, 'Math.tan')
          .replace(/sqrt/g, 'Math.sqrt')
          .replace(/abs/g, 'Math.abs')
          .replace(/ln/g, 'Math.log')
          .replace(/e/g, 'Math.E')
          .replace(/pi/g, 'Math.PI');
        // Handle implicit multiplication like 2x -> 2*x
        clean = clean.replace(/(\d)x/g, '$1*x');
        // evaluate safely
        const f = new Function('x', `return ${clean};`);
        return f(x);
      } catch {
        return NaN;
      }
    };
  };

  const g = t.tabs.graph;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-6 transition-colors">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <LineChart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>{g.title}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {g.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => {
              setFn1('x^2 - x - 6');
              setXMin(-6);
              setXMax(6);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{g.reset}</span>
          </button>
        </div>
      </div>

      {/* Function Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50/40 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800/60 rounded-xl p-3.5">
          <label className="block text-xs font-bold text-blue-900 dark:text-blue-300 mb-1.5">
            {g.fn1Label}
          </label>
          <div className="flex items-center gap-2">
            <span className="text-sm font-serif italic text-blue-700 dark:text-blue-400 font-bold">f₁(x) =</span>
            <input
              type="text"
              value={fn1}
              onChange={(e) => setFn1(e.target.value)}
              className="flex-1 bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-700 rounded-lg px-3 py-1.5 text-sm font-mono text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
              placeholder="x^2 - x - 6"
            />
          </div>
        </div>

        <div className="bg-purple-50/40 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-800/60 rounded-xl p-3.5">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-purple-900 dark:text-purple-300">{g.fn2Label}</label>
            <button
              onClick={() => setShowSecond(!showSecond)}
              className="text-xs text-purple-700 dark:text-purple-400 hover:underline font-medium cursor-pointer"
            >
              {showSecond ? g.hideSecond : g.addSecond}
            </button>
          </div>
          {showSecond ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-serif italic text-purple-700 dark:text-purple-400 font-bold">f₂(x) =</span>
              <input
                type="text"
                value={fn2}
                onChange={(e) => setFn2(e.target.value)}
                className="flex-1 bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-700 rounded-lg px-3 py-1.5 text-sm font-mono text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20"
                placeholder="2*x + 1"
              />
              <button
                onClick={() => setShowSecond(false)}
                className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowSecond(true)}
              className="w-full py-1.5 border border-dashed border-purple-300 dark:border-purple-700 rounded-lg text-xs font-medium text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{g.addSecond}</span>
            </button>
          )}
        </div>
      </div>

      {/* Preset Quick Functions */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-500 dark:text-slate-400 font-medium shrink-0">f(x):</span>
        {[
          { label: 'x² - 4', expr: 'x^2 - 4' },
          { label: 'x³ - 3x', expr: 'x^3 - 3*x' },
          { label: 'sin(x)', expr: 'sin(x)' },
          { label: 'e^x - 2', expr: 'Math.exp(x) - 2' },
          { label: '1/x', expr: '1/x' },
        ].map((preset, i) => (
          <button
            key={i}
            onClick={() => setFn1(preset.expr)}
            className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-200 whitespace-nowrap transition cursor-pointer font-medium font-mono"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Graph Visualizer Display */}
      <div className="mt-4">
        <InteractiveGraph
          expression={`y = ${fn1}`}
          fn={compileFn(fn1)}
          initialXRange={[xMin, xMax]}
          initialYRange={[-8, 8]}
          roots={[
            { x: -2, label: 'x₁ = -2' },
            { x: 3, label: 'x₂ = 3' },
          ]}
        />
      </div>
    </div>
  );
};
