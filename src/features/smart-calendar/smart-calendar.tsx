import React, { useState, useRef } from 'react';
import { HeroSection } from './components/HeroSection';
import { ToolTabs, ToolTabId } from './components/ToolTabs';
import { CalendarSettings } from './components/CalendarSettings';
import { MonthCalendar } from './components/MonthCalendar';
import { TodayWidget } from './components/TodayWidget';
import { UpcomingHolidaysWidget } from './components/UpcomingHolidaysWidget';
import { WorkDaysCalculator } from './components/WorkDaysCalculator';
import { AddDaysCalculator } from './components/AddDaysCalculator';
import { DeadlineCalculator } from './components/DeadlineCalculator';
import { HolidaysCatalog } from './components/HolidaysCatalog';
import { WeeksQuartersView } from './components/WeeksQuartersView';
import { WorkHoursCalculator } from './components/WorkHoursCalculator';
import { DateDiffCalculator } from './components/DateDiffCalculator';
import { PdfExportModal } from './components/PdfExportModal';
import { CommandPalette } from './components/CommandPalette';
import { HistoryFavoritesModal } from './components/HistoryFavoritesModal';
import { DayDetailsModal } from './components/DayDetailsModal';
import { CalendarGuideFaq } from './components/CalendarGuideFaq';
import { CountryCode, WorkWeekType, CalculationHistoryItem } from './types/calendar';
import { LanguageProvider } from './i18n/LanguageContext';
import { useI18n } from '@/lib/i18n';
import './smart-calendar.css';

function SmartCalendarContent() {
  // Dynamic Calendar State based on real system date
  const [todayDate] = useState<Date>(() => new Date());
  const [currentYear, setCurrentYear] = useState<number>(() => new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(() => new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [inspectedDay, setInspectedDay] = useState<Date | null>(null);

  // Settings
  const [country, setCountry] = useState<CountryCode>('UZ');
  const [workWeekType, setWorkWeekType] = useState<WorkWeekType>('5_DAYS');
  const [firstDayOfWeek, setFirstDayOfWeek] = useState<0 | 1>(1); // 1 = Monday, 0 = Sunday
  const [showHolidays, setShowHolidays] = useState<boolean>(true);
  const [showTransferred, setShowTransferred] = useState<boolean>(true);
  const [showIsoWeeks, setShowIsoWeeks] = useState<boolean>(true);

  // Active Tool Tab
  const [activeTab, setActiveTab] = useState<ToolTabId>('calendar');

  // Modals state
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [pdfReportType, setPdfReportType] = useState<'month' | 'year' | 'calculations'>('year');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyTab, setHistoryTab] = useState<'history' | 'favorites'>('history');

  const handleOpenPdfModal = (type: 'month' | 'year' | 'calculations' = 'year') => {
    setPdfReportType(type);
    setIsPdfModalOpen(true);
  };

  // History & Favorites
  const [history, setHistory] = useState<CalculationHistoryItem[]>([]);
  const [favorites, setFavorites] = useState<CalculationHistoryItem[]>([]);

  // Refs for smooth scrolling to calculators
  const calculatorsSectionRef = useRef<HTMLDivElement>(null);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleGoToToday = () => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth());
    setSelectedDate(now);
  };

  const handleResetSettings = () => {
    const now = new Date();
    setCountry('UZ');
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth());
    setWorkWeekType('5_DAYS');
    setFirstDayOfWeek(1);
    setShowHolidays(true);
    setShowTransferred(true);
    setShowIsoWeeks(true);
  };

  const handleSelectTab = (tab: ToolTabId) => {
    setActiveTab(tab);
    if (['work_days', 'add_days', 'deadline'].includes(tab)) {
      setTimeout(() => {
        calculatorsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  };

  const handleSaveToHistory = (item: CalculationHistoryItem) => {
    setHistory((prev) => [item, ...prev.slice(0, 40)]);
  };

  const handleToggleFavorite = (item: CalculationHistoryItem) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === item.id);
      if (exists) {
        return prev.filter((f) => f.id !== item.id);
      }
      return [item, ...prev];
    });
  };

  const handleSelectDay = (date: Date) => {
    setSelectedDate(date);
    setInspectedDay(date);
  };

  return (
    <div className="smart-calendar-page flex flex-col text-[#0F172A] dark:text-[#F8FAFC] transition-colors">
      {/* Main Container */}
      <main className="mx-auto w-full max-w-[1440px] space-y-2 pb-6 sm:space-y-2.5">
        {/* Hero Section matching toolboxi.uz design */}
        <HeroSection
          country={country}
          year={currentYear}
          onOpenPdfModal={() => handleOpenPdfModal('year')}
          onOpenHistory={() => {
            setHistoryTab('history');
            setIsHistoryOpen(true);
          }}
          onOpenFavorites={() => {
            setHistoryTab('favorites');
            setIsHistoryOpen(true);
          }}
          historyCount={history.length}
          savedCount={favorites.length}
          isFavorite={favorites.length > 0}
          onToggleFavorite={() => {
            setHistoryTab('favorites');
            setIsHistoryOpen(true);
          }}
        />

        {/* 8 Tool Navigation Tabs */}
        <ToolTabs activeTab={activeTab} onSelectTab={handleSelectTab} />

        {/* Dynamic Main Body Content */}
        {activeTab === 'holidays' ? (
          <HolidaysCatalog
            country={country}
            year={currentYear}
            onSelectDate={(d) => {
              setCurrentYear(d.getFullYear());
              setCurrentMonth(d.getMonth());
              setSelectedDate(d);
              setActiveTab('calendar');
            }}
            onOpenPdfModal={() => handleOpenPdfModal('year')}
          />
        ) : activeTab === 'weeks' ? (
          <WeeksQuartersView
            year={currentYear}
            country={country}
            workWeekType={workWeekType}
            onSelectDate={(d) => {
              setCurrentYear(d.getFullYear());
              setCurrentMonth(d.getMonth());
              setSelectedDate(d);
              setActiveTab('calendar');
            }}
          />
        ) : activeTab === 'work_hours' ? (
          <WorkHoursCalculator
            year={currentYear}
            country={country}
            workWeekType={workWeekType}
            onOpenPdfModal={() => handleOpenPdfModal('year')}
          />
        ) : activeTab === 'date_diff' ? (
          <DateDiffCalculator
            country={country}
            workWeekType={workWeekType}
            onSaveToHistory={handleSaveToHistory}
          />
        ) : (
          /* Main Calendar & Calculators View (Tabs: calendar, work_days, add_days, deadline) */
          <div className="space-y-3.5 sm:space-y-4">
            {/* Top Row: Narrow Settings + Generously Expanded Month Calendar + Right Sidebar */}
            <div className="flex flex-col lg:flex-row gap-3.5 sm:gap-4 items-stretch">
              {/* Column 1: Settings (comes below calendar on mobile, side-by-side on desktop) */}
              <div className="w-full lg:w-[295px] xl:w-[315px] lg:shrink-0 flex flex-col order-2 lg:order-1">
                <CalendarSettings
                  country={country}
                  onChangeCountry={setCountry}
                  year={currentYear}
                  onChangeYear={setCurrentYear}
                  workWeekType={workWeekType}
                  onChangeWorkWeekType={setWorkWeekType}
                  firstDayOfWeek={firstDayOfWeek}
                  onChangeFirstDayOfWeek={setFirstDayOfWeek}
                  showHolidays={showHolidays}
                  onToggleShowHolidays={setShowHolidays}
                  showTransferred={showTransferred}
                  onToggleShowTransferred={setShowTransferred}
                  showIsoWeeks={showIsoWeeks}
                  onToggleShowIsoWeeks={setShowIsoWeeks}
                  onReset={handleResetSettings}
                  onOpenPdfModal={() => handleOpenPdfModal('year')}
                />
              </div>

              {/* Column 2: Center Month Calendar (primary focus on mobile, central on desktop) */}
              <div className="w-full lg:flex-1 flex flex-col min-w-0 order-1 lg:order-2">
                <MonthCalendar
                  year={currentYear}
                  month={currentMonth}
                  country={country}
                  workWeekType={workWeekType}
                  firstDayOfWeek={firstDayOfWeek}
                  showHolidays={showHolidays}
                  showTransferred={showTransferred}
                  showIsoWeeks={showIsoWeeks}
                  selectedDate={selectedDate}
                  onSelectDate={handleSelectDay}
                  onPrevMonth={handlePrevMonth}
                  onNextMonth={handleNextMonth}
                  onGoToToday={handleGoToToday}
                  todayDate={todayDate}
                  onChangeMonth={setCurrentMonth}
                  onChangeYear={setCurrentYear}
                  onOpenPdfModal={(type) => handleOpenPdfModal(type || 'month')}
                />
              </div>

              {/* Column 3: Today Widget & Upcoming Holidays */}
              <div className="w-full lg:w-[310px] xl:w-[330px] lg:shrink-0 flex flex-col gap-3.5 sm:gap-4 order-3 lg:order-3">
                <TodayWidget
                  todayDate={todayDate}
                  country={country}
                  workWeekType={workWeekType}
                  onSelectDate={setSelectedDate}
                />

                <UpcomingHolidaysWidget
                  country={country}
                  year={currentYear}
                  currentDate={todayDate}
                  onViewAllHolidays={() => setActiveTab('holidays')}
                  onSelectHolidayDate={(d) => {
                    setCurrentYear(d.getFullYear());
                    setCurrentMonth(d.getMonth());
                    setSelectedDate(d);
                    setInspectedDay(d);
                  }}
                />
              </div>
            </div>

            {/* Bottom Row of 3 Calculators matching image.png */}
            <div
              ref={calculatorsSectionRef}
              className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 sm:gap-4 pt-1 items-stretch"
            >
              <WorkDaysCalculator
                country={country}
                workWeekType={workWeekType}
                onSaveToHistory={handleSaveToHistory}
                onOpenPdfModal={() => setIsPdfModalOpen(true)}
              />

              <AddDaysCalculator
                country={country}
                workWeekType={workWeekType}
                onSaveToHistory={handleSaveToHistory}
              />

              <DeadlineCalculator
                country={country}
                workWeekType={workWeekType}
                onSaveToHistory={handleSaveToHistory}
              />
            </div>
          </div>
        )}

        {/* Comprehensive Reference Information, Labor Norms Guide & FAQ matching toolboxi.uz */}
        <div className="pt-2">
          <CalendarGuideFaq
            country={country}
            onOpenPdfModal={(type) => handleOpenPdfModal(type || 'year')}
          />
        </div>
      </main>

      {/* Modals */}
      <PdfExportModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        year={currentYear}
        month={currentMonth}
        country={country}
        workWeekType={workWeekType}
        initialReportType={pdfReportType}
        calculations={{
          workDays: history.find((h) => h.type === 'work_days')?.data,
          deadline: history.find((h) => h.type === 'deadline')?.data,
        }}
      />

      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectTab={handleSelectTab}
        onSelectDate={(d) => {
          setCurrentYear(d.getFullYear());
          setCurrentMonth(d.getMonth());
          setSelectedDate(d);
          setActiveTab('calendar');
        }}
        onOpenPdfModal={() => handleOpenPdfModal('year')}
        country={country}
        year={currentYear}
      />

      <HistoryFavoritesModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        favorites={favorites}
        onClearHistory={() => setHistory([])}
        onToggleFavorite={handleToggleFavorite}
        onOpenPdfModal={() => handleOpenPdfModal('calculations')}
        initialTab={historyTab}
      />

      <DayDetailsModal
        date={inspectedDay}
        onClose={() => setInspectedDay(null)}
        country={country}
        workWeekType={workWeekType}
        onSetAsCalculatorDate={(_dateStr) => {
          // Can be used in calculations
          setActiveTab('calendar');
        }}
      />
    </div>
  );
}

export function SmartCalendarPage() {
  const { locale } = useI18n();

  return (
    <LanguageProvider language={locale}>
      <SmartCalendarContent />
    </LanguageProvider>
  );
}

