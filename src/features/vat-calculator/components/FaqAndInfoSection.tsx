import React, { useState } from 'react';
import {
  Info,
  BookOpen,
  Lightbulb,
  ChevronDown,
  CheckCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FaqAndInfoSection: React.FC = () => {
  const { t } = useApp();
  const [isInfoOpen, setIsInfoOpen] = useState(true);
  const [isFaqOpen, setIsFaqOpen] = useState(true);
  const [isTipsOpen, setIsTipsOpen] = useState(true);

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  const helpfulItems = (t('info.helpfulItems') as { bold: string; text: string }[]) || [];
  const faqItems = (t('info.faqItems') as { question: string; answer: string }[]) || [];
  const tipsItems = (t('info.tipsItems') as { title: string; text: string }[]) || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start mt-6">
      {/* 1. Полезная информация / Useful Info */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs overflow-hidden transition-all duration-200">
        <button
          type="button"
          onClick={() => setIsInfoOpen(!isInfoOpen)}
          className="w-full flex items-center justify-between p-4 sm:p-4.5 text-left hover:bg-slate-50/80 dark:hover:bg-slate-800/80 transition-colors group cursor-pointer"
        >
          <div className="flex items-center gap-2.5 min-w-0 pr-2">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                isInfoOpen
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/60'
              }`}
            >
              <Info className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white font-montserrat truncate">
                {t('info.helpfulTitle')}
              </h2>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-inter truncate">
                VAT, GST, Sales Tax
              </div>
            </div>
          </div>

          <div
            className={`w-6 h-6 rounded-lg flex items-center justify-center border shrink-0 transition-all ml-2 ${
              isInfoOpen
                ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
            }`}
          >
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                isInfoOpen ? 'rotate-180' : 'rotate-0'
              }`}
            />
          </div>
        </button>

        {isInfoOpen && (
          <div className="px-4.5 pb-4.5 pt-1 border-t border-slate-100 dark:border-slate-800 animate-in fade-in duration-200">
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 font-inter">
              {helpfulItems.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 mt-1.5 shrink-0" />
                  <span>
                    <strong className="text-slate-800 dark:text-slate-100 font-montserrat">{item.bold} </strong>
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 2. Частые вопросы (FAQ) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs overflow-hidden transition-all duration-200">
        <button
          type="button"
          onClick={() => setIsFaqOpen(!isFaqOpen)}
          className="w-full flex items-center justify-between p-4 sm:p-4.5 text-left hover:bg-slate-50/80 dark:hover:bg-slate-800/80 transition-colors group cursor-pointer"
        >
          <div className="flex items-center gap-2.5 min-w-0 pr-2">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                isFaqOpen
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white font-montserrat truncate">
                {t('info.faqTitle')}
              </h2>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-inter truncate">
                {faqItems.length} Q&A
              </div>
            </div>
          </div>

          <div
            className={`w-6 h-6 rounded-lg flex items-center justify-center border shrink-0 transition-all ml-2 ${
              isFaqOpen
                ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
            }`}
          >
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                isFaqOpen ? 'rotate-180' : 'rotate-0'
              }`}
            />
          </div>
        </button>

        {isFaqOpen && (
          <div className="px-4.5 pb-4.5 pt-1 border-t border-slate-100 dark:border-slate-800 space-y-2 animate-in fade-in duration-200">
            {faqItems.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-200/80 dark:border-slate-700 rounded-xl overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={(e) => toggleFaq(idx, e)}
                    className="w-full flex items-center justify-between p-2.5 sm:p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 font-montserrat pr-2">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-400 shrink-0 ml-2 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-3 pb-3 pt-0 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-inter bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Советы / Tips */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs overflow-hidden transition-all duration-200">
        <button
          type="button"
          onClick={() => setIsTipsOpen(!isTipsOpen)}
          className="w-full flex items-center justify-between p-4 sm:p-4.5 text-left hover:bg-slate-50/80 dark:hover:bg-slate-800/80 transition-colors group cursor-pointer"
        >
          <div className="flex items-center gap-2.5 min-w-0 pr-2">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                isTipsOpen
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/60'
              }`}
            >
              <Lightbulb className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white font-montserrat truncate">
                {t('info.tipsTitle')}
              </h2>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-inter truncate">
                Best practices
              </div>
            </div>
          </div>

          <div
            className={`w-6 h-6 rounded-lg flex items-center justify-center border shrink-0 transition-all ml-2 ${
              isTipsOpen
                ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
            }`}
          >
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                isTipsOpen ? 'rotate-180' : 'rotate-0'
              }`}
            />
          </div>
        </button>

        {isTipsOpen && (
          <div className="px-4.5 pb-4.5 pt-1 border-t border-slate-100 dark:border-slate-800 animate-in fade-in duration-200">
            <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 font-inter">
              {tipsItems.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-800 dark:text-slate-100 font-montserrat">{tip.title} </strong>
                    {tip.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

