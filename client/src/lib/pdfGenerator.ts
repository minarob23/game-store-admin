
import html2pdf from 'html2pdf.js';

export async function generatePDF(elementId: string, filename: string) {
  const element = document.getElementById(elementId);
  if (!element) return;

  const opt = {
    margin: 1,
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  };

  try {
    const pdf = await html2pdf().set(opt).from(element).save();
    return pdf;
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
}
