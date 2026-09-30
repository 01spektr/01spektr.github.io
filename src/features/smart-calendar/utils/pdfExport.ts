import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * High-definition vector-sharp export of an HTML element to PDF
 */
export async function exportHtmlElementToPdf(
  elementId: string,
  fileName: string
): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element #${elementId} not found for PDF export.`);
    return false;
  }

  try {
    // High-resolution canvas capture with sanitized styles
    const canvas = await html2canvas(element, {
      scale: 2.0,
      useCORS: false,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      scrollX: 0,
      scrollY: 0,
      onclone: (_clonedDoc, clonedEl) => {
        // Strip out box-shadows to avoid Tailwind v4 oklch parsing crashes
        const all = clonedEl.querySelectorAll('*');
        all.forEach((n) => {
          if (n instanceof HTMLElement) {
            n.style.boxShadow = 'none';
            n.style.textShadow = 'none';
          }
        });
        clonedEl.style.boxShadow = 'none';
      },
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pageWidth = pdf.internal.pageSize.getWidth(); // 210 mm
    const pageHeight = pdf.internal.pageSize.getHeight(); // 297 mm
    const margin = 8;
    const availableWidth = pageWidth - margin * 2;
    const availableHeight = pageHeight - margin * 2;

    const imgWidth = availableWidth;
    const imgHeight = (canvas.height * availableWidth) / canvas.width;

    if (imgHeight <= availableHeight) {
      // Single page document
      pdf.addImage(imgData, 'JPEG', margin, margin, imgWidth, imgHeight);
    } else {
      // Multi-page document handling
      let heightLeft = imgHeight;
      const position = margin;
      let pageIndex = 0;

      while (heightLeft > 0) {
        if (pageIndex > 0) {
          pdf.addPage();
        }
        pdf.addImage(
          imgData,
          'JPEG',
          margin,
          position - pageIndex * availableHeight,
          imgWidth,
          imgHeight
        );
        heightLeft -= availableHeight;
        pageIndex++;
      }
    }

    pdf.save(`${fileName}.pdf`);
    return true;
  } catch (error) {
    console.error('Error during fallback PDF generation:', error);
    return false;
  }
}

/**
 * Copy structured table data to clipboard for Excel / Google Sheets
 */
export async function copyTableToClipboard(rows: (string | number)[][]): Promise<boolean> {
  try {
    const tsvContent = rows.map((row) => row.join('\t')).join('\n');
    await navigator.clipboard.writeText(tsvContent);
    return true;
  } catch (err) {
    console.error('Clipboard copy failed:', err);
    return false;
  }
}

/**
 * Download CSV file with UTF-8 BOM for Microsoft Excel compatibility
 */
export function downloadCsvFile(filename: string, rows: (string | number)[][]): void {
  const csvContent = rows
    .map((row) =>
      row
        .map((cell) => {
          const str = String(cell ?? '');
          return str.includes(',') || str.includes('"') || str.includes('\n')
            ? `"${str.replace(/"/g, '""')}"`
            : str;
        })
        .join(';')
    )
    .join('\r\n');

  // \uFEFF BOM ensures Excel opens UTF-8 Cyrillic without garbled text
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
