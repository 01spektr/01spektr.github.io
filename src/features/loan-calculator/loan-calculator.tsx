import { Link } from "@tanstack/react-router";
import {
  BarChart3,
  Calculator,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  Copy,
  CreditCard,
  Heart,
  Landmark,
  ListOrdered,
  Percent,
  Printer,
  RotateCcw,
  Share2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ToolIcon } from "@/components/tool-icon";
import { useI18n } from "@/lib/i18n";
import { LOCALES, type Locale } from "@/lib/i18n/config";
import { recordHistory } from "@/lib/tools/history";
import { isFavorite, toggleFavorite } from "@/lib/tools/favorites";
import { buildShareUrl, shareUrl } from "@/lib/tools/share";
import "./loan-calculator.css";

type PaymentType = "annuity" | "differentiated";
type Tab = "result" | "schedule" | "details";
type Params = {
  amount: number;
  termMonths: number;
  interestRate: number;
  paymentType: PaymentType;
  downPayment: number;
  fees: number;
  insurance: number;
};
type Payment = {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
};

const DEFAULTS: Params = {
  amount: 100_000,
  termMonths: 36,
  interestRate: 12,
  paymentType: "annuity",
  downPayment: 0,
  fees: 0,
  insurance: 0,
};
let activeCurrency = "$";

const copy = {
  ru: {
    home: "Главная",
    category: "Финансы и инвестиции",
    title: "Кредитный калькулятор",
    subtitle: "Рассчитайте ежемесячный платёж, переплату и полную стоимость кредита.",
    tipTitle: "Планируйте финансы разумно",
    tipBody: "Сравнивайте условия и выбирайте лучший вариант",
    favorite: "В избранное",
    share: "Поделиться",
    settings: "Параметры кредита",
    reset: "Сбросить",
    amount: "Сумма кредита",
    term: "Срок кредита",
    months: "месяцев",
    years: "лет",
    rate: "Годовая процентная ставка",
    paymentType: "Тип платежей",
    annuity: "Аннуитетные",
    annuityHint: "Равные платежи каждый месяц",
    differentiated: "Дифференцированные",
    differentiatedHint: "Платёж уменьшается со временем",
    extra: "Дополнительные параметры",
    downPayment: "Первоначальный взнос",
    fees: "Единовременные комиссии",
    insurance: "Страхование в год",
    calculate: "Рассчитать",
    result: "Результат",
    schedule: "График платежей",
    details: "Детали",
    monthly: "Ежемесячный платёж",
    from: "от",
    total: "Общая сумма выплат",
    overpay: "Переплата",
    loanAmount: "Сумма кредита",
    annualRate: "Процентная ставка",
    duration: "Срок",
    shareOverpay: "Доля переплаты",
    principal: "Основной долг",
    interest: "Проценты",
    showTable: "Показать таблицу платежей",
    month: "Месяц",
    payment: "Платёж",
    debt: "Тело кредита",
    balance: "Остаток",
    structure: "Структура полной стоимости",
    included: "Учтены комиссии и страховка",
    noExtra: "Без дополнительных расходов",
    copied: "Ссылка на расчёт скопирована",
    updated: "Расчёт обновлён",
  },
  en: {
    home: "Home",
    category: "Finance & investing",
    title: "Loan calculator",
    subtitle: "Calculate your monthly payment, total interest and total loan cost.",
    tipTitle: "Plan your finances wisely",
    tipBody: "Compare terms and choose the best option",
    favorite: "Favorite",
    share: "Share",
    settings: "Loan settings",
    reset: "Reset",
    amount: "Loan amount",
    term: "Loan term",
    months: "months",
    years: "years",
    rate: "Annual interest rate",
    paymentType: "Payment type",
    annuity: "Annuity",
    annuityHint: "The same payment each month",
    differentiated: "Differentiated",
    differentiatedHint: "Payment decreases over time",
    extra: "Additional settings",
    downPayment: "Down payment",
    fees: "One-time fees",
    insurance: "Annual insurance",
    calculate: "Calculate",
    result: "Result",
    schedule: "Payment schedule",
    details: "Details",
    monthly: "Monthly payment",
    from: "from",
    total: "Total repayment",
    overpay: "Total interest",
    loanAmount: "Loan amount",
    annualRate: "Interest rate",
    duration: "Term",
    shareOverpay: "Interest share",
    principal: "Principal",
    interest: "Interest",
    showTable: "Show payment table",
    month: "Month",
    payment: "Payment",
    debt: "Principal",
    balance: "Balance",
    structure: "Total cost breakdown",
    included: "Fees and insurance included",
    noExtra: "No additional expenses",
    copied: "Loan link copied",
    updated: "Calculation updated",
  },
  uz: {
    home: "Bosh sahifa",
    category: "Moliya va investitsiyalar",
    title: "Kredit kalkulyatori",
    subtitle: "Oylik to‘lov, ortiqcha to‘lov va kreditning umumiy qiymatini hisoblang.",
    tipTitle: "Moliyangizni oqilona rejalashtiring",
    tipBody: "Shartlarni solishtiring va eng yaxshi variantni tanlang",
    favorite: "Sevimlilarga qo‘shish",
    share: "Ulashish",
    settings: "Kredit parametrlari",
    reset: "Tiklash",
    amount: "Kredit summasi",
    term: "Kredit muddati",
    months: "oy",
    years: "yil",
    rate: "Yillik foiz stavkasi",
    paymentType: "To‘lov turi",
    annuity: "Annuitet",
    annuityHint: "Har oy teng to‘lov",
    differentiated: "Differensial",
    differentiatedHint: "To‘lov vaqt o‘tishi bilan kamayadi",
    extra: "Qo‘shimcha parametrlar",
    downPayment: "Boshlang‘ich to‘lov",
    fees: "Bir martalik komissiyalar",
    insurance: "Yillik sug‘urta",
    calculate: "Hisoblash",
    result: "Natija",
    schedule: "To‘lovlar jadvali",
    details: "Tafsilotlar",
    monthly: "Oylik to‘lov",
    from: "dan",
    total: "Umumiy to‘lov summasi",
    overpay: "Ortiqcha to‘lov",
    loanAmount: "Kredit summasi",
    annualRate: "Foiz stavkasi",
    duration: "Muddat",
    shareOverpay: "Ortiqcha to‘lov ulushi",
    principal: "Asosiy qarz",
    interest: "Foizlar",
    showTable: "To‘lovlar jadvalini ko‘rsatish",
    month: "Oy",
    payment: "To‘lov",
    debt: "Kredit tanasi",
    balance: "Qoldiq",
    structure: "Umumiy qiymat tarkibi",
    included: "Komissiya va sug‘urta hisobga olingan",
    noExtra: "Qo‘shimcha xarajatlarsiz",
    copied: "Hisob-kitob havolasi nusxalandi",
    updated: "Hisob-kitob yangilandi",
  },
} as const;

function calculate(params: Params) {
  const principalAmount = Math.max(0, params.amount - params.downPayment);
  const months = Math.max(1, Math.round(params.termMonths));
  const monthlyRate = Math.max(0, params.interestRate) / 1200;
  const basePayment =
    monthlyRate === 0
      ? principalAmount / months
      : (principalAmount * monthlyRate * (1 + monthlyRate) ** months) /
        ((1 + monthlyRate) ** months - 1);
  let balance = principalAmount;
  const schedule: Payment[] = Array.from({ length: months }, (_, index) => {
    const interest = balance * monthlyRate;
    const principal =
      index === months - 1
        ? balance
        : params.paymentType === "annuity"
          ? Math.max(0, basePayment - interest)
          : principalAmount / months;
    const payment = principal + interest;
    balance = Math.max(0, balance - principal);
    return { month: index + 1, payment, principal, interest, balance };
  });
  const repayments = schedule.reduce((sum, item) => sum + item.payment, 0);
  const extras = Math.max(0, params.fees) + Math.max(0, params.insurance) * (months / 12);
  const total = repayments + extras;
  const overpay = Math.max(0, total - principalAmount);
  return {
    principalAmount,
    schedule,
    total,
    overpay,
    extras,
    monthly: params.paymentType === "annuity" ? basePayment : (schedule[0]?.payment ?? 0),
    lastMonthly: schedule.at(-1)?.payment ?? 0,
    overpayPercent: principalAmount ? (overpay / principalAmount) * 100 : 0,
  };
}

function createLoanPdfPages({
  params,
  result,
  locale,
  currency,
  t,
}: {
  params: Params;
  result: ReturnType<typeof calculate>;
  locale: Locale;
  currency: string;
  t: (typeof copy)[Locale];
}) {
  const canvas = document.createElement("canvas");
  canvas.width = 1240;
  canvas.height = 1754;
  const ctx = canvas.getContext("2d")!;
  const pages: Uint8Array[] = [];
  const drawText = (text: string, x: number, y: number, size = 28, color = "#102342") => {
    ctx.fillStyle = color;
    ctx.font = `${size}px Inter, Arial, sans-serif`;
    ctx.fillText(text, x, y);
  };
  const page = (index: number) => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#2878ed";
    ctx.fillRect(0, 0, canvas.width, 24);
    drawText("toolboxi.uz", 72, 92, 30, "#2878ed");
    drawText(t.title, 72, 165, 46);
    drawText(
      `${t.amount}: ${moneyText(params.amount, locale, currency)} · ${t.term}: ${params.termMonths} · ${t.rate}: ${params.interestRate}%`,
      72,
      212,
      23,
      "#62718b",
    );
    drawText(`${locale === "ru" ? "Страница" : locale === "uz" ? "Sahifa" : "Page"} ${index}`, 1040, 1690, 20, "#62718b");
  };
  page(1);
  drawText(t.monthly, 72, 300, 24, "#62718b");
  drawText(moneyText(result.monthly, locale, currency), 72, 365, 60, "#2878ed");
  drawText(t.total, 560, 300, 24, "#62718b");
  drawText(moneyText(result.total, locale, currency), 560, 342, 34);
  drawText(t.overpay, 900, 300, 24, "#62718b");
  drawText(moneyText(result.overpay, locale, currency), 900, 342, 34);
  drawText(t.schedule, 72, 465, 32);
  const items =
    result.schedule.length > 24
      ? result.schedule.filter(
          (_, i) =>
            i % Math.ceil(result.schedule.length / 24) === 0 || i === result.schedule.length - 1,
        )
      : result.schedule;
  const max = Math.max(...items.map((item) => item.payment), 1);
  const x = 105;
  const y = 1060;
  const h = 480;
  const w = 1020 / items.length;
  ctx.strokeStyle = "#dce5f2";
  for (let row = 0; row < 5; row++) {
    const lineY = y - (h / 4) * row;
    ctx.beginPath();
    ctx.moveTo(x, lineY);
    ctx.lineTo(x + 1020, lineY);
    ctx.stroke();
  }
  items.forEach((item, index) => {
    const principalH = (item.principal / max) * h;
    const interestH = (item.interest / max) * h;
    ctx.fillStyle = "#b9d5fb";
    ctx.fillRect(x + index * w + 3, y - principalH - interestH, Math.max(3, w - 6), interestH);
    ctx.fillStyle = "#2878ed";
    ctx.fillRect(x + index * w + 3, y - principalH, Math.max(3, w - 6), principalH);
  });
  drawText(t.principal, 72, 1125, 21, "#2878ed");
  drawText(t.interest, 300, 1125, 21, "#5688c7");
  pages.push(dataUrlBytes(canvas.toDataURL("image/jpeg", 0.93)));
  for (let start = 0, pageNumber = 2; start < result.schedule.length; start += 28, pageNumber++) {
    page(pageNumber);
    const rows = result.schedule.slice(start, start + 28);
    const headers = [t.month, t.payment, t.debt, t.interest, t.balance];
    ctx.fillStyle = "#f2f7ff";
    ctx.fillRect(72, 270, 1096, 45);
    headers.forEach((header, index) => drawText(header, 85 + index * 215, 300, 18, "#52719e"));
    rows.forEach((row, index) => {
      const yy = 350 + index * 43;
      ctx.strokeStyle = "#dce5f2";
      ctx.beginPath();
      ctx.moveTo(72, yy + 15);
      ctx.lineTo(1168, yy + 15);
      ctx.stroke();
      [
        String(row.month),
        moneyText(row.payment, locale, currency),
        moneyText(row.principal, locale, currency),
        moneyText(row.interest, locale, currency),
        moneyText(row.balance, locale, currency),
      ].forEach((value, col) =>
        drawText(
          value,
          85 + col * 215,
          yy,
          18,
          col === 2 ? "#2878ed" : col === 3 ? "#5688c7" : "#102342",
        ),
      );
    });
    pages.push(dataUrlBytes(canvas.toDataURL("image/jpeg", 0.93)));
  }
  return pages;
}
function dataUrlBytes(dataUrl: string) {
  const raw = atob(dataUrl.split(",")[1]);
  return Uint8Array.from(raw, (char) => char.charCodeAt(0));
}
function createImagePdf(images: Uint8Array[]) {
  const encoder = new TextEncoder();
  const chunks: Uint8Array[] = [];
  const offsets: number[] = [0];
  let size = 0;
  const push = (value: string | Uint8Array) => {
    const bytes = typeof value === "string" ? encoder.encode(value) : value;
    chunks.push(bytes);
    size += bytes.length;
  };
  const object = (id: number, body: string | Uint8Array) => {
    offsets[id] = size;
    push(`${id} 0 obj\n`);
    if (body instanceof Uint8Array) push(body);
    else push(body);
    push("\nendobj\n");
  };
  push("%PDF-1.4\n%");
  push(new Uint8Array([0xe2, 0xe3, 0xcf, 0xd3]));
  push("\n");
  const count = images.length;
  object(1, "<< /Type /Catalog /Pages 2 0 R >>");
  object(
    2,
    `<< /Type /Pages /Kids [${images.map((_, i) => `${3 + i * 3} 0 R`).join(" ")}] /Count ${count} >>`,
  );
  images.forEach((image, i) => {
    const pageId = 3 + i * 3,
      imageId = pageId + 1,
      contentId = pageId + 2;
    object(
      pageId,
      `<< /Type /Page /Parent 2 0 R /Resources << /XObject << /Im${i} ${imageId} 0 R >> >> /MediaBox [0 0 595 842] /Contents ${contentId} 0 R >>`,
    );
    offsets[imageId] = size;
    push(
      `${imageId} 0 obj\n<< /Type /XObject /Subtype /Image /Width 1240 /Height 1754 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${image.length} >>\nstream\n`,
    );
    push(image);
    push("\nendstream\nendobj\n");
    object(contentId, `<< /Length 30 >>\nstream\nq\n595 0 0 842 0 0 cm\n/Im${i} Do\nQ\nendstream`);
  });
  const xref = size;
  push(`xref\n0 ${offsets.length}\n0000000000 65535 f \n`);
  for (let i = 1; i < offsets.length; i++)
    push(`${String(offsets[i]).padStart(10, "0")} 00000 n \n`);
  push(`trailer\n<< /Size ${offsets.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`);
  const total = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const output = new Uint8Array(total);
  let offset = 0;
  chunks.forEach((chunk) => {
    output.set(chunk, offset);
    offset += chunk.length;
  });
  return output;
}

const number = (value: number, locale: Locale, digits = 0) =>
  new Intl.NumberFormat(LOCALES[locale].numberLocale, {
    maximumFractionDigits: digits,
  }).format(Number.isFinite(value) ? value : 0);

const moneyText = (value: number, locale: Locale, currency = activeCurrency) =>
  currency === "сум" ? `${number(value, locale)} сум` : `${currency}${number(value, locale)}`;

function Money({
  value,
  locale,
  className,
}: {
  value: number;
  locale: Locale;
  className?: string;
}) {
  return <span className={className}>{moneyText(value, locale)}</span>;
}

export function LoanCalculatorPage() {
  const { locale } = useI18n();
  const t = copy[locale];
  const [params, setParams] = useState<Params>(DEFAULTS);
  const [tab, setTab] = useState<Tab>("result");
  const [extraOpen, setExtraOpen] = useState(false);
  const [tableOpen, setTableOpen] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [currency, setCurrency] = useState("$");
  activeCurrency = currency;
  const result = useMemo(() => calculate(params), [params]);
  const patch = (next: Partial<Params>) => setParams((current) => ({ ...current, ...next }));

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const read = (key: string, fallback: number) => {
      const value = Number(query.get(key));
      return Number.isFinite(value) && value >= 0 ? value : fallback;
    };
    if (query.has("amount") || query.has("term") || query.has("rate")) {
      setParams((current) => ({
        ...current,
        amount: read("amount", current.amount),
        termMonths: Math.max(1, read("term", current.termMonths)),
        interestRate: read("rate", current.interestRate),
        paymentType:
          query.get("type") === "differentiated" ? "differentiated" : current.paymentType,
      }));
    }
  }, []);
  useEffect(() => setFavorite(isFavorite("loan-calculator")), []);

  function setMoney(key: "amount" | "downPayment" | "fees" | "insurance", value: string) {
    const parsed = Number(value.replace(/[^0-9.]/g, ""));
    patch({ [key]: Number.isFinite(parsed) ? Math.max(0, parsed) : 0 });
  }
  function reset() {
    setParams(DEFAULTS);
    setExtraOpen(false);
  }
  function showCalculation() {
    recordHistory({
      toolId: "loan-calculator",
      title: `${number(params.amount, locale)} $ · ${params.interestRate}%`,
      params: {
        amount: String(params.amount),
        term: String(params.termMonths),
        rate: String(params.interestRate),
        type: params.paymentType,
      },
    });
    toast.success(t.updated);
    document.getElementById("loan-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  async function share() {
    const parameters = new URLSearchParams({
      amount: String(params.amount),
      term: String(params.termMonths),
      rate: String(params.interestRate),
      type: params.paymentType,
    });
    const status = await shareUrl(buildShareUrl("/tools/loan-calculator", parameters), t.title);
    if (status === "copied" || status === "shared") toast.success(t.copied);
  }
  function downloadPdf() {
    const pages = createLoanPdfPages({ params, result, locale, currency, t });
    const url = URL.createObjectURL(new Blob([createImagePdf(pages)], { type: "application/pdf" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `toolboxi-loan-${Date.now()}.pdf`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 500);
  }

  const chartItems =
    result.schedule.length > 24
      ? result.schedule.filter(
          (_, index) =>
            index % Math.ceil(result.schedule.length / 24) === 0 ||
            index === result.schedule.length - 1,
        )
      : result.schedule;
  const chartMax = Math.max(...chartItems.map((item) => item.payment), 1);
  const totals = [
    {
      icon: CreditCard,
      label: t.loanAmount,
      value: <Money value={params.amount} locale={locale} />,
    },
    { icon: Percent, label: t.annualRate, value: `${params.interestRate}%` },
    { icon: CalendarDays, label: t.duration, value: `${params.termMonths} ${t.months}` },
    {
      icon: CircleDollarSign,
      label: t.shareOverpay,
      value: `${number(result.overpayPercent, locale, 1)}%`,
    },
  ];

  return (
    <main className="loan-page">
      <nav className="loan-breadcrumb" aria-label="Breadcrumb">
        <Link to="/">
          <span>{t.home}</span>
        </Link>
        <ChevronRight />
        <Link to="/categories/$id" params={{ id: "finance" }}>
          <span>{t.category}</span>
        </Link>
        <ChevronRight />
        <span>{t.title}</span>
      </nav>
      <section className="loan-heading">
        <ToolIcon tool={{ slug: "loan-calculator", icon: "Landmark" }} size="hero" />
        <div>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>
        <div className="loan-currency-picker">
          <button
            className="loan-currency-button"
            type="button"
            aria-label={locale === "uz" ? "Valyuta" : locale === "en" ? "Currency" : "Валюта"}
            onClick={() => setCurrencyOpen((open) => !open)}
          >
            <CircleDollarSign />
            <span>{currency}</span>
          </button>
          {currencyOpen && (
            <div className="loan-currency-menu">
              {["$", "сум", "€", "£", "₽"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setCurrency(item);
                    setCurrencyOpen(false);
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          className={`loan-action loan-favorite${favorite ? " active" : ""}`}
          type="button"
          onClick={() => setFavorite(toggleFavorite("loan-calculator"))}
        >
          <Heart fill={favorite ? "currentColor" : "none"} />
          {t.favorite}
        </button>
        <button className="loan-action" type="button" onClick={share}>
          <Share2 />
          {t.share}
        </button>
      </section>

      <section className="loan-workspace">
        <form
          className="loan-panel loan-form"
          onSubmit={(event) => {
            event.preventDefault();
            showCalculation();
          }}
        >
          <div className="loan-panel-head">
            <h2>{t.settings}</h2>
            <button type="button" onClick={reset}>
              <RotateCcw />
              {t.reset}
            </button>
          </div>
          <div className="loan-form-columns">
            <div className="loan-field-stack">
              <NumberField
                label={t.amount}
                value={params.amount}
                unit="$"
                onChange={(value) => setMoney("amount", value)}
              />
              <Range
                min={1_000}
                max={1_000_000}
                step={1_000}
                value={params.amount}
                onChange={(amount) => patch({ amount })}
                left="$1k"
                right="$1m"
              />
              <NumberField
                label={t.rate}
                value={params.interestRate}
                unit="%"
                onChange={(value) =>
                  patch({ interestRate: Math.min(100, Math.max(0, Number(value) || 0)) })
                }
              />
              <Range
                min={0}
                max={50}
                step={0.1}
                value={params.interestRate}
                onChange={(interestRate) => patch({ interestRate })}
                left="0%"
                right="50%"
              />
            </div>
            <div className="loan-field-stack">
              <NumberField
                label={t.term}
                value={params.termMonths}
                unit={t.months}
                onChange={(value) =>
                  patch({ termMonths: Math.min(600, Math.max(1, Number(value) || 1)) })
                }
              />
              <Range
                min={6}
                max={360}
                step={1}
                value={params.termMonths}
                onChange={(termMonths) => patch({ termMonths })}
                left="6"
                right="360"
              />
              <fieldset className="loan-payment-type">
                <legend>{t.paymentType}</legend>
                <PaymentTypeCard
                  checked={params.paymentType === "annuity"}
                  title={t.annuity}
                  hint={t.annuityHint}
                  onClick={() => patch({ paymentType: "annuity" })}
                />
                <PaymentTypeCard
                  checked={params.paymentType === "differentiated"}
                  title={t.differentiated}
                  hint={t.differentiatedHint}
                  onClick={() => patch({ paymentType: "differentiated" })}
                />
              </fieldset>
            </div>
          </div>
          <div className="loan-extras">
            <button
              type="button"
              onClick={() => setExtraOpen((open) => !open)}
              aria-expanded={extraOpen}
            >
              {t.extra}
              <ChevronDown className={extraOpen ? "is-open" : ""} />
            </button>
            {extraOpen && (
              <div className="loan-extra-grid">
                <NumberField
                  label={t.downPayment}
                  value={params.downPayment}
                  unit="$"
                  onChange={(value) => setMoney("downPayment", value)}
                />
                <NumberField
                  label={t.fees}
                  value={params.fees}
                  unit="$"
                  onChange={(value) => setMoney("fees", value)}
                />
                <NumberField
                  label={t.insurance}
                  value={params.insurance}
                  unit="$"
                  onChange={(value) => setMoney("insurance", value)}
                />
              </div>
            )}
          </div>
          <button className="loan-calculate" type="submit">
            <Calculator />
            {t.calculate}
          </button>
        </form>

        <section className="loan-result-area" id="loan-results">
          <div className="loan-tabs" role="tablist">
            {(["result", "schedule", "details"] as Tab[]).map((value) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={tab === value}
                className={tab === value ? "active" : ""}
                onClick={() => setTab(value)}
              >
                {t[value]}
              </button>
            ))}
          </div>
          {tab === "result" && (
            <>
              <div className="loan-total">
                <div>
                  <span>{t.monthly}</span>
                  <b>
                    <Money value={result.monthly} locale={locale} />
                  </b>
                  {params.paymentType === "differentiated" && (
                    <small>
                      {t.from} <Money value={result.lastMonthly} locale={locale} />
                    </small>
                  )}
                </div>
                <div>
                  <span>{t.total}</span>
                  <strong>
                    <Money value={result.total} locale={locale} />
                  </strong>
                </div>
                <div>
                  <span>{t.overpay}</span>
                  <strong>
                    <Money value={result.overpay} locale={locale} />
                  </strong>
                </div>
              </div>
              <div className="loan-metrics">
                {totals.map(({ icon: Icon, label, value }) => (
                  <div key={label}>
                    <span>
                      <Icon />
                    </span>
                    <p>
                      {label}
                      <b>{value}</b>
                    </p>
                  </div>
                ))}
              </div>
              <div className="loan-chart-card">
                <div className="loan-chart-title">
                  <h2>{t.schedule}</h2>
                  <span>
                    <i />
                    {t.principal}
                    <i />
                    {t.interest}
                  </span>
                </div>
                <div className="loan-chart-layout">
                  <div className="loan-chart-y" aria-hidden="true">
                    <span>${number(chartMax, locale)}</span>
                    <span>${number(chartMax / 2, locale)}</span>
                    <span>$0</span>
                  </div>
                  <div className="loan-chart" aria-label={t.schedule}>
                    {chartItems.map((item) => (
                      <div
                        className="loan-bar"
                        key={item.month}
                        title={`${t.month} ${item.month}: $${number(item.payment, locale)}`}
                      >
                        <em style={{ height: `${(item.interest / chartMax) * 100}%` }} />
                        <span style={{ height: `${(item.principal / chartMax) * 100}%` }} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="loan-chart-axis">
                  <span>1</span>
                  <span>{Math.ceil(params.termMonths / 2)}</span>
                  <span>{params.termMonths}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setTableOpen(true);
                    setTab("schedule");
                  }}
                >
                  <ListOrdered />
                  {t.showTable}
                  <ChevronRight />
                </button>
                <button className="loan-pdf-button" type="button" onClick={downloadPdf}>
                  <Printer />
                  {locale === "uz" ? "PDF sifatida saqlash" : locale === "en" ? "Save as PDF" : "Сохранить в PDF"}
                </button>
              </div>
            </>
          )}
          {tab === "schedule" && (
            <Schedule
              tableOpen={tableOpen}
              rows={result.schedule}
              locale={locale}
              t={t}
              onPdf={downloadPdf}
            />
          )}
          {tab === "details" && <Details result={result} locale={locale} t={t} />}
        </section>
      </section>
      <LoanInfo locale={locale} />
    </main>
  );
}

function NumberField({
  label,
  value,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  unit: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="loan-number-field">
      <span>{label}</span>
      <div>
        <input
          value={Number.isFinite(value) ? String(value) : ""}
          inputMode="decimal"
          onChange={(event) => onChange(event.target.value)}
        />
        <b>{unit}</b>
      </div>
    </label>
  );
}
function Range({
  min,
  max,
  step,
  value,
  onChange,
  left,
  right,
}: {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  left: string;
  right: string;
}) {
  return (
    <label className="loan-range">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={Math.min(max, Math.max(min, value))}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <span>
        <small>{left}</small>
        <small>{right}</small>
      </span>
    </label>
  );
}
function PaymentTypeCard({
  checked,
  title,
  hint,
  onClick,
}: {
  checked: boolean;
  title: string;
  hint: string;
  onClick: () => void;
}) {
  return (
    <button type="button" className={checked ? "selected" : ""} onClick={onClick}>
      <i>{checked && <Check />}</i>
      <span>
        <b>{title}</b>
        <small>{hint}</small>
      </span>
    </button>
  );
}
function Schedule({
  rows,
  locale,
  t,
  onPdf,
}: {
  tableOpen: boolean;
  rows: Payment[];
  locale: Locale;
  t: (typeof copy)[Locale];
  onPdf: () => void;
}) {
  return (
    <div className="loan-schedule-panel">
      <div className="loan-schedule-head">
        <div>
          <h2>{t.schedule}</h2>
          <p>
            {locale === "uz"
              ? "Har oy uchun asosiy qarz, foizlar va qolgan summa."
              : locale === "en"
                ? "Principal, interest and remaining balance for every month."
                : "Основной долг, проценты и остаток по каждому месяцу."}
          </p>
        </div>
        <button type="button" onClick={onPdf}>
          <Printer />
          {locale === "uz" ? "PDF sifatida saqlash" : locale === "en" ? "Save as PDF" : "Сохранить в PDF"}
        </button>
      </div>
      <div className="loan-table-wrap">
        <table className="loan-payment-table">
          <thead>
            <tr>
              <th>{t.month}</th>
              <th>{t.payment}</th>
              <th>{t.debt}</th>
              <th>{t.interest}</th>
              <th>{t.balance}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.month}>
                <td>{row.month}</td>
                <td className="loan-payment-value">
                  <Money value={row.payment} locale={locale} />
                </td>
                <td className="loan-principal-value">
                  <Money value={row.principal} locale={locale} />
                </td>
                <td className="loan-interest-value">
                  <Money value={row.interest} locale={locale} />
                </td>
                <td>
                  <Money value={row.balance} locale={locale} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
function Details({
  result,
  locale,
  t,
}: {
  result: ReturnType<typeof calculate>;
  locale: Locale;
  t: (typeof copy)[Locale];
}) {
  const interest = Math.max(0, result.overpay - result.extras);
  const parts = [
    { label: t.principal, value: result.principalAmount, color: "#2878ed" },
    { label: t.interest, value: interest, color: "#a9cbff" },
    { label: t.included, value: result.extras, color: "#31c48d" },
  ].filter((part) => part.value > 0);
  return (
    <div className="loan-details">
      <h2>{t.structure}</h2>
      <div className="loan-breakdown">
        {parts.map((part) => (
          <div key={part.label}>
            <span
              style={{ width: `${(part.value / result.total) * 100}%`, background: part.color }}
            />
            <p>
              {part.label}
              <b>
                <Money value={part.value} locale={locale} />
              </b>
            </p>
          </div>
        ))}
      </div>
      <p>{result.extras > 0 ? t.included : t.noExtra}</p>
    </div>
  );
}

function LoanInfo({ locale }: { locale: Locale }) {
  const en = locale === "en";
  const uz = locale === "uz";
  const steps = uz
    ? [
        "Kredit summasini kiriting",
        "Muddat va foiz stavkasini belgilang",
        "To‘lov turini tanlang",
        "Natija va jadvalni ko‘rib chiqing",
      ]
    : en
    ? [
        "Enter the loan amount",
        "Set the term and interest rate",
        "Choose a payment type",
        "Review the result and schedule",
      ]
    : [
        "Введите сумму кредита",
        "Укажите срок и процентную ставку",
        "Выберите тип платежей",
        "Ознакомьтесь с результатом и графиком",
      ];
  const tips = uz
    ? [
        "Kattaroq boshlang‘ich to‘lov umumiy foizni kamaytiradi.",
        "Bir nechta bank takliflarini solishtiring.",
        "Komissiyalar va yillik sug‘urtani hisobga oling.",
        "Muddatidan oldin to‘lash shartlarini tekshiring.",
      ]
    : en
    ? [
        "A larger down payment reduces total interest.",
        "Compare offers from several lenders.",
        "Review fees and annual insurance.",
        "Check whether early repayment is available.",
      ]
    : [
        "Больший первоначальный взнос уменьшает переплату.",
        "Сравнивайте предложения нескольких банков.",
        "Учитывайте комиссии и ежегодную страховку.",
        "Проверьте условия досрочного погашения.",
      ];
  const questions = uz
    ? [
        "Annuitet to‘lovi nima?",
        "Oylik to‘lov qanday hisoblanadi?",
        "Muddatidan oldin to‘lashni hisobga olish mumkinmi?",
      ]
    : en
    ? [
        "What is an annuity payment?",
        "How is the monthly payment calculated?",
        "Can I account for early repayment?",
      ]
    : [
        "Что такое аннуитетный платёж?",
        "Как рассчитывается ежемесячный платёж?",
        "Можно ли учесть досрочное погашение?",
      ];
  return (
    <section className="loan-info-grid">
      <article>
        <div className="loan-info-title">
          <ListOrdered />
          <h2>{uz ? "Qanday foydalaniladi" : en ? "How to use" : "Как пользоваться"}</h2>
        </div>
        <ol>
          {steps.map((step, index) => (
            <li key={step}>
              <i>{index + 1}</i>
              {step}
            </li>
          ))}
        </ol>
      </article>
      <article>
        <div className="loan-info-title">
          <Check />
          <h2>{uz ? "Foydali maslahatlar" : en ? "Useful tips" : "Полезные советы"}</h2>
        </div>
        <ul>
          {tips.map((tip) => (
            <li key={tip}>
              <Check />
              {tip}
            </li>
          ))}
        </ul>
      </article>
      <article>
        <div className="loan-info-title">
          <CircleDollarSign />
          <h2>{uz ? "Ko‘p so‘raladigan savollar" : en ? "Frequently asked questions" : "Частые вопросы"}</h2>
        </div>
        <div className="loan-faq">
          {questions.map((question) => (
            <details key={question}>
              <summary>
                {question}
                <ChevronDown />
              </summary>
              <p>
                {uz
                  ? "Kredit sozlamalari o‘zgartirilganda kalkulyator jadvalni darhol qayta hisoblaydi."
                  : en
                    ? "The calculator updates the schedule immediately when you change the loan settings."
                    : "Калькулятор сразу пересчитывает график при изменении параметров кредита."}
              </p>
            </details>
          ))}
        </div>
      </article>
    </section>
  );
}
