export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface CMYK {
  c: number;
  m: number;
  y: number;
  k: number;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

export interface Lab {
  l: number;
  a: number;
  b: number;
}

export interface PantoneColor {
  code: string; // e.g. "PANTONE 2174 C"
  name: string;
  category: 'coated' | 'uncoated' | 'metallic' | 'pastel';
  hex: string;
  rgb: RGB;
  cmyk: CMYK;
  lab: Lab;
}

export interface PantoneMatch {
  pantone: PantoneColor;
  deltaE: number;
  matchScore: number; // 0 - 100%
  quality: 'perfect' | 'good' | 'close' | 'approximate';
}

export type InputMode = 'RGB' | 'HEX' | 'HSL';

export type PaperType = 'coated' | 'uncoated';

export type OutputFormat =
  | 'percent_separated' // C: 84  M: 58  Y: 0  K: 8
  | 'cmyk_function'     // cmyk(84%, 58%, 0%, 8%)
  | 'comma_percent'     // 84%, 58%, 0%, 8%
  | 'normalized'        // 0.84, 0.58, 0.00, 0.08
  | 'css_device_cmyk';  // device-cmyk(0.84 0.58 0 0.08)

export type ActiveTab = 'preview' | 'comparison' | 'palette' | 'pantone' | 'export';
