import React, { useState, useMemo, useRef } from "react";
import {
  Sparkles,
  Check,
  Search,
  X,
  RefreshCw,
  Smile,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { SidebarCategoryType } from "../types.ts";
import { useTranslation } from "../context/LanguageContext.tsx";
import { EXPANDED_SYMBOLS, SYMBOL_TABS, SymbolCategoryKey } from "../data/expandedSymbols.ts";

interface QuickSymbolsWidgetProps {
  onCopySymbol: (symbol: string) => void;
  onInsertSymbol: (symbol: string) => void;
  onNavigateToCategory?: (category: SidebarCategoryType) => void;
}

export const QuickSymbolsWidget: React.FC<QuickSymbolsWidgetProps> = ({ onInsertSymbol }) => {
  const { t, lang } = useTranslation();
  const insertLabel =
    lang === "uz" ? "Matnga qo‘shish" : lang === "en" ? "Insert into text" : "Вставить в текст";
  const scrollLeftLabel =
    lang === "uz" ? "Chapga aylantirish" : lang === "en" ? "Scroll left" : "Скролл влево";
  const scrollRightLabel =
    lang === "uz" ? "O‘ngga aylantirish" : lang === "en" ? "Scroll right" : "Скролл вправо";
  const [activeTab, setActiveTab] = useState<SymbolCategoryKey>("popular");
  const [copiedChar, setCopiedChar] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Refs for smooth mouse wheel and arrow scrolling
  const tabsScrollRef = useRef<HTMLDivElement>(null);
  const symbolsScrollRef = useRef<HTMLDivElement>(null);

  // Filtered symbols based on active tab and search query
  const displayedSymbols = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    if (q) {
      const allMatches = new Set<string>();
      Object.entries(EXPANDED_SYMBOLS).forEach(([, list]) => {
        list.forEach((item) => {
          if (item.toLowerCase().includes(q)) {
            allMatches.add(item);
          }
        });
      });
      return Array.from(allMatches);
    }

    return EXPANDED_SYMBOLS[activeTab] || EXPANDED_SYMBOLS.popular;
  }, [activeTab, searchQuery]);

  const isMultiChar = activeTab === "dividers" || activeTab === "kaomoji";

  const handleSymbolClick = (char: string) => {
    onInsertSymbol(char);
    setCopiedChar(char);
    setTimeout(() => {
      setCopiedChar(null);
    }, 1200);
  };

  const handleInsertRandom = () => {
    const pool = displayedSymbols.length > 0 ? displayedSymbols : EXPANDED_SYMBOLS.popular;
    const randomChar = pool[Math.floor(Math.random() * pool.length)];
    handleSymbolClick(randomChar);
  };

  // Horizontal mouse-wheel scroll handler
  const handleWheelScroll = (
    e: React.WheelEvent<HTMLDivElement>,
    ref: React.RefObject<HTMLDivElement | null>,
  ) => {
    if (ref.current && e.deltaY !== 0) {
      e.preventDefault();
      ref.current.scrollLeft += e.deltaY;
    }
  };

  // Scroll helpers for desktop buttons
  const scrollSymbols = (direction: "left" | "right") => {
    if (symbolsScrollRef.current) {
      const offset = direction === "left" ? -320 : 320;
      symbolsScrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  const scrollTabs = (direction: "left" | "right") => {
    if (tabsScrollRef.current) {
      const offset = direction === "left" ? -200 : 200;
      tabsScrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <section
      id="quick-symbols-widget"
      className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs transition-colors"
    >
      {/* Header: Title, Count, Search, Random Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100/80 dark:border-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-heading">
                {t("symbols.title")}
              </h3>
              <span className="text-[11px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 px-2 py-0.5 rounded-md font-heading">
                {displayedSymbols.length}
              </span>
              <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 font-inter hidden sm:inline">
                ({t("symbols.totalCount")})
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-inter mt-0.5">
              {t("symbols.subtitle")}
            </p>
          </div>
        </div>

        {/* Search Bar & Random Action */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-52">
            <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("symbols.searchPlaceholder")}
              className="w-full h-8.5 pl-8 pr-7 text-xs font-inter text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
                title={t("symbols.resetSearch")}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleInsertRandom}
            className="h-8.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-750 font-semibold text-xs font-heading flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            title={t("symbols.randomBtn")}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">{t("symbols.randomBtn")}</span>
          </button>
        </div>
      </div>

      {/* Category Tabs: Clean single horizontal row, scrollable left-right on phone & PC */}
      {!searchQuery && (
        <div className="relative mb-3 group/tabs">
          {/* Desktop scroll left button */}
          <button
            type="button"
            onClick={() => scrollTabs("left")}
            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1.5 z-10 w-6 h-6 rounded-full bg-white dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700 items-center justify-center text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer opacity-80 hover:opacity-100 transition-all"
            title="Scroll left"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {/* Category tabs scroll container */}
          <div
            ref={tabsScrollRef}
            onWheel={(e) => handleWheelScroll(e, tabsScrollRef)}
            className="flex items-center gap-1.5 overflow-x-auto touch-pan-x no-scrollbar py-1 scroll-smooth"
          >
            {SYMBOL_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const count = EXPANDED_SYMBOLS[tab.id]?.length || 0;
              const translatedLabel = t(`symbols.tabs.${tab.id}`, tab.label);
              return (
                <button
                  key={tab.id}
                  type="button"
                  id={`symbol-tab-${tab.id}`}
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (symbolsScrollRef.current) {
                      symbolsScrollRef.current.scrollLeft = 0;
                    }
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer font-heading flex items-center gap-1.5 shrink-0 active:scale-95 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-xs font-bold"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-750 border border-slate-200/80 dark:border-slate-700/80"
                  }`}
                >
                  <span className="text-sm leading-none">{tab.icon}</span>
                  <span>{translatedLabel}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-md font-inter font-bold ${
                      isActive
                        ? "bg-blue-700 text-white"
                        : "bg-slate-200/90 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Desktop scroll right button */}
          <button
            type="button"
            onClick={() => scrollTabs("right")}
            className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1.5 z-10 w-6 h-6 rounded-full bg-white dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700 items-center justify-center text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer opacity-80 hover:opacity-100 transition-all"
            title="Scroll right"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Empty Search Results */}
      {displayedSymbols.length === 0 && (
        <div className="py-8 text-center bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
          <p className="text-sm font-semibold font-heading text-slate-700 dark:text-slate-200">
            {t("symbols.noResultsTitle")}
          </p>
          <p className="text-xs font-inter text-slate-400 dark:text-slate-500 mt-1">
            {t("symbols.noResultsDesc")}
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="mt-3 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 cursor-pointer font-heading"
          >
            {t("symbols.resetSearch")}
          </button>
        </div>
      )}

      {/* 2-ROW HORIZONTAL SCROLLING CONTAINER: NEAT & COMPACT */}
      {displayedSymbols.length > 0 && (
        <div className="relative group/symbols">
          {/* Scroll Left Button (Desktop) */}
          <button
            type="button"
            onClick={() => scrollSymbols("left")}
            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 w-7 h-7 rounded-full bg-white/95 dark:bg-slate-800/95 shadow-md border border-slate-200 dark:border-slate-700 items-center justify-center text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer opacity-90 hover:opacity-100 hover:scale-105 transition-all"
            title={scrollLeftLabel}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Multi-Character (Dividers, Kaomoji) in 2 Rows */}
          {isMultiChar ? (
            <div
              ref={symbolsScrollRef}
              onWheel={(e) => handleWheelScroll(e, symbolsScrollRef)}
              className="grid grid-rows-2 grid-flow-col auto-cols-max gap-2 overflow-x-auto touch-pan-x custom-scrollbar p-1 pb-2 bg-slate-50/50 dark:bg-slate-950/40 rounded-xl border border-slate-100 dark:border-slate-800/80 scroll-smooth"
            >
              {displayedSymbols.map((item, index) => {
                const isCopied = copiedChar === item;
                return (
                  <button
                    key={`${item}-${index}`}
                    type="button"
                    onClick={() => handleSymbolClick(item)}
                    title={`${insertLabel}: ${item}`}
                    className={`h-10 px-3 flex items-center justify-center rounded-xl text-xs font-medium transition-all transform active:scale-95 cursor-pointer select-none font-sans whitespace-nowrap shrink-0 ${
                      isCopied
                        ? "bg-emerald-500 text-white ring-2 ring-emerald-400 font-bold"
                        : "bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80 hover:border-blue-300 dark:hover:border-slate-600 text-slate-800 dark:text-slate-200 shadow-2xs"
                    }`}
                  >
                    {isCopied ? (
                      <span className="flex items-center gap-1 text-white font-semibold text-xs font-heading">
                        <Check className="w-3.5 h-3.5" />
                        <span>{t("symbols.inserted")}</span>
                      </span>
                    ) : (
                      <span>{item}</span>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            /* Single-character Symbols and Emojis in 2 Neat Rows */
            <div
              ref={symbolsScrollRef}
              onWheel={(e) => handleWheelScroll(e, symbolsScrollRef)}
              className="grid grid-rows-2 grid-flow-col auto-cols-[40px] sm:auto-cols-[44px] gap-1.5 sm:gap-2 overflow-x-auto touch-pan-x custom-scrollbar p-1 pb-2 bg-slate-50/50 dark:bg-slate-950/40 rounded-xl border border-slate-100 dark:border-slate-800/80 scroll-smooth"
            >
              {displayedSymbols.map((sym, index) => {
                const isCopied = copiedChar === sym;
                return (
                  <button
                    key={`${sym}-${index}`}
                    type="button"
                    title={`${insertLabel}: ${sym}`}
                    onClick={() => handleSymbolClick(sym)}
                    className={`h-10 sm:h-11 w-10 sm:w-11 flex items-center justify-center rounded-xl text-base sm:text-lg transition-all transform active:scale-90 hover:scale-105 cursor-pointer relative select-none shrink-0 ${
                      isCopied
                        ? "bg-emerald-500 text-white ring-2 ring-emerald-400 shadow-sm"
                        : "bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80 hover:border-blue-300 dark:hover:border-slate-600 text-slate-800 dark:text-slate-100 shadow-2xs"
                    }`}
                  >
                    {isCopied ? <Check className="w-4 h-4 text-white" /> : <span>{sym}</span>}
                  </button>
                );
              })}
            </div>
          )}

          {/* Scroll Right Button (Desktop) */}
          <button
            type="button"
            onClick={() => scrollSymbols("right")}
            className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 w-7 h-7 rounded-full bg-white/95 dark:bg-slate-800/95 shadow-md border border-slate-200 dark:border-slate-700 items-center justify-center text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer opacity-90 hover:opacity-100 hover:scale-105 transition-all"
            title={scrollRightLabel}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Footer Info & Quick Accent insertion */}
      <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400 dark:text-slate-500 font-inter">
        <span className="flex items-center gap-1.5">
          <Smile className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
          <span>{t("symbols.footerNotice")}</span>
        </span>
        <div className="flex items-center gap-2">
          <span className="text-slate-400 dark:text-slate-500 text-[11px] font-heading">
            {t("symbols.quickAccents")}
          </span>
          {["★", "✦", "❤️", "✨", "⚡", "亗"].map((accent) => (
            <button
              key={accent}
              type="button"
              onClick={() => onInsertSymbol(` ${accent} `)}
              className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-blue-900/60 hover:text-blue-700 dark:hover:text-blue-300 rounded text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer transition-colors font-sans"
              title={`${insertLabel}: ${accent}`}
            >
              {accent}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
