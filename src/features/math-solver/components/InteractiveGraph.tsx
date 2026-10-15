import React, { useState, useRef, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  Download,
  Sliders,
  X,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useTheme } from '@/lib/theme';

interface InteractiveGraphProps {
  expression: string;
  fn: (x: number) => number;
  roots?: { x: number; label: string }[];
  vertex?: { x: number; y: number; label: string };
  initialXRange?: [number, number];
  initialYRange?: [number, number];
}

export const InteractiveGraph: React.FC<InteractiveGraphProps> = ({
  expression,
  fn,
  roots = [],
  vertex,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [hoverPt, setHoverPt] = useState<{ x: number; y: number; px: number; py: number } | null>(null);

  // Analysis toggles
  const [showRoots, setShowRoots] = useState<boolean>(true);
  const [showVertex, setShowVertex] = useState<boolean>(true);
  const [showSymmetryAxis, setShowSymmetryAxis] = useState<boolean>(true);
  const [showYIntercept, setShowYIntercept] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showAnalysisDrawer, setShowAnalysisDrawer] = useState<boolean>(false);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const fullSvgRef = useRef<SVGSVGElement | null>(null);

  // Close fullscreen on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Dimensions
  const inlineWidth = 400;
  const inlineHeight = 240;
  const fullWidth = 920;
  const fullHeight = 520;

  // Calculate Y-intercept: (0, fn(0))
  const yIntercept = useMemo(() => {
    try {
      const val = fn(0);
      if (!isNaN(val) && isFinite(val)) {
        return { x: 0, y: val, label: `(0; ${Number(val.toFixed(2))})` };
      }
    } catch {
      // ignore
    }
    return null;
  }, [fn]);

  // Smart Auto-Ranging with generous safety margins
  const { baseRangeX, baseRangeY } = useMemo(() => {
    let minX = -4.5;
    let maxX = 4.5;

    if (roots.length > 0) {
      const rootVals = roots.map((r) => r.x);
      const minR = Math.min(...rootVals);
      const maxR = Math.max(...rootVals);
      minX = Math.min(-4, minR - 2);
      maxX = Math.max(4, maxR + 2);
    }
    if (vertex) {
      minX = Math.min(minX, vertex.x - 2.5);
      maxX = Math.max(maxX, vertex.x + 2.5);
    }

    const sampleY: number[] = [0];
    if (vertex) sampleY.push(vertex.y);
    if (yIntercept) sampleY.push(yIntercept.y);

    const step = (maxX - minX) / 35;
    for (let x = minX; x <= maxX; x += step) {
      try {
        const y = fn(x);
        if (!isNaN(y) && isFinite(y) && Math.abs(y) < 120) {
          sampleY.push(y);
        }
      } catch {
        // ignore
      }
    }

    let minY = Math.min(...sampleY);
    let maxY = Math.max(...sampleY);

    const spanY = Math.max(maxY - minY, 6);
    let finalMinY = minY - spanY * 0.18;
    let finalMaxY = maxY + spanY * 0.18;

    if (finalMinY > -1) finalMinY = -2;
    if (finalMaxY < 1) finalMaxY = 2;

    finalMinY = Math.max(finalMinY, -30);
    finalMaxY = Math.min(finalMaxY, 30);

    return {
      baseRangeX: [minX, maxX] as [number, number],
      baseRangeY: [finalMinY, finalMaxY] as [number, number],
    };
  }, [fn, roots, vertex, yIntercept]);

  const xMin = baseRangeX[0] / zoomLevel;
  const xMax = baseRangeX[1] / zoomLevel;
  const yMin = baseRangeY[0] / zoomLevel;
  const yMax = baseRangeY[1] / zoomLevel;

  // Coordinate mapping generator
  const getTransformers = (w: number, h: number) => {
    // Reserve padding so labels/arrows never get clipped
    const padL = 32;
    const padR = 24;
    const padT = 20;
    const padB = 26;

    const plotW = w - padL - padR;
    const plotH = h - padT - padB;

    const toPxX = (x: number) => padL + ((x - xMin) / (xMax - xMin)) * plotW;
    const toPxY = (y: number) => padT + plotH - ((y - yMin) / (yMax - yMin)) * plotH;
    const fromPxX = (px: number) => xMin + ((px - padL) / plotW) * (xMax - xMin);

    return { toPxX, toPxY, fromPxX, padL, padR, padT, padB, plotW, plotH };
  };

  // Generate curve path for given dimension
  const generatePath = (w: number, h: number) => {
    const { toPxX, toPxY } = getTransformers(w, h);
    const points: [number, number][] = [];
    const step = (xMax - xMin) / 160;

    for (let x = xMin; x <= xMax; x += step) {
      try {
        const y = fn(x);
        if (!isNaN(y) && isFinite(y)) {
          const px = toPxX(x);
          const py = toPxY(y);
          if (py >= -80 && py <= h + 80) {
            points.push([px, py]);
          }
        }
      } catch {
        // ignore
      }
    }
    if (points.length === 0) return '';
    return points.reduce(
      (acc, [px, py], i) => `${acc} ${i === 0 ? 'M' : 'L'} ${px.toFixed(1)},${py.toFixed(1)}`,
      ''
    );
  };

  // Tick generator
  const { xTicks, yTicks } = useMemo(() => {
    const getStep = (min: number, max: number) => {
      const span = max - min;
      if (span <= 6) return 1;
      if (span <= 14) return 2;
      return 5;
    };

    const stepX = getStep(xMin, xMax);
    const stepY = getStep(yMin, yMax);

    const xt: number[] = [];
    for (let x = Math.ceil(xMin / stepX) * stepX; x <= xMax; x += stepX) {
      if (Math.abs(x) > 0.001) xt.push(x);
    }

    const yt: number[] = [];
    for (let y = Math.ceil(yMin / stepY) * stepY; y <= yMax; y += stepY) {
      if (Math.abs(y) > 0.001) yt.push(y);
    }

    return { xTicks: xt, yTicks: yt };
  }, [xMin, xMax, yMin, yMax]);

  const handleMouseMove = (
    e: React.MouseEvent<SVGSVGElement>,
    activeRef: React.RefObject<SVGSVGElement | null>,
    w: number,
    h: number
  ) => {
    if (!activeRef.current) return;
    const rect = activeRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const scale = w / rect.width;
    const svgPx = clientX * scale;

    const { fromPxX, toPxY } = getTransformers(w, h);
    const xVal = fromPxX(svgPx);

    try {
      const yVal = fn(xVal);
      const py = toPxY(yVal);
      setHoverPt({ x: xVal, y: yVal, px: svgPx, py });
    } catch {
      setHoverPt(null);
    }
  };

  const handleMouseLeave = () => setHoverPt(null);

  const handleTouchMove = (
    e: React.TouchEvent<SVGSVGElement>,
    activeRef: React.RefObject<SVGSVGElement | null>,
    w: number,
    h: number
  ) => {
    if (!activeRef.current || !e.touches[0]) return;
    const touch = e.touches[0];
    const rect = activeRef.current.getBoundingClientRect();
    const clientX = touch.clientX - rect.left;
    const scale = w / rect.width;
    const svgPx = clientX * scale;

    const { fromPxX, toPxY } = getTransformers(w, h);
    const xVal = fromPxX(svgPx);

    try {
      const yVal = fn(xVal);
      const py = toPxY(yVal);
      setHoverPt({ x: xVal, y: yVal, px: svgPx, py });
    } catch {
      setHoverPt(null);
    }
  };

  const handleZoomIn = () => setZoomLevel((z) => Math.min(z * 1.3, 3.5));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z / 1.3, 0.35));
  const handleResetZoom = () => setZoomLevel(1);

  const handleDownload = (targetRef: React.RefObject<SVGSVGElement | null>) => {
    if (!targetRef.current) return;
    const svgData = new XMLSerializer().serializeToString(targetRef.current);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `graph-${expression.replace(/[^a-zA-Z0-9]/g, '_')}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Reusable SVG graph renderer
  const renderSvgContent = (
    targetRef: React.RefObject<SVGSVGElement | null>,
    w: number,
    h: number,
    isLarge: boolean
  ) => {
    const { toPxX, toPxY, padL, padR, padT, padB } = getTransformers(w, h);
    const pathD = generatePath(w, h);

    // Clamp axis positions so they don't disappear when zoomed out/in
    const axisY = Math.max(padT + 8, Math.min(h - padB - 8, toPxY(0)));
    const axisX = Math.max(padL + 8, Math.min(w - padR - 8, toPxX(0)));

    const bgFill = isDark ? '#0b1120' : '#fafcff';
    const gridStroke = isDark ? '#1e293b' : '#e2e8f0';
    const axisStroke = isDark ? '#64748b' : '#334155';
    const textFill = isDark ? '#94a3b8' : '#64748b';
    const textAxisFill = isDark ? '#e2e8f0' : '#334155';

    return (
      <svg
        ref={targetRef}
        viewBox={`0 0 ${w} ${h}`}
        className="w-full h-full cursor-crosshair select-none touch-none"
        onMouseMove={(e) => handleMouseMove(e, targetRef, w, h)}
        onMouseLeave={handleMouseLeave}
        onTouchMove={(e) => handleTouchMove(e, targetRef, w, h)}
        onTouchEnd={handleMouseLeave}
      >
        <defs>
          <marker
            id={isLarge ? 'arrX_lg' : 'arrX_sm'}
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 2 L 10 5 L 0 8 z" fill={axisStroke} />
          </marker>
          <marker
            id={isLarge ? 'arrY_lg' : 'arrY_sm'}
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 2 L 10 5 L 0 8 z" fill={axisStroke} />
          </marker>
        </defs>

        {/* Soft Background */}
        <rect x="0" y="0" width={w} height={h} fill={bgFill} rx={isLarge ? '16' : '10'} />

        {/* Grid lines */}
        {showGrid &&
          xTicks.map((tick) => {
            const px = toPxX(tick);
            return (
              <line
                key={`gx-${tick}`}
                x1={px}
                y1={padT}
                x2={px}
                y2={h - padB}
                stroke={gridStroke}
                strokeWidth={isLarge ? '1' : '0.8'}
              />
            );
          })}
        {showGrid &&
          yTicks.map((tick) => {
            const py = toPxY(tick);
            return (
              <line
                key={`gy-${tick}`}
                x1={padL}
                y1={py}
                x2={w - padR}
                y2={py}
                stroke={gridStroke}
                strokeWidth={isLarge ? '1' : '0.8'}
              />
            );
          })}

        {/* Vertical Axis of Symmetry */}
        {showSymmetryAxis && vertex && (
          <g>
            <line
              x1={toPxX(vertex.x)}
              y1={padT}
              x2={toPxX(vertex.x)}
              y2={h - padB}
              stroke="#f59e0b"
              strokeWidth={isLarge ? '1.5' : '1.2'}
              strokeDasharray="4 4"
            />
            {isLarge && (
              <text
                x={toPxX(vertex.x) + 4}
                y={padT + 12}
                fill={isDark ? '#fcd34d' : '#b45309'}
                fontSize="10"
                fontWeight="bold"
              >
                x = {Number(vertex.x.toFixed(2))}
              </text>
            )}
          </g>
        )}

        {/* X Axis */}
        <line
          x1={padL - 10}
          y1={axisY}
          x2={w - padR + 15}
          y2={axisY}
          stroke={axisStroke}
          strokeWidth={isLarge ? '1.5' : '1.2'}
          markerEnd={`url(#${isLarge ? 'arrX_lg' : 'arrX_sm'})`}
        />
        <text
          x={w - padR + 8}
          y={axisY - 6}
          fill={textAxisFill}
          fontSize={isLarge ? '12' : '10'}
          fontWeight="bold"
        >
          x
        </text>

        {/* Y Axis */}
        <line
          x1={axisX}
          y1={h - padB + 10}
          x2={axisX}
          y2={padT - 12}
          stroke={axisStroke}
          strokeWidth={isLarge ? '1.5' : '1.2'}
          markerEnd={`url(#${isLarge ? 'arrY_lg' : 'arrY_sm'})`}
        />
        <text
          x={axisX - 12}
          y={padT - 5}
          fill={textAxisFill}
          fontSize={isLarge ? '12' : '10'}
          fontWeight="bold"
        >
          y
        </text>

        {/* Origin 0 */}
        <text
          x={axisX - 8}
          y={axisY + 12}
          fill={textFill}
          fontSize={isLarge ? '10' : '8.5'}
        >
          0
        </text>

        {/* X Axis Ticks */}
        {xTicks.map((tick) => {
          const px = toPxX(tick);
          return (
            <g key={`lbl-x-${tick}`}>
              <line
                x1={px}
                y1={axisY - 3}
                x2={px}
                y2={axisY + 3}
                stroke={axisStroke}
                strokeWidth="1"
              />
              <text
                x={px}
                y={axisY + 13}
                fill={textFill}
                fontSize={isLarge ? '10' : '8.5'}
                textAnchor="middle"
              >
                {tick}
              </text>
            </g>
          );
        })}

        {/* Y Axis Ticks */}
        {yTicks.map((tick) => {
          const py = toPxY(tick);
          return (
            <g key={`lbl-y-${tick}`}>
              <line
                x1={axisX - 3}
                y1={py}
                x2={axisX + 3}
                y2={py}
                stroke={axisStroke}
                strokeWidth="1"
              />
              <text
                x={axisX - 6}
                y={py + 3.5}
                fill={textFill}
                fontSize={isLarge ? '10' : '8.5'}
                textAnchor="end"
              >
                {tick}
              </text>
            </g>
          );
        })}

        {/* Function Curve */}
        <path
          d={pathD}
          fill="none"
          stroke={isDark ? '#60a5fa' : '#2563eb'}
          strokeWidth={isLarge ? '3' : '2.4'}
          strokeLinecap="round"
        />

        {/* Roots points (blue dots on x-axis) */}
        {showRoots &&
          roots.map((r, idx) => {
            const px = toPxX(r.x);
            const py = toPxY(0);
            return (
              <g key={`root-${idx}`}>
                <circle
                  cx={px}
                  cy={py}
                  r={isLarge ? '5.5' : '4.5'}
                  fill="#2563eb"
                  stroke={isDark ? '#0b1120' : '#ffffff'}
                  strokeWidth="2"
                />
                <rect
                  x={px - (isLarge ? 14 : 11)}
                  y={py + (isLarge ? 6 : 5)}
                  width={isLarge ? 28 : 22}
                  height={isLarge ? 14 : 12}
                  rx="3"
                  fill={isDark ? '#1e293b' : '#eff6ff'}
                  stroke={isDark ? '#3b82f6' : '#93c5fd'}
                  strokeWidth="0.8"
                />
                <text
                  x={px}
                  y={py + (isLarge ? 16 : 14)}
                  fill={isDark ? '#93c5fd' : '#1e40af'}
                  fontSize={isLarge ? '9.5' : '8'}
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {Number(r.x.toFixed(1))}
                </text>
              </g>
            );
          })}

        {/* Vertex point (amber dot) */}
        {showVertex && vertex && (
          <g>
            <circle
              cx={toPxX(vertex.x)}
              cy={toPxY(vertex.y)}
              r={isLarge ? '5.5' : '4.5'}
              fill="#f59e0b"
              stroke={isDark ? '#0b1120' : '#ffffff'}
              strokeWidth="2"
            />
            <rect
              x={toPxX(vertex.x) - (isLarge ? 24 : 18)}
              y={toPxY(vertex.y) - (isLarge ? 20 : 16)}
              width={isLarge ? 48 : 36}
              height={isLarge ? 15 : 12}
              rx="3"
              fill={isDark ? '#272015' : '#fffbeb'}
              stroke={isDark ? '#f59e0b' : '#fcd34d'}
              strokeWidth="0.8"
            />
            <text
              x={toPxX(vertex.x)}
              y={toPxY(vertex.y) - (isLarge ? 9 : 7)}
              fill={isDark ? '#fde68a' : '#92400e'}
              fontSize={isLarge ? '9' : '7.5'}
              fontWeight="bold"
              textAnchor="middle"
            >
              ({Number(vertex.x.toFixed(1))}; {Number(vertex.y.toFixed(1))})
            </text>
          </g>
        )}

        {/* Y-intercept (purple dot) */}
        {showYIntercept && yIntercept && (
          <g>
            <circle
              cx={toPxX(yIntercept.x)}
              cy={toPxY(yIntercept.y)}
              r={isLarge ? '5' : '4'}
              fill="#9333ea"
              stroke={isDark ? '#0b1120' : '#ffffff'}
              strokeWidth="2"
            />
            {isLarge && (
              <text
                x={toPxX(yIntercept.x) + 8}
                y={toPxY(yIntercept.y) + 3}
                fill={isDark ? '#d8b4fe' : '#7e22ce'}
                fontSize="9"
                fontWeight="bold"
              >
                (0; {Number(yIntercept.y.toFixed(1))})
              </text>
            )}
          </g>
        )}

        {/* Hover crosshair */}
        {hoverPt && (
          <g>
            <line
              x1={hoverPt.px}
              y1={padT}
              x2={hoverPt.px}
              y2={h - padB}
              stroke="#94a3b8"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            <line
              x1={padL}
              y1={hoverPt.py}
              x2={w - padR}
              y2={hoverPt.py}
              stroke="#94a3b8"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            <circle
              cx={hoverPt.px}
              cy={hoverPt.py}
              r={isLarge ? '4.5' : '3.5'}
              fill="#ef4444"
              stroke="#ffffff"
              strokeWidth="1.8"
            />
          </g>
        )}
      </svg>
    );
  };

  return (
    <>
      {/* 1. INLINE GRAPH CARD (Inside page / sidebar) */}
      <div className="relative bg-white dark:bg-slate-950 rounded-xl overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-2xs w-full transition-colors">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-3 py-2 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleZoomIn}
              className="p-1 hover:bg-slate-200/80 dark:hover:bg-slate-800 rounded transition text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              title="Приблизить (+)"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1 hover:bg-slate-200/80 dark:hover:bg-slate-800 rounded transition text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              title="Отдалить (-)"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1 hover:bg-slate-200/80 dark:hover:bg-slate-800 rounded transition text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              title="Сбросить масштаб"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
            <button
              onClick={() => handleDownload(svgRef)}
              className="p-1 hover:bg-slate-200/80 dark:hover:bg-slate-800 rounded transition text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              title="Скачать график (SVG)"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setShowAnalysisDrawer(!showAnalysisDrawer)}
              className={`p-1 rounded transition cursor-pointer flex items-center gap-1 text-[11px] ${
                showAnalysisDrawer
                  ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-semibold'
                  : 'hover:bg-slate-200/80 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
              title="Свойства и точки"
            >
              <Sliders className="w-3 h-3" />
              <span className="hidden sm:inline">Точки</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-md text-[11px] font-mono font-medium text-slate-700 dark:text-slate-200 shadow-2xs max-w-[150px] truncate">
              {expression}
            </div>
            <button
              onClick={() => setIsFullscreen(true)}
              className="p-1 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 rounded transition cursor-pointer flex items-center gap-1 text-[11px] font-medium"
              title="Развернуть график на весь экран"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">На весь экран</span>
            </button>
          </div>
        </div>

        {/* Critical Points Filter Ribbon */}
        <div className="px-3 py-1.5 bg-slate-100/60 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
          <button
            onClick={() => setShowRoots(!showRoots)}
            className={`px-2 py-0.5 rounded-md font-medium transition cursor-pointer flex items-center gap-1 shrink-0 ${
              showRoots ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-300"></span>
            <span>Нули ({roots.length})</span>
          </button>

          {vertex && (
            <button
              onClick={() => setShowVertex(!showVertex)}
              className={`px-2 py-0.5 rounded-md font-medium transition cursor-pointer flex items-center gap-1 shrink-0 ${
                showVertex ? 'bg-amber-500 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-200"></span>
              <span>Вершина</span>
            </button>
          )}

          {yIntercept && (
            <button
              onClick={() => setShowYIntercept(!showYIntercept)}
              className={`px-2 py-0.5 rounded-md font-medium transition cursor-pointer flex items-center gap-1 shrink-0 ${
                showYIntercept ? 'bg-purple-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-purple-300"></span>
              <span>OY</span>
            </button>
          )}
        </div>

        {/* SVG Container: Exact aspect ratio & Height, NO squashing */}
        <div className="relative w-full h-[230px] bg-slate-50/30 dark:bg-slate-950/40">
          {renderSvgContent(svgRef, inlineWidth, inlineHeight, false)}

          {hoverPt && !isFullscreen && (
            <div
              className="absolute bg-slate-900/90 text-white text-[10px] font-mono px-2 py-0.5 rounded shadow pointer-events-none z-10 transition-transform"
              style={{
                left: Math.min(Math.max(hoverPt.px - 30, 8), inlineWidth - 80),
                top: Math.max(hoverPt.py - 28, 8),
              }}
            >
              ({hoverPt.x.toFixed(2)}; {hoverPt.y.toFixed(2)})
            </div>
          )}
        </div>

        {/* Analysis Properties Drawer */}
        {showAnalysisDrawer && (
          <div className="p-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-2 animate-in fade-in">
            <div className="font-bold text-slate-800 dark:text-slate-100 text-[11px] uppercase tracking-wider flex items-center justify-between">
              <span>Анализ свойств функции</span>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-normal">CAS Engine</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 dark:text-slate-400 block text-[10px]">Нули функции:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {roots.length > 0
                    ? roots.map((r) => r.label).join(', ')
                    : 'Действительных нулей нет'}
                </span>
              </div>
              {vertex && (
                <div className="bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 dark:text-slate-400 block text-[10px]">Экстремум (вершина):</span>
                  <span className="font-semibold text-amber-700 dark:text-amber-400">{vertex.label}</span>
                </div>
              )}
              {yIntercept && (
                <div className="bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 dark:text-slate-400 block text-[10px]">Пересечение OY:</span>
                  <span className="font-semibold text-purple-700 dark:text-purple-400">{yIntercept.label}</span>
                </div>
              )}
              <div className="bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 dark:text-slate-400 block text-[10px]">Область определения:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">x ∈ (-∞; +∞)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. FULLSCREEN MODAL (Rendered at top level via React Portal) */}
      {isFullscreen &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
            <div
              className="fixed inset-0 -z-10"
              onClick={() => setIsFullscreen(false)}
            />

            <div className="relative bg-white dark:bg-slate-900 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 transition-colors">
              {/* Modal Top Header */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                    <Maximize2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-slate-900 dark:text-white">Интерактивный график функции</h2>
                      <span className="bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded text-xs font-mono font-semibold">
                        {expression}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Координатная плоскость с точным математическим отображением корней и экстремумов
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1">
                    <button
                      onClick={handleZoomIn}
                      className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-200 cursor-pointer"
                      title="Приблизить (+)"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleZoomOut}
                      className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-200 cursor-pointer"
                      title="Отдалить (-)"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleResetZoom}
                      className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-200 cursor-pointer"
                      title="Сбросить масштаб (100%)"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleDownload(fullSvgRef)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-medium transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Скачать SVG</span>
                  </button>

                  <button
                    onClick={() => setIsFullscreen(false)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                    title="Свернуть график (Esc)"
                  >
                    <Minimize2 className="w-3.5 h-3.5" />
                    <span>Закрыть (Esc)</span>
                  </button>
                </div>
              </div>

              {/* Toggles Ribbon */}
              <div className="px-4 py-2 bg-slate-100/70 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Элементы на графике:</span>
                  <button
                    onClick={() => setShowRoots(!showRoots)}
                    className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
                      showRoots
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-blue-300"></span>
                    <span>Нули (x-пересечения): {roots.length}</span>
                  </button>

                  {vertex && (
                    <button
                      onClick={() => setShowVertex(!showVertex)}
                      className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
                        showVertex
                          ? 'bg-amber-500 text-white shadow-2xs'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-amber-200"></span>
                      <span>Экстремум: ({Number(vertex.x.toFixed(1))}; {Number(vertex.y.toFixed(1))})</span>
                    </button>
                  )}

                  {vertex && (
                    <button
                      onClick={() => setShowSymmetryAxis(!showSymmetryAxis)}
                      className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
                        showSymmetryAxis
                          ? 'bg-slate-800 dark:bg-slate-700 text-white shadow-2xs'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <span>Ось симметрии x = {Number(vertex.x.toFixed(1))}</span>
                    </button>
                  )}

                  {yIntercept && (
                    <button
                      onClick={() => setShowYIntercept(!showYIntercept)}
                      className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
                        showYIntercept
                          ? 'bg-purple-600 text-white shadow-2xs'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-purple-300"></span>
                      <span>Точка OY: {yIntercept.label}</span>
                    </button>
                  )}

                  <button
                    onClick={() => setShowGrid(!showGrid)}
                    className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                      showGrid ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100' : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Сетка
                  </button>
                </div>

                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  Масштаб: {Math.round(zoomLevel * 100)}% · X: [{xMin.toFixed(1)}; {xMax.toFixed(1)}]
                </div>
              </div>

              {/* High-Resolution SVG Canvas */}
              <div className="relative flex-1 min-h-[460px] sm:min-h-[500px] bg-slate-50/40 dark:bg-slate-950/60 p-2 sm:p-4 flex items-center justify-center overflow-hidden">
                <div className="w-full h-full max-h-[520px]">
                  {renderSvgContent(fullSvgRef, fullWidth, fullHeight, true)}
                </div>

                {hoverPt && (
                  <div
                    className="absolute bg-slate-900/95 text-white text-xs font-mono px-3 py-1.5 rounded-lg shadow-xl pointer-events-none z-20 border border-slate-700"
                    style={{
                      left: Math.min(Math.max(hoverPt.px - 40, 20), fullWidth - 140),
                      top: Math.max(hoverPt.py - 35, 20),
                    }}
                  >
                    <span className="text-slate-400">Точка:</span> ({hoverPt.x.toFixed(3)}; {hoverPt.y.toFixed(3)})
                  </div>
                )}
              </div>

              {/* Footer Analysis Summary Cards */}
              <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/60 rounded-xl p-2.5">
                  <span className="text-[10px] uppercase font-bold text-blue-700 dark:text-blue-400 block mb-0.5">
                    Нули функции
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {roots.length > 0 ? roots.map((r) => r.label).join(', ') : 'Действительных корней нет'}
                  </span>
                </div>

                <div className="bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 rounded-xl p-2.5">
                  <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400 block mb-0.5">
                    Экстремум
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {vertex ? `${vertex.label} (${vertex.y < 0 ? 'минимум' : 'максимум'})` : 'Нет точки перегиба'}
                  </span>
                </div>

                <div className="bg-purple-50/60 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-800/60 rounded-xl p-2.5">
                  <span className="text-[10px] uppercase font-bold text-purple-700 dark:text-purple-400 block mb-0.5">
                    Пересечение OY
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {yIntercept ? yIntercept.label : 'Не определено'}
                  </span>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5">
                  <span className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-400 block mb-0.5">
                    Область определения
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    D(f) = (-∞; +∞)
                  </span>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
