const express = require("express");
const bookController = require("./bookRoom.controller");
const {CancelRequest} = require("../../models/cancelReq.model");
const bookRouter = express.Router();

bookRouter.get("/invoice", bookController.getInvoicesWithReceipts);
bookRouter.get("/invoicepaid",bookController.getInvoicesPaid);
bookRouter.get("/invoicewaiting",bookController.getInvoicesWaiting);
bookRouter.post("/completedTran", bookController.completedTran);
bookRouter.post('/',bookController.bookRoom)
bookRouter.get(
  "/bookingHistory",)
bookRouter.post("/completedTran", bookController.completedTran);
// change invoice state
bookRouter.post('/change-invoice-state',bookController.changeInvoiceState)
bookRouter.post('/',bookController.bookRoom)
// id cus
bookRouter.get(
  "/bookingHistory/:id",
  bookController.queryBookingHistory
);
bookRouter.get('/:id/cancelRequest',async(req,res)=>{
    const {id}=req.params;

    try{
        let cancelRequest=await CancelRequest.find({cusID:id})
        if(cancelRequest.length>0){
            return res.status(200).json({message:'Cancel Request',data:cancelRequest});
        }
        return res.status(204).json({message:'You havent cancel any req',data:cancelRequest});
    }catch(e){
        return res.status(500).json({message:'internal e in signUp router',e})
    }
})

bookRouter.post('/bookingHistory/:invoiceID/cancel',bookController.cancelBooking)
module.exports = bookRouter;
