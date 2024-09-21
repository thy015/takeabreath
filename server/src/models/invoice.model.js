const mongoose = require("mongoose");
const InvoiceSchema = new mongoose.Schema({
  createDay: { type: Date, required: false, default: Date.now },
  checkInDay: { type: Date, required: true },
  checkOutDay: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  invoiceState: {
    type: String,
    required: false,
    enum: ["waiting", "paid"],
    default: "waiting",
  },
  deleteDay: {
    type: Date,
    required: false,
    default: function () {
      // Set deleteDay to 7 days after checkOutDay
      return this.checkOutDay
        ? new Date(this.checkOutDay.getTime() + 7 * 24 * 60 * 60 * 1000)
        : null;
    },
  },
  cusID: { type: String, required: true }, //take from microfe
  roomID: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
});

const ReceiptSchema=new mongoose.Schema({
  checkInDay: { type: Date, required: true },
  checkOutDay: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  cusID: { type: String, required: true }, //take from microfe
  roomID: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
})
const Invoice = mongoose.model("Invoice", InvoiceSchema);
const Receipt=mongoose.model('Receipt',ReceiptSchema)
module.exports = {
  Invoice,
  Receipt
};
