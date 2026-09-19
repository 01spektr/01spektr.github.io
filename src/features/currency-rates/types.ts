export interface Currency {
  code: string;
  name: string;
  nameUz?: string;
  rate: number;
  change24h: number;
  symbol: string;
  sparkline: number[];
  isFavorite?: boolean;
}

export interface ChartDataPoint {
  date: string;
  displayDate: string;
  rate: number;
}

export type Timeframe = '1Д' | '1Н' | '1М' | '3М' | '1Г' | '5Л' | 'Все';

export interface AlertNotification {
  id: string;
  baseCurrency: string;
  targetCurrency: string;
  condition: '>=' | '<=';
  threshold: number;
  enabled: boolean;
  createdAt: string;
}

export interface UsefulTool {
  id: string;
  title: string;
  description: string;
  iconName: 'converter' | 'history' | 'compare' | 'salary' | 'crypto' | 'metals';
  category: string;
}

export type ConverterMode = 'convert' | 'reverse' | 'multi';

export type Language = 'ru' | 'en' | 'uz';
