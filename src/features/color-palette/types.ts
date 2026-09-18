export type HarmonyMode = 
  | 'custom'
  | 'harmonious'
  | 'contrast'
  | 'analogous'
  | 'complementary'
  | 'triad'
  | 'tetrad'
  | 'monochrome';

export type PaletteStyle = 
  | 'modern'
  | 'pastel'
  | 'vintage'
  | 'neon'
  | 'corporate'
  | 'warm'
  | 'cool'
  | 'minimal';

export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export interface HslColor {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
}

export interface HsvColor {
  h: number; // 0-360
  s: number; // 0-100
  v: number; // 0-100
}

export interface CmykColor {
  c: number; // 0-100
  m: number; // 0-100
  y: number; // 0-100
  k: number; // 0-100
}

export interface ColorItem {
  id: string;
  hex: string;
  rgb: RgbColor;
  hsl: HslColor;
  cmyk: CmykColor;
  role: string;
  locked?: boolean;
}

export type PreviewMode = 'logo' | 'website' | 'mobile' | 'card' | 'ui';

export type ActiveToolTab = 'picker' | 'wheel' | 'extractor' | 'shades' | 'accessibility';

export type ColorBlindnessType = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';

export interface SavedPalette {
  id: string;
  name: string;
  colors: string[];
  createdAt: number;
}

export interface CuratedPalette {
  id: string;
  name: string;
  colors: string[];
  tags: string[];
}
