import React, { useState } from 'react';
import {
  ChevronRight,
  Clock,
  Heart,
  Share2,
  Check,
  Calendar,
  Zap,
  FileText,
  Calculator,
} from 'lucide-react';
import { CountryCode } from '../types/calendar';
import { useTranslation } from '../i18n/LanguageContext';

interface HeroSectionProps {
  country: CountryCode;
  year: number;
  onOpenPdfModal: () => void;
  onOpenHistory: () => void;
  onOpenFavorites: () => void;
  historyCount: number;
  savedCount: number;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  year,
  onOpenPdfModal,
  onOpenHistory,
  onOpenFavorites,
  historyCount,
  savedCount,
  isFavorite,
  onToggleFavorite,
}) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-3 pt-1">
      {/* Row 1: Breadcrumbs on Left + 3 Action Buttons on Right */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[12px] font-secondary text-[#64748B] dark:text-[#94A3B8]">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <a href="/" className="hover:text-[#0066FF] dark:hover:text-[#38BDF8] transition-colors">
            Toolboxi
          </a>
          <ChevronRight className="w-3 h-3 text-[#94A3B8] dark:text-[#64748B]" />
          <span className="text-[#334155] dark:text-[#CBD5E1] font-medium">
            {t('hero_title')}
          </span>
        </div>

        {/* 3 Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {/* Button 1: History */}
          <button
            type="button"
            onClick={onOpenHistory}
            className="bg-white dark:bg-[#151D2E] border border-[#E2E8F0] dark:border-[#232E42] hover:bg-slate-50 dark:hover:bg-[#1E293B] hover:border-[#CBD5E1] dark:hover:border-[#334155] text-[#1E293B] dark:text-[#F1F5F9] text-[11.5px] sm:text-[12px] font-primary font-medium rounded-xl px-2.5 sm:px-3 py-1 sm:py-1.5 flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5 text-[#475569] dark:text-[#94A3B8]" />
            <span>{t('btn_history')}</span>
            {historyCount > 0 && (
              <span className="bg-[#0066FF] text-white text-[9.5px] font-bold px-1.5 py-0.2 rounded-full ml-0.5 leading-none">
                {historyCount}
              </span>
            )}
          </button>

          {/* Button 2: Saved / Favorites */}
          <button
            type="button"
            onClick={onToggleFavorite || onOpenFavorites}
            className={`border rounded-xl px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11.5px] sm:text-[12px] font-primary font-medium flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer ${
              isFavorite || savedCount > 0
                ? 'bg-[#FFF1F2] dark:bg-rose-950/40 border-[#FECDD3] dark:border-rose-900/60 text-[#E11D48] dark:text-rose-400'
                : 'bg-white dark:bg-[#151D2E] border-[#E2E8F0] dark:border-[#232E42] hover:bg-slate-50 dark:hover:bg-[#1E293B] hover:border-[#CBD5E1] dark:hover:border-[#334155] text-[#1E293B] dark:text-[#F1F5F9]'
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                isFavorite || savedCount > 0
                  ? 'fill-[#E11D48] text-[#E11D48]'
                  : 'text-[#475569] dark:text-[#94A3B8]'
              }`}
            />
            <span>{t('btn_saved')}</span>
          </button>

          {/* Button 3: Share */}
          <button
            type="button"
            onClick={handleShare}
            className="bg-white dark:bg-[#151D2E] border border-[#E2E8F0] dark:border-[#232E42] hover:bg-slate-50 dark:hover:bg-[#1E293B] hover:border-[#CBD5E1] dark:hover:border-[#334155] text-[#1E293B] dark:text-[#F1F5F9] text-[11.5px] sm:text-[12px] font-primary font-medium rounded-xl px-2.5 sm:px-3 py-1 sm:py-1.5 flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            title={t('share_link')}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#16A34A] dark:text-emerald-400" />
                <span className="text-[#16A34A] dark:text-emerald-400 font-semibold">OK!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-[#475569] dark:text-[#94A3B8]" />
                <span>{t('share')}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Row 2: Hero Banner Card */}
      <div className="bg-white dark:bg-[#151D2E] border border-[#E2E8F0] dark:border-[#232E42] rounded-2xl sm:rounded-[26px] p-3.5 sm:p-6 shadow-xs flex flex-col xl:flex-row xl:items-center justify-between gap-4 sm:gap-5 transition-colors">
        {/* Left Side: Emerald Icon + Title + Description */}
        <div className="flex items-start sm:items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#00A86B] text-white flex items-center justify-center shrink-0 shadow-2xs">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
          </div>

          <div>
            <h1 className="font-primary text-[17px] sm:text-[23px] font-extrabold text-[#0F172A] dark:text-white tracking-tight leading-tight">
              {t('hero_title')}
            </h1>
            <p className="font-secondary text-[11.5px] sm:text-[13px] text-[#64748B] dark:text-[#94A3B8] mt-1 leading-relaxed max-w-[620px]">
              {t('hero_subtitle')}
            </p>
          </div>
        </div>

        {/* Right Side: 3 Feature Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 xl:flex xl:flex-nowrap items-center gap-2 w-full xl:w-auto self-start xl:self-center shrink-0">
          {/* Badge 1 */}
          <div className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-xl sm:rounded-2xl px-3 py-1.5 sm:px-3.5 sm:py-2 flex items-center gap-2.5 shadow-2xs hover:border-[#CBD5E1] dark:hover:border-[#475569] transition-colors">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#EFF6FF] dark:bg-[#1E3A8A]/40 text-[#0066FF] dark:text-[#38BDF8] flex items-center justify-center shrink-0">
              <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2] fill-[#0066FF]/20" />
            </div>
            <div>
              <span className="font-primary text-[11.5px] sm:text-[12px] font-bold text-[#0F172A] dark:text-white block leading-tight">
                {t('hero_pill_standards')}
              </span>
              <span className="font-secondary text-[10px] sm:text-[10.5px] text-[#64748B] dark:text-[#94A3B8] block mt-0.5 leading-tight">
                {year}
              </span>
            </div>
          </div>

          {/* Badge 2 */}
          <button
            type="button"
            onClick={onOpenPdfModal}
            className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] hover:border-[#BFDBFE] dark:hover:border-[#38BDF8] hover:bg-[#F8FAFC] dark:hover:bg-[#28354D] rounded-xl sm:rounded-2xl px-3 py-1.5 sm:px-3.5 sm:py-2 flex items-center gap-2.5 shadow-2xs transition-colors cursor-pointer text-left"
            title={t('btn_export_pdf')}
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#EFF6FF] dark:bg-[#1E3A8A]/40 text-[#0066FF] dark:text-[#38BDF8] flex items-center justify-center shrink-0">
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-primary text-[11.5px] sm:text-[12px] font-bold text-[#0F172A] dark:text-white block leading-tight">
                {t('btn_export_pdf')}
              </span>
              <span className="font-secondary text-[10px] sm:text-[10.5px] text-[#64748B] dark:text-[#94A3B8] block mt-0.5 leading-tight">
                {t('exp_title')}
              </span>
            </div>
          </button>

          {/* Badge 3 */}
          <div className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-xl sm:rounded-2xl px-3 py-1.5 sm:px-3.5 sm:py-2 flex items-center gap-2.5 shadow-2xs hover:border-[#CBD5E1] dark:hover:border-[#475569] transition-colors">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#EFF6FF] dark:bg-[#1E3A8A]/40 text-[#0066FF] dark:text-[#38BDF8] flex items-center justify-center shrink-0">
              <Calculator className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-primary text-[11.5px] sm:text-[12px] font-bold text-[#0F172A] dark:text-white block leading-tight">
                ISO-8601
              </span>
              <span className="font-secondary text-[10px] sm:text-[10.5px] text-[#64748B] dark:text-[#94A3B8] block mt-0.5 leading-tight">
                1960 — 2050
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
