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
