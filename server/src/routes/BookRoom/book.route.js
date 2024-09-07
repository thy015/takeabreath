const express = require("express");
const bookController = require("./bookRoom.controller");
const { authenCusToken } = require("../../services/jwt");
const bookRouter = express.Router();
const services = require("../../services/services");
bookRouter.get("/invoice", bookController.getInvoicesWithReceipts);

bookRouter.post("/", authenCusToken, bookController.bookRoom);
bookRouter.post("/transferCompleted/:id", services.completedTran);

bookRouter.get(
  "/bookingHistory",
  authenCusToken,
  bookController.getRoomsBookedCustomer
);
module.exports = bookRouter;
