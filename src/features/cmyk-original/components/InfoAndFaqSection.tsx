import React, { useState } from "react";
import { FileText, Lightbulb, MessageSquare, Check, ChevronDown } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    question: "Почему цвета в RGB и CMYK отличаются?",
    answer:
      "RGB — это аддитивная цветовая модель излучаемого света (мониторы, смартфоны), где смешение даёт белый. CMYK — субтрактивная модель отражённого света печатных красок (Cyan, Magenta, Yellow, Key/Black). Цветовой охват CMYK меньше, поэтому ультра-яркие цвета монитора (неоновые синие, едкие зелёные) при печати выглядят более сдержанными.",
  },
  {
    question: "Можно ли получить точное совпадение цвета?",
    answer:
      "Для достижения максимального совпадения используются стандартизированные веера смесевых красок PANTONE® (PMS) или заказывается контрактная цветопроба (proof) на том же типе бумаги и профиле (ISO Coated v2 / FOGRA39), на котором будет производиться тираж.",
  },
  {
    question: "Какой профиль CMYK используется?",
    answer:
      "Алгоритм выполняет пересчёт по стандарту ISO Coated v2 (FOGRA39) для мелованной бумаги и PSO Uncoated (FOGRA47) для немелованной бумаги, с контролем суммы красок (Total Ink Coverage до 300%).",
  },
  {
    question: "Подходит ли этот инструмент для печати?",
    answer:
      "Да! Вы можете сразу скопировать процентные соотношения CMYK для Adobe Illustrator, InDesign или CorelDRAW, а также скачать векторные файлы PDF со спецификацией, SVG и EPS для отправки в типографию.",
  },
  {
    question: "Можно ли конвертировать несколько цветов сразу?",
    answer:
      "Да, вы можете использовать быстрые цвета, подбирать оттенки в гармонической палитре или экспортировать полную спецификацию с подобранным цветом Pantone.",
  },
];

const FAQ_DATA_EN: FaqItem[] = [
  {
    question: "Why do RGB and CMYK colours differ?",
    answer:
      "RGB mixes emitted light on screens, while CMYK uses reflected printing inks. CMYK has a smaller colour gamut, so highly saturated screen colours can look more restrained in print.",
  },
  {
    question: "Can I get an exact colour match?",
    answer:
      "For the closest result, use PANTONE® spot-colour guides or a contract proof on the same paper and profile that will be used for the print run.",
  },
  {
    question: "Which CMYK profile is used?",
    answer:
      "The conversion uses ISO Coated v2 (FOGRA39) for coated paper and PSO Uncoated (FOGRA47) for uncoated paper, with total ink coverage monitoring.",
  },
  {
    question: "Is this tool suitable for print?",
    answer:
      "Yes. You can copy CMYK percentages or download PDF, SVG and EPS specifications for Illustrator, InDesign, CorelDRAW and print production.",
  },
  {
    question: "Can I convert several colours?",
    answer:
      "Yes. Use quick colours, explore the harmonic palette, or export a full specification with a suggested Pantone match.",
  },
];

export const InfoAndFaqSection: React.FC = () => {
  const { locale } = useI18n();
  const en = locale === "en";
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [openSections, setOpenSections] = useState({ how: false, tips: false, faq: false });
  const toggleSection = (section: "how" | "tips" | "faq") => {
    setOpenSections((current) => ({ ...current, [section]: !current[section] }));
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="mt-4 grid grid-cols-1 items-start gap-4 md:grid-cols-3">
      {/* 1. Как это работает? */}
      <div
        id="how-it-works-card"
        className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6"
      >
        <button
          type="button"
          onClick={() => toggleSection("how")}
          className="flex w-full items-center gap-2.5 text-left"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            {en ? "How it works" : "Как это работает?"}
          </h3>
          <ChevronDown
            className={`ml-auto h-4 w-4 text-slate-400 transition-transform ${openSections.how ? "rotate-180" : ""}`}
          />
        </button>

        {openSections.how && (
          <div className="mt-4 space-y-3.5">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                1
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-snug">
                {en
                  ? "Enter a colour in RGB, HEX or HSL."
                  : "Введите цвет в формате RGB, HEX или HSL."}
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                2
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-snug">
                {en
                  ? "We convert it to CMYK automatically."
                  : "Мы автоматически конвертируем его в CMYK."}
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                3
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-snug">
                {en
                  ? "Use the result in your print layouts."
                  : "Используйте результат в своих макетах для печати."}
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                4
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-snug">
                {en
                  ? "Check how the colour looks on screen and in print."
                  : "Проверьте, как цвет выглядит на экране и в печати."}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 2. Полезные советы */}
      <div
        id="tips-card"
        className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6"
      >
        <button
          type="button"
          onClick={() => toggleSection("tips")}
          className="flex w-full items-center gap-2.5 text-left"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Lightbulb className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            {en ? "Useful tips" : "Полезные советы"}
          </h3>
          <ChevronDown
            className={`ml-auto h-4 w-4 text-slate-400 transition-transform ${openSections.tips ? "rotate-180" : ""}`}
          />
        </button>

        {openSections.tips && (
          <div className="mt-4 space-y-3.5">
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-snug">
                {en
                  ? "Consider the paper type: coated or uncoated."
                  : "Учитывайте тип бумаги (мелованная, немелованная)."}
              </p>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-snug">
                {en
                  ? "Colours can vary slightly by printer."
                  : "Цвета могут немного отличаться в зависимости от принтера."}
              </p>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-snug">
                {en
                  ? "Use a proof for saturated colours."
                  : "Для насыщенных цветов используйте цветопробу."}
              </p>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-snug">
                {en
                  ? "Save CMYK values in your layout for accurate printing."
                  : "Сохраняйте CMYK-значения в макете для точной печати."}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 3. Частые вопросы (FAQ Accordion) */}
      <div
        id="faq-card"
        className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6"
      >
        <button
          type="button"
          onClick={() => toggleSection("faq")}
          className="flex w-full items-center gap-2.5 text-left"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <MessageSquare className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            {en ? "Frequently asked questions" : "Частые вопросы"}
          </h3>
          <ChevronDown
            className={`ml-auto h-4 w-4 text-slate-400 transition-transform ${openSections.faq ? "rotate-180" : ""}`}
          />
        </button>

        {openSections.faq && (
          <div className="mt-4 divide-y divide-slate-100">
            {(en ? FAQ_DATA_EN : FAQ_DATA).map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="py-2.5 first:pt-0 last:pb-0">
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left flex items-center justify-between gap-2 text-xs sm:text-sm font-medium text-slate-800 hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    <span className="leading-snug">{item.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-blue-600" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="mt-2 text-xs text-slate-500 leading-relaxed pl-1 animate-fadeIn">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
