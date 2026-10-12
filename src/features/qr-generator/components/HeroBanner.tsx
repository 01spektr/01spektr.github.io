import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight, QrCode, Star, Share2, Check, ShieldCheck, Sparkles, Smartphone } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface HeroBannerProps {
  fav: boolean;
  onToggleFav: () => void;
  onShare: () => Promise<void>;
}

export const QrHeroBanner: React.FC<HeroBannerProps> = ({
  fav,
  onToggleFav,
  onShare,
}) => {
  const { locale } = useI18n();
  const [copied, setCopied] = useState(false);

  const labels = {
    ru: {
      home: "Главная",
      category: "Дизайн и полиграфия",
      title: "Генератор QR-кодов",
      subtitle: "Создавайте стильные QR-коды для ссылок, Wi-Fi, vCard, с логотипом, рамками и мгновенным экспортом в PNG и SVG.",
      favAdd: "В избранное",
      favRemove: "В избранном",
      share: "Поделиться",
      copied: "Скопировано!",
      b1Title: "7 типов данных",
      b1Desc: "URL, Wi-Fi, vCard, SMS",
      b2Title: "Векторный SVG",
      b2Desc: "Любой размер без потерь",
      b3Title: "100% приватно",
      b3Desc: "Генерация прямо в браузере",
    },
    uz: {
      home: "Bosh sahifa",
      category: "Dizayn va poligrafiya",
      title: "QR-kod generatori",
      subtitle: "Havolalar, Wi-Fi, vCard uchun zamonaviy QR-kodlar yarating. Logotip, ramkalar va PNG/SVG formatida yuklab olish.",
      favAdd: "Tanlanganlarga",
      favRemove: "Tanlangan",
      share: "Ulashish",
      copied: "Nusxalandi!",
      b1Title: "7 xil ma’lumot turi",
      b1Desc: "URL, Wi-Fi, vCard, SMS",
      b2Title: "Vektorli SVG",
      b2Desc: "Sifati yo'qolmasdan eksport",
      b3Title: "100% maxfiy",
      b3Desc: "Brauzerda to'g'ridan-to'g'ri",
    },
    en: {
      home: "Home",
      category: "Design & print",
      title: "QR Code Generator",
      subtitle: "Generate customized QR codes for URLs, Wi-Fi, vCard, and text. Customize colors, add your logo, and export to PNG or SVG.",
      favAdd: "Bookmark",
      favRemove: "Saved",
      share: "Share",
      copied: "Copied!",
      b1Title: "7 Content Types",
      b1Desc: "URL, Wi-Fi, vCard, SMS",
      b2Title: "Vector SVG",
      b2Desc: "Scalable without quality loss",
      b3Title: "100% Private",
      b3Desc: "Runs locally in browser",
    },
  }[locale as "ru" | "uz" | "en"] || {
    home: "Home",
    category: "Design & print",
    title: "QR Code Generator",
    subtitle: "Generate customized QR codes for URLs, Wi-Fi, vCard, and text.",
    favAdd: "Bookmark",
    favRemove: "Saved",
    share: "Share",
    copied: "Copied!",
    b1Title: "7 Content Types",
    b1Desc: "URL, Wi-Fi, vCard, SMS",
    b2Title: "Vector SVG",
    b2Desc: "Scalable without quality loss",
    b3Title: "100% Private",
    b3Desc: "Runs locally in browser",
  };

  return (
    <div className="w-full mb-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <nav
          aria-label="Breadcrumb"
          className="flex min-w-0 items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400"
        >
          <Link to="/" className="hover:text-primary dark:hover:text-primary transition-colors">
            {labels.home}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <Link
            to="/categories/$id"
            params={{ id: "design-print" }}
            className="hover:text-primary dark:hover:text-primary transition-colors"
          >
            {labels.category}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate text-slate-700 dark:text-slate-200 font-medium">
            {labels.title}
          </span>
        </nav>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onToggleFav}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-900 border rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              fav
                ? "border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/30"
                : "border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            <Star className="h-3.5 w-3.5" fill={fav ? "currentColor" : "none"} />
            <span>{fav ? labels.favRemove : labels.favAdd}</span>
          </button>

          <button
            type="button"
            onClick={async () => {
              await onShare();
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Share2 className="h-3.5 w-3.5 text-slate-400" />
            )}
            <span className={copied ? "text-emerald-600 dark:text-emerald-400 font-bold" : undefined}>
              {copied ? labels.copied : labels.share}
            </span>
          </button>
        </div>
      </div>

      {/* Hero Banner Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left: Icon & Title */}
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-xs shrink-0">
              <QrCode className="w-6 h-6 stroke-[2.2]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                  {labels.title}
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
                  {labels.category}
                </span>
              </div>
              <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
                {labels.subtitle}
              </p>
            </div>
          </div>

          {/* Right: Feature Badges (3 items) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full lg:w-auto shrink-0">
            {/* Badge 1 */}
            <div className="min-w-0 bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70 rounded-xl px-2.5 sm:px-3 py-2 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Smartphone className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight truncate">
                  {labels.b1Title}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight truncate">
                  {labels.b1Desc}
                </p>
              </div>
            </div>

            {/* Badge 2 */}
            <div className="min-w-0 bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70 rounded-xl px-2.5 sm:px-3 py-2 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight truncate">
                  {labels.b2Title}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight truncate">
                  {labels.b2Desc}
                </p>
              </div>
            </div>

            {/* Badge 3 */}
            <div className="min-w-0 col-span-2 sm:col-span-1 bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70 rounded-xl px-2.5 sm:px-3 py-2 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight truncate">
                  {labels.b3Title}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight truncate">
                  {labels.b3Desc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
