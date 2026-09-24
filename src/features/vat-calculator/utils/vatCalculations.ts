import { CalculationResult, VatMode } from '../types';
import { numberToWords } from './numberToWords';
import { Language } from './i18n';

export function formatNumber(
  num: number,
  decimals = 2,
  alwaysTwoDecimals = false
): string {
  if (isNaN(num)) return '0';
  
  const rounded = alwaysTwoDecimals 
    ? num.toFixed(2)
    : Number.isInteger(num) 
      ? num.toString() 
      : num.toFixed(decimals);

  const parts = rounded.split('.');
  // Add thousands non-breaking spaces (\u00A0) so numbers never wrap or split
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0');
  return parts.join(',');
}

export function parseFormattedNumber(val: string): number {
  if (!val) return 0;
  // Replace spaces, non-breaking spaces, and convert comma to dot
  const clean = val.replace(/[\s\u00A0]/g, '').replace(',', '.');
  const parsed = parseFloat(clean);
  return isNaN(parsed) ? 0 : parsed;
}

export function calculateVat(params: {
  mode: VatMode;
  inputAmount: number;
  vatRate: number;
  currency: string;
  roundToTwoDecimals: boolean;
  itemName?: string;
  note?: string;
  counterparty?: string;
  lang?: Language;
}): CalculationResult {
  const { mode, inputAmount, vatRate, currency, roundToTwoDecimals, itemName = '', note = '', counterparty = '', lang = 'ru' } = params;

  let amountWithoutVat = 0;
  let vatAmount = 0;
  let totalWithVat = 0;

  let formulaEquation = '';
  let formulaSubstituted = '';

  const formulaCopy = {
    ru: {
      add: 'Итого с НДС = Сумма без НДС × (1 + Ставка НДС)',
      extract: 'НДС = Сумма с НДС × (Ставка НДС / (100 + Ставка НДС))',
      only: 'Сумма НДС = База налога × (Ставка НДС / 100)',
      case: 'В вашем случае',
      net: 'без НДС',
      fallback: 'Услуги и товары',
    },
    en: {
      add: 'Gross total = Net amount × (1 + VAT rate)',
      extract: 'VAT = Gross amount × (VAT rate / (100 + VAT rate))',
      only: 'VAT amount = Tax base × (VAT rate / 100)',
      case: 'In this calculation',
      net: 'net amount',
      fallback: 'Goods and services',
    },
    uz: {
      add: 'QQS bilan jami = QQSsiz summa × (1 + QQS stavkasi)',
      extract: 'QQS = QQSli summa × (QQS stavkasi / (100 + QQS stavkasi))',
      only: 'QQS summasi = Soliq bazasi × (QQS stavkasi / 100)',
      case: 'Ushbu hisobda',
      net: 'QQSsiz summa',
      fallback: 'Tovar va xizmatlar',
    },
  }[lang];

  const rateFraction = vatRate / 100;
  const rateFractionStr = lang === 'en'
    ? rateFraction.toString()
    : rateFraction.toString().replace('.', ',');

  if (mode === 'add') {
    // Input is amount without VAT
    amountWithoutVat = inputAmount;
    vatAmount = inputAmount * rateFraction;
    totalWithVat = inputAmount + vatAmount;

    formulaEquation = formulaCopy.add;
    const inputFmt = formatNumber(inputAmount, 2, roundToTwoDecimals);
    const totalFmt = formatNumber(totalWithVat, 2, roundToTwoDecimals);
    formulaSubstituted = `${formulaCopy.case}: ${inputFmt} × (1 + ${rateFractionStr}) = ${totalFmt} ${currency}`;
  } else if (mode === 'extract') {
    // Input is amount with VAT (extract VAT out of it)
    totalWithVat = inputAmount;
    if (vatRate > 0) {
      amountWithoutVat = inputAmount / (1 + rateFraction);
      vatAmount = totalWithVat - amountWithoutVat;
    } else {
      amountWithoutVat = inputAmount;
      vatAmount = 0;
    }

    formulaEquation = formulaCopy.extract;
    const inputFmt = formatNumber(inputAmount, 2, roundToTwoDecimals);
    const vatFmt = formatNumber(vatAmount, 2, roundToTwoDecimals);
    const withoutFmt = formatNumber(amountWithoutVat, 2, roundToTwoDecimals);
    formulaSubstituted = `${formulaCopy.case}: ${inputFmt} × (${vatRate} / ${100 + vatRate}) = ${vatFmt} ${currency} (${formulaCopy.net}: ${withoutFmt} ${currency})`;
  } else {
    // Mode: calculate_only (just tax amount from base)
    amountWithoutVat = inputAmount;
    vatAmount = inputAmount * rateFraction;
    totalWithVat = inputAmount + vatAmount;

    formulaEquation = formulaCopy.only;
    const inputFmt = formatNumber(inputAmount, 2, roundToTwoDecimals);
    const vatFmt = formatNumber(vatAmount, 2, roundToTwoDecimals);
    formulaSubstituted = `${formulaCopy.case}: ${inputFmt} × ${rateFractionStr} = ${vatFmt} ${currency}`;
  }

  if (roundToTwoDecimals) {
    amountWithoutVat = Math.round(amountWithoutVat * 100) / 100;
    vatAmount = Math.round(vatAmount * 100) / 100;
    totalWithVat = Math.round(totalWithVat * 100) / 100;
  }

  const amountInWords = numberToWords(totalWithVat, currency, lang);

  return {
    id: `calc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: Date.now(),
    mode,
    inputAmount,
    amountWithoutVat,
    vatRate,
    vatAmount,
    totalWithVat,
    currency,
    roundToTwoDecimals,
    itemName: itemName.trim() || formulaCopy.fallback,
    note: note.trim(),
    counterparty: counterparty.trim(),
    formulaEquation,
    formulaSubstituted,
    amountInWords,
  };
}
