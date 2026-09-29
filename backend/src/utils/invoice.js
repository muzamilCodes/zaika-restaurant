import PDFDocument from 'pdfkit';

export function buildInvoicePdf(order) {
  const doc = new PDFDocument({ margin: 40 });
  const chunks = [];

  doc.on('data', (chunk) => chunks.push(chunk));

  return new Promise((resolve) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));

    doc.fontSize(24).text('Zaika Restaurant Invoice', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Invoice No: ${order.invoiceNumber}`);
    doc.text(`Order No: ${order.orderNumber}`);
    doc.text(`Status: ${order.status}`);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`);
    doc.moveDown();

    order.items.forEach((item) => {
      doc.text(`${item.name} x ${item.quantity} - Rs. ${item.price * item.quantity}`);
    });

    doc.moveDown();
    doc.text(`Subtotal: Rs. ${order.subtotal}`);
    doc.text(`Tax: Rs. ${order.tax}`);
    doc.text(`Delivery Fee: Rs. ${order.deliveryFee}`);
    doc.text(`Total: Rs. ${order.total}`);
    doc.end();
  });
}
