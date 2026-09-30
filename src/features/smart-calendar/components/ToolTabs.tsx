import React from 'react';
import {
  Calendar,
  Briefcase,
  CalendarPlus,
  Clock,
  Sparkles,
  Layers,
  Watch,
  GitCompare,
} from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';

export type ToolTabId =
  | 'calendar'
  | 'work_days'
  | 'add_days'
  | 'deadline'
  | 'holidays'
  | 'weeks'
  | 'work_hours'
  | 'date_diff';

interface ToolTabsProps {
  activeTab: ToolTabId;
  onSelectTab: (tab: ToolTabId) => void;
}

export const ToolTabs: React.FC<ToolTabsProps> = ({ activeTab, onSelectTab }) => {
  const { t } = useTranslation();

  const tabs: {
    id: ToolTabId;
    icon: React.ElementType;
    title: string;
    subtitle: string;
  }[] = [
    {
      id: 'calendar',
      icon: Calendar,
      title: t('tab_calendar'),
      subtitle: '1960 — 2050',
    },
    {
      id: 'work_days',
      icon: Briefcase,
      title: t('tab_work_days'),
      subtitle: t('wd_work_days'),
    },
    {
      id: 'add_days',
      icon: CalendarPlus,
      title: t('tab_add_days'),
      subtitle: '+ / -',
    },
    {
      id: 'deadline',
      icon: Clock,
      title: t('tab_deadline'),
      subtitle: t('dl_result_deadline'),
    },
    {
      id: 'holidays',
      icon: Sparkles,
      title: t('tab_holidays'),
      subtitle: t('hc_filter_all'),
    },
    {
      id: 'weeks',
      icon: Layers,
      title: t('tab_weeks'),
      subtitle: 'ISO-8601',
    },
    {
      id: 'work_hours',
      icon: Watch,
      title: t('tab_work_hours'),
      subtitle: t('wh_col_h40'),
    },
    {
      id: 'date_diff',
      icon: GitCompare,
      title: t('tab_date_diff'),
      subtitle: t('dd_total_difference'),
    },
  ];

  return (
    <div className="w-full overflow-x-auto pb-1 scrollbar-none">
      <div className="flex items-center gap-1.5 min-w-max">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-left transition-all cursor-pointer select-none border ${
                isActive
                  ? 'bg-[#0066FF] border-[#0066FF] text-white shadow-xs'
                  : 'bg-white dark:bg-[#151D2E] border-[#E2E8F0] dark:border-[#232E42] hover:border-[#CBD5E1] dark:hover:border-[#334155] hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B]'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-[#EFF6FF] dark:bg-[#1E3A8A]/40 text-[#0066FF] dark:text-[#38BDF8]'
                }`}
              >
                <Icon className="w-3.5 h-3.5 stroke-[2.2]" />
              </div>
              <div className="pr-0.5">
                <div
                  className={`font-primary text-[11px] font-bold leading-tight ${
                    isActive ? 'text-white' : 'text-[#0F172A] dark:text-[#F1F5F9]'
                  }`}
                >
                  {tab.title}
                </div>
                <div
                  className={`font-secondary text-[9.5px] mt-0.5 whitespace-nowrap ${
                    isActive ? 'text-blue-100' : 'text-[#64748B] dark:text-[#94A3B8]'
                  }`}
                >
                  {tab.subtitle}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
