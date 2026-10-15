import React, { useState } from 'react';
import {
  Info,
  HelpCircle,
  Lightbulb,
  ChevronDown,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { MathView } from './MathView';

interface MathBottomCardsProps {
  onOpenFeedback: () => void;
}

export const MathBottomCards: React.FC<MathBottomCardsProps> = ({
  onOpenFeedback,
}) => {
  const { lang } = useLanguage();

  // Independent open/close states for each of the 3 cards
  const [openInfo, setOpenInfo] = useState(false);
  const [openFaq, setOpenFaq] = useState(false);
  const [openTips, setOpenTips] = useState(false);

  // Active accordion item for FAQ (0 = first question open by default when card expanded)
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(0);

  const t = {
    ru: {
      card1Title: 'Справочник формул и правил',
      card1Sub: 'ФСУ, свойства степеней, таблица производных',
      card1BoxTitle: 'Формулы сокращённого умножения (ФСУ)',
      card1P1Title: 'Квадратные уравнения и теорема Виета',
      card1P1Text:
        'Для уравнения ax² + bx + c = 0 дискриминант D = b² - 4ac. При D > 0 корни x₁,₂ = (-b ± √D) / (2a). По теореме Виета x₁ + x₂ = -b/a, x₁ · x₂ = c/a.',
      card1P2Title: 'Свойства логарифмов и степеней',
      card1P2Text:
        'log_a(x · y) = log_a(x) + log_a(y); log_a(x / y) = log_a(x) - log_a(y); log_a(x^k) = k · log_a(x); a^(m+n) = a^m · a^n.',
      card1P3Title: 'Основные производные и интегралы',
      card1P3Text:
        '(x^n)\' = n·x^(n-1); (sin x)\' = cos x; (cos x)\' = -sin x; (e^x)\' = e^x; ∫x^n dx = (x^(n+1))/(n+1) + C.',

      card2Title: 'Частые вопросы (FAQ)',
      card2Sub: 'Синтаксис ввода, точность и оффлайн режим',
      faqList: [
        {
          q: 'Как правильно вводить степени, дроби и корни?',
          a: 'Степени вводятся через символ ^ или кликом на x² в виртуальной клавиатуре: например, x^2 - 4 = 0. Дроби вводятся через слэш /: (x + 1)/(x - 2). Для квадратного корня используйте sqrt(x) или кнопку √ на панели.',
        },
        {
          q: 'Поддерживаются ли комплексные числа и иррациональные корни?',
          a: 'Да. Если дискриминант квадратного уравнения отрицателен (D < 0), калькулятор автоматически вычисляет комплексные корни с мнимой единицей i: x = α ± βi. Иррациональные корни представляются как в точной форме с радикалами, так и с десятичным округлением.',
        },
        {
          q: 'Как вычисляются производные и интегралы?',
          a: 'Символьный алгоритм применяет аналитические правила дифференцирования (производная суммы, произведения, частного, цепное правило) и таблицу неопределённых интегралов с подробным описанием каждого шага.',
        },
        {
          q: 'Работает ли калькулятор без интернета?',
          a: 'Да! Все алгоритмы математического решателя и рендеринг LaTeX формул KaTeX выполняются локально в вашем браузере. Вычисления работают мгновенно и без отправки конфиденциальных данных на сервер.',
        },
        {
          q: 'Можно ли распечатать пошаговое решение или сохранить в PDF?',
          a: 'Да, нажмите кнопку «Скачать PDF / Печать» в блоке решения. Будет сформирован чистый официальный лист Toolboxi.uz с условием, графиком и пошаговыми выкладками для печати или отправки преподавателю.',
        },
      ],

      card3Title: 'Советы по решению задач',
      card3Sub: 'Рекомендации для школьников и студентов',
      tips: [
        {
          title: 'Всегда проверяйте ОДЗ (область допустимых значений)',
          text: 'При решении рациональных уравнений и дробей знаменатель не должен равняться нулю. Логарифмируемое выражение обязано быть строго больше нуля.',
        },
        {
          title: 'Используйте факторизацию перед раскрытием скобок',
          text: 'Разложение на множители (вынесение за скобки, группировка, ФСУ) позволяет моментально находить корни многочленов без громоздких вычислений.',
        },
        {
          title: 'Сверяйте графическую интерпретацию',
          text: 'Вкладка «График 2D» наглядно показывает точки пересечения с осями X и Y, вершины параболы и интервалы знакопостоянства функции.',
        },
        {
          title: 'Проверяйте корни обратной подстановкой',
          text: 'В разделе «Проверка решений» подставьте найденный x обратно в исходное уравнение, чтобы исключить посторонние корни.',
        },
      ],

      feedbackTitle: 'Помогите сделать математический решатель лучше',
      feedbackDesc: 'Предложите новую тему, вид уравнений или сообщите о неточности.',
      feedbackBtn: 'Написать нам',
    },
    uz: {
      card1Title: 'Formulalar va qoidalar ma’lumotnomasi',
      card1Sub: 'Qisqa ko‘paytirish formulalari, hosilalar jadvali',
      card1BoxTitle: 'Qisqa ko‘paytirish formulalari (QKF)',
      card1P1Title: 'Kvadrat tenglamalar va Viyet teoremasi',
      card1P1Text:
        'ax² + bx + c = 0 uchun D = b² - 4ac. D > 0 bo‘lganda ildizlar x₁,₂ = (-b ± √D) / (2a). Viyet teoremasi bo‘yicha: x₁ + x₂ = -b/a, x₁ · x₂ = c/a.',
      card1P2Title: 'Logarifm va daraja xossalari',
      card1P2Text:
        'log_a(x · y) = log_a(x) + log_a(y); log_a(x / y) = log_a(x) - log_a(y); log_a(x^k) = k · log_a(x); a^(m+n) = a^m · a^n.',
      card1P3Title: 'Asosiy hosilalar va integrallar',
      card1P3Text:
        '(x^n)\' = n·x^(n-1); (sin x)\' = cos x; (cos x)\' = -sin x; (e^x)\' = e^x; ∫x^n dx = (x^(n+1))/(n+1) + C.',

      card2Title: 'Ko‘p beriladigan savollar (FAQ)',
      card2Sub: 'Kiritish sintaksisi, aniqlik va oflayn rejim',
      faqList: [
        {
          q: 'Daraja, kasr va ildizlar qanday kiritiladi?',
          a: 'Darajalar ^ belgisi orqali yoki klaviaturadagi x² tugmasi bilan kiritiladi: x^2 - 4 = 0. Kasrlar / orqali: (x + 1)/(x - 2). Kvadrat ildiz uchun sqrt(x) yoki √ tugmasidan foydalaning.',
        },
        {
          q: 'Kompleks sonlar va irratsional ildizlar ishlaydimi?',
          a: 'Ha, diskriminant manfiy (D < 0) bo‘lsa, kalkulyator x = α ± βi ko‘rinishidagi kompleks ildizlarni avtomatik hisoblaydi.',
        },
        {
          q: 'Hosilalar va integrallar qanday hisoblanadi?',
          a: 'Simvolli tahlil qoidalari yordamida har bir qadam tushuntirish bilan batafsil ko‘rsatiladi.',
        },
        {
          q: 'Kalkulyator internetsiz ishlaydimi?',
          a: 'Ha! Barcha hisob-kitoblar to‘liq brauzerda bajariladi, ma’lumotlar serverga yuborilmaydi.',
        },
        {
          q: 'Yechimni PDF shaklida yuklash mumkinmi?',
          a: 'Ha, «PDF yuklab olish» tugmasini bosing va chiroyli formatdagi yechim varaqasini saqlang.',
        },
      ],

      card3Title: 'Masalalar yechish bo‘yicha maslahatlar',
      card3Sub: 'O‘quvchilar va talabalar uchun tavsiyalar',
      tips: [
        {
          title: 'Aniqlaish sohasini (AMSO) tekshiring',
          text: 'Kasr maxraji nolga teng bo‘lmasligi, logarifm ostidagi ifoda esa musbat bo‘lishi shart.',
        },
        {
          title: 'Qavslarni ochishdan oldin ko‘paytuvchilarga ajrating',
          text: 'Umumiy ko‘paytuvchini chiqarish yoki QKF formulalari hisob-kitobni sezilarli osonlashtiradi.',
        },
        {
          title: 'Grafik tasvirini tekshiring',
          text: '«2D Grafik» bo‘limi funksiyaning nollari va cho‘qqilarini ko‘rgazmali namoyish etadi.',
        },
        {
          title: 'Ildizlarni tekshirib ko‘ring',
          text: 'Topilgan x qiymatlarini dastlabki tenglamaga qo‘yib, chet ildizlar yo‘qligiga ishonch hosil qiling.',
        },
      ],

      feedbackTitle: 'Matematik vositani yaxshilashga yordam bering',
      feedbackDesc: 'Yangi bo‘lim, formula taklif qiling yoki xatolik haqida xabar bering.',
      feedbackBtn: 'Bizga yozish',
    },
    en: {
      card1Title: 'Formula & Reference Guide',
      card1Sub: 'Algebraic identities, power rules, derivatives',
      card1BoxTitle: 'Special Algebraic Products',
      card1P1Title: 'Quadratic Equations & Vieta\'s Formulas',
      card1P1Text:
        'For ax² + bx + c = 0, D = b² - 4ac. When D > 0, roots are x₁,₂ = (-b ± √D) / (2a). By Vieta: x₁ + x₂ = -b/a, x₁ · x₂ = c/a.',
      card1P2Title: 'Logarithm & Power Properties',
      card1P2Text:
        'log_a(x · y) = log_a(x) + log_a(y); log_a(x / y) = log_a(x) - log_a(y); log_a(x^k) = k · log_a(x); a^(m+n) = a^m · a^n.',
      card1P3Title: 'Key Derivatives & Integrals',
      card1P3Text:
        '(x^n)\' = n·x^(n-1); (sin x)\' = cos x; (cos x)\' = -sin x; (e^x)\' = e^x; ∫x^n dx = (x^(n+1))/(n+1) + C.',

      card2Title: 'Frequently Asked Questions (FAQ)',
      card2Sub: 'Input syntax, accuracy, and offline usage',
      faqList: [
        {
          q: 'How to enter powers, fractions, and square roots?',
          a: 'Use the caret ^ or virtual keyboard x²: e.g. x^2 - 4 = 0. Use / for fractions: (x + 1)/(x - 2). Use sqrt(x) or the √ key for square roots.',
        },
        {
          q: 'Does it support complex numbers and radicals?',
          a: 'Yes. If the discriminant is negative (D < 0), complex roots are evaluated with the imaginary unit i: x = α ± βi. Irrational answers are given in exact radical form as well as decimal approximations.',
        },
        {
          q: 'How are derivatives and integrals computed?',
          a: 'Our symbolic engine applies standard analytical rules (power, product, quotient, chain rule) and indefinite integral tables with step-by-step proofs.',
        },
        {
          q: 'Does it work offline?',
          a: 'Yes! The entire CAS engine and KaTeX LaTeX renderer run directly inside your browser without sending formulas to external servers.',
        },
        {
          q: 'Can I export or print the full solution to PDF?',
          a: 'Yes, click "Download PDF" in the solution panel to generate a printer-friendly Toolboxi.uz sheet.',
        },
      ],

      card3Title: 'Problem-Solving Tips',
      card3Sub: 'Best practices for students & engineers',
      tips: [
        {
          title: 'Always verify the domain of definition',
          text: 'Fractions cannot have zero in the denominator, and logarithm arguments must be strictly positive.',
        },
        {
          title: 'Factor before expanding brackets',
          text: 'Factoring polynomials can reveal roots immediately without complicated expansions.',
        },
        {
          title: 'Check the 2D graph view',
          text: 'The graph tab visually displays roots, intercepts, and function extrema.',
        },
        {
          title: 'Verify roots with back-substitution',
          text: 'Substitute computed answers back into the original problem to eliminate extraneous solutions.',
        },
      ],

      feedbackTitle: 'Help us make the Math Solver even better',
      feedbackDesc: 'Suggest a new topic, solver feature, or report a calculation edge case.',
      feedbackBtn: 'Send Feedback',
    },
  }[lang] || {
    card1Title: 'Formula & Reference Guide',
    card1Sub: 'Algebraic identities, power rules, derivatives',
    card1BoxTitle: 'Special Algebraic Products',
    card1P1Title: 'Quadratic Equations & Vieta\'s Formulas',
    card1P1Text: 'ax² + bx + c = 0, D = b² - 4ac',
    card1P2Title: 'Logarithm & Power Properties',
    card1P2Text: 'log(ab) = log a + log b',
    card1P3Title: 'Key Derivatives & Integrals',
    card1P3Text: '(x^n)\' = n·x^(n-1)',
    card2Title: 'Frequently Asked Questions (FAQ)',
    card2Sub: 'Input syntax, accuracy, and offline usage',
    faqList: [],
    card3Title: 'Problem-Solving Tips',
    card3Sub: 'Best practices for students & engineers',
    tips: [],
    feedbackTitle: 'Help us make the Math Solver even better',
    feedbackDesc: 'Suggest a new topic, solver feature, or report an edge case.',
    feedbackBtn: 'Send Feedback',
  };

  return (
    <div className="mt-8 flex flex-col gap-6">
      {/* 1. Three Collapsible Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        {/* Card 1: Формулы и справочник */}
        <div
          className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all overflow-hidden ${
            openInfo
              ? 'border-indigo-500/80 shadow-md ring-2 ring-indigo-500/10'
              : 'border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <button
            type="button"
            onClick={() => setOpenInfo(!openInfo)}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-100/60 dark:border-indigo-900/50 group-hover:scale-105 transition-transform">
                <Info className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                  {t.card1Title}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5 font-inter">
                  {t.card1Sub}
                </p>
              </div>
            </div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-500 transition-transform duration-200 shrink-0 ml-2 ${
                openInfo
                  ? 'rotate-180 bg-indigo-50 dark:bg-slate-800 text-indigo-600'
                  : 'bg-slate-50 dark:bg-slate-800'
              }`}
            >
              <ChevronDown className="w-4 h-4" />
            </div>
          </button>

          {/* Expanded Content for Card 1 */}
          {openInfo && (
            <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-3.5 font-inter leading-relaxed">
              <div className="p-3 bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 rounded-xl">
                <div className="font-bold text-slate-900 dark:text-white mb-1.5 flex items-center gap-1.5 font-sans">
                  <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  {t.card1BoxTitle}
                </div>
                <div className="space-y-1 text-slate-800 dark:text-slate-200">
                  <div>
                    <MathView latex="(a \pm b)^2 = a^2 \pm 2ab + b^2" displayMode={false} />
                  </div>
                  <div>
                    <MathView latex="a^2 - b^2 = (a - b)(a + b)" displayMode={false} />
                  </div>
                  <div>
                    <MathView latex="a^3 \pm b^3 = (a \pm b)(a^2 \mp ab + b^2)" displayMode={false} />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-1 font-sans">
                  {t.card1P1Title}
                </h4>
                <p>{t.card1P1Text}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-1 font-sans">
                  {t.card1P2Title}
                </h4>
                <p>{t.card1P2Text}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-1 font-sans">
                  {t.card1P3Title}
                </h4>
                <p>{t.card1P3Text}</p>
              </div>
            </div>
          )}
        </div>

        {/* Card 2: Частые вопросы (FAQ) */}
        <div
          className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all overflow-hidden ${
            openFaq
              ? 'border-blue-500/80 shadow-md ring-2 ring-blue-500/10'
              : 'border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <button
            type="button"
            onClick={() => setOpenFaq(!openFaq)}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100/60 dark:border-blue-900/50 group-hover:scale-105 transition-transform">
                <HelpCircle className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                  {t.card2Title}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5 font-inter">
                  {t.card2Sub}
                </p>
              </div>
            </div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-500 transition-transform duration-200 shrink-0 ml-2 ${
                openFaq
                  ? 'rotate-180 bg-blue-50 dark:bg-slate-800 text-blue-600'
                  : 'bg-slate-50 dark:bg-slate-800'
              }`}
            >
              <ChevronDown className="w-4 h-4" />
            </div>
          </button>

          {/* Expanded Content for Card 2 with nested smooth accordion */}
          {openFaq && (
            <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-2.5 font-inter leading-relaxed">
              {t.faqList.map((item, idx) => {
                const isOpen = activeFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveFaqIndex(isOpen ? null : idx)}
                      className="w-full text-left p-3 flex items-center justify-between gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                    >
                      <span className="font-bold text-slate-900 dark:text-white font-sans text-xs">
                        {item.q}
                      </span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-blue-600' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-3 pb-3 pt-1 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Card 3: Советы по расчётам */}
        <div
          className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all overflow-hidden ${
            openTips
              ? 'border-emerald-500/80 shadow-md ring-2 ring-emerald-500/10'
              : 'border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <button
            type="button"
            onClick={() => setOpenTips(!openTips)}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100/60 dark:border-emerald-900/50 group-hover:scale-105 transition-transform">
                <Lightbulb className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                  {t.card3Title}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5 font-inter">
                  {t.card3Sub}
                </p>
              </div>
            </div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-500 transition-transform duration-200 shrink-0 ml-2 ${
                openTips
                  ? 'rotate-180 bg-emerald-50 dark:bg-slate-800 text-emerald-600'
                  : 'bg-slate-50 dark:bg-slate-800'
              }`}
            >
              <ChevronDown className="w-4 h-4" />
            </div>
          </button>

          {/* Expanded Content for Card 3 */}
          {openTips && (
            <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-3 font-inter leading-relaxed">
              {t.tips.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div>
                    <strong className="text-slate-900 dark:text-white font-sans">
                      {tip.title}
                    </strong>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                      {tip.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. Feedback Action Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-4 text-left w-full sm:w-auto">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-100/60 dark:border-indigo-900/50">
            <Lightbulb className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white tracking-tight">
              {t.feedbackTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 font-inter">
              {t.feedbackDesc}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenFeedback}
          className="w-full sm:w-auto px-6 py-2.5 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <span>{t.feedbackBtn}</span>
          <ArrowRight className="w-4 h-4 text-slate-500 dark:text-slate-400" />
        </button>
      </div>
    </div>
  );
};
