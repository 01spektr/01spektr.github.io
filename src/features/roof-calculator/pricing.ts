import { MATERIALS, type RoofInput } from "./model.ts";
import type { calculateMaterials } from "./materials.ts";
export function estimate(i: RoofInput, m: ReturnType<typeof calculateMaterials>) {
  const rows = [
    {
      name: MATERIALS[i.material].name,
      quantity: m.sheets,
      key: "sheetPrice" as const,
      unit: "лист",
    },
    {
      name: "Конёк и вальмовые планки, 2 м",
      quantity: m.ridgePieces + m.hipPieces,
      key: "ridgePrice" as const,
      unit: "шт.",
    },
    { name: "Кровельные саморезы", quantity: m.screws, key: "screwPrice" as const, unit: "шт." },
  ];
  return rows.map((r) => {
    const price = Number.isFinite(i[r.key]) && i[r.key] >= 0 ? i[r.key] : 0;
    return { ...r, price, total: r.quantity * price };
  });
}
