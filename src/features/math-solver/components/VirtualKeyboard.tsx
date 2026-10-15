import React, { useState, useEffect } from 'react';
import { Delete, Keyboard as KeyboardIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { ActiveCategory } from '../types/math';
import { useLanguage } from '../context/LanguageContext';

interface VirtualKeyboardProps {
  onInsert: (value: string) => void;
  onBackspace: () => void;
  onClear: () => void;
  activeCategory?: ActiveCategory;
}

export type KeyboardCategory =
  | 'basic'
  | 'symbols'
  | 'functions'
  | 'brackets'
  | 'greek'
  | 'numpad';

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  onInsert,
  onBackspace,
  activeCategory = 'algebra',
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<KeyboardCategory>('basic');
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Context-aware: when category changes, adapt initial tab or keep basic
  useEffect(() => {
    if (activeCategory === 'trigonometry' || activeCategory === 'logarithms' || activeCategory === 'derivatives' || activeCategory === 'integrals') {
      setActiveTab('functions');
    } else if (activeCategory === 'inequalities' || activeCategory === 'systems_inequalities') {
      setActiveTab('symbols');
    } else if (activeCategory === 'systems') {
      setActiveTab('brackets');
    } else if (activeCategory === 'sequences' || activeCategory === 'basic_operations') {
      setActiveTab('numpad');
    } else {
      setActiveTab('basic');
    }
  }, [activeCategory]);

  const tabs: { id: KeyboardCategory; label: string }[] = [
    { id: 'basic', label: t.keyboard.basic },
    { id: 'symbols', label: t.keyboard.symbols },
    { id: 'functions', label: t.keyboard.functions },
    { id: 'brackets', label: t.keyboard.brackets },
    { id: 'greek', label: t.keyboard.greek },
    { id: 'numpad', label: t.keyboard.numpad },
  ];

  // Base 10-column layout from screenshot
  const basicKeys: { label: React.ReactNode; val: string }[][] = [
    // Row 1: x  y  a  b  x²  xⁿ  √  ∛  π  e
    [
      { label: 'x', val: 'x' },
      { label: 'y', val: 'y' },
      { label: 'a', val: 'a' },
      { label: 'b', val: 'b' },
      { label: <span>x<sup>2</sup></span>, val: '²' },
      { label: <span>x<sup>n</sup></span>, val: '^' },
      { label: '√', val: '√(' },
      { label: <span><sup>3</sup>√</span>, val: '∛(' },
      { label: 'π', val: 'π' },
      { label: 'e', val: 'e' },
    ],
    // Row 2: (  )  +  -  ×  ÷  =  ≠  ≤  ≥
    [
      { label: '(', val: '(' },
      { label: ')', val: ')' },
      { label: '+', val: ' + ' },
      { label: '−', val: ' - ' },
      { label: '×', val: ' · ' },
      { label: '÷', val: ' / ' },
      { label: '=', val: ' = ' },
      { label: '≠', val: ' ≠ ' },
      { label: '≤', val: ' ≤ ' },
      { label: '≥', val: ' ≥ ' },
    ],
    // Row 3: a/b  d/dx  ∫  ∑  lim  ∞  |x|  ln  log  ⌫
    [
      {
        label: (
          <span className="flex flex-col items-center justify-center text-[11px] leading-tight font-serif">
            <span>a</span>
            <span className="w-2.5 h-[1px] bg-current"></span>
            <span>b</span>
          </span>
        ),
        val: '/',
      },
      {
        label: (
          <span className="flex flex-col items-center justify-center text-[10px] leading-tight font-serif">
            <span>d</span>
            <span className="w-3 h-[1px] bg-current"></span>
            <span>dx</span>
          </span>
        ),
        val: 'd/dx(',
      },
      { label: <span className="text-base font-serif">∫</span>, val: '∫(' },
      { label: <span className="font-serif">∑</span>, val: '∑(' },
      { label: <span className="text-xs font-sans font-medium">lim</span>, val: 'lim(' },
      { label: <span className="text-base">∞</span>, val: '∞' },
      { label: <span className="text-xs font-serif">|x|</span>, val: '|' },
      { label: <span className="text-xs font-sans font-medium">ln</span>, val: 'ln(' },
      { label: <span className="text-xs font-sans font-medium">log</span>, val: 'log(' },
      {
        label: <Delete className="w-4 h-4 text-slate-500 hover:text-rose-600 transition" />,
        val: '__BACKSPACE__',
      },
    ],
  ];

  // Tab: Символы (10 columns)
  const symbolsKeys: { label: React.ReactNode; val: string }[][] = [
    [
      { label: '+', val: ' + ' },
      { label: '−', val: ' - ' },
      { label: '±', val: ' ± ' },
      { label: '×', val: ' · ' },
      { label: '÷', val: ' / ' },
      { label: '=', val: ' = ' },
      { label: '≠', val: ' ≠ ' },
      { label: '<', val: ' < ' },
      { label: '>', val: ' > ' },
      { label: '≈', val: ' ≈ ' },
    ],
    [
      { label: '≤', val: ' ≤ ' },
      { label: '≥', val: ' ≥ ' },
      { label: '∈', val: ' ∈ ' },
      { label: '∉', val: ' ∉ ' },
      { label: '⊂', val: ' ⊂ ' },
      { label: '∪', val: ' ∪ ' },
      { label: '∩', val: ' ∩ ' },
      { label: '∅', val: ' ∅ ' },
      { label: '∀', val: ' ∀ ' },
      { label: '∃', val: ' ∃ ' },
    ],
    [
      { label: '%', val: '%' },
      { label: '!', val: '!' },
      { label: '°', val: '°' },
      { label: '→', val: ' → ' },
      { label: '⇒', val: ' ⇒ ' },
      { label: '⇔', val: ' ⇔ ' },
      { label: 'Δ', val: 'Δ' },
      { label: '∞', val: '∞' },
      { label: ',', val: ', ' },
      {
        label: <Delete className="w-4 h-4 text-slate-500 hover:text-rose-600 transition" />,
        val: '__BACKSPACE__',
      },
    ],
  ];

  // Tab: Функции (10 columns - tailored for trig, calculus, log)
  const functionsKeys: { label: React.ReactNode; val: string }[][] = [
    [
      { label: 'sin', val: 'sin(' },
      { label: 'cos', val: 'cos(' },
      { label: 'tan', val: 'tan(' },
      { label: 'cot', val: 'cot(' },
      { label: 'sec', val: 'sec(' },
      { label: 'csc', val: 'csc(' },
      { label: 'ln', val: 'ln(' },
      { label: 'log', val: 'log(' },
      { label: <span>log<sub>2</sub></span>, val: 'log2(' },
      { label: <span>log<sub>10</sub></span>, val: 'log10(' },
    ],
    [
      { label: 'arcsin', val: 'arcsin(' },
      { label: 'arccos', val: 'arccos(' },
      { label: 'arctan', val: 'arctan(' },
      { label: 'exp', val: 'exp(' },
      { label: 'abs', val: 'abs(' },
      { label: 'd/dx', val: 'd/dx(' },
      { label: '∫', val: '∫(' },
      { label: 'lim', val: 'lim(' },
      { label: 'π', val: 'π' },
      { label: 'θ', val: 'θ' },
    ],
    [
      { label: '√', val: '√(' },
      { label: '∛', val: '∛(' },
      { label: <span>x<sup>2</sup></span>, val: '²' },
      { label: <span>x<sup>n</sup></span>, val: '^' },
      { label: '(', val: '(' },
      { label: ')', val: ')' },
      { label: 'x', val: 'x' },
      { label: 'y', val: 'y' },
      { label: '=', val: ' = ' },
      {
        label: <Delete className="w-4 h-4 text-slate-500 hover:text-rose-600 transition" />,
        val: '__BACKSPACE__',
      },
    ],
  ];

  // Tab: Скобки (10 columns)
  const bracketsKeys: { label: React.ReactNode; val: string }[][] = [
    [
      { label: '(', val: '(' },
      { label: ')', val: ')' },
      { label: '[', val: '[' },
      { label: ']', val: ']' },
      { label: '{', val: '{' },
      { label: '}', val: '}' },
      { label: '|x|', val: '|' },
      { label: '⟨', val: '⟨' },
      { label: '⟩', val: '⟩' },
      { label: ';', val: '; ' },
    ],
    [
      { label: '{ }', val: '{ }' },
      { label: '[ ]', val: '[ ]' },
      { label: '( )', val: '( )' },
      { label: '+', val: ' + ' },
      { label: '−', val: ' - ' },
      { label: '×', val: ' · ' },
      { label: '÷', val: ' / ' },
      { label: '=', val: ' = ' },
      { label: ',', val: ', ' },
      { label: ':', val: ' : ' },
    ],
    [
      { label: 'x', val: 'x' },
      { label: 'y', val: 'y' },
      { label: 'z', val: 'z' },
      { label: 'a', val: 'a' },
      { label: 'b', val: 'b' },
      { label: 'c', val: 'c' },
      { label: '0', val: '0' },
      { label: '1', val: '1' },
      { label: '2', val: '2' },
      {
        label: <Delete className="w-4 h-4 text-slate-500 hover:text-rose-600 transition" />,
        val: '__BACKSPACE__',
      },
    ],
  ];

  // Tab: Греческие (10 columns)
  const greekKeys: { label: React.ReactNode; val: string }[][] = [
    [
      { label: 'α', val: 'α' },
      { label: 'β', val: 'β' },
      { label: 'γ', val: 'γ' },
      { label: 'δ', val: 'δ' },
      { label: 'ε', val: 'ε' },
      { label: 'θ', val: 'θ' },
      { label: 'λ', val: 'λ' },
      { label: 'μ', val: 'μ' },
      { label: 'π', val: 'π' },
      { label: 'σ', val: 'σ' },
    ],
    [
      { label: 'τ', val: 'τ' },
      { label: 'φ', val: 'φ' },
      { label: 'ψ', val: 'ψ' },
      { label: 'ω', val: 'ω' },
      { label: 'Δ', val: 'Δ' },
      { label: 'Γ', val: 'Γ' },
      { label: 'Θ', val: 'Θ' },
      { label: 'Λ', val: 'Λ' },
      { label: 'Σ', val: 'Σ' },
      { label: 'Ω', val: 'Ω' },
    ],
    [
      { label: 'x', val: 'x' },
      { label: 'y', val: 'y' },
      { label: '²', val: '²' },
      { label: '^', val: '^' },
      { label: '(', val: '(' },
      { label: ')', val: ')' },
      { label: '+', val: ' + ' },
      { label: '−', val: ' - ' },
      { label: '=', val: ' = ' },
      {
        label: <Delete className="w-4 h-4 text-slate-500 hover:text-rose-600 transition" />,
        val: '__BACKSPACE__',
      },
    ],
  ];

  // Tab: Математический ввод (10 columns)
  const numpadKeys: { label: React.ReactNode; val: string }[][] = [
    [
      { label: '7', val: '7' },
      { label: '8', val: '8' },
      { label: '9', val: '9' },
      { label: '+', val: ' + ' },
      { label: 'x', val: 'x' },
      { label: 'y', val: 'y' },
      { label: 'x²', val: '²' },
      { label: '√', val: '√(' },
      { label: '(', val: '(' },
      { label: ')', val: ')' },
    ],
    [
      { label: '4', val: '4' },
      { label: '5', val: '5' },
      { label: '6', val: '6' },
      { label: '−', val: ' - ' },
      { label: 'a', val: 'a' },
      { label: 'b', val: 'b' },
      { label: '^', val: '^' },
      { label: 'π', val: 'π' },
      { label: '<', val: ' < ' },
      { label: '>', val: ' > ' },
    ],
    [
      { label: '1', val: '1' },
      { label: '2', val: '2' },
      { label: '3', val: '3' },
      { label: '×', val: ' · ' },
      { label: '0', val: '0' },
      { label: '.', val: '.' },
      { label: '÷', val: ' / ' },
      { label: '=', val: ' = ' },
      { label: ';', val: '; ' },
      {
        label: <Delete className="w-4 h-4 text-slate-500 hover:text-rose-600 transition" />,
        val: '__BACKSPACE__',
      },
    ],
  ];

  const getKeys = () => {
    switch (activeTab) {
      case 'symbols':
        return symbolsKeys;
      case 'functions':
        return functionsKeys;
      case 'brackets':
        return bracketsKeys;
      case 'greek':
        return greekKeys;
      case 'numpad':
        return numpadKeys;
      case 'basic':
      default:
        return basicKeys;
    }
  };

  const handleKeyClick = (val: string) => {
    if (val === '__BACKSPACE__') {
      onBackspace();
    } else {
      onInsert(val);
    }
  };

  const currentRows = getKeys();

  return (
    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 select-none">
      {/* Keyboard Header bar with mobile collapse toggle */}
      <div className="flex items-center justify-between pb-2 mb-1">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <KeyboardIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>{t.workspace.keyboard || 'Экранная клавиатура'}</span>
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 p-1 rounded-lg cursor-pointer"
        >
          <span>{isCollapsed ? (t.workspace.showKeyboard || 'Развернуть') : (t.workspace.hideKeyboard || 'Свернуть')}</span>
          {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>
      </div>

      {!isCollapsed && (
        <div className="animate-in fade-in duration-150">
          {/* Category Tabs: clean inline badges */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2 scrollbar-none text-xs">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition cursor-pointer touch-manipulation ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-2xs font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* 10-Column Keypad Grid */}
          <div className="space-y-1 sm:space-y-2">
            {currentRows.map((row, rIdx) => (
              <div key={`row-${rIdx}`} className="grid grid-cols-10 gap-0.5 sm:gap-1.5">
                {row.map((k, cIdx) => (
                  <button
                    key={`btn-${rIdx}-${cIdx}`}
                    onClick={() => handleKeyClick(k.val)}
                    className="h-8 sm:h-11 px-0.5 sm:px-1 bg-white dark:bg-slate-800 hover:bg-blue-50/80 dark:hover:bg-slate-700 active:bg-blue-100 dark:active:bg-slate-600 border border-slate-200/90 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500 rounded-md sm:rounded-xl text-slate-800 dark:text-slate-100 font-serif text-[11px] sm:text-base flex items-center justify-center transition shadow-2xs cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 touch-manipulation active:scale-95 overflow-hidden"
                  >
                    {k.label}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
