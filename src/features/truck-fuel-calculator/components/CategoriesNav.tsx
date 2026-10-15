import React from 'react';
import {
  Calculator,
  Image as ImageIcon,
  QrCode,
  Truck,
  Code2,
  Landmark,
  Home,
  Clock,
  LayoutGrid,
} from 'lucide-react';

interface CategoriesNavProps {
  activeCategory?: string;
  onSelectCategory?: (category: string) => void;
  t: {
    math: string;
    design: string;
    qr: string;
    logistics: string;
    dev: string;
    finance: string;
    construction: string;
    datetime: string;
    all: string;
  };
}

export const CategoriesNav: React.FC<CategoriesNavProps> = ({
  activeCategory = 'logistics',
  onSelectCategory,
  t,
}) => {
  const categories = [
    { id: 'math', label: t.math, icon: Calculator },
    { id: 'design', label: t.design, icon: ImageIcon },
    { id: 'qr', label: t.qr, icon: QrCode },
    { id: 'logistics', label: t.logistics, icon: Truck, active: true },
    { id: 'dev', label: t.dev, icon: Code2 },
    { id: 'finance', label: t.finance, icon: Landmark },
    { id: 'construction', label: t.construction, icon: Home },
    { id: 'datetime', label: t.datetime, icon: Clock },
    { id: 'all', label: t.all, icon: LayoutGrid },
  ];

  return (
    <div className="w-full bg-slate-50/70 dark:bg-slate-900/80 border-b border-slate-200/60 dark:border-slate-800 py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-0.5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = cat.id === activeCategory;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory?.(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs shadow-blue-500/25 ring-1 ring-blue-600'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
