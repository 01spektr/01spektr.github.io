import type { Geometry, RoofInput } from "./model.ts";
type P = [number, number];
function clip(points: P[], boundary: number, keepRight: boolean): P[] {
  const out: P[] = [];
  for (let k = 0; k < points.length; k++) {
    const p = points[k],
      q = points[(k + 1) % points.length];
    const inside = (v: P) => (keepRight ? v[0] >= boundary : v[0] <= boundary);
    if (inside(p)) out.push(p);
    if (inside(p) !== inside(q)) {
      const t = (boundary - p[0]) / (q[0] - p[0]);
      out.push([boundary, p[1] + t * (q[1] - p[1])]);
    }
  }
  return out;
}
export function coverCount(length: number, sheet: number, overlap: number) {
  if (length <= 0) return 0;
  return Math.max(1, 1 + Math.ceil((length - sheet - 1e-9) / (sheet - overlap)));
}
export function calculateMaterials(i: RoofInput, g: Geometry) {
  // Each strip is covered to its longest segment. Offcuts are not reused.
  const layout = g.panels.map((panel) => {
    const width = Math.max(...panel.points.map((p) => p[0]));
    const columns = Math.ceil(width / i.sheetWidth - 1e-9);
    let sheets = 0;
    for (let c = 0; c < columns; c++) {
      const band = clip(clip(panel.points, c * i.sheetWidth, true), (c + 1) * i.sheetWidth, false);
      if (!band.length) continue;
      const ys = band.map((p) => p[1]);
      sheets += coverCount(Math.max(...ys) - Math.min(...ys), i.sheetLength, i.overlap);
    }
    return { name: panel.name, columns, sheets };
  });
  const baseSheets = layout.reduce((n, p) => n + p.sheets, 0),
    reserve = Math.ceil((baseSheets * i.waste) / 100 - 1e-9),
    sheets = baseSheets + reserve;
  const ridgePieces = coverCount(g.ridge, 2, 0.1);
  const hipPieces = g.hips ? 4 * coverCount(g.hips / 4, 2, 0.1) : 0;
  return {
    layout,
    baseSheets,
    reserve,
    sheets,
    ridgePieces,
    hipPieces,
    screws: Math.ceil(g.area * i.screws * (1 + i.waste / 100)),
    materialArea: g.area * (1 + i.waste / 100),
    purchasedWorkingArea: sheets * i.sheetWidth * i.sheetLength,
  };
}
