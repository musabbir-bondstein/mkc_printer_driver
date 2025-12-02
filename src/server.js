const express = require("express");
const bodyParser = require("body-parser");
const ThermalPrinter = require("./printer");
const PdfPrinter = require("./pdf-printer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// const printer = new ThermalPrinter({
//   interface: "usb",
//   // ip: "192.168.1.50",
//   // port: 9100
// });

const printer = new PdfPrinter();

app.post("/print-receipt", async (req, res) => {
  try {
    const data = req.body;
    // console.log("Receipt Data:", data.print_view);

    // MUST be a real file path
    // await printer.print(data.file);

    res.json({ status: "ok" });
  } catch (err) {
    console.error("PRINT FAILED:", err);
    res.status(500).json({ message: err.message });
  }
});

app.post("/print-ticket", async (req, res) => {
  try {
    const data = req.body;
    // console.log("Receipt Data:", data.print_view);

    await printer.print(Buffer.from(data.print_view, "base64"));

    res.json({ status: "ok" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

app.listen(3030, () => {
  console.log("Local ECS POS Print Server running on port 3030");
});
