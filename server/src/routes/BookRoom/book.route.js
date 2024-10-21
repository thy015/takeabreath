const express = require("express");
const bookController = require("./bookRoom.controller");
const bookRouter = express.Router();

bookRouter.get("/invoice", bookController.getInvoicesWithReceipts);

bookRouter.post("/completedTran", bookController.completedTran);
bookRouter.post('/',bookController.bookRoom)
bookRouter.get(
  "/bookingHistory",
  bookController.getRoomsBookedCustomer
);
module.exports = bookRouter;
