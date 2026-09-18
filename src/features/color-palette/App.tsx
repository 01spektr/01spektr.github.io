/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ColorItem,
  HarmonyMode,
  PaletteStyle,
  CuratedPalette,
  ActiveToolTab,
  ColorBlindnessType,
  SavedPalette,
} from './types';
import {
  createColorItem,
  generateHarmoniousPalette,
  getRandomHex,
  getRoleName,
  hslToRgb,
  rgbToHex,
} from './utils/colorUtils';
import { Sidebar } from './components/Sidebar';
import { MainPalette } from './components/MainPalette';
import { ColorPicker } from './components/ColorPicker';
import { SettingsPanel } from './components/SettingsPanel';
import { LivePreview } from './components/LivePreview';
import { ExportSection } from './components/ExportSection';
import { ColorCodesTable } from './components/ColorCodesTable';
import { CuratedPalettes } from './components/CuratedPalettes';
import { ColorWheel } from './components/ColorWheel';
import { ImagePaletteExtractor } from './components/ImagePaletteExtractor';
import { ShadesGenerator } from './components/ShadesGenerator';
import { AccessibilityChecker } from './components/AccessibilityChecker';
import { FavoritesModal } from './components/FavoritesDrawer';
import { Toast } from './components/Toast';
import { PaletteLocaleBoundary } from './components/PaletteLocaleBoundary';
import { QuickPresetCategory } from './data/presets';
import {
  Sparkles,
  Undo2,
  Redo2,
  Heart,
  FolderHeart,
  Eye,
  Sliders,
  CircleDot,
  Upload,
  Layers,
  ShieldCheck,
  ChevronRight,
  Home,
  Info,
  Share2,
  Star,
} from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { ToolIcon } from '@/components/tool-icon';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n';
import { getToolBySlug } from '@/lib/tools/catalog';
import { isFavorite, toggleFavorite } from '@/lib/tools/favorites';
import { buildShareUrl, shareUrl } from '@/lib/tools/share';
import { recordHistory } from '@/lib/tools/history';

// Initial state matching the user's screenshot exactly
const INITIAL_COLORS: ColorItem[] = [
  createColorItem('#2563EB', 'Основной'),
  createColorItem('#60A5FA', 'Вторичный'),
  createColorItem('#DBEAFE', 'Фоновый'),
  createColorItem('#F8FAFC', 'Светлый'),
  createColorItem('#0F172A', 'Тёмный'),
];

const INITIAL_RECENTS = [
  '#2563EB',
  '#60A5FA',
  '#DBEAFE',
  '#0F172A',
  '#F97316',
  '#8B5CF6',
  '#EC4899',
  '#10B981',
];

export default function App() {
  const { locale } = useI18n();
  const en = locale === 'en';
  const tr = (ru: string, english: string) => (en ? english : ru);
  const tool = getToolBySlug('color-palette')!;
  const homePath = en ? '/en' : '/';
  const [favorite, setFavorite] = useState(() => isFavorite('color-palette'));
  const [colors, setColors] = useState<ColorItem[]>(INITIAL_COLORS);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [harmony, setHarmony] = useState<HarmonyMode>('custom');
  const [autoGenerate, setAutoGenerate] = useState<boolean>(true);
  const [colorCount, setColorCount] = useState<number>(5);
  const [style, setStyle] = useState<PaletteStyle>('modern');
  const [saturation, setSaturation] = useState<number>(100);
  const [brightness, setBrightness] = useState<number>(100);
  const [recentColors, setRecentColors] = useState<string[]>(INITIAL_RECENTS);
  const [activeQuickId, setActiveQuickId] = useState<string | undefined>('popular');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modern feature states
  const [activeToolTab, setActiveToolTab] = useState<ActiveToolTab>('picker');
  const [colorBlindness, setColorBlindness] = useState<ColorBlindnessType>('none');
  const [showFavoritesModal, setShowFavoritesModal] = useState<boolean>(false);
  const [savedPalettes, setSavedPalettes] = useState<SavedPalette[]>([]);

  // History for Undo / Redo
  const [history, setHistory] = useState<ColorItem[][]>([INITIAL_COLORS]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const isUndoRedoAction = useRef(false);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  const hideToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  // Load saved palettes from localStorage & parse URL hash on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('toolboxi_saved_palettes');
      if (stored) {
        setSavedPalettes(JSON.parse(stored));
      }
    } catch {
      // ignore storage error
    }

    // Check URL hash for shared palette: #palette=2563EB-60A5FA-...
    if (window.location.hash.includes('palette=')) {
      const hashPart = window.location.hash.split('palette=')[1];
      if (hashPart) {
        const hexes = hashPart.split('-').map((h) => `#${h.replace('#', '')}`);
        if (hexes.length >= 2) {
          const imported = hexes.map((hex, i) => createColorItem(hex, getRoleName(i, hexes.length)));
          setColors(imported);
          setColorCount(imported.length);
          showToast('Палитра загружена по ссылке!');
        }
      }
    }
  }, [showToast]);

  // Push to history when colors change (unless it was an undo/redo)
  useEffect(() => {
    if (isUndoRedoAction.current) {
      isUndoRedoAction.current = false;
      return;
    }
    setHistory((prev) => {
      const current = prev[historyIndex];
      // Avoid duplicate consecutive states
      if (
        current &&
        JSON.stringify(current.map((c) => c.hex)) === JSON.stringify(colors.map((c) => c.hex))
      ) {
        return prev;
      }
      const updated = prev.slice(0, historyIndex + 1);
      return [...updated, colors].slice(-30);
    });
    setHistoryIndex((prev) => Math.min(prev + 1, 29));
  }, [colors]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      isUndoRedoAction.current = true;
      const targetIndex = historyIndex - 1;
      setHistoryIndex(targetIndex);
      setColors(history[targetIndex]);
      showToast('Отменено');
    }
  }, [historyIndex, history, showToast]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      isUndoRedoAction.current = true;
      const targetIndex = historyIndex + 1;
      setHistoryIndex(targetIndex);
      setColors(history[targetIndex]);
      showToast('Повторено');
    }
  }, [historyIndex, history, showToast]);

  // Auto-dismiss toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Selected current color
  const currentColor = colors[selectedIndex] || colors[0];

  // Handle color change from Color Picker or Wheel
  const handleColorChange = useCallback(
    (newHex: string) => {
      setRecentColors((prev) => {
        const filtered = prev.filter((c) => c.toLowerCase() !== newHex.toLowerCase());
        return [newHex.toUpperCase(), ...filtered].slice(0, 10);
      });

      if (autoGenerate) {
        const newPalette = generateHarmoniousPalette(
          newHex,
          harmony,
          colorCount,
          style,
          saturation / 100,
          brightness / 100,
          colors
        );
        setColors(newPalette);
      } else {
        setColors((prev) =>
          prev.map((item, idx) =>
            idx === selectedIndex
              ? createColorItem(newHex, item.role, item.locked)
              : item
          )
        );
      }
    },
    [autoGenerate, harmony, colorCount, style, saturation, brightness, colors, selectedIndex]
  );

  // Toggle lock on a swatch
  const handleToggleLock = useCallback((index: number) => {
    setColors((prev) =>
      prev.map((c, idx) => (idx === index ? { ...c, locked: !c.locked } : c))
    );
  }, []);

  // Generate a fresh harmonious palette
  const handleGenerate = useCallback(() => {
    const randomBase = getRandomHex();
    const newPalette = generateHarmoniousPalette(
      randomBase,
      harmony,
      colorCount,
      style,
      saturation / 100,
      brightness / 100,
      colors
    );
    setColors(newPalette);
    recordHistory({
      toolId: 'color-palette',
      title: en ? 'Color palette' : 'Палитра цветов',
      params: { colors: newPalette.map((color) => color.hex).join('-') },
    });
    showToast('Новая палитра сгенерирована!');
  }, [harmony, colorCount, style, saturation, brightness, colors, showToast, en]);

  // Reorder colors
  const handleMoveColor = useCallback((fromIndex: number, toIndex: number) => {
    setColors((prev) => {
      const next = [...prev];
      const temp = next[fromIndex];
      next[fromIndex] = next[toIndex];
      next[toIndex] = temp;
      return next;
    });
    setSelectedIndex(toIndex);
  }, []);

  // Randomize single slot
  const handleRandomizeSlot = useCallback(
    (index: number) => {
      const newHex = getRandomHex();
      setColors((prev) =>
        prev.map((c, i) => (i === index ? createColorItem(newHex, c.role, c.locked) : c))
      );
      showToast(`Слот ${index + 1} обновлен`);
    },
    [showToast]
  );

  // Reset to initial default
  const handleReset = useCallback(() => {
    setColors(INITIAL_COLORS);
    setSelectedIndex(0);
    setHarmony('custom');
    setColorCount(5);
    setStyle('modern');
    setSaturation(100);
    setBrightness(100);
    setActiveQuickId('popular');
    showToast('Палитра сброшена к исходным цветам');
  }, [showToast]);

  // Color count change
  const handleColorCountChange = useCallback(
    (newCount: number) => {
      setColorCount(newCount);
      if (selectedIndex >= newCount) {
        setSelectedIndex(newCount - 1);
      }
      const newPalette = generateHarmoniousPalette(
        currentColor.hex,
        harmony,
        newCount,
        style,
        saturation / 100,
        brightness / 100,
        colors
      );
      setColors(newPalette);
    },
    [currentColor.hex, harmony, style, saturation, brightness, colors, selectedIndex]
  );

  // Select Quick Preset
  const handleSelectQuickPalette = useCallback(
    (preset: QuickPresetCategory) => {
      setActiveQuickId(preset.id);
      setStyle(preset.style);
      setColorCount(preset.colors.length);
      const newItems = preset.colors.map((hex, i) =>
        createColorItem(hex, getRoleName(i, preset.colors.length))
      );
      setColors(newItems);
      setSelectedIndex(0);
      showToast(`Загружена палитра: ${preset.name}`);
    },
    [showToast]
  );

  // Select Curated Palette
  const handleSelectCuratedPalette = useCallback(
    (curated: CuratedPalette) => {
      setColorCount(curated.colors.length);
      const newItems = curated.colors.map((hex, i) =>
        createColorItem(hex, getRoleName(i, curated.colors.length))
      );
      setColors(newItems);
      setSelectedIndex(0);
      showToast(`Загружена палитра: ${curated.name}`);
    },
    [showToast]
  );

  // Apply colors from image extractor or favorites
  const handleApplyExtractedColors = useCallback((extracted: string[]) => {
    const newColors = extracted.map((hex, index) =>
      createColorItem(hex, getRoleName(index, extracted.length))
    );
    setColors(newColors);
    setColorCount(newColors.length);
    setSelectedIndex(0);
  }, []);

  // Select Harmony
  const handleSelectHarmony = useCallback(
    (newHarmony: HarmonyMode) => {
      setHarmony(newHarmony);
      setActiveQuickId(undefined);
      const newPalette = generateHarmoniousPalette(
        currentColor.hex,
        newHarmony,
        colorCount,
        style,
        saturation / 100,
        brightness / 100,
        colors
      );
      setColors(newPalette);
      showToast(`Выбрана схема: ${newHarmony}`);
    },
    [currentColor.hex, colorCount, style, saturation, brightness, colors, showToast]
  );

  // Save to favorites
  const handleSaveToFavorites = useCallback(() => {
    const newSaved: SavedPalette = {
      id: Date.now().toString(),
      name: `Палитра ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      colors: colors.map((c) => c.hex),
      createdAt: Date.now(),
    };
    const updated = [newSaved, ...savedPalettes];
    setSavedPalettes(updated);
    try {
      localStorage.setItem('toolboxi_saved_palettes', JSON.stringify(updated));
    } catch {
      // ignore
    }
    showToast('Палитра сохранена в избранное!');
  }, [colors, savedPalettes, showToast]);

  // Delete from favorites
  const handleDeleteSavedPalette = useCallback(
    (id: string) => {
      const updated = savedPalettes.filter((p) => p.id !== id);
      setSavedPalettes(updated);
      try {
        localStorage.setItem('toolboxi_saved_palettes', JSON.stringify(updated));
      } catch {
        // ignore
      }
    },
    [savedPalettes]
  );

  return (
    <PaletteLocaleBoundary enabled={en}>
    <div className="palette-tool mx-auto w-full max-w-[1384px] text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-900">
      <div>
        <header className="palette-site-header mb-5">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground">
              <Link to={homePath} className="inline-flex items-center gap-1.5 transition-colors hover:text-primary">
                <Home className="size-3.5" /> {tr('Главная', 'Home')}
              </Link>
              <ChevronRight className="size-3.5" />
              <Link to="/categories/$id" params={{ id: 'design-print' }} className="transition-colors hover:text-primary">
                {tr('Дизайн и полиграфия', 'Design & print')}
              </Link>
              <ChevronRight className="size-3.5" />
              <span className="text-foreground">{tr('Палитра цветов', 'Color palette')}</span>
            </nav>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  toggleFavorite('color-palette');
                  setFavorite(isFavorite('color-palette'));
                }}
              >
                <Star className={`size-4 ${favorite ? 'fill-primary text-primary' : ''}`} />
                {favorite ? tr('В избранном', 'Saved') : tr('В избранное', 'Add to favorites')}
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  void shareUrl(
                    buildShareUrl('/tools/color-palette', new URLSearchParams()),
                    tr('Палитра цветов', 'Color palette'),
                  )
                }
              >
                <Share2 className="size-4" /> {tr('Поделиться', 'Share')}
              </Button>
            </div>
          </div>
          <div className="grid gap-4 lg:grid-cols-[1fr_360px] lg:items-center">
            <div className="flex items-start gap-4">
              <ToolIcon tool={tool} size="hero" />
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  {tr('Палитра цветов', 'Color palette')}
                </h1>
                <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {tr('Подбирайте гармоничные цвета для бренда, интерфейсов и печати.', 'Build harmonious color palettes for brands, interfaces and print.')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-primary/5 px-4 py-3 text-sm text-muted-foreground">
              <Info className="size-5 shrink-0 text-primary" />
              {tr('Все вычисления и обработка изображений выполняются в браузере.', 'All calculations and image processing happen in your browser.')}
            </div>
          </div>
        </header>

        {/* Main Workspace Layout */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left Sidebar (Schemes & Quick presets) */}
          <Sidebar
            currentHarmony={harmony}
            onSelectHarmony={handleSelectHarmony}
            onSelectQuickPalette={handleSelectQuickPalette}
            activeQuickId={activeQuickId}
          />

          {/* Right Main Content Area */}
          <main className="flex-1 w-full space-y-6">
            {/* Top Toolbar with Generator, Undo/Redo, Favorites, Hotkeys & Blindness filter */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-2">
                {/* Main Generate Button */}
                <button
                  type="button"
                  id="btn-generate-main"
                  onClick={handleGenerate}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer group active:scale-98"
                >
                  <Sparkles className="w-4 h-4 transition-transform group-hover:rotate-12" />
                  <span>{tr('Сгенерировать', 'Generate')}</span>
                </button>

                {/* Undo / Redo */}
                <div className="flex items-center bg-slate-100 rounded-xl p-0.5 border border-slate-200/60">
                  <button
                    type="button"
                    onClick={handleUndo}
                    disabled={historyIndex <= 0}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                    title="Отменить (Ctrl+Z)"
                  >
                    <Undo2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleRedo}
                    disabled={historyIndex >= history.length - 1}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                    title="Повторить (Ctrl+Y)"
                  >
                    <Redo2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Right tools cluster: Favorites, Shortcuts, Blindness */}
              <div className="flex items-center gap-2">
                {/* Save to Favorites Heart */}
                <button
                  type="button"
                  onClick={handleSaveToFavorites}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-rose-300 hover:bg-rose-50/50 text-slate-700 hover:text-rose-600 text-xs font-semibold transition-all cursor-pointer"
                  title="Сохранить текущую палитру в избранное"
                >
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  <span className="hidden sm:inline">{tr('В избранное', 'Save palette')}</span>
                </button>

                {/* Open Saved Palettes */}
                <button
                  type="button"
                  onClick={() => setShowFavoritesModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-slate-700 hover:text-blue-600 text-xs font-semibold transition-all cursor-pointer relative"
                  title="Просмотреть сохраненные палитры"
                >
                  <FolderHeart className="w-3.5 h-3.5 text-blue-600" />
                  <span className="hidden sm:inline">{tr('Избранное', 'Saved palettes')}</span>
                  {savedPalettes.length > 0 && (
                    <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold">
                      {savedPalettes.length}
                    </span>
                  )}
                </button>

                {/* Color Blindness Quick Simulator Selector */}
                <div className="relative flex items-center">
                  <select
                    value={colorBlindness}
                    onChange={(e) => {
                      const val = e.target.value as ColorBlindnessType;
                      setColorBlindness(val);
                      if (val !== 'none') {
                        showToast(`Режим симуляции: ${val}`);
                      }
                    }}
                    className={`appearance-none rounded-xl px-2.5 py-1.5 text-xs font-semibold pr-7 border transition-all cursor-pointer focus:outline-hidden ${
                      colorBlindness !== 'none'
                        ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                    title="Симулятор нарушений зрения"
                  >
                    <option value="none">{tr('Зрение: Обычное', 'Vision: Standard')}</option>
                    <option value="deuteranopia">{tr('Дейтеранопия', 'Deuteranopia')}</option>
                    <option value="protanopia">{tr('Протанопия', 'Protanopia')}</option>
                    <option value="tritanopia">{tr('Тританопия', 'Tritanopia')}</option>
                    <option value="achromatopsia">{tr('Ахроматопсия (ч/б)', 'Achromatopsia (B&W)')}</option>
                  </select>
                  <Eye className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Top: Main Palette Swatches Bar */}
            <MainPalette
              colors={colors}
              selectedIndex={selectedIndex}
              colorBlindness={colorBlindness}
              onSelectColor={setSelectedIndex}
              onToggleLock={handleToggleLock}
              onCopyColor={(text) => showToast(`Скопировано: ${text}`)}
              onMoveColor={handleMoveColor}
              onRandomizeSlot={handleRandomizeSlot}
            />

            {/* Middle Section: 3-column interactive modules */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
              {/* Column 1: Инструменты цвета с вкладками */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between h-full">
                <div>
                  {/* Tool Navigation Tabs */}
                  <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl mb-4 text-xs font-semibold overflow-x-auto">
                    <button
                      type="button"
                      onClick={() => setActiveToolTab('picker')}
                      className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                        activeToolTab === 'picker'
                          ? 'bg-white shadow-2xs text-blue-700 font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>{tr('Спектр', 'Picker')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveToolTab('wheel')}
                      className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                        activeToolTab === 'wheel'
                          ? 'bg-white shadow-2xs text-blue-700 font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <CircleDot className="w-3.5 h-3.5" />
                      <span>{tr('Круг', 'Wheel')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveToolTab('extractor')}
                      className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                        activeToolTab === 'extractor'
                          ? 'bg-white shadow-2xs text-blue-700 font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{tr('Из фото', 'From image')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveToolTab('shades')}
                      className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                        activeToolTab === 'shades'
                          ? 'bg-white shadow-2xs text-blue-700 font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>{tr('Оттенки', 'Shades')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveToolTab('accessibility')}
                      className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                        activeToolTab === 'accessibility'
                          ? 'bg-white shadow-2xs text-blue-700 font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>WCAG</span>
                    </button>
                  </div>

                  {/* Active Tool View */}
                  {activeToolTab === 'picker' && (
                    <ColorPicker
                      currentColor={currentColor}
                      onChangeColor={handleColorChange}
                      recentColors={recentColors}
                      onClearRecentColors={() => setRecentColors([])}
                      onCopyText={(text) => showToast(`Скопировано: ${text}`)}
                    />
                  )}

                  {activeToolTab === 'wheel' && (
                    <ColorWheel
                      colors={colors}
                      selectedIndex={selectedIndex}
                      harmony={harmony}
                      onSelectColorIndex={setSelectedIndex}
                      onSelectHue={(h, s) => {
                        const rgb = hslToRgb({ h, s, l: currentColor.hsl.l || 50 });
                        handleColorChange(rgbToHex(rgb));
                      }}
                    />
                  )}

                  {activeToolTab === 'extractor' && (
                    <ImagePaletteExtractor
                      onApplyPalette={handleApplyExtractedColors}
                      onNotify={showToast}
                    />
                  )}

                  {activeToolTab === 'shades' && (
                    <ShadesGenerator
                      colors={colors}
                      selectedIndex={selectedIndex}
                      onSelectColorIndex={setSelectedIndex}
                      onReplaceCurrentColor={handleColorChange}
                      onNotify={showToast}
                    />
                  )}

                  {activeToolTab === 'accessibility' && (
                    <AccessibilityChecker
                      colors={colors}
                      colorBlindness={colorBlindness}
                      onChangeColorBlindness={setColorBlindness}
                      onNotify={showToast}
                    />
                  )}
                </div>
              </div>

              {/* Column 2: Настройки (Settings, Sliders, Generation) */}
              <div>
                <SettingsPanel
                  autoGenerate={autoGenerate}
                  onToggleAutoGenerate={() => setAutoGenerate(!autoGenerate)}
                  colorCount={colorCount}
                  onChangeColorCount={handleColorCountChange}
                  style={style}
                  onChangeStyle={(st) => {
                    setStyle(st);
                    const newPal = generateHarmoniousPalette(
                      currentColor.hex,
                      harmony,
                      colorCount,
                      st,
                      saturation / 100,
                      brightness / 100,
                      colors
                    );
                    setColors(newPal);
                  }}
                  saturation={saturation}
                  onChangeSaturation={(val) => {
                    setSaturation(val);
                    const newPal = generateHarmoniousPalette(
                      currentColor.hex,
                      harmony,
                      colorCount,
                      style,
                      val / 100,
                      brightness / 100,
                      colors
                    );
                    setColors(newPal);
                  }}
                  brightness={brightness}
                  onChangeBrightness={(val) => {
                    setBrightness(val);
                    const newPal = generateHarmoniousPalette(
                      currentColor.hex,
                      harmony,
                      colorCount,
                      style,
                      saturation / 100,
                      val / 100,
                      colors
                    );
                    setColors(newPal);
                  }}
                  onGenerate={handleGenerate}
                  onReset={handleReset}
                />
              </div>

              {/* Column 3: Предпросмотр (Live Preview) */}
              <div className="md:col-span-2 xl:col-span-1">
                <LivePreview colors={colors} colorBlindness={colorBlindness} />
              </div>
            </div>

            {/* Bottom Specifications & Export Section (2-column layout) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Left (7 cols): Цветовые коды */}
              <div className="lg:col-span-7">
                <ColorCodesTable
                  colors={colors}
                  onCopyText={(text) => showToast(`Скопировано: ${text}`)}
                />
              </div>

              {/* Right (5 cols): Экспорт */}
              <div className="lg:col-span-5">
                <ExportSection colors={colors} onNotify={showToast} />
              </div>
            </div>

            {/* Bottom Section: Готовые палитры */}
            <CuratedPalettes onSelectPalette={handleSelectCuratedPalette} />
          </main>
        </div>
      </div>

      {/* Favorites Modal */}
      <FavoritesModal
        isOpen={showFavoritesModal}
        onClose={() => setShowFavoritesModal(false)}
        savedPalettes={savedPalettes}
        onApplyPalette={handleApplyExtractedColors}
        onDeletePalette={handleDeleteSavedPalette}
        onSaveCurrentPalette={handleSaveToFavorites}
        onNotify={showToast}
      />

      {/* Floating Toast Notification */}
      <Toast message={toastMessage} onClose={hideToast} />
    </div>
    </PaletteLocaleBoundary>
  );
}
