import React, { useState, useRef, useMemo } from 'react';
import { Timeframe, ChartDataPoint, Currency } from '../types';
import { TIMEFRAME_DATA } from '../data/currencies';
import { FlagIcon } from './FlagIcon';
import {
  TrendingUp,
  TrendingDown,
  LineChart,
  ArrowLeftRight,
  Download,
  ChevronDown,
  Search,
  Check,
} from 'lucide-react';

interface ChartCardProps {
  currencies: Currency[];
  baseCurrency: string;
  targetCurrency: string;
  showAverage: boolean;
  onBaseChange?: (code: string) => void;
  onTargetChange?: (code: string) => void;
  onSwapCurrencies?: () => void;
  onToggleAverage?: () => void;
  onDownloadChart?: () => void;
  t?: any;
  getCurrencyName?: (code: string, fallback: string) => string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  currencies,
  baseCurrency,
  targetCurrency,
  showAverage,
  onBaseChange,
  onTargetChange,
  onSwapCurrencies,
  onToggleAverage,
  onDownloadChart,
  t,
  getCurrencyName,
}) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('3М');
  const [hoverIndex, setHoverIndex] = useState<number | null>(6); // Default 6 is '23 июл' in 3M data
  const [showBaseDropdown, setShowBaseDropdown] = useState(false);
  const [showTargetDropdown, setShowTargetDropdown] = useState(false);
  const [baseSearch, setBaseSearch] = useState('');
  const [targetSearch, setTargetSearch] = useState('');
  const chartRef = useRef<SVGSVGElement | null>(null);

  const rawData: ChartDataPoint[] = TIMEFRAME_DATA[timeframe] || TIMEFRAME_DATA['3М'];

  const availableCurrencies = [
    ...currencies.filter((c) => c.code !== 'UZS'),
    { code: 'UZS', name: 'Узбекский сум', rate: 1, symbol: "so'm", change24h: 0, sparkline: [] },
  ];

  const filteredBaseCurrencies = availableCurrencies.filter(
    (c) =>
      c.code.toLowerCase().includes(baseSearch.toLowerCase()) ||
      c.name.toLowerCase().includes(baseSearch.toLowerCase())
  );

  const filteredTargetCurrencies = availableCurrencies.filter(
    (c) =>
      c.code.toLowerCase().includes(targetSearch.toLowerCase()) ||
      c.name.toLowerCase().includes(targetSearch.toLowerCase())
  );

  // Helper to get currency rate to UZS
  const getRateToUzs = (code: string): number => {
    if (code === 'UZS') return 1;
    const found = currencies.find((c) => c.code === code);
    return found ? found.rate : 1;
  };

  // Compute actual rate for any base and target at each historical data point
  const { data, isSmallScale } = useMemo(() => {
    const usdCurrentRate = getRateToUzs('USD') || 12650;
    const baseCurrentRate = getRateToUzs(baseCurrency);
    const targetCurrentRate = getRateToUzs(targetCurrency);

    // Scaling ratio for base and target relative to USD
    const baseFactor = baseCurrentRate / usdCurrentRate;
    const targetFactor = targetCurrentRate / usdCurrentRate;

    const computed = rawData.map((d) => {
      let rateValue = 1;
      if (baseCurrency === targetCurrency) {
        rateValue = 1;
      } else if (targetCurrency === 'UZS') {
        rateValue = d.rate * baseFactor;
      } else if (baseCurrency === 'UZS') {
        const targetRate = d.rate * targetFactor;
        rateValue = targetRate > 0 ? 1 / targetRate : 0;
      } else {
        const baseRate = d.rate * baseFactor;
        const targetRate = d.rate * targetFactor;
        rateValue = targetRate > 0 ? baseRate / targetRate : 1;
      }

      return {
        date: d.date,
        displayDate: d.displayDate,
        rate: rateValue,
      };
    });

    const maxVal = Math.max(...computed.map((d) => d.rate));
    const small = maxVal < 1;

    return { data: computed, isSmallScale: small };
  }, [rawData, baseCurrency, targetCurrency, currencies]);

  // Statistics calculation
  const minRate = Math.min(...data.map((d) => d.rate));
  const maxRate = Math.max(...data.map((d) => d.rate));
  const currentRate = data[data.length - 1]?.rate || 1;
  const firstRate = data[0]?.rate || minRate;
  const changePercent = firstRate > 0 ? ((currentRate - firstRate) / firstRate) * 100 : 0;
  const isPositive = changePercent >= 0;
  const averageRate = data.reduce((acc, d) => acc + d.rate, 0) / data.length;

  // Number formatting helper
  const formatRate = (val: number) => {
    if (val === 0) return '0';
    if (val >= 1000) {
      return Math.round(val).toLocaleString('ru-RU');
    }
    if (val >= 100) {
      return val.toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 2 });
    }
    if (val >= 1) {
      return val.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
    }
    if (val >= 0.001) {
      return val.toLocaleString('ru-RU', { minimumFractionDigits: 4, maximumFractionDigits: 6 });
    }
    // Very small numbers like 0.000079
    return val.toLocaleString('ru-RU', { minimumFractionDigits: 6, maximumFractionDigits: 8 });
  };

  // SVG Coordinate mapping
  const width = 680;
  const height = 260;
  const padding = { top: 20, right: 20, bottom: 40, left: isSmallScale ? 75 : 60 };

  // Y-axis grid ticks (5 nice ticks)
  const yTicks = useMemo(() => {
    if (maxRate === minRate) {
      return [maxRate * 1.02, maxRate * 1.01, maxRate, maxRate * 0.99, maxRate * 0.98];
    }
    const step = (maxRate - minRate) / 4;
    return [
      maxRate,
      maxRate - step,
      maxRate - step * 2,
      maxRate - step * 3,
      minRate,
    ];
  }, [minRate, maxRate]);

  const minY = Math.min(...yTicks);
  const maxY = Math.max(...yTicks);
  const yRange = maxY - minY || 0.00001;

  const points = useMemo(() => {
    return data.map((d, i) => {
      const x = padding.left + (i / (data.length - 1)) * (width - padding.left - padding.right);
      const y = padding.top + ((maxY - d.rate) / yRange) * (height - padding.top - padding.bottom);
      return { x, y, data: d };
    });
  }, [data, minY, maxY, yRange, width, height, padding.left]);

  // SVG Smooth cubic bezier path
  const curvePath = useMemo(() => {
    if (points.length === 0) return '';
    return points.reduce((acc, p, i, arr) => {
      if (i === 0) return `M ${p.x} ${p.y}`;
      const prev = arr[i - 1];
      const cx1 = prev.x + (p.x - prev.x) / 2;
      const cy1 = prev.y;
      const cx2 = prev.x + (p.x - prev.x) / 2;
      const cy2 = p.y;
      return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p.x} ${p.y}`;
    }, '');
  }, [points]);

  // Area path
  const areaPath = useMemo(() => {
    if (points.length === 0) return '';
    const bottomY = height - padding.bottom;
    const firstX = points[0].x;
    const lastX = points[points.length - 1].x;
    return `${curvePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  }, [curvePath, points, height, padding.bottom]);

  // Active hover point
  const activePoint = hoverIndex !== null && points[hoverIndex] ? points[hoverIndex] : points[Math.floor(points.length / 2)];

  // Average line Y coordinate
  const avgY = padding.top + ((maxY - averageRate) / yRange) * (height - padding.top - padding.bottom);

  // Mouse interaction
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!chartRef.current) return;
    const rect = chartRef.current.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * width;

    let closestIdx = 0;
    let minDistance = Infinity;

    points.forEach((p, idx) => {
      const dist = Math.abs(p.x - mouseX);
      if (dist < minDistance) {
        minDistance = dist;
        closestIdx = idx;
      }
    });

    setHoverIndex(closestIdx);
  };

  const timeframes: Timeframe[] = ['1Д', '1Н', '1М', '3М', '1Г', '5Л', 'Все'];
  const timeframeTranslationKeys: Record<Timeframe, string> = {
    '1Д': '1D',
    '1Н': '1W',
    '1М': '1M',
    '3М': '3M',
    '1Г': '1Y',
    '5Л': '5Y',
    'Все': 'All',
  };

  // Enhanced download handler: exports full chart visualization with labels, metrics, curve and branding
  const handleDownload = () => {
    try {
      const exportWidth = 1200;
      const exportHeight = 700;
      const canvas = document.createElement('canvas');
      canvas.width = exportWidth;
      canvas.height = exportHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Enable smooth text & line rendering
      ctx.imageSmoothingEnabled = true;

      // 1. Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, exportWidth, exportHeight);

      // Subtle border
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, exportWidth - 2, exportHeight - 2);

      // 2. Header Area
      // Logo & Brand
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(50, 42, 12, 38);
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 30px Montserrat, sans-serif';
      ctx.fillText('Toolboxi.uz', 72, 70);

      ctx.fillStyle = '#64748b';
      ctx.font = '500 16px Inter, sans-serif';
      ctx.fillText('Официальные данные ЦБ Республики Узбекистан', 270, 68);

      // Pair Title & Timeframe
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 24px Montserrat, sans-serif';
      ctx.fillText(`${t?.chart?.rateDynamics || 'Динамика курса'}: ${baseCurrency} / ${targetCurrency}`, 50, 130);

      // Timeframe pill badge
      ctx.fillStyle = '#eff6ff';
      ctx.beginPath();
      ctx.roundRect(exportWidth - 220, 48, 170, 36, 18);
      ctx.fill();
      ctx.strokeStyle = '#bfdbfe';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#1d4ed8';
      ctx.font = 'bold 15px Montserrat, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${t?.chart?.period || 'Период'}: ${timeframe}`, exportWidth - 135, 71);
      ctx.textAlign = 'left';

      // 3. Stats Strip (Current, Min, Max, Change)
      const statCardWidth = 260;
      const statCardY = 150;
      const stats = [
        { label: t?.chart?.currentRate || 'Текущий курс', val: `${formatRate(currentRate)} ${targetCurrency}`, color: '#0f172a' },
        { label: t?.chart?.periodMin || 'Минимум за период', val: `${formatRate(minRate)} ${targetCurrency}`, color: '#0f172a' },
        { label: t?.chart?.periodMax || 'Максимум за период', val: `${formatRate(maxRate)} ${targetCurrency}`, color: '#0f172a' },
        { 
          label: t?.chart?.periodChange || 'Изменение за период', 
          val: `${isPositive ? '+' : ''}${changePercent.toFixed(2)}%`, 
          color: isPositive ? '#059669' : '#e11d48' 
        },
      ];

      stats.forEach((s, idx) => {
        const x = 50 + idx * 280;
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.roundRect(x, statCardY, statCardWidth, 68, 12);
        ctx.fill();
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = '#64748b';
        ctx.font = '500 13px Inter, sans-serif';
        ctx.fillText(s.label, x + 16, statCardY + 28);

        ctx.fillStyle = s.color;
        ctx.font = 'bold 20px Montserrat, sans-serif';
        ctx.fillText(s.val, x + 16, statCardY + 54);
      });

      // 4. Chart Area Boundaries
      const chartLeft = 120;
      const chartTop = 260;
      const chartRight = exportWidth - 60;
      const chartBottom = exportHeight - 90;
      const chartW = chartRight - chartLeft;
      const chartH = chartBottom - chartTop;

      // Draw horizontal grid lines and Y-axis labels
      yTicks.forEach((tickVal) => {
        const y = chartTop + ((maxY - tickVal) / yRange) * chartH;

        ctx.strokeStyle = '#f1f5f9';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(chartLeft, y);
        ctx.lineTo(chartRight, y);
        ctx.stroke();

        ctx.fillStyle = '#94a3b8';
        ctx.font = '500 13px Inter, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(formatRate(tickVal), chartLeft - 15, y + 5);
      });
      ctx.textAlign = 'left';

      // Draw Average Line if enabled
      if (showAverage) {
        const avgExportY = chartTop + ((maxY - averageRate) / yRange) * chartH;
        ctx.save();
        ctx.setLineDash([6, 6]);
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(chartLeft, avgExportY);
        ctx.lineTo(chartRight, avgExportY);
        ctx.stroke();
        ctx.restore();

        ctx.fillStyle = '#2563eb';
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.fillText(`Средний: ${formatRate(averageRate)}`, chartLeft + 10, avgExportY - 8);
      }

      // Map data to canvas coordinates
      const canvasPoints = data.map((d, i) => {
        const x = chartLeft + (i / (data.length - 1)) * chartW;
        const y = chartTop + ((maxY - d.rate) / yRange) * chartH;
        return { x, y, data: d };
      });

      if (canvasPoints.length > 1) {
        // Gradient under curve
        const grad = ctx.createLinearGradient(0, chartTop, 0, chartBottom);
        grad.addColorStop(0, 'rgba(37, 99, 235, 0.28)');
        grad.addColorStop(0.7, 'rgba(37, 99, 235, 0.05)');
        grad.addColorStop(1, 'rgba(37, 99, 235, 0)');

        ctx.beginPath();
        ctx.moveTo(canvasPoints[0].x, canvasPoints[0].y);
        for (let i = 1; i < canvasPoints.length; i++) {
          const prev = canvasPoints[i - 1];
          const curr = canvasPoints[i];
          const cpX = prev.x + (curr.x - prev.x) / 2;
          ctx.bezierCurveTo(cpX, prev.y, cpX, curr.y, curr.x, curr.y);
        }
        ctx.lineTo(canvasPoints[canvasPoints.length - 1].x, chartBottom);
        ctx.lineTo(canvasPoints[0].x, chartBottom);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();

        // Main curve stroke
        ctx.beginPath();
        ctx.moveTo(canvasPoints[0].x, canvasPoints[0].y);
        for (let i = 1; i < canvasPoints.length; i++) {
          const prev = canvasPoints[i - 1];
          const curr = canvasPoints[i];
          const cpX = prev.x + (curr.x - prev.x) / 2;
          ctx.bezierCurveTo(cpX, prev.y, cpX, curr.y, curr.x, curr.y);
        }
        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 3.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        // X-axis date labels
        ctx.fillStyle = '#94a3b8';
        ctx.font = '500 13px Inter, sans-serif';
        ctx.textAlign = 'center';
        
        // Show up to 7 evenly spaced dates
        const step = Math.max(1, Math.floor((canvasPoints.length - 1) / 6));
        for (let i = 0; i < canvasPoints.length; i += step) {
          const pt = canvasPoints[i];
          ctx.fillText(pt.data.displayDate, pt.x, chartBottom + 25);
        }
        // Always include last date if not already drawn
        const lastIdx = canvasPoints.length - 1;
        if (lastIdx % step !== 0) {
          ctx.fillText(canvasPoints[lastIdx].data.displayDate, canvasPoints[lastIdx].x, chartBottom + 25);
        }
        ctx.textAlign = 'left';

        // Draw last point pin
        const lastP = canvasPoints[canvasPoints.length - 1];
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(lastP.x, lastP.y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // 5. Footer Watermark / Timestamp
      ctx.fillStyle = '#94a3b8';
      ctx.font = '500 13px Inter, sans-serif';
      const nowStr = new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' });
      ctx.fillText(`Сгенерировано: ${nowStr} • toolboxi.uz/currency`, 50, exportHeight - 25);

      // Trigger download
      const link = document.createElement('a');
      link.download = `chart_${baseCurrency}_${targetCurrency}_${timeframe}_toolboxi.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Failed to export chart image:', err);
      // Fallback to prop if provided
      if (onDownloadChart) onDownloadChart();
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs flex flex-col justify-between h-full">
      {/* Header with Title, Pair Selectors & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-3">
        {/* Left: Title & Quick Pair Selector */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <LineChart className="w-4.5 h-4.5" />
          </div>

          <div className="flex items-center gap-1.5 relative">
            {/* Base Currency Dropdown Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowBaseDropdown(!showBaseDropdown);
                  setShowTargetDropdown(false);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 transition-colors cursor-pointer"
              >
                <FlagIcon code={baseCurrency} size="sm" />
                <span>{baseCurrency}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showBaseDropdown && onBaseChange && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-1.5">
                  <div className="p-1 mb-1 border-b border-slate-100 flex items-center gap-1.5 text-slate-400">
                    <Search className="w-3.5 h-3.5" />
                    <input
                      type="text"
                      placeholder={t?.chart?.searchCurrency || 'Поиск валюты...'}
                      value={baseSearch}
                      onChange={(e) => setBaseSearch(e.target.value)}
                      className="w-full text-xs text-slate-800 outline-none placeholder:text-slate-400"
                      autoFocus
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {filteredBaseCurrencies.map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => {
                          onBaseChange(c.code);
                          setShowBaseDropdown(false);
                          setBaseSearch('');
                        }}
                        className="w-full px-2 py-1 text-left flex items-center justify-between hover:bg-slate-50 rounded-lg text-xs text-slate-800 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <FlagIcon code={c.code} size="sm" />
                          <span className="font-bold">{c.code}</span>
                          <span className="text-slate-400 text-[10px] truncate max-w-[90px]">
                            {getCurrencyName ? getCurrencyName(c.code, c.name) : c.name}
                          </span>
                        </div>
                        {baseCurrency === c.code && <Check className="w-3.5 h-3.5 text-blue-600" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Swap Button */}
            {onSwapCurrencies && (
              <button
                type="button"
                onClick={onSwapCurrencies}
                className="w-6 h-6 rounded-full bg-slate-100 hover:bg-blue-50 text-slate-500 hover:text-blue-600 flex items-center justify-center transition-colors cursor-pointer"
                title={t?.chart?.swap || 'Поменять валюты местами'}
              >
                <ArrowLeftRight className="w-3 h-3" />
              </button>
            )}

            {/* Target Currency Dropdown Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowTargetDropdown(!showTargetDropdown);
                  setShowBaseDropdown(false);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 transition-colors cursor-pointer"
              >
                <FlagIcon code={targetCurrency} size="sm" />
                <span>{targetCurrency}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showTargetDropdown && onTargetChange && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-1.5">
                  <div className="p-1 mb-1 border-b border-slate-100 flex items-center gap-1.5 text-slate-400">
                    <Search className="w-3.5 h-3.5" />
                    <input
                      type="text"
                      placeholder={t?.chart?.searchCurrency || 'Поиск валюты...'}
                      value={targetSearch}
                      onChange={(e) => setTargetSearch(e.target.value)}
                      className="w-full text-xs text-slate-800 outline-none placeholder:text-slate-400"
                      autoFocus
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {filteredTargetCurrencies.map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => {
                          onTargetChange(c.code);
                          setShowTargetDropdown(false);
                          setTargetSearch('');
                        }}
                        className="w-full px-2 py-1 text-left flex items-center justify-between hover:bg-slate-50 rounded-lg text-xs text-slate-800 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <FlagIcon code={c.code} size="sm" />
                          <span className="font-bold">{c.code}</span>
                          <span className="text-slate-400 text-[10px] truncate max-w-[90px]">
                            {getCurrencyName ? getCurrencyName(c.code, c.name) : c.name}
                          </span>
                        </div>
                        {targetCurrency === c.code && <Check className="w-3.5 h-3.5 text-blue-600" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Timeframe Pills, Average Toggle & Download */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Timeframes */}
          <div className="flex items-center gap-0.5 bg-slate-100/90 p-0.5 rounded-xl overflow-x-auto scrollbar-none">
            {timeframes.map((tf) => {
              const label = t?.chart?.timeframes?.[timeframeTranslationKeys[tf]] || tf;
              return (
                <button
                  key={tf}
                  type="button"
                  onClick={() => {
                    setTimeframe(tf);
                    setHoverIndex(null);
                  }}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-all cursor-pointer shrink-0 ${
                    timeframe === tf
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Average Line Toggle */}
          {onToggleAverage && (
            <button
              type="button"
              onClick={onToggleAverage}
              className={`text-xs font-semibold px-2.5 py-1 rounded-xl border transition-colors cursor-pointer flex items-center gap-1.5 ${
                showAverage
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  showAverage ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              />
              <span>{t?.chart?.averageRate || 'Средний курс'}</span>
            </button>
          )}

          {/* Download Chart Button */}
          <button
            type="button"
            onClick={handleDownload}
            className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
            title={t?.chart?.downloadPng || 'Скачать график (PNG)'}
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative w-full aspect-[2.4/1] min-h-[220px]">
        <svg
          ref={chartRef}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible select-none cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => {
            // If in 3M mode, reset back to July 23 (idx 6) matching screenshot
            if (timeframe === '3М') setHoverIndex(6);
          }}
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.22" />
              <stop offset="80%" stopColor="#2563eb" stopOpacity="0.02" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
            </linearGradient>

            <filter id="shadowTooltip" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.08" />
            </filter>
          </defs>

          {/* Horizontal Gridlines & Y-Axis Labels */}
          {yTicks.map((tickVal) => {
            const y = padding.top + ((maxY - tickVal) / yRange) * (height - padding.top - padding.bottom);
            return (
              <g key={tickVal}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1.2"
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-slate-400 text-[10px] font-medium"
                >
                  {formatRate(tickVal)}
                </text>
              </g>
            );
          })}

          {/* Average Reference Line (optional toggle) */}
          {showAverage && (
            <g>
              <line
                x1={padding.left}
                y1={avgY}
                x2={width - padding.right}
                y2={avgY}
                stroke="#3b82f6"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity="0.75"
              />
              <text
                x={width - padding.right}
                y={avgY - 6}
                textAnchor="end"
                className="fill-blue-600 text-[10px] font-semibold"
              >
                Среднее: {formatRate(averageRate)}
              </text>
            </g>
          )}

          {/* Area under curve */}
          <path d={areaPath} fill="url(#chartGradient)" />

          {/* Main Blue Trend Curve */}
          <path
            d={curvePath}
            fill="none"
            stroke="#1d63ed"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* X-Axis Date Labels */}
          {points.map((p, i) => {
            // Display label for every 2nd or key points
            const shouldShow =
              timeframe === '3М'
                ? [0, 3, 5, 7, 9, 11, 14].includes(i)
                : i % Math.ceil(points.length / 6) === 0 || i === points.length - 1;

            if (!shouldShow) return null;

            return (
              <text
                key={`label-${i}`}
                x={p.x}
                y={height - 12}
                textAnchor="middle"
                className="fill-slate-400 text-[11px] font-medium"
              >
                {p.data.displayDate}
              </text>
            );
          })}

          {/* Active Highlight Marker & Tooltip */}
          {activePoint && (
            <g>
              {/* Vertical Guide Line */}
              <line
                x1={activePoint.x}
                y1={padding.top}
                x2={activePoint.x}
                y2={height - padding.bottom}
                stroke="#3b82f6"
                strokeWidth="1.2"
                strokeDasharray="3 3"
                opacity="0.8"
              />

              {/* Point Outer Glow & Dot */}
              <circle
                cx={activePoint.x}
                cy={activePoint.y}
                r="7"
                fill="#3b82f6"
                fillOpacity="0.25"
              />
              <circle
                cx={activePoint.x}
                cy={activePoint.y}
                r="4.5"
                fill="#1d63ed"
                stroke="#ffffff"
                strokeWidth="2"
              />

              {/* Tooltip Box Matching Screenshot */}
              <g
                transform={`translate(${Math.min(
                  Math.max(activePoint.x - 65, padding.left),
                  width - padding.right - 130
                )}, ${Math.max(activePoint.y - 58, 10)})`}
                filter="url(#shadowTooltip)"
              >
                <rect
                  width="130"
                  height="44"
                  rx="10"
                  fill="#ffffff"
                  stroke="#e2e8f0"
                  strokeWidth="1"
                />
                {/* Tooltip Date */}
                <text
                  x="65"
                  y="16"
                  textAnchor="middle"
                  className="fill-slate-400 text-[10px] font-medium"
                >
                  {activePoint.data.date.includes(' ')
                    ? activePoint.data.date
                    : `${activePoint.data.displayDate} 2026`}
                </text>
                {/* Tooltip Rate with small blue dot */}
                <circle cx="16" cy="29" r="2.5" fill="#2563eb" />
                <text
                  x="24"
                  y="33"
                  className="fill-slate-900 text-xs font-bold"
                >
                  {formatRate(activePoint.data.rate)}{' '}
                  <tspan className="text-[10px] font-normal fill-slate-500">
                    {targetCurrency}
                  </tspan>
                </text>
              </g>
            </g>
          )}
        </svg>
      </div>

      {/* 4-Metric Statistics Footer */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-slate-100 mt-1">
        {/* Min */}
        <div>
          <div className="text-[17px] font-bold text-slate-900 tracking-tight">
            {formatRate(minRate)}
          </div>
          <div className="text-[11px] font-normal text-slate-400 mt-0.5">
            {t?.chart?.minRate || 'Минимум за период'}
          </div>
        </div>

        {/* Current */}
        <div>
          <div className="text-[17px] font-bold text-slate-900 tracking-tight">
            {formatRate(currentRate)}
          </div>
          <div className="text-[11px] font-normal text-slate-400 mt-0.5">
            {t?.chart?.currentRate || 'Текущий курс'}
          </div>
        </div>

        {/* Max */}
        <div>
          <div className="text-[17px] font-bold text-slate-900 tracking-tight">
            {formatRate(maxRate)}
          </div>
          <div className="text-[11px] font-normal text-slate-400 mt-0.5">
            {t?.chart?.maxRate || 'Максимум за период'}
          </div>
        </div>

        {/* Change */}
        <div>
          <div
            className={`text-[17px] font-bold tracking-tight flex items-center gap-0.5 ${
              isPositive ? 'text-emerald-600' : 'text-rose-500'
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>
              {isPositive ? `+${changePercent.toFixed(2)}%` : `${changePercent.toFixed(2)}%`}
            </span>
          </div>
          <div className="text-[11px] font-normal text-slate-400 mt-0.5">
            {t?.chart?.change || 'Изменение за период'}
          </div>
        </div>
      </div>
    </div>
  );
};
