export type RoofType = "gable" | "hip" | "shed" | "mansard";
export type Point = [number, number, number];
export type Panel = { name: string; points: [number, number][] };
export type RoofInput = {
  type: RoofType;
  mode: "angle" | "height";
  length: number;
  width: number;
  angle: number;
  height: number;
  eaves: number;
  gable: number;
  lowerAngle: number;
  breakRun: number;
  material: "tile" | "profile";
  sheetWidth: number;
  sheetLength: number;
  overlap: number;
  waste: number;
  screws: number;
  sheetPrice: number;
  ridgePrice: number;
  screwPrice: number;
};
export type Geometry = {
  area: number;
  projection: number;
  ridge: number;
  hips: number;
  height: number;
  angle: number;
  slope: number;
  faces: Point[][];
  panels: Panel[];
  profile: [number, number][];
  roofLength: number;
};
export const ROOF_NAMES: Record<RoofType, string> = {
  gable: "Двускатная",
  hip: "Вальмовая",
  shed: "Односкатная",
  mansard: "Мансардная",
};
export const MATERIALS = {
  tile: { name: "Металлочерепица", sheetWidth: 1.1, sheetLength: 4.5, overlap: 0.2, screws: 8 },
  profile: { name: "Профнастил", sheetWidth: 1.05, sheetLength: 3, overlap: 0.2, screws: 7 },
};
export const DEFAULTS: RoofInput = {
  type: "gable",
  mode: "angle",
  length: 8,
  width: 6,
  angle: 30,
  height: 1.7320508075688772,
  eaves: 0.5,
  gable: 0.3,
  lowerAngle: 60,
  breakRun: 1.5,
  material: "tile",
  sheetWidth: 1.1,
  sheetLength: 4.5,
  overlap: 0.2,
  screws: 8,
  waste: 10,
  sheetPrice: 0,
  ridgePrice: 0,
  screwPrice: 0,
};
export const fmt = (n: number, digits = 2) =>
  new Intl.NumberFormat("ru-RU", { maximumFractionDigits: digits }).format(n);
