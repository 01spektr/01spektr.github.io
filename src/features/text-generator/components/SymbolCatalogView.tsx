import React, { useState, useMemo } from "react";
import { SidebarCategoryType, SymbolItem } from "../types.ts";
import { useTranslation } from "../context/LanguageContext.tsx";
import {
  POPULAR_SYMBOLS,
  ARROWS_SYMBOLS,
  HEARTS_SYMBOLS,
  STARS_SYMBOLS,
  GENERAL_SYMBOLS,
  FRAMES_SYMBOLS,
  DIVIDERS_SYMBOLS,
  DECORATIVE_SYMBOLS,
  PATTERNS_SYMBOLS,
  KAOMOJI_LIST,
  EMOJI_LIST,
} from "../data/symbolsData.ts";
import { Search, Copy, Check, ArrowLeft, Plus } from "lucide-react";

interface SymbolCatalogViewProps {
  category: SidebarCategoryType;
  onBackToStyles: () => void;
  onCopySymbol: (symbol: string, label: string) => void;
  onInsertSymbol: (symbol: string) => void;
}

export const SymbolCatalogView: React.FC<SymbolCatalogViewProps> = ({
  category,
  onBackToStyles,
  onCopySymbol,
  onInsertSymbol,
}) => {
  const { t, lang } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [insertedId, setInsertedId] = useState<string | null>(null);

  const getCategoryInfo = () => {
    const catName = t(`sidebar.categories.${category}`);
    switch (category) {
      case "emoji":
        return {
          title: catName !== `sidebar.categories.${category}` ? catName : "Эмодзи",
          desc:
            lang === "uz"
              ? "Ijtimoiy tarmoqlar uchun mashhur smayliklar"
              : lang === "en"
                ? "Popular emojis for social networks"
                : "Популярные смайлы и эмодзи для соцсетей",
        };
      case "kaomoji":
        return {
          title: catName !== `sidebar.categories.${category}` ? catName : "Каомодзи (顔文字)",
          desc:
            lang === "uz"
              ? "Yaponcha matnli smayliklar va his-tuyg‘ular"
              : lang === "en"
                ? "Japanese text emoticons and emotions"
                : "Японские текстовые смайлики и эмоции",
        };
      case "symbols":
        return {
          title: catName !== `sidebar.categories.${category}` ? catName : "Символы",
          desc:
            lang === "uz"
              ? "Belgilar, matematik belgilar, shaxmat va valyutalar"
              : lang === "en"
                ? "Signs, math symbols, chess and currencies"
                : "Знаки, математические символы, шахматы и валюты",
        };
      case "arrows":
        return {
          title: catName !== `sidebar.categories.${category}` ? catName : "Стрелки",
          desc:
            lang === "uz"
              ? "Barcha turdagi va yo‘nalishdagi strelkalar"
              : lang === "en"
                ? "Arrows of all types and directions"
                : "Стрелки всех типов и направлений",
        };
      case "hearts":
        return {
          title: catName !== `sidebar.categories.${category}` ? catName : "Сердца",
          desc:
            lang === "uz"
              ? "Yurakchalar va sevgi ramzlari"
              : lang === "en"
                ? "Hearts, love and romantic symbols"
                : "Коллекция сердечек, любви и романтических символов",
        };
      case "stars":
        return {
          title: catName !== `sidebar.categories.${category}` ? catName : "Звёзды",
          desc:
            lang === "uz"
              ? "Yulduzchalar va chaqnoq belgilar"
              : lang === "en"
                ? "Stars, sparkles and glowing badges"
                : "Звездочки, искры и сияющие значки",
        };
      case "frames":
        return {
          title: catName !== `sidebar.categories.${category}` ? catName : "Рамки",
          desc:
            lang === "uz"
              ? "Matnli ramkalar va chegaralar"
              : lang === "en"
                ? "Text frames, Japanese brackets and borders"
                : "Текстовые рамки, японские скобки и границы",
        };
      case "dividers":
        return {
          title: catName !== `sidebar.categories.${category}` ? catName : "Разделители",
          desc:
            lang === "uz"
              ? "Postlar uchun estetik ajratuvchilar"
              : lang === "en"
                ? "Aesthetic dividers for posts and bios"
                : "Эстетичные разделители для постов и описаний",
        };
      case "decorative":
        return {
          title: catName !== `sidebar.categories.${category}` ? catName : "Декоративные",
          desc:
            lang === "uz"
              ? "Tojlar, qanotlar, qilichlar va vintage belgilar"
              : lang === "en"
                ? "Crowns, wings, swords and vintage badges"
                : "Короны, крылья, мечи и винтажные знаки",
        };
      case "patterns":
        return {
          title: catName !== `sidebar.categories.${category}` ? catName : "Паттерны",
          desc:
            lang === "uz"
              ? "Matn naqshlari va geometrik chiziqlar"
              : lang === "en"
                ? "Text patterns and geometric lines"
                : "Текстовые узоры и геометрические штриховки",
        };
      case "popular_symbols":
      default:
        return {
          title: catName !== `sidebar.categories.${category}` ? catName : "Популярные символы",
          desc:
            lang === "uz"
              ? "Ijtimoiy tarmoqlar uchun eng ko‘p ishlatiladigan belgilar"
              : lang === "en"
                ? "Most used symbols for social media"
                : "Самые используемые символы для соцсетей",
        };
    }
  };

  const { title, desc } = getCategoryInfo();

  // Pick dataset
  const items = useMemo(() => {
    switch (category) {
      case "emoji":
        return EMOJI_LIST;
      case "kaomoji":
        return KAOMOJI_LIST.map((k) => ({
          id: k.id,
          char: k.text,
          name: k.name,
          category: k.category,
        }));
      case "arrows":
        return ARROWS_SYMBOLS;
      case "hearts":
        return HEARTS_SYMBOLS;
      case "stars":
        return STARS_SYMBOLS;
      case "frames":
        return FRAMES_SYMBOLS;
      case "dividers":
        return DIVIDERS_SYMBOLS;
      case "decorative":
        return DECORATIVE_SYMBOLS;
      case "patterns":
        return PATTERNS_SYMBOLS;
      case "symbols":
        return GENERAL_SYMBOLS;
      case "popular_symbols":
      default:
        return POPULAR_SYMBOLS;
    }
  }, [category]);

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter((item) => item.name.toLowerCase().includes(q) || item.char.includes(q));
  }, [items, searchQuery]);

  const handleInsert = (item: SymbolItem) => {
    onInsertSymbol(item.char);
    setInsertedId(item.id);
    setTimeout(() => setInsertedId(null), 1400);
  };

  const handleCopy = (e: React.MouseEvent, item: SymbolItem) => {
    e.stopPropagation();
    onCopySymbol(item.char, item.name);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const isWideFormat = category === "dividers" || category === "frames" || category === "kaomoji";
  const toStylesLabel =
    lang === "uz" ? "← Matn stillariga" : lang === "en" ? "← Text styles" : "← К стилям текста";
  const clickHint =
    lang === "uz"
      ? "Matnga kiritish uchun istalgan belgini bosing"
      : lang === "en"
        ? "Click any symbol to insert into text"
        : "Кликните по любому символу, чтобы вставить его в текст";
  const searchPlaceholder =
    lang === "uz"
      ? "Belgilarni qidirish..."
      : lang === "en"
        ? "Search symbols..."
        : "Поиск символа...";

  return (
    <div id="symbol-catalog-view" className="flex flex-col gap-5">
      {/* Top action & header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={onBackToStyles}
              className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={toStylesLabel}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading">
              {title}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-inter">
            {desc} • {clickHint}
          </p>
        </div>

        {/* Action Button & Search */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBackToStyles}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors shrink-0 cursor-pointer shadow-xs font-heading"
          >
            {toStylesLabel}
          </button>
          <div className="relative w-full sm:w-56">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full h-10 pl-9 pr-3 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-inter"
            />
          </div>
        </div>
      </div>

      {/* Grid Display */}
      {isWideFormat ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredItems.map((item) => {
            const isInserted = insertedId === item.id;
            const isCopied = copiedId === item.id;
            return (
              <div
                key={item.id}
                onClick={() => handleInsert(item)}
                title={item.name}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isInserted
                    ? "bg-blue-50 dark:bg-blue-950/50 border-blue-400 dark:border-blue-500 ring-2 ring-blue-400/30"
                    : isCopied
                      ? "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-600"
                      : "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-slate-50/50 dark:hover:bg-slate-850 hover:shadow-xs"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white break-words select-all font-sans">
                    {item.char}
                  </div>
                  <div className="text-xs text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1.5 font-inter">
                    <span>{item.name}</span>
                    {isInserted && (
                      <span className="text-blue-600 dark:text-blue-400 font-bold font-heading">
                        •{" "}
                        {lang === "uz"
                          ? "Matnga kiritildi!"
                          : lang === "en"
                            ? "Inserted!"
                            : "Вставлено в текст!"}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleInsert(item);
                    }}
                    title={t("modals.search.insertAction")}
                    className="px-2.5 py-1.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors font-heading"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{t("modals.search.insertAction")}</span>
                  </button>
                  <button
                    onClick={(e) => handleCopy(e, item)}
                    title={t("styles.copyBtn")}
                    className={`p-1.5 rounded-lg text-xs font-semibold flex items-center transition-all cursor-pointer ${
                      isCopied
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {isCopied ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2.5">
          {filteredItems.map((item) => {
            const isInserted = insertedId === item.id;
            const isCopied = copiedId === item.id;
            return (
              <div
                key={item.id}
                onClick={() => handleInsert(item)}
                title={item.name}
                className={`group relative flex flex-col items-center justify-center p-3 h-20 rounded-xl border transition-all cursor-pointer select-none active:scale-95 ${
                  isInserted
                    ? "bg-blue-600 text-white border-blue-500 shadow-md scale-105"
                    : isCopied
                      ? "bg-emerald-500 text-white border-emerald-400 shadow-sm"
                      : "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/70 dark:hover:bg-slate-850 hover:shadow-xs"
                }`}
              >
                <span className="text-2xl mb-1 font-sans text-slate-900 dark:text-slate-100">
                  {item.char}
                </span>
                <span
                  className={`text-[10px] truncate max-w-full text-center font-inter ${
                    isInserted || isCopied
                      ? "text-white font-bold"
                      : "text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                  }`}
                >
                  {isInserted
                    ? lang === "uz"
                      ? "Qo‘yildi!"
                      : lang === "en"
                        ? "Inserted!"
                        : "Вставлено!"
                    : isCopied
                      ? t("styles.copiedBtn")
                      : item.name}
                </span>

                {/* Secondary copy button on hover */}
                <button
                  onClick={(e) => handleCopy(e, item)}
                  title={t("styles.copyBtn")}
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-1 bg-slate-200/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 rounded-md text-[10px] transition-opacity cursor-pointer hover:bg-blue-600 hover:text-white"
                >
                  <Copy className="w-2.5 h-2.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {filteredItems.length === 0 && (
        <div className="py-12 text-center text-slate-400 dark:text-slate-500 font-inter">
          {t("modals.search.emptyResults")}
        </div>
      )}
    </div>
  );
};
