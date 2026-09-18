import React from 'react';
import { ColorItem, ColorBlindnessType } from '../types';
import { Copy, Check, Lock, Unlock, ChevronLeft, ChevronRight, Dices } from 'lucide-react';
import { simulateColorBlindness } from '../utils/accessibilityUtils';

interface MainPaletteProps {
  colors: ColorItem[];
  selectedIndex: number;
  colorBlindness?: ColorBlindnessType;
  onSelectColor: (index: number) => void;
  onToggleLock: (index: number) => void;
  onCopyColor: (text: string) => void;
  onMoveColor?: (fromIndex: number, toIndex: number) => void;
  onRandomizeSlot?: (index: number) => void;
}

export const MainPalette: React.FC<MainPaletteProps> = ({
  colors,
  selectedIndex,
  colorBlindness = 'none',
  onSelectColor,
  onToggleLock,
  onCopyColor,
  onMoveColor,
  onRandomizeSlot,
}) => {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  const handleCopy = (e: React.MouseEvent, hex: string, index: number) => {
    e.stopPropagation();
    onCopyColor(hex);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
      {/* Top seamless color bar (no gaps, continuous stripes) */}
      <div className="flex h-28 sm:h-32 w-full">
        {colors.map((item, index) => {
          const isSelected = selectedIndex === index;
          const displayHex = colorBlindness !== 'none'
            ? simulateColorBlindness(item.hex, colorBlindness)
            : item.hex;

          return (
            <div
              key={item.id}
              onClick={() => onSelectColor(index)}
              className="flex-1 h-full relative cursor-pointer group transition-all"
              style={{ backgroundColor: displayHex }}
              title={`Нажмите, чтобы редактировать ${item.hex}`}
            >
              {/* Selected indicator (clean top pill) */}
              {isSelected && (
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-xs text-white text-[10px] font-semibold tracking-wider uppercase border border-white/30 shadow-xs pointer-events-none">
                  Выбран
                </div>
              )}

              {/* Quick actions cluster on hover */}
              <div className="absolute inset-x-0 bottom-2.5 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {/* Move Left */}
                {onMoveColor && index > 0 && (
                  <button
                    type="button"
                    title="Сдвинуть влево"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveColor(index, index - 1);
                    }}
                    className="w-6 h-6 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-3 h-3" />
                  </button>
                )}

                {/* Lock Button */}
                <button
                  type="button"
                  title={item.locked ? 'Разблокировать цвет' : 'Зафиксировать цвет'}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleLock(index);
                  }}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    item.locked
                      ? 'bg-black/60 text-amber-300 shadow-xs'
                      : 'bg-black/40 text-white hover:bg-black/60'
                  }`}
                >
                  {item.locked ? (
                    <Lock className="w-3.5 h-3.5" />
                  ) : (
                    <Unlock className="w-3.5 h-3.5" />
                  )}
                </button>

                {/* Randomize Slot */}
                {onRandomizeSlot && !item.locked && (
                  <button
                    type="button"
                    title="Случайный оттенок для этого слота"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRandomizeSlot(index);
                    }}
                    className="w-6 h-6 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Dices className="w-3 h-3" />
                  </button>
                )}

                {/* Move Right */}
                {onMoveColor && index < colors.length - 1 && (
                  <button
                    type="button"
                    title="Сдвинуть вправо"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveColor(index, index + 1);
                    }}
                    className="w-6 h-6 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Permanent locked icon if locked */}
              {item.locked && (
                <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full flex items-center justify-center bg-black/60 text-amber-300 group-hover:hidden">
                  <Lock className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom details row */}
      <div className="flex divide-x divide-slate-100 bg-white border-t border-slate-100">
        {colors.map((item, index) => {
          const isCopied = copiedIndex === index;
          const isSelected = selectedIndex === index;

          return (
            <div
              key={item.id}
              onClick={() => onSelectColor(index)}
              className={`flex-1 px-3 sm:px-4 py-2.5 sm:py-3 cursor-pointer transition-colors ${
                isSelected ? 'bg-blue-50/50' : 'hover:bg-slate-50/70'
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="font-bold text-xs sm:text-sm text-slate-900 font-mono tracking-tight">
                  {item.hex}
                </span>
                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    title={item.locked ? 'Разблокировать' : 'Заблокировать'}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleLock(index);
                    }}
                    className={`p-1 rounded transition-colors ${
                      item.locked
                        ? 'text-amber-500 hover:text-amber-600'
                        : 'text-slate-300 hover:text-slate-600'
                    }`}
                  >
                    {item.locked ? (
                      <Lock className="w-3 h-3" />
                    ) : (
                      <Unlock className="w-3 h-3" />
                    )}
                  </button>
                  <button
                    type="button"
                    title="Копировать HEX"
                    onClick={(e) => handleCopy(e, item.hex, index)}
                    className="text-slate-400 hover:text-blue-600 p-1 rounded transition-colors"
                  >
                    {isCopied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="text-[11px] text-slate-500 font-medium mt-0.5 flex items-center justify-between">
                <span>{item.role}</span>
                {item.locked && (
                  <span className="text-[10px] text-amber-600 font-medium font-mono">блок</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

