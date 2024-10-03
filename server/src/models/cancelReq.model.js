const mongoose = require("mongoose");

const reqCancelSchema = new mongoose.Schema({
  isAccept: {
    type: String,
    default: "processing",
    enum: ["processing", "accepted", "rejected"],
    required: false,
  },
  dayReq: { type: Date, default: Date.now, required: true },
  dayAcp: { type: Date, required: false },
  cusID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: false,
  },
  adminID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: false,
  },
  invoiceID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Invoice",
    required: true,
  },
});

const refundMoneySchema = new mongoose.Schema({
  refundDay: { type: Date, default: Date.now, required: true },
  refundAmount: { type: Number, default: 0, required: true },
  cusID: { type: String, required: true },
  cancelReqID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CancelReq",
    required: true,
  },
});

const reqCancel = mongoose.model("CancelReq", reqCancelSchema);
const RefundMoney = mongoose.model("RefundMoney", refundMoneySchema);

module.exports = {
  reqCancel,
  RefundMoney,
};