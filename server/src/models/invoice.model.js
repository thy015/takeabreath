const mongoose = require("mongoose");
const InvoiceSchema = new mongoose.Schema({
  createDay: { type: Date, required: false, default: Date.now },
  checkInDay: { type: Date, required: true },
  checkOutDay: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  totalRoom:{type:Number,required:true},
  invoiceState: {
    type: String,
    required: false,
    enum: ["waiting", "paid"],
    default: "waiting",
  },
  guestInfo:[
    {
      name:{type:String,required:true},
      idenCard:{type:String,unique:true, required:true},
      email:{type:String, required:true},
      phone:{type:String,required:true},
      dob:{type:Date,required:true},
      gender:{type:Boolean,required:true},
      paymentMethod:{type:String, enum:['momo','paypal'],required:true},
      
    }
  ],
  voucherID:{type:mongoose.Schema.Types.ObjectId,ref:'Voucher',required:false},
  cusID: { type: mongoose.Schema.Types.ObjectId, ref:'Customer',required: true }, 
  roomID: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
});

const ReceiptSchema=new mongoose.Schema({
  checkInDay: { type: Date, required: true },
  checkOutDay: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  cusID: {  type: mongoose.Schema.Types.ObjectId, ref:'Customer', required: true }, 
  roomID: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
})
const Invoice = mongoose.model("Invoice", InvoiceSchema);
const Receipt=mongoose.model('Receipt',ReceiptSchema)
module.exports = {
  Invoice,
  Receipt,
};
