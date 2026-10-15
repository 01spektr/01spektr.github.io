import React, { useRef, useState, useMemo } from 'react';
import {
  X,
  Copy,
  Check,
  FileDown,
  LineChart,
  Download,
  Loader2,
  FileText,
  AlertCircle,
  Printer,
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { MathSolution } from '../types/math';
import { MathView } from './MathView';
import { useLanguage } from '../context/LanguageContext';

interface PrintSolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  solution: MathSolution;
}

export const PrintSolutionModal: React.FC<PrintSolutionModalProps> = ({
  isOpen,
  onClose,
  solution,
}) => {
  const { t, lang } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [includeGraph, setIncludeGraph] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const printAreaRef = useRef<HTMLDivElement>(null);

  // High-resolution Vector Graph geometry for PDF export
  const svgGraph = useMemo(() => {
    if (!solution.plotData) return null;
    const { fn, roots = [], vertex } = solution.plotData;

    const width = 500;
    const height = 210;

    // Auto bounds
    let minX = -4.5;
    let maxX = 4.5;
    if (roots.length > 0) {
      const rVals = roots.map((r) => r.x);
      minX = Math.min(-4, Math.min(...rVals) - 1.5);
      maxX = Math.max(4, Math.max(...rVals) + 1.5);
    }
    if (vertex) {
      minX = Math.min(minX, vertex.x - 2);
      maxX = Math.max(maxX, vertex.x + 2);
    }

    const sampleY: number[] = [0];
    if (vertex) sampleY.push(vertex.y);
    const step = (maxX - minX) / 30;
    for (let x = minX; x <= maxX; x += step) {
      try {
        const y = fn(x);
        if (!isNaN(y) && isFinite(y) && Math.abs(y) < 100) sampleY.push(y);
      } catch {
        // ignore
      }
    }

    let minY = Math.min(...sampleY);
    let maxY = Math.max(...sampleY);
    const spanY = Math.max(maxY - minY, 6);
    let finalMinY = minY - spanY * 0.15;
    let finalMaxY = maxY + spanY * 0.15;
    if (finalMinY > -1) finalMinY = -2;
    if (finalMaxY < 1) finalMaxY = 2;
    finalMinY = Math.max(finalMinY, -25);
    finalMaxY = Math.min(finalMaxY, 25);

    const toPxX = (x: number) => ((x - minX) / (maxX - minX)) * width;
    const toPxY = (y: number) => height - ((y - finalMinY) / (finalMaxY - finalMinY)) * height;

    // Curve
    const points: [number, number][] = [];
    const curveStep = (maxX - minX) / 120;
    for (let x = minX; x <= maxX; x += curveStep) {
      try {
        const y = fn(x);
        if (!isNaN(y) && isFinite(y)) {
          const px = toPxX(x);
          const py = toPxY(y);
          if (py >= -30 && py <= height + 30) points.push([px, py]);
        }
      } catch {
        // ignore
      }
    }
    const pathD =
      points.length === 0
        ? ''
        : points.reduce(
            (acc, [px, py], i) => `${acc} ${i === 0 ? 'M' : 'L'} ${px.toFixed(1)},${py.toFixed(1)}`,
            ''
          );

    // Ticks
    const xt: number[] = [];
    for (let x = Math.ceil(minX); x <= maxX; x += 1) {
      if (Math.abs(x) > 0.001) xt.push(x);
    }
    const yt: number[] = [];
    for (let y = Math.ceil(finalMinY); y <= finalMaxY; y += 2) {
      if (Math.abs(y) > 0.001) yt.push(y);
    }

    return {
      width,
      height,
      pathD,
      toPxX,
      toPxY,
      xTicks: xt,
      yTicks: yt,
      roots,
      vertex,
    };
  }, [solution.plotData]);

  if (!isOpen) return null;

  // Real PDF generator & file downloader with unconstrained offscreen clone
  const handleDownloadPdf = async () => {
    if (!printAreaRef.current || isDownloading) return;
    setIsDownloading(true);
    setDownloadError(null);

    let clone: HTMLElement | null = null;
    try {
      const sheetElement = printAreaRef.current;

      // Clone element to an unconstrained offscreen container to bypass modal viewport/scrollbar clipping
      clone = sheetElement.cloneNode(true) as HTMLElement;
      clone.style.position = 'fixed';
      clone.style.left = '-9999px';
      clone.style.top = '0';
      clone.style.width = '794px'; // Standard A4 width at 96 DPI
      clone.style.maxWidth = 'none';
      clone.style.height = 'auto';
      clone.style.maxHeight = 'none';
      clone.style.overflow = 'visible';
      clone.style.zIndex = '-9999';
      document.body.appendChild(clone);

      // Capture element to high-res canvas (scale 2 for crisp 300+ DPI formulas)
      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: 794,
      });

      // Create jsPDF document (A4 portrait)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidthMm = 210; // A4 width in mm
      const pageHeightMm = 297; // A4 height in mm
      const marginMm = 10;
      const contentWidthMm = pageWidthMm - marginMm * 2; // 190mm
      const contentHeightPerPageMm = pageHeightMm - marginMm * 2; // 277mm

      // Calculate how many canvas px correspond to one A4 page of content
      const pxPerMm = canvas.width / contentWidthMm;
      const pageCanvasHeightPx = contentHeightPerPageMm * pxPerMm;

      if (canvas.height <= pageCanvasHeightPx) {
        // Fits entirely on a single page
        const imgData = canvas.toDataURL('image/png', 1.0);
        const targetHeightMm = (canvas.height * contentWidthMm) / canvas.width;
        pdf.addImage(imgData, 'PNG', marginMm, marginMm, contentWidthMm, targetHeightMm, undefined, 'FAST');
      } else {
        // Multi-page export with clean canvas slices
        const totalPages = Math.ceil(canvas.height / pageCanvasHeightPx);
        for (let p = 0; p < totalPages; p++) {
          if (p > 0) pdf.addPage();

          const sourceY = p * pageCanvasHeightPx;
          const sliceHeight = Math.min(pageCanvasHeightPx, canvas.height - sourceY);

          const pageCanvas = document.createElement('canvas');
          pageCanvas.width = canvas.width;
          pageCanvas.height = sliceHeight;
          const ctx = pageCanvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
            ctx.drawImage(canvas, 0, sourceY, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight);
            const sliceImgData = pageCanvas.toDataURL('image/png', 1.0);
            const sliceHeightMm = (sliceHeight * contentWidthMm) / canvas.width;
            pdf.addImage(sliceImgData, 'PNG', marginMm, marginMm, contentWidthMm, sliceHeightMm, undefined, 'FAST');
          }
        }
      }

      // Safe clean file name
      const sanitizedName = (solution.originalInput || 'math_solution')
        .replace(/[^a-zA-Z0-9а-яА-ЯёЁ_-]/g, '_')
        .replace(/_{2,}/g, '_')
        .slice(0, 32);

      const fileName = `toolboxi_reshenie_${sanitizedName || 'zadacha'}.pdf`;

      // Save triggers automatic native browser download
      pdf.save(fileName);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    } catch (err: any) {
      console.error('PDF generation error, attempting window.print fallback:', err);
      try {
        window.print();
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 3500);
      } catch {
        setDownloadError(
          lang === 'uz'
            ? 'PDF yaratishda xatolik yuz berdi. Iltimos, «Chop etish» tugmasini bosing.'
            : lang === 'en'
            ? 'Error generating PDF. Please use the «Print» button.'
            : 'Ошибка при формировании PDF. Пожалуйста, воспользуйтесь кнопкой «Печать».'
        );
      }
    } finally {
      if (clone && clone.parentNode) {
        document.body.removeChild(clone);
      }
      setIsDownloading(false);
    }
  };

  const handleCopyText = () => {
    const text = [
      `Toolboxi.uz — Решение задачи:`,
      `Условие: ${solution.originalInput}`,
      ...solution.steps.map((s) => `${s.id}. ${s.title}: ${s.latex}`),
      `Ответ: ${solution.finalAnswerText}`,
    ].join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />

      <div className="relative bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 animate-in fade-in zoom-in-95 transition-colors">
        {/* Modal Top Bar */}
        <div className="p-3.5 sm:p-4 border-b border-slate-200/90 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-850">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <FileDown className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">{t.modals.print.title}</h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{t.modals.print.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2 sm:gap-2.5">
            {/* Toggle Include Graph Checkbox */}
            {solution.plotData && (
              <label className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-700 dark:text-slate-200 cursor-pointer select-none hover:bg-slate-50 dark:hover:bg-slate-700/80 transition">
                <input
                  type="checkbox"
                  checked={includeGraph}
                  onChange={(e) => setIncludeGraph(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer w-3.5 h-3.5"
                />
                <span className="font-medium">{t.modals.print.includeGraph}</span>
              </label>
            )}

            <button
              onClick={handleCopyText}
              className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
              title="Copy"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? t.topActions.copied : (lang === 'uz' ? 'Nusxa olish' : lang === 'en' ? 'Copy' : 'Копировать')}</span>
            </button>

            {/* Native Browser Print & Save as PDF Button */}
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
              title={lang === 'uz' ? 'Chop etish yoki PDF sifatida saqlash' : lang === 'en' ? 'Print or Save as PDF' : 'Печать или Сохранить как PDF'}
            >
              <Printer className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>{lang === 'uz' ? 'Chop etish' : lang === 'en' ? 'Print' : 'Печать'}</span>
            </button>

            {/* PRIMARY ACTION: DIRECT PDF DOWNLOAD */}
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shadow-xs active:scale-95 ${
                downloadSuccess
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-400'
              }`}
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{lang === 'uz' ? 'PDF yaratilmoqda...' : lang === 'en' ? 'Generating PDF...' : 'Создание PDF...'}</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>{lang === 'uz' ? 'PDF yuklandi!' : lang === 'en' ? 'PDF Downloaded!' : 'PDF скачан!'}</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>{t.modals.print.downloadBtn}</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              aria-label={t.modals.print.close}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {downloadError && (
          <div className="px-4 py-2 bg-rose-50 border-b border-rose-200 flex items-center gap-2 text-xs text-rose-700">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{downloadError}</span>
          </div>
        )}

        {/* Paper Document Preview Sheet */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-slate-100/70 dark:bg-slate-950/80 flex justify-center">
          <div
            ref={printAreaRef}
            id="printable-solution-sheet"
            className="w-full max-w-2xl bg-white p-6 sm:p-7 rounded-xl shadow-xs border border-slate-200 space-y-3.5 text-slate-900"
          >
            {/* Header branding */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  T
                </div>
                <span className="font-bold text-slate-900 text-base">
                  Toolboxi<span className="text-blue-600">.uz</span>
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">
                  · Математический калькулятор
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500 font-mono">
                  {new Date().toLocaleDateString('ru-RU')}
                </span>
              </div>
            </div>

            {/* Title & Expression */}
            <div>
              <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">
                Пошаговое решение
              </span>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">{solution.title}</h1>
              <div className="mt-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-xs text-slate-500 block mb-0.5">Исходное уравнение:</span>
                <div className="text-lg font-serif">
                  <MathView latex={solution.canonicalForm || solution.originalInput} />
                </div>
              </div>
            </div>

            {/* Steps list */}
            <div className="space-y-3">
              {solution.steps.map((step) => (
                <div key={step.id} className="border-l-2 border-blue-600 pl-3.5 py-0.5">
                  <span className="text-xs font-bold text-slate-800">
                    Шаг {step.id}: {step.title}
                  </span>
                  <div className="text-base font-serif mt-0.5">
                    <MathView latex={step.latex} />
                  </div>
                  {step.description && (
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      {step.description}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Final Answer Card */}
            <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl">
              <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider block mb-0.5">
                Итоговый ответ:
              </span>
              <div className="text-base sm:text-lg font-serif font-bold text-slate-900">
                <MathView latex={solution.finalAnswerLatex} />
              </div>
            </div>

            {/* EMBEDDED GRAPH IN PDF */}
            {includeGraph && svgGraph && solution.plotData && (
              <div className="pt-3 border-t border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <LineChart className="w-3.5 h-3.5 text-blue-600" />
                    <span>График функции: {solution.plotData.functionExpression}</span>
                  </div>
                  {svgGraph.roots.length > 0 && (
                    <span className="text-[11px] font-mono text-blue-800 font-medium">
                      Корни: {svgGraph.roots.map((r) => r.label).join(', ')}
                    </span>
                  )}
                </div>

                {/* Clean Vector SVG graph for PDF */}
                <div className="border border-slate-200 rounded-xl p-2 bg-slate-50/40 flex justify-center">
                  <svg
                    viewBox={`0 0 ${svgGraph.width} ${svgGraph.height}`}
                    className="w-full h-auto max-h-[190px]"
                  >
                    {/* Grid */}
                    {svgGraph.xTicks.map((t) => (
                      <line
                        key={`gx-${t}`}
                        x1={svgGraph.toPxX(t)}
                        y1={0}
                        x2={svgGraph.toPxX(t)}
                        y2={svgGraph.height}
                        stroke="#e2e8f0"
                        strokeWidth="0.8"
                      />
                    ))}
                    {svgGraph.yTicks.map((t) => (
                      <line
                        key={`gy-${t}`}
                        x1={0}
                        y1={svgGraph.toPxY(t)}
                        x2={svgGraph.width}
                        y2={svgGraph.toPxY(t)}
                        stroke="#e2e8f0"
                        strokeWidth="0.8"
                      />
                    ))}

                    {/* X Axis */}
                    <line
                      x1={5}
                      y1={svgGraph.toPxY(0)}
                      x2={svgGraph.width - 10}
                      y2={svgGraph.toPxY(0)}
                      stroke="#334155"
                      strokeWidth="1.2"
                    />
                    {/* X Axis Arrow Head */}
                    <polygon
                      points={`${svgGraph.width - 4},${svgGraph.toPxY(0)} ${svgGraph.width - 12},${svgGraph.toPxY(0) - 3.5} ${svgGraph.width - 12},${svgGraph.toPxY(0) + 3.5}`}
                      fill="#334155"
                    />
                    <text
                      x={svgGraph.width - 15}
                      y={svgGraph.toPxY(0) - 5}
                      fill="#334155"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      x
                    </text>

                    {/* Y Axis */}
                    <line
                      x1={svgGraph.toPxX(0)}
                      y1={svgGraph.height - 5}
                      x2={svgGraph.toPxX(0)}
                      y2={10}
                      stroke="#334155"
                      strokeWidth="1.2"
                    />
                    {/* Y Axis Arrow Head */}
                    <polygon
                      points={`${svgGraph.toPxX(0)},4 ${svgGraph.toPxX(0) - 3.5},12 ${svgGraph.toPxX(0) + 3.5},12`}
                      fill="#334155"
                    />
                    <text
                      x={svgGraph.toPxX(0) - 12}
                      y={14}
                      fill="#334155"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      y
                    </text>

                    {/* Ticks text */}
                    {svgGraph.xTicks.map((t) => (
                      <text
                        key={`tx-${t}`}
                        x={svgGraph.toPxX(t)}
                        y={svgGraph.toPxY(0) + 11}
                        fill="#64748b"
                        fontSize="8"
                        textAnchor="middle"
                      >
                        {t}
                      </text>
                    ))}
                    {svgGraph.yTicks.map((t) => (
                      <text
                        key={`ty-${t}`}
                        x={svgGraph.toPxX(0) - 5}
                        y={svgGraph.toPxY(t) + 3}
                        fill="#64748b"
                        fontSize="8"
                        textAnchor="end"
                      >
                        {t}
                      </text>
                    ))}

                    {/* Curve */}
                    <path
                      d={svgGraph.pathD}
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />

                    {/* Roots circles & labels */}
                    {svgGraph.roots.map((r, i) => {
                      const px = svgGraph.toPxX(r.x);
                      const py = svgGraph.toPxY(0);
                      return (
                        <g key={`root-${i}`}>
                          <circle
                            cx={px}
                            cy={py}
                            r="4"
                            fill="#2563eb"
                            stroke="#ffffff"
                            strokeWidth="1.5"
                          />
                          <rect
                            x={px - 10}
                            y={py + 4}
                            width="20"
                            height="11"
                            rx="2"
                            fill="#eff6ff"
                            stroke="#93c5fd"
                            strokeWidth="0.8"
                          />
                          <text
                            x={px}
                            y={py + 12}
                            fill="#1e40af"
                            fontSize="7.5"
                            fontWeight="bold"
                            textAnchor="middle"
                          >
                            {Number(r.x.toFixed(1))}
                          </text>
                        </g>
                      );
                    })}

                    {/* Vertex circle */}
                    {svgGraph.vertex && (
                      <g>
                        <circle
                          cx={svgGraph.toPxX(svgGraph.vertex.x)}
                          cy={svgGraph.toPxY(svgGraph.vertex.y)}
                          r="4"
                          fill="#f59e0b"
                          stroke="#ffffff"
                          strokeWidth="1.5"
                        />
                        <rect
                          x={svgGraph.toPxX(svgGraph.vertex.x) - 18}
                          y={svgGraph.toPxY(svgGraph.vertex.y) - 15}
                          width="36"
                          height="11"
                          rx="2"
                          fill="#fffbeb"
                          stroke="#fcd34d"
                          strokeWidth="0.8"
                        />
                        <text
                          x={svgGraph.toPxX(svgGraph.vertex.x)}
                          y={svgGraph.toPxY(svgGraph.vertex.y) - 7}
                          fill="#92400e"
                          fontSize="7.5"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          ({Number(svgGraph.vertex.x.toFixed(1))}; {Number(svgGraph.vertex.y.toFixed(1))})
                        </text>
                      </g>
                    )}
                  </svg>
                </div>
              </div>
            )}

            {/* Document Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
              <span>Toolboxi.uz Math CAS · Документ сформирован автоматически</span>
              <span>Страница 1 / 1</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-solution-sheet, #printable-solution-sheet * {
            visibility: visible !important;
          }
          #printable-solution-sheet {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            box-shadow: none !important;
            border: none !important;
            padding: 20px !important;
            margin: 0 !important;
            background: white !important;
            z-index: 99999 !important;
          }
        }
      `}</style>
    </div>
  );
};
