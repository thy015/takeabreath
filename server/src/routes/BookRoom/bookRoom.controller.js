
const { Invoice, Receipt } = require("../../models/invoice.model");
const { Hotel, Room } = require("../../models/hotel.model");

const bookRoom = async (req, res) => {
  const { roomID, paymentMethod } = req.body;
  const cusID = req.cusID;

  console.log("Request body:", req.body);
  console.log("Customer ID:", cusID);

  // Validate input
  if (!roomID || !paymentMethod || !cusID) {
    console.error("Missing required fields:", { roomID, paymentMethod, cusID });
    return res.status(403).json({ message: "Missing required fields" });
  }

  try {
    console.log(`Customer ID extracted from token: ${cusID}`);

    const foundRoom = await Hotel.Room.findById(roomID);
    if (!foundRoom) {
      return res.status(404).json({
        status: "BAD",
        message: "Room not found",
      });
    }

    const fromHotel = await Hotel.Hotel.findById(foundRoom.hotelID);
    const hotelName = fromHotel.companyName;

    if (!foundRoom.isAvailable) {
      return res.status(400).json({
        status: "BAD",
        message: "Room is booked",
      });
    }

    const roomPrice = foundRoom.money;
    const total = roomPrice + roomPrice * 0.08; // VAT

    const invoice = await Invoice.create({
      cusID,
      roomID,
      total,
      paymentMethod,
    });

    const voucherResponse = await axios.post(
      "https://voucher-server-alpha.vercel.app/api/vouchers/createPartNerRequest",
      {
        OrderID: invoice._id,
        TotalMoney: total,
        PartnerID: "1000000005",
        ServiceName: `Book room`,
        CustomerCode: invoice.cusID,
        Description: `Book ${foundRoom.typeOfRoom} from ${hotelName}`,
        LinkHome: "https://mern-tab-be.vercel.app/",
        LinkReturnSuccess: `https://mern-tab-be.vercel.app/book/completedTran/${invoice._id}`,
      }
    );

    if (voucherResponse.status === 200 || voucherResponse.status === "OK") {
      const responseData = {
        status: "OK",
        message: "Choose voucher success",
        data: voucherResponse.data,
        orderID: voucherResponse.data.partNerRequest.OrderID,
      };

      // Set a timeout to delete the invoice if not paid
      setTimeout(async () => {
        const foundInvoice = await Invoice.findById(invoice._id);
        if (foundInvoice && !foundInvoice.isPaid) {
          await Invoice.findByIdAndDelete(foundInvoice._id);
          console.log(
            `Deleted invoice ${foundInvoice._id} due to overtime process, failed book room`
          );
        }
      }, 1200000); // 20 minutes

      return res.status(200).json(responseData);
    } else {
      return res.status(500).json({
        status: "BAD",
        message: "3rd choose voucher failed",
      });
    }
  } catch (e) {
    console.error("Error in bookRoom:", e);
    return res.status(500).json({
      status: "ERROR",
      message: "Error booking room",
      error: e.message,
    });
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

    const foundRoom = await Hotel.Room.findById(invoice.roomID);
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
