import React, { useState } from "react";
import {
  HelpCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Share2,
  Gamepad2,
  Smartphone,
  Layers,
  BookOpen,
} from "lucide-react";
import { useTranslation } from "../context/LanguageContext.tsx";

export const SeoFaqSection: React.FC = () => {
  const { t, lang } = useTranslation();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const faqList = [
    { question: t("faq.q1"), answer: t("faq.a1") },
    { question: t("faq.q2"), answer: t("faq.a2") },
    { question: t("faq.q3"), answer: t("faq.a3") },
    { question: t("faq.q4"), answer: t("faq.a4") },
    { question: t("faq.q5"), answer: t("faq.a5") },
    { question: t("faq.q6"), answer: t("faq.a6") },
  ];

  return (
    <section
      id="seo-faq-guide-section"
      className="w-full mt-10 pt-8 border-t border-slate-200/90 dark:border-slate-800 flex flex-col gap-8"
    >
      {/* 1. HOW IT WORKS: 3 Clean Step Cards */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold font-heading mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === "uz" ? "Qo‘llanma" : lang === "en" ? "Guide" : "Инструкция"}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight">
            {t("faq.howItWorksTitle")}
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-inter leading-relaxed">
            {lang === "uz"
              ? "Standart matnni zamonaviy Unicode shriftlarga aylantiring va 3 oddiy qadamda nusxa oling"
              : lang === "en"
                ? "Convert standard text into stylish Unicode fonts and copy in 3 simple steps"
                : "Превратите стандартный текст в стильные Unicode-шрифты и скопируйте в 3 простых шага"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
          {/* Step 1 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col items-start gap-3 relative overflow-hidden">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold font-heading text-base">
              1
            </div>
            <div>
              <h3 className="text-sm font-bold font-heading text-slate-900 dark:text-white">
                {t("faq.step1Title")}
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-inter leading-relaxed">
                {t("faq.step1Desc")}
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col items-start gap-3 relative overflow-hidden">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold font-heading text-base">
              2
            </div>
            <div>
              <h3 className="text-sm font-bold font-heading text-slate-900 dark:text-white">
                {t("faq.step2Title")}
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-inter leading-relaxed">
                {t("faq.step2Desc")}
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col items-start gap-3 relative overflow-hidden">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold font-heading text-base">
              3
            </div>
            <div>
              <h3 className="text-sm font-bold font-heading text-slate-900 dark:text-white">
                {t("faq.step3Title")}
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-inter leading-relaxed">
                {t("faq.step3Desc")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. USE CASES: 4 Scenarios */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xs">
        <div className="mb-4 sm:mb-5">
          <h2 className="text-base sm:text-lg font-bold font-heading text-slate-900 dark:text-white">
            {lang === "uz"
              ? "Chiroyli shriftlar qayerda va nima uchun ishlatiladi?"
              : lang === "en"
                ? "Where and why are fancy fonts used?"
                : "Где и для чего используются красивые шрифты?"}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-inter mt-0.5">
            {lang === "uz"
              ? "Noodatiy belgilar va matnlarni qo‘llashning mashhur usullari"
              : lang === "en"
                ? "Popular use cases for special symbols and fancy text"
                : "Популярные способы применения необычных символов и текстов"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
            <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-2.5">
              <Share2 className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold font-heading text-slate-900 dark:text-white">
              {lang === "uz"
                ? "Instagram va TikTok bio"
                : lang === "en"
                  ? "Instagram & TikTok Bio"
                  : "Био в Instagram и TikTok"}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-inter mt-1 leading-relaxed">
              {lang === "uz"
                ? "Profil tavsifi, iqtiboslar va chaqiriqlarni chiroyli dizayn bilan ajratib ko‘rsating."
                : lang === "en"
                  ? "Highlight your profile bio, quotes, and calls-to-action with stylish text formatting."
                  : "Выделите описание вашего профиля, цитаты и призывы к действию стильным оформлением."}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2.5">
              <Gamepad2 className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold font-heading text-slate-900 dark:text-white">
              {lang === "uz"
                ? "O‘yinlar uchun niklar"
                : lang === "en"
                  ? "Gaming Nicknames"
                  : "Никнеймы для игр"}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-inter mt-1 leading-relaxed">
              {lang === "uz"
                ? "PUBG, Free Fire, CS2, Brawl Stars uchun tojlar va qanotlar bilan ajoyib nik yarating."
                : lang === "en"
                  ? "Create a cool nick for PUBG, Free Fire, CS2, Brawl Stars with crowns, wings, and badges."
                  : "Создайте крутой ник для PUBG, Free Fire, CS2, Brawl Stars с коронами, крыльями и знаками."}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
            <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-2.5">
              <Smartphone className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold font-heading text-slate-900 dark:text-white">
              Telegram & WhatsApp
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-inter mt-1 leading-relaxed">
              {lang === "uz"
                ? "Kanaldagi postlar sarlavhalari, statuslar va xabarlarni diqqatni tortadigan qiling."
                : lang === "en"
                  ? "Format channel post headers, statuses, and messages to stand out in chats."
                  : "Оформляйте заголовки постов в каналах, статусы и сообщения, делая их заметнее среди других."}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2.5">
              <Layers className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold font-heading text-slate-900 dark:text-white">
              Discord & Facebook
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-inter mt-1 leading-relaxed">
              {lang === "uz"
                ? "Serverlar, kanallar, a’zolar rollarini nomlang va chiroyli postlar qoldiring."
                : lang === "en"
                  ? "Name servers, channels, user roles, and style your timeline posts."
                  : "Называйте серверы, каналы, роли участников и оформляйте посты на личной стене."}
            </p>
          </div>
        </div>
      </div>

      {/* 3. FAQ ACCORDION: Interactive Questions & Answers */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2.5 mb-4 sm:mb-5">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold font-heading text-slate-900 dark:text-white">
              {t("faq.sectionTitle")}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-inter mt-0.5">
              {lang === "uz"
                ? "Shriftlar generatori va belgilarni ko‘rsatish bo‘yicha mashhur savollarga javoblar"
                : lang === "en"
                  ? "Answers to common questions about the font generator and Unicode display"
                  : "Ответы на популярные вопросы о работе генератора и отображении шрифтов"}
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {faqList.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div key={index} className="py-3.5 first:pt-0 last:pb-0">
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between text-left gap-3 font-heading font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span>{faq.question}</span>
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="mt-2.5 pl-5.5 text-xs text-slate-600 dark:text-slate-300 font-inter leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. SEO EXPLANATORY TEXT: Unicode & Online Font Generator */}
      <div className="bg-slate-50/80 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-2xl p-4 sm:p-6 text-xs text-slate-600 dark:text-slate-300 font-inter leading-relaxed flex flex-col gap-3">
        <div className="flex items-center gap-2 text-slate-800 dark:text-white font-heading font-bold text-sm">
          <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h3>
            {lang === "uz"
              ? "Chiroyli shriftlar va Unicode belgilari texnologiyasi haqida"
              : lang === "en"
                ? "About Fancy Fonts & Unicode Technology"
                : "О технологии красивых шрифтов и символов Unicode"}
          </h3>
        </div>
        <p>
          {lang === "uz"
            ? "Toolboxi onlayn chiroyli shriftlar generatori xalqaro Unicode standartidagi matematik va alifbo-raqamli ramzlardan foydalanadi. Oddiy matn kiritganingizda, algoritm har bir harfni mos keluvchi betakror grafik belgilar bilan almashtiradi (masalan: gotik, qo‘lyozma, qalin, teskari va hokazo)."
            : lang === "en"
              ? "Toolboxi fancy font generator uses mathematical alphanumeric symbols from the universal Unicode standard. When you type text, our system maps each character to a unique graphical glyph (such as gothic, cursive, bold, monospace, or inverted)."
              : "Онлайн-генератор красивых шрифтов Toolboxi использует технологию математических и буквенно-цифровых символов из глобального стандарта Unicode. Когда вы вводите обычный текст, наш алгоритм мгновенно сопоставляет каждый символ с соответствующим уникальным графическим знаком."}
        </p>
        <p>
          {lang === "uz"
            ? "Unicode standarti tufayli hech qanday qo‘shimcha dasturlar yoki shrift fayllarini o‘rnatish shart emas. Tayyor natijani shunchaki nusxalab oling va Instagram, Telegram, TikTok, Discord, Facebook, WhatsApp yoki sevimli o‘yiningizga joylashtiring!"
            : lang === "en"
              ? "Because of the Unicode standard, no font downloads or third-party apps are needed. Simply copy your generated styles and paste them anywhere: Instagram, Telegram, TikTok, Discord, Facebook, WhatsApp, or games!"
              : "Благодаря универсальности стандарта Unicode, эти стили не требуют установки дополнительных файлов или плагинов. Сгенерированные слова можно просто скопировать и вставить в любую социальную сеть или игровой клиент!"}
        </p>
      </div>
    </section>
  );
};
