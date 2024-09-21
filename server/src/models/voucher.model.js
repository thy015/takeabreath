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
    }
}, { timestamps: true });

const Voucher = mongoose.model('Voucher', voucherSchema);

module.exports={Voucher}