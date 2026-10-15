import React, { useState, useMemo } from 'react';
import { Table, Copy, Download, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const TableTab: React.FC = () => {
  const { t } = useLanguage();
  const [expr, setExpr] = useState<string>('x^2 - x - 6');
  const [xStart, setXStart] = useState<number>(-4);
  const [xEnd, setXEnd] = useState<number>(4);
  const [step, setStep] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);

  const tb = t.tabs.table;

  const tableData = useMemo(() => {
    const rows: { x: number; y: number; isZero: boolean }[] = [];
    const validStep = step <= 0 ? 1 : step;
    const start = Math.min(xStart, xEnd);
    const end = Math.max(xStart, xEnd);

    // Compile formula
    let clean = expr
      .replace(/\^/g, '**')
      .replace(/sin/g, 'Math.sin')
      .replace(/cos/g, 'Math.cos')
      .replace(/tan/g, 'Math.tan')
      .replace(/sqrt/g, 'Math.sqrt')
      .replace(/abs/g, 'Math.abs')
      .replace(/ln/g, 'Math.log')
      .replace(/(\d)x/g, '$1*x');

    let f: (x: number) => number;
    try {
      f = new Function('x', `return ${clean};`) as any;
    } catch {
      f = (x: number) => x * x - x - 6;
    }

    for (let x = start; x <= end + 1e-6; x += validStep) {
      const roundedX = Math.round(x * 1000) / 1000;
      try {
        const y = f(roundedX);
        const roundedY = Math.round(y * 1000) / 1000;
        rows.push({
          x: roundedX,
          y: roundedY,
          isZero: Math.abs(roundedY) < 1e-6,
        });
      } catch {
        rows.push({ x: roundedX, y: NaN, isZero: false });
      }
    }
    return rows;
  }, [expr, xStart, xEnd, step]);

  const handleCopyCSV = () => {
    const csv = ['x\ty', ...tableData.map((r) => `${r.x}\t${r.y}`)].join('\n');
    navigator.clipboard.writeText(csv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCSV = () => {
    const csv = ['x,y', ...tableData.map((r) => `${r.x},${r.y}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `table_${expr.replace(/\s+/g, '_')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-6 transition-colors">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Table className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>{tb.title}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {tb.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? tb.copied : tb.copyTsv}</span>
          </button>
          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg text-xs font-medium transition shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{tb.downloadCsv}</span>
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50/60 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">{tb.fnLabel}</label>
          <input
            type="text"
            value={expr}
            onChange={(e) => setExpr(e.target.value)}
            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-800 dark:text-slate-100"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">{tb.startLabel}</label>
          <input
            type="number"
            value={xStart}
            onChange={(e) => setXStart(parseFloat(e.target.value) || 0)}
            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-800 dark:text-slate-100"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">{tb.endLabel}</label>
          <input
            type="number"
            value={xEnd}
            onChange={(e) => setXEnd(parseFloat(e.target.value) || 0)}
            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-800 dark:text-slate-100"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">{tb.stepLabel}</label>
          <input
            type="number"
            step="0.5"
            min="0.1"
            value={step}
            onChange={(e) => setStep(parseFloat(e.target.value) || 1)}
            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-800 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Table Display */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
              <th className="py-2.5 px-4 font-bold font-mono">x</th>
              <th className="py-2.5 px-4 font-bold font-mono">f(x) = {expr}</th>
              <th className="py-2.5 px-4 font-bold text-right">{tb.colStatus}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {tableData.map((row, idx) => (
              <tr
                key={idx}
                className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition ${
                  row.isZero ? 'bg-blue-50/50 dark:bg-blue-950/40 font-semibold' : ''
                }`}
              >
                <td className="py-2 px-4 font-mono text-slate-800 dark:text-slate-200">{row.x}</td>
                <td className="py-2 px-4 font-mono text-slate-900 dark:text-white">
                  {isNaN(row.y) ? (
                    <span className="text-rose-500">{tb.undefined}</span>
                  ) : (
                    row.y
                  )}
                </td>
                <td className="py-2 px-4 text-right">
                  {row.isZero && (
                    <span className="inline-block px-2 py-0.5 bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 rounded-md text-[10px] font-bold">
                      {tb.rootTag}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
