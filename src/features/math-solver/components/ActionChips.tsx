import React from 'react';
import { Check } from 'lucide-react';
import { ActionChipItem } from '../types/math';
import { useLanguage } from '../context/LanguageContext';

interface ActionChipsProps {
  chips: ActionChipItem[];
  activeChipId: string;
  onSelectChip: (chip: ActionChipItem) => void;
}

export const ActionChips: React.FC<ActionChipsProps> = ({
  chips,
  activeChipId,
  onSelectChip,
}) => {
  const { t } = useLanguage();
  if (!chips || chips.length === 0) return null;

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 mt-3 scrollbar-none text-xs touch-pan-x">
      {chips.map((chip) => {
        const isActive = activeChipId === chip.id;
        const translatedLabel =
          (t as any).actionChips?.[chip.id] || chip.label;

        return (
          <button
            key={chip.id}
            onClick={() => onSelectChip(chip)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold transition cursor-pointer whitespace-nowrap shrink-0 touch-manipulation active:scale-95 ${
              isActive
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-slate-100/90 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            {isActive ? (
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            ) : chip.iconSymbol ? (
              <span className="text-slate-400 dark:text-slate-400 font-mono text-[11px]">{chip.iconSymbol}</span>
            ) : null}
            <span>{translatedLabel}</span>
          </button>
        );
      })}
    </div>
  );
};

