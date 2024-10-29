    const mongoose = require('mongoose')

    const voucherSchema = new mongoose.Schema({
        voucherName: {
            type: String, 
            required: true
        },
        discount: {
            type: Number, 
            required: true
        },
        startDay: {
            type: Date, 
            required: true
        },
        endDay: {
            type: Date,
            required: true
        },
        code: {
            type: String, 
            maxlength: 5,
            unique: true,
            required: true
        },
        ownerID: {
            type:mongoose.Schema.Types.ObjectId,
            ref: "Owner",
            require:true
        }
    }, { timestamps: true });
        const systemVoucherSchema=new mongoose.Schema({
            voucherName: {
                type: String,
                required: true
            },
            discount: {
                type: Number,
                required: true
            },
            startDay: {
                type: Date,
                required: true
            },
            endDay: {
                type: Date,
                required: true
            },
            code: {
                type: String,
                maxlength: 5,
                unique: true,
                required: true
            },
            ownerJoined:[
                {type:mongoose.Schema.Types.ObjectId,ref:"Owner",required:false}
            ],
            adminID:{type:mongoose.Schema.Types.ObjectId,ref:'Admin',required:true}
        }, { timestamps: true })
    const Voucher = mongoose.model('Vouchers', voucherSchema);
    const SystemVoucher=mongoose.model('SystemVoucher',systemVoucherSchema);
    module.exports={Voucher,SystemVoucher}