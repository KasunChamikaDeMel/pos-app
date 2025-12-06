import jsPDF from 'jspdf';

interface ReceiptData {
  items: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  date: Date;
  invoiceNumber: string;
  customerName?: string;
  customerEmail?: string;
}

export async function generateReceiptPDF(data: ReceiptData): Promise<void> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = margin;

  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('POS SYSTEM', pageWidth / 2, yPos, { align: 'center' });
  yPos += 10;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Invoice Receipt', pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;

  // Invoice Info
  doc.setFontSize(10);
  doc.text(`Invoice #: ${data.invoiceNumber}`, margin, yPos);
  doc.text(`Date: ${data.date.toLocaleDateString()}`, pageWidth - margin, yPos, { align: 'right' });
  yPos += 10;

  if (data.customerName) {
    doc.text(`Customer: ${data.customerName}`, margin, yPos);
    yPos += 7;
  }
  if (data.customerEmail) {
    doc.text(`Email: ${data.customerEmail}`, margin, yPos);
    yPos += 10;
  }

  // Line
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;

  // Table Header
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Item', margin, yPos);
  doc.text('Qty', margin + 80, yPos);
  doc.text('Price', margin + 110, yPos);
  doc.text('Total', pageWidth - margin - 30, yPos, { align: 'right' });
  yPos += 7;

  // Line
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 7;

  // Items
  doc.setFont('helvetica', 'normal');
  data.items.forEach((item) => {
    doc.setFontSize(9);
    doc.text(item.name.substring(0, 30), margin, yPos);
    doc.text(item.quantity.toString(), margin + 80, yPos);
    doc.text(`$${item.price.toFixed(2)}`, margin + 110, yPos);
    doc.text(`$${(item.price * item.quantity).toFixed(2)}`, pageWidth - margin - 30, yPos, { align: 'right' });
    yPos += 7;

    if (yPos > 250) {
      doc.addPage();
      yPos = margin;
    }
  });

  yPos += 5;

  // Line
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;

  // Totals
  doc.setFontSize(10);
  doc.text('Subtotal:', pageWidth - margin - 40, yPos);
  doc.text(`$${data.subtotal.toFixed(2)}`, pageWidth - margin - 5, yPos, { align: 'right' });
  yPos += 7;

  doc.text('Tax (10%):', pageWidth - margin - 40, yPos);
  doc.text(`$${data.tax.toFixed(2)}`, pageWidth - margin - 5, yPos, { align: 'right' });
  yPos += 10;

  // Total
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Total:', pageWidth - margin - 40, yPos);
  doc.text(`$${data.total.toFixed(2)}`, pageWidth - margin - 5, yPos, { align: 'right' });
  yPos += 15;

  // Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('Thank you for your business!', pageWidth / 2, yPos, { align: 'center' });
  yPos += 5;
  doc.text('For support, contact: support@possystem.com', pageWidth / 2, yPos, { align: 'center' });

  // Save PDF
  if (window.electronAPI) {
    const result = await window.electronAPI.dialog.showSaveDialog({
      defaultPath: `Receipt-${data.invoiceNumber}.pdf`,
      filters: [{ name: 'PDF Files', extensions: ['pdf'] }]
    });

    if (!result.canceled && result.filePath) {
      // In Electron, we'd save the file via IPC
      // For now, just download it
      doc.save(`Receipt-${data.invoiceNumber}.pdf`);
    }
  } else {
    doc.save(`Receipt-${data.invoiceNumber}.pdf`);
  }
}
