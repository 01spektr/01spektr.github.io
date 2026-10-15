import React, { useState } from 'react';
import { Grid } from 'lucide-react';
import { MathView } from './MathView';
import { useLanguage } from '../context/LanguageContext';

export const MatrixTab: React.FC = () => {
  const { t } = useLanguage();
  const [size, setSize] = useState<2 | 3>(2);
  const [matrixA, setMatrixA] = useState<number[][]>([
    [2, 3],
    [1, 4],
  ]);

  const m = t.tabs.matrix;

  const updateCell = (r: number, c: number, val: string) => {
    const num = parseFloat(val) || 0;
    const next = matrixA.map((row, ri) =>
      row.map((col, ci) => (ri === r && ci === c ? num : col))
    );
    setMatrixA(next);
  };

  const handleSetSize = (newSize: 2 | 3) => {
    setSize(newSize);
    if (newSize === 2) {
      setMatrixA([
        [2, 3],
        [1, 4],
      ]);
    } else {
      setMatrixA([
        [1, 2, 3],
        [0, 1, 4],
        [5, 6, 0],
      ]);
    }
  };

  // 2x2 Determinant
  const det2 = (mat: number[][]) => mat[0][0] * mat[1][1] - mat[0][1] * mat[1][0];

  // 3x3 Determinant
  const det3 = (mat: number[][]) => {
    return (
      mat[0][0] * (mat[1][1] * mat[2][2] - mat[1][2] * mat[2][1]) -
      mat[0][1] * (mat[1][0] * mat[2][2] - mat[1][2] * mat[2][0]) +
      mat[0][2] * (mat[1][0] * mat[2][1] - mat[1][1] * mat[2][0])
    );
  };

  const det = size === 2 ? det2(matrixA) : det3(matrixA);

  const getLatexMatrix = (mat: number[][]) => {
    const rows = mat.map((r) => r.join(' & ')).join(' \\\\ ');
    return `\\begin{pmatrix} ${rows} \\end{pmatrix}`;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-6 transition-colors">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Grid className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>{m.title}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {m.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{m.dimension}</span>
          <button
            onClick={() => handleSetSize(2)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              size === 2
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            2 × 2
          </button>
          <button
            onClick={() => handleSetSize(3)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              size === 3
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            3 × 3
          </button>
        </div>
      </div>

      {/* Matrix Input & Visual */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="bg-slate-50/70 dark:bg-slate-800/60 p-5 rounded-xl border border-slate-200/80 dark:border-slate-700">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-3">
            {m.elementsA}
          </label>
          <div
            className="grid gap-2 max-w-xs mx-auto"
            style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
          >
            {matrixA.map((row, ri) =>
              row.map((val, ci) => (
                <input
                  key={`${ri}-${ci}`}
                  type="number"
                  value={val}
                  onChange={(e) => updateCell(ri, ci, e.target.value)}
                  className="w-full text-center bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg py-2.5 font-mono text-base font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                />
              ))
            )}
          </div>
        </div>

        <div className="bg-blue-50/40 dark:bg-blue-950/40 p-5 rounded-xl border border-blue-200/80 dark:border-blue-800/60 flex flex-col items-center justify-center text-center">
          <span className="text-xs text-blue-800 dark:text-blue-300 font-semibold mb-2">{m.mathViewA}</span>
          <div className="text-xl font-serif py-2">
            <MathView latex={`A = ${getLatexMatrix(matrixA)}`} />
          </div>
        </div>
      </div>

      {/* Calculations & Steps */}
      <div className="space-y-4">
        {/* Step: Determinant */}
        <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
              1
            </span>
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">
              {m.step1Title}
            </h4>
          </div>
          <div className="pl-7 space-y-2">
            {size === 2 ? (
              <>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {m.step1Desc2}
                </p>
                <div className="text-sm font-serif">
                  <MathView
                    latex={`\\det(A) = (${matrixA[0][0]}) \\cdot (${matrixA[1][1]}) - (${matrixA[0][1]}) \\cdot (${matrixA[1][0]}) = ${matrixA[0][0] * matrixA[1][1]} - ${matrixA[0][1] * matrixA[1][0]} = ${det}`}
                  />
                </div>
              </>
            ) : (
              <>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {m.step1Desc3}
                </p>
                <div className="text-sm font-serif">
                  <MathView latex={`\\det(A) = ${det}`} />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Step: Transpose */}
        <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
              2
            </span>
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">{m.step2Title}</h4>
          </div>
          <div className="pl-7">
            <div className="text-sm font-serif">
              <MathView
                latex={`A^T = ${getLatexMatrix(
                  matrixA[0].map((_, colIndex) => matrixA.map((row) => row[colIndex]))
                )}`}
              />
            </div>
          </div>
        </div>

        {/* Result Card */}
        <div className="bg-blue-50/50 dark:bg-slate-800/80 border border-blue-200/80 dark:border-slate-750 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
              ✓
            </span>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">{m.resultTitle}</h4>
          </div>
          <div className="pl-7 text-sm font-serif text-slate-900 dark:text-white">
            {det === 0 ? (
              <p className="text-xs text-amber-700 dark:text-amber-400 font-sans font-medium">
                {m.detZero}
              </p>
            ) : (
              <div>
                <p className="text-xs text-blue-700 dark:text-blue-300 font-sans mb-1">
                  {m.detNonZero}
                </p>
                <MathView
                  latex={`\\det(A) = ${det}, \\quad \\text{rank}(A) = ${size}`}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
