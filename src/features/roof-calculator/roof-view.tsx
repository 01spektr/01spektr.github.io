import { useId } from "react";
import { fmt, type Geometry, type Point, type RoofInput } from "./model";
export function RoofView({
  input: i,
  geometry: g,
  flat = false,
  rotate = false,
}: {
  input: RoofInput;
  geometry: Geometry;
  flat?: boolean;
  rotate?: boolean;
}) {
  const uid = useId().replace(/:/g, "");
  const wall = 2.6;
  const project = (p: Point): [number, number] => {
    if (flat) return [p[0], -p[2]];
    const x = rotate ? -p[0] : p[0],
      y = rotate ? -p[1] : p[1];
    return [x * 0.83 + y * 0.55, x * 0.28 - y * 0.42 - p[2] * 0.95];
  };
  const ground: Point[] = [
    [-i.width / 2, -i.length / 2, -wall],
    [i.width / 2, -i.length / 2, -wall],
    [i.width / 2, i.length / 2, -wall],
    [-i.width / 2, i.length / 2, -wall],
  ];
  const all = [...g.faces.flat(), ...ground].map(project);
  const xs = all.map((p) => p[0]),
    ys = all.map((p) => p[1]);
  const minX = Math.min(...xs),
    maxX = Math.max(...xs),
    minY = Math.min(...ys),
    maxY = Math.max(...ys);
  const scale = Math.min(390 / (maxX - minX), 235 / (maxY - minY));
  const p = (point: Point): [number, number] => {
    const q = project(point);
    return [260 + (q[0] - (minX + maxX) / 2) * scale, 166 + (q[1] - (minY + maxY) / 2) * scale];
  };
  const points = (face: Point[]) => face.map((v) => p(v).join(",")).join(" ");
  const dim = (a: Point, b: Point, label: string, dy = 20) => {
    const u = p(a),
      v = p(b);
    return (
      <g className="rv-dimension">
        <path
          d={`M ${u[0]} ${u[1] + 6} V ${u[1] + dy + 7} M ${v[0]} ${v[1] + 6} V ${v[1] + dy + 7} M ${u[0]} ${u[1] + dy} L ${v[0]} ${v[1] + dy}`}
        />
        <text x={(u[0] + v[0]) / 2} y={(u[1] + v[1]) / 2 + dy + 18} textAnchor="middle">
          {label}
        </text>
      </g>
    );
  };
  const walls: Point[][] = ground.map((a, k) => {
    const b = ground[(k + 1) % 4];
    return [a, b, [b[0], b[1], 0], [a[0], a[1], 0]];
  });
  const heightAt = (x: number) => {
    for (let k = 0; k < g.profile.length - 1; k++) {
      const a = g.profile[k],
        b = g.profile[k + 1];
      if (x >= a[0] && x <= b[0]) return a[1] + ((b[1] - a[1]) * (x - a[0])) / (b[0] - a[0]);
    }
    return 0;
  };
  const wallProfile: [number, number][] = [
    [-i.width / 2, heightAt(-i.width / 2)],
    ...g.profile.filter((v) => v[0] > -i.width / 2 && v[0] < i.width / 2),
    [i.width / 2, heightAt(i.width / 2)],
  ];
  const ends: Point[][] =
    i.type === "hip"
      ? []
      : [-i.length / 2, i.length / 2].map((y) => [
          [-i.width / 2, y, 0] as Point,
          ...wallProfile.map(([x, z]) => [x, y, z] as Point),
          [i.width / 2, y, 0] as Point,
        ]);
  const depth = (f: Point[]) =>
    f.reduce((s, v) => s + (rotate ? -1 : 1) * (v[0] - v[1]), 0) / f.length;
  const facades = [...walls, ...ends].sort((a, b) => depth(a) - depth(b));
  const sorted = g.faces
    .map((f, k) => ({ f, k }))
    .sort((a, b) => {
      const avg = (f: Point[]) =>
        f.reduce((s, v) => s + (rotate ? -1 : 1) * (v[0] - v[1]), 0) / f.length;
      return avg(a.f) - avg(b.f);
    });
  return (
    <svg
      className="rv-svg"
      viewBox="0 0 520 370"
      role="img"
      aria-label={`${flat ? "Разрез" : "Аксонометрическая схема"} крыши: площадь ${fmt(g.area)} м², высота ${fmt(g.height)} м`}
    >
      <defs>
        <pattern id={`${uid}-grid`} width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M 24 0 H 0 V 24" fill="none" stroke="currentColor" strokeWidth=".5" />
        </pattern>
      </defs>
      <rect width="520" height="370" fill={`url(#${uid}-grid)`} className="rv-grid" />
      {!flat && <polygon points={points(ground)} className="rv-ground" />}
      {!flat &&
        facades.map((f, k) => (
          <polygon key={k} points={points(f)} className={`rv-wall wall-${k % 2}`} />
        ))}
      {flat ? (
        <>
          <polygon
            points={points([
              ...g.profile.map(([x, z]) => [x, 0, z] as Point),
              [i.width / 2, 0, -wall],
              [-i.width / 2, 0, -wall],
            ])}
            className="rv-wall"
          />
          <polyline points={points(g.profile.map(([x, z]) => [x, 0, z]))} className="rv-profile" />
          <line
            x1={p([0, 0, 0])[0]}
            y1={p([0, 0, 0])[1]}
            x2={p([0, 0, g.height])[0]}
            y2={p([0, 0, g.height])[1]}
            className="rv-height"
          />
          <text
            x={p([0, 0, g.height / 2])[0] + 10}
            y={p([0, 0, g.height / 2])[1]}
            className="rv-label"
          >
            H {fmt(g.height)} м
          </text>
          <text x="32" y="36" className="rv-label">
            Угол {fmt(g.angle, 1)}°{i.type === "mansard" ? ` / ${i.lowerAngle}°` : ""}
          </text>
        </>
      ) : (
        sorted.map(({ f, k }) => (
          <g key={k}>
            <clipPath id={`${uid}-${k}`}>
              <polygon points={points(f)} />
            </clipPath>
            <polygon points={points(f)} className={`rv-roof roof-face-${k % 4}`} />
            <g clipPath={`url(#${uid}-${k})`} className="rv-seams">
              {Array.from({ length: 26 }, (_, n) => (
                <path key={n} d={`M ${n * 23 - 140} 0 l 240 370`} />
              ))}
            </g>
          </g>
        ))
      )}
      {dim(ground[0], ground[1], `B · ${fmt(i.width)} м`)}
      {!flat && dim(ground[1], ground[2], `A · ${fmt(i.length)} м`, 27)}
      {!flat && (
        <g className="rv-height-note">
          <text x="28" y="34">
            H · {fmt(g.height)} м
          </text>
          <text x="28" y="54">
            Угол · {fmt(g.angle, 1)}°
          </text>
        </g>
      )}
      <text x="260" y="359" textAnchor="middle" className="rv-caption">
        {flat
          ? "Поперечный разрез · H от верха стен"
          : "Схема в масштабе · условная высота стен 2,6 м"}
      </text>
    </svg>
  );
}
