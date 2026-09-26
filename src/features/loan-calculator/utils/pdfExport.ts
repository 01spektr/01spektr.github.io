import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";

/**
 * Renders an HTML element into a downloadable PDF file with multi-page support and OKLCH color handling.
 */
export async function exportElementToPDF(
  elementId: string,
  fileName: string = "raschet_kredita.pdf",
): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id "${elementId}" not found for PDF export.`);
    return false;
  }

  try {
    // Generate high-resolution canvas with html2canvas-pro (native support for oklch, lab, lch)
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      windowWidth: element.scrollWidth,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const margin = 10;
    const contentWidth = pageWidth - margin * 2;
    const contentHeight = (canvas.height * contentWidth) / canvas.width;

    let heightLeft = contentHeight;
    let position = margin;

    // First page
    pdf.addImage(imgData, "PNG", margin, position, contentWidth, contentHeight);
    heightLeft -= pageHeight - margin * 2;

    // Multi-page handling if content exceeds one A4 page
    while (heightLeft > 0) {
      position = heightLeft - contentHeight + margin;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", margin, position, contentWidth, contentHeight);
      heightLeft -= pageHeight - margin * 2;
    }

    // Trigger native browser download
    pdf.save(fileName);
    return true;
  } catch (error) {
    console.error("Error in exportElementToPDF:", error);
    // Fallback: window.print()
    window.print();
    return false;
  }
}
