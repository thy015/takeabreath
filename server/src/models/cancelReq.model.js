const mongoose = require("mongoose");

const reqCancelSchema = new mongoose.Schema({
  isAccept: {
    type: String,
    default: "processing",
    enum: ["processing", "accepted", "rejected"],
    required: false,
  },
  dayReq: { type: Date, default: Date.now, required: false },
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
  dayDiffFromCheckIn:{
    type:Number,
    required:false
  },
  ownerID:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Owner",
    required: true,
  },
  rejectedReason:{
    type:String,
    required:false
  },
  refundAmount: { type: Number, default: 0, required: false },
  refundDay: { type: Date, default: Date.now, required: true },
  paymentMethod:{type:String,required:true,enum:['wowo','paypal']},
  wowoOrderID:{type:String,required:false},
});

const CancelRequest = mongoose.model("CancelReq", reqCancelSchema);

module.exports = {
  CancelRequest,
};