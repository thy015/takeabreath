const mongoose = require("mongoose");
const InvoiceSchema = new mongoose.Schema({
  createDay: { type: Date, required: true, default: Date.now },
  total: { type: Number, required: true },
  invoiceState: {
    type: String,
    required: false,
    enum: ["waiting", "paid"],
    default: "waiting",
  },
  checkInDay: { type: Date, required: true },
  checkOutDay: { type: Date, required: true },
  cusID: { type: String, required: true }, //take from microfe
  roomID: { type: mongoose.Schema.ObjectId, ref: "Room", required: true },
});

const ReceiptSchema = new mongoose.Schema({
  invoiceID: { type: mongoose.Schema.ObjectId, ref: "Invoice", required: true },
  createDay: { type: Date, required: true, default: Date.now },
  total: { type: Number, required: true },
  invoiceState: {
    type: String,
    required: false,
    enum: ["waiting", "paid"],
    default: "waiting",
  },
  checkInDay: { type: Date, required: true },
  checkOutDay: { type: Date, required: true },
  deleteDay: { 
    type: Date, 
    required: false,
    default: function() {
      // Set deleteDay to 7 days after checkOutDay
      return this.checkOutDay ? 
      new Date(this.checkOutDay.getTime() + 7 * 24 * 60 * 60 * 1000) 
      : null;
    }
  },
  cusID: { type: String, required: true }, //take from microfe
  roomID: { type: mongoose.Schema.ObjectId, ref: "Room", required: true },
});

const Receipt = mongoose.model("Receipt", ReceiptSchema);
const Invoice = mongoose.model("Invoice", InvoiceSchema);
module.exports = {
  Invoice,
  Receipt,
};
