const express = require("express");
const bookController = require("./bookRoom.controller");
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
bookRouter.post('/change-invoice-state',async(req,res)=>{
    const {invoiceID}=req.query
    try {
        const invoice = await Invoice.findById(invoiceID);

        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }

        if (invoice.invoiceState === "waiting") {
            invoice.invoiceState = "paid";
            await invoice.save();
            return res.status(200).json({ message: "Invoice state updated to paid" });
        } else {
            return res.status(400).json({ message: "Invoice is not in waiting state" });
        }
    } catch (e) {
        console.error("[ERROR]", e);
        return res.status(500).json({ message: "Internal server error" });
    }
})
bookRouter.post('/',bookController.bookRoom)
bookRouter.get(
  "/bookingHistory/:id",
  bookController.queryBookingHistory
);
module.exports = bookRouter;
