import type { Geometry, Panel, Point, RoofInput } from "./model.ts";
const rad = (a: number) => (a * Math.PI) / 180;
const rectangle = (name: string, width: number, height: number): Panel => ({
  name,
  points: [
    [0, 0],
    [width, 0],
    [width, height],
    [0, height],
  ],
});
export function polygonArea(points: [number, number][]) {
  return (
    Math.abs(
      points.reduce((s, p, i) => {
        const q = points[(i + 1) % points.length];
        return s + p[0] * q[1] - q[0] * p[1];
      }, 0),
    ) / 2
  );
}
function finish(g: Omit<Geometry, "area">): Geometry {
  return { ...g, area: g.panels.reduce((a, p) => a + polygonArea(p.points), 0) };
}
function angleFor(i: RoofInput, run: number) {
  return i.mode === "height" ? Math.atan(i.height / run) : rad(i.angle);
}
// Eaves are measured horizontally; H is measured above the wall top, not the ground.
export function gable(i: RoofInput): Geometry {
  const a = angleFor(i, i.width / 2),
    h = (i.width / 2) * Math.tan(a),
    x = i.width / 2 + i.eaves;
  const z = -i.eaves * Math.tan(a),
    y = (i.length + 2 * i.gable) / 2,
    slope = x / Math.cos(a);
  const faces: Point[][] = [
    [
      [-x, -y, z],
      [0, -y, h],
      [0, y, h],
      [-x, y, z],
    ],
    [
      [0, -y, h],
      [x, -y, z],
      [x, y, z],
      [0, y, h],
    ],
  ];
  return finish({
    height: h,
    angle: (a * 180) / Math.PI,
    slope,
    ridge: 2 * y,
    hips: 0,
    projection: 4 * x * y,
    roofLength: 2 * y,
    faces,
    profile: [
      [-x, z],
      [0, h],
      [x, z],
    ],
    panels: [rectangle("Скат 1", 2 * y, slope), rectangle("Скат 2", 2 * y, slope)],
  });
}
export function shed(i: RoofInput): Geometry {
  const a = angleFor(i, i.width),
    h = i.width * Math.tan(a),
    x = i.width / 2 + i.eaves,
    y = (i.length + 2 * i.gable) / 2;
  const low = -i.eaves * Math.tan(a),
    high = h + i.eaves * Math.tan(a),
    slope = (2 * x) / Math.cos(a);
  return finish({
    height: h,
    angle: (a * 180) / Math.PI,
    slope,
    ridge: 0,
    hips: 0,
    projection: 4 * x * y,
    roofLength: 2 * y,
    faces: [
      [
        [-x, -y, low],
        [x, -y, high],
        [x, y, high],
        [-x, y, low],
      ],
    ],
    profile: [
      [-x, low],
      [x, high],
    ],
    panels: [rectangle("Скат", 2 * y, slope)],
  });
}
// Equal pitches and equal perimeter overhang. A >= B; A=B yields a pyramid roof.
export function hip(i: RoofInput): Geometry {
  const a = angleFor(i, i.width / 2),
    h = (i.width / 2) * Math.tan(a),
    x = i.width / 2 + i.eaves,
    y = i.length / 2 + i.eaves;
  const z = -i.eaves * Math.tan(a),
    r = (i.length - i.width) / 2,
    slope = x / Math.cos(a);
  const faces: Point[][] = [
    [
      [-x, -y, z],
      [0, -r, h],
      [0, r, h],
      [-x, y, z],
    ],
    [
      [0, -r, h],
      [x, -y, z],
      [x, y, z],
      [0, r, h],
    ],
    [
      [-x, -y, z],
      [x, -y, z],
      [0, -r, h],
    ],
    [
      [-x, y, z],
      [0, r, h],
      [x, y, z],
    ],
  ];
  const trap: [number, number][] = [
    [0, 0],
    [2 * y, 0],
    [y + r, slope],
    [y - r, slope],
  ];
  const triangle: [number, number][] = [
    [0, 0],
    [2 * x, 0],
    [x, slope],
  ];
  return finish({
    height: h,
    angle: (a * 180) / Math.PI,
    slope,
    ridge: 2 * r,
    hips: 4 * Math.hypot(x, x, h - z),
    projection: 4 * x * y,
    roofLength: 2 * y,
    faces,
    profile: [
      [-x, z],
      [0, h],
      [x, z],
    ],
    panels: [
      { name: "Трапеция 1", points: trap },
      { name: "Трапеция 2", points: trap },
      { name: "Вальма 1", points: triangle },
      { name: "Вальма 2", points: triangle },
    ],
  });
}
export function mansard(i: RoofInput): Geometry {
  const a = rad(i.angle),
    lower = rad(i.lowerAngle),
    b = i.width / 2 - i.breakRun,
    y = (i.length + 2 * i.gable) / 2,
    x = i.width / 2 + i.eaves;
  const bend = i.breakRun * Math.tan(lower),
    h = bend + b * Math.tan(a),
    z = -i.eaves * Math.tan(lower);
  const profile: [number, number][] = [
    [-x, z],
    [-b, bend],
    [0, h],
    [b, bend],
    [x, z],
  ];
  const faces: Point[][] = profile.slice(0, -1).map((p, k) => {
    const q = profile[k + 1];
    return [
      [p[0], -y, p[1]],
      [q[0], -y, q[1]],
      [q[0], y, q[1]],
      [p[0], y, p[1]],
    ];
  });
  const bottom = (i.breakRun + i.eaves) / Math.cos(lower),
    top = b / Math.cos(a);
  return finish({
    height: h,
    angle: i.angle,
    slope: bottom + top,
    ridge: 2 * y,
    hips: 0,
    projection: 4 * x * y,
    roofLength: 2 * y,
    faces,
    profile,
    panels: [
      rectangle("Нижний скат 1", 2 * y, bottom),
      rectangle("Верхний скат 1", 2 * y, top),
      rectangle("Верхний скат 2", 2 * y, top),
      rectangle("Нижний скат 2", 2 * y, bottom),
    ],
  });
}
export const calculateGeometry = (i: RoofInput) => ({ gable, hip, shed, mansard })[i.type](i);
