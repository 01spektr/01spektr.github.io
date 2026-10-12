import React, { useState } from "react";
import { Info, BookOpen, Lightbulb, ChevronDown } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const QrBottomCards: React.FC = () => {
  const { locale } = useI18n();

  const [openInfo, setOpenInfo] = useState(false);
  const [openFaq, setOpenFaq] = useState(false);
  const [openTips, setOpenTips] = useState(false);
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(0);

  const t = {
    ru: {
      headerTitle: "Справочная информация",
      headerSubtitle: "Стандарты, ответы на частые вопросы и рекомендации",
      infoTabTitle: "Как устроен QR-код",
      infoTabSubtitle: "Структура, коррекция ошибок и форматы",
      faqTabTitle: "Частые вопросы (FAQ)",
      faqTabSubtitle: "Ответы на популярные вопросы о QR-кодах",
      tipsTabTitle: "Советы для идеальной печати",
      tipsTabSubtitle: "Как избежать ошибок при сканировании",
      infoSections: [
        {
          color: "bg-blue-600 dark:bg-blue-400",
          title: "Коррекция ошибок (ECC)",
          text: "Алгоритм Рида-Соломона позволяет считывать QR-код даже при физическом повреждении: L (до 7%), M (до 15%), Q (до 25%) и H (до 30%). Для кодов с логотипом в центре всегда используется уровень H.",
        },
        {
          color: "bg-emerald-600 dark:bg-emerald-400",
          title: "Тихая зона (Quiet Zone)",
          text: "Вокруг матрицы обязательно должно оставаться пустое поле шириной минимум в 4 модуля. Без него камера смартфона не сможет отделить код от фона или окружающего текста.",
        },
        {
          color: "bg-amber-600 dark:bg-amber-400",
          title: "Векторный экспорт (SVG)",
          text: "Для широкоформатной печати, визиток и наружной рекламы всегда используйте формат SVG. Он бесконечно масштабируется без потери резкости контуров.",
        },
        {
          color: "bg-purple-600 dark:bg-purple-400",
          title: "Статические коды",
          text: "Все созданные здесь QR-коды являются статическими: данные зашиты непосредственно в изображение. Они не имеют срока годности и работают без сторонних серверов вечно.",
        },
      ],
      faqs: [
        {
          q: "Есть ли у сгенерированного QR-кода срок действия?",
          a: "Нет. Код содержит ваши данные напрямую (текст, ссылку, параметры Wi-Fi). Он будет работать вечно, пока существует сам физический носитель или адрес вашей ссылки.",
        },
        {
          q: "Почему код не сканируется со смартфона?",
          a: "Самые частые причины: недостаточный цветовой контраст (например, жёлтый на белом), слишком мелкий размер при печати, отсутствие белых полей по краям или слишком длинная ссылка при низком разрешении.",
        },
        {
          q: "Можно ли использовать логотип в центре?",
          a: "Да, генератор автоматически повышает уровень коррекции до High (30%) и оставляет защитную зону под логотипом, чтобы сканеры читали оставшиеся дублирующие модули.",
        },
        {
          q: "Сохраняются ли мои персональные данные на сервере?",
          a: "Нет. Весь процесс генерации математической матрицы QR и рендеринга изображения происходит на 100% локально в вашем браузере. Данные не покидают устройство.",
        },
      ],
      tips: [
        {
          title: "Соблюдайте минимальный размер",
          text: "Для визиток и флаеров размер QR-кода при печати должен быть не менее 2 × 2 см. Для плакатов и вывесок рассчитывайте размер по формуле: Расстояние до зрителя / 10.",
        },
        {
          title: "Тёмный код на светлом фоне",
          text: "Большинство камер лучше распознают классическую инверсию (тёмные модули на светлом фоне). Избегайте светлых узоров на светлом фоне.",
        },
        {
          title: "Сокращайте длинные ссылки",
          text: "Чем меньше символов в URL, тем крупнее и проще будут модули QR-кода. Это ускоряет мгновенное распознавание камерой даже при плохом освещении.",
        },
        {
          title: "Всегда тестируйте перед печатью",
          text: "Обязательно отсканируйте код с экрана или тестового листа сразу несколькими смартфонами (iOS и Android) при разном угле наклона.",
        },
      ],
    },
    uz: {
      headerTitle: "Ma’lumotnoma",
      headerSubtitle: "Standartlar, tez-tez beriladigan savollar va tavsiyalar",
      infoTabTitle: "QR-kod qanday ishlaydi",
      infoTabSubtitle: "Tuzilishi, xatolarni tuzatish va formatlar",
      faqTabTitle: "Ko‘p so‘raladigan savollar",
      faqTabSubtitle: "QR-kodlar bo‘yicha ommabop savollarga javoblar",
      tipsTabTitle: "Chop etish uchun tavsiyalar",
      tipsTabSubtitle: "Skanerlashda xatoliklarning oldini olish",
      infoSections: [
        {
          color: "bg-blue-600 dark:bg-blue-400",
          title: "Xatolarni tuzatish (ECC)",
          text: "Rid-Solomon algoritmi QR-kod shikastlangan taqdirda ham uni o'qishga imkon beradi: L (7% gacha), M (15% gacha), Q (25% gacha) va H (30% gacha). Logotipli kodlar uchun har doim H darajasi tanlanadi.",
        },
        {
          color: "bg-emerald-600 dark:bg-emerald-400",
          title: "Jim zona (Quiet Zone)",
          text: "Kod atrofi kamida 4 modul qalinligidagi bo'sh maydon bilan o'ralgan bo'lishi shart. Busiz smartfon kamerasi kodni fondan ajrata olmaydi.",
        },
        {
          color: "bg-amber-600 dark:bg-amber-400",
          title: "Vektorli eksport (SVG)",
          text: "Bosma nashrlar va vizitkalar uchun har doim SVG formatidan foydalaning. U sifatini yo'qotmasdan istalgan o'lchamga kengayadi.",
        },
        {
          color: "bg-purple-600 dark:bg-purple-400",
          title: "Statik kodlar",
          text: "Ushbu xizmatda yaratilgan barcha QR-kodlar statik hisoblanadi: ma'lumotlar to'g'ridan-to'g'ri rasmga yoziladi va ularning amal qilish muddati cheklanmagan.",
        },
      ],
      faqs: [
        {
          q: "QR-kodning amal qilish muddati bormi?",
          a: "Yo'q. Kod ma'lumotlarni to'g'ridan-to'g'ri o'zida saqlaydi va sizning havolangiz ishlab turgan muddatda abadiy ishlaydi.",
        },
        {
          q: "Nega telefon QR-kodni o'qimayapti?",
          a: "Asosiy sabablar: ranglar kontrasti pastligi (masalan, oq fonda sariq rang), chop etilgan o'lcham juda kichikligi yoki atrofida bo'sh joy yo'qligi.",
        },
        {
          q: "Markazga logotip qo'yish mumkinmi?",
          a: "Ha, generator avtomatik ravishda xatolarni tuzatish darajasini High (30%) ga oshiradi va logotip atrofini himoyalaydi.",
        },
        {
          q: "Mening shaxsiy ma'lumotlarim serverga yuboriladimi?",
          a: "Yo'q. Barcha jarayon 100% sizning brauzeringizda xavfsiz amalga oshiriladi.",
        },
      ],
      tips: [
        {
          title: "Minimal o'lchamga rioya qiling",
          text: "Vizitka va flayerlar uchun QR-kod o'lchami kamida 2 × 2 sm bo'lishi maqsadga muvofiq.",
        },
        {
          title: "Och fonda to'q rang",
          text: "Kameralar oq fonda to'q rangli modullarni ancha tez va xatosiz taniydi.",
        },
        {
          title: "Qisqa havolalardan foydalaning",
          text: "Havola qancha qisqa bo'lsa, kod nuqtalari shuncha yiriklashadi va oson skanerlanadi.",
        },
        {
          title: "Chop etishdan oldin tekshiring",
          text: "Chop etishdan avval kodni bir nechta smartfonlar yordamida tekshirib ko'ring.",
        },
      ],
    },
    en: {
      headerTitle: "Reference Information",
      headerSubtitle: "Standards, FAQs, and best practices",
      infoTabTitle: "How QR Codes Work",
      infoTabSubtitle: "Structure, error correction & formats",
      faqTabTitle: "Frequently Asked Questions",
      faqTabSubtitle: "Common questions about QR code generation",
      tipsTabTitle: "Printing & Design Best Practices",
      tipsTabSubtitle: "Avoid scanning and readability issues",
      infoSections: [
        {
          color: "bg-blue-600 dark:bg-blue-400",
          title: "Error Correction (ECC)",
          text: "The Reed-Solomon algorithm enables codes to be scanned even when partially obscured: L (up to 7%), M (up to 15%), Q (up to 25%), and H (up to 30%). Codes with logos always use Level H.",
        },
        {
          color: "bg-emerald-600 dark:bg-emerald-400",
          title: "Quiet Zone Margin",
          text: "A clear border of at least 4 modules width must surround the matrix so optical sensors can separate the code from adjacent content.",
        },
        {
          color: "bg-amber-600 dark:bg-amber-400",
          title: "Vector SVG Export",
          text: "Always prefer SVG vector files for commercial print runs and signage to ensure razor-sharp edges at any DPI.",
        },
        {
          color: "bg-purple-600 dark:bg-purple-400",
          title: "Permanent Static Codes",
          text: "These QR codes are static and embed payload data directly into the matrix. They never expire and do not depend on third-party redirection servers.",
        },
      ],
      faqs: [
        {
          q: "Do generated QR codes ever expire?",
          a: "No. The data is encoded directly into the pattern. As long as your destination link or content is active, the QR code works indefinitely.",
        },
        {
          q: "Why won't my camera scan the QR code?",
          a: "Common issues include insufficient color contrast, lack of quiet zone borders, printed size too small, or complex payloads at low resolution.",
        },
        {
          q: "Can I safely add a company logo?",
          a: "Yes. The generator elevates error correction to High (30%) and pads the center area so scanning redundancy remains intact.",
        },
        {
          q: "Is my personal data stored on your server?",
          a: "No. All generation and rendering occurs 100% locally within your client browser.",
        },
      ],
      tips: [
        {
          title: "Minimum Print Dimensions",
          text: "For business cards and leaflets, keep codes at least 2 × 2 cm (0.8 × 0.8 in). For posters, size = viewing distance / 10.",
        },
        {
          title: "Dark on Light Contrast",
          text: "Most optical decoders are optimized for dark modules over light backgrounds. Maintain high contrast ratio.",
        },
        {
          title: "Shorten Long URLs",
          text: "Shorter URLs produce less dense matrices with larger modules, making scans faster in low light.",
        },
        {
          title: "Test Across Multiple Devices",
          text: "Always perform test scans on both iOS and Android under different lighting angles prior to high-volume printing.",
        },
      ],
    },
  }[locale as "ru" | "uz" | "en"] || {
    headerTitle: "Reference Information",
    headerSubtitle: "Standards, FAQs, and tips",
    infoTabTitle: "How QR Codes Work",
    infoTabSubtitle: "Structure and error correction",
    faqTabTitle: "FAQ",
    faqTabSubtitle: "Frequently Asked Questions",
    tipsTabTitle: "Tips for Printing",
    tipsTabSubtitle: "Best practices",
    infoSections: [],
    faqs: [],
    tips: [],
  };

  return (
    <div className="w-full mt-8">
      <div className="mb-3 px-0.5 flex items-center justify-between">
        <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {t.headerTitle}
        </h3>
        <span className="text-[11px] text-slate-400 dark:text-slate-500 font-body">
          {t.headerSubtitle}
        </span>
      </div>

      {/* Grid with items-start so each card maintains independent height */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        {/* Card 1: Полезная информация */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/85 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs transition-colors">
          <button
            type="button"
            onClick={() => setOpenInfo(!openInfo)}
            className="w-full flex items-center justify-between text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                <Info className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-heading text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {t.infoTabTitle}
                </h4>
                <p className="font-body text-[11px] text-slate-400 dark:text-slate-500">
                  {t.infoTabSubtitle}
                </p>
              </div>
            </div>
            <div className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  openInfo ? "rotate-180 text-blue-600 dark:text-blue-400" : ""
                }`}
              />
            </div>
          </button>

          {openInfo && (
            <div className="mt-3.5 pt-3.5 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-3 font-body leading-relaxed animate-in fade-in duration-150">
              {t.infoSections.map((sec, idx) => (
                <div key={idx}>
                  <h5 className="font-heading font-bold text-slate-800 dark:text-slate-200 text-[11px] uppercase tracking-wide mb-1 flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${sec.color}`} />
                    {sec.title}
                  </h5>
                  <p>{sec.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Card 2: Частые вопросы */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/85 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs transition-colors">
          <button
            type="button"
            onClick={() => setOpenFaq(!openFaq)}
            className="w-full flex items-center justify-between text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-heading text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {t.faqTabTitle}
                </h4>
                <p className="font-body text-[11px] text-slate-400 dark:text-slate-500">
                  {t.faqTabSubtitle}
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
              {t.faqs.map((item, idx) => {
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
                      <div className="px-3 pb-3 text-[11px] text-slate-700 dark:text-slate-200 font-body leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-2 bg-white dark:bg-slate-900/80">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Card 3: Советы и рекомендации */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/85 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs transition-colors">
          <button
            type="button"
            onClick={() => setOpenTips(!openTips)}
            className="w-full flex items-center justify-between text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <Lightbulb className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-heading text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {t.tipsTabTitle}
                </h4>
                <p className="font-body text-[11px] text-slate-400 dark:text-slate-500">
                  {t.tipsTabSubtitle}
                </p>
              </div>
            </div>
            <div className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  openTips ? "rotate-180 text-emerald-600 dark:text-emerald-400" : ""
                }`}
              />
            </div>
          </button>

          {openTips && (
            <div className="mt-3.5 pt-3.5 border-t border-slate-100 dark:border-slate-800 space-y-2.5 text-xs font-body text-slate-600 dark:text-slate-300 animate-in fade-in duration-150">
              {t.tips.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50/70 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800"
                >
                  <p className="font-heading font-bold text-slate-800 dark:text-slate-200 text-[11px] mb-1">
                    {idx + 1}. {item.title}
                  </p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
