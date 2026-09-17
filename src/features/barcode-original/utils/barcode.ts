import JsBarcode from 'jsbarcode';
import { jsPDF } from 'jspdf';

export interface BarcodeFormatInfo {
  id: string;
  name: string;
  barcodeType: string;
  sampleValue: string;
  shortDesc: string;
  description: string;
  usage: string;
  rulesHint: string;
  allowedCharsRegex: RegExp;
  cleanInput: (val: string) => string;
  validate: (val: string) => { isValid: boolean; error?: string; suggestion?: string };
}

export const BARCODE_FORMATS: BarcodeFormatInfo[] = [
  {
    id: 'EAN-13',
    name: 'EAN-13',
    barcodeType: 'EAN13',
    sampleValue: '4780123456781',
    shortDesc: 'Стандартный 13-значный код, используется для товаров в розничной торговле.',
    description: 'Европейский номер товара (European Article Number). Основной международный стандарт штрихкодирования розничной продукции во всем мире.',
    usage: 'Розничная торговля, супермаркеты, складской учет готовой потребительской продукции.',
    rulesHint: 'Для EAN-13 введите 12 или 13 цифр (контрольная сумма рассчитается автоматически).',
    allowedCharsRegex: /^[0-9]+$/,
    cleanInput: (val) => val.replace(/\D/g, '').slice(0, 13),
    validate: (val) => {
      const digits = val.replace(/\D/g, '');
      if (digits.length !== 12 && digits.length !== 13) {
        return {
          isValid: false,
          error: 'EAN-13 требует ровно 12 или 13 цифр.',
          suggestion: digits.length < 12 ? `Дополнить: ${digits.padEnd(12, '0')}` : undefined
        };
      }
      const first12 = digits.slice(0, 12);
      const expectedChecksum = calculateEan13Checksum(first12);
      if (digits.length === 13 && digits[12] !== expectedChecksum) {
        return {
          isValid: false,
          error: `Неверная контрольная цифра (введено ${digits[12]}, ожидается ${expectedChecksum}).`,
          suggestion: `${first12}${expectedChecksum}`
        };
      }
      return { isValid: true };
    }
  },
  {
    id: 'EAN-8',
    name: 'EAN-8',
    barcodeType: 'EAN8',
    sampleValue: '45678901',
    shortDesc: 'Укороченный 8-значный код для небольших упаковок.',
    description: 'Компактная версия стандарта EAN для товаров с ограниченной площадью маркировки (косметика, жевательная резинка, лекарства).',
    usage: 'Малогабаритные розничные товары, флаконы, блистеры.',
    rulesHint: 'Для EAN-8 введите 7 или 8 цифр.',
    allowedCharsRegex: /^[0-9]+$/,
    cleanInput: (val) => val.replace(/\D/g, '').slice(0, 8),
    validate: (val) => {
      const digits = val.replace(/\D/g, '');
      if (digits.length !== 7 && digits.length !== 8) {
        return {
          isValid: false,
          error: 'EAN-8 требует ровно 7 или 8 цифр.',
          suggestion: digits.length < 7 ? `Дополнить: ${digits.padEnd(7, '0')}` : undefined
        };
      }
      const first7 = digits.slice(0, 7);
      const expectedChecksum = calculateEan8Checksum(first7);
      if (digits.length === 8 && digits[7] !== expectedChecksum) {
        return {
          isValid: false,
          error: `Неверная контрольная цифра (введено ${digits[7]}, ожидается ${expectedChecksum}).`,
          suggestion: `${first7}${expectedChecksum}`
        };
      }
      return { isValid: true };
    }
  },
  {
    id: 'Code128',
    name: 'Code 128',
    barcodeType: 'CODE128',
    sampleValue: 'Toolboxi',
    shortDesc: 'Универсальный высокоплотный код для любых букв, цифр и знаков.',
    description: 'Высокоплотный буквенно-цифровой штрихкод переменной длины. Поддерживает все 128 символов таблицы ASCII.',
    usage: 'Логистика, транспортные этикетки, маркировка паллет, серийные номера и инвентаризация.',
    rulesHint: 'Поддерживает латинские буквы (A-Z, a-z), цифры и спецсимволы.',
    allowedCharsRegex: /^[\x20-\x7E]+$/,
    cleanInput: (val) => val.replace(/[^\x20-\x7E]/g, ''),
    validate: (val) => {
      if (!val || val.length === 0) {
        return { isValid: false, error: 'Введите данные для штрихкода.' };
      }
      if (!/^[\x20-\x7E]+$/.test(val)) {
        return { isValid: false, error: 'Code 128 поддерживает только символы ASCII (латиницу, цифры, символы).' };
      }
      return { isValid: true };
    }
  },
  {
    id: 'Code39',
    name: 'Code 39',
    barcodeType: 'CODE39',
    sampleValue: 'TOOLBOXI',
    shortDesc: 'Популярный промышленный штрихкод для латиницы и цифр.',
    description: 'Один из самых надежных дискретных кодов. Кодирует заглавные латинские буквы, цифры и 7 спецсимволов (- . $ / + % и пробел).',
    usage: 'Военная промышленность, автопром (AIAG), инвентарный учет оборудования.',
    rulesHint: 'Поддерживает заглавные латинские буквы, цифры и знаки: - . $ / + % и пробел.',
    allowedCharsRegex: /^[0-9A-Z. $/+%-]+$/,
    cleanInput: (val) => val.toUpperCase().replace(/[^0-9A-Z. $/+%-]/g, ''),
    validate: (val) => {
      if (!val || val.length === 0) {
        return { isValid: false, error: 'Введите данные для штрихкода.' };
      }
      const upper = val.toUpperCase();
      if (!/^[0-9A-Z. $/+%-]+$/.test(upper)) {
        return {
          isValid: false,
          error: 'Code 39 принимает только заглавные латинские буквы, цифры и символы: - . $ / + %',
          suggestion: upper.replace(/[^0-9A-Z. $/+%-]/g, '')
        };
      }
      return { isValid: true };
    }
  },
  {
    id: 'ITF-14',
    name: 'ITF-14',
    barcodeType: 'ITF14',
    sampleValue: '04780123456789',
    shortDesc: 'Штрихкод для транспортных упаковок и картонных коробок (Interleaved 2 of 5).',
    description: '14-значный штрихкод на основе чередующегося кода 2 из 5 (ITF) с защитной рамкой (bearer bars) для печати на гофрокартоне.',
    usage: 'Оптовые картонные коробки, паллеты и транспортная тара.',
    rulesHint: 'Для ITF-14 введите ровно 13 или 14 цифр.',
    allowedCharsRegex: /^[0-9]+$/,
    cleanInput: (val) => val.replace(/\D/g, '').slice(0, 14),
    validate: (val) => {
      const digits = val.replace(/\D/g, '');
      if (digits.length !== 13 && digits.length !== 14) {
        return {
          isValid: false,
          error: 'ITF-14 требует 13 или 14 цифр.',
          suggestion: digits.length < 13 ? digits.padEnd(13, '0') : undefined
        };
      }
      const first13 = digits.slice(0, 13);
      const expectedChecksum = calculateItf14Checksum(first13);
      if (digits.length === 14 && digits[13] !== expectedChecksum) {
        return {
          isValid: false,
          error: `Неверная контрольная цифра (введено ${digits[13]}, ожидается ${expectedChecksum}).`,
          suggestion: `${first13}${expectedChecksum}`
        };
      }
      return { isValid: true };
    }
  },
  {
    id: 'UPC-A',
    name: 'UPC-A',
    barcodeType: 'UPC',
    sampleValue: '012345678905',
    shortDesc: 'Американский 12-значный стандарт штрихкодирования розничных товаров.',
    description: 'Universal Product Code. Главный стандарт штрихового кодирования в США и Канаде.',
    usage: 'Товары, предназначенные для экспорта в США и Канаду.',
    rulesHint: 'Для UPC-A введите 11 или 12 цифр.',
    allowedCharsRegex: /^[0-9]+$/,
    cleanInput: (val) => val.replace(/\D/g, '').slice(0, 12),
    validate: (val) => {
      const digits = val.replace(/\D/g, '');
      if (digits.length !== 11 && digits.length !== 12) {
        return { isValid: false, error: 'UPC-A требует 11 или 12 цифр.' };
      }
      return { isValid: true };
    }
  },
  {
    id: 'Codabar',
    name: 'Codabar',
    barcodeType: 'codabar',
    sampleValue: 'A12345678B',
    shortDesc: 'Штрихкод с обрамляющими буквами A, B, C или D для библиотек и медицины.',
    description: 'Дискретный штрихкод, начинающийся и заканчивающийся символами A, B, C или D, с цифрами и спецсимволами между ними.',
    usage: 'Службы переливания крови, библиотеки, курьерские квитанции FedEx.',
    rulesHint: 'Начинается и заканчивается A, B, C или D (например: A12345678B).',
    allowedCharsRegex: /^[A-Da-d][0-9$:/+.-]+[A-Da-d]$/,
    cleanInput: (val) => val.toUpperCase(),
    validate: (val) => {
      if (!val || val.length < 3) {
        return { isValid: false, error: 'Codabar требует начальный и конечный символ (A, B, C или D) и цифры.' };
      }
      return { isValid: true };
    }
  }
];

export function calculateEan13Checksum(digits12: string): string {
  if (!/^\d{12}$/.test(digits12)) return '0';
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(digits12[i], 10);
    sum += i % 2 === 0 ? digit : digit * 3;
  }
  const check = (10 - (sum % 10)) % 10;
  return check.toString();
}

export function calculateEan8Checksum(digits7: string): string {
  if (!/^\d{7}$/.test(digits7)) return '0';
  let sum = 0;
  for (let i = 0; i < 7; i++) {
    const digit = parseInt(digits7[i], 10);
    sum += i % 2 === 0 ? digit * 3 : digit;
  }
  const check = (10 - (sum % 10)) % 10;
  return check.toString();
}

export function calculateItf14Checksum(digits13: string): string {
  if (!/^\d{13}$/.test(digits13)) return '0';
  let sum = 0;
  for (let i = 0; i < 13; i++) {
    const digit = parseInt(digits13[i], 10);
    sum += i % 2 === 0 ? digit * 3 : digit;
  }
  const check = (10 - (sum % 10)) % 10;
  return check.toString();
}

export function prepareBarcodeValue(formatId: string, input: string): string {
  const clean = input.trim();
  if (formatId === 'EAN-13') {
    const digits = clean.replace(/\D/g, '');
    if (digits.length === 12) {
      return digits + calculateEan13Checksum(digits);
    }
    if (digits.length === 13) {
      const correctSum = calculateEan13Checksum(digits.slice(0, 12));
      return digits.slice(0, 12) + correctSum;
    }
    return digits;
  }
  if (formatId === 'EAN-8') {
    const digits = clean.replace(/\D/g, '');
    if (digits.length === 7) {
      return digits + calculateEan8Checksum(digits);
    }
    if (digits.length === 8) {
      const correctSum = calculateEan8Checksum(digits.slice(0, 7));
      return digits.slice(0, 7) + correctSum;
    }
    return digits;
  }
  if (formatId === 'ITF-14') {
    const digits = clean.replace(/\D/g, '');
    if (digits.length === 13) {
      return digits + calculateItf14Checksum(digits);
    }
    if (digits.length === 14) {
      const correctSum = calculateItf14Checksum(digits.slice(0, 13));
      return digits.slice(0, 13) + correctSum;
    }
    return digits;
  }
  if (formatId === 'Code39') {
    return clean.toUpperCase();
  }
  return clean;
}

export interface RenderBarcodeOptions {
  format: string; // JsBarcode format
  width?: number; // width of a single bar (1, 2, 3, 4)
  height?: number;
  displayValue?: boolean;
  margin?: number;
  lineColor?: string;
  background?: string;
  fontSize?: number;
  textMargin?: number;
}

export function renderBarcodeToSvg(
  svgElement: SVGSVGElement,
  value: string,
  options: RenderBarcodeOptions
): boolean {
  try {
    JsBarcode(svgElement, value, {
      format: options.format,
      width: options.width || 2,
      height: options.height || 100,
      displayValue: options.displayValue !== false,
      margin: options.margin !== undefined ? options.margin : 15,
      lineColor: options.lineColor || '#000000',
      background: options.background || '#ffffff',
      fontSize: options.fontSize || 18,
      textMargin: options.textMargin || 4,
      font: 'Inter, sans-serif'
    });
    return true;
  } catch (err) {
    console.error('JsBarcode rendering error:', err);
    return false;
  }
}

export function downloadSvgAsFile(svgElement: SVGSVGElement, filename: string) {
  const serializer = new XMLSerializer();
  let source = serializer.serializeToString(svgElement);
  if (!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
    source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  if (!source.match(/^<svg[^>]+xmlns:xlink="http:\/\/www\.w3\.org\/1999\/xlink"/)) {
    source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
  }
  const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.svg') ? filename : `${filename}.svg`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function convertSvgToPngBlob(
  svgElement: SVGSVGElement,
  scale = 2
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svgElement);
    if (!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
      source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    const svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const blobURL = URL.createObjectURL(svgBlob);
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(blobURL);

      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas toBlob failed'));
        }
      }, 'image/png');
    };

    img.onerror = (e) => {
      URL.revokeObjectURL(blobURL);
      reject(e);
    };

    img.src = blobURL;
  });
}

export async function downloadSvgAsPng(
  svgElement: SVGSVGElement,
  filename: string,
  scale = 2
) {
  const blob = await convertSvgToPngBlob(svgElement, scale);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.png') ? filename : `${filename}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function copyBarcodeImageToClipboard(
  svgElement: SVGSVGElement
): Promise<boolean> {
  try {
    const blob = await convertSvgToPngBlob(svgElement, 2);
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob })
    ]);
    return true;
  } catch (err) {
    console.warn('Clipboard write failed:', err);
    return false;
  }
}

export async function downloadBarcodePdf(
  svgElement: SVGSVGElement,
  barcodeName: string,
  dataValue: string
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const blob = await convertSvgToPngBlob(svgElement, 3);
  const reader = new FileReader();

  return new Promise<void>((resolve) => {
    reader.onload = () => {
      const base64data = reader.result as string;
      const pageWidth = doc.internal.pageSize.getWidth();

      // Title & Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(30, 41, 59);
      doc.text('Barcode Label / Этикетка штрихкода', pageWidth / 2, 25, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text(`Format: ${barcodeName} | Data: ${dataValue}`, pageWidth / 2, 33, { align: 'center' });

      // Add barcode image
      const imgWidth = 120;
      const imgHeight = 60;
      const x = (pageWidth - imgWidth) / 2;
      const y = 45;

      doc.setDrawColor(226, 232, 240);
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(x - 5, y - 5, imgWidth + 10, imgHeight + 10, 3, 3, 'FD');

      doc.addImage(base64data, 'PNG', x, y, imgWidth, imgHeight);

      // Footer note
      doc.setFontSize(9);
      doc.setTextColor(148, 163, 184);
      doc.text('Generated with Barcode Generator (Генератор штрихкодов)', pageWidth / 2, 125, { align: 'center' });

      doc.save(`${barcodeName}_${dataValue}.pdf`);
      resolve();
    };
    reader.readAsDataURL(blob);
  });
}
