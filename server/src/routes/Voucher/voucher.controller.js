const { set } = require("mongoose")
const { Voucher, SystemVoucher } = require("../../models/voucher.model")
const { response } = require("express")
const moment = require('moment')
const addVoucher = async (req, res) => {
    const { voucherName, discount, dateStart, dateEnd, code } = req.body
    const { ownerID } = req
    if (!ownerID) {
        return res.status(403).json({ status: false, message: "Dont have owner" })
    }
    if (!voucherName || !discount || !dateStart || !dateEnd || !code) {
        return res.status(403).json({ status: false, message: "Input required" })
    }
    try {
        const checkCode = await Voucher.findOne({
            code: code
        })
        if (checkCode) {
            return res.status(400).json({ status: false, message: "Code exsisted" })
        }
        const newVoucher = new Voucher({
            voucherName: voucherName,
            discount: discount,
            startDay: dateStart,
            endDay: dateEnd,
            code: code,
            ownerID: ownerID
        })
        await newVoucher.save()
        return res.status(201).json({ status: true, message: "Add voucher successful !" })
    } catch (error) {
        console.error("Error in add voucher:", error);
        return res.status(500).json({
            status: "ERROR",
            message: "Lỗi hệ thống",
        });
    }
}

const deleteVoucher = async (req, res) => {
    const id = req.params.id
    try {
        const voucher = await Voucher.findByIdAndDelete({
            _id: id
        })
        if (!voucher) {
            return res.status(400).json({ status: false, message: "Voucher does not exist !" })
        }

        return res.status(200).json({ status: true, message: "Delete voucher successfully !" })
    } catch (error) {
        console.error("Error in add voucher:", error);
        return res.status(500).json({
            status: "ERROR",
            message: "Lỗi hệ thống",
        });
    }
}


const updateVoucher = async (req, res) => {
    const idVoucher = req.params.id
    const { voucherName, discount, startDay, endDay } = req.body.value
    if (!idVoucher) {
        return res.status(403).json({ status: false, message: "Dont have id voucher" })
    }
    if (!voucherName || !discount || !startDay || !endDay) {
        return res.status(403).json({ status: false, message: "Input required" })
    }
    try {
        const voucher = await Voucher.findByIdAndUpdate({
            _id: idVoucher,
        })
        if (voucher.ownerID.toString() === req.ownerID.toString()) {
            voucher.set({
                voucherName:voucherName,
                discount:discount,
                startDay:startDay,
                endDay:endDay
            })
            await voucher.save()
            return res.status(200).json({ status: true, message: "Update successfull !", ownerID: req.ownerID })
            
        }
        return res.status(403).json({ status: false, message: "No Ownership Voucher  !", ownerID: req.ownerID })
    } catch (error) {
        console.error("Error in add voucher:", error);
        return res.status(500).json({
            status: "ERROR",
            message: "Lỗi hệ thống",
        });
    }
}

const getListVoucher = async (req, res) => {
    const listVoucher = await Voucher.find({
        ownerID:req.ownerID
    })
    res.json({ listVoucher: listVoucher })
}

const updateSysVoucher = async(req,res)=>{
    const{voucherName,discount,startDay,endDay,code,adminID,ownerJoined}=req.body;
    if(!voucherName||!discount||!startDay||!endDay||!code||!adminID){
        return res.json({success:false,message:"Vui lòng điền đủ thông tin"})
    }
    try {
        const today=moment().startOf('day')
        const end =moment(endDay)
        if(!end.isAfter(today.add(1,'day'))){
            return res.status(400).json({success:false,message:"Ngày kết thúc phải ít nhất 1 ngày sau ngày hôm nay"})
        }
        const updateVou=await SystemVoucher.findByIdAndUpdate(req.params.id,
            {voucherName,discount,endDay,startDay,code,adminID,ownerJoined},
            {new: true}
        )
        if (!updateVou) {
            return res.status(404).json({ message: "Không tìm thấy Voucher" });
          }
          res.json({ success:true,message: "Cập nhật Voucher thành công", voucher: updateVou });
    } catch (error) {
        res.status(500).json({success:false, message: "Cập nhật Voucher thất bại", error });
    }
}
const deleteSysVoucher=async(req,res)=>{
    try {
        const deletee = await SystemVoucher.findByIdAndDelete(req.params.id);
        if (!deletee) {
            return res.status(404).json({success:false,message: "Không tìm thấy Voucher" });
          }
          res.json({success:true, message: "Xóa Voucher thành công" });
    } catch (error) {
        res.status(500).json({success:false, message: "Xóa Voucher thất bại", error });
    }
}
module.exports = {
    addVoucher,
    getListVoucher,
    deleteVoucher,
    updateVoucher,
    updateSysVoucher,
    deleteSysVoucher,
}