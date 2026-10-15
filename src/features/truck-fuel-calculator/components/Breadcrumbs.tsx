import React from 'react';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbsProps {
  t: {
    home: string;
    category: string;
    subcategory: string;
    current: string;
  };
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ t }) => {
  return (
    <nav className="flex items-center text-xs text-slate-500 dark:text-slate-400 py-3 overflow-x-auto whitespace-nowrap transition-colors">
      <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
        {t.home}
      </a>
      <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-slate-400 dark:text-slate-600 shrink-0" />
      <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
        {t.category}
      </a>
      <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-slate-400 dark:text-slate-600 shrink-0" />
      <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
        {t.subcategory}
      </a>
      <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-slate-400 dark:text-slate-600 shrink-0" />
      <span className="text-slate-700 dark:text-slate-200 font-medium truncate">
        {t.current}
      </span>
    </nav>
  );
};
