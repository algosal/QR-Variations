import React from "react";
import { PDFDocument, rgb } from "pdf-lib";
import { saveAs } from "file-saver";
import QRCode from "qrcode";

const generatePDF = async (labels) => {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 size (in points)
  const { width, height } = page.getSize();

  // Add labels to the page
  const labelWidth = width / 3; // 3 labels per row
  const labelHeight = height / 10; // 10 rows per page

  for (let i = 0; i < labels.length; i++) {
    const label = labels[i];
    const row = Math.floor(i / 3);
    const col = i % 3;

    const x = col * labelWidth;
    const y = height - (row + 1) * labelHeight;

    // Draw label border
    page.drawRectangle({
      x,
      y,
      width: labelWidth,
      height: labelHeight,
      borderColor: rgb(0, 0, 0),
      borderWidth: 1,
    });

    // Generate QR code
    const qrCodeDataUrl = await QRCode.toDataURL(
      `Product ID: ${label.productId}\nName: ${label.Name}\nPrice: ${label.price}\nSerial: ${label.serial}`
    );
    const qrImage = await pdfDoc.embedPng(qrCodeDataUrl);
    page.drawImage(qrImage, {
      x: x + 10,
      y: y + 10,
      width: 100,
      height: 100,
    });

    // Draw product info
    page.drawText(`Product ID: ${label.productId}`, {
      x: x + 120,
      y: y + 80,
      size: 12,
    });
    page.drawText(`Name: ${label.Name}`, {
      x: x + 120,
      y: y + 65,
      size: 12,
    });
    page.drawText(`Price: $${label.price}`, {
      x: x + 120,
      y: y + 50,
      size: 12,
    });
    page.drawText(`Serial: ${label.serial}`, {
      x: x + 120,
      y: y + 35,
      size: 12,
    });
  }

  // Serialize PDF to bytes
  const pdfBytes = await pdfDoc.save();

  // Download the PDF
  saveAs(new Blob([pdfBytes], { type: "application/pdf" }), "labels.pdf");
};

const QRLabelGenerator = () => {
  const labels = Array(30).fill({
    productId: "1",
    Name: "some name",
    price: "25",
    serial: "12345",
  });

  return <button onClick={() => generatePDF(labels)}>Generate PDF</button>;
};

export default QRLabelGenerator;
