import { ColorBlindnessType, RgbColor } from '../types';
import { hexToRgb, rgbToHex } from './colorUtils';

/**
 * Calculate relative luminance according to WCAG 2.1 specifications
 */
export function getRelativeLuminance(rgb: RgbColor): number {
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((val) => {
    const s = val / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculate contrast ratio between two HEX colors (1:1 to 21:1)
 */
export function getContrastRatio(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  const lum1 = getRelativeLuminance(rgb1);
  const lum2 = getRelativeLuminance(rgb2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  const ratio = (brightest + 0.05) / (darkest + 0.05);
  return Math.round(ratio * 100) / 100;
}

export interface WcagRating {
  ratio: number;
  aaNormal: boolean; // >= 4.5
  aaLarge: boolean;  // >= 3.0
  aaaNormal: boolean; // >= 7.0
  aaaLarge: boolean; // >= 4.5
  score: 'AAA' | 'AA' | 'AA+' | 'FAIL';
}

export function evaluateWcag(hex1: string, hex2: string): WcagRating {
  const ratio = getContrastRatio(hex1, hex2);
  const aaNormal = ratio >= 4.5;
  const aaLarge = ratio >= 3.0;
  const aaaNormal = ratio >= 7.0;
  const aaaLarge = ratio >= 4.5;

  let score: 'AAA' | 'AA' | 'AA+' | 'FAIL' = 'FAIL';
  if (aaaNormal) score = 'AAA';
  else if (aaNormal) score = 'AA';
  else if (aaLarge) score = 'AA+';

  return { ratio, aaNormal, aaLarge, aaaNormal, aaaLarge, score };
}

/**
 * Simulate color blindness on an RGB color using Brettel/Machado matrices
 */
export function simulateColorBlindnessRgb(rgb: RgbColor, type: ColorBlindnessType | string = 'none'): RgbColor {
  if (type === 'none') return rgb;

  const { r, g, b } = rgb;

  if (type === 'achromatopsia') {
    // Complete monochromacy / grayscale based on standard luminance
    const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
    return { r: gray, g: gray, b: gray };
  }

  // Linear RGB conversion
  const gamma = 2.2;
  const rL = Math.pow(r / 255, gamma);
  const gL = Math.pow(g / 255, gamma);
  const bL = Math.pow(b / 255, gamma);

  let simR = rL;
  let simG = gL;
  let simB = bL;

  if (type === 'protanopia') {
    // Protanopia simulation matrix (red deficiency)
    simR = 0.56667 * rL + 0.43333 * gL + 0.0 * bL;
    simG = 0.55833 * rL + 0.44167 * gL + 0.0 * bL;
    simB = 0.0 * rL + 0.24167 * gL + 0.75833 * bL;
  } else if (type === 'deuteranopia') {
    // Deuteranopia simulation matrix (green deficiency)
    simR = 0.625 * rL + 0.375 * gL + 0.0 * bL;
    simG = 0.7 * rL + 0.3 * gL + 0.0 * bL;
    simB = 0.0 * rL + 0.3 * gL + 0.7 * bL;
  } else if (type === 'tritanopia') {
    // Tritanopia simulation matrix (blue deficiency)
    simR = 0.95 * rL + 0.05 * gL + 0.0 * bL;
    simG = 0.0 * rL + 0.43333 * gL + 0.56667 * bL;
    simB = 0.0 * rL + 0.475 * gL + 0.525 * bL;
  }

  // De-linearize and clamp
  const invGamma = 1 / gamma;
  const clampR = Math.max(0, Math.min(1, simR));
  const clampG = Math.max(0, Math.min(1, simG));
  const clampB = Math.max(0, Math.min(1, simB));

  return {
    r: Math.round(Math.pow(clampR, invGamma) * 255),
    g: Math.round(Math.pow(clampG, invGamma) * 255),
    b: Math.round(Math.pow(clampB, invGamma) * 255),
  };
}

export function simulateColorBlindness(hex: string, type: ColorBlindnessType | string = 'none'): string {
  if (!type || type === 'none') return hex;
  const rgb = hexToRgb(hex);
  const simRgb = simulateColorBlindnessRgb(rgb, type);
  return rgbToHex(simRgb);
}
