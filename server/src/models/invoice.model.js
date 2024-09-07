const mongoose=require('mongoose')
const InvoiceSchema=new mongoose.Schema(
    {
        createDate:{type:Date,required:true, default: Date.now },
        total:{type:Number,required:true},
        paymentMethod:{type:String,required:true},
        isPaid:{type:Boolean,required:true,default:false},
        cusID:{type:String,required:true},
        roomID:{type:mongoose.Schema.ObjectId,ref:'Room',required:true}
    }
)
const ReceiptSchema=new mongoose.Schema(
    {
        invoiceID:{type:mongoose.Schema.ObjectId,ref:'Invoice',required:true},
        createDate:{type:Date,required:true, default: Date.now}
    }
)
const Receipt=mongoose.model('Receipt',ReceiptSchema)
const Invoice=mongoose.model('Invoice',InvoiceSchema)
module.exports={
    Invoice,
    Receipt
}