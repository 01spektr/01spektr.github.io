import {
  clampLogoSize,
  effectiveEcc,
  type DotStyle,
  type EyeStyle,
  type QrContentType,
  type QrState,
} from "./state";

const POSITION_TYPE = 2;

export interface MatrixResult {
  size: number;
  version: number;
  data: boolean[][];
  types: number[][];
}

export interface QrGraphic {
  vbWidth: number;
  vbHeight: number;
  bgFill: string | "none";
  bgRx: number;
  modulePath: string;
  fg: string;
  finders: { x: number; y: number }[];
  quiet: number;
  logo: {
    x: number;
    y: number;
    size: number;
    pad: number;
    href: string;
    rx: number;
  } | null;
  badge: {
    x: number;
    y: number;
    size: number;
    type: QrContentType;
  } | null;
  caption: {
    text: string;
    x: number;
    y: number;
    font: string;
    size: number;
  } | null;
  eyeStyle: EyeStyle;
  framePad: number;
}

let encodePromise: Promise<typeof import("uqr").encode> | null = null;

async function loadEncode() {
  if (!encodePromise) {
    encodePromise = import("uqr").then((m) => m.encode);
  }
  return encodePromise;
}

export async function encodeMatrix(
  payload: string,
  state: QrState,
): Promise<MatrixResult | { error: string }> {
  if (!payload.trim()) return { error: "empty" };
  try {
    const encode = await loadEncode();
    const result = encode(payload, {
      ecc: effectiveEcc(state),
      boostEcc: Boolean(state.logoEnabled && state.logoDataUrl),
      border: 0,
    });
    return {
      size: result.size,
      version: result.version,
      data: result.data,
      types: result.types,
    };
  } catch {
    return { error: "overflow" };
  }
}

function isFinderModule(types: number[][], x: number, y: number): boolean {
  return types[y]?.[x] === POSITION_TYPE;
}

function roundedModule(
  x: number,
  y: number,
  n: boolean,
  e: boolean,
  s: boolean,
  w: boolean,
  r: number,
): string {
  const x0 = x;
  const y0 = y;
  const x1 = x + 1;
  const y1 = y + 1;
  const tl = !n && !w;
  const tr = !n && !e;
  const br = !s && !e;
  const bl = !s && !w;
  let d = tl ? `M${x0 + r} ${y0}` : `M${x0} ${y0}`;
  if (tr) d += `H${x1 - r}A${r} ${r} 0 0 1 ${x1} ${y0 + r}`;
  else d += `H${x1}`;
  if (br) d += `V${y1 - r}A${r} ${r} 0 0 1 ${x1 - r} ${y1}`;
  else d += `V${y1}`;
  if (bl) d += `H${x0 + r}A${r} ${r} 0 0 1 ${x0} ${y1 - r}`;
  else d += `H${x0}`;
  if (tl) d += `V${y0 + r}A${r} ${r} 0 0 1 ${x0 + r} ${y0}`;
  else d += `V${y0}`;
  return `${d}Z`;
}

function circleModule(x: number, y: number, radius: number): string {
  const cx = x + 0.5;
  const cy = y + 0.5;
  return `M${cx - radius} ${cy}a${radius} ${radius} 0 1 0 ${radius * 2} 0a${radius} ${radius} 0 1 0 ${-radius * 2} 0Z`;
}

function modulePath(
  data: boolean[][],
  types: number[][],
  style: DotStyle,
): string {
  const n = data.length;
  const dark = (x: number, y: number) =>
    x >= 0 && y >= 0 && x < n && y < n && Boolean(data[y]?.[x]);
  const parts: string[] = [];
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (!data[y]?.[x]) continue;
      if (isFinderModule(types, x, y)) continue;
      if (style === "square") {
        parts.push(`M${x} ${y}h1v1h-1Z`);
      } else if (style === "dots") {
        parts.push(circleModule(x, y, 0.32));
      } else if (style === "soft") {
        parts.push(circleModule(x, y, 0.46));
      } else {
        parts.push(
          roundedModule(
            x,
            y,
            dark(x, y - 1) && !isFinderModule(types, x, y - 1),
            dark(x + 1, y) && !isFinderModule(types, x + 1, y),
            dark(x, y + 1) && !isFinderModule(types, x, y + 1),
            dark(x - 1, y) && !isFinderModule(types, x - 1, y),
            0.45,
          ),
        );
      }
    }
  }
  return parts.join("");
}

function finderOrigins(size: number): { x: number; y: number }[] {
  return [
    { x: 0, y: 0 },
    { x: size - 7, y: 0 },
    { x: 0, y: size - 7 },
  ];
}

export function buildGraphic(matrix: MatrixResult, state: QrState): QrGraphic {
  const quiet = state.quietZone ? Math.max(0, state.margin) : 0;
  const n = matrix.size;
  const qrDim = n + quiet * 2;
  const framePad = state.frame === "none" ? 0 : Math.max(1.6, n * 0.06);
  const bgRx =
    state.frame === "rounded" ? Math.max(1.4, n * 0.08) : state.frame === "simple" ? 0.4 : 0;
  const captionOn = state.captionEnabled && state.caption.trim().length > 0;
  const captionSize = captionOn ? Math.max(1.4, n * 0.09) : 0;
  const captionGap = captionOn ? captionSize * 0.8 : 0;
  const vbWidth = qrDim + framePad * 2;
  const vbHeight = qrDim + framePad * 2 + captionGap + captionSize * 0.4;

  const logoOn = state.logoEnabled && Boolean(state.logoDataUrl);
  const logoRatio = clampLogoSize(state.logoSize);
  const logoSize = logoOn ? n * logoRatio : 0;
  const logoPad = logoOn ? logoSize * state.logoPadding : 0;
  const logoBox = logoSize + logoPad * 2;

  let logo: QrGraphic["logo"] = null;
  if (logoOn && state.logoDataUrl) {
    logo = {
      x: quiet + (n - logoBox) / 2,
      y: quiet + (n - logoBox) / 2,
      size: logoSize,
      pad: logoPad,
      href: state.logoDataUrl,
      rx: Math.max(0.4, logoBox * 0.18),
    };
  }

  let badge: QrGraphic["badge"] = null;
  if (!logoOn && state.typeBadge) {
    const size = n * 0.22;
    badge = {
      x: quiet + (n - size) / 2,
      y: quiet + (n - size) / 2,
      size,
      type: state.type,
    };
  }

  const caption = captionOn
    ? {
        text: state.caption.trim(),
        x: vbWidth / 2,
        y: framePad + qrDim + captionGap * 0.55,
        font: state.captionFont || "Plus Jakarta Sans",
        size: captionSize,
      }
    : null;

  return {
    vbWidth,
    vbHeight,
    bgFill: state.transparentBackground ? "none" : state.backgroundColor,
    bgRx,
    modulePath: modulePath(matrix.data, matrix.types, state.dotStyle),
    fg: state.foregroundColor,
    finders: finderOrigins(n),
    quiet,
    logo,
    badge,
    caption,
    eyeStyle: state.eyeStyle,
    framePad,
  };
}

export function typeBadgePath(type: QrContentType): string {
  switch (type) {
    case "url":
      return "M10 13a5 5 0 0 0 7.07 0l1.41-1.41a5 5 0 0 0-7.07-7.07L10 5.93M14 11a5 5 0 0 0-7.07 0L5.5 12.41a5 5 0 0 0 7.07 7.07L14 18.07";
    case "text":
      return "M4 7h16M4 12h10M4 17h7";
    case "contact":
      return "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75";
    case "wifi":
      return "M5 12.55a11 11 0 0 1 14.08 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01";
    case "email":
      return "M4 6h16v12H4zM4 7l8 6 8-6";
    case "phone":
      return "M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 6 6L16.5 13l4 1.5v3A2.5 2.5 0 0 1 18 20 15 15 0 0 1 4 6 2.5 2.5 0 0 1 6.5 3z";
    case "sms":
      return "M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-4 3v-3H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z";
    default:
      return "";
  }
}

export function escapeXml(value: string): string {
  const amp = "\u0026";
  return value
    .replace(/&/g, `${amp}amp;`)
    .replace(/</g, `${amp}lt;`)
    .replace(/>/g, `${amp}gt;`)
    .replace(/"/g, `${amp}quot;`)
    .replace(/'/g, `${amp}apos;`);
}

export function graphicToSvg(graphic: QrGraphic, state: QrState): string {
  const { vbWidth, vbHeight, quiet, fg } = graphic;
  const finderRx = graphic.eyeStyle === "rounded" ? 1.15 : 0;
  const innerRx = graphic.eyeStyle === "rounded" ? 0.7 : 0;
  const coreRx = graphic.eyeStyle === "rounded" ? 0.45 : 0;
  const bg =
    graphic.bgFill === "none"
      ? ""
      : `<rect width="${vbWidth}" height="${vbHeight}" rx="${graphic.bgRx}" fill="${escapeXml(graphic.bgFill)}"/>`;

  const finders = graphic.finders
    .map((f) => {
      const x = f.x + quiet + graphic.framePad;
      const y = f.y + quiet + graphic.framePad;
      const hole = state.transparentBackground ? "#ffffff" : state.backgroundColor;
      return `<g transform="translate(${x} ${y})">
  <rect width="7" height="7" rx="${finderRx}" fill="${escapeXml(fg)}"/>
  <rect x="1" y="1" width="5" height="5" rx="${innerRx}" fill="${escapeXml(hole)}"/>
  <rect x="2" y="2" width="3" height="3" rx="${coreRx}" fill="${escapeXml(fg)}"/>
</g>`;
    })
    .join("");

  const ox = quiet + graphic.framePad;
  const oy = quiet + graphic.framePad;
  const modules = `<g transform="translate(${ox} ${oy})"><path fill="${escapeXml(fg)}" d="${graphic.modulePath}"/></g>`;

  let overlay = "";
  if (graphic.logo) {
    const L = graphic.logo;
    const x = L.x + graphic.framePad;
    const y = L.y + graphic.framePad;
    const box = L.size + L.pad * 2;
    const fill = state.backgroundColor;
    overlay = `<g>
  <rect x="${x}" y="${y}" width="${box}" height="${box}" rx="${L.rx}" fill="${escapeXml(fill)}"/>
  <image href="${escapeXml(L.href)}" x="${x + L.pad}" y="${y + L.pad}" width="${L.size}" height="${L.size}" preserveAspectRatio="xMidYMid meet"/>
</g>`;
  } else if (graphic.badge) {
    const B = graphic.badge;
    const x = B.x + graphic.framePad;
    const y = B.y + graphic.framePad;
    const s = B.size;
    overlay = `<g transform="translate(${x} ${y})">
  <rect width="${s}" height="${s}" rx="${s * 0.28}" fill="#3b6ff5"/>
  <g transform="translate(${s * 0.2} ${s * 0.2}) scale(${s * 0.025})">
    <path d="${typeBadgePath(B.type)}" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</g>`;
  }

  const caption = graphic.caption
    ? `<text x="${graphic.caption.x}" y="${graphic.caption.y}" text-anchor="middle" font-family="${escapeXml(graphic.caption.font)}, system-ui, sans-serif" font-size="${graphic.caption.size}" font-weight="600" fill="${escapeXml(fg)}">${escapeXml(graphic.caption.text)}</text>`
    : "";

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${vbWidth} ${vbHeight}" width="100%" height="100%" shape-rendering="geometricPrecision">
${bg}
${modules}
${finders}
${overlay}
${caption}
</svg>`;
}
