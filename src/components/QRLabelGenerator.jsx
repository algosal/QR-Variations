import React from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import QRCode from "qrcode";

const generatePDF = async (labels) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 size (in points)
  const { width, height } = page.getSize();

  const numColumns = 3;
  const numRows = 10;

  const labelWidth = (width - 40) / numColumns; // 40 points gap (20 points on each side)
  const labelHeight = (height - 40) / numRows; // 40 points gap (20 points on each side)

  const margin = 20; // Margin around each label

  for (let i = 0; i < labels.length; i++) {
    const label = labels[i];
    const row = Math.floor(i / numColumns);
    const col = i % numColumns;

    const x = col * labelWidth + margin;
    const y = height - (row + 1) * labelHeight + margin;

    // Generate QR code
    const qrCodeDataUrl = await QRCode.toDataURL(
      `Product ID: ${label.productId}\nName: ${label.Name}\nPrice: ${label.price}\nSerial: ${label.serial}`
    );
    const qrImage = await pdfDoc.embedPng(qrCodeDataUrl);
    page.drawImage(qrImage, {
      x: x + margin,
      y: y + margin,
      width: 80, // Adjusted QR code size
      height: 80, // Adjusted QR code size
    });

    // Draw product info
    page.drawText(`Product ID: ${label.productId}`, {
      x: x + 100,
      y: y + 70, // Adjusted position
      size: 10,
    });
    page.drawText(`Name: ${label.Name}`, {
      x: x + 100,
      y: y + 55, // Adjusted position
      size: 10,
    });
    page.drawText(`Price: $${label.price}`, {
      x: x + 100,
      y: y + 40, // Adjusted position
      size: 10,
    });
    page.drawText(`Serial: ${label.serial}`, {
      x: x + 100,
      y: y + 25, // Adjusted position
      size: 10,
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
