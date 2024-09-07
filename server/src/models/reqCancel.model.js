const mongoose =require('mongoose')
//processing, accepted, rejected
const reqCancelSchema=mongoose.Schema({
    isAccept:{type:String,default:'processing'},
    dateReq:{type:Date,default:Date.now(),required:true},
    dateAccept:{type:Date},
    cusID:{type:String,required:true},
    adminID:{type:mongoose.Schema.ObjectId,ref:'Admin',required:false},
    receiptID:{type:mongoose.Schema.ObjectId,ref:'Receipt',required:true}
});

const refundMoneySchema =mongoose.Schema({
    dateRefund:{type:Date,default:Date.now(),required:true},
    amountRefund:{type:Number,default:0,required:true},
    cusID:{type:String,required:true}
})
const reqCancel=mongoose.model('reqCancel',reqCancelSchema);
const refundMoney=mongoose.model('refundMoney',refundMoneySchema)
module.exports={
    reqCancel,
    refundMoney
}