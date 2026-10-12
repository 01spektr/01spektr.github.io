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

export async function downloadQrPdf(
  svg: string,
  pixelSize: number,
  bg: string,
  transparent: boolean,
  filename = "qr-code.pdf",
) {
  const { jsPDF } = await import("jspdf");
  // Ultra-high resolution render for razor-sharp 300+ DPI print output
  const renderSize = Math.max(pixelSize * 2, 2400);
  const canvas = await rasterizeSvg(svg, renderSize, {
    background: transparent ? undefined : bg || "#ffffff",
    transparent,
  });
  const imgData = canvas.toDataURL("image/png");

  const aspect = canvas.height / canvas.width;
  // Standard print artboard: 200mm base with quiet zone
  const pageWidth = 200;
  const pageHeight = Math.max(pageWidth, Math.round(pageWidth * aspect));
  const margin = 15;
  const qrWidth = pageWidth - margin * 2;
  const qrHeight = qrWidth * aspect;
  const offsetX = margin;
  const offsetY = (pageHeight - qrHeight) / 2;

  const doc = new jsPDF({
    orientation: pageHeight > pageWidth ? "portrait" : "landscape",
    unit: "mm",
    format: [pageWidth, pageHeight],
    compress: true,
  });

  // Background color if not transparent
  if (!transparent && bg) {
    doc.setFillColor(bg);
    doc.rect(0, 0, pageWidth, pageHeight, "F");
  }

  doc.addImage(imgData, "PNG", offsetX, offsetY, qrWidth, qrHeight, undefined, "FAST");
  doc.save(filename);
}

export async function downloadQr(svg: string, format: ExportFormat, pixelSize: number, bg: string, transparent: boolean) {
  const filename = `qr-code.${format}`;
  if (format === "svg") {
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    saveBlob(blob, filename);
    return;
  }
  if (format === "pdf") {
    await downloadQrPdf(svg, pixelSize, bg, transparent, filename);
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
