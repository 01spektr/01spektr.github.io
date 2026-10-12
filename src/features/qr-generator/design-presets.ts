import type { QrState } from "./state";

export interface DesignPreset {
  id: string;
  name: string;
  nameRu: string;
  nameUz: string;
  dotStyle: QrState["dotStyle"];
  eyeStyle: QrState["eyeStyle"];
  fg: string;
  gradientEnabled: boolean;
  gradientColor2: string;
  gradientType: "linear" | "radial";
  gradientAngle: number;
  customEyeColor: boolean;
  eyeOuterColor: string;
  eyeInnerColor: string;
  bg: string;
}

export const DESIGN_PRESETS: DesignPreset[] = [
  {
    id: "classic",
    name: "Classic Slate",
    nameRu: "Классический",
    nameUz: "Klassik",
    dotStyle: "rounded",
    eyeStyle: "rounded",
    fg: "#1E293B",
    gradientEnabled: false,
    gradientColor2: "#334155",
    gradientType: "linear",
    gradientAngle: 45,
    customEyeColor: false,
    eyeOuterColor: "#1E293B",
    eyeInnerColor: "#1E293B",
    bg: "#FFFFFF",
  },
  {
    id: "indigo-violet",
    name: "Indigo Violet",
    nameRu: "Индиго градиент",
    nameUz: "Indigo gradient",
    dotStyle: "rounded",
    eyeStyle: "rounded",
    fg: "#4F46E5",
    gradientEnabled: true,
    gradientColor2: "#9333EA",
    gradientType: "linear",
    gradientAngle: 45,
    customEyeColor: true,
    eyeOuterColor: "#4F46E5",
    eyeInnerColor: "#9333EA",
    bg: "#FFFFFF",
  },
  {
    id: "emerald-mint",
    name: "Emerald Mint",
    nameRu: "Изумрудный свежий",
    nameUz: "Zumrad yalpiz",
    dotStyle: "soft",
    eyeStyle: "rounded",
    fg: "#059669",
    gradientEnabled: true,
    gradientColor2: "#0284C7",
    gradientType: "linear",
    gradientAngle: 45,
    customEyeColor: true,
    eyeOuterColor: "#059669",
    eyeInnerColor: "#0284C7",
    bg: "#FFFFFF",
  },
  {
    id: "sunset-glow",
    name: "Sunset Glow",
    nameRu: "Закатный огонь",
    nameUz: "Quyosh botishi",
    dotStyle: "dots",
    eyeStyle: "rounded",
    fg: "#EA580C",
    gradientEnabled: true,
    gradientColor2: "#DC2626",
    gradientType: "linear",
    gradientAngle: 45,
    customEyeColor: true,
    eyeOuterColor: "#DC2626",
    eyeInnerColor: "#EA580C",
    bg: "#FFFFFF",
  },
  {
    id: "cyber-neon",
    name: "Cyber Neon",
    nameRu: "Киберпанк",
    nameUz: "Kiberpank",
    dotStyle: "square",
    eyeStyle: "square",
    fg: "#06B6D4",
    gradientEnabled: true,
    gradientColor2: "#3B82F6",
    gradientType: "linear",
    gradientAngle: 90,
    customEyeColor: true,
    eyeOuterColor: "#3B82F6",
    eyeInnerColor: "#06B6D4",
    bg: "#FFFFFF",
  },
  {
    id: "luxury-gold",
    name: "Royal Navy & Gold",
    nameRu: "Королевский синий",
    nameUz: "Qirollik ko'ki",
    dotStyle: "rounded",
    eyeStyle: "rounded",
    fg: "#0F172A",
    gradientEnabled: false,
    gradientColor2: "#0F172A",
    gradientType: "linear",
    gradientAngle: 45,
    customEyeColor: true,
    eyeOuterColor: "#D97706",
    eyeInnerColor: "#D97706",
    bg: "#FFFFFF",
  },
];
