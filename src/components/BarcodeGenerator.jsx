import React from "react";
import { PDFDocument, rgb } from "pdf-lib";
import { saveAs } from "file-saver";
import QRCode from "qrcode";

const generatePDF = async (barcodes) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 size (in points)
  const { width, height } = page.getSize();

  const numColumns = 3; // 3 columns
  const numRows = 10; // 10 rows

  // Calculate spacing
  const totalHorizontalSpace = width - 40; // 40 points margin (20 points on each side)
  const totalVerticalSpace = height - 60; // 60 points margin (20 points on each side and space for footer)

  const labelWidth = totalHorizontalSpace / numColumns; // Evenly distributed width
  const labelHeight = totalVerticalSpace / numRows; // Evenly distributed height

  // Choose the smaller dimension to ensure square labels
  const labelSize = Math.min(labelWidth, labelHeight);

  // Calculate the starting position to center the grid
  const offsetX = (totalHorizontalSpace - numColumns * labelSize) / 2;
  const offsetY = (totalVerticalSpace - numRows * labelSize) / 2;

  const margin = (labelWidth - labelSize) / 2; // Center margin within each label cell

  for (let i = 0; i < barcodes.length; i++) {
    const barcode = barcodes[i];
    const row = Math.floor(i / numColumns);
    const col = i % numColumns;

    const x = offsetX + col * labelSize;
    const y = height - offsetY - (row + 1) * labelSize;

    // Generate QR code
    const qrCodeDataUrl = await QRCode.toDataURL(barcode);
    const qrImage = await pdfDoc.embedPng(qrCodeDataUrl);

    // Draw QR code
    page.drawImage(qrImage, {
      x: x + margin,
      y: y + margin,
      width: labelSize - 2 * margin,
      height: labelSize - 2 * margin,
    });
  }

  // Add footer text at the bottom
  const footerText = "Salman Saeed Special Product";
  const footerFontSize = 12; // Font size for the footer text
  const footerMargin = 20; // Margin from the bottom of the page

  page.drawText(footerText, {
    x: width / 2 - (footerText.length * footerFontSize) / 2, // Center horizontally
    y: footerMargin,
    size: footerFontSize,
    color: rgb(0, 0, 0), // Black color for footer text
    align: "center", // Center the footer text horizontally
  });

  // Serialize PDF to bytes
  const pdfBytes = await pdfDoc.save();

  // Download the PDF
  saveAs(
    new Blob([pdfBytes], { type: "application/pdf" }),
    "30-barcodes-with-centered-footer.pdf"
  );
};

const BarcodeGenerator30 = () => {
  // Generate sample barcodes. You can replace these with your own barcode data.
  const barcodes = Array(30).fill("SampleBarcodeData");

  return (
    <button onClick={() => generatePDF(barcodes)}>
      Generate Centered 30 Barcode PDF with Footer
    </button>
  );
};

export default BarcodeGenerator30;
