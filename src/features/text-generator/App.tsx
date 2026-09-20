/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from "react";
import { BreadcrumbsHero } from "./components/BreadcrumbsHero.tsx";
import { MainInputCard } from "./components/MainInputCard.tsx";
import { GeneratedStylesList } from "./components/GeneratedStylesList.tsx";
import { SocialPreview } from "./components/SocialPreview.tsx";
import { QuickSymbolsWidget } from "./components/QuickSymbolsWidget.tsx";
import { SymbolCatalogView } from "./components/SymbolCatalogView.tsx";
import { SeoFaqSection } from "./components/SeoFaqSection.tsx";
import { FavoritesModal } from "./components/FavoritesModal.tsx";
import { HistoryModal } from "./components/HistoryModal.tsx";
import { SearchModal } from "./components/SearchModal.tsx";
import { Toast } from "./components/Toast.tsx";
import { useTranslation } from "./context/LanguageContext.tsx";
import { SidebarCategoryType, TextStyleItem, FavoriteItem, HistoryItem } from "./types.ts";
import { TEXT_STYLES } from "./data/textStyles.ts";
import { styleName } from "./data/styleNames.ts";
import { copyToClipboard } from "./utils/clipboard.ts";
import { SlidersHorizontal, Eye } from "lucide-react";

export default function App() {
  const { t, lang } = useTranslation();
  const [inputText, setInputText] = useState<string>("✦ ✦ «« 亗 Toolboxi.uz 亗 »» ✦ ✦");
  const [activeCategory, setActiveCategory] = useState<SidebarCategoryType>("styles");
  const [selectedStyle, setSelectedStyle] = useState<TextStyleItem>(TEXT_STYLES[0]);
  const [previewText, setPreviewText] = useState<string>("✦ ✦ «« 亗 Toolboxi.uz 亗 »» ✦ ✦");
  const [mobileWorkspaceTab, setMobileWorkspaceTab] = useState<"styles" | "preview">("styles");

  // Favorites & History
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [storageReady, setStorageReady] = useState(false);

  // Modals state
  const [isFavoritesOpen, setIsFavoritesOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Toast state
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({
    message: "",
    visible: false,
  });

  // Update previewText whenever inputText changes, applying selectedStyle
  useEffect(() => {
    const raw = inputText.trim() || "Toolboxi.uz — design tools for everyone";
    setPreviewText(selectedStyle.transform(raw));
  }, [inputText, selectedStyle]);

  // Restore client-only data after hydration, then keep it in sync.
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem("toolbox:text-generator:favorites");
      const savedHistory = localStorage.getItem("toolbox:text-generator:history");
      if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
      if (savedHistory) setHistory(JSON.parse(savedHistory));
    } catch {
      // Keep the tool usable when storage is unavailable or contains invalid data.
    } finally {
      setStorageReady(true);
    }
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    try {
      localStorage.setItem("toolbox:text-generator:favorites", JSON.stringify(favorites));
    } catch {
      // Storage can be blocked in private browsing; favorites still work for the session.
    }
  }, [favorites, storageReady]);

  // Sync history
  useEffect(() => {
    if (!storageReady) return;
    try {
      localStorage.setItem("toolbox:text-generator:history", JSON.stringify(history));
    } catch {
      // Storage can be blocked in private browsing; history still works for the session.
    }
  }, [history, storageReady]);

  // Global Ctrl + K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const triggerToast = useCallback((message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 2200);
  }, []);

  const handleCopyText = async (text: string, styleName: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      triggerToast(`${t("toast.copied")}: ${text.length > 25 ? text.slice(0, 25) + "…" : text}`);
      // Add to history
      setHistory((prev) => {
        const filtered = prev.filter((item) => item.text !== text);
        return [
          {
            id: `h_${Date.now()}_${Math.random()}`,
            text,
            styleName,
            timestamp: Date.now(),
          },
          ...filtered,
        ].slice(0, 50);
      });
    }
  };

  const handleToggleFavorite = (styleName: string, text: string) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.text === text);
      if (exists) {
        triggerToast(t("toast.favoriteRemoved"));
        return prev.filter((f) => f.text !== text);
      } else {
        triggerToast(t("toast.favoriteAdded"));
        return [
          {
            id: `fav_${Date.now()}_${Math.random()}`,
            styleName,
            text,
            timestamp: Date.now(),
          },
          ...prev,
        ];
      }
    });
  };

  const isFavorite = (styleName: string, text: string) => {
    return favorites.some((f) => f.text === text);
  };

  const handleRemoveFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  };

  const handleClearFavorites = () => {
    setFavorites([]);
    triggerToast(t("toast.favoritesCleared"));
  };

  const handleClearHistory = () => {
    setHistory([]);
    triggerToast(t("toast.historyCleared"));
  };

  // Immediate insertion or wrapping into the permanent MainInputCard
  const handleInsertSymbol = (symbol: string) => {
    // If the symbol has a double-space gap (like frames: "【  】" or "꧁  ꧂"), wrap the text!
    if (symbol.includes("  ")) {
      const [left, right] = symbol.split("  ");
      setInputText((prev) => {
        const textToWrap = prev.trim() || "Toolboxi.uz";
        return `${left.trim()} ${textToWrap} ${right.trim()}`;
      });
      triggerToast(
        lang === "uz"
          ? "Ramka asosiy matnga qo‘yildi"
          : lang === "en"
            ? "Frame applied to main text"
            : "Рамка применена к основному тексту",
      );
      return;
    }

    // Append or insert symbol without changing activeCategory so user can keep selecting items
    setInputText((prev) => {
      const trimmed = prev.trim();
      if (!trimmed) return symbol;
      return `${trimmed} ${symbol}`;
    });
    triggerToast(
      `${symbol} ${lang === "uz" ? "matnga qo‘shildi" : lang === "en" ? "added to text" : "добавлен в основной текст"}`,
    );
  };

  const handleSelectStyleForPreview = (style: TextStyleItem, transformed: string) => {
    setSelectedStyle(style);
    setPreviewText(transformed);
  };

  return (
    <div className="text-generator-page w-full text-slate-900 dark:text-slate-100 selection:bg-blue-600 selection:text-white transition-colors pb-16 lg:pb-0 font-inter">
      {/* Main Container */}
      <main className="max-w-[1380px] w-full mx-auto py-4 sm:py-6">
        {/* Breadcrumbs & Hero Header */}
        <BreadcrumbsHero />

        {/* 2-Column Core Workspace */}
        <div className="flex flex-col lg:flex-row items-start gap-5 sm:gap-6">
          {/* Main Column: Interactive Work Area */}
          <div className="flex-1 min-w-0 w-full flex flex-col gap-4 sm:gap-5">
            {/* 1. PERMANENT MAIN INPUT CARD */}
            <div id="main-input-anchor">
              <MainInputCard
                inputText={inputText}
                onChangeInputText={setInputText}
                onRefresh={() =>
                  triggerToast(
                    lang === "uz"
                      ? "Stillar yangilandi"
                      : lang === "en"
                        ? "Styles refreshed"
                        : "Стили успешно обновлены",
                  )
                }
              />
            </div>

            {/* 2. USEFUL SYMBOLS WIDGET: Directly under main input */}
            <div id="symbols-widget-anchor">
              <QuickSymbolsWidget
                onCopySymbol={(sym) => handleCopyText(sym, "Символ")}
                onInsertSymbol={handleInsertSymbol}
                onNavigateToCategory={(cat) => {
                  setActiveCategory(cat);
                  setMobileWorkspaceTab("styles");
                }}
              />
            </div>

            {/* Mobile View Switcher (Styles vs Social Media Preview) */}
            <div className="flex lg:hidden items-center p-1 bg-slate-200/70 dark:bg-slate-800/80 rounded-xl">
              <button
                type="button"
                id="mobile-tab-styles"
                onClick={() => setMobileWorkspaceTab("styles")}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold font-heading flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
                  mobileWorkspaceTab === "styles"
                    ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{t("mobileNav.styles")} (30+)</span>
              </button>
              <button
                type="button"
                id="mobile-tab-preview"
                onClick={() => setMobileWorkspaceTab("preview")}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold font-heading flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
                  mobileWorkspaceTab === "preview"
                    ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>
                  {t("mobileNav.social")} ({styleName(selectedStyle.id, selectedStyle.name, lang)})
                </span>
              </button>
            </div>

            {/* Mobile-only view of Social Preview when mobile tab is active */}
            <div className={`lg:hidden ${mobileWorkspaceTab === "preview" ? "block" : "hidden"}`}>
              <SocialPreview
                styledText={previewText}
                originalText={inputText}
                selectedStyleName={styleName(selectedStyle.id, selectedStyle.name, lang)}
                onCopyText={handleCopyText}
              />
            </div>

            {/* 3. DYNAMIC CONTENT: Styles List OR Category Catalog (Desktop always, Mobile when 'styles') */}
            <div className={`${mobileWorkspaceTab === "styles" ? "block" : "hidden lg:block"}`}>
              {activeCategory === "styles" ? (
                <GeneratedStylesList
                  inputText={inputText}
                  onCopyText={handleCopyText}
                  onToggleFavorite={handleToggleFavorite}
                  isFavorite={isFavorite}
                  selectedStyleId={selectedStyle.id}
                  onSelectStyleForPreview={handleSelectStyleForPreview}
                />
              ) : (
                <div className="flex flex-col gap-5">
                  <SymbolCatalogView
                    category={activeCategory}
                    onBackToStyles={() => setActiveCategory("styles")}
                    onCopySymbol={(sym, label) => handleCopyText(sym, label)}
                    onInsertSymbol={handleInsertSymbol}
                  />

                  {/* Quick live preview of styled text right below catalog */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 font-heading">
                          <span>
                            {lang === "uz"
                              ? "Yaratilgan natija"
                              : lang === "en"
                                ? "Generated Result"
                                : "Сгенерированный результат"}
                          </span>
                          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md font-heading">
                            {lang === "uz"
                              ? "Tezkor ko‘rish"
                              : lang === "en"
                                ? "Quick preview"
                                : "Быстрый просмотр"}
                          </span>
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-inter">
                          {lang === "uz"
                            ? "Yuqoridagi belgilarni bosganingizda matn bir zumda yangilanadi"
                            : lang === "en"
                              ? "Text updates in real time when clicking symbols above"
                              : "Текст обновляется в реальном времени при клике на символы выше"}
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveCategory("styles")}
                        className="px-3 py-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-600 hover:text-white rounded-lg transition-colors cursor-pointer font-heading"
                      >
                        {lang === "uz"
                          ? "Barcha 30+ stillarni ochish →"
                          : lang === "en"
                            ? "Open all 30+ styles →"
                            : "Открыть все 30+ стилей →"}
                      </button>
                    </div>

                    {/* Top 4 style previews */}
                    <div className="space-y-2">
                      {TEXT_STYLES.slice(0, 4).map((st) => {
                        const transformed = st.transform(
                          inputText.trim() || "Toolboxi.uz — design tools for everyone",
                        );
                        return (
                          <div
                            key={st.id}
                            onClick={() => handleSelectStyleForPreview(st, transformed)}
                            className="p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 bg-slate-50/60 dark:bg-slate-850 hover:bg-white dark:hover:bg-slate-800 flex items-center justify-between gap-3 cursor-pointer transition-all"
                          >
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 w-32 shrink-0 font-heading">
                              {styleName(st.id, st.name, lang)}
                            </span>
                            <span className="text-sm font-medium text-slate-900 dark:text-white flex-1 truncate font-sans">
                              {transformed}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyText(transformed, styleName(st.id, st.name, lang));
                              }}
                              className="px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white border border-slate-200 dark:border-slate-700 text-xs font-semibold rounded-md transition-colors font-heading cursor-pointer text-slate-700 dark:text-slate-200"
                            >
                              {t("styles.copyBtn")}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Social Preview (Sticky on desktop, hidden on mobile since integrated into switcher) */}
          <div className="hidden lg:block w-full lg:w-[350px] shrink-0 lg:sticky lg:top-20 self-start">
            <SocialPreview
              styledText={previewText}
              originalText={inputText}
              selectedStyleName={styleName(selectedStyle.id, selectedStyle.name, lang)}
              onCopyText={handleCopyText}
            />
          </div>
        </div>

        {/* SEO Guide, How it Works & FAQ Section */}
        <SeoFaqSection />
      </main>

      {/* Mobile Bottom Quick Action Navigation Bar */}
      <nav
        id="mobile-bottom-navbar"
        aria-label="Быстрая мобильная навигация"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-lg"
      >
        <button
          type="button"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex flex-col items-center gap-0.5 py-1 px-2.5 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 text-[10px] font-semibold font-heading active:scale-90 transition-all cursor-pointer"
        >
          <span className="text-base leading-none">✍️</span>
          <span>{t("mobileNav.input")}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            const el = document.getElementById("symbols-widget-anchor");
            el?.scrollIntoView({ behavior: "smooth" });
          }}
          className="flex flex-col items-center gap-0.5 py-1 px-2.5 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 text-[10px] font-semibold font-heading active:scale-90 transition-all cursor-pointer"
        >
          <span className="text-base leading-none">✨</span>
          <span>{t("mobileNav.symbols")}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveCategory("styles");
            setMobileWorkspaceTab("styles");
            const el = document.getElementById("generated-styles-section");
            el?.scrollIntoView({ behavior: "smooth" });
          }}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 text-[10px] font-semibold font-heading active:scale-90 transition-all cursor-pointer ${
            mobileWorkspaceTab === "styles"
              ? "text-blue-600 dark:text-blue-400 font-bold"
              : "text-slate-600 dark:text-slate-400"
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>{t("mobileNav.styles")}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setMobileWorkspaceTab("preview");
            window.scrollTo({ top: 380, behavior: "smooth" });
          }}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 text-[10px] font-semibold font-heading active:scale-90 transition-all cursor-pointer ${
            mobileWorkspaceTab === "preview"
              ? "text-blue-600 dark:text-blue-400 font-bold"
              : "text-slate-600 dark:text-slate-400"
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>{t("mobileNav.social")}</span>
        </button>

        <button
          type="button"
          onClick={() => setIsFavoritesOpen(true)}
          className="flex flex-col items-center gap-0.5 py-1 px-2.5 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 text-[10px] font-semibold font-heading active:scale-90 transition-all cursor-pointer relative"
        >
          <span className="text-base leading-none">❤️</span>
          <span>{t("mobileNav.favorites")}</span>
          {favorites.length > 0 && (
            <span className="absolute top-0.5 right-2 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
              {favorites.length}
            </span>
          )}
        </button>
      </nav>

      {/* Modals & Dialogs */}
      <FavoritesModal
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        onRemoveFavorite={handleRemoveFavorite}
        onCopyText={handleCopyText}
        onClearAll={handleClearFavorites}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onCopyText={handleCopyText}
        onClearHistory={handleClearHistory}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectCategory={(cat) => setActiveCategory(cat)}
        onCopyText={handleCopyText}
        onInsertSymbol={handleInsertSymbol}
      />

      {/* Toast Alert */}
      <Toast message={toast.message} isVisible={toast.visible} />
    </div>
  );
}
