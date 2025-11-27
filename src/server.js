const express = require("express");
const bodyParser = require("body-parser");
const ThermalPrinter = require("./printer");

const app = express();
app.use(bodyParser.json());

const printer = new ThermalPrinter({
  interface: "usb",
  // ip: "192.168.1.50",
  // port: 9100
});

app.post("/print-receipt", async (req, res) => {
  try {
    const data = req.body;

    await printer.print(data, "receipt");

    res.json({ status: "ok" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

app.post("/print-ticket", async (req, res) => {
  try {
    const data = req.body;

    await printer.print(data, "ticket");

    res.json({ status: "ok" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

app.listen(3030, () => {
  console.log("Local ECS POS Print Server running on port 3030");
});
