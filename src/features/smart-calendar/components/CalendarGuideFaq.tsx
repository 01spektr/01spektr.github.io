import React, { useState } from 'react';
import {
  Info,
  HelpCircle,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Clock,
  CalendarCheck,
  FileText,
  Calculator,
  ShieldCheck,
  Globe2,
} from 'lucide-react';
import { CountryCode } from '../types/calendar';
import { useTranslation } from '../i18n/LanguageContext';

interface CalendarGuideFaqProps {
  country: CountryCode;
  onOpenPdfModal: (type?: 'month' | 'year' | 'calculations') => void;
}

export const CalendarGuideFaq: React.FC<CalendarGuideFaqProps> = ({
  onOpenPdfModal,
}) => {
  const { language, t } = useTranslation();
  const [activeCard, setActiveCard] = useState<'info' | 'faq' | 'tips' | null>(null);
  const [openFaqItem, setOpenFaqItem] = useState<number | null>(null);

  const toggleCard = (card: 'info' | 'faq' | 'tips') => {
    setActiveCard(activeCard === card ? null : card);
  };

  const faqData = {
    ru: [
      {
        q: 'Как производственный календарь рассчитывает количество рабочих дней?',
        a: 'Калькулятор анализирует все календарные даты в выбранном диапазоне, исключая еженедельные выходные дни (в зависимости от выбранного графика: 5-дневка, 6-дневка или 4-дневка) и официальные праздничные дни выбранной юрисдикции. Если дата выпадает на перенесенный день отдыха, она также учитывается как нерабочая.',
      },
      {
        q: 'Чем отличается расчёт для 5-дневной и 6-дневной рабочей недели?',
        a: 'При 5-дневной неделе рабочими считаются дни с понедельника по пятницу (по 8 часов в день при норме 40 часов), а суббота и воскресенье — выходными. При 6-дневной неделе рабочими являются дни с понедельника по субботу (обычно 5 дней по 7 часов + суббота 5 часов при норме 40 часов), а выходным — только воскресенье.',
      },
      {
        q: 'Как учитываются предпраздничные сокращенные дни?',
        a: 'Согласно международной трудовой практике, рабочий день, непосредственно предшествующий официальному нерабочему праздничному дню, сокращается на 1 час. При подсчете общего фонда рабочего времени в часах этот сокращенный час автоматически вычитается.',
      },
      {
        q: 'Что происходит, если праздничный день выпадает на субботу или воскресенье?',
        a: 'В большинстве стран мира действует правило переноса: если официальный нерабочий праздник совпадает с еженедельным выходным днем, день отдыха переносится на следующий рабочий день (понедельник), обеспечивая непрерывность отдыха сотрудников.',
      },
      {
        q: 'Как работает калькулятор дедлайна проекта с буфером времени?',
        a: 'Калькулятор прибавляет к стартовой дате заданное число рабочих дней, пропуская все нерабочие дни и праздники. Дополнительный буфер (от 1 до 5 дней) позволяет учесть риски задержек, длинных праздничных каникул и непредвиденных обстоятельств при сдаче проекта.',
      },
      {
        q: 'Включаются ли нерабочие праздничные дни в расчет отпуска?',
        a: 'По общему правилу трудового законодательства большинства государств, официальные нерабочие праздники, приходящиеся на период ежегодного отпуска, не включаются в число календарных дней отпуска и фактически продлевают его продолжительность.',
      },
      {
        q: 'Как сохранить или распечатать календарь в формате PDF?',
        a: 'Нажмите кнопку «Экспорт в PDF» в карточке инструмента или в модальном окне. Вы можете сформировать готовый к печати документ формата А4 на выбранный месяц или на весь год со всеми нормами рабочего времени.',
      },
      {
        q: 'За какие года доступны расчеты и производственные нормы?',
        a: 'Календарь поддерживает полный исторический и перспективный диапазон с 1960 по 2050 год. Вы можете свободно переключаться между десятилетиями, просматривать архивные данные и планировать долгосрочные проекты.',
      },
    ],
    uz: [
      {
        q: 'Ishlab chiqarish taqvimi ish kunlari sonini qanday hisoblaydi?',
        a: 'Kalkulyator tanlangan muddatdagi barcha taqvim sanalarini tahlil qiladi, haftalik dam olish kunlarini (tanlangan 5 kunlik, 6 kunlik yoki 4 kunlik jadvalga asosan) va davlat bayramlarini chiqarib tashlaydi. Agar sana ko‘chirilgan dam olish kuniga to‘g‘ri kelsa, u ham ishlanmaydigan kun deb hisoblanadi.',
      },
      {
        q: '5 kunlik va 6 kunlik ish haftasi hisobi qanday farqlanadi?',
        a: '5 kunlik ish haftasida dushanbadan jumagacha bo‘lgan kunlar ish kunlari hisoblanadi (40 soatlik me’yorda kuniga 8 soatdan), shanba va yakshanba esa dam olish kunlaridir. 6 kunlik ish haftasida dushanbadan shanbagacha ishlanadi (odatda 5 kun 7 soatdan + shanba 5 soat), yakshanba esa yagona dam olish kuni bo‘ladi.',
      },
      {
        q: 'Bayramoldi qisqartirilgan ish kunlari qanday hisobga olinadi?',
        a: 'Mehnat qonunchiligi va xalqaro amaliyotga ko‘ra, rasmiy bayram kunidan oldingi ish kuni davomiyligi 1 soatga qisqartiriladi. Umumiy oylik va yillik ish soatlari jamlanmasida bu qisqartirilgan soat avtomatik ravishda chegirib tashlanadi.',
      },
      {
        q: 'Bayram kuni shanba yoki yakshanbaga to‘g‘ri kelib qolsa nima bo‘ladi?',
        a: 'O‘zbekiston Respublikasi Mehnat kodeksiga binoan, agar dam olish kuni (shanba yoki yakshanba) rasmiy bayram kuniga to‘g‘ri kelsa, dam olish kuni bayramdan keyingi birinchi ish kuniga (dushanbaga) ko‘chiriladi.',
      },
      {
        q: 'Loyiha muddatini xavfsizlik buferi bilan hisoblash qanday ishlaydi?',
        a: 'Kalkulyator loyiha boshlanish sanasiga berilgan ish kunlari sonini qo‘shadi, barcha dam olish va bayram kunlarini tashlab o‘tadi. 1 tadan 5 kungacha bo‘lgan qo‘shimcha bufer loyihani o‘z vaqtida topshirishdagi kutilmagan kechikishlar va xatarlardan himoya qiladi.',
      },
      {
        q: 'Mehnat ta’tili hisobida rasmiy bayram kunlari qanday inobatga olinadi?',
        a: 'Mehnat qonunchiligining umumiy qoidasiga ko‘ra, yillik mehnat ta’tili davriga to‘g‘ri kelgan rasmiy ishlanmaydigan bayram kunlari ta’til kunlari hisobiga kiritilmaydi va ta’til muddatini uzaytiradi.',
      },
      {
        q: 'Taqvimni PDF formatida saqlash yoki chop etish qanday amalga oshiriladi?',
        a: 'Sahifadagi «PDF formatida eksport» tugmasini bosing. Siz joriy oy yoki butun yil uchun barcha me’yorlar va jadvallar kiritilgan A4 formatidagi rasmiy hujjatni yuklab olishingiz mumkin.',
      },
      {
        q: 'Qaysi yillar uchun hisob-kitoblar va me’yorlar mavjud?',
        a: 'Taqvim 1960-yildan 2050-yilgacha bo‘lgan 90 yillik to‘liq oraliqni qamrab oladi. Siz o‘tgan yillarni tekshirishingiz yoki kelajakdagi uzoq muddatli rejalarni tuzishingiz mumkin.',
      },
    ],
    en: [
      {
        q: 'How does the production calendar calculate working days?',
        a: 'The calculator analyzes all calendar dates in the selected range, excluding weekly rest days (depending on 5-day, 6-day, or 4-day schedule) and public holidays of the chosen jurisdiction. Transferred days off are also accurately accounted for as non-working days.',
      },
      {
        q: 'What is the difference between 5-day and 6-day work weeks?',
        a: 'In a 5-day work week, Monday through Friday are working days (8 hours/day for a 40-hour standard), while Saturday and Sunday are days off. In a 6-day work week, Monday through Saturday are working days (typically 5 days × 7 hrs + Saturday 5 hrs for 40-hour norm), with Sunday as the only day off.',
      },
      {
        q: 'How are pre-holiday shortened workdays calculated?',
        a: 'In accordance with labor regulations, the workday directly preceding an official non-working public holiday is shortened by 1 hour. In total working hours calculations, this hour is automatically deducted.',
      },
      {
        q: 'What happens when a public holiday falls on Saturday or Sunday?',
        a: 'Under standard labor regulations, when an official non-working holiday coincides with a weekly rest day, the day off is transferred to the next working day (Monday), ensuring workers receive full rest entitlement.',
      },
      {
        q: 'How does the project deadline calculator with buffer work?',
        a: 'The calculator adds the specified number of working days to the start date, skipping weekends and official holidays. A safety buffer (1 to 5 days) cushions against unforeseen project delays and extended holiday periods.',
      },
      {
        q: 'Are public holidays included in annual leave calculations?',
        a: 'Under statutory labor provisions, official non-working holidays that fall within an annual leave period are excluded from the leave count, effectively extending the actual leave duration.',
      },
      {
        q: 'How do I download or print the calendar in PDF format?',
        a: 'Click the "Export to PDF" button on any card or header. You can generate a clean, print-ready official A4 document for any month or full year with complete working time balances.',
      },
      {
        q: 'What years are covered for historical and future norms?',
        a: 'The calendar spans from 1960 through 2050. You can browse through decades, verify archival records, and forecast long-term projects with ease.',
      },
    ],
  };

  const currentFaq = faqData[language] || faqData.ru;

  return (
    <section className="w-full space-y-3.5 pt-2 font-primary">
      {/* 3 Collapsible Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
        {/* Card 1: Information */}
        <button
          type="button"
          onClick={() => toggleCard('info')}
          className={`w-full text-left bg-white dark:bg-[#151D2E] border rounded-2xl p-3.5 sm:p-5 shadow-2xs transition-all cursor-pointer flex items-center justify-between gap-3 ${
            activeCard === 'info'
              ? 'border-[#0066FF] dark:border-blue-500 ring-2 ring-[#0066FF]/10 dark:ring-blue-500/20'
              : 'border-[#E2E8F0] dark:border-[#232E42] hover:border-[#CBD5E1] dark:hover:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-[#1E293B]/50'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#EFF6FF] dark:bg-blue-950/60 text-[#0066FF] dark:text-blue-400 flex items-center justify-center shrink-0">
              <Info className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <h3 className="text-[14px] sm:text-[15px] font-bold text-[#0F172A] dark:text-slate-100 truncate">
                {t('faq_info_title')}
              </h3>
              <p className="font-secondary text-[11px] sm:text-[11.5px] text-[#64748B] dark:text-slate-400 truncate mt-0.5">
                {language === 'uz'
                  ? 'Hisoblash standartlari, formulalar, vaqt me’yorlari'
                  : language === 'en'
                  ? 'Calculation standards, formulas, norms'
                  : 'Стандарты расчётов, формулы, нормы времени'}
              </p>
            </div>
          </div>
          <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[#64748B] dark:text-slate-400 shrink-0">
            {activeCard === 'info' ? (
              <ChevronUp className="w-4 h-4 stroke-[2.2]" />
            ) : (
              <ChevronDown className="w-4 h-4 stroke-[2.2]" />
            )}
          </div>
        </button>

        {/* Card 2: FAQ */}
        <button
          type="button"
          onClick={() => toggleCard('faq')}
          className={`w-full text-left bg-white dark:bg-[#151D2E] border rounded-2xl p-3.5 sm:p-5 shadow-2xs transition-all cursor-pointer flex items-center justify-between gap-3 ${
            activeCard === 'faq'
              ? 'border-[#0066FF] dark:border-blue-500 ring-2 ring-[#0066FF]/10 dark:ring-blue-500/20'
              : 'border-[#E2E8F0] dark:border-[#232E42] hover:border-[#CBD5E1] dark:hover:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-[#1E293B]/50'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#EFF6FF] dark:bg-blue-950/60 text-[#0066FF] dark:text-blue-400 flex items-center justify-center shrink-0">
              <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <h3 className="text-[14px] sm:text-[15px] font-bold text-[#0F172A] dark:text-slate-100 truncate">
                {t('faq_faq_title')}
              </h3>
              <p className="font-secondary text-[11px] sm:text-[11.5px] text-[#64748B] dark:text-slate-400 truncate mt-0.5">
                {language === 'uz'
                  ? 'Muhim savollarga 8 ta ekspert javobi'
                  : language === 'en'
                  ? '8 expert answers to key questions'
                  : '8 экспертных ответов на важные вопросы'}
              </p>
            </div>
          </div>
          <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[#64748B] dark:text-slate-400 shrink-0">
            {activeCard === 'faq' ? (
              <ChevronUp className="w-4 h-4 stroke-[2.2]" />
            ) : (
              <ChevronDown className="w-4 h-4 stroke-[2.2]" />
            )}
          </div>
        </button>

        {/* Card 3: Tips */}
        <button
          type="button"
          onClick={() => toggleCard('tips')}
          className={`w-full text-left bg-white dark:bg-[#151D2E] border rounded-2xl p-3.5 sm:p-5 shadow-2xs transition-all cursor-pointer flex items-center justify-between gap-3 ${
            activeCard === 'tips'
              ? 'border-[#0066FF] dark:border-blue-500 ring-2 ring-[#0066FF]/10 dark:ring-blue-500/20'
              : 'border-[#E2E8F0] dark:border-[#232E42] hover:border-[#CBD5E1] dark:hover:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-[#1E293B]/50'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#F0FDF4] dark:bg-emerald-950/60 text-[#16A34A] dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <h3 className="text-[14px] sm:text-[15px] font-bold text-[#0F172A] dark:text-slate-100 truncate">
                {t('faq_tips_title')}
              </h3>
              <p className="font-secondary text-[11px] sm:text-[11.5px] text-[#64748B] dark:text-slate-400 truncate mt-0.5">
                {language === 'uz'
                  ? 'Rejalashtirish va hisoblashning amaliy qoidalari'
                  : language === 'en'
                  ? 'Practical rules for planning and calculations'
                  : 'Практические правила планирования и расчётов'}
              </p>
            </div>
          </div>
          <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[#64748B] dark:text-slate-400 shrink-0">
            {activeCard === 'tips' ? (
              <ChevronUp className="w-4 h-4 stroke-[2.2]" />
            ) : (
              <ChevronDown className="w-4 h-4 stroke-[2.2]" />
            )}
          </div>
        </button>
      </div>

      {/* Expanded Content Drawer */}
      {activeCard && (
        <div className="w-full bg-white dark:bg-[#151D2E] border border-[#E2E8F0] dark:border-[#232E42] rounded-2xl p-5 sm:p-7 shadow-xs space-y-6 animate-in fade-in slide-in-from-top-2 duration-200 transition-colors">
          {/* CONTENT 1: INFO */}
          {activeCard === 'info' && (
            <div className="space-y-6">
              <div className="border-b border-[#F1F5F9] dark:border-[#232E42] pb-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-[16px] sm:text-[17px] font-bold text-[#0F172A] dark:text-slate-100 flex items-center gap-2">
                    <Info className="w-5 h-5 text-[#0066FF] dark:text-blue-400" />
                    {language === 'uz'
                      ? 'Ish vaqtini hisobga olish standartlari va hisoblash uslubiyati'
                      : language === 'en'
                      ? 'Working Time Tracking Standards and Methodologies'
                      : 'Стандарты учета рабочего времени и методики расчёта'}
                  </h4>
                  <p className="font-secondary text-[12px] text-[#64748B] dark:text-slate-400 mt-0.5">
                    {language === 'uz'
                      ? 'Xalqaro me’yorlar (ISO-8601), 40 va 36 soatlik haftalar me’yorlari'
                      : language === 'en'
                      ? 'International standards (ISO-8601), 40-hour and 36-hour weekly norms'
                      : 'Универсальные международные нормы (ISO-8601), стандарты 40-часовой и 36-часовой рабочих недель'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenPdfModal('year')}
                  className="px-3 py-1.5 bg-[#EFF6FF] dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-[#0066FF] dark:text-blue-400 border border-[#BFDBFE] dark:border-blue-900/60 rounded-xl text-[12px] font-semibold transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{t('btn_export_pdf')}</span>
                </button>
              </div>

              {/* Table */}
              <div className="border border-[#E2E8F0] dark:border-[#232E42] rounded-xl overflow-hidden">
                <div className="bg-[#F8FAFC] dark:bg-[#1E293B]/70 px-4 py-2.5 border-b border-[#E2E8F0] dark:border-[#232E42] flex items-center justify-between">
                  <span className="text-[13px] font-bold text-[#1E293B] dark:text-slate-100">
                    {language === 'uz'
                      ? 'Ish jadvallarining qiyosiy jadvali'
                      : language === 'en'
                      ? 'Standard Work Schedules Comparison'
                      : 'Сравнительная таблица стандартных графиков работы'}
                  </span>
                  <span className="text-[11px] font-secondary text-[#64748B] dark:text-slate-400">ISO-8601</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[500px] text-left border-collapse text-[12px] font-secondary">
                    <thead>
                      <tr className="bg-[#F1F5F9] dark:bg-[#0F172A]/80 text-[#334155] dark:text-slate-300 font-bold border-b border-[#E2E8F0] dark:border-[#232E42]">
                        <th className="py-2.5 px-4">
                          {language === 'uz' ? 'Ko‘rsatkich' : language === 'en' ? 'Parameter' : 'Параметр'}
                        </th>
                        <th className="py-2.5 px-4">5-day (40h)</th>
                        <th className="py-2.5 px-4">6-day (40h)</th>
                        <th className="py-2.5 px-4">4-day (36h)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#232E42] text-[#334155] dark:text-slate-300">
                      <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                        <td className="py-2.5 px-4 font-medium text-[#1E293B] dark:text-slate-200">
                          {language === 'uz' ? 'Haftalik soat me’yori' : language === 'en' ? 'Hours per week' : 'Норма часов в неделю'}
                        </td>
                        <td className="py-2.5 px-4 font-semibold text-[#0066FF] dark:text-blue-400">40 h</td>
                        <td className="py-2.5 px-4 font-semibold text-[#0066FF] dark:text-blue-400">40 h</td>
                        <td className="py-2.5 px-4 font-semibold text-[#0066FF] dark:text-blue-400">36 h</td>
                      </tr>
                      <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                        <td className="py-2.5 px-4 font-medium text-[#1E293B] dark:text-slate-200">
                          {language === 'uz' ? 'Smena davomiyligi' : language === 'en' ? 'Shift length' : 'Длительность смены'}
                        </td>
                        <td className="py-2.5 px-4">8h (Mon–Fri)</td>
                        <td className="py-2.5 px-4">7h (Mon–Fri) + 5h (Sat)</td>
                        <td className="py-2.5 px-4">9h (Mon–Thu)</td>
                      </tr>
                      <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                        <td className="py-2.5 px-4 font-medium text-[#1E293B] dark:text-slate-200">
                          {language === 'uz' ? 'Haftalik dam olish kunlari' : language === 'en' ? 'Weekly rest days' : 'Еженедельные выходные'}
                        </td>
                        <td className="py-2.5 px-4">2 days (Sat, Sun)</td>
                        <td className="py-2.5 px-4">1 day (Sun)</td>
                        <td className="py-2.5 px-4">3 days (Fri, Sat, Sun)</td>
                      </tr>
                      <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                        <td className="py-2.5 px-4 font-medium text-[#1E293B] dark:text-slate-200">
                          {language === 'uz' ? 'Bayramoldi kunlar' : language === 'en' ? 'Pre-holiday days' : 'Предпраздничные дни'}
                        </td>
                        <td className="py-2.5 px-4 text-[#16A34A] dark:text-emerald-400 font-medium">-1h (7h shift)</td>
                        <td className="py-2.5 px-4 text-[#16A34A] dark:text-emerald-400 font-medium">-1h (6h / 4h shift)</td>
                        <td className="py-2.5 px-4 text-[#16A34A] dark:text-emerald-400 font-medium">-1h (8h shift)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Formulas */}
              <div className="bg-[#F8FAFC] dark:bg-[#1E293B]/50 border border-[#E2E8F0] dark:border-[#232E42] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2.5">
                  <Calculator className="w-4 h-4 text-[#0066FF] dark:text-blue-400" />
                  <h5 className="text-[13.5px] font-bold text-[#1E293B] dark:text-slate-100">
                    {language === 'uz'
                      ? 'Moliyaviy hisob-kitoblar uchun asosiy formulalar'
                      : language === 'en'
                      ? 'Core Financial & Labor Formulas'
                      : 'Базовые формулы для финансовых расчётов'}
                  </h5>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11.5px] font-secondary text-[#334155] dark:text-slate-300">
                  <div className="bg-white dark:bg-[#151D2E] border border-[#E2E8F0] dark:border-[#232E42] rounded-lg p-3 shadow-2xs">
                    <span className="font-primary font-bold text-[#0F172A] dark:text-slate-100 block mb-1">
                      {language === 'uz' ? 'Ish vaqti fondi:' : language === 'en' ? 'Working Time Fund:' : 'Фонд рабочего времени:'}
                    </span>
                    <code className="font-mono text-[#0066FF] dark:text-blue-400 text-[10.5px] sm:text-[11px] block bg-slate-50 dark:bg-[#0F172A] p-1.5 rounded border border-slate-200 dark:border-[#232E42] break-all">
                      WH = (WorkDays × Hours) − ShortHours
                    </code>
                  </div>
                  <div className="bg-white dark:bg-[#151D2E] border border-[#E2E8F0] dark:border-[#232E42] rounded-lg p-3 shadow-2xs">
                    <span className="font-primary font-bold text-[#0F172A] dark:text-slate-100 block mb-1">
                      {language === 'uz' ? 'Soatlik ish haqi:' : language === 'en' ? 'Hourly Rate:' : 'Часовая ставка сотрудника:'}
                    </span>
                    <code className="font-mono text-[#0066FF] dark:text-blue-400 text-[10.5px] sm:text-[11px] block bg-slate-50 dark:bg-[#0F172A] p-1.5 rounded border border-slate-200 dark:border-[#232E42] break-all">
                      Rate = Salary ÷ MonthNormHours
                    </code>
                  </div>
                  <div className="bg-white dark:bg-[#151D2E] border border-[#E2E8F0] dark:border-[#232E42] rounded-lg p-3 shadow-2xs">
                    <span className="font-primary font-bold text-[#0F172A] dark:text-slate-100 block mb-1">
                      {language === 'uz' ? 'Dam olish kuni ishlash to‘lovi:' : language === 'en' ? 'Weekend Pay Rate:' : 'Оплата работы в выходной:'}
                    </span>
                    <code className="font-mono text-[#0066FF] dark:text-blue-400 text-[10.5px] sm:text-[11px] block bg-slate-50 dark:bg-[#0F172A] p-1.5 rounded border border-slate-200 dark:border-[#232E42] break-all">
                      Pay = Rate × Hours × 2.0
                    </code>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CONTENT 2: FAQ */}
          {activeCard === 'faq' && (
            <div className="space-y-4">
              <div className="border-b border-[#F1F5F9] dark:border-[#232E42] pb-3">
                <h4 className="text-[16px] sm:text-[17px] font-bold text-[#0F172A] dark:text-slate-100 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-[#0066FF] dark:text-blue-400" />
                  {t('faq_faq_title')}
                </h4>
                <p className="font-secondary text-[12px] text-[#64748B] dark:text-slate-400 mt-0.5">
                  {language === 'uz'
                    ? 'Ish kunlari, ta’tillar, bayramlar va muddatlarni hisoblash bo‘yicha batafsil javoblar'
                    : language === 'en'
                    ? 'Key answers regarding working days, holidays, annual leave, and deadlines'
                    : 'Ответы на ключевые вопросы о расчете рабочих дней, праздников, отпусков и дедлайнов'}
                </p>
              </div>

              <div className="space-y-2">
                {currentFaq.map((item, idx) => {
                  const isOpen = openFaqItem === idx;
                  return (
                    <div
                      key={idx}
                      className="border border-[#E2E8F0] dark:border-[#232E42] rounded-xl overflow-hidden transition-all duration-200 bg-white dark:bg-[#151D2E]"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqItem(isOpen ? null : idx)}
                        className="w-full text-left px-4 py-3 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-[#1E293B] transition-colors cursor-pointer"
                      >
                        <span className="text-[13px] font-semibold text-[#1E293B] dark:text-slate-100">
                          {item.q}
                        </span>
                        <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 text-[#64748B] dark:text-slate-400">
                          {isOpen ? (
                            <ChevronUp className="w-3.5 h-3.5 stroke-[2.2]" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 stroke-[2.2]" />
                          )}
                        </div>
                      </button>

                      {isOpen && (
                        <div className="px-4 pb-3.5 pt-1 text-[12px] font-secondary text-[#475569] dark:text-slate-300 leading-relaxed border-t border-[#F1F5F9] dark:border-[#232E42]">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* CONTENT 3: TIPS */}
          {activeCard === 'tips' && (
            <div className="space-y-4">
              <div className="border-b border-[#F1F5F9] dark:border-[#232E42] pb-3">
                <h4 className="text-[16px] sm:text-[17px] font-bold text-[#0F172A] dark:text-slate-100 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-[#16A34A] dark:text-emerald-400" />
                  {t('faq_tips_title')}
                </h4>
                <p className="font-secondary text-[12px] text-[#64748B] dark:text-slate-400 mt-0.5">
                  {language === 'uz'
                    ? 'Loyiha rahbarlari, hisobchilar va kadrlar bo‘yicha mutaxassislar uchun tavsiyalar'
                    : language === 'en'
                    ? 'Practical advice for project managers, accountants, and HR teams'
                    : 'Советы для руководителей проектов, бухгалтеров, специалистов по кадрам и сотрудников'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="bg-[#F8FAFC] dark:bg-[#1E293B]/50 border border-[#E2E8F0] dark:border-[#232E42] rounded-xl p-4 flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-[#0066FF] dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CalendarCheck className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div>
                    <h5 className="text-[13.5px] font-bold text-[#1E293B] dark:text-slate-100">
                      {language === 'uz' ? '1. 10–15% loyiha buferi qo‘shing' : language === 'en' ? '1. Allocate a 10–15% Project Buffer' : '1. Закладывайте проектный буфер 10–15%'}
                    </h5>
                    <p className="font-secondary text-[11.5px] text-[#475569] dark:text-slate-300 mt-1 leading-relaxed">
                      {language === 'uz'
                        ? 'Relizlar va muddatlarni rejalashtirishda 2–4 ish kuni zaxirasini bering. Bu uzoq bayramlarda majburiyatlar buzilishidan saqlaydi.'
                        : language === 'en'
                        ? 'When scheduling deadlines, add 2–4 working days buffer to protect deliverables from holiday delays.'
                        : 'При планировании релизов и дедлайнов используйте калькулятор дедлайнов с запасом 2–4 рабочих дня.'}
                    </p>
                  </div>
                </div>

                <div className="bg-[#F8FAFC] dark:bg-[#1E293B]/50 border border-[#E2E8F0] dark:border-[#232E42] rounded-xl p-4 flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-[#16A34A] dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div>
                    <h5 className="text-[13.5px] font-bold text-[#1E293B] dark:text-slate-100">
                      {language === 'uz' ? '2. Bayramoldi qisqartirilgan smenalar' : language === 'en' ? '2. Pre-holiday Shift Deductions' : '2. Учет предпраздничных смен'}
                    </h5>
                    <p className="font-secondary text-[11.5px] text-[#475569] dark:text-slate-300 mt-1 leading-relaxed">
                      {language === 'uz'
                        ? 'Soatbay maosh to‘lashda rasmiy bayram oldidan 1 soatlik qisqarishni tekshirishni unutmang.'
                        : language === 'en'
                        ? 'Always account for 1-hour pre-holiday reductions when computing hourly compensation and overtime.'
                        : 'Не забывайте проверять сокращение на 1 час перед официальными праздниками при начислении почасовой ставки.'}
                    </p>
                  </div>
                </div>

                <div className="bg-[#F8FAFC] dark:bg-[#1E293B]/50 border border-[#E2E8F0] dark:border-[#232E42] rounded-xl p-4 flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Globe2 className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div>
                    <h5 className="text-[13.5px] font-bold text-[#1E293B] dark:text-slate-100">
                      {language === 'uz' ? '3. Taqqoslama xalqaro taqvimlar' : language === 'en' ? '3. International Team Coordination' : '3. Синхронизация распределенных команд'}
                    </h5>
                    <p className="font-secondary text-[11.5px] text-[#475569] dark:text-slate-300 mt-1 leading-relaxed">
                      {language === 'uz'
                        ? 'Jamoangiz yoki mijozlaringiz boshqa davlatlarda bo‘lsa, umumiy ish oynasini topish uchun mintaqaviy taqvimlarni almashtiring.'
                        : language === 'en'
                        ? 'If your team or clients are global, switch regional calendars to coordinate overlapping working hours.'
                        : 'Если ваша команда или клиенты находятся в разных странах, переключайте региональный календарь для согласования окон.'}
                    </p>
                  </div>
                </div>

                <div className="bg-[#F8FAFC] dark:bg-[#1E293B]/50 border border-[#E2E8F0] dark:border-[#232E42] rounded-xl p-4 flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div>
                    <h5 className="text-[13.5px] font-bold text-[#1E293B] dark:text-slate-100">
                      {language === 'uz' ? '4. Mehnat ta’tilini aniq hisoblash' : language === 'en' ? '4. Accurate Leave Period Tracking' : '4. Точный расчёт отпускных периодов'}
                    </h5>
                    <p className="font-secondary text-[11.5px] text-[#475569] dark:text-slate-300 mt-1 leading-relaxed">
                      {language === 'uz'
                        ? 'Ta’til ichiga tushgan bayramlar xodimning amaldagi dam olish kunini uzaytiradi. Kunlar farqi kalkulyatoridan foydalaning.'
                        : language === 'en'
                        ? 'Holidays inside leave prolong actual rest. Use the Date Difference calculator to verify working and non-working days.'
                        : 'Праздничные дни внутри отпуска продлевают фактический отдых сотрудника. Используйте калькулятор разницы дат.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
