import { RGB, PantoneMatch, PantoneColor } from '../types';
import { PANTONE_DATABASE } from '../data/pantoneDatabase';
import { rgbToLab, calculateDeltaE } from './colorConversion';

export function findClosestPantone(
  rgb: RGB,
  categoryFilter?: 'all' | 'coated' | 'uncoated',
  topCount: number = 6
): PantoneMatch[] {
  const currentLab = rgbToLab(rgb);

  const database = categoryFilter && categoryFilter !== 'all'
    ? PANTONE_DATABASE.filter((p) => p.category === categoryFilter)
    : PANTONE_DATABASE;

  const matches: PantoneMatch[] = database.map((pantone: PantoneColor) => {
    const deltaE = calculateDeltaE(currentLab, pantone.lab);
    
    // Normalized match score (0 - 100%)
    // ΔE of 0 is 100%, ΔE of 20 is ~0%
    const matchScore = Math.max(0, Math.min(100, Math.round((1 - Math.min(deltaE, 25) / 25) * 100)));

    let quality: PantoneMatch['quality'] = 'approximate';
    if (deltaE < 1.8) {
      quality = 'perfect';
    } else if (deltaE < 3.8) {
      quality = 'good';
    } else if (deltaE < 7.0) {
      quality = 'close';
    }

    return {
      pantone,
      deltaE: Math.round(deltaE * 10) / 10,
      matchScore,
      quality,
    };
  });

  matches.sort((a, b) => a.deltaE - b.deltaE);

  return matches.slice(0, topCount);
}

export function getQualityLabel(quality: PantoneMatch['quality']): { text: string; colorClass: string } {
  switch (quality) {
    case 'perfect':
      return { text: 'Точное совпадение', colorClass: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    case 'good':
      return { text: 'Хорошее совпадение', colorClass: 'text-blue-700 bg-blue-50 border-blue-200' };
    case 'close':
      return { text: 'Близкий оттенок', colorClass: 'text-amber-700 bg-amber-50 border-amber-200' };
    case 'approximate':
      return { text: 'Приблизительно', colorClass: 'text-slate-600 bg-slate-100 border-slate-200' };
  }
}
