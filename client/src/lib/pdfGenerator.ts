
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function generatePDF(elementId: string, filename: string) {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with ID "${elementId}" not found`);
  }

  try {
    // Create canvas from HTML element
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Convert canvas to image
    const imgData = canvas.toDataURL('image/png');
    
    // Calculate dimensions to fit A4
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 0;

    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    pdf.save(filename);

    return pdf;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}
