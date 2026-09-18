import React, { useState, useRef, useEffect } from 'react';
import { ColorItem } from '../types';
import {
  downloadCanvasPng,
  exportSvg,
  exportJson,
  exportCssVariables,
  downloadFile,
} from '../utils/colorUtils';
import { exportTailwindConfig } from '../utils/shadesUtils';
import { Download, ChevronDown, Check, FileText, Image as ImageIcon, Code, Palette, Copy, Share2 } from 'lucide-react';

interface ExportSectionProps {
  colors: ColorItem[];
  onNotify: (msg: string) => void;
}

export const ExportSection: React.FC<ExportSectionProps> = ({ colors, onNotify }) => {
  const [selectedFormat, setSelectedFormat] = useState<'PNG' | 'SVG' | 'JSON' | 'CSS' | 'TAILWIND'>('PNG');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copiedAction, setCopiedAction] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExport = (format: 'PNG' | 'SVG' | 'JSON' | 'CSS' | 'TAILWIND') => {
    setSelectedFormat(format);
    if (format === 'PNG') {
      downloadCanvasPng(colors);
      onNotify('Изображение PNG успешно скачано!');
    } else if (format === 'SVG') {
      const svgContent = exportSvg(colors);
      downloadFile(svgContent, 'color-palette.svg', 'image/svg+xml');
      onNotify('Векторный файл SVG скачан!');
    } else if (format === 'JSON') {
      const jsonContent = exportJson(colors);
      downloadFile(jsonContent, 'color-palette.json', 'application/json');
      onNotify('Файл JSON скачан!');
    } else if (format === 'CSS') {
      const cssContent = exportCssVariables(colors);
      downloadFile(cssContent, 'palette.css', 'text/css');
      onNotify('Файл CSS скачан!');
    } else if (format === 'TAILWIND') {
      const tailwindContent = exportTailwindConfig(colors);
      downloadFile(tailwindContent, 'tailwind.palette.js', 'application/javascript');
      onNotify('Tailwind конфиг скачан!');
    }
  };

  const handleCopyCode = (format: 'HEX' | 'CSS' | 'JSON' | 'TAILWIND' | 'SHARE') => {
    if (format === 'HEX') {
      const hexList = colors.map((c) => c.hex).join(', ');
      navigator.clipboard.writeText(hexList);
      onNotify(`HEX коды скопированы: ${hexList}`);
      setCopiedAction('HEX');
    } else if (format === 'CSS') {
      const css = exportCssVariables(colors);
      navigator.clipboard.writeText(css);
      onNotify('CSS переменные скопированы в буфер!');
      setCopiedAction('CSS');
    } else if (format === 'JSON') {
      const json = exportJson(colors);
      navigator.clipboard.writeText(json);
      onNotify('JSON палитры скопирован в буфер!');
      setCopiedAction('JSON');
    } else if (format === 'TAILWIND') {
      const tw = exportTailwindConfig(colors);
      navigator.clipboard.writeText(tw);
      onNotify('Tailwind токены скопированы в буфер!');
      setCopiedAction('TAILWIND');
    } else if (format === 'SHARE') {
      const hexes = colors.map((c) => c.hex.replace('#', '')).join('-');
      const shareUrl = `${window.location.origin}${window.location.pathname}#palette=${hexes}`;
      navigator.clipboard.writeText(shareUrl);
      onNotify('Ссылка на палитру скопирована в буфер обмена!');
      setCopiedAction('SHARE');
    }
    setTimeout(() => setCopiedAction(null), 1500);
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Экспорт</h2>
            <p className="text-[11px] text-slate-500 mt-0.5">Сохранение палитры в файлы или код</p>
          </div>

          {/* Download Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              id="btn-download-dropdown"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-800 shadow-2xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Скачать</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-56 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-50 text-xs space-y-0.5">
                <button
                  type="button"
                  onClick={() => {
                    handleExport('PNG');
                    setIsDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 font-medium text-left cursor-pointer"
                >
                  <ImageIcon className="w-4 h-4 text-blue-500" />
                  <span>Изображение PNG</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleExport('SVG');
                    setIsDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 font-medium text-left cursor-pointer"
                >
                  <Palette className="w-4 h-4 text-amber-500" />
                  <span>Векторный файл SVG</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleExport('JSON');
                    setIsDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 font-medium text-left cursor-pointer"
                >
                  <Code className="w-4 h-4 text-emerald-500" />
                  <span>Файл структуры JSON</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleExport('CSS');
                    setIsDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 font-medium text-left cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-purple-500" />
                  <span>CSS переменные (.css)</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Format Selector Pills (PNG, SVG, JSON, CSS, Tailwind) */}
        <div className="grid grid-cols-5 gap-1.5 bg-slate-100/90 p-1.5 rounded-xl mb-4 text-xs font-semibold">
          {(['PNG', 'SVG', 'JSON', 'CSS', 'TAILWIND'] as const).map((fmt) => {
            const isCurrent = selectedFormat === fmt;
            return (
              <button
                key={fmt}
                type="button"
                id={`btn-export-${fmt.toLowerCase()}`}
                onClick={() => handleExport(fmt)}
                className={`py-1.5 rounded-lg text-xs font-bold transition-all text-center cursor-pointer ${
                  isCurrent
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
                title={`Скачать палитру в формате ${fmt}`}
              >
                {fmt === 'TAILWIND' ? 'Tailwind' : fmt}
              </button>
            );
          })}
        </div>

        {/* Quick Copy Buttons */}
        <div className="space-y-2">
          <span className="text-[11px] font-semibold text-slate-500">Быстрое копирование в буфер</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleCopyCode('CSS')}
              className="flex items-center justify-between p-2 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 text-left transition-all cursor-pointer group"
            >
              <div>
                <div className="text-xs font-semibold text-slate-800 group-hover:text-blue-600">CSS переменные</div>
                <div className="text-[10px] text-slate-400 font-mono">:root &#123; --color... &#125;</div>
              </div>
              {copiedAction === 'CSS' ? (
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
              )}
            </button>

            <button
              type="button"
              onClick={() => handleCopyCode('TAILWIND')}
              className="flex items-center justify-between p-2 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 text-left transition-all cursor-pointer group"
            >
              <div>
                <div className="text-xs font-semibold text-slate-800 group-hover:text-blue-600">Tailwind токены</div>
                <div className="text-[10px] text-slate-400 font-mono">colors: &#123; 50..900 &#125;</div>
              </div>
              {copiedAction === 'TAILWIND' ? (
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
              )}
            </button>

            <button
              type="button"
              onClick={() => handleCopyCode('SHARE')}
              className="flex items-center justify-between p-2 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 text-left transition-all cursor-pointer group"
            >
              <div>
                <div className="text-xs font-semibold text-slate-800 group-hover:text-blue-600">Ссылка на палитру</div>
                <div className="text-[10px] text-slate-400 truncate">Поделиться с командой</div>
              </div>
              {copiedAction === 'SHARE' ? (
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <Share2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 mt-3 text-[11px] text-slate-400 flex items-center justify-between">
        <span>Все форматы поддерживают {colors.length} цветов</span>
        <button
          type="button"
          onClick={() => handleCopyCode('HEX')}
          className="text-blue-600 hover:underline font-medium cursor-pointer"
        >
          Скопировать строку HEX
        </button>
      </div>
    </div>
  );
};
