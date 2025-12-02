const printer = require("pdf-to-printer");
const fs = require("fs");

class PdfPrinter {
  async print(binaryData) {
    try {
      const tempPath = `temp/print_${Date.now()}.pdf`;
      fs.writeFileSync(tempPath, binaryData);

      return await printer.print(tempPath, {
        printer: "RONGTA 80mm Series Printer",
      });
    } catch (err) {
      console.error("PRINT ERROR:", err);
      throw err;
    }
  }
}

module.exports = PdfPrinter;
