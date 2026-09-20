import React from "react";
import { FavoriteItem } from "../types.ts";
import { useTranslation } from "../context/LanguageContext.tsx";
import { X, Heart, Copy, Trash2, Check } from "lucide-react";

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: FavoriteItem[];
  onRemoveFavorite: (id: string) => void;
  onCopyText: (text: string, label: string) => void;
  onClearAll: () => void;
}

export const FavoritesModal: React.FC<FavoritesModalProps> = ({
  isOpen,
  onClose,
  favorites,
  onRemoveFavorite,
  onCopyText,
  onClearAll,
}) => {
  const { t } = useTranslation();
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (fav: FavoriteItem) => {
    onCopyText(fav.text, fav.styleName);
    setCopiedId(fav.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between font-heading">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-500 dark:text-rose-400 flex items-center justify-center">
              <Heart className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t("modals.favorites.title")} ({favorites.length})
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-inter">
                {t("hero.favoritesTooltip")}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-3.5 sm:p-5 overflow-y-auto flex-1 space-y-2.5">
          {favorites.length === 0 ? (
            <div className="py-12 text-center text-slate-400 dark:text-slate-500 font-inter">
              <Heart className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
              <p className="text-sm font-semibold font-heading text-slate-600 dark:text-slate-300">
                {t("modals.favorites.emptyTitle")}
              </p>
              <p className="text-xs mt-1 text-slate-400 dark:text-slate-500 max-w-xs mx-auto">
                {t("modals.favorites.emptyDesc")}
              </p>
            </div>
          ) : (
            favorites.map((fav) => {
              const isCopied = copiedId === fav.id;
              return (
                <div
                  key={fav.id}
                  className="p-3 sm:p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-bold text-blue-600 dark:text-blue-400 font-heading">
                      {fav.styleName}
                    </div>
                    <div className="text-sm font-medium text-slate-900 dark:text-white truncate select-all mt-0.5 font-sans">
                      {fav.text}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleCopy(fav)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold font-heading flex items-center gap-1 transition-all cursor-pointer active:scale-95 ${
                        isCopied
                          ? "bg-emerald-600 text-white"
                          : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-blue-600 hover:text-white border border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span className="hidden xs:inline">
                        {isCopied ? t("styles.copiedBtn") : t("styles.copyBtn")}
                      </span>
                    </button>
                    <button
                      onClick={() => onRemoveFavorite(fav.id)}
                      title="Удалить"
                      className="p-2 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {favorites.length > 0 && (
          <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center font-heading">
            <button
              onClick={onClearAll}
              className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
            >
              {t("modals.favorites.clearAll")}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer"
            >
              {t("modals.favorites.close")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
