import test from "node:test";
import assert from "node:assert/strict";
import { DEFAULTS } from "./model.ts";
import { calculateGeometry } from "./geometry.ts";
import { calculateMaterials, coverCount } from "./materials.ts";
import { validate } from "./validation.ts";
import { serialize, deserialize } from "./storage.ts";
import { estimate } from "./pricing.ts";
const near = (a: number, b: number) => assert.ok(Math.abs(a - b) < 1e-8, `${a} != ${b}`);
test("gable 8×6, 45°, no overhang", () => {
  const g = calculateGeometry({ ...DEFAULTS, angle: 45, eaves: 0, gable: 0 });
  near(g.height, 3);
  near(g.area, 48 * Math.SQRT2);
  near(g.projection, 48);
});
test("horizontal overhang expands projected and sloped area consistently", () => {
  const g = calculateGeometry(DEFAULTS);
  near(g.projection, 8.6 * 7);
  near(g.area, g.projection / Math.cos(Math.PI / 6));
  near(g.slope, 3.5 / Math.cos(Math.PI / 6));
});
test("height mode reproduces angle mode", () => {
  const g = calculateGeometry(DEFAULTS);
  near(calculateGeometry({ ...DEFAULTS, mode: "height", height: g.height }).area, g.area);
});
test("hip equal slopes area and ridge, square roof has no ridge", () => {
  const i = { ...DEFAULTS, type: "hip" as const };
  const g = calculateGeometry(i);
  near(g.area, (9 * 7) / Math.cos(Math.PI / 6));
  near(g.ridge, 2);
  near(calculateGeometry({ ...i, length: 6 }).ridge, 0);
});
test("shed uses full span and no ridge", () => {
  const g = calculateGeometry({ ...DEFAULTS, type: "shed", angle: 45, eaves: 0, gable: 0 });
  near(g.height, 6);
  near(g.area, 48 * Math.SQRT2);
  assert.equal(g.ridge, 0);
});
test("mansard separately sums upper and lower slopes", () => {
  const g = calculateGeometry({ ...DEFAULTS, type: "mansard", eaves: 0, gable: 0 });
  near(g.height, 1.5 * Math.tan(Math.PI / 3) + 1.5 * Math.tan(Math.PI / 6));
  near(g.area, 16 * (1.5 / Math.cos(Math.PI / 3) + 1.5 / Math.cos(Math.PI / 6)));
  assert.equal(g.panels.length, 4);
});
test("sheet overlap and exact boundary", () => {
  assert.equal(coverCount(4.5, 4.5, 0.2), 1);
  assert.equal(coverCount(8.8, 4.5, 0.2), 2);
  assert.equal(coverCount(8.81, 4.5, 0.2), 3);
});
test("reserve adds whole sheets and increases estimate", () => {
  const i = { ...DEFAULTS, sheetPrice: 100 };
  const g = calculateGeometry(i);
  const m = calculateMaterials(i, g);
  assert.equal(m.baseSheets, 16);
  assert.equal(m.reserve, 2);
  assert.equal(m.sheets, 18);
  assert.equal(estimate(i, m)[0].total, 1800);
});
test("invalid and impossible inputs rejected", () => {
  for (const width of [NaN, Infinity, -1, 0, 101])
    assert.ok(validate({ ...DEFAULTS, width }).width);
  assert.ok(validate({ ...DEFAULTS, type: "hip", length: 4 }).length);
  assert.ok(validate({ ...DEFAULTS, type: "mansard", breakRun: 4 }).breakRun);
  assert.ok(validate({ ...DEFAULTS, sheetLength: 0.5, overlap: 0.5 }).overlap);
});
test("full state round trip for each roof", () => {
  for (const type of ["gable", "hip", "shed", "mansard"] as const) {
    const i = { ...DEFAULTS, type, sheetPrice: 12345 };
    assert.deepEqual(deserialize(new URLSearchParams(serialize(i))), i);
  }
});
test("geometry remains finite and area >= projection across valid range", () => {
  for (const type of ["gable", "hip", "shed", "mansard"] as const)
    for (const angle of [5, 30, 55])
      for (const eaves of [0, 0.5, 2]) {
        const i = { ...DEFAULTS, type, angle, eaves };
        assert.deepEqual(validate(i), {});
        const g = calculateGeometry(i);
        assert.ok(Number.isFinite(g.area) && g.area >= g.projection - 1e-8);
        const m = calculateMaterials(i, g);
        assert.ok(Number.isInteger(m.sheets) && m.sheets > 0);
      }
});
