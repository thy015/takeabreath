
const { Invoice,Receipt} = require("../../models/invoice.model");
const { Room } = require("../../models/hotel.model");

const bookRoom = async (req, res) => {
  const {idHotel,idCus,idRoom,dataBooking} = req.body;
  try{
    if(!idHotel||!idCus||!idRoom||!dataBooking){
      return res.status(403).json({message:"Missing data"})
    }
    if(dataBooking.paymentMethod==="momo"){

    }
    if(dataBooking.paymentMethod==="paypal"){
      
    }
  }catch(e){
    console.log("[ERROR]",e)
  }
};
//logic sau khi book thanh cong
const completedTran = async (req, res) => {
  const { id } = req.params;
  try {
    const invoice = await Invoice.findById(id);
    if (!invoice) {
      return res.status(404).json({
        status: "BAD",
        message: "Invoice not found",
      });
    }
    //đổi tt biên lai => đổi tt phòng => tạo hóa đơn
    invoice.isPaid = true;
    await invoice.save();

    const foundRoom = await Room.findById(invoice.roomID);
    if (foundRoom) {
      foundRoom.isAvailable = false;
      await foundRoom.save();
    }
    const receipt = await createReceipt(invoice._id);

    res.status(200).json({
      status: "OK",
      message: "Transaction completed, room booked successfully",
    });
  } catch (e) {
    console.error("Error in completedTran:", e);
    res.status(500).json({
      status: "BAD",
      message: "Internal server error",
    });
  }
};

const getRoomsBookedCustomer = async (req, res) => {
  const cusID = req.cusID;
  if (!cusID) {
    return res.status(403).json({ message: "Missing customer ID" });
  }
  try {
    const bookedRooms = await Invoice.find({ cusID: cusID });
    const paidRoomsInvoice = bookedRooms.filter((room) => room.isPaid === true);
    const roomIDs = paidRoomsInvoice.map((invoice) => invoice.roomID);

    const paidRooms = await Room.find({ _id: roomIDs });
    const receiptID = await Receipt.find({ invoiceID: paidRoomsInvoice._id });
    if (paidRooms.length > 0) {
      return res.status(200).json({ paidRooms, bookedRooms, receiptID });
    } else {
      return res
        .status(200)
        .json({ message: "There's no room booked successfully" });
    }
  } catch (e) {
    return res.status(500).json({ message: "Error in controller", error: e });
  }
};

const getInvoicesWithReceipts = async (req, res) => {
  try {
    const receipt = await Receipt.find().populate("invoiceID");
    res.status(200).json(receipt);
  } catch (e) {
    console.error("Error fetching invoices with receipts:", e);
    res.status(500).json(e);
  }
};

module.exports = {
  bookRoom,
  getInvoicesWithReceipts,
  getRoomsBookedCustomer,
  completedTran,
};
