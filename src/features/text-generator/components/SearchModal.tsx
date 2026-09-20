import React, { useState, useEffect, useMemo } from "react";
import { Search, X, Type, Smile, Sparkles, ArrowRight } from "lucide-react";
import { TEXT_STYLES } from "../data/textStyles.ts";
import { POPULAR_SYMBOLS, KAOMOJI_LIST } from "../data/symbolsData.ts";
import { SidebarCategoryType } from "../types.ts";
import { useTranslation } from "../context/LanguageContext.tsx";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (cat: SidebarCategoryType) => void;
  onCopyText: (text: string, label: string) => void;
  onInsertSymbol: (symbol: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectCategory,
  onInsertSymbol,
}) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
      } else if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const results = useMemo(() => {
    if (!query.trim()) {
      return { matchedStyles: [], matchedSymbols: [], matchedKaomoji: [] };
    }
    const q = query.toLowerCase();

    const matchedStyles = TEXT_STYLES.filter((s) => s.name.toLowerCase().includes(q)).slice(0, 5);

    const matchedSymbols = POPULAR_SYMBOLS.filter(
      (s) => s.name.toLowerCase().includes(q) || s.char.includes(q),
    ).slice(0, 6);

    const matchedKaomoji = KAOMOJI_LIST.filter(
      (k) => k.name.toLowerCase().includes(q) || k.text.includes(q),
    ).slice(0, 5);

    return { matchedStyles, matchedSymbols, matchedKaomoji };
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-24 p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Search input field */}
        <div className="p-3.5 sm:p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("modals.search.placeholder")}
            className="w-full text-base font-medium text-slate-900 dark:text-white bg-transparent outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 font-inter"
          />
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results Area */}
        <div className="p-3.5 sm:p-4 max-h-[60vh] overflow-y-auto space-y-4 font-inter">
          {!query.trim() ? (
            <div className="text-xs text-slate-400 dark:text-slate-500 space-y-2">
              <div className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px] font-heading">
                {t("modals.search.quickNavigation")}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onSelectCategory("styles");
                    onClose();
                  }}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-left text-slate-700 dark:text-slate-200 cursor-pointer font-heading font-semibold text-xs transition-colors"
                >
                  <Type className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                  <span>{t("modals.search.styles")}</span>
                </button>
                <button
                  onClick={() => {
                    onSelectCategory("kaomoji");
                    onClose();
                  }}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-left text-slate-700 dark:text-slate-200 cursor-pointer font-heading font-semibold text-xs transition-colors"
                >
                  <Smile className="w-4 h-4 text-pink-500 dark:text-pink-400" />
                  <span>{t("modals.search.kaomoji")}</span>
                </button>
                <button
                  onClick={() => {
                    onSelectCategory("symbols");
                    onClose();
                  }}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-left text-slate-700 dark:text-slate-200 cursor-pointer font-heading font-semibold text-xs transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                  <span>{t("modals.search.symbols")}</span>
                </button>
                <button
                  onClick={() => {
                    onSelectCategory("arrows");
                    onClose();
                  }}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-left text-slate-700 dark:text-slate-200 cursor-pointer font-heading font-semibold text-xs transition-colors"
                >
                  <ArrowRight className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                  <span>{t("modals.search.arrows")}</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Text styles matches */}
              {results.matchedStyles && results.matchedStyles.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 font-heading">
                    {t("modals.search.styles")}
                  </div>
                  <div className="space-y-1">
                    {results.matchedStyles.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          onSelectCategory("styles");
                          onClose();
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left cursor-pointer transition-colors"
                      >
                        <span className="text-sm font-bold text-slate-900 dark:text-white font-heading">
                          {s.name}
                        </span>
                        <span className="text-xs text-blue-600 dark:text-blue-400 font-sans">
                          {s.transform("Toolboxi")}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Kaomoji matches */}
              {results.matchedKaomoji && results.matchedKaomoji.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 font-heading">
                    {t("modals.search.kaomoji")}
                  </div>
                  <div className="space-y-1">
                    {results.matchedKaomoji.map((k) => (
                      <button
                        key={k.id}
                        onClick={() => {
                          onInsertSymbol(k.text);
                          onClose();
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/40 text-left cursor-pointer transition-colors"
                      >
                        <span className="text-sm font-semibold text-slate-900 dark:text-white font-sans">
                          {k.text}
                        </span>
                        <span className="text-xs text-blue-600 dark:text-blue-400 font-bold font-heading">
                          {t("modals.search.insertAction")}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Symbols matches */}
              {results.matchedSymbols && results.matchedSymbols.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 font-heading">
                    {t("modals.search.symbols")}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {results.matchedSymbols.map((sym) => (
                      <button
                        key={sym.id}
                        onClick={() => {
                          onInsertSymbol(sym.char);
                          onClose();
                        }}
                        title={sym.char}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-blue-600 hover:text-white text-sm flex items-center gap-1.5 cursor-pointer transition-colors font-heading font-medium"
                      >
                        <span className="text-base font-sans">{sym.char}</span>
                        <span className="text-xs opacity-75">{sym.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {results.matchedStyles?.length === 0 &&
                results.matchedKaomoji?.length === 0 &&
                results.matchedSymbols?.length === 0 && (
                  <div className="py-8 text-center text-slate-400 dark:text-slate-500 text-sm">
                    {t("modals.search.emptyResults")}
                  </div>
                )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
