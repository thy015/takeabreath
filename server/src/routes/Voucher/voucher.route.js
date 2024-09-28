const express = require("express")
const VoucherRoute = express.Router()
const {Voucher} = require("../../models/voucher.model")
const {verifyOwner} = require("../../services/verify")
const {addVoucher,getListVoucher,deleteVoucher,updateVoucher} = require("./voucher.controller")

VoucherRoute.all("*",verifyOwner)

VoucherRoute.post("/add-voucher",addVoucher)
VoucherRoute.get("/list-voucher",getListVoucher)
VoucherRoute.delete("/list-voucher/:id",deleteVoucher)
VoucherRoute.post("/list-voucher/update/:id",updateVoucher)
module.exports=VoucherRoute
