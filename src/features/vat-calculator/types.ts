export type VatMode = 'add' | 'extract' | 'calculate_only';

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  wordsCurrency: string;
  wordsSubunit: string;
}

export interface CountryVatInfo {
  id: string;
  name: string;
  flag: string;
  standardRate: number;
  otherRates?: number[];
  note?: string;
}

export interface CalculationResult {
  id: string;
  timestamp: number;
  mode: VatMode;
  inputAmount: number;
  amountWithoutVat: number;
  vatRate: number;
  vatAmount: number;
  totalWithVat: number;
  currency: string;
  roundToTwoDecimals: boolean;
  itemName: string;
  note: string;
  counterparty?: string;
  formulaEquation: string;
  formulaSubstituted: string;
  amountInWords: string;
  isFavorite?: boolean;
}
