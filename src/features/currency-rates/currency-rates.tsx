import React, { useEffect, useState } from 'react';
import { Currency, AlertNotification, UsefulTool } from './types';
import { useI18n } from '@/lib/i18n';
import { INITIAL_CURRENCIES, INITIAL_ALERTS } from './data/currencies';
import { getTranslations } from './data/i18n';
import { HeroSection } from './components/HeroSection';
import { CurrencyCardsRow } from './components/CurrencyCardsRow';
import { ConverterCard } from './components/ConverterCard';
import { ChartCard } from './components/ChartCard';
import { AlertsCard, DataSourceCard } from './components/RightSidebarCards';
import { CurrenciesTable } from './components/CurrenciesTable';
import { ToolsList } from './components/ToolsList';
import { AlertModal, SearchModal, ToolModal } from './components/Modals';

export default function App() {
  const { locale: currentLang } = useI18n();
  const [currencies, setCurrencies] = useState<Currency[]>(INITIAL_CURRENCIES);
  const [alerts, setAlerts] = useState<AlertNotification[]>(INITIAL_ALERTS);
  const [ratesUpdatedAt, setRatesUpdatedAt] = useState<string>('');

  // Active chart & converter selections
  const [chartBaseCurrency, setChartBaseCurrency] = useState<string>('USD');
  const [chartTargetCurrency, setChartTargetCurrency] = useState<string>('UZS');
  const [converterFrom, setConverterFrom] = useState<string>('USD');
  const [converterTo, setConverterTo] = useState<string>('UZS');

  // Chart settings
  const [showAverage, setShowAverage] = useState<boolean>(false);

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState<boolean>(false);
  const [editingAlert, setEditingAlert] = useState<AlertNotification | null>(null);
  const [activeTool, setActiveTool] = useState<UsefulTool | null>(null);

  // Internationalization translation object
  const t = getTranslations(currentLang);

  useEffect(() => {
    const controller = new AbortController();
    type CbuRate = {
      Ccy: string;
      CcyNm_RU: string;
      CcyNm_EN: string;
      CcyNm_UZ: string;
      Nominal: string;
      Rate: string;
      Diff: string;
      Date: string;
    };

    fetch('https://cbu.uz/ru/arkhiv-kursov-valyut/json/', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`CBU ${response.status}`);
        return response.json() as Promise<CbuRate[]>;
      })
      .then((rows) => {
        if (!Array.isArray(rows) || rows.length === 0) return;
        const byCode = new Map(rows.map((row) => [row.Ccy, row]));
        setCurrencies((current) =>
          current.map((currency) => {
            if (currency.code === 'UZS') return currency;
            const row = byCode.get(currency.code);
            if (!row) return currency;
            const nominal = Number(String(row.Nominal).replace(',', '.')) || 1;
            const rate = Number(String(row.Rate).replace(',', '.')) / nominal;
            const diff = Number(String(row.Diff).replace(',', '.')) / nominal;
            if (!Number.isFinite(rate) || rate <= 0) return currency;
            const previous = rate - diff;
            const change24h = previous ? (diff / previous) * 100 : 0;
            const localizedName =
              currentLang === 'en' ? row.CcyNm_EN : currentLang === 'uz' ? row.CcyNm_UZ : row.CcyNm_RU;
            return {
              ...currency,
              name: localizedName || currency.name,
              rate,
              change24h,
              sparkline: [...currency.sparkline.slice(1), rate],
            };
          }),
        );
        setRatesUpdatedAt(rows[0]?.Date || '');
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        console.warn('Unable to update CBU currency rates', error);
      });

    return () => controller.abort();
  }, [currentLang]);

  // Helper to get translated currency name
  const getCurrencyName = (code: string, fallback: string) => {
    return t.currencyNames?.[code as keyof typeof t.currencyNames] || fallback;
  };

  // Favorite toggle
  const handleToggleFavorite = (code: string) => {
    setCurrencies((prev) =>
      prev.map((c) => (c.code === code ? { ...c, isFavorite: !c.isFavorite } : c))
    );
  };

  // When converter 'From' changes, keep chart base in sync
  const handleConverterFromChange = (code: string) => {
    setConverterFrom(code);
    setChartBaseCurrency(code);
  };

  // When converter 'To' changes, keep chart target in sync
  const handleConverterToChange = (code: string) => {
    setConverterTo(code);
    setChartTargetCurrency(code);
  };

  // When chart currency pair changes from right sidebar, keep converter in sync
  const handleChartBaseChange = (code: string) => {
    setChartBaseCurrency(code);
    setConverterFrom(code);
  };

  const handleChartTargetChange = (code: string) => {
    setChartTargetCurrency(code);
    setConverterTo(code);
  };

  // When currency is selected from top cards or table
  const handleSelectCurrency = (code: string) => {
    setChartBaseCurrency(code);
    setChartTargetCurrency('UZS');
    setConverterFrom(code);
    setConverterTo('UZS');
  };

  // Swap currencies synchronously across Converter and Chart
  const handleSwapCurrencies = () => {
    const newFrom = converterTo;
    const newTo = converterFrom;
    setConverterFrom(newFrom);
    setConverterTo(newTo);
    setChartBaseCurrency(newFrom);
    setChartTargetCurrency(newTo);
  };

  // Alert management
  const handleToggleAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );
  };

  const handleDeleteAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSaveAlert = (
    alertData: Omit<AlertNotification, 'id' | 'createdAt'>,
    id?: string
  ) => {
    if (id) {
      setAlerts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...alertData } : a))
      );
    } else {
      const newAlert: AlertNotification = {
        ...alertData,
        id: `alert-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setAlerts((prev) => [...prev, newAlert]);
    }
  };

  const handleOpenEditAlert = (alert: AlertNotification) => {
    setEditingAlert(alert);
    setIsAlertModalOpen(true);
  };

  const handleOpenNewAlert = () => {
    setEditingAlert(null);
    setIsAlertModalOpen(true);
  };

  // Keyboard shortcut for search (Ctrl+K / Cmd+K)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="currency-rates-page selection:bg-blue-600 selection:text-white">
      <main className="currency-rates-content">
        {/* Hero Section */}
        <HeroSection t={t.hero} />

        {/* Currency Cards Carousel Row */}
        <CurrencyCardsRow
          currencies={currencies}
          selectedCurrency={chartBaseCurrency}
          onSelectCurrency={handleSelectCurrency}
          getCurrencyName={getCurrencyName}
        />

        {/* Row 1: Balanced 2-Column Grid (Converter 4 cols + Chart 8 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 my-4 items-stretch">
          {/* Left: Converter Card (4 cols) */}
          <div className="lg:col-span-4 flex">
            <div className="w-full">
              <ConverterCard
                currencies={currencies}
                fromCurrency={converterFrom}
                toCurrency={converterTo}
                onFromChange={handleConverterFromChange}
                onToChange={handleConverterToChange}
                onSwapCurrencies={handleSwapCurrencies}
                t={t}
                getCurrencyName={getCurrencyName}
              />
            </div>
          </div>

          {/* Right: Rate Chart Card (8 cols) */}
          <div className="lg:col-span-8 flex">
            <div className="w-full">
              <ChartCard
                currencies={currencies}
                baseCurrency={chartBaseCurrency}
                targetCurrency={chartTargetCurrency}
                showAverage={showAverage}
                onBaseChange={handleChartBaseChange}
                onTargetChange={handleChartTargetChange}
                onSwapCurrencies={handleSwapCurrencies}
                onToggleAverage={() => setShowAverage(!showAverage)}
                t={t}
                getCurrencyName={getCurrencyName}
              />
            </div>
          </div>
        </div>

        {/* Row 2: Currencies Table (8 cols) + Sidebar with Alerts, Tools & Data Source (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4 items-start">
          {/* Left: Official Currencies Table (8 cols) */}
          <div className="lg:col-span-8">
            <CurrenciesTable
              currencies={currencies}
              locale={currentLang}
              onToggleFavorite={handleToggleFavorite}
              onSelectCurrency={handleSelectCurrency}
              t={t}
              getCurrencyName={getCurrencyName}
            />
          </div>

          {/* Right: Sidebar Stack (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <AlertsCard
              alerts={alerts}
              locale={currentLang}
              onToggleAlert={handleToggleAlert}
              onDeleteAlert={handleDeleteAlert}
              onAddAlertClick={handleOpenNewAlert}
              onEditAlertClick={handleOpenEditAlert}
              t={t}
            />
            <ToolsList onSelectTool={(tool) => setActiveTool(tool)} t={t} />
            <DataSourceCard t={t} updatedAt={ratesUpdatedAt} />
          </div>
        </div>
      </main>

      {/* Global Modals with Translations */}
      <AlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        onSave={handleSaveAlert}
        editingAlert={editingAlert}
        currencies={currencies}
        t={t}
        getCurrencyName={getCurrencyName}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        currencies={currencies}
        onSelectCurrency={handleSelectCurrency}
        onSelectTool={(tool) => setActiveTool(tool)}
        t={t}
        getCurrencyName={getCurrencyName}
      />

      <ToolModal
        tool={activeTool}
        onClose={() => setActiveTool(null)}
        currencies={currencies}
        t={t}
      />
    </div>
  );
}
