const express = require("express")
const VoucherRoute = express.Router()
const {Voucher, SystemVoucher} = require("../../models/voucher.model")
const {verifyOwner, verifyAdmin} = require("../../middleware/verify")
const moment =require('moment')
const {addVoucher,getListVoucher,deleteVoucher,updateVoucher, updateSysVoucher, deleteSysVoucher} = require("./voucher.controller")
// VoucherRoute.all('*',verifyOwner)
// owner
VoucherRoute.post("/add-voucher",verifyOwner,addVoucher)
VoucherRoute.get("/list-voucher",verifyOwner,getListVoucher)
VoucherRoute.delete("/list-voucher/:id",verifyOwner,deleteVoucher)
VoucherRoute.post("/list-voucher/update/:id",verifyOwner,updateVoucher)
//admin 
VoucherRoute.get("/sysvou", async(req,res)=>{
    try {
        const a =await SystemVoucher.find().sort({createdAt:-1});
            return res.status(201).json(a)
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:error.message})
    }
})
VoucherRoute.get("/sysvou/:id",verifyAdmin,async(req,res)=>{
    try {
        const a =await SystemVoucher.findById(req.params.id)
        return res.status(201).json(a)
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:error.message})
    }
})
VoucherRoute.get("/getVoucus/:id", async (req, res) => {
    try {
        const currentDate = new Date();
        const sysvou = await SystemVoucher.find({
            startDay: { $lte: currentDate }, 
            endDay: { $gte: currentDate }, 
        });
        const vou = await Voucher.find({
            ownerID: req.params.id,
            startDay: { $lte: currentDate },
            endDay: { $gte: currentDate }, 
        });
        res.json({
            sysVou: sysvou,
            ownerVou: vou,
        });
    } catch (error) {
        console.error('Lỗi truy xuất voucher:', error);
        res.status(500).json({ message:  error.message });
    }
});


VoucherRoute.post("/updatevou/:id",verifyAdmin,updateSysVoucher);
VoucherRoute.delete("/deletevou/:id",verifyAdmin,deleteSysVoucher);
VoucherRoute.post('/addvou', verifyAdmin, async (req, res) => {
    try {
        const newVoucher = new SystemVoucher(req.body);
        const exist = await SystemVoucher.findOne({ code: newVoucher.code });
        
        if (exist) {
            return res.status(400).json({ success: false, message: "Mã voucher đã tồn tại" });
        }
        const today = moment().startOf('day'); 
        const end = moment(newVoucher.endDay); 
        if (!end.isAfter(today)) {
            return res.status(400).json({ success: false, message: "Ngày kết thúc phải ít nhất là ngày sau hôm nay" });
        }

        await newVoucher.save();
        res.status(201).json({ status: 'OK', message: 'Voucher được tạo thành công', voucher: newVoucher });
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports=VoucherRoute

//this is the start of swagger docs

/**
 * @swagger
 * tags:
 *   name: Voucher
 *   description: Voucher management API
 */

/**
 * @swagger
 * /api/voucher/add-voucher:
 *   post:
 *     summary: Add a new voucher
 *     tags: [Voucher]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               voucherName:
 *                 type: string
 *                 description: Name of the voucher
 *               discount:
 *                 type: number
 *                 description: Discount value
 *               dateStart:
 *                 type: string
 *                 format: date
 *                 description: Start date of the voucher
 *               dateEnd:
 *                 type: string
 *                 format: date
 *                 description: End date of the voucher
 *               code:
 *                 type: string
 *                 description: Unique code for the voucher
 *     responses:
 *       201:
 *         description: Voucher added successfully
 *       400:
 *         description: Code already exists
 *       403:
 *         description: Input required or authorization error
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/voucher/list-voucher:
 *   get:
 *     summary: Retrieve the list of vouchers
 *     tags: [Voucher]
 *     responses:
 *       200:
 *         description: List of vouchers retrieved successfully
 *       403:
 *         description: Authorization error
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/voucher/list-voucher/{id}:
 *   delete:
 *     summary: Delete a voucher
 *     tags: [Voucher]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the voucher to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Voucher deleted successfully
 *       400:
 *         description: Voucher does not exist
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/voucher/list-voucher/update/{id}:
 *   post:
 *     summary: Update a voucher
 *     tags: [Voucher]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the voucher to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               voucherName:
 *                 type: string
 *               discount:
 *                 type: number
 *               dateStart:
 *                 type: string
 *                 format: date
 *               dateEnd:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Voucher updated successfully
 *       403:
 *         description: No ownership of the voucher or input required
 *       500:
 *         description: Internal server error
 */
