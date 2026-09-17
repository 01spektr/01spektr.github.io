import { jsPDF } from 'jspdf';
import { RGB, CMYK, PantoneMatch } from '../types';
import { rgbToHex, getTotalInkCoverage } from './colorConversion';

interface ExportParams {
  rgb: RGB;
  cmyk: CMYK;
  cmykSimulatedRgb: RGB;
  pantoneMatch?: PantoneMatch;
  paperName?: string;
  notes?: string;
}

/**
 * Generates and downloads an industry-standard Prepress Vector PDF Spec Sheet
 */
export function exportToPdf({ rgb, cmyk, cmykSimulatedRgb, pantoneMatch }: ExportParams): void {
  // A4 Portrait: 210 x 297 mm
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const hex = rgbToHex(rgb);
  const tic = getTotalInkCoverage(cmyk);
  const dateStr = new Date().toLocaleDateString('ru-RU');

  // Background subtle canvas
  doc.setFillColor(252, 253, 254);
  doc.rect(0, 0, 210, 297, 'F');

  // Outer border & Prepress Crop / Registration Marks
  doc.setDrawColor(180, 190, 205);
  doc.setLineWidth(0.2);

  // Corner Crop Marks
  const drawCropMark = (x: number, y: number, length: number) => {
    doc.line(x - length, y, x + length, y);
    doc.line(x, y - length, x, y + length);
  };
  drawCropMark(15, 15, 6);
  drawCropMark(195, 15, 6);
  drawCropMark(15, 282, 6);
  drawCropMark(195, 282, 6);

  // Prepress Color Target Box (Border)
  doc.rect(20, 20, 170, 257, 'S');

  // Header Title
  doc.setTextColor(20, 30, 45);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('RGB -> CMYK COLOR SPECIFICATION & PROOF', 25, 32);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 115, 130);
  doc.text(`Prepress Color Swatch Sheet | Date: ${dateStr} | Profile: ISO Coated v2 (FOGRA39)`, 25, 38);

  // Divider line
  doc.setDrawColor(220, 226, 235);
  doc.line(25, 42, 185, 42);

  // 1. Color Swatch Blocks (Screen RGB vs Print CMYK vs Pantone)
  const swatchWidth = 48;
  const swatchHeight = 45;
  const startY = 48;

  // Swatch 1: Original Screen RGB
  doc.setFillColor(rgb.r, rgb.g, rgb.b);
  doc.roundedRect(25, startY, swatchWidth, swatchHeight, 3, 3, 'F');
  doc.setDrawColor(200, 210, 220);
  doc.roundedRect(25, startY, swatchWidth, swatchHeight, 3, 3, 'S');

  // Label 1
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 40, 55);
  doc.text('RGB (Screen / Display)', 25, startY + swatchHeight + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(90, 105, 120);
  doc.text(`${hex} | rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, 25, startY + swatchHeight + 11);

  // Swatch 2: Simulated Print CMYK
  doc.setFillColor(cmykSimulatedRgb.r, cmykSimulatedRgb.g, cmykSimulatedRgb.b);
  doc.roundedRect(86, startY, swatchWidth, swatchHeight, 3, 3, 'F');
  doc.setDrawColor(200, 210, 220);
  doc.roundedRect(86, startY, swatchWidth, swatchHeight, 3, 3, 'S');

  // Label 2
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 40, 55);
  doc.text('CMYK (Print Target)', 86, startY + swatchHeight + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(90, 105, 120);
  doc.text(`C:${cmyk.c}% M:${cmyk.m}% Y:${cmyk.y}% K:${cmyk.k}%`, 86, startY + swatchHeight + 11);

  // Swatch 3: Nearest Pantone
  if (pantoneMatch) {
    const pRgb = pantoneMatch.pantone.rgb;
    doc.setFillColor(pRgb.r, pRgb.g, pRgb.b);
    doc.roundedRect(147, startY, swatchWidth, swatchHeight, 3, 3, 'F');
    doc.setDrawColor(200, 210, 220);
    doc.roundedRect(147, startY, swatchWidth, swatchHeight, 3, 3, 'S');

    // Label 3
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(30, 40, 55);
    doc.text(pantoneMatch.pantone.code, 147, startY + swatchHeight + 6);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(90, 105, 120);
    doc.text(`Match: ${pantoneMatch.matchScore}% (dE ${pantoneMatch.deltaE})`, 147, startY + swatchHeight + 11);
  }

  // 2. CMYK Separation Channels Vector Bars
  const channelsY = 120;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(20, 30, 45);
  doc.text('CMYK INK CHANNELS BREAKDOWN', 25, channelsY);

  const channels = [
    { label: 'Cyan (C)', val: cmyk.c, color: [0, 164, 228] },
    { label: 'Magenta (M)', val: cmyk.m, color: [229, 0, 125] },
    { label: 'Yellow (Y)', val: cmyk.y, color: [255, 210, 0] },
    { label: 'Key / Black (K)', val: cmyk.k, color: [35, 31, 32] },
  ];

  channels.forEach((ch, idx) => {
    const barY = channelsY + 8 + idx * 11;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(50, 60, 75);
    doc.text(ch.label, 25, barY + 4);

    // Value text
    doc.text(`${ch.val}%`, 58, barY + 4);

    // Gray background bar
    doc.setFillColor(235, 240, 246);
    doc.roundedRect(70, barY, 110, 6, 1.5, 1.5, 'F');

    // Active color bar
    if (ch.val > 0) {
      doc.setFillColor(ch.color[0], ch.color[1], ch.color[2]);
      const barWidth = Math.max(2, (ch.val / 100) * 110);
      doc.roundedRect(70, barY, barWidth, 6, 1.5, 1.5, 'F');
    }
  });

  // 3. Technical Print Specifications Box
  const specsY = 176;
  doc.setFillColor(245, 248, 252);
  doc.roundedRect(25, specsY, 155, 55, 3, 3, 'F');
  doc.setDrawColor(215, 225, 238);
  doc.roundedRect(25, specsY, 155, 55, 3, 3, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 45, 65);
  doc.text('TECHNICAL PREPRESS SPECIFICATIONS', 32, specsY + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(70, 85, 100);

  // Left Column of specs
  doc.text(`Total Ink Coverage (TIC/TAC): ${tic}% ${tic <= 300 ? '(Safe for Offset)' : '(High Density)'}`, 32, specsY + 18);
  doc.text(`Recommended Screen Frequency: 150 - 175 LPI`, 32, specsY + 25);
  doc.text(`ICC Target Profile: ISO Coated v2 / FOGRA39 (Coated) or FOGRA47 (Uncoated)`, 32, specsY + 32);
  doc.text(`Substrate: Coated Art Paper (130-300 gsm) or Offset Paper`, 32, specsY + 39);

  // Right Column of specs
  if (pantoneMatch) {
    doc.text(`Spot Color Match: ${pantoneMatch.pantone.code}`, 32, specsY + 47);
  }

  // 4. Prepress Verification Guidelines
  const guideY = 240;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(40, 50, 65);
  doc.text('PREPRESS & OFFSET GUIDELINES:', 25, guideY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(110, 125, 140);
  doc.text('1. RGB colors use additive light synthesis. CMYK uses subtractive ink absorption.', 25, guideY + 6);
  doc.text('2. An uncalibrated monitor will display colors brighter than actual offset paper output.', 25, guideY + 11);
  doc.text('3. Always order a certified contract proof (цветопроба) for brand-critical color matching.', 25, guideY + 16);
  doc.text('4. In Adobe InDesign/Illustrator, ensure "Overprint Black" is enabled and document CMYK is set.', 25, guideY + 21);

  // Save the PDF
  doc.save(`color-spec-${hex.replace('#', '')}-cmyk.pdf`);
}

/**
 * Generates an SVG vector graphic swatch card with CMYK/Pantone metadata
 */
export function generateVectorSvg({ rgb, cmyk, cmykSimulatedRgb, pantoneMatch }: ExportParams): string {
  const hex = rgbToHex(rgb);
  const pCode = pantoneMatch ? pantoneMatch.pantone.code : 'N/A';
  const pName = pantoneMatch ? pantoneMatch.pantone.name : '';
  const pScore = pantoneMatch ? `${pantoneMatch.matchScore}%` : '';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520" width="800" height="520">
  <defs>
    <style>
      .title { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-weight: bold; font-size: 20px; fill: #0f172a; }
      .subtitle { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; fill: #64748b; }
      .label { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-weight: 600; font-size: 13px; fill: #1e293b; }
      .meta { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 11px; fill: #64748b; }
      .card-title { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-weight: bold; font-size: 14px; fill: #0f172a; }
      .pantone-brand { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-weight: 900; font-size: 12px; fill: #000000; letter-spacing: 0.5px; }
    </style>
  </defs>

  <!-- Background -->
  <rect width="800" height="520" fill="#ffffff" rx="16"/>
  <rect x="1" y="1" width="798" height="518" fill="none" stroke="#e2e8f0" stroke-width="2" rx="16"/>

  <!-- Prepress Marks -->
  <path d="M 20,40 L 40,40 M 40,20 L 40,40" stroke="#94a3b8" stroke-width="1"/>
  <path d="M 780,40 L 760,40 M 760,20 L 760,40" stroke="#94a3b8" stroke-width="1"/>
  <path d="M 20,480 L 40,480 M 40,500 L 40,480" stroke="#94a3b8" stroke-width="1"/>
  <path d="M 780,480 L 760,480 M 760,500 L 760,480" stroke="#94a3b8" stroke-width="1"/>

  <!-- Header -->
  <text x="50" y="55" class="title">COLOR SPECIFICATION &amp; CMYK SEPARATION</text>
  <text x="50" y="75" class="subtitle">Exported from RGB → CMYK Converter | Target: FOGRA39 / ISO Coated v2</text>
  <line x1="50" y1="90" x2="750" y2="90" stroke="#e2e8f0" stroke-width="1.5"/>

  <!-- Left Card: RGB Screen Color -->
  <g transform="translate(50, 115)">
    <rect width="210" height="230" fill="#f8fafc" rx="12" stroke="#e2e8f0" stroke-width="1"/>
    <rect x="10" y="10" width="190" height="130" fill="${hex}" rx="8"/>
    <text x="15" y="165" class="card-title">RGB (Экран)</text>
    <text x="15" y="185" class="label">${hex}</text>
    <text x="15" y="205" class="meta">rgb(${rgb.r}, ${rgb.g}, ${rgb.b})</text>
  </g>

  <!-- Middle Card: CMYK Print Color -->
  <g transform="translate(295, 115)">
    <rect width="210" height="230" fill="#f8fafc" rx="12" stroke="#e2e8f0" stroke-width="1"/>
    <rect x="10" y="10" width="190" height="130" fill="rgb(${cmykSimulatedRgb.r}, ${cmykSimulatedRgb.g}, ${cmykSimulatedRgb.b})" rx="8"/>
    <text x="15" y="165" class="card-title">CMYK (Печать)</text>
    <text x="15" y="185" class="label">C:${cmyk.c}% M:${cmyk.m}% Y:${cmyk.y}% K:${cmyk.k}%</text>
    <text x="15" y="205" class="meta">TIC / TAC: ${getTotalInkCoverage(cmyk)}%</text>
  </g>

  <!-- Right Card: Pantone Swatch Chip -->
  <g transform="translate(540, 115)">
    <rect width="210" height="230" fill="#ffffff" rx="12" stroke="#cbd5e1" stroke-width="1.5"/>
    <rect x="10" y="10" width="190" height="130" fill="${pantoneMatch ? pantoneMatch.pantone.hex : hex}" rx="8"/>
    <rect x="10" y="145" width="190" height="75" fill="#ffffff"/>
    <text x="15" y="168" class="pantone-brand">${pCode}</text>
    <text x="15" y="188" class="label">${pName}</text>
    <text x="15" y="208" class="meta">Точность: ${pScore} (ΔE ${pantoneMatch ? pantoneMatch.deltaE : 0})</text>
  </g>

  <!-- Bottom Ink Channels Bar -->
  <g transform="translate(50, 370)">
    <rect width="700" height="100" fill="#f1f5f9" rx="10"/>
    <text x="20" y="28" class="label">CMYK КАНАЛЫ ДЛЯ ПЕЧАТИ</text>
    
    <!-- C -->
    <text x="20" y="55" class="meta" font-weight="bold" fill="#0284c7">C: ${cmyk.c}%</text>
    <rect x="75" y="44" width="220" height="12" fill="#e2e8f0" rx="3"/>
    <rect x="75" y="44" width="${Math.max(2, (cmyk.c / 100) * 220)}" height="12" fill="#00A4E4" rx="3"/>

    <!-- M -->
    <text x="360" y="55" class="meta" font-weight="bold" fill="#db2777">M: ${cmyk.m}%</text>
    <rect x="415" y="44" width="220" height="12" fill="#e2e8f0" rx="3"/>
    <rect x="415" y="44" width="${Math.max(2, (cmyk.m / 100) * 220)}" height="12" fill="#E5007D" rx="3"/>

    <!-- Y -->
    <text x="20" y="80" class="meta" font-weight="bold" fill="#d97706">Y: ${cmyk.y}%</text>
    <rect x="75" y="69" width="220" height="12" fill="#e2e8f0" rx="3"/>
    <rect x="75" y="69" width="${Math.max(2, (cmyk.y / 100) * 220)}" height="12" fill="#FFD200" rx="3"/>

    <!-- K -->
    <text x="360" y="80" class="meta" font-weight="bold" fill="#1e293b">K: ${cmyk.k}%</text>
    <rect x="415" y="69" width="220" height="12" fill="#e2e8f0" rx="3"/>
    <rect x="415" y="69" width="${Math.max(2, (cmyk.k / 100) * 220)}" height="12" fill="#231F20" rx="3"/>
  </g>
</svg>`;
}

/**
 * Downloads the vector SVG file
 */
export function downloadSvg(params: ExportParams): void {
  const svgContent = generateVectorSvg(params);
  const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `color-swatch-${rgbToHex(params.rgb).replace('#', '')}.svg`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generates and downloads an Encapsulated PostScript (EPS) vector file
 * compatible with Adobe Illustrator, CorelDRAW, and prepress RIP systems.
 */
export function exportToEps(params: ExportParams): void {
  const hex = rgbToHex(params.rgb);
  const c = (params.cmyk.c / 100).toFixed(4);
  const m = (params.cmyk.m / 100).toFixed(4);
  const y = (params.cmyk.y / 100).toFixed(4);
  const k = (params.cmyk.k / 100).toFixed(4);
  const pCode = params.pantoneMatch ? params.pantoneMatch.pantone.code : 'None';

  const epsContent = `%!PS-Adobe-3.0 EPSF-3.0
%%Creator: RGB to CMYK Converter Prepress Tool
%%Title: Color Swatch ${hex}
%%BoundingBox: 0 0 500 500
%%HiResBoundingBox: 0 0 500 500
%%DocumentCustomColors: (${pCode})
%%CMYKCustomColor: ${c} ${m} ${y} ${k} (${pCode})
%%EndComments

% Background
1 1 1 setrgbcolor
0 0 500 500 rectfill

% Vector Crop Marks
0 0 0 setrgbcolor
0.5 setlinewidth
newpath
20 480 moveto 50 480 lineto
50 480 moveto 50 450 lineto
450 480 moveto 480 480 lineto
450 480 moveto 450 450 lineto
20 20 moveto 50 20 lineto
50 20 moveto 50 50 lineto
450 20 moveto 480 20 lineto
450 20 moveto 450 50 lineto
stroke

% Swatch Rectangle in true PostScript CMYK
${c} ${m} ${y} ${k} setcmykcolor
50 150 400 280 rectfill

% Border
0.2 0.2 0.2 setrgbcolor
1 setlinewidth
50 150 400 280 rectstroke

% Metadata text in PostScript
/Helvetica-Bold findfont 16 scalefont setfont
0 0 0 setrgbcolor
50 110 moveto
(COLOR SPECIFICATION: ${hex}) show

/Helvetica findfont 12 scalefont setfont
50 85 moveto
(CMYK: C:${params.cmyk.c}% M:${params.cmyk.m}% Y:${params.cmyk.y}% K:${params.cmyk.k}%) show

50 65 moveto
(RGB: ${params.rgb.r}, ${params.rgb.g}, ${params.rgb.b}) show

50 45 moveto
(SPOT PANTONE: ${pCode}) show

%%EOF`;

  const blob = new Blob([epsContent], { type: 'application/postscript;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `color-swatch-${hex.replace('#', '')}.eps`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
