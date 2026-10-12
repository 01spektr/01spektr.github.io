import React, { useState } from "react";
import {
  MessageSquare,
  BookOpen,
  FileCheck,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface FAQItem {
  q: string;
  a: string;
}

export const BarcodeBottomCards: React.FC = () => {
  const { locale } = useI18n();
  const en = locale === "en";
  const uz = locale === "uz";

  // Independent open/close states for each of the 3 cards
  const [openFaq, setOpenFaq] = useState(false);
  const [openGuide, setOpenGuide] = useState(false);
  const [openCommercial, setOpenCommercial] = useState(false);

  // Active accordion question in FAQ (0 = first question open by default when card is expanded)
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(0);

  const labels = {
    ru: {
      headerTitle: "Справочные материалы и руководство",
      headerSubtitle: "Стандарты GS1, проверка данных и экспорт",
      card1Title: "Частые вопросы (FAQ)",
      card1Subtitle: "Контрольные суммы, форматы и печать",
      card2Title: "Руководство пользователя",
      card2Subtitle: "3 простых шага для создания штрихкода",
      card3Title: "Коммерческое использование",
      card3Subtitle: "Маркетплейсы, торговля и лицензии",
      faqs: [
        {
          q: "Как рассчитывается контрольная цифра в EAN-13 и EAN-8?",
          a: "Последняя цифра в стандартах EAN вычисляется по алгоритму Modulo-10: чётные позиции умножаются на 3, нечётные на 1, а результат дополняется до кратного 10. Наш генератор рассчитывает и проверяет её автоматически прямо на лету.",
        },
        {
          q: "В чём разница между Code 128 и Code 39?",
          a: "Code 128 — современный высокоплотный штрихкод, поддерживающий абсолютно любые символы таблицы ASCII (латиницу, цифры, спецзнаки). Code 39 проще и надежнее считывается старыми сканерами, но кодирует только заглавные буквы и цифры, занимая больше места.",
        },
        {
          q: "Какой формат выбрать для типографии и этикеток?",
          a: "Для печати в типографии или на этикеточных термопринтерах используйте векторные форматы SVG или PDF. Они масштабируются без потери качества. Если нужен растровый файл (PNG), выбирайте разрешение 600 или 1200 DPI в меню кнопки скачивания.",
        },
        {
          q: "Зачем нужна «Тихая зона» (Quiet Zone)?",
          a: "Quiet zone — это белые поля по бокам от штрихкода. Они строго обязательны по стандарту ISO/IEC: без них оптический лазерный или 2D-сканер не сможет отделить штрихкод от окружающего дизайна упаковки.",
        },
      ],
      guideSteps: [
        {
          title: "1. Выберите формат",
          desc: "Для розничных товаров супермаркетов — EAN-13 или EAN-8. Для складских коробок и паллет — ITF-14. Для логистики и артикулов — Code 128.",
        },
        {
          title: "2. Введите данные",
          desc: "Введите цифры или символы. Система проверит формат, подскажет ограничения и при необходимости скорректирует контрольную цифру.",
        },
        {
          title: "3. Настройте размер и скачайте",
          desc: "Укажите нужный размер и цвет, выберите формат (PNG, векторный SVG или PDF для печати) и нажмите «Скачать» или скопируйте в буфер.",
        },
      ],
      commercialPoints: [
        {
          title: "Бесплатно и без ограничений",
          desc: "Генератор можно свободно использовать для внутренних артикулов, учёта на складах, типографий и маркетплейсов (Uzum, Wildberries, Ozon).",
        },
        {
          title: "Официальные префиксы GS1",
          desc: "Для официальной продажи товаров в международных торговых сетях требуется получить уникальный номер в национальной организации GS1 (GS1 Uzbekistan).",
        },
        {
          title: "100% конфиденциальность",
          desc: "Все штрихкоды создаются исключительно на вашем компьютере. Данные артикулов и кодов не сохраняются и не передаются на сервер.",
        },
      ],
    },
    uz: {
      headerTitle: "Ma’lumotlar va qo‘llanma",
      headerSubtitle: "GS1 standartlari, tekshiruv va eksport",
      card1Title: "Ko‘p so‘raladigan savollar (FAQ)",
      card1Subtitle: "Nazorat soni, formatlar va chop etish",
      card2Title: "Foydalanuvchi qo‘llanmasi",
      card2Subtitle: "Shtrix-kod yaratishning 3 oson bosqichi",
      card3Title: "Tijoriy maqsadda foydalanish",
      card3Subtitle: "Marketpleyslar, savdo va litsenziyalar",
      faqs: [
        {
          q: "EAN-13 va EAN-8 formatlarida nazorat soni qanday hisoblanadi?",
          a: "EAN standartlaridagi oxirgi raqam Modulo-10 algoritmi bo‘yicha hisoblanadi: juft o‘rindagi raqamlar 3 ga, toq o‘rindagi raqamlar 1 ga ko‘paytiriladi. Generatorimiz buni avtomatik tarzda to‘g‘ri hisoblab beradi.",
        },
        {
          q: "Code 128 va Code 39 orasidagi farq nima?",
          a: "Code 128 ixchamroq va barcha ASCII belgilarini (harflar, sonlar, belgilar) qo‘llab-quvvatlaydi. Code 39 esa faqat katta harflar va sonlarni qabul qiladi.",
        },
        {
          q: "Bosmaxona va etiketkalar uchun qaysi format yaxshiroq?",
          a: "Bosmaxonada chop etish uchun SVG yoki PDF vektor formatlarini tanlang. Ular o‘lcham kattalashganda sifatini yo‘qotmaydi. PNG uchun esa 600 yoki 1200 DPI tavsiya etiladi.",
        },
        {
          q: "Chetki oq maydon (Quiet Zone) nima uchun kerak?",
          a: "Shtrix-kodning ikki tomonidagi bo‘sh oq joy skanerga kod boshlanganini va tugaganini aniqlash imkonini beradi. Standart bo‘yicha bu maydon bo‘lishi shart.",
        },
      ],
      guideSteps: [
        {
          title: "1. Formatni tanlang",
          desc: "Do‘kon mollari uchun — EAN-13 yoki EAN-8. Katta qutilar uchun — ITF-14. Logistika va mahsulot artikuli uchun — Code 128.",
        },
        {
          title: "2. Ma’lumotlarni kiriting",
          desc: "Raqamlarni kiriting. Tizim avtomatik tekshirib, nazorat raqamini to‘g‘rilaydi.",
        },
        {
          title: "3. O‘lchamni moslang va yuklab oling",
          desc: "PNG, vektorli SVG yoki PDF formatini tanlab yuklab oling yoki buferga nusxalang.",
        },
      ],
      commercialPoints: [
        {
          title: "Mutlaqo bepul",
          desc: "Ichki hisob, omborxona va Uzum Market kabi marketpleyslar uchun cheklovlarsiz ishlatishingiz mumkin.",
        },
        {
          title: "Rasmiy GS1 prefikslari",
          desc: "Xalqaro supermarketlarda rasmiy sotish uchun GS1 tashkilotidan ro‘yxatdan o‘tish kerak.",
        },
        {
          title: "100% xavfsiz va lokal",
          desc: "Barcha hisob-kitoblar brauzeringizda bajariladi va serverga yuborilmaydi.",
        },
      ],
    },
    en: {
      headerTitle: "Reference Guides & Documentation",
      headerSubtitle: "GS1 standards, verification & export",
      card1Title: "Frequently Asked Questions (FAQ)",
      card1Subtitle: "Checksums, formats and printing",
      card2Title: "User Guide",
      card2Subtitle: "3 easy steps to generate a barcode",
      card3Title: "Commercial & Business Use",
      card3Subtitle: "Retail, marketplaces and licensing",
      faqs: [
        {
          q: "How is the EAN-13 check digit calculated?",
          a: "The final check digit is computed using the Modulo-10 algorithm. Our generator verifies and corrects the checksum automatically.",
        },
        {
          q: "What is the difference between Code 128 and Code 39?",
          a: "Code 128 is high-density and supports all 128 ASCII characters. Code 39 encodes uppercase alphanumeric characters only.",
        },
        {
          q: "Which format should I download for professional printing?",
          a: "For packaging and labels, always use vector formats: SVG or PDF. For raster image needs, select 600 or 1200 DPI PNG.",
        },
        {
          q: "Why is the Quiet Zone necessary?",
          a: "The quiet zone provides clear margins on both sides so barcode scanners can distinguish the bars from background packaging.",
        },
      ],
      guideSteps: [
        {
          title: "1. Select Format",
          desc: "Choose EAN-13/8 for retail, ITF-14 for master cartons, or Code 128 for shipping and inventory.",
        },
        {
          title: "2. Input Barcode Data",
          desc: "Enter your digits or text. The system automatically calculates GS1 checksum digits.",
        },
        {
          title: "3. Customize & Export",
          desc: "Choose colors, quiet zone, and format (PNG, SVG, PDF), then click Download.",
        },
      ],
      commercialPoints: [
        {
          title: "100% Free for Business",
          desc: "Free to use for internal tracking, packaging, warehouses, and online marketplaces.",
        },
        {
          title: "GS1 Company Prefix",
          desc: "Open retail supply chains require a registered barcode number from your national GS1 organization.",
        },
        {
          title: "Private & Client-Side",
          desc: "Everything runs locally in your browser. No barcode numbers are uploaded or stored.",
        },
      ],
    },
  }[locale] || {
    headerTitle: "Reference Guides & Documentation",
    headerSubtitle: "GS1 standards & export",
    card1Title: "Frequently Asked Questions",
    card1Subtitle: "Checksums & formats",
    card2Title: "User Guide",
    card2Subtitle: "How to use",
    card3Title: "Commercial Use",
    card3Subtitle: "Marketplaces & licenses",
    faqs: [],
    guideSteps: [],
    commercialPoints: [],
  };

  return (
    <div className="w-full mt-6">
      <div className="mb-3 px-0.5 flex items-center justify-between">
        <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {labels.headerTitle}
        </h3>
        <span className="text-[11px] text-slate-400 dark:text-slate-500 font-body">
          {labels.headerSubtitle}
        </span>
      </div>

      {/* Grid with items-start so each card maintains independent height */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        {/* Card 1: Частые вопросы (FAQ с аккордеоном) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/85 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs transition-colors">
          <button
            type="button"
            onClick={() => setOpenFaq(!openFaq)}
            className="w-full flex items-center justify-between text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-heading text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {labels.card1Title}
                </h4>
                <p className="font-body text-[11px] text-slate-400 dark:text-slate-500">
                  {labels.card1Subtitle}
                </p>
              </div>
            </div>
            <div className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  openFaq ? "rotate-180 text-blue-600 dark:text-blue-400" : ""
                }`}
              />
            </div>
          </button>

          {openFaq && (
            <div className="mt-3.5 pt-3.5 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs animate-in fade-in duration-150">
              {labels.faqs.map((item, idx) => {
                const isOpen = activeFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-800/40 transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveFaqIndex(isOpen ? null : idx)}
                      className="w-full p-2.5 text-left flex items-start justify-between gap-2 hover:bg-slate-100/70 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <span className="font-heading font-semibold text-slate-800 dark:text-slate-200 text-[11px] leading-snug">
                        {item.q}
                      </span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5 transition-transform duration-150 ${
                          isOpen ? "rotate-180 text-blue-600 dark:text-blue-400" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-3 pb-3 text-[11px] text-slate-700 dark:text-slate-300 font-body leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-2 bg-white dark:bg-slate-900/80">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Card 2: Руководство пользователя */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/85 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs transition-colors">
          <button
            type="button"
            onClick={() => setOpenGuide(!openGuide)}
            className="w-full flex items-center justify-between text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-heading text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {labels.card2Title}
                </h4>
                <p className="font-body text-[11px] text-slate-400 dark:text-slate-500">
                  {labels.card2Subtitle}
                </p>
              </div>
            </div>
            <div className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  openGuide ? "rotate-180 text-indigo-600 dark:text-indigo-400" : ""
                }`}
              />
            </div>
          </button>

          {openGuide && (
            <div className="mt-3.5 pt-3.5 border-t border-slate-100 dark:border-slate-800 space-y-2.5 text-xs animate-in fade-in duration-150">
              {labels.guideSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50/70 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800"
                >
                  <p className="font-heading font-bold text-slate-800 dark:text-slate-200 text-[11px] mb-0.5">
                    {step.title}
                  </p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-body">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Card 3: Коммерческое использование */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/85 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs transition-colors">
          <button
            type="button"
            onClick={() => setOpenCommercial(!openCommercial)}
            className="w-full flex items-center justify-between text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <FileCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-heading text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {labels.card3Title}
                </h4>
                <p className="font-body text-[11px] text-slate-400 dark:text-slate-500">
                  {labels.card3Subtitle}
                </p>
              </div>
            </div>
            <div className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  openCommercial ? "rotate-180 text-emerald-600 dark:text-emerald-400" : ""
                }`}
              />
            </div>
          </button>

          {openCommercial && (
            <div className="mt-3.5 pt-3.5 border-t border-slate-100 dark:border-slate-800 space-y-2.5 text-xs animate-in fade-in duration-150">
              {labels.commercialPoints.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50/70 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 flex items-start gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-heading font-bold text-slate-800 dark:text-slate-200 text-[11px]">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-body mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
