import { RGB, CMYK, HSL, Lab, OutputFormat, PaperType } from '../types';

/**
 * Standard RGB to CMYK conversion (0-255 RGB to 0-100% CMYK)
 */
export function rgbToCmyk(rgb: RGB): CMYK {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const k = 1 - Math.max(r, g, b);

  if (k === 1) {
    return { c: 0, m: 0, y: 0, k: 100 };
  }

  const c = Math.round(((1 - r - k) / (1 - k)) * 100);
  const m = Math.round(((1 - g - k) / (1 - k)) * 100);
  const y = Math.round(((1 - b - k) / (1 - k)) * 100);
  const kPercent = Math.round(k * 100);

  return {
    c: Math.max(0, Math.min(100, c)),
    m: Math.max(0, Math.min(100, m)),
    y: Math.max(0, Math.min(100, y)),
    k: Math.max(0, Math.min(100, kPercent)),
  };
}

/**
 * Convert CMYK back to theoretical RGB
 */
export function cmykToRgb(cmyk: CMYK): RGB {
  const c = cmyk.c / 100;
  const m = cmyk.m / 100;
  const y = cmyk.y / 100;
  const k = cmyk.k / 100;

  const r = Math.round(255 * (1 - c) * (1 - k));
  const g = Math.round(255 * (1 - m) * (1 - k));
  const b = Math.round(255 * (1 - y) * (1 - k));

  return {
    r: Math.max(0, Math.min(255, r)),
    g: Math.max(0, Math.min(255, g)),
    b: Math.max(0, Math.min(255, b)),
  };
}

/**
 * Realistic print gamut simulation (coated / uncoated paper).
 * Real CMYK inks absorb light subtractively and have a narrower gamut than sRGB monitors.
 */
export function cmykToSimulatedPrintRgb(cmyk: CMYK, paper: PaperType = 'coated'): RGB {
  const c = Math.max(0, Math.min(100, cmyk.c)) / 100;
  const m = Math.max(0, Math.min(100, cmyk.m)) / 100;
  const y = Math.max(0, Math.min(100, cmyk.y)) / 100;
  const k = Math.max(0, Math.min(100, cmyk.k)) / 100;
  const isCoated = paper === 'coated';

  // Neugebauer primaries approximating ISO Coated v2 / FOGRA39 and
  // PSO Uncoated / FOGRA47 in sRGB. Unlike the former channel-by-channel
  // formula, the Demichel weights below account for CMY overprints.
  const pWhite = isCoated ? [250, 250, 248] : [238, 236, 230];
  const pCyan = isCoated ? [0, 150, 208] : [25, 140, 185];
  const pMagenta = isCoated ? [212, 16, 114] : [195, 45, 108];
  const pYellow = isCoated ? [255, 226, 0] : [240, 215, 20];
  const pRed = isCoated ? [218, 36, 40] : [198, 55, 52];
  const pGreen = isCoated ? [0, 138, 72] : [28, 128, 75];
  const pBlue = isCoated ? [32, 46, 122] : [48, 56, 115];
  const pCmy = isCoated ? [44, 40, 38] : [62, 58, 55];
  const pBlack = isCoated ? [34, 34, 34] : [55, 54, 52];

  const wWhite = (1 - c) * (1 - m) * (1 - y);
  const wCyan = c * (1 - m) * (1 - y);
  const wMagenta = (1 - c) * m * (1 - y);
  const wYellow = (1 - c) * (1 - m) * y;
  const wRed = (1 - c) * m * y;
  const wGreen = c * (1 - m) * y;
  const wBlue = c * m * (1 - y);
  const wCmy = c * m * y;

  const mix = (channel: number) =>
    wWhite * pWhite[channel] +
    wCyan * pCyan[channel] +
    wMagenta * pMagenta[channel] +
    wYellow * pYellow[channel] +
    wRed * pRed[channel] +
    wGreen * pGreen[channel] +
    wBlue * pBlue[channel] +
    wCmy * pCmy[channel];

  // Approximate black dot gain for offset printing.
  const kFactor = Math.pow(k, 0.95);
  let r = mix(0) * (1 - kFactor) + pBlack[0] * kFactor;
  let g = mix(1) * (1 - kFactor) + pBlack[1] * kFactor;
  let b = mix(2) * (1 - kFactor) + pBlack[2] * kFactor;

  if (!isCoated) {
    r = r * 0.95 + 8;
    g = g * 0.95 + 8;
    b = b * 0.95 + 8;
  }

  return {
    r: Math.max(0, Math.min(255, Math.round(r))),
    g: Math.max(0, Math.min(255, Math.round(g))),
    b: Math.max(0, Math.min(255, Math.round(b))),
  };
}

/** Perceptual distance between the source screen colour and the print preview. */
export function checkGamutWarning(rgb: RGB, simulatedRgb: RGB): {
  isOutOfGamut: boolean;
  deltaE: number;
  level: 'none' | 'noticeable' | 'severe';
} {
  const deltaE = Math.round(calculateDeltaE(rgbToLab(rgb), rgbToLab(simulatedRgb)) * 10) / 10;
  if (deltaE <= 3) return { isOutOfGamut: false, deltaE, level: 'none' };
  if (deltaE <= 12) return { isOutOfGamut: true, deltaE, level: 'noticeable' };
  return { isOutOfGamut: true, deltaE, level: 'severe' };
}

export function rgbToHex(rgb: RGB): string {
  const toHex = (n: number) => {
    const clamped = Math.max(0, Math.min(255, Math.round(n)));
    return clamped.toString(16).padStart(2, '0').toUpperCase();
  };
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

export function hexToRgb(hexStr: string): RGB | null {
  let hex = hexStr.trim().replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex.split('').map((char) => char + char).join('');
  }
  if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
    return null;
  }
  const num = parseInt(hex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function rgbToHsl(rgb: RGB): HSL {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function hslToRgb(hsl: HSL): RGB {
  const h = hsl.h / 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;

  if (s === 0) {
    const val = Math.round(l * 255);
    return { r: val, g: val, b: val };
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    let tNorm = t;
    if (tNorm < 0) tNorm += 1;
    if (tNorm > 1) tNorm -= 1;
    if (tNorm < 1 / 6) return p + (q - p) * 6 * tNorm;
    if (tNorm < 1 / 2) return q;
    if (tNorm < 2 / 3) return p + (q - p) * (2 / 3 - tNorm) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  const r = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
  const g = Math.round(hue2rgb(p, q, h) * 255);
  const b = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);

  return {
    r: Math.max(0, Math.min(255, r)),
    g: Math.max(0, Math.min(255, g)),
    b: Math.max(0, Math.min(255, b)),
  };
}

/**
 * Convert RGB to CIELAB space for precise perceptual Delta-E calculation
 */
export function rgbToLab(rgb: RGB): Lab {
  // sRGB to linear RGB
  let r = rgb.r / 255;
  let g = rgb.g / 255;
  let b = rgb.b / 255;

  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

  // Linear RGB to XYZ (D65 Illuminant)
  const x = (r * 0.4124 + g * 0.3576 + b * 0.1805) * 100;
  const y = (r * 0.2126 + g * 0.7152 + b * 0.0722) * 100;
  const z = (r * 0.0193 + g * 0.1192 + b * 0.9505) * 100;

  // XYZ to CIELAB (Reference white: D65 = [95.047, 100.0, 108.883])
  const xr = x / 95.047;
  const yr = y / 100.0;
  const zr = z / 108.883;

  const f = (val: number) => (val > 0.008856 ? Math.cbrt(val) : 7.787 * val + 16 / 116);

  const fx = f(xr);
  const fy = f(yr);
  const fz = f(zr);

  const lVal = 116 * fy - 16;
  const aVal = 500 * (fx - fy);
  const bVal = 200 * (fy - fz);

  return {
    l: Math.round(lVal * 10) / 10,
    a: Math.round(aVal * 10) / 10,
    b: Math.round(bVal * 10) / 10,
  };
}

/**
 * Perceptual color difference (Delta E - CIE76 standard)
 * ΔE < 1: imperceptible to human eye
 * ΔE 1-2: perceptible through close observation
 * ΔE 2-10: perceptible at a glance
 * ΔE > 10: colors are more different than similar
 */
export function calculateDeltaE(lab1: Lab, lab2: Lab): number {
  const dL = lab1.l - lab2.l;
  const da = lab1.a - lab2.a;
  const db = lab1.b - lab2.b;
  return Math.sqrt(dL * dL + da * da + db * db);
}

export function formatCmyk(cmyk: CMYK, format: OutputFormat): string {
  switch (format) {
    case 'percent_separated':
      return `C: ${cmyk.c}  M: ${cmyk.m}  Y: ${cmyk.y}  K: ${cmyk.k}`;
    case 'cmyk_function':
      return `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;
    case 'comma_percent':
      return `${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%`;
    case 'normalized':
      return `${(cmyk.c / 100).toFixed(2)}, ${(cmyk.m / 100).toFixed(2)}, ${(cmyk.y / 100).toFixed(2)}, ${(cmyk.k / 100).toFixed(2)}`;
    case 'css_device_cmyk':
      return `device-cmyk(${cmyk.c / 100} ${cmyk.m / 100} ${cmyk.y / 100} ${cmyk.k / 100})`;
    default:
      return `C: ${cmyk.c}  M: ${cmyk.m}  Y: ${cmyk.y}  K: ${cmyk.k}`;
  }
}

/**
 * Total Ink Coverage (TIC / TAC in Prepress)
 */
export function getTotalInkCoverage(cmyk: CMYK): number {
  return cmyk.c + cmyk.m + cmyk.y + cmyk.k;
}
