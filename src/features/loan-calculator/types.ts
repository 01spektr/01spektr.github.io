export type PaymentType = "annuity" | "differentiated";

export type Currency = "$" | "€" | "₽" | "₸" | "сум";

export interface CurrencyOption {
  code: Currency;
  label: string;
  name: string;
  symbol: string;
  defaultAmount: number;
  sliderMax: number;
  sliderStep: number;
}

export const CURRENCY_OPTIONS: CurrencyOption[] = [
  {
    code: "$",
    label: "USD ($)",
    name: "Доллар США",
    symbol: "$",
    defaultAmount: 50000,
    sliderMax: 1000000,
    sliderStep: 1000,
  },
  {
    code: "€",
    label: "EUR (€)",
    name: "Евро",
    symbol: "€",
    defaultAmount: 45000,
    sliderMax: 1000000,
    sliderStep: 1000,
  },
  {
    code: "₽",
    label: "RUB (₽)",
    name: "Российский рубль",
    symbol: "₽",
    defaultAmount: 3000000,
    sliderMax: 50000000,
    sliderStep: 50000,
  },
  {
    code: "₸",
    label: "KZT (₸)",
    name: "Казахстанский тенге",
    symbol: "₸",
    defaultAmount: 15000000,
    sliderMax: 200000000,
    sliderStep: 100000,
  },
  {
    code: "сум",
    label: "UZS (сум)",
    name: "Узбекский сум",
    symbol: "сум",
    defaultAmount: 100000000,
    sliderMax: 1000000000,
    sliderStep: 1000000,
  },
];

export interface LoanParams {
  amount: number;
  termMonths: number;
  interestRate: number;
  paymentType: PaymentType;
  downPayment: number;
  oneTimeFees: number;
  annualInsurance: number;
  currency: Currency;
  roundToInteger: boolean;
  purpose?: string;
  notes?: string;
}

export interface PaymentScheduleItem {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

export interface LoanCalculationResult {
  monthlyPayment: number;
  firstMonthlyPayment: number;
  lastMonthlyPayment: number;
  totalPayment: number;
  principalAmount: number;
  overpayment: number;
  overpaymentPercentage: number;
  totalFeesAndInsurance: number;
  effectiveRate: number;
  schedule: PaymentScheduleItem[];
}

export interface ComparisonScenario {
  id: string;
  name: string;
  date: string;
  params: LoanParams;
  result: LoanCalculationResult;
}

export interface BankRatePreset {
  countryCode: string;
  countryName: string;
  countryNameEn?: string;
  countryNameUz?: string;
  productName: string;
  productNameEn?: string;
  productNameUz?: string;
  rate: number;
  category?: "mortgage" | "consumer" | "auto";
  region?: string;
  isPopular?: boolean;
}

export interface ExampleLoanItem {
  name: string;
  nameEn?: string;
  nameUz?: string;
  amount: number;
  termMonths: number;
  rate: number;
  payment: number;
  currency: Currency;
}
