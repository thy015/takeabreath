const mongoose = require("mongoose");
const InvoiceSchema = new mongoose.Schema({
  createDay: { type: Date, required: false, default: Date.now },
  invoiceState: {
    type: String,
    required: false,
    enum: ["waiting", "paid"],
    default: "waiting",
  },
  guestInfo:
    {
      name:{type:String,required:true},
      idenCard:{type:String, required:true},
      email:{type:String, required:true},
      phone:{type:String,required:true},
      dob:{type:Date,required:true},
      gender:{type:String,required:true, enum:['male','female','unknown']},
      paymentMethod:{type:String, enum:['momo','paypal','wowo'],required:true},
      checkInDay: { type: Date, required: true },
      checkOutDay: { type: Date, required: true },
      totalPrice: { type: Number, required: true },
      totalRoom:{type:Number,required:true},
    }
  ,
  voucherID:{type:mongoose.Schema.Types.ObjectId,ref:'Voucher',required:false},
  cusID: { type: mongoose.Schema.Types.ObjectId, ref:'Customer',required: true }, 
  roomID: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
  hotelID: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true },
    ownerID:{type:mongoose.Schema.Types.ObjectId, ref:'Owner',required: true },
    wowoOrderID:{type:Number,required:false,default:0},
});


const Invoice = mongoose.model("Invoice", InvoiceSchema);
module.exports = {
  Invoice,
};
