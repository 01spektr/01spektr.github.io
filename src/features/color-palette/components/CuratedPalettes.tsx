import React, { useState } from 'react';
import { CURATED_PALETTES } from '../data/presets';
import { CuratedPalette } from '../types';
import { ChevronRight, ArrowRight, Sparkles } from 'lucide-react';

interface CuratedPalettesProps {
  onSelectPalette: (palette: CuratedPalette) => void;
}

export const CuratedPalettes: React.FC<CuratedPalettesProps> = ({ onSelectPalette }) => {
  const [startIndex, setStartIndex] = useState(0);
  const [showAllModal, setShowAllModal] = useState(false);

  const visibleCount = 6;
  const maxStart = Math.max(0, CURATED_PALETTES.length - visibleCount);

  const handleNext = () => {
    setStartIndex((prev) => (prev + 1 > maxStart ? 0 : prev + 1));
  };

  const displayedPalettes = CURATED_PALETTES.slice(startIndex, startIndex + visibleCount);

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Готовые палитры</h2>
          <p className="text-[11px] text-slate-500 mt-0.5">Вдохновляющие подборки для быстрого старта</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowAllModal(true)}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Смотреть все ({CURATED_PALETTES.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            title="Следующие палитры"
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Palettes Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {displayedPalettes.map((pal) => (
          <div
            key={pal.id}
            id={`curated-palette-${pal.id}`}
            onClick={() => onSelectPalette(pal)}
            className="group cursor-pointer text-left transition-all p-1.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200/60"
          >
            {/* Color Strip */}
            <div className="flex h-12 rounded-lg overflow-hidden shadow-2xs border border-slate-200/80 group-hover:shadow-xs transition-shadow">
              {pal.colors.map((c, idx) => (
                <div
                  key={idx}
                  className="flex-1 h-full"
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>

            {/* Label */}
            <div className="mt-1.5 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                {pal.name}
              </span>
              <span className="text-[10px] text-slate-400 capitalize shrink-0 ml-1">
                {pal.tags[0]}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for All Palettes */}
      {showAllModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-bold text-slate-900">Коллекция готовых палитр</h3>
                <p className="text-xs text-slate-500 mt-0.5">Выберите любую цветовую комбинацию для работы</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAllModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CURATED_PALETTES.map((pal) => (
                <div
                  key={pal.id}
                  onClick={() => {
                    onSelectPalette(pal);
                    setShowAllModal(false);
                  }}
                  className="p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-xs cursor-pointer transition-all bg-slate-50/50"
                >
                  <div className="flex h-11 rounded-lg overflow-hidden border border-black/5 mb-2">
                    {pal.colors.map((c, idx) => (
                      <div
                        key={idx}
                        className="flex-1 h-full"
                        style={{ backgroundColor: c }}
                        title={c}
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">{pal.name}</span>
                    <span className="text-[11px] text-slate-400">{pal.tags.join(', ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
