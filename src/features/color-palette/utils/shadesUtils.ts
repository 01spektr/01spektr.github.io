import { ColorItem } from '../types';
import { hexToRgb, rgbToHex, rgbToHsl, hslToRgb } from './colorUtils';

export interface ShadeStep {
  step: number; // 50, 100, 200, ..., 900, 950
  hex: string;
  isBase?: boolean;
}

/**
 * Generates an 11-step Tailwind-style tints and shades scale for a given base color
 */
export function generateShades(baseHex: string): ShadeStep[] {
  const baseRgb = hexToRgb(baseHex);
  const baseHsl = rgbToHsl(baseRgb);

  // Steps matching Tailwind's standard token hierarchy
  const stepDefinitions = [
    { step: 50, lightness: 96, saturationFactor: 0.8 },
    { step: 100, lightness: 91, saturationFactor: 0.85 },
    { step: 200, lightness: 82, saturationFactor: 0.9 },
    { step: 300, lightness: 71, saturationFactor: 0.95 },
    { step: 400, lightness: 59, saturationFactor: 1.0 },
    { step: 500, lightness: 49, saturationFactor: 1.0 }, // Midpoint
    { step: 600, lightness: 40, saturationFactor: 1.02 },
    { step: 700, lightness: 31, saturationFactor: 1.05 },
    { step: 800, lightness: 22, saturationFactor: 1.05 },
    { step: 900, lightness: 14, saturationFactor: 1.0 },
    { step: 950, lightness: 8, saturationFactor: 0.95 },
  ];

  // Find which step is closest to our base color's lightness
  let closestIdx = 5;
  let minDiff = 999;
  stepDefinitions.forEach((def, idx) => {
    const diff = Math.abs(def.lightness - baseHsl.l);
    if (diff < minDiff) {
      minDiff = diff;
      closestIdx = idx;
    }
  });

  return stepDefinitions.map((def, idx) => {
    if (idx === closestIdx) {
      return { step: def.step, hex: baseHex.toUpperCase(), isBase: true };
    }

    const newLightness = def.lightness;
    const newSaturation = Math.min(100, Math.max(0, Math.round(baseHsl.s * def.saturationFactor)));
    const rgb = hslToRgb({ h: baseHsl.h, s: newSaturation, l: newLightness });
    return { step: def.step, hex: rgbToHex(rgb) };
  });
}

/**
 * Generate Tailwind CSS v4 @theme or v3 config
 */
export function exportTailwindConfig(colors: ColorItem[]): string {
  let output = `// tailwind.config.js / CSS design tokens\n`;
  output += `module.exports = {\n  theme: {\n    extend: {\n      colors: {\n`;

  colors.forEach((c) => {
    const roleSlug = c.role
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '') || 'color';

    const shades = generateShades(c.hex);
    output += `        '${roleSlug}': {\n`;
    shades.forEach((s) => {
      output += `          ${s.step}: '${s.hex}',\n`;
    });
    output += `          DEFAULT: '${c.hex}',\n`;
    output += `        },\n`;
  });

  output += `      }\n    }\n  }\n};\n`;
  return output;
}
