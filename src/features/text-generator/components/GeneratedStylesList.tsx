import React, { useState, useMemo } from "react";
import { TEXT_STYLES } from "../data/textStyles.ts";
import { styleBadge, styleName } from "../data/styleNames.ts";
import { TextStyleItem, StyleCategory } from "../types.ts";
import { useTranslation } from "../context/LanguageContext.tsx";
import { Heart, Copy, Check, ChevronDown, RotateCw, SlidersHorizontal, Eye } from "lucide-react";

interface GeneratedStylesListProps {
  inputText: string;
  onCopyText: (text: string, styleName: string) => void;
  onToggleFavorite: (styleName: string, text: string) => void;
  isFavorite: (styleName: string, text: string) => boolean;
  selectedStyleId: string;
  onSelectStyleForPreview: (style: TextStyleItem, transformed: string) => void;
}

export const GeneratedStylesList: React.FC<GeneratedStylesListProps> = ({
  inputText,
  onCopyText,
  onToggleFavorite,
  isFavorite,
  selectedStyleId,
  onSelectStyleForPreview,
}) => {
  const { t, lang } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<StyleCategory | "all">("popular");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
  const [visibleCount, setVisibleCount] = useState<number>(16);

  const filterChips: { id: StyleCategory | "all"; label: string }[] = [
    { id: "popular", label: t("styles.categories.popular") },
    { id: "bold", label: t("styles.categories.bold") },
    { id: "italic", label: t("styles.categories.italic") },
    { id: "underline", label: t("styles.categories.underline") },
    { id: "strikethrough", label: t("styles.categories.strikethrough") },
    { id: "monospace", label: t("styles.categories.monospace") },
    { id: "aesthetic", label: t("styles.categories.aesthetic") },
    { id: "bubbles", label: t("styles.categories.bubbles") },
  ];

  const moreFilters: { id: StyleCategory | "all"; label: string }[] = [
    { id: "all", label: t("styles.categories.all") },
    { id: "gothic", label: t("styles.categories.gothic") },
    { id: "script", label: t("styles.categories.script") },
    { id: "decorative", label: t("styles.categories.decorative") },
  ];

  const filteredStyles = useMemo(() => {
    if (activeFilter === "all") return TEXT_STYLES;
    if (activeFilter === "popular") {
      return TEXT_STYLES.filter(
        (s) =>
          s.category === "popular" ||
          s.id === "bold" ||
          s.id === "italic" ||
          s.id === "underline" ||
          s.id === "strikethrough" ||
          s.id === "monospace" ||
          s.id === "bubbles" ||
          s.id === "aesthetic",
      );
    }
    return TEXT_STYLES.filter((s) => s.category === activeFilter);
  }, [activeFilter]);

  const displayedStyles = filteredStyles.slice(0, visibleCount);
  const hasMore = visibleCount < filteredStyles.length;

  const currentRaw = inputText.trim() || "Toolboxi.uz — design tools for everyone";

  const handleCopy = (e: React.MouseEvent, style: TextStyleItem, transformed: string) => {
    e.stopPropagation();
    onCopyText(transformed, styleName(style.id, style.name, lang));
    setCopiedId(style.id);
    setTimeout(() => {
      setCopiedId(null);
    }, 1800);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 12);
  };

  return (
    <div id="generated-styles-section" className="flex flex-col gap-3.5 sm:gap-4">
      {/* 1. Category Filter Chips (Horizontal swipe on mobile, wrap on desktop) */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:flex-wrap">
        {filterChips.map((chip) => (
          <button
            key={chip.id}
            id={`filter-chip-${chip.id}`}
            onClick={() => {
              setActiveFilter(chip.id);
              setVisibleCount(16);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer font-heading active:scale-95 shrink-0 ${
              activeFilter === chip.id
                ? "bg-blue-600 text-white shadow-2xs font-bold"
                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600"
            }`}
          >
            {chip.label}
          </button>
        ))}

        {/* Dropdown for More Categories */}
        <div className="relative shrink-0">
          <button
            id="more-filters-btn"
            onClick={() => setShowMoreDropdown(!showMoreDropdown)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl border flex items-center gap-1 transition-all cursor-pointer font-heading active:scale-95 ${
              moreFilters.some((m) => m.id === activeFilter)
                ? "bg-blue-600 text-white font-bold border-blue-600"
                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200/90 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80"
            }`}
          >
            <span>{lang === "uz" ? "Ko'proq" : lang === "en" ? "More" : "Ещё"}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {showMoreDropdown && (
            <div className="absolute top-full mt-1.5 left-0 z-30 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg p-1.5 font-heading">
              {moreFilters.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveFilter(item.id);
                    setShowMoreDropdown(false);
                    setVisibleCount(16);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    activeFilter === item.id
                      ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. Results Header */}
      <div className="flex items-center justify-between pt-1 font-heading">
        <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>{t("styles.title")}</span>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-inter">
            ({filteredStyles.length})
          </span>
        </h2>
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-inter">
          <span className="hidden sm:inline">{t("styles.subtitle")}</span>
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
        </div>
      </div>

      {/* 3. Results List of Transformed Styles */}
      <div className="space-y-2.5">
        {displayedStyles.map((style) => {
          const transformed = style.transform(currentRaw);
          const isCopied = copiedId === style.id;
          const localizedName = styleName(style.id, style.name, lang);
          const localizedBadge = styleBadge(style.badge, lang);
          const isFav = isFavorite(localizedName, transformed);
          const isSelected = selectedStyleId === style.id;

          return (
            <div
              key={style.id}
              id={`style-row-${style.id}`}
              onClick={() => onSelectStyleForPreview(style, transformed)}
              className={`group flex flex-col md:flex-row md:items-center justify-between p-3.5 sm:p-4 rounded-2xl transition-all cursor-pointer border ${
                isSelected
                  ? "bg-blue-50/70 dark:bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/20 shadow-xs"
                  : "bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-xs"
              }`}
            >
              {/* Top / Left Row: Style Label & Mobile Actions */}
              <div className="w-full md:w-44 shrink-0 flex items-center justify-between md:justify-start gap-2 mb-2 md:mb-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-bold font-heading text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {localizedName}
                  </span>
                  {localizedBadge && (
                    <span className="px-1.5 py-0.2 text-[10px] font-bold font-heading rounded-md bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60">
                      {localizedBadge}
                    </span>
                  )}
                </div>

                {/* Mobile-only quick favorite & preview indicator */}
                <div className="flex items-center gap-1.5 md:hidden">
                  {isSelected && (
                    <span className="flex items-center gap-1 text-[10px] font-bold font-heading text-blue-700 dark:text-blue-300 bg-blue-100/90 dark:bg-blue-950/70 px-2 py-0.5 rounded-md">
                      <Eye className="w-3 h-3" />
                      <span>{t("social.title")}</span>
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(localizedName, transformed);
                    }}
                    title={isFav ? t("styles.favoriteRemove") : t("styles.favoriteAdd")}
                    className={`p-1.5 rounded-lg active:scale-90 transition-all ${
                      isFav
                        ? "text-rose-500 bg-rose-50 dark:bg-rose-950/50"
                        : "text-slate-400 hover:text-rose-500"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFav ? "fill-current" : ""}`} />
                  </button>
                </div>
              </div>

              {/* Middle Column: Styled text preview */}
              <div className="flex-1 min-w-0 md:px-4 py-1">
                <p className="text-base sm:text-lg font-medium text-slate-900 dark:text-white break-words select-all leading-relaxed tracking-normal font-sans">
                  {transformed}
                </p>
              </div>

              {/* Right Column / Bottom on Mobile: Actions */}
              <div className="flex items-center gap-2 shrink-0 justify-end md:justify-start mt-2.5 md:mt-0 pt-2 md:pt-0 border-t border-slate-100 dark:border-slate-800 md:border-0">
                {/* Desktop-only visual indicator for selected preview */}
                {isSelected && (
                  <span className="hidden md:flex items-center gap-1 text-[11px] font-bold font-heading text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded-md bg-blue-100/80 dark:bg-blue-950/70 mr-1">
                    <Eye className="w-3 h-3" />
                    <span>{t("social.title")}</span>
                  </span>
                )}

                {/* Desktop favorite toggle */}
                <button
                  id={`fav-btn-${style.id}`}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(localizedName, transformed);
                  }}
                  title={isFav ? t("styles.favoriteRemove") : t("styles.favoriteAdd")}
                  className={`hidden md:flex p-2 rounded-xl transition-all cursor-pointer active:scale-90 ${
                    isFav
                      ? "text-rose-500 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-950/80 border border-rose-200/60 dark:border-rose-900/60"
                      : "text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFav ? "fill-current" : ""}`} />
                </button>

                {/* Copy Button (Full-width on mobile, compact on desktop) */}
                <button
                  id={`copy-btn-${style.id}`}
                  type="button"
                  onClick={(e) => handleCopy(e, style, transformed)}
                  className={`w-full md:w-auto h-9 sm:h-9.5 px-4 rounded-xl text-xs font-bold font-heading flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-2xs ${
                    isCopied
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white"
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{t("styles.copiedBtn")}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{t("styles.copyBtn")}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="pt-2 flex justify-center">
          <button
            id="load-more-btn"
            type="button"
            onClick={handleLoadMore}
            className="w-full py-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
          >
            <RotateCw className="w-4 h-4" />
            <span>
              {t("styles.loadMore")} ({filteredStyles.length - visibleCount})
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
