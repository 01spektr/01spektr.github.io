import { useState, type ReactNode } from "react";
import { BookOpen, CheckCircle2, ChevronDown, FileText, MessageSquare } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface ItemProps {
  id: string;
  icon: ReactNode;
  title: string;
  open: boolean;
  toggle: () => void;
  children: ReactNode;
}

function AccordionItem({ id, icon, title, open, toggle, children }: ItemProps) {
  return (
    <div id={`accordion-${id}`} className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
      <button type="button" aria-expanded={open} onClick={toggle} className="flex w-full items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-slate-50/70 sm:px-5 sm:py-4">
        <span className="flex min-w-0 items-center gap-2.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">{icon}</span>
          <span className="text-sm font-semibold leading-snug text-slate-800">{title}</span>
        </span>
        <ChevronDown className={`ml-2 size-4 shrink-0 text-slate-400 transition-transform ${open ? "rotate-180 text-blue-600" : ""}`} />
      </button>
      {open ? <div className="flex-1 space-y-3 border-t border-slate-100 px-4 pb-4 pt-3 text-xs leading-relaxed text-slate-600 sm:px-5 sm:pb-5">{children}</div> : null}
    </div>
  );
}

export function AccordionSections() {
  const { locale } = useI18n();
  const tr = (ru: string, en: string) => (locale === "en" ? en : ru);
  const [open, setOpen] = useState<Record<string, boolean>>({ faq: false, guide: false, commercial: false });
  const toggle = (id: string) => setOpen((value) => ({ ...value, [id]: !value[id] }));
  const faqs = [
    ["Как рассчитывается контрольная цифра в EAN-13?", "How is the EAN-13 check digit calculated?", "13-я цифра вычисляется по Modulo-10: чётные позиции умножаются на 3, нечётные на 1. Генератор делает это автоматически.", "The 13th digit uses Modulo 10: even positions are multiplied by 3 and odd positions by 1. The generator calculates it automatically."],
    ["В чём разница между Code 128 и Code 39?", "What is the difference between Code 128 and Code 39?", "Code 128 компактнее и поддерживает любые символы ASCII. Code 39 проще, но длиннее.", "Code 128 is more compact and supports all ASCII characters. Code 39 is simpler but longer."],
    ["В каком формате скачивать для типографии?", "Which format should I use for print?", "Для этикеток выбирайте SVG или PDF: это векторные форматы без потери резкости.", "Choose SVG or PDF for labels: both are vector formats that stay sharp at any size."],
  ];

  return (
    <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-3 lg:gap-5">
      <AccordionItem id="faq" icon={<MessageSquare className="size-4" />} title={tr("Частые вопросы", "Frequently asked questions")} open={open.faq} toggle={() => toggle("faq")}>
        {faqs.map(([ruQ, enQ, ruA, enA]) => <div key={ruQ}><h5 className="font-semibold text-slate-800">{tr(ruQ, enQ)}</h5><p className="mt-1 text-[11px]">{tr(ruA, enA)}</p></div>)}
      </AccordionItem>
      <AccordionItem id="guide" icon={<BookOpen className="size-4" />} title={tr("Руководство пользователя", "User guide")} open={open.guide} toggle={() => toggle("guide")}>
        {[
          tr("Выберите формат: EAN для розницы, Code 128 или ITF-14 для логистики.", "Choose a format: EAN for retail, Code 128 or ITF-14 for logistics."),
          tr("Введите данные — сервис проверит их и рассчитает контрольную цифру.", "Enter data; the tool validates it and calculates the check digit."),
          tr("Настройте размер и поля, затем скачайте PNG, SVG или PDF.", "Choose the size and quiet zone, then download PNG, SVG or PDF."),
        ].map((text, index) => <div key={text} className="flex gap-2.5 rounded-xl border border-slate-100 bg-slate-50/80 p-2.5"><span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[11px] font-bold text-blue-700">{index + 1}</span><p className="text-[11px]">{text}</p></div>)}
      </AccordionItem>
      <AccordionItem id="commercial" icon={<FileText className="size-4" />} title={tr("Использование в коммерческих целях", "Commercial use")} open={open.commercial} toggle={() => toggle("commercial")}>
        {[
          tr("Бесплатно для маркетплейсов, полиграфии и складов.", "Free for marketplaces, printing and warehouse use."),
          tr("Для торговых сетей нужен официальный префикс GS1.", "Retail distribution requires an official GS1 company prefix."),
          tr("Штрихкоды создаются локально; данные не отправляются на сервер.", "Barcodes are created locally; data is never sent to a server."),
        ].map((text) => <div key={text} className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50/80 p-2.5"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" /><p className="text-[11px]">{text}</p></div>)}
      </AccordionItem>
    </div>
  );
}
