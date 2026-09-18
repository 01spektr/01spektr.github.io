import React from 'react';
import { SavedPalette } from '../types';
import { Heart, Trash2, Check, ArrowRight, X, FolderHeart } from 'lucide-react';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedPalettes: SavedPalette[];
  onApplyPalette: (colors: string[]) => void;
  onDeletePalette: (id: string) => void;
  onSaveCurrentPalette: () => void;
  onNotify: (msg: string) => void;
}

export const FavoritesModal: React.FC<FavoritesModalProps> = ({
  isOpen,
  onClose,
  savedPalettes,
  onApplyPalette,
  onDeletePalette,
  onSaveCurrentPalette,
  onNotify,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-lg p-5 border border-slate-200 shadow-xl space-y-4 max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <FolderHeart className="w-4 h-4 text-rose-500" />
            <span>Сохраненные палитры ({savedPalettes.length})</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onSaveCurrentPalette();
                onNotify('Текущая палитра сохранена в избранное!');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-rose-50 hover:bg-rose-100/80 text-rose-600 rounded-xl transition-colors cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>Сохранить текущую</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="overflow-y-auto space-y-2.5 flex-1 pr-1">
          {savedPalettes.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs space-y-2">
              <FolderHeart className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="font-semibold text-slate-600">Пока нет сохраненных палитр</p>
              <p className="text-[11px]">Нажмите «Сохранить текущую», чтобы добавить понравившуюся комбинацию в избранное</p>
            </div>
          ) : (
            savedPalettes.map((pal) => (
              <div
                key={pal.id}
                className="group flex items-center justify-between p-3 rounded-xl border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/20 transition-all bg-white"
              >
                <div className="space-y-1.5 min-w-0 flex-1 mr-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 truncate">{pal.name}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(pal.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Colors bar */}
                  <div className="flex h-6 rounded-lg overflow-hidden border border-black/5 shadow-2xs">
                    {pal.colors.map((c, idx) => (
                      <div
                        key={idx}
                        className="flex-1 h-full"
                        style={{ backgroundColor: c }}
                        title={c}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      onApplyPalette(pal.colors);
                      onClose();
                      onNotify(`Палитра «${pal.name}» применена!`);
                    }}
                    className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer"
                    title="Применить палитру"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeletePalette(pal.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Удалить из сохраненных"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
