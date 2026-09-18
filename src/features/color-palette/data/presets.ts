import { HarmonyMode, PaletteStyle, CuratedPalette } from '../types';

export interface HarmonyOption {
  id: HarmonyMode;
  name: string;
  desc: string;
  dots: string[];
}

export const HARMONY_OPTIONS: HarmonyOption[] = [
  {
    id: 'custom',
    name: 'Произвольная',
    desc: 'Создайте свою палитру',
    dots: ['#3B82F6', '#60A5FA', '#93C5FD'],
  },
  {
    id: 'harmonious',
    name: 'Гармоничная',
    desc: 'Сбалансированные цвета',
    dots: ['#F59E0B', '#FBBF24', '#FCD34D'],
  },
  {
    id: 'contrast',
    name: 'Контрастная',
    desc: 'Высокий контраст',
    dots: ['#EC4899', '#3B82F6', '#F43F5E'],
  },
  {
    id: 'analogous',
    name: 'Аналоговая',
    desc: 'Схожие оттенки',
    dots: ['#10B981', '#14B8A6', '#06B6D4'],
  },
  {
    id: 'complementary',
    name: 'Комплементарная',
    desc: 'Противоположные цвета',
    dots: ['#F97316', '#3B82F6'],
  },
  {
    id: 'triad',
    name: 'Триада',
    desc: 'Три цвета на круге',
    dots: ['#EF4444', '#10B981', '#3B82F6'],
  },
  {
    id: 'tetrad',
    name: 'Тетрада',
    desc: 'Четыре гармоничных цвета',
    dots: ['#EC4899', '#F59E0B', '#10B981', '#3B82F6'],
  },
  {
    id: 'monochrome',
    name: 'Монохромная',
    desc: 'Один цвет, разные оттенки',
    dots: ['#6366F1', '#818CF8', '#A5B4FC'],
  },
];

export interface QuickPresetCategory {
  id: string;
  name: string;
  colors: string[];
  style: PaletteStyle;
}

export const QUICK_PALETTES: QuickPresetCategory[] = [
  {
    id: 'popular',
    name: 'Популярные',
    colors: ['#2563EB', '#60A5FA', '#DBEAFE', '#F8FAFC', '#0F172A'],
    style: 'modern',
  },
  {
    id: 'minimalism',
    name: 'Минимализм',
    colors: ['#18181B', '#71717A', '#E4E4E7', '#FAFAFA', '#09090B'],
    style: 'minimal',
  },
  {
    id: 'nature',
    name: 'Природа',
    colors: ['#15803D', '#22C55E', '#86EFAC', '#FEF08A', '#14532D'],
    style: 'warm',
  },
  {
    id: 'tech',
    name: 'Технологии',
    colors: ['#0284C7', '#38BDF8', '#BAE6FD', '#0F172A', '#0369A1'],
    style: 'modern',
  },
  {
    id: 'pastel',
    name: 'Пастель',
    colors: ['#F472B6', '#C084FC', '#93C5FD', '#FDE047', '#475569'],
    style: 'pastel',
  },
  {
    id: 'vibrant',
    name: 'Яркие',
    colors: ['#F97316', '#EF4444', '#EC4899', '#8B5CF6', '#1E1B4B'],
    style: 'neon',
  },
  {
    id: 'blackwhite',
    name: 'Чёрно-белые',
    colors: ['#000000', '#333333', '#888888', '#E5E5E5', '#FFFFFF'],
    style: 'minimal',
  },
];

export const CURATED_PALETTES: CuratedPalette[] = [
  {
    id: 'ocean',
    name: 'Ocean',
    colors: ['#1E3A8A', '#2563EB', '#3B82F6', '#93C5FD', '#EFF6FF'],
    tags: ['синий', 'холодный', 'свежий'],
  },
  {
    id: 'sunset',
    name: 'Sunset',
    colors: ['#F59E0B', '#F97316', '#EF4444', '#EC4899', '#831843'],
    tags: ['теплый', 'закат', 'энергия'],
  },
  {
    id: 'forest',
    name: 'Forest',
    colors: ['#14532D', '#15803D', '#22C55E', '#86EFAC', '#F0FDF4'],
    tags: ['зеленый', 'эко', 'природа'],
  },
  {
    id: 'lavender',
    name: 'Lavender',
    colors: ['#581C87', '#7E22CE', '#A855F7', '#C084FC', '#FAF5FF'],
    tags: ['фиолетовый', 'элегантный', 'нежный'],
  },
  {
    id: 'nordic',
    name: 'Nordic Slate',
    colors: ['#0F172A', '#334155', '#64748B', '#CBD5E1', '#F8FAFC'],
    tags: ['скандинавский', 'серый', 'минимализм'],
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    colors: ['#06B6D4', '#3B82F6', '#D946EF', '#F43F5E', '#0B0F19'],
    tags: ['неон', 'футуристичный', 'яркий'],
  },
  {
    id: 'desert',
    name: 'Desert Dunes',
    colors: ['#78350F', '#B45309', '#D97706', '#FDE68A', '#FFFBEB'],
    tags: ['песок', 'терракота', 'уют'],
  },
  {
    id: 'minty',
    name: 'Fresh Mint',
    colors: ['#065F46', '#059669', '#10B981', '#6EE7B7', '#ECFDF5'],
    tags: ['мята', 'чистота', 'медицина'],
  },
];
