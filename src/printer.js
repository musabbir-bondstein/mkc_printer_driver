const fs = require("fs");
const path = require("path");
const escpos = require("escpos");

escpos.USB = require("escpos-usb");
escpos.Network = require("escpos-network");

function base64ToTempImage(base64) {
  const file = path.join(__dirname, "print_image.png");
  const data = base64.split(";base64,").pop();

  fs.writeFileSync(file, Buffer.from(data, "base64"));
  return file;
}

class ThermalPrinter {
  constructor(options = {}) {
    this.interface = options.interface || "usb";
    this.device = null;

    if (this.interface === "usb") {
      this.device = new escpos.USB();
    }

    if (this.interface === "network") {
      const ip = options.ip || "192.168.0.100";
      const port = options.port || 9100;
      this.device = new escpos.Network(ip, port);
    }

    this.printer = new escpos.Printer(this.device, {
      encoding: "GB18030",
    });
  }

  print(data, type = "ticket") {
    return new Promise((resolve, reject) => {
      this.device.open(async (err) => {
        if (err) return reject(err);

        try {
          if (type === "ticket") {
            await this.printTicket(data);
          } else if (type === "receipt") {
            await this.printStandardReceipt(data);
          }

          this.printer.cut();
          this.printer.close();
          resolve(true);
        } catch (e) {
          reject(e);
        }
      });
    });
  }

  async printTicket(data) {
    return new Promise((resolve, reject) => {
      const { image, vrn, time, slot } = data;

      const imagePath = base64ToTempImage(image);

      escpos.Image.load(imagePath, (image) => {
        this.printer
          .align("CT")
          .image(image, "s8")
          .text(vrn)
          .text(time)
          .text(`Parking Slot: ${slot}`);

        resolve();
      });
    });
  }

  async printStandardReceipt(data) {
    return new Promise((resolve) => {
      this.printer
        .align("LT")
        .text("-------- RECEIPT --------")
        .text(`Date: ${data.date}`)
        .text(`Amount: ${data.amount}`)
        .text(`Ref: ${data.reference}`)
        .text("--------------------------");

      resolve();
    });
  }
}

module.exports = ThermalPrinter;
