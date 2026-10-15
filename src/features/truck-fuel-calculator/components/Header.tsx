import React, { useState } from 'react';
import { Search, Sun, Moon, LogIn, Check, ChevronDown } from 'lucide-react';
import { LanguageCode } from '../locales/i18n';

interface HeaderProps {
  onOpenSearch: () => void;
  darkMode: boolean;
  onToggleTheme: () => void;
  lang: LanguageCode;
  onSelectLang: (lang: LanguageCode) => void;
  t: {
    searchPlaceholder: string;
    login: string;
    lightTheme: string;
    darkTheme: string;
  };
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  darkMode,
  onToggleTheme,
  lang,
  onSelectLang,
  t,
}) => {
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const langNames: Record<LanguageCode, { label: string; code: string }> = {
    ru: { label: 'Русский', code: 'RU' },
    uz: { label: 'Oʻzbekcha', code: 'UZ' },
    en: { label: 'English', code: 'EN' },
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-2.5 flex-shrink-0 group">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <svg
              className="w-5 h-5 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </div>
          <div className="flex items-baseline">
            <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
              Toolboxi
            </span>
            <span className="font-extrabold text-xl text-blue-600 dark:text-blue-400">.uz</span>
          </div>
        </a>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-xl mx-2 hidden md:block">
          <button
            type="button"
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100/90 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl border border-slate-200/80 dark:border-slate-700 transition-all text-left shadow-2xs group cursor-pointer"
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <Search className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors shrink-0" />
              <span className="truncate text-slate-400 dark:text-slate-400 font-normal">
                {t.searchPlaceholder}
              </span>
            </div>
            <div className="hidden lg:flex items-center gap-1 shrink-0">
              <kbd className="px-2 py-0.5 text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md shadow-2xs">
                Ctrl K
              </kbd>
            </div>
          </button>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Mobile search trigger */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg md:hidden"
            title="Поиск"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Theme toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            title={darkMode ? t.lightTheme : t.darkTheme}
            aria-label={darkMode ? t.lightTheme : t.darkTheme}
          >
            {darkMode ? (
              <Moon className="w-4 h-4 text-blue-400" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500" />
            )}
          </button>

          {/* Language Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="h-10 sm:h-8 flex items-center gap-1.5 px-2.5 sm:px-2 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700 transition-colors cursor-pointer"
            >
              <span className="w-4 h-3 rounded-xs overflow-hidden inline-flex flex-col justify-between border border-slate-200 dark:border-slate-600 shadow-2xs">
                {lang === 'ru' && (
                  <>
                    <span className="h-1 bg-white" />
                    <span className="h-1 bg-blue-600" />
                    <span className="h-1 bg-red-600" />
                  </>
                )}
                {lang === 'uz' && (
                  <>
                    <span className="h-1 bg-blue-400" />
                    <span className="h-1 bg-white" />
                    <span className="h-1 bg-emerald-500" />
                  </>
                )}
                {lang === 'en' && (
                  <>
                    <span className="h-1 bg-red-500" />
                    <span className="h-1 bg-white" />
                    <span className="h-1 bg-blue-700" />
                  </>
                )}
              </span>
              <span>{langNames[lang].code}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {langMenuOpen && (
              <>
                {/* Backdrop on mobile to easily close menu */}
                <div
                  className="fixed inset-0 z-40 bg-transparent"
                  onClick={() => setLangMenuOpen(false)}
                />
                <div
                  className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 text-xs font-medium"
                >
                  {(['ru', 'uz', 'en'] as const).map((code) => (
                    <button
                      key={code}
                      onClick={() => {
                        onSelectLang(code);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full px-3.5 py-2.5 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/80 cursor-pointer ${
                        lang === code
                          ? 'text-blue-600 dark:text-blue-400 font-bold bg-blue-50/60 dark:bg-blue-900/40'
                          : 'text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <span className="text-xs sm:text-sm">{langNames[code].label}</span>
                      {lang === code && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Login Button (compact on mobile) */}
          <button
            type="button"
            className="h-10 sm:h-8 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-xs shadow-blue-500/20 transition-all cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.login}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
