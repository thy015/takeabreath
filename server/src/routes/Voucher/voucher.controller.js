const { set } = require("mongoose")
const { Voucher } = require("../../models/voucher.model")

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

module.exports = {
    addVoucher,
    getListVoucher,
    deleteVoucher,
    updateVoucher
}