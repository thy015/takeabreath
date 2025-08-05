const mongoose = require ("mongoose");

const reqCancelSchema = new mongoose.Schema ({
  cancelState: {
    type: String,
    default: "processing",
    enum: ["processing", "transferred"],
    required: false,
  },
  dayReq: {type: Date, default: Date.now, required: false},
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
  dayDiffFromCheckIn: {
    type: Number,
    required: false
  },
  ownerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Owner",
    required: true,
  },
  refundAmount: {type: Number, default: 0, required: false},
  refundDay: {type: Date, default: Date.now, required: false},
  refundMethod: {type: String, required: false, enum: ['card', 'paypal'], default: 'card'},
});

const CancelRequest = mongoose.model ("CancelReq", reqCancelSchema);

module.exports = {
  CancelRequest,
};