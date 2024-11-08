const express = require("express");
const bookController = require("./bookRoom.controller");
const {CancelRequest} = require("../../models/cancelReq.model");
const {Invoice} = require("../../models/invoice.model");
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

bookRouter.post('/bookingHistory/:invoiceID/cancel',bookController.cancelBooking)
module.exports = bookRouter;
