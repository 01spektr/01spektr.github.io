import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CalculationResult } from '../types';
import { formatNumber } from './vatCalculations';

export function getModeLabel(mode: CalculationResult['mode']): string {
  switch (mode) {
    case 'add':
      return 'Добавить НДС (к цене без НДС)';
    case 'extract':
      return 'Выделить НДС (из цены с НДС)';
    case 'calculate_only':
      return 'Рассчитать НДС (только сумму)';
  }
}

/**
 * Generates an Excel-compatible CSV file with UTF-8 BOM
 */
export function exportToExcel(result: CalculationResult): void {
  const modeLabel = getModeLabel(result.mode);
  const dateStr = new Date(result.timestamp).toLocaleString('ru-RU');

  const rows = [
    ['РАСЧЁТ НАЛОГА НА ДОБАВЛЕННУЮ СТОИМОСТЬ (НДС)'],
    ['Сервис', 'Калькулятор НДС'],
    ['Дата и время', dateStr],
    ['Режим расчёта', modeLabel],
    [''],
    ['Показатель', 'Значение', 'Валюта'],
    ['Сумма без НДС', formatNumber(result.amountWithoutVat, 2, result.roundToTwoDecimals), result.currency],
    ['Ставка НДС', `${result.vatRate}%`, ''],
    ['Сумма НДС', formatNumber(result.vatAmount, 2, result.roundToTwoDecimals), result.currency],
    ['Итого с НДС', formatNumber(result.totalWithVat, 2, result.roundToTwoDecimals), result.currency],
    [''],
    ['Сумма прописью', result.amountInWords],
    ['Формула', result.formulaEquation],
    ['Применение формулы', result.formulaSubstituted],
  ];

  if (result.itemName) {
    rows.splice(5, 0, ['Наименование товара/услуги', result.itemName, '']);
  }
  if (result.note) {
    rows.splice(6, 0, ['Примечание / Счёт №', result.note, '']);
  }

  // Convert to CSV with semicolon (standard for Russian Excel)
  const csvContent = '\uFEFF' + rows.map((e) => e.map((cell) => `"${(cell || '').replace(/"/g, '""')}"`).join(';')).join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Расчет_НДС_${result.totalWithVat}_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Formats a clean clipboard string for accounting systems, 1C or messages
 */
export function getFormattedClipboardText(result: CalculationResult): string {
  const modeName = getModeLabel(result.mode);
  return `🧾 РАСЧЁТ НДС (${result.vatRate}%)
----------------------------------------
Режим: ${modeName}
${result.itemName ? `Товар/Услуга: ${result.itemName}\n` : ''}${result.note ? `Примечание: ${result.note}\n` : ''}
Сумма без НДС:  ${formatNumber(result.amountWithoutVat, 2, result.roundToTwoDecimals)} ${result.currency}
Ставка НДС:     ${result.vatRate}%
Сумма НДС:      ${formatNumber(result.vatAmount, 2, result.roundToTwoDecimals)} ${result.currency}
ИТОГО С НДС:    ${formatNumber(result.totalWithVat, 2, result.roundToTwoDecimals)} ${result.currency}
----------------------------------------
Сумма прописью: ${result.amountInWords}
Формула: ${result.formulaSubstituted}`;
}

/**
 * Generates and downloads a clean, high-resolution PDF certificate directly (without window.print)
 */
export async function downloadPdfReport(result: CalculationResult): Promise<void> {
  const dateStr = new Date(result.timestamp).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const modeLabel = getModeLabel(result.mode);

  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '780px';
  container.style.backgroundColor = '#ffffff';
  container.style.fontFamily = "'Montserrat', 'Inter', sans-serif";
  container.style.padding = '36px 40px';
  container.style.boxSizing = 'border-box';
  container.style.color = '#0f172a';

  container.innerHTML = `
    <div style="border-bottom: 2px solid #2563eb; padding-bottom: 16px; margin-bottom: 22px; display: flex; justify-content: space-between; align-items: flex-start;">
      <div>
        <div style="font-size: 22px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px;">СПРАВКА-РАСЧЁТ НДС</div>
        <div style="font-size: 13px; color: #64748b; margin-top: 4px;">Сформировано для бухгалтерского учёта и документооборота</div>
        <div style="display: inline-block; padding: 4px 10px; background: #eff6ff; color: #1d4ed8; border-radius: 6px; font-size: 12px; font-weight: 600; margin-top: 8px;">
          ${modeLabel}
        </div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 18px; font-weight: 800; color: #2563eb;">Калькулятор НДС</div>
        <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Дата: ${dateStr}</div>
      </div>
    </div>

    ${result.itemName || result.note ? `
    <div style="margin-bottom: 18px; font-size: 13px; background: #f8fafc; padding: 12px 16px; border-radius: 8px; border: 1px solid #e2e8f0;">
      ${result.itemName ? `<div><strong style="color: #475569;">Товар / Услуга:</strong> <span style="font-weight: 600;">${result.itemName}</span></div>` : ''}
      ${result.note ? `<div style="margin-top: 4px;"><strong style="color: #475569;">Примечание:</strong> <span>${result.note}</span></div>` : ''}
    </div>
    ` : ''}

    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; margin-bottom: 22px;">
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 16px;">
        <div style="font-size: 11px; color: #64748b; font-weight: 600; text-transform: uppercase;">Сумма без НДС</div>
        <div style="font-size: 18px; font-weight: 800; color: #0f172a; margin-top: 4px; white-space: nowrap;">
          ${formatNumber(result.amountWithoutVat, 2, result.roundToTwoDecimals)} ${result.currency}
        </div>
      </div>
      <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 14px 16px;">
        <div style="font-size: 11px; color: #1d4ed8; font-weight: 600; text-transform: uppercase;">Сумма НДС (${result.vatRate}%)</div>
        <div style="font-size: 18px; font-weight: 800; color: #2563eb; margin-top: 4px; white-space: nowrap;">
          ${formatNumber(result.vatAmount, 2, result.roundToTwoDecimals)} ${result.currency}
        </div>
      </div>
      <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 14px 16px;">
        <div style="font-size: 11px; color: #15803d; font-weight: 600; text-transform: uppercase;">Итого с НДС</div>
        <div style="font-size: 18px; font-weight: 800; color: #16a34a; margin-top: 4px; white-space: nowrap;">
          ${formatNumber(result.totalWithVat, 2, result.roundToTwoDecimals)} ${result.currency}
        </div>
      </div>
    </div>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 22px; font-size: 13px;">
      <thead>
        <tr style="background: #f1f5f9; border-bottom: 2px solid #cbd5e1;">
          <th style="text-align: left; padding: 10px 14px; font-weight: 700; color: #334155;">Показатель расчёта</th>
          <th style="text-align: right; padding: 10px 14px; font-weight: 700; color: #334155;">Значение</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 10px 14px; color: #334155;">Сумма без НДС (налогооблагаемая база)</td>
          <td style="padding: 10px 14px; text-align: right; font-weight: 600;">${formatNumber(result.amountWithoutVat, 2, result.roundToTwoDecimals)} ${result.currency}</td>
        </tr>
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 10px 14px; color: #334155;">Ставка налога на добавленную стоимость</td>
          <td style="padding: 10px 14px; text-align: right; font-weight: 600;">${result.vatRate}%</td>
        </tr>
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 10px 14px; color: #334155;">Начисленная сумма НДС</td>
          <td style="padding: 10px 14px; text-align: right; font-weight: 700; color: #2563eb;">${formatNumber(result.vatAmount, 2, result.roundToTwoDecimals)} ${result.currency}</td>
        </tr>
        <tr style="background: #f8fafc; border-bottom: 2px solid #cbd5e1; font-weight: 800;">
          <td style="padding: 12px 14px; color: #0f172a;">ИТОГО К ОПЛАТЕ С УЧЁТОМ НДС</td>
          <td style="padding: 12px 14px; text-align: right; color: #16a34a; font-size: 15px;">${formatNumber(result.totalWithVat, 2, result.roundToTwoDecimals)} ${result.currency}</td>
        </tr>
      </tbody>
    </table>

    <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 12px 16px; margin-bottom: 16px; font-size: 13px;">
      <strong style="color: #1e40af;">Сумма прописью:</strong> <span style="color: #1e293b;">${result.amountInWords}</span>
    </div>

    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; margin-bottom: 24px; font-size: 12px; color: #475569;">
      <div><strong style="color: #0f172a;">Формула расчёта:</strong> ${result.formulaEquation}</div>
      <div style="margin-top: 4px; font-family: monospace; color: #2563eb;">${result.formulaSubstituted}</div>
    </div>

    <div style="margin-top: 36px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; display: flex; justify-content: space-between;">
      <div>Подпись ответственного лица: _______________________</div>
      <div>Справка сформирована автоматически</div>
    </div>
  `;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, Math.min(imgHeight, pageHeight));
    pdf.save(`Расчет_НДС_${result.totalWithVat}_${result.currency}.pdf`);
  } finally {
    document.body.removeChild(container);
  }
}

