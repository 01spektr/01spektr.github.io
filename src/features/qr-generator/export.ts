import type { ExportFormat } from "./state";

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("image"));
    img.src = url;
  });
}

export async function rasterizeSvg(
  svg: string,
  pixelSize: number,
  options: { background?: string; transparent?: boolean },
): Promise<HTMLCanvasElement> {
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  try {
    const img = await loadImage(url);
    const ratio = img.naturalHeight / img.naturalWidth || 1;
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(pixelSize));
    canvas.height = Math.max(1, Math.round(pixelSize * ratio));
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas");
    if (!options.transparent) {
      ctx.fillStyle = options.background || "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality = 0.92): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("blob"));
      },
      type,
      quality,
    );
  });
}

export async function downloadQr(svg: string, format: ExportFormat, pixelSize: number, bg: string, transparent: boolean) {
  const filename = `qr-code.${format}`;
  if (format === "svg") {
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    saveBlob(blob, filename);
    return;
  }
  const mime =
    format === "jpg" ? "image/jpeg" : format === "webp" ? "image/webp" : "image/png";
  const canvas = await rasterizeSvg(svg, pixelSize, {
    background: bg,
    transparent: transparent && format !== "jpg",
  });
  const blob = await canvasToBlob(canvas, mime, format === "jpg" ? 0.92 : 0.96);
  saveBlob(blob, filename);
}

export async function copyQrPng(svg: string, pixelSize: number, bg: string, transparent: boolean) {
  if (typeof ClipboardItem === "undefined" || !navigator.clipboard?.write) {
    throw new Error("unsupported");
  }
  const canvas = await rasterizeSvg(svg, pixelSize, {
    background: bg,
    transparent,
  });
  const blob = await canvasToBlob(canvas, "image/png");
  await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
}
