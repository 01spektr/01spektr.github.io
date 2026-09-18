import { ColorItem, RgbColor, HslColor, HsvColor, CmykColor, HarmonyMode, PaletteStyle } from '../types';

export function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

export function hexToRgb(hex: string): RgbColor {
  let cleanHex = hex.replace('#', '').trim();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(c => c + c).join('');
  }
  const num = parseInt(cleanHex, 16);
  if (isNaN(num) || cleanHex.length !== 6) {
    return { r: 37, g: 99, b: 235 };
  }
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function rgbToHex(rgb: RgbColor): string {
  const r = clamp(Math.round(rgb.r), 0, 255);
  const g = clamp(Math.round(rgb.g), 0, 255);
  const b = clamp(Math.round(rgb.b), 0, 255);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

export function rgbToHsl(rgb: RgbColor): HslColor {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;
  const l = (max + min) / 2;

  let h = 0;
  let s = 0;

  if (diff !== 0) {
    s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / diff + (g < b ? 6 : 0)) * 60;
        break;
      case g:
        h = ((b - r) / diff + 2) * 60;
        break;
      case b:
        h = ((r - g) / diff + 4) * 60;
        break;
    }
  }

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function hslToRgb(hsl: HslColor): RgbColor {
  const h = (hsl.h % 360 + 360) % 360;
  const s = clamp(hsl.s, 0, 100) / 100;
  const l = clamp(hsl.l, 0, 100) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let rPrime = 0;
  let gPrime = 0;
  let bPrime = 0;

  if (h >= 0 && h < 60) {
    rPrime = c; gPrime = x; bPrime = 0;
  } else if (h >= 60 && h < 120) {
    rPrime = x; gPrime = c; bPrime = 0;
  } else if (h >= 120 && h < 180) {
    rPrime = 0; gPrime = c; bPrime = x;
  } else if (h >= 180 && h < 240) {
    rPrime = 0; gPrime = x; bPrime = c;
  } else if (h >= 240 && h < 300) {
    rPrime = x; gPrime = 0; bPrime = c;
  } else {
    rPrime = c; gPrime = 0; bPrime = x;
  }

  return {
    r: Math.round((rPrime + m) * 255),
    g: Math.round((gPrime + m) * 255),
    b: Math.round((bPrime + m) * 255),
  };
}

export function rgbToHsv(rgb: RgbColor): HsvColor {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;

  let h = 0;
  if (diff !== 0) {
    if (max === r) {
      h = ((g - b) / diff + (g < b ? 6 : 0)) * 60;
    } else if (max === g) {
      h = ((b - r) / diff + 2) * 60;
    } else {
      h = ((r - g) / diff + 4) * 60;
    }
  }

  const s = max === 0 ? 0 : (diff / max) * 100;
  const v = max * 100;

  return {
    h: Math.round(h),
    s: Math.round(s),
    v: Math.round(v),
  };
}

export function hsvToRgb(hsv: HsvColor): RgbColor {
  const h = (hsv.h % 360 + 360) % 360;
  const s = clamp(hsv.s, 0, 100) / 100;
  const v = clamp(hsv.v, 0, 100) / 100;

  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;

  let rPrime = 0;
  let gPrime = 0;
  let bPrime = 0;

  if (h >= 0 && h < 60) {
    rPrime = c; gPrime = x; bPrime = 0;
  } else if (h >= 60 && h < 120) {
    rPrime = x; gPrime = c; bPrime = 0;
  } else if (h >= 120 && h < 180) {
    rPrime = 0; gPrime = c; bPrime = x;
  } else if (h >= 180 && h < 240) {
    rPrime = 0; gPrime = x; bPrime = c;
  } else if (h >= 240 && h < 300) {
    rPrime = x; gPrime = 0; bPrime = c;
  } else {
    rPrime = c; gPrime = 0; bPrime = x;
  }

  return {
    r: Math.round((rPrime + m) * 255),
    g: Math.round((gPrime + m) * 255),
    b: Math.round((bPrime + m) * 255),
  };
}

export function rgbToCmyk(rgb: RgbColor): CmykColor {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const maxVal = Math.max(r, g, b);
  const k = 1 - maxVal;

  if (k >= 1) {
    return { c: 0, m: 0, y: 0, k: 100 };
  }

  const c = (1 - r - k) / (1 - k);
  const m = (1 - g - k) / (1 - k);
  const y = (1 - b - k) / (1 - k);

  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100),
  };
}

export function createColorItem(hex: string, role = '', locked = false): ColorItem {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb);
  const cmyk = rgbToCmyk(rgb);
  return {
    id: Math.random().toString(36).substring(2, 9),
    hex: hex.toUpperCase(),
    rgb,
    hsl,
    cmyk,
    role,
    locked,
  };
}

const DEFAULT_ROLES = [
  'Основной',
  'Вторичный',
  'Фоновый',
  'Светлый',
  'Тёмный',
  'Акцентный'
];

export function getRoleName(index: number, count: number): string {
  if (count === 3) {
    const roles3 = ['Основной', 'Фоновый', 'Тёмный'];
    return roles3[index] || DEFAULT_ROLES[index] || `Цвет ${index + 1}`;
  }
  if (count === 4) {
    const roles4 = ['Основной', 'Вторичный', 'Фоновый', 'Тёмный'];
    return roles4[index] || DEFAULT_ROLES[index] || `Цвет ${index + 1}`;
  }
  return DEFAULT_ROLES[index] || `Цвет ${index + 1}`;
}

export function generateHarmoniousPalette(
  baseHex: string,
  harmony: HarmonyMode,
  count: number,
  style: PaletteStyle,
  saturationMultiplier = 1,
  brightnessMultiplier = 1,
  existingColors?: ColorItem[]
): ColorItem[] {
  const baseRgb = hexToRgb(baseHex);
  const baseHsv = rgbToHsv(baseRgb);

  // Apply style modification
  let satFactor = saturationMultiplier;
  let valFactor = brightnessMultiplier;

  if (style === 'pastel') {
    satFactor *= 0.45;
    valFactor *= 1.1;
  } else if (style === 'neon') {
    satFactor *= 1.3;
    valFactor *= 1.2;
  } else if (style === 'vintage') {
    satFactor *= 0.65;
    valFactor *= 0.85;
  } else if (style === 'corporate') {
    satFactor *= 0.8;
  } else if (style === 'warm') {
    satFactor *= 0.9;
  } else if (style === 'cool') {
    satFactor *= 0.9;
  }

  const baseH = baseHsv.h;
  const baseS = clamp(baseHsv.s * satFactor, 8, 100);
  const baseV = clamp(baseHsv.v * valFactor, 15, 100);

  const hues: number[] = [];

  switch (harmony) {
    case 'analogous':
      for (let i = 0; i < count; i++) {
        const offset = (i - Math.floor(count / 2)) * 28;
        hues.push((baseH + offset + 360) % 360);
      }
      break;

    case 'complementary':
      for (let i = 0; i < count; i++) {
        if (i % 2 === 0) {
          hues.push((baseH + (i * 12)) % 360);
        } else {
          hues.push((baseH + 180 + ((i - 1) * 12)) % 360);
        }
      }
      break;

    case 'triad':
      for (let i = 0; i < count; i++) {
        const step = (i % 3) * 120;
        const sub = Math.floor(i / 3) * 15;
        hues.push((baseH + step + sub) % 360);
      }
      break;

    case 'tetrad':
      for (let i = 0; i < count; i++) {
        const step = (i % 4) * 90;
        hues.push((baseH + step) % 360);
      }
      break;

    case 'contrast':
      for (let i = 0; i < count; i++) {
        if (i === 0) hues.push(baseH);
        else if (i === 1) hues.push((baseH + 180) % 360);
        else if (i === 2) hues.push((baseH + 90) % 360);
        else if (i === 3) hues.push((baseH + 270) % 360);
        else hues.push((baseH + i * 45) % 360);
      }
      break;

    case 'monochrome':
      for (let i = 0; i < count; i++) {
        hues.push(baseH);
      }
      break;

    case 'harmonious':
    case 'custom':
    default:
      // Golden ratio harmonic distribution with dedicated functional roles
      // e.g. Primary (base), Secondary (shifted), Background (light/tinted), Light (almost white), Dark (deep navy/slate)
      break;
  }

  const result: ColorItem[] = [];

  for (let i = 0; i < count; i++) {
    // Check if existing locked color should be preserved
    if (existingColors && existingColors[i] && existingColors[i].locked) {
      result.push(existingColors[i]);
      continue;
    }

    let h = baseH;
    let s = baseS;
    let v = baseV;

    if (harmony === 'monochrome') {
      // Step through values
      const step = i / (count - 1 || 1);
      s = clamp(baseS * (1 - step * 0.5), 15, 95);
      v = clamp(20 + step * 78, 15, 98);
      if (i === 0) {
        // keep base color prominent
        s = baseS;
        v = baseV;
      }
    } else if (harmony === 'harmonious' || harmony === 'custom') {
      // Create modern balanced palette as seen in screenshot:
      // #2563EB (Primary), #60A5FA (Secondary), #DBEAFE (Light tint background), #F8FAFC (Near white), #0F172A (Deep dark slate)
      if (i === 0) {
        h = baseH;
        s = baseS;
        v = baseV;
      } else if (i === 1) {
        h = (baseH + 5) % 360;
        s = clamp(baseS * 0.75, 40, 95);
        v = clamp(baseV * 1.15, 60, 98);
      } else if (i === 2) {
        h = (baseH - 5 + 360) % 360;
        s = clamp(baseS * 0.18, 8, 25);
        v = 99;
      } else if (i === 3) {
        h = (baseH + 360) % 360;
        s = clamp(baseS * 0.05, 2, 8);
        v = 99;
      } else if (i === 4) {
        h = (baseH + 10) % 360;
        s = clamp(baseS * 0.6, 40, 75);
        v = 15;
      } else {
        h = (baseH + 35) % 360;
        s = clamp(baseS * 0.8, 40, 90);
        v = 85;
      }
    } else {
      h = hues[i] ?? baseH;
      if (i === count - 1 && count >= 4) {
        // Make last color dark contrast anchor
        s = clamp(baseS * 0.5, 30, 60);
        v = 16;
      } else if (i === count - 2 && count >= 5) {
        // Make second to last color very light
        s = clamp(baseS * 0.08, 3, 12);
        v = 98;
      } else if (i > 0) {
        s = clamp(baseS * (1 - (i * 0.1)), 25, 95);
        v = clamp(baseV * (1 - (i * 0.05)), 40, 98);
      }
    }

    const rgb = hsvToRgb({ h, s, v });
    const hex = rgbToHex(rgb);
    const role = getRoleName(i, count);
    result.push(createColorItem(hex, role));
  }

  return result;
}

export function getRandomHex(): string {
  const colors = [
    '#2563EB', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', 
    '#F43F5E', '#EF4444', '#F97316', '#F59E0B', '#10B981', 
    '#06B6D4', '#0EA5E9', '#14B8A6', '#84CC16', '#D946EF'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

export function getContrastTextColor(hex: string): string {
  const rgb = hexToRgb(hex);
  // Relative luminance
  const yiq = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  return yiq >= 150 ? '#0F172A' : '#FFFFFF';
}

export function exportCssVariables(colors: ColorItem[]): string {
  let css = `:root {\n`;
  colors.forEach((c) => {
    const safeRole = c.role.toLowerCase()
      .replace(/[^a-z0-9а-яё]/gi, '-')
      .replace(/[а-яё]/gi, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || `color-${c.id}`;
    css += `  --color-${safeRole}: ${c.hex};\n`;
  });
  css += `}\n`;
  return css;
}

export function exportJson(colors: ColorItem[]): string {
  const data = colors.map((c) => ({
    role: c.role,
    hex: c.hex,
    rgb: `${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b}`,
    hsl: `${c.hsl.h}°, ${c.hsl.s}%, ${c.hsl.l}%`,
    cmyk: `${c.cmyk.c}, ${c.cmyk.m}, ${c.cmyk.y}, ${c.cmyk.k}`,
  }));
  return JSON.stringify(data, null, 2);
}

export function exportSvg(colors: ColorItem[]): string {
  const width = 1000;
  const height = 400;
  const swatchWidth = width / colors.length;

  let rects = '';
  let labels = '';

  colors.forEach((c, idx) => {
    const x = idx * swatchWidth;
    rects += `<rect x="${x}" y="0" width="${swatchWidth}" height="${height}" fill="${c.hex}"/>\n`;
    const textColor = getContrastTextColor(c.hex);
    labels += `
      <text x="${x + swatchWidth / 2}" y="${height - 50}" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-weight="700" font-size="20" fill="${textColor}">${c.hex}</text>
      <text x="${x + swatchWidth / 2}" y="${height - 25}" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="14" fill="${textColor}" opacity="0.8">${c.role}</text>
    `;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%">
  ${rects}
  ${labels}
</svg>`;
}

export function downloadFile(content: string, fileName: string, contentType: string) {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadCanvasPng(colors: ColorItem[]) {
  const canvas = document.createElement('canvas');
  const width = 1200;
  const height = 630;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  // Swatches
  const swatchHeight = 440;
  const swatchWidth = width / colors.length;

  colors.forEach((c, idx) => {
    const x = idx * swatchWidth;
    ctx.fillStyle = c.hex;
    ctx.fillRect(x, 0, swatchWidth, swatchHeight);

    // Label on swatch
    const textColor = getContrastTextColor(c.hex);
    ctx.fillStyle = textColor;
    ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(c.hex, x + swatchWidth / 2, swatchHeight - 45);

    ctx.font = '16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(c.role, x + swatchWidth / 2, swatchHeight - 20);
  });

  // Bottom info area
  ctx.fillStyle = '#F8FAFC';
  ctx.fillRect(0, swatchHeight, width, height - swatchHeight);

  // Title
  ctx.fillStyle = '#0F172A';
  ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Палитра цветов • Подбор для бренда и печати', 40, swatchHeight + 50);

  ctx.fillStyle = '#64748B';
  ctx.font = '15px "Plus Jakarta Sans", sans-serif';
  const codesSummary = colors.map(c => `${c.hex} (${c.role})`).join('  •  ');
  ctx.fillText(codesSummary, 40, swatchHeight + 85);

  ctx.fillText('CMYK: ' + colors.map(c => `${c.cmyk.c},${c.cmyk.m},${c.cmyk.y},${c.cmyk.k}`).join(' | '), 40, swatchHeight + 115);

  const dataUrl = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = 'color-palette.png';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
