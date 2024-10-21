const express = require("express");
const bookController = require("./bookRoom.controller");
const bookRouter = express.Router();

bookRouter.get("/invoice", bookController.getInvoicesWithReceipts);
bookRouter.get("/invoicepaid",bookController.getInvoicesPaid);
bookRouter.get("/invoicewaiting",bookController.getInvoicesWaiting);
bookRouter.post("/completedTran", bookController.completedTran);
bookRouter.post('/',bookController.bookRoom)
bookRouter.get(
  "/bookingHistory/:cusID",
bookRouter.post("/completedTran", bookController.completedTran);
bookRouter.post('/',bookController.bookRoom)
bookRouter.get(
  "/bookingHistory",
  bookController.getRoomsBookedCustomer
);
module.exports = bookRouter;
