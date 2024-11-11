const express = require("express");
const bookController = require("./bookRoom.controller");
const {CancelRequest} = require("../../models/cancelReq.model");
const {Invoice} = require("../../models/invoice.model");
const { verifyAdmin } = require("../../middleware/verify");
const bookRouter = express.Router();

bookRouter.get("/invoice",verifyAdmin, bookController.getInvoicesWithReceipts);
bookRouter.get("/invoicepaid",verifyAdmin,bookController.getInvoicesPaid);
bookRouter.get("/invoicewaiting",verifyAdmin,bookController.getInvoicesWaiting);
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

bookRouter.post('/bookingHistory/:invoiceID/cancel',bookController.cancelBooking)
module.exports = bookRouter;
