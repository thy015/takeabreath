const express = require('express');
const reqCancelRouter = express.Router();
const reqCancelController=require('./cancelReq.controller');
const {CancelRequest} = require("../../models/cancelReq.model");
const {Invoice} = require("../../models/invoice.model");
const {verifyAdmin} = require("../../middleware/verify");

reqCancelRouter.get('/processing',verifyAdmin,reqCancelController.getReqCancelRoomProcess)
reqCancelRouter.get('/accepted',verifyAdmin,reqCancelController.getReqCancelRoomAccepted)
reqCancelRouter.get('/rejected',verifyAdmin,reqCancelController.getReqCancelRoomRejected)
//get cancel req theo id user( + invoice)
reqCancelRouter.get('/:id/cancelRequest',async(req,res)=>{
    const {id}=req.params;
    try{
        let cancelRequest=await CancelRequest.find({cusID:id})
        if(cancelRequest.length>0){
            let invoiceMatchId=cancelRequest.map(request=>request.invoiceID)
            let invoices=await Invoice.find({_id:{$in:invoiceMatchId}})
            let invoiceMap={}
            invoices.forEach(invoice => {
                invoiceMap[invoice._id] = invoice;
            });
            const responseData = cancelRequest.map(request => ({
                cancelRequest: request,
                invoice: invoiceMap[request.invoiceID] || null
            }));

            return res.status(200).json({message:'Cancel Request',
                data:responseData
            });
        }
        return res.status(204).json({message:'You havent cancel any req',data:responseData});
    }catch(e){
        return res.status(500).json({message:'internal e in signUp router',e})
    }
})

reqCancelRouter.put('/active/:id', verifyAdmin,reqCancelController.activeCus);
reqCancelRouter.put('/inactive/:id',verifyAdmin ,reqCancelController.inactiveCus);
reqCancelRouter.put('/inactiveCus/:id' ,reqCancelController.inactiveCus);
reqCancelRouter.post('/accept/:cancelReqID',verifyAdmin,reqCancelController.handleCancelRoomAccept)
reqCancelRouter.post('/reject/:cancelReqID',verifyAdmin,reqCancelController.handleCancelRoomReject)
module.exports=reqCancelRouter

//swagger
/**
 * @swagger
 * tags:
 *   name: Cancellation Requests
 *   description: API endpoints for handling room cancellation requests
 */

/**
 * @swagger
 * /api/cancelReq/processing:
 *   get:
 *     tags: [Cancellation Requests]
 *     summary: Get processing cancellation requests
 *     responses:
 *       200:
 *         description: List of processing cancellation requests
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/cancelReq/accepted:
 *   get:
 *     tags: [Cancellation Requests]
 *     summary: Get accepted cancellation requests
 *     responses:
 *       200:
 *         description: List of accepted cancellation requests
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/cancelReq/rejected:
 *   get:
 *     tags: [Cancellation Requests]
 *     summary: Get rejected cancellation requests
 *     responses:
 *       200:
 *         description: List of rejected cancellation requests
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/cancelReq/cusSend:
 *   post:
 *     tags: [Cancellation Requests]
 *     summary: Send a cancellation request
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               receiptID:
 *                 type: string
 *                 description: ID of the receipt to be canceled
 *     responses:
 *       200:
 *         description: Request to cancel room sent to admin
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       403:
 *         description: Missing required fields
 *       404:
 *         description: Can't find receipt
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/cancelReq/admin/accept/{reqCancelID}:
 *   post:
 *     tags: [Cancellation Requests]
 *     summary: Accept a cancellation request
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: reqCancelID
 *         in: path
 *         required: true
 *         description: ID of the cancellation request
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: string
 *                 description: ID of the order to refund
 *               transactionId:
 *                 type: string
 *                 description: Transaction ID for the refund
 *     responses:
 *       200:
 *         description: Refund processed and cancellation request status updated
 *       403:
 *         description: Missing required fields
 *       404:
 *         description: Cancellation request not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/cancelReq/admin/reject/{reqCancelID}:
 *   post:
 *     tags: [Cancellation Requests]
 *     summary: Reject a cancellation request
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: reqCancelID
 *         in: path
 *         required: true
 *         description: ID of the cancellation request
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: string
 *                 description: ID of the order to be checked
 *     responses:
 *       200:
 *         description: Cancellation request rejected
 *       403:
 *         description: Missing required fields
 *       404:
 *         description: Cancellation request not found
 *       500:
 *         description: Internal server error
 */
