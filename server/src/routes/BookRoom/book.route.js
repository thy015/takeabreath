const express = require("express");
const bookController = require("./bookRoom.controller");
const {CancelRequest} = require("../../models/cancelReq.model");
const {Invoice} = require("../../models/invoice.model");
const { verifyAdmin } = require("../../middleware/verify");
const { Room } = require("../../models/hotel.model");
const { verify } = require("jsonwebtoken");
const bookRouter = express.Router();
bookRouter.post("/applyVoucher", async (req, res) => {
  const { voucherCode, totalPrice } = req.body;

  const voucher = await SystemVoucher.findOne({ code: voucherCode });
  if (!voucher || !voucher.isValid) {
    return res.status(400).json({ isValid: false });
  }

  const discount = (voucher.discountPercent / 100) * totalPrice;
  const discountedPrice = totalPrice - discount;

  res.json({
    isValid: true,
    discountedPrice,
  });
});
bookRouter.get("/invoice",verifyAdmin, bookController.getInvoicesWithReceipts);
bookRouter.get("/invoicepaid",verifyAdmin,bookController.getInvoicesPaid);
bookRouter.get("/mostbookRoom", verifyAdmin, async (req, res) => {
  try {
    const rooms = await Room.find();
    const getMostBook = await Promise.all(
      rooms.map(async (item) => {
        let revenuee = 0; 

        const invoices = await Invoice.find({ roomID: item._id });
        const bookingnumbers = await Invoice.countDocuments({ roomID: item._id });
        invoices.map(invoice => {
          revenuee += invoice.guestInfo.totalPrice;
        });

        return { 
          ...item.toObject(), 
          books: bookingnumbers, 
          revenue: revenuee 
        };
      })
    );

    res.status(200).json({ status: true, rooms: getMostBook });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


bookRouter.get("/invoicewaiting",verifyAdmin,bookController.getInvoicesWaiting);
bookRouter.post("/completedTran", bookController.completedTran);
bookRouter.post('/',bookController.bookRoom)
bookRouter.get(
  "/bookingHistory",)
bookRouter.post("/completedTran", bookController.completedTran);
bookRouter.post("/deleteInvoiceWaiting", bookController.deleteInvoiceWaiting);
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
