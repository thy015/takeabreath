const express = require("express");
const bookController = require("./bookRoom.controller");
const { authenCusToken } = require("../../middleware/jwt");
const bookRouter = express.Router();

bookRouter.get("/invoice", bookController.getInvoicesWithReceipts);

bookRouter.post("/:id", authenCusToken, bookController.bookRoom);
bookRouter.post("/transferCompleted/:id", bookController.completedTran);

bookRouter.get(
  "/bookingHistory",
  authenCusToken,
  bookController.getRoomsBookedCustomer
);
module.exports = bookRouter;
