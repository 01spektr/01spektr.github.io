import React from 'react';
import { UsefulTool } from '../types';
import { USEFUL_TOOLS } from '../data/currencies';
import {
  Briefcase,
  ArrowLeftRight,
  TrendingUp,
  SlidersHorizontal,
  Calculator,
  Bitcoin,
  Boxes,
  ChevronRight,
} from 'lucide-react';

interface ToolsListProps {
  onSelectTool: (tool: UsefulTool) => void;
  t?: any;
}

export const ToolsList: React.FC<ToolsListProps> = ({ onSelectTool, t }) => {
  const getToolIcon = (iconName: string) => {
    switch (iconName) {
      case 'converter':
        return <ArrowLeftRight className="w-4.5 h-4.5" />;
      case 'history':
        return <TrendingUp className="w-4.5 h-4.5" />;
      case 'compare':
        return <SlidersHorizontal className="w-4.5 h-4.5" />;
      case 'salary':
        return <Calculator className="w-4.5 h-4.5" />;
      case 'crypto':
        return <Bitcoin className="w-4.5 h-4.5" />;
      case 'metals':
        return <Boxes className="w-4.5 h-4.5" />;
      default:
        return <Briefcase className="w-4.5 h-4.5" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
          <Briefcase className="w-4.5 h-4.5" />
        </div>
        <h2 className="font-bold text-base text-slate-900 tracking-tight">
          {t?.tools?.title || 'Полезные инструменты'}
        </h2>
      </div>

      {/* Tools List Items */}
      <div className="space-y-1">
        {USEFUL_TOOLS.map((tool) => {
          const toolData = t?.tools?.items?.[tool.id];
          const title = toolData?.title || tool.title;
          const desc = toolData?.description || tool.description;

          return (
            <button
              key={tool.id}
              type="button"
              onClick={() => onSelectTool(tool)}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                  {getToolIcon(tool.iconName)}
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                    {title}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {desc}
                  </div>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
