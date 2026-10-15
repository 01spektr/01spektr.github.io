import React, { useState, useEffect, useMemo } from "react";
import { TruckHeroBanner } from "./components/TruckHeroBanner";
import { TruckMetricsCards } from "./components/TruckMetricsCards";
import { CalculationForm } from "./components/CalculationForm";
import { ResultsPanel } from "./components/ResultsPanel";
import { TruckBottomCards } from "./components/TruckBottomCards";
import { FeedbackModal } from "./components/FeedbackModal";
import { SavedCalculationsModal } from "./components/SavedCalculationsModal";
import { TruckPresetsModal } from "./components/TruckPresetsModal";
import {
  CalculatorState,
  SavedCalculation,
  DistanceUnit,
  CurrencyCode,
  TruckPreset,
} from "./types/calculator";
import { INITIAL_CALCULATOR_STATE } from "./utils/constants";
import { calculateFuel } from "./utils/calculations";
import {
  LanguageCode,
  getTranslations,
  getDefaultCurrencyForLang,
  getDefaultPriceForCurrency,
} from "./locales/i18n";
import { useI18n } from "@/lib/i18n";
import { isFavorite, toggleFavorite } from "@/lib/tools/favorites";
import { buildShareUrl, shareUrl } from "@/lib/tools/share";

export function TruckFuelCalculatorPage() {
  const { locale } = useI18n();
  const lang: LanguageCode = (locale === "uz" || locale === "en") ? locale : "ru";
  const t = useMemo(() => getTranslations(lang), [lang]);

  const [favorite, setFavorite] = useState(() =>
    isFavorite("truck-fuel-calculator")
  );

  // Initial state with currency matching active language
  const [state, setState] = useState<CalculatorState>(() => {
    const initialCurrency = getDefaultCurrencyForLang(lang);
    return {
      ...INITIAL_CALCULATOR_STATE,
      currency: initialCurrency,
      fuelPrice: getDefaultPriceForCurrency(initialCurrency),
    };
  });

  // Modals state
  const [savedOpen, setSavedOpen] = useState(false);
  const [truckPresetsOpen, setTruckPresetsOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  // Saved calculations history in localStorage
  const [savedList, setSavedList] = useState<SavedCalculation[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem("toolboxi_truck_saved_calculations");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Calculate live results based on state
  const calculationResult = useMemo(() => {
    return calculateFuel(state);
  }, [state]);

  // Read URL params on initial load for share links
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const params = new URLSearchParams(window.location.search);
      const dist = params.get("dist");
      const loaded = params.get("loaded");
      const empty = params.get("empty");
      const avg = params.get("avg");
      const price = params.get("price");
      const cargo = params.get("cargo");
      const curr = params.get("curr");

      if (dist || avg || price) {
        setState((prev) => ({
          ...prev,
          totalDistance: dist ? parseFloat(dist) : prev.totalDistance,
          loadedDistance: loaded ? parseFloat(loaded) : prev.loadedDistance,
          emptyDistance: empty ? parseFloat(empty) : prev.emptyDistance,
          avgConsumption: avg ? parseFloat(avg) : prev.avgConsumption,
          fuelPrice: price ? parseFloat(price) : prev.fuelPrice,
          cargoWeight: cargo ? parseFloat(cargo) : prev.cargoWeight,
          currency: (curr as CurrencyCode) || prev.currency,
        }));
      }
    } catch {
      // ignore
    }
  }, []);

  // Save calculations to localStorage whenever changed
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(
        "toolboxi_truck_saved_calculations",
        JSON.stringify(savedList)
      );
    } catch {
      // ignore
    }
  }, [savedList]);

  const handleStateChange = (patch: Partial<CalculatorState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  };

  const handleCurrencyChange = (newCurrency: CurrencyCode) => {
    setState((prev) => {
      if (prev.currency === newCurrency) return prev;

      const oldRate =
        prev.currency === "UZS"
          ? 12600
          : prev.currency === "EUR"
          ? 0.92
          : prev.currency === "RUB"
          ? 92
          : prev.currency === "KZT"
          ? 450
          : 1;

      const newRate =
        newCurrency === "UZS"
          ? 12600
          : newCurrency === "EUR"
          ? 0.92
          : newCurrency === "RUB"
          ? 92
          : newCurrency === "KZT"
          ? 450
          : 1;

      const priceInUsd = prev.fuelPrice / oldRate;
      let newPrice = priceInUsd * newRate;

      if (newCurrency === "UZS") {
        newPrice = Math.round(newPrice / 100) * 100;
      } else if (newCurrency === "RUB" || newCurrency === "KZT") {
        newPrice = Math.round(newPrice * 10) / 10;
      } else {
        newPrice = Math.round(newPrice * 100) / 100;
      }

      return {
        ...prev,
        currency: newCurrency,
        fuelPrice: Math.max(0, newPrice),
      };
    });
  };

  const handleReset = () => {
    const cur = getDefaultCurrencyForLang(lang);
    setState({
      ...INITIAL_CALCULATOR_STATE,
      currency: cur,
      fuelPrice: getDefaultPriceForCurrency(cur),
    });
  };

  const handleCalculate = () => {
    if (typeof window === "undefined") return;
    const resultsEl = document.getElementById("results-section");
    if (resultsEl && window.innerWidth < 1024) {
      resultsEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSaveCalculation = () => {
    const dateLocale =
      lang === "uz" ? "uz-UZ" : lang === "en" ? "en-US" : "ru-RU";
    const newEntry: SavedCalculation = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(dateLocale, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      title: `${state.totalDistance} ${state.distanceUnit} (${state.cargoWeight} t)`,
      state: { ...state },
      result: { ...calculationResult },
    };

    setSavedList((prev) => [newEntry, ...prev]);
    setSavedOpen(true);
  };

  const handleLoadSaved = (calc: SavedCalculation) => {
    setState({ ...calc.state });
  };

  const handleDeleteSaved = (id: string) => {
    setSavedList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAllSaved = () => {
    setSavedList([]);
  };

  const handleSelectTruckPreset = (preset: TruckPreset) => {
    setState((prev) => ({
      ...prev,
      selectedTruckModel: `${preset.brand} ${preset.model}`,
      avgConsumption: preset.baseConsumption,
      fuelType: preset.fuelType,
    }));
  };

  const handleShare = async () => {
    const params = new URLSearchParams();
    params.set("dist", String(state.totalDistance));
    params.set("loaded", String(state.loadedDistance));
    params.set("empty", String(state.emptyDistance));
    params.set("avg", String(state.avgConsumption));
    params.set("price", String(state.fuelPrice));
    params.set("cargo", String(state.cargoWeight));
    params.set("curr", state.currency);

    await shareUrl(
      buildShareUrl("/tools/truck-fuel-calculator", params),
      t.hero.title
    );
  };

  const isCurrentStateSaved = useMemo(() => {
    return savedList.some(
      (s) =>
        s.state.totalDistance === state.totalDistance &&
        s.state.fuelPrice === state.fuelPrice &&
        s.state.avgConsumption === state.avgConsumption &&
        s.state.cargoWeight === state.cargoWeight
    );
  }, [savedList, state]);

  return (
    <div className="truck-fuel-calculator-page text-slate-900 dark:text-slate-100 pb-14 font-sans antialiased transition-colors duration-200">
      {/* Standardized Benchmark Container max-w-[1380px] */}
      <main className="max-w-[1380px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-6">
        {/* Unified HeroBanner matching benchmark */}
        <TruckHeroBanner
          favorite={favorite}
          onToggleFavorite={() =>
            setFavorite(toggleFavorite("truck-fuel-calculator"))
          }
          savedCount={savedList.length}
          onOpenSaved={() => setSavedOpen(true)}
          onShare={handleShare}
        />

        {/* 3 Metric Summary Cards matching benchmark */}
        <TruckMetricsCards
          state={state}
          result={calculationResult}
          onReset={handleReset}
        />

        {/* Two-Column Grid: Form (8 cols) & Results (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Form (8 cols on large screens) */}
          <div className="lg:col-span-8">
            <CalculationForm
              state={state}
              onChange={handleStateChange}
              onReset={handleReset}
              onCalculate={handleCalculate}
              onOpenTruckPresets={() => setTruckPresetsOpen(true)}
              t={t.form}
            />
          </div>

          {/* Right Column: Results (4 cols on large screens) */}
          <div
            id="results-section"
            className="lg:col-span-4 lg:sticky lg:top-20"
          >
            <ResultsPanel
              state={state}
              result={calculationResult}
              onUpdateUnit={(unit: DistanceUnit) =>
                handleStateChange({ distanceUnit: unit })
              }
              onUpdateCurrency={handleCurrencyChange}
              onSaveCalculation={handleSaveCalculation}
              isSaved={isCurrentStateSaved}
              t={t.results}
              lang={lang}
            />
          </div>
        </div>

        {/* Bottom Knowledge Section (FAQ, Guides, Feedback) */}
        <section id="knowledge-section" className="pt-2">
          <TruckBottomCards
            onOpenFeedback={() => setFeedbackOpen(true)}
            t={t.knowledge}
          />
        </section>
      </main>

      {/* Truck Presets Modal */}
      <TruckPresetsModal
        isOpen={truckPresetsOpen}
        onClose={() => setTruckPresetsOpen(false)}
        selectedModel={state.selectedTruckModel}
        onSelectPreset={handleSelectTruckPreset}
        t={t.modals}
      />

      {/* Saved Calculations Modal */}
      <SavedCalculationsModal
        isOpen={savedOpen}
        onClose={() => setSavedOpen(false)}
        savedList={savedList}
        onLoad={handleLoadSaved}
        onDelete={handleDeleteSaved}
        onClearAll={handleClearAllSaved}
        t={t.modals}
      />

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        t={t.modals}
      />
    </div>
  );
}

export default TruckFuelCalculatorPage;
