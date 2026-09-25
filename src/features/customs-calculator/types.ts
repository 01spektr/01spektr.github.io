export type OperationType = "import" | "export";
export type DeclarantType = "legal" | "individual"; // Юридическое лицо | Физическое лицо
export type IndividualTransportType = "air" | "post" | "auto" | "rail"; // Способ ввоза для физлиц

export interface IndicativeDefaults {
  unitPriceUSD: number; // Цена за 1 ед. товара (например, $100 за шт., $0.72 за кг)
  typicalPriceUSD: number; // Общая стоимость = unitPriceUSD * typicalQuantity
  typicalQuantity: number;
  unitWeightKg: number; // Вес за 1 ед. товара (например, 0.45 кг за шт., 1500 кг за авто)
  typicalWeightKg: number; // Общий вес = unitWeightKg * typicalQuantity
  typicalDeliveryUSD: number;
  typicalInsuranceUSD: number;
  unit: string;
  weightUnit: string;
  categoryName?: string;
  sourceNote?: string;
}

export interface HsCodeItem {
  code: string;
  name: string;
  category: string;
  dutyRate: number; // percentage, e.g. 10 for 10%
  vatRate: number; // percentage, default 12% in Uzbekistan
  exciseRate: number; // percentage if applicable, e.g. 0
  customsFeeRate?: number; // customs processing fee percentage or fixed
  hasSpecialRequirements?: boolean;
  specialNote?: string;
  measurementUnit?: string;
  indicative?: IndicativeDefaults;
}

export interface Country {
  code: string;
  name: string;
  flag: string;
  isPreferential?: boolean; // e.g. CIS free trade agreement
}

export interface CalculationInput {
  operationType: OperationType;
  declarantType: DeclarantType;
  individualTransportType?: IndividualTransportType;
  hsCode: HsCodeItem;
  originCountry: string; // Country code
  departureCountry: string; // Country code
  destinationCountry: string; // Country code
  unitPriceUSD: number; // Цена за единицу (например, $100 за шт.)
  goodsCostUSD: number; // Общая фактурная стоимость = unitPriceUSD * quantity
  quantity: number;
  unit: string;
  unitWeightKg: number; // Вес за единицу (кг)
  grossWeightKg: number; // Общий вес брутто = unitWeightKg * quantity
  weightUnit: string;
  deliveryCostUSD: number;
  insuranceCostUSD: number;
  additionalFeesUZS?: number;

  // Custom rates and manual product definition
  isManualProduct?: boolean;
  manualProductName?: string;
  manualHsCode?: string;
  customDutyRate?: number;
  customVatRate?: number;
}

export interface CalculationBreakdown {
  declarantType: DeclarantType;
  individualTransportType?: IndividualTransportType;
  dutyFreeLimitUSD: number; // e.g. 2000 for air, 1000 for post, 300 for auto, 1000 for rail
  dutyFreeLimitKg: number;
  isExemptFromCustomsDuty: boolean; // true if within duty-free limit
  taxableExcessUSD: number; // amount above duty-free limit
  singleCustomsPaymentUSD: number; // ЕТП (30%)
  singleCustomsPaymentUZS: number;
  cifUSD: number;
  cifUZS: number;
  dutyUZS: number;
  dutyRate: number;
  vatUZS: number;
  vatRate: number;
  exciseUZS: number;
  exciseRate: number;
  customsFeeUZS: number;
  additionalFeesUZS: number;
  totalCustomsPaymentsUZS: number; // Only customs taxes & fees (пошлина + НДС + акциз + сборы)
  totalCustomsPaymentsUSD: number;
  totalPayableUZS: number; // Total cost (CIF + таможенные платежи) as shown in reference
  totalPayableUSD: number;
  usdToUzsRate: number;
  date: string;

  // Adaptive Target Country Architecture
  targetCountryCode?: string;
  targetCountryName?: string;
  targetCurrencyCode?: string;
  targetCurrencySymbol?: string;
  targetExchangeRate?: number;
  customsAuthority?: string;
  vatName?: string;
  deMinimisRuleName?: string;
  deMinimisNote?: string;
  isAdaptiveNonUzbekistan?: boolean;
  totalCustomsPaymentsTarget?: number;
  totalPayableTarget?: number;
  cifTarget?: number;
  dutyTarget?: number;
  vatTarget?: number;
  exciseTarget?: number;
  customsFeeTarget?: number;
  additionalFeesTarget?: number;
}

export interface HistoryItem {
  id: string;
  date: string;
  productName: string;
  hsCode: string;
  totalUZS: number;
  totalUSD: number;
  input: CalculationInput;
}
