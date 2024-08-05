import React from "react";
import QRLabelGenerator from "./components/QRLabelGenerator"; // Update path as needed
import BarcodeGenerator from "./components/BarcodeGenerator"; // Update path as needed
import BarcodeGenerator60 from "./components/BarcodeGenerator60"; // Update path as needed

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Label and Barcode PDF Generator</h1>
      <div style={{ marginBottom: "20px" }}>
        <h2>Generate Labels with QR Codes</h2>
        <QRLabelGenerator />
      </div>
      <div style={{ marginBottom: "20px" }}>
        <h2>Generate PDF with Barcodes Only</h2>
        <BarcodeGenerator />
      </div>
      <div>
        <h2>Generate PDF with 60 Barcodes</h2>
        <BarcodeGenerator60 />
      </div>
    </div>
  );
}

export default App;
