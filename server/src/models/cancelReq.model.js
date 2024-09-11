const mongoose = require("mongoose");
//processing, accepted, rejected
const reqCancelSchema = mongoose.Schema({
  isAccept: {
    type: String,
    default: "processing",
    enum: ["processing", "accepted", "rejected"],
  },
  dateReq: { type: Date, default: Date.now(), required: true },
  dateAccept: { type: Date, required: false },
  cusID: { type: String, required: true },
  adminID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: false,
  },
  receiptID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Receipt",
    required: true,
  },
});

const refundMoneySchema = mongoose.Schema({
  dayRefund: { type: Date, default: Date.now(), required: true },
  amountRefund: { type: Number, default: 0, required: true },
  cusID: { type: String, required: true },
});
const CancelReq = mongoose.model("CancelReq", reqCancelSchema);
const MoneyRefund = mongoose.model("MoneyRefund", refundMoneySchema);
module.exports = {
  CancelReq,
  MoneyRefund,
};
