import { Link } from '@tanstack/react-router';
import { useState, useEffect, useMemo } from 'react';
import { CalculatorForm } from './components/CalculatorForm';
import { ResultPanel } from './components/ResultPanel';
import { CountryRatesSidebar } from './components/CountryRatesSidebar';
import { ExamplesTable } from './components/ExamplesTable';
import { FaqAndInfoSection } from './components/FaqAndInfoSection';
import { HistoryModal } from './components/HistoryModal';
import { SearchModal } from './components/SearchModal';
import { VatMode, CalculationResult } from './types';
import { calculateVat } from './utils/vatCalculations';
import { Check, ChevronRight, Globe2, Heart, History, Search, Share2, ShieldCheck, Zap } from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import { ToolIcon } from '@/components/tool-icon';
import { isFavorite, toggleFavorite } from '@/lib/tools/favorites';
import { buildShareUrl, shareUrl } from '@/lib/tools/share';
import { recordHistory } from '@/lib/tools/history';
import './vat-calculator.css';

const LOCAL_STORAGE_HISTORY_KEY = 'vat_calculator_history_v1';
const LOCAL_STORAGE_FAVORITES_KEY = 'vat_calculator_favs_v1';

function VatCalculatorMain() {
  const { t, language } = useApp();

  // Calculator Form State
  const [mode, setMode] = useState<VatMode>('add');
  const [inputAmount, setInputAmount] = useState<number>(1000);
  const [vatRate, setVatRate] = useState<number>(20);
  const [currency, setCurrency] = useState<string>('USD');
  const [roundToTwoDecimals, setRoundToTwoDecimals] = useState<boolean>(true);
  const [itemName, setItemName] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [showTableView, setShowTableView] = useState<boolean>(false);

  // Modals & Feedback
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isFavoritesOnly, setIsFavoritesOnly] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [siteFavorite, setSiteFavorite] = useState(false);

  // History & Favorites
  const [history, setHistory] = useState<CalculationResult[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_FAVORITES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Calculate current active result using active language for wordsInAmount
  const currentResult = useMemo(() => {
    return calculateVat({
      mode,
      inputAmount,
      vatRate,
      currency,
      roundToTwoDecimals,
      itemName: itemName || (language === 'ru' ? 'Товары / услуги' : language === 'uz' ? 'Mahsulot / xizmatlar' : 'Goods / services'),
      note,
      lang: language,
    });
  }, [mode, inputAmount, vatRate, currency, roundToTwoDecimals, itemName, note, language]);

  // Persist history & favorites
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(history));
    } catch (e) {
      console.warn('Failed to persist history to localStorage', e);
    }
  }, [history]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_FAVORITES_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.warn('Failed to persist favorites to localStorage', e);
    }
  }, [favorites]);

  useEffect(() => setSiteFavorite(isFavorite('vat-calculator')), []);

  // Keyboard shortcut Ctrl+K / Cmd+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Handle explicit calculation click
  const handleCalculate = () => {
    setHistory((prev) => {
      const updated = [currentResult, ...prev.filter((item) => item.id !== currentResult.id)];
      return updated.slice(0, 50);
    });
    showToast(t('messages.calculatedToast'));
    recordHistory({
      toolId: 'vat-calculator',
      title: `${inputAmount.toLocaleString()} ${currency} · ${vatRate}%`,
      params: {
        amount: String(inputAmount),
        rate: String(vatRate),
        mode,
        currency,
      },
    });

    // Smooth scroll to result on mobile view
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setTimeout(() => {
        const resultEl = document.getElementById('result-section');
        if (resultEl) {
          resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
    }
  };

  // Reset calculator to default state
  const handleReset = () => {
    setInputAmount(1000);
    setVatRate(20);
    setCurrency('USD');
    setMode('add');
    setItemName('');
    setNote('');
    setShowTableView(false);
    showToast(t('messages.resetToast'));
  };

  // Apply rate from country click
  const handleSelectCountryRate = (rate: number, countryName?: string) => {
    setVatRate(rate);
    showToast(`${rate}% ${countryName ? `(${countryName})` : ''}`);
  };

  // Apply example from quick lookup table
  const handleApplyExample = (amount: number, exampleMode: VatMode) => {
    setInputAmount(amount);
    setMode(exampleMode);
    showToast(`${amount.toLocaleString()} ${currency}`);
  };

  // Load a result from history
  const handleSelectHistoryItem = (item: CalculationResult) => {
    setMode(item.mode);
    setInputAmount(item.inputAmount);
    setVatRate(item.vatRate);
    setCurrency(item.currency);
    setRoundToTwoDecimals(item.roundToTwoDecimals);
    setItemName(item.itemName || '');
    setNote(item.note || '');
    showToast(t('messages.loadedHistoryToast'));
  };

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleClearHistory = () => {
    setHistory([]);
    showToast(t('messages.historyClearedToast'));
  };

  const handleShare = async () => {
    const status = await shareUrl(
      buildShareUrl('/tools/vat-calculator', new URLSearchParams()),
      t('header.title'),
    );
    if (status === 'copied' || status === 'shared') {
      showToast(language === 'ru' ? 'Ссылка скопирована' : language === 'uz' ? 'Havola nusxalandi' : 'Link copied');
    }
  };

  const labels = language === 'ru'
    ? { home: 'Главная', category: 'Финансы и инвестиции', favorite: 'В избранное', share: 'Поделиться', search: 'Ставки', history: 'История', private: 'Данные остаются в браузере' }
    : language === 'uz'
      ? { home: 'Bosh sahifa', category: 'Moliya va investitsiyalar', favorite: 'Sevimlilarga', share: 'Ulashish', search: 'Stavkalar', history: 'Tarix', private: 'Ma’lumotlar brauzerda qoladi' }
      : { home: 'Home', category: 'Finance & investing', favorite: 'Favorite', share: 'Share', search: 'Rates', history: 'History', private: 'Data stays in your browser' };

  return (
    <div className="vat-page text-slate-800 dark:text-slate-100 font-sans transition-colors duration-200">
      <main className="max-w-7xl w-full mx-auto">
        <div className="space-y-4 sm:space-y-6">
          <nav className="vat-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">{labels.home}</Link><ChevronRight />
            <Link to="/categories/$id" params={{ id: 'finance' }}>{labels.category}</Link><ChevronRight />
            <span>{t('header.title')}</span>
          </nav>

          <section className="vat-heading">
            <div className="vat-heading-main">
              <ToolIcon tool={{ slug: 'vat-calculator', icon: 'Percent' }} size="hero" />
              <div>
                <h1>{t('header.title')}</h1>
                <p>{t('header.subtitle')}</p>
              </div>
            </div>
            <div className="vat-heading-actions">
              <button type="button" onClick={() => setIsSearchOpen(true)}><Search />{labels.search}</button>
              <button type="button" onClick={() => { setIsFavoritesOnly(false); setIsHistoryOpen(true); }}><History />{labels.history}{history.length > 0 && <b>{history.length}</b>}</button>
              <button type="button" className={siteFavorite ? 'active' : ''} onClick={() => setSiteFavorite(toggleFavorite('vat-calculator'))}><Heart fill={siteFavorite ? 'currentColor' : 'none'} />{labels.favorite}</button>
              <button type="button" onClick={handleShare}><Share2 />{labels.share}</button>
            </div>
            <div className="vat-feature-strip">
              <span><Zap /><b>{t('header.fast')}</b><small>{t('header.fastDesc')}</small></span>
              <span><ShieldCheck /><b>{t('header.accurate')}</b><small>{t('header.accurateDesc')}</small></span>
              <span><Globe2 /><b>{t('header.global')}</b><small>{labels.private}</small></span>
            </div>
          </section>

          {/* Main 3-Column Calculator Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left Column: Mode, Inputs, Additional */}
            <div className="lg:col-span-4 space-y-5">
              <CalculatorForm
                mode={mode}
                onModeChange={setMode}
                inputAmount={inputAmount}
                onAmountChange={setInputAmount}
                vatRate={vatRate}
                onVatRateChange={setVatRate}
                currency={currency}
                onCurrencyChange={setCurrency}
                roundToTwoDecimals={roundToTwoDecimals}
                onRoundToggle={setRoundToTwoDecimals}
                itemName={itemName}
                onItemNameChange={setItemName}
                note={note}
                onNoteChange={setNote}
                showTableView={showTableView}
                onToggleTableView={setShowTableView}
                onReset={handleReset}
                onCalculate={handleCalculate}
                onOpenRatesList={() => setIsSearchOpen(true)}
              />
            </div>

            {/* Center Column: Result, KPI Cards, Breakdown Table, Formula */}
            <div className="lg:col-span-5 space-y-5">
              <ResultPanel
                result={currentResult}
                showTableView={showTableView}
              />
            </div>

            {/* Right Column: Country Rates & Examples */}
            <div className="lg:col-span-3 space-y-5">
              <CountryRatesSidebar
                currentRate={vatRate}
                onSelectRate={handleSelectCountryRate}
              />

              <ExamplesTable
                currentRate={vatRate}
                currency={currency}
                onApplyExample={handleApplyExample}
              />
            </div>
          </div>

          {/* Bottom Collapsible Section: Useful Info, FAQ, Tips */}
          <FaqAndInfoSection />
        </div>
      </main>

      {/* History and Favorites Drawer/Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        items={history}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
        onSelectResult={handleSelectHistoryItem}
        onClearHistory={handleClearHistory}
        isFavoritesOnly={isFavoritesOnly}
      />

      {/* Ctrl+K Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectCountryRate={handleSelectCountryRate}
        onSelectMode={setMode}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 dark:bg-slate-800 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 border border-slate-800 dark:border-slate-700">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export function VatCalculatorPage() {
  return (
    <AppProvider>
      <VatCalculatorMain />
    </AppProvider>
  );
}
