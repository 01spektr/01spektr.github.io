import {
  LoanCalculationResult,
  LoanParams,
  PaymentScheduleItem,
  BankRatePreset,
  ExampleLoanItem,
  Currency,
} from "../types";

/**
 * Formats a number with space separators for readability (e.g., 100 000 or 100 000,00)
 */
export function formatCurrencyNumber(value: number, roundToInteger: boolean = true): string {
  if (isNaN(value) || !isFinite(value)) return "0";
  if (roundToInteger) {
    return Math.round(value)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }
  const parts = value.toFixed(2).split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return parts.join(",");
}

/**
 * Formats full value with currency suffix
 */
export function formatMoney(
  value: number,
  currency: string = "$",
  roundToInteger: boolean = true,
): string {
  return `${formatCurrencyNumber(value, roundToInteger)} ${currency}`;
}

/**
 * Calculates loan schedule, monthly payments, total amount and overpayment
 */
export function calculateLoan(params: LoanParams): LoanCalculationResult {
  const {
    amount,
    termMonths,
    interestRate,
    paymentType,
    downPayment = 0,
    oneTimeFees = 0,
    annualInsurance = 0,
    roundToInteger = true,
  } = params;

  const principal = Math.max(0, amount - downPayment);
  const n = Math.max(1, Math.round(termMonths));
  const r = interestRate / 100 / 12;

  const schedule: PaymentScheduleItem[] = [];
  let remainingBalance = principal;
  let totalInterest = 0;

  let fixedMonthlyPayment = 0;
  if (r === 0) {
    fixedMonthlyPayment = principal / n;
  } else {
    const factor = Math.pow(1 + r, n);
    fixedMonthlyPayment = (principal * (r * factor)) / (factor - 1);
  }

  const fixedPrincipalDifferentiated = principal / n;

  for (let month = 1; month <= n; month++) {
    const interestForMonth = remainingBalance * r;
    totalInterest += interestForMonth;

    let principalPaid = 0;
    let paymentForMonth = 0;

    if (paymentType === "annuity") {
      if (month === n) {
        // Final month adjustment
        principalPaid = remainingBalance;
        paymentForMonth = principalPaid + interestForMonth;
        remainingBalance = 0;
      } else {
        paymentForMonth = fixedMonthlyPayment;
        principalPaid = paymentForMonth - interestForMonth;
        remainingBalance = Math.max(0, remainingBalance - principalPaid);
      }
    } else {
      // Differentiated
      principalPaid = month === n ? remainingBalance : fixedPrincipalDifferentiated;
      paymentForMonth = principalPaid + interestForMonth;
      remainingBalance = Math.max(0, remainingBalance - principalPaid);
    }

    schedule.push({
      month,
      payment: roundToInteger ? Math.round(paymentForMonth) : paymentForMonth,
      principal: roundToInteger ? Math.round(principalPaid) : principalPaid,
      interest: roundToInteger ? Math.round(interestForMonth) : interestForMonth,
      remainingBalance: roundToInteger ? Math.round(remainingBalance) : remainingBalance,
    });
  }

  const totalFeesAndInsurance = oneTimeFees + annualInsurance * (n / 12);
  const totalLoanRepayments = schedule.reduce((sum, item) => sum + item.payment, 0);
  const totalPayment = totalLoanRepayments + totalFeesAndInsurance;
  const overpayment = Math.max(0, totalPayment - principal);
  const overpaymentPercentage = principal > 0 ? (overpayment / principal) * 100 : 0;

  const firstMonthlyPayment = schedule.length > 0 ? schedule[0].payment : 0;
  const lastMonthlyPayment = schedule.length > 0 ? schedule[schedule.length - 1].payment : 0;

  // Approximate Effective Annual Rate (APR / ПСК) including fees
  const feeAnnualized = principal > 0 ? (totalFeesAndInsurance / principal / (n / 12)) * 100 : 0;
  const effectiveRate = interestRate + feeAnnualized;

  return {
    monthlyPayment: roundToInteger ? Math.round(fixedMonthlyPayment) : fixedMonthlyPayment,
    firstMonthlyPayment,
    lastMonthlyPayment,
    totalPayment: roundToInteger ? Math.round(totalPayment) : totalPayment,
    principalAmount: principal,
    overpayment: roundToInteger ? Math.round(overpayment) : overpayment,
    overpaymentPercentage,
    totalFeesAndInsurance,
    effectiveRate: Number(effectiveRate.toFixed(2)),
    schedule,
  };
}

/**
 * Global World Benchmark Rates (Актуальные мировые ставки по кредитам)
 */
export const GLOBAL_BANK_RATES: BankRatePreset[] = [
  // Автокредиты по миру (в фокусе)
  {
    countryCode: "US",
    countryName: "США",
    countryNameEn: "USA",
    countryNameUz: "AQSH",
    productName: "Автокредит (новый авто)",
    productNameEn: "Auto Loan (New Car)",
    productNameUz: "Avtokredit (yangi avto)",
    rate: 7.2,
    category: "auto",
    region: "Северная Америка",
    isPopular: true,
  },
  {
    countryCode: "US",
    countryName: "США",
    countryNameEn: "USA",
    countryNameUz: "AQSH",
    productName: "Автокредит с пробегом (Used Car)",
    productNameEn: "Used Car Auto Loan",
    productNameUz: "Ishlatilgan avto krediti",
    rate: 9.2,
    category: "auto",
    region: "Северная Америка",
  },
  {
    countryCode: "DE",
    countryName: "Германия",
    countryNameEn: "Germany",
    countryNameUz: "Germaniya",
    productName: "Автокредит (ADAC / Банки)",
    productNameEn: "Auto Loan (ADAC / Banks)",
    productNameUz: "Avtokredit (ADAC / Banklar)",
    rate: 5.4,
    category: "auto",
    region: "Европа",
    isPopular: true,
  },
  {
    countryCode: "FR",
    countryName: "Франция",
    countryNameEn: "France",
    countryNameUz: "Fransiya",
    productName: "Автокредит для физлиц",
    productNameEn: "Personal Auto Loan",
    productNameUz: "Jismoniy shaxslar avtokrediti",
    rate: 4.8,
    category: "auto",
    region: "Европа",
  },
  {
    countryCode: "GB",
    countryName: "Великобритания",
    countryNameEn: "United Kingdom",
    countryNameUz: "Buyuk Britaniya",
    productName: "Автокредит / Hire Purchase (HP)",
    productNameEn: "Auto Loan / HP Agreement",
    productNameUz: "Avtokredit / HP shartnomasi",
    rate: 6.4,
    category: "auto",
    region: "Европа",
  },
  {
    countryCode: "CA",
    countryName: "Канада",
    countryNameEn: "Canada",
    countryNameUz: "Kanada",
    productName: "Автокредит стандартный",
    productNameEn: "Auto Loan Standard",
    productNameUz: "Standart avtokredit",
    rate: 6.9,
    category: "auto",
    region: "Северная Америка",
  },
  {
    countryCode: "IT",
    countryName: "Италия",
    countryNameEn: "Italy",
    countryNameUz: "Italiya",
    productName: "Автокредит (Prestito Auto)",
    productNameEn: "Auto Loan (Prestito Auto)",
    productNameUz: "Avtokredit (Prestito Auto)",
    rate: 5.9,
    category: "auto",
    region: "Европа",
  },
  {
    countryCode: "ES",
    countryName: "Испания",
    countryNameEn: "Spain",
    countryNameUz: "Ispaniya",
    productName: "Автокредит (Préstamo Coche)",
    productNameEn: "Car Loan (Préstamo Coche)",
    productNameUz: "Avtokredit (Préstamo Coche)",
    rate: 6.2,
    category: "auto",
    region: "Европа",
  },
  {
    countryCode: "JP",
    countryName: "Япония",
    countryNameEn: "Japan",
    countryNameUz: "Yaponiya",
    productName: "Автокредит (JACCS / SMBC)",
    productNameEn: "Auto Loan (JACCS / SMBC)",
    productNameUz: "Avtokredit (JACCS / SMBC)",
    rate: 2.4,
    category: "auto",
    region: "Азия",
  },
  {
    countryCode: "KR",
    countryName: "Южная Корея",
    countryNameEn: "South Korea",
    countryNameUz: "Janubiy Koreya",
    productName: "Автокредит (Hyundai / KB)",
    productNameEn: "Auto Loan (Hyundai / KB)",
    productNameUz: "Avtokredit (Hyundai / KB)",
    rate: 5.2,
    category: "auto",
    region: "Азия",
  },
  {
    countryCode: "CN",
    countryName: "Китай",
    countryNameEn: "China",
    countryNameUz: "Xitoy",
    productName: "Автокредит (Электромобили NEV)",
    productNameEn: "NEV Electric Car Loan",
    productNameUz: "Elektromobil avtokrediti (NEV)",
    rate: 3.2,
    category: "auto",
    region: "Азия",
  },
  {
    countryCode: "AE",
    countryName: "ОАЭ",
    countryNameEn: "UAE",
    countryNameUz: "BAA",
    productName: "Автофинансирование Дубай",
    productNameEn: "Dubai Auto Finance",
    productNameUz: "Dubay avtomoliyalash",
    rate: 3.6,
    category: "auto",
    region: "Ближний Восток",
    isPopular: true,
  },
  {
    countryCode: "SA",
    countryName: "Саудовская Аравия",
    countryNameEn: "Saudi Arabia",
    countryNameUz: "Saudiya Arabistoni",
    productName: "Авто Мурабаха (Эр-Рияд)",
    productNameEn: "Riyadh Auto Murabaha",
    productNameUz: "Riyoz avto murobahasi",
    rate: 4.1,
    category: "auto",
    region: "Ближний Восток",
  },
  {
    countryCode: "KZ",
    countryName: "Казахстан",
    countryNameEn: "Kazakhstan",
    countryNameUz: "Qozogʻiston",
    productName: "Автокредитование стандарт",
    productNameEn: "Auto Financing Standard",
    productNameUz: "Standart avtokreditlash",
    rate: 14.5,
    category: "auto",
    region: "СНГ",
  },
  {
    countryCode: "KZ",
    countryName: "Казахстан",
    countryNameEn: "Kazakhstan",
    countryNameUz: "Qozogʻiston",
    productName: "Гос. автокредит 4% (льготный)",
    productNameEn: "State Subsidized Auto Loan 4%",
    productNameUz: "Davlat imtiyozli avtokrediti 4%",
    rate: 4.0,
    category: "auto",
    region: "СНГ",
    isPopular: true,
  },
  {
    countryCode: "UZ",
    countryName: "Узбекистан",
    countryNameEn: "Uzbekistan",
    countryNameUz: "Oʻzbekiston",
    productName: "Автокредит на первичном рынке",
    productNameEn: "Primary Market Auto Loan",
    productNameUz: "Birlamchi bozor avtokrediti",
    rate: 23.5,
    category: "auto",
    region: "СНГ",
    isPopular: true,
  },
  {
    countryCode: "UZ",
    countryName: "Узбекистан",
    countryNameEn: "Uzbekistan",
    countryNameUz: "Oʻzbekiston",
    productName: "Льготный автокредит (Электромобили)",
    productNameEn: "Green EV Concessionary Auto Loan",
    productNameUz: "Elektromobillar uchun yashil kredit",
    rate: 18.0,
    category: "auto",
    region: "СНГ",
  },
  {
    countryCode: "RU",
    countryName: "Россия",
    countryNameEn: "Russia",
    countryNameUz: "Rossiya",
    productName: "Автокредит с господдержкой",
    productNameEn: "State Supported Auto Loan",
    productNameUz: "Davlat qo‘llab-quvvatlagan avtokredit",
    rate: 16.5,
    category: "auto",
    region: "СНГ",
  },
  {
    countryCode: "RU",
    countryName: "Россия",
    countryNameEn: "Russia",
    countryNameUz: "Rossiya",
    productName: "Автокредит в автосалоне",
    productNameEn: "Dealership Auto Loan",
    productNameUz: "Avtosalon avtokrediti",
    rate: 22.0,
    category: "auto",
    region: "СНГ",
  },
  {
    countryCode: "TR",
    countryName: "Турция",
    countryNameEn: "Turkey",
    countryNameUz: "Turkiya",
    productName: "Автокредит (Taşıt Kredisi)",
    productNameEn: "Vehicle Loan (Taşıt Kredisi)",
    productNameUz: "Avtokredit (Taşıt Kredisi)",
    rate: 36.0,
    category: "auto",
    region: "Евразия",
  },
  {
    countryCode: "AU",
    countryName: "Австралия",
    countryNameEn: "Australia",
    countryNameUz: "Avstraliya",
    productName: "Автокредит фиксированный",
    productNameEn: "Fixed Car Loan Standard",
    productNameUz: "Qatʼiy stavkali avtokredit",
    rate: 6.5,
    category: "auto",
    region: "Океания",
  },

  // Ипотека по миру
  {
    countryCode: "US",
    countryName: "США",
    countryNameEn: "USA",
    countryNameUz: "AQSH",
    productName: "Ипотека 30 лет (фикс.)",
    productNameEn: "Mortgage 30Y (Fixed)",
    productNameUz: "Ipoteka 30 yil (qatʼiy)",
    rate: 6.8,
    category: "mortgage",
    region: "Северная Америка",
    isPopular: true,
  },
  {
    countryCode: "US",
    countryName: "США",
    countryNameEn: "USA",
    countryNameUz: "AQSH",
    productName: "Ипотека 15 лет (фикс.)",
    productNameEn: "Mortgage 15Y (Fixed)",
    productNameUz: "Ipoteka 15 yil (qatʼiy)",
    rate: 5.9,
    category: "mortgage",
    region: "Северная Америка",
  },
  {
    countryCode: "CA",
    countryName: "Канада",
    countryNameEn: "Canada",
    countryNameUz: "Kanada",
    productName: "Ипотека на жильё 5 лет",
    productNameEn: "Residential Mortgage 5Y",
    productNameUz: "Uy-joy ipotekasi 5 yil",
    rate: 5.4,
    category: "mortgage",
    region: "Северная Америка",
  },
  {
    countryCode: "EU",
    countryName: "Евросоюз",
    countryNameEn: "European Union",
    countryNameUz: "Yevropa Ittifoqi",
    productName: "Жилищный кредит еврозоны",
    productNameEn: "Euro Area Housing Loan",
    productNameUz: "Yevrozona uy-joy krediti",
    rate: 3.8,
    category: "mortgage",
    region: "Европа",
    isPopular: true,
  },
  {
    countryCode: "GB",
    countryName: "Великобритания",
    countryNameEn: "United Kingdom",
    countryNameUz: "Buyuk Britaniya",
    productName: "Базовая ипотека 5 лет",
    productNameEn: "Base Mortgage 5Y Fixed",
    productNameUz: "Asosiy ipoteka 5 yil",
    rate: 5.2,
    category: "mortgage",
    region: "Европа",
    isPopular: true,
  },
  {
    countryCode: "DE",
    countryName: "Германия",
    countryNameEn: "Germany",
    countryNameUz: "Germaniya",
    productName: "Ипотека на 10 лет (Baufinanz.)",
    productNameEn: "Mortgage 10Y (Baufinanzierung)",
    productNameUz: "Ipoteka 10 yil (Baufinanzierung)",
    rate: 3.7,
    category: "mortgage",
    region: "Европа",
  },
  {
    countryCode: "FR",
    countryName: "Франция",
    countryNameEn: "France",
    countryNameUz: "Fransiya",
    productName: "Ипотечный кредит на жильё",
    productNameEn: "Real Estate Mortgage",
    productNameUz: "Ko‘chmas mulk ipotekasi",
    rate: 3.6,
    category: "mortgage",
    region: "Европа",
  },
  {
    countryCode: "IT",
    countryName: "Италия",
    countryNameEn: "Italy",
    countryNameUz: "Italiya",
    productName: "Фиксированная ипотека",
    productNameEn: "Fixed Rate Mortgage (Mutuo Casa)",
    productNameUz: "Qatʼiy stavkali uy ipotekasi",
    rate: 3.5,
    category: "mortgage",
    region: "Европа",
  },
  {
    countryCode: "ES",
    countryName: "Испания",
    countryNameEn: "Spain",
    countryNameUz: "Ispaniya",
    productName: "Ипотечный кредит (Hipotecario)",
    productNameEn: "Mortgage Loan (Préstamo)",
    productNameUz: "Ipoteka krediti (Hipotecario)",
    rate: 3.7,
    category: "mortgage",
    region: "Европа",
  },
  {
    countryCode: "CH",
    countryName: "Швейцария",
    countryNameEn: "Switzerland",
    countryNameUz: "Shveysariya",
    productName: "Ипотечная ставка (SARON / Fest)",
    productNameEn: "Mortgage (SARON / Fest)",
    productNameUz: "Ipoteka stavkasi (SARON / Fest)",
    rate: 2.1,
    category: "mortgage",
    region: "Европа",
  },
  {
    countryCode: "PL",
    countryName: "Польша",
    countryNameEn: "Poland",
    countryNameUz: "Polsha",
    productName: "Ипотека (WIBOR)",
    productNameEn: "Mortgage (WIBOR)",
    productNameUz: "Ipoteka qarzi (WIBOR)",
    rate: 7.4,
    category: "mortgage",
    region: "Европа",
  },
  {
    countryCode: "SG",
    countryName: "Сингапур",
    countryNameEn: "Singapore",
    countryNameUz: "Singapur",
    productName: "Жилищная ипотека (HDB/Private)",
    productNameEn: "Housing Loan (HDB/Private)",
    productNameUz: "Uy-joy ipotekasi (HDB/Private)",
    rate: 2.6,
    category: "mortgage",
    region: "Азия",
  },
  {
    countryCode: "JP",
    countryName: "Япония",
    countryNameEn: "Japan",
    countryNameUz: "Yaponiya",
    productName: "Ипотека Flat 35 (гос.)",
    productNameEn: "Flat 35 Housing Loan",
    productNameUz: "Flat 35 davlat ipotekasi",
    rate: 1.8,
    category: "mortgage",
    region: "Азия",
  },
  {
    countryCode: "CN",
    countryName: "Китай",
    countryNameEn: "China",
    countryNameUz: "Xitoy",
    productName: "Ипотека LPR 5 лет",
    productNameEn: "LPR 5-Year Mortgage",
    productNameUz: "5 yillik LPR ipotekasi",
    rate: 3.85,
    category: "mortgage",
    region: "Азия",
  },
  {
    countryCode: "KR",
    countryName: "Южная Корея",
    countryNameEn: "South Korea",
    countryNameUz: "Janubiy Koreya",
    productName: "Ипотека KORIBOR",
    productNameEn: "Mortgage Loan (KORIBOR)",
    productNameUz: "Ipoteka krediti (KORIBOR)",
    rate: 4.1,
    category: "mortgage",
    region: "Азия",
  },
  {
    countryCode: "IN",
    countryName: "Индия",
    countryNameEn: "India",
    countryNameUz: "Hindiston",
    productName: "Ипотечный стандарт",
    productNameEn: "Home Loan Standard",
    productNameUz: "Standart uy krediti",
    rate: 8.5,
    category: "mortgage",
    region: "Азия",
  },
  {
    countryCode: "KZ",
    countryName: "Казахстан",
    countryNameEn: "Kazakhstan",
    countryNameUz: "Qozogʻiston",
    productName: "Гос. Ипотека «7-20-25»",
    productNameEn: 'State Mortgage "7-20-25"',
    productNameUz: 'Davlat ipotekasi "7-20-25"',
    rate: 7.0,
    category: "mortgage",
    region: "СНГ",
    isPopular: true,
  },
  {
    countryCode: "UZ",
    countryName: "Узбекистан",
    countryNameEn: "Uzbekistan",
    countryNameUz: "Oʻzbekiston",
    productName: "Гос. Ипотека (субсидия)",
    productNameEn: "State Subsidized Mortgage",
    productNameUz: "Davlat subsidiyali ipoteka",
    rate: 17.5,
    category: "mortgage",
    region: "СНГ",
    isPopular: true,
  },
  {
    countryCode: "RU",
    countryName: "Россия",
    countryNameEn: "Russia",
    countryNameUz: "Rossiya",
    productName: "Семейная ипотека (льготная)",
    productNameEn: "Family Concessionary Mortgage",
    productNameUz: "Imtiyozli oilaviy ipoteka",
    rate: 6.0,
    category: "mortgage",
    region: "СНГ",
    isPopular: true,
  },
  {
    countryCode: "RU",
    countryName: "Россия",
    countryNameEn: "Russia",
    countryNameUz: "Rossiya",
    productName: "Рыночная ипотека",
    productNameEn: "Market Mortgage",
    productNameUz: "Bozor ipotekasi",
    rate: 21.0,
    category: "mortgage",
    region: "СНГ",
  },
  {
    countryCode: "TR",
    countryName: "Турция",
    countryNameEn: "Turkey",
    countryNameUz: "Turkiya",
    productName: "Ипотека (Konut Kredisi)",
    productNameEn: "Mortgage (Konut Kredisi)",
    productNameUz: "Ipoteka (Konut Kredisi)",
    rate: 34.0,
    category: "mortgage",
    region: "Евразия",
  },
  {
    countryCode: "AU",
    countryName: "Австралия",
    countryNameEn: "Australia",
    countryNameUz: "Avstraliya",
    productName: "Стандартная ипотека",
    productNameEn: "Home Loan Standard Variable",
    productNameUz: "Standart o‘zgaruvchan ipoteka",
    rate: 6.1,
    category: "mortgage",
    region: "Океания",
  },
  {
    countryCode: "BR",
    countryName: "Бразилия",
    countryNameEn: "Brazil",
    countryNameUz: "Braziliya",
    productName: "Ипотека (Financiamento Imob.)",
    productNameEn: "Mortgage (Financiamento Imob.)",
    productNameUz: "Ipoteka (Financiamento Imob.)",
    rate: 10.5,
    category: "mortgage",
    region: "Латинская Америка",
  },

  // Потребительские кредиты по миру
  {
    countryCode: "US",
    countryName: "США",
    countryNameEn: "USA",
    countryNameUz: "AQSH",
    productName: "Потребительский кредит",
    productNameEn: "Personal Loan (Good Credit)",
    productNameUz: "Isteʼmol krediti",
    rate: 11.4,
    category: "consumer",
    region: "Северная Америка",
  },
  {
    countryCode: "EU",
    countryName: "Евросоюз",
    countryNameEn: "European Union",
    countryNameUz: "Yevropa Ittifoqi",
    productName: "Потреб. кредит (ставка ЕЦБ)",
    productNameEn: "Consumer Loan (ECB Avg)",
    productNameUz: "Isteʼmol krediti (YeMB stavkasi)",
    rate: 5.5,
    category: "consumer",
    region: "Европа",
    isPopular: true,
  },
  {
    countryCode: "GB",
    countryName: "Великобритания",
    countryNameEn: "United Kingdom",
    countryNameUz: "Buyuk Britaniya",
    productName: "Потребительский займ",
    productNameEn: "Personal Loan Tier 1",
    productNameUz: "Shaxsiy isteʼmol qarzi",
    rate: 6.9,
    category: "consumer",
    region: "Европа",
  },
  {
    countryCode: "DE",
    countryName: "Германия",
    countryNameEn: "Germany",
    countryNameUz: "Germaniya",
    productName: "Потребительский кредит (Privat)",
    productNameEn: "Consumer Loan (Privatkredit)",
    productNameUz: "Shaxsiy kredit (Privatkredit)",
    rate: 4.9,
    category: "consumer",
    region: "Европа",
  },
  {
    countryCode: "AE",
    countryName: "ОАЭ",
    countryNameEn: "UAE",
    countryNameUz: "BAA",
    productName: "Персональное финансирование (EIBOR)",
    productNameEn: "Personal Finance (EIBOR)",
    productNameUz: "Shaxsiy moliyalash (EIBOR)",
    rate: 4.8,
    category: "consumer",
    region: "Ближний Восток",
    isPopular: true,
  },
  {
    countryCode: "SA",
    countryName: "Саудовская Аравия",
    countryNameEn: "Saudi Arabia",
    countryNameUz: "Saudiya Arabistoni",
    productName: "Персональная Мурабаха",
    productNameEn: "Personal Murabaha",
    productNameUz: "Shaxsiy Murobaha",
    rate: 4.2,
    category: "consumer",
    region: "Ближний Восток",
  },
  {
    countryCode: "KZ",
    countryName: "Казахстан",
    countryNameEn: "Kazakhstan",
    countryNameUz: "Qozogʻiston",
    productName: "Потребительский без залога",
    productNameEn: "Unsecured Consumer Loan",
    productNameUz: "Garovsiz isteʼmol krediti",
    rate: 17.5,
    category: "consumer",
    region: "СНГ",
  },
  {
    countryCode: "UZ",
    countryName: "Узбекистан",
    countryNameEn: "Uzbekistan",
    countryNameUz: "Oʻzbekiston",
    productName: "Рыночный потреб / микрозайм",
    productNameEn: "Market Consumer / Microloan",
    productNameUz: "Bozor isteʼmol / mikroqarz",
    rate: 22.0,
    category: "consumer",
    region: "СНГ",
  },
  {
    countryCode: "RU",
    countryName: "Россия",
    countryNameEn: "Russia",
    countryNameUz: "Rossiya",
    productName: "Потребительский кредит",
    productNameEn: "Consumer Cash Loan",
    productNameUz: "Isteʼmol naqd pul krediti",
    rate: 23.5,
    category: "consumer",
    region: "СНГ",
  },
  {
    countryCode: "GE",
    countryName: "Грузия",
    countryNameEn: "Georgia",
    countryNameUz: "Gruziya",
    productName: "Потребительский кредит / GEL",
    productNameEn: "Consumer Loan / GEL",
    productNameUz: "Isteʼmol krediti / GEL",
    rate: 11.5,
    category: "consumer",
    region: "СНГ",
  },
  {
    countryCode: "TR",
    countryName: "Турция",
    countryNameEn: "Turkey",
    countryNameUz: "Turkiya",
    productName: "Потреб (İhtiyaç Kredisi)",
    productNameEn: "Consumer Loan (İhtiyaç)",
    productNameUz: "Isteʼmol (İhtiyaç Kredisi)",
    rate: 42.0,
    category: "consumer",
    region: "Евразия",
  },
  {
    countryCode: "AU",
    countryName: "Австралия",
    countryNameEn: "Australia",
    countryNameUz: "Avstraliya",
    productName: "Обеспеченный личный займ",
    productNameEn: "Personal Secured Loan",
    productNameUz: "Taʼminlangan shaxsiy qarz",
    rate: 7.9,
    category: "consumer",
    region: "Океания",
  },
];

/**
 * Generate sensible examples based on selected currency
 */
export function getExamplesForCurrency(
  currency: Currency,
  category: "consumer" | "auto" | "mortgage",
): ExampleLoanItem[] {
  const isSum = currency === "сум";
  const isKzt = currency === "₸";
  const isRub = currency === "₽";

  const multiplier = isSum ? 10000000 : isKzt ? 500000 : isRub ? 100000 : 1000;

  if (category === "consumer") {
    return [
      {
        name: "Персональный кредит",
        nameEn: "Personal Loan",
        nameUz: "Shaxsiy kredit",
        amount: 5 * multiplier,
        termMonths: 12,
        rate: 12.5,
        payment: 0,
        currency,
      },
      {
        name: "Покупка техники",
        nameEn: "Electronics Purchase",
        nameUz: "Texnika xaridi",
        amount: 15 * multiplier,
        termMonths: 24,
        rate: 14.0,
        payment: 0,
        currency,
      },
      {
        name: "Ремонт жилья",
        nameEn: "Home Renovation",
        nameUz: "Uy taʼmiri",
        amount: 30 * multiplier,
        termMonths: 36,
        rate: 11.5,
        payment: 0,
        currency,
      },
      {
        name: "Крупная покупка",
        nameEn: "Major Purchase",
        nameUz: "Katta xarid",
        amount: 60 * multiplier,
        termMonths: 48,
        rate: 10.5,
        payment: 0,
        currency,
      },
    ].map((item) => ({
      ...item,
      payment: Math.round(
        calculateLoan({
          amount: item.amount,
          termMonths: item.termMonths,
          interestRate: item.rate,
          paymentType: "annuity",
          downPayment: 0,
          oneTimeFees: 0,
          annualInsurance: 0,
          currency,
          roundToInteger: true,
        }).monthlyPayment,
      ),
    }));
  }

  if (category === "auto") {
    return [
      {
        name: "Автокредит стандарт",
        nameEn: "Standard Auto Loan",
        nameUz: "Standart avtokredit",
        amount: 25 * multiplier,
        termMonths: 36,
        rate: 8.5,
        payment: 0,
        currency,
      },
      {
        name: "Новый седан",
        nameEn: "New Sedan",
        nameUz: "Yangi sedan",
        amount: 45 * multiplier,
        termMonths: 48,
        rate: 7.9,
        payment: 0,
        currency,
      },
      {
        name: "Кроссовер",
        nameEn: "Crossover SUV",
        nameUz: "Krossover",
        amount: 75 * multiplier,
        termMonths: 60,
        rate: 7.5,
        payment: 0,
        currency,
      },
      {
        name: "Электромобиль",
        nameEn: "Electric Vehicle (EV)",
        nameUz: "Elektromobil",
        amount: 120 * multiplier,
        termMonths: 60,
        rate: 6.9,
        payment: 0,
        currency,
      },
    ].map((item) => ({
      ...item,
      payment: Math.round(
        calculateLoan({
          amount: item.amount,
          termMonths: item.termMonths,
          interestRate: item.rate,
          paymentType: "annuity",
          downPayment: 0,
          oneTimeFees: 0,
          annualInsurance: 0,
          currency,
          roundToInteger: true,
        }).monthlyPayment,
      ),
    }));
  }

  // Mortgage
  return [
    {
      name: "Квартира (10 лет)",
      nameEn: "Apartment (10 Yrs)",
      nameUz: "Xonadon (10 yil)",
      amount: 100 * multiplier,
      termMonths: 120,
      rate: 6.5,
      payment: 0,
      currency,
    },
    {
      name: "Ипотека (15 лет)",
      nameEn: "Mortgage (15 Yrs)",
      nameUz: "Ipoteka (15 yil)",
      amount: 180 * multiplier,
      termMonths: 180,
      rate: 6.2,
      payment: 0,
      currency,
    },
    {
      name: "Новостройка (20 лет)",
      nameEn: "New Building (20 Yrs)",
      nameUz: "Yangi bino (20 yil)",
      amount: 250 * multiplier,
      termMonths: 240,
      rate: 5.9,
      payment: 0,
      currency,
    },
    {
      name: "Загородный дом (30 лет)",
      nameEn: "Country House (30 Yrs)",
      nameUz: "Hovli uy (30 yil)",
      amount: 400 * multiplier,
      termMonths: 360,
      rate: 5.5,
      payment: 0,
      currency,
    },
  ].map((item) => ({
    ...item,
    payment: Math.round(
      calculateLoan({
        amount: item.amount,
        termMonths: item.termMonths,
        interestRate: item.rate,
        paymentType: "annuity",
        downPayment: 0,
        oneTimeFees: 0,
        annualInsurance: 0,
        currency,
        roundToInteger: true,
      }).monthlyPayment,
    ),
  }));
}
