import React, { useState } from 'react';
import { ChevronRight, ChevronUp, ChevronDown, LayoutGrid, Check } from 'lucide-react';
import { ActiveCategory } from '../types/math';
import { useLanguage } from '../context/LanguageContext';

interface SidebarProps {
  activeCategory: ActiveCategory;
  onSelectCategory: (cat: ActiveCategory) => void;
  isOpen?: boolean;
}

interface SidebarItem {
  id: ActiveCategory;
  badge: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  const { t } = useLanguage();
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  const items: SidebarItem[] = [
    {
      id: 'algebra',
      badge: <span className="font-serif font-bold text-xs">x²</span>,
    },
    {
      id: 'equations',
      badge: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 12h18M3 6h18M3 18h18" />
        </svg>
      ),
    },
    {
      id: 'inequalities',
      badge: <span className="font-serif font-bold text-xs">∑</span>,
    },
    {
      id: 'systems',
      badge: <span className="font-mono font-bold text-xs">{'{ }'}</span>,
    },
    {
      id: 'systems_inequalities',
      badge: <span className="font-mono font-bold text-xs">{'{≠}'}</span>,
    },
    {
      id: 'solution_check',
      badge: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
        </svg>
      ),
    },
    {
      id: 'basic_operations',
      badge: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
    },
    {
      id: 'algebraic_properties',
      badge: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 3v18h18M7 16l4-8 4 6 5-10" />
        </svg>
      ),
    },
    {
      id: 'fractions',
      badge: (
        <span className="text-[10px] leading-none font-bold flex flex-col items-center">
          <span>5</span>
          <span className="w-3 border-t border-current"></span>
          <span>6</span>
        </span>
      ),
    },
    {
      id: 'polynomials',
      badge: <span className="font-serif italic font-bold text-xs">P</span>,
    },
    {
      id: 'rational_expressions',
      badge: <span className="font-serif text-[10px] font-bold">a/b</span>,
    },
    {
      id: 'sequences',
      badge: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="5" cy="12" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="19" cy="12" r="2" />
        </svg>
      ),
    },
    {
      id: 'logarithms',
      badge: <span className="font-mono text-[10px] font-bold">log</span>,
    },
    {
      id: 'trigonometry',
      badge: <span className="font-serif text-xs font-bold">△</span>,
    },
    {
      id: 'derivatives',
      badge: <span className="font-serif italic text-xs font-bold">f'</span>,
    },
    {
      id: 'integrals',
      badge: <span className="font-serif text-sm font-bold leading-none">∫</span>,
    },
  ];

  const currentItem = items.find((i) => i.id === activeCategory) || items[0];
  const currentTitle = (t.sidebar.tools as Record<string, string>)[activeCategory] || activeCategory;

  return (
    <aside className="w-full lg:w-64 shrink-0 transition-colors">
      {/* ================= MOBILE COMPACT VIEW (< lg) ================= */}
      <div className="lg:hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden mb-2">
        <button
          onClick={() => setIsMobileExpanded(!isMobileExpanded)}
          className="w-full p-3 sm:p-4 flex items-center justify-between bg-slate-50/60 dark:bg-slate-800/40 hover:bg-slate-100/60 dark:hover:bg-slate-800/80 transition cursor-pointer text-left"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
              {currentItem.badge}
            </div>
            <div className="min-w-0">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
                {t.mobile?.currentTopic || 'Текущий раздел'}
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                {currentTitle}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/70 border border-blue-200/60 dark:border-blue-900/50 px-2.5 py-1.5 rounded-lg shrink-0">
            <span>{isMobileExpanded ? 'Скрыть' : (t.mobile?.switchCategory || 'Сменить')}</span>
            {isMobileExpanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </div>
        </button>

        {/* Mobile Expanded 16 tools grid */}
        {isMobileExpanded && (
          <div className="p-2 sm:p-3 border-t border-slate-100 dark:border-slate-800 animate-in fade-in duration-200">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 px-1 mb-2 flex items-center gap-1.5">
              <LayoutGrid className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{t.mobile?.allTopics || 'Все разделы калькулятора (16)'}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
              {items.map((item) => {
                const isActive = activeCategory === item.id;
                const label = (t.sidebar.tools as Record<string, string>)[item.id] || item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectCategory(item.id);
                      setIsMobileExpanded(false);
                    }}
                    className={`flex items-center justify-between p-2 rounded-xl text-xs transition cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white font-bold shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                          isActive
                            ? 'bg-blue-700/80 text-white'
                            : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {item.badge}
                      </div>
                      <span className="truncate">{label}</span>
                    </div>
                    {isActive && <Check className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ================= DESKTOP FULL SIDEBAR (lg:block) ================= */}
      <div className="hidden lg:block bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3 shadow-xs">
        {/* Category Header */}
        <div className="flex items-center justify-between px-3 py-2 text-slate-800 dark:text-slate-100 font-bold text-sm border-b border-slate-100 dark:border-slate-800 mb-1">
          <span>{t.sidebar.title}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">16</span>
        </div>

        {/* Menu items list */}
        <nav className="space-y-0.5">
          {items.map((item) => {
            const isActive = activeCategory === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectCategory(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition ${
                      isActive
                        ? 'bg-blue-700/60 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-slate-200/80 dark:group-hover:bg-slate-700 group-hover:text-slate-900 dark:group-hover:text-white'
                    }`}
                  >
                    {item.badge}
                  </div>
                  <span className="truncate">{(t.sidebar.tools as Record<string, string>)[item.id] || item.id}</span>
                </div>
                <ChevronRight
                  className={`w-3.5 h-3.5 shrink-0 transition ${
                    isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                  }`}
                />
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
