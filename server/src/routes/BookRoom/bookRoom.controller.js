
const { Invoice, Receipt } = require("../../models/invoice.model");
const { Room, Hotel } = require("../../models/hotel.model");
const timezone = require('dayjs/plugin/timezone')
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const { Owner } = require("../../models/signUp.model");
const { OrderResponse, WoWoWallet } = require('@htilssu/wowo')
const axios = require("axios");
const { CancelRequest } = require("../../models/cancelReq.model");
const moment = require("moment");

dayjs.extend(timezone)
dayjs.extend(utc)

const bookRoom = async (req, res) => {
  const { idHotel, idCus, idRoom, dataBooking } = req.body;
  try {
    if (!idHotel || !idCus || !idRoom || !dataBooking) {
      return res.status(403).json({ message: "Missing data" })
    }
    const hotel = await Hotel.findById(idHotel)
    const room = await Room.findById(idRoom)
    const idOwner = hotel.ownerID
    // invoice for all
    const convertCheckInDay = dayjs(dataBooking.checkInDay).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
    const convertCheckOutDay = dayjs(dataBooking.checkOutDay).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
    console.log('Convert check in and out day', convertCheckInDay, convertCheckOutDay)
    // query room again to make sure it still available
    let findRoomInvoices = await Invoice.find({ roomID: idRoom });
    let totalRoomsBooked = dataBooking.totalRoom || 1;
    let count = 0;

    findRoomInvoices.forEach(invoice => {
      const invoiceStart = dayjs(invoice.guestInfo.checkInDay);
      const invoiceEnd = dayjs(invoice.guestInfo.checkOutDay);
      const start = dayjs(dataBooking.checkInDay);
      const end = dayjs(dataBooking.checkOutDay);

      const isOverlapping =
          dayjs(start).isBetween(invoiceStart, invoiceEnd, null, "[)") ||
          dayjs(end).isBetween(invoiceStart, invoiceEnd, null, "(]")

      if (isOverlapping) {
        count += invoice.guestInfo.totalRoom;
      }
    });

    if (count + totalRoomsBooked > room.numberOfRooms) {
      return res.status(209).json({
        message: 'Out of rooms due to unexpected booking from another guest'
      })
    }
    const invoice = await Invoice.create({
      ownerID: idOwner,
      hotelID: idHotel,
      cusID: idCus,
      roomID: idRoom,
      guestInfo:
      {
        name: dataBooking.inputName,
        idenCard: dataBooking.inputIdenCard,
        email: dataBooking.inputEmail,
        phone: dataBooking.inputPhoneNum,
        dob: dataBooking.inputDob,
        gender: dataBooking.inputGender,
        paymentMethod: dataBooking.paymentMethod,
        totalPrice: dataBooking.total,
        totalRoom: dataBooking.totalRoom,
        checkInDay: new Date(convertCheckInDay),
        checkOutDay: new Date(convertCheckOutDay)
      }
    })
    if (dataBooking.paymentMethod === 'paypal') {
      // hủy invoice sau 20p
      setTimeout(async () => {
        const updatedInvoice = await Invoice.findById(invoice._id)
        if (updatedInvoice && updatedInvoice.invoiceState === "waiting") {
          await Invoice.findByIdAndDelete(invoice._id)
          console.log(`Invoice ${invoice._id} deleted due to time out`)
        }
      }, 120000)
      // paypal
      return res.status(200).json(
        {
          status: "OK",
          message: "Invoice created successfully, waiting for payment",
          data: invoice,
          invoiceID: invoice._id
        })
    }
    else if (dataBooking.paymentMethod === "wowo") {
      console.log('log', [room.roomName, room.money, dataBooking.totalRoom, dataBooking.total])
      const updatedInvoice = await Invoice.findById(invoice._id);
      if (!updatedInvoice) {
        return res.status(404).json({ message: 'Invoice not found' });
      }
      const wowoWallet = new WoWoWallet(`${process.env.WOWO_SECRET}`);
      const newOrder = {
        money: dataBooking.total,
        serviceName: 'TAB',
        items: [
          { name: room.roomName, amount: dataBooking.totalRoom, unitPrice: room.money }
        ],
        callback: {
          successUrl: `${process.env.BE_PORT}/api/booking/change-invoice-state?invoiceID=${invoice._id}`,
          returnUrl: 'https://takeabreath.io.vn/mybooking'
        }
      }
      try {
        const orderResponse = await wowoWallet.createOrder(newOrder);
        console.log("Đơn hàng đã được tạo:", orderResponse);
        if (orderResponse.status === 'PENDING') {
          updatedInvoice.wowoOrderID=orderResponse.id;
          await updatedInvoice.save()

          return res.status(201).json({
            message: 'Created order',
            orderResponse: orderResponse
          })
        } else {
          setTimeout(async () => {
            const updatedInvoice = await Invoice.findById(invoice._id)
            if (updatedInvoice && updatedInvoice.invoiceState === "waiting") {
              await Invoice.findByIdAndDelete(invoice._id)
              console.log(`Invoice ${invoice._id} deleted due to time out`)
            }
          }, 120000)
          return res.status(401).json({ message: 'Failed create order' })
        }
      } catch (error) {
        console.error("Lỗi khi tạo đơn hàng:", error.message);
      }
    }
  } catch (e) {
    console.log("[ERROR]", e)
    return res.status(500).json({ message: "Internal server error" })
  }
};
//logic sau khi book thanh cong

const completedTran = async (req, res) => {
  const { order, invoiceID } = req.body
  if (!order || !invoiceID) {
    return res.status(403).json({ message: "Missing data" })
  }
  console.log(order, invoiceID)

  try {
    const invoice = await Invoice.findById(invoiceID);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    const roomMatch = await Room.findById(invoice.roomID);
    const hotelMatch = await Hotel.findById(invoice.hotelID)
    const invoiceMatch = await Invoice.findById(invoice)
    const directPartner = await Owner.findById(invoice.ownerID)
    if (!roomMatch || !hotelMatch || !invoiceMatch) {
      return res.status(404).json({ message: "Room not found" });
    }
    const emailData = {
      roomName: roomMatch.roomName,
      totalRoom: invoiceMatch.guestInfo.totalRoom,
      hotelLocation: `${hotelMatch.city} - ${hotelMatch.nation}`,
      totalPrice: invoice.guestInfo.totalPrice,
      checkInDay: invoice.guestInfo.checkInDay,
      checkOutDay: invoice.guestInfo.checkOutDay,
      totalStayDay: dayjs(invoice.guestInfo.checkOutDay).diff(dayjs(invoice.guestInfo.checkInDay), 'day'),
      paymentMethod: invoice.guestInfo.paymentMethod,
      name: invoice.guestInfo.name,
      email: invoice.guestInfo.email,
      phoneNum: invoice.guestInfo.phone,
      idenCard: invoice.guestInfo.idenCard,
      gender: invoice.guestInfo.gender,
      dob: invoice.guestInfo.dob
    }
    console.log(emailData)
    if (order.status === "COMPLETED") {
      if (invoice && invoice.invoiceState === "waiting") {
        invoice.invoiceState = "paid"
        await invoice.save()
        directPartner.awaitFund += invoice.guestInfo.totalPrice
        await directPartner.save()
        await axios.post(`${process.env.BE_PORT}/api/email/send-email`, emailData);
        return res.status(200).json({ message: "Payment success" })
      } else if (invoice && invoice.invoiceState === "paid") {
        return res.status(200).json({ message: "Payment already success" })
      } else {
        return res.status(404).json({ message: "Invoice not found or expired please try again" })
      }
    } //not completed payment
    else {
      return res.status(400).json({ message: "Payment failed" })
    }
  } catch (e) {
    console.log("[ERROR]", e)
    return res.status(500).json({ message: "Internal server error" })
  }
};

const changeInvoiceState = async (req, res) => {
  const { invoiceID } = req.query
  try {
    const invoice = await Invoice.findById(invoiceID);

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    const wowoWallet = new WoWoWallet(`${process.env.WOWO_SECRET}`);
    let walletNumber=await wowoWallet.getOrder(invoice.wowoOrderID)

    if (invoice.invoiceState === "waiting") {
      invoice.invoiceState = "paid";
      invoice.guestInfo.totalPrice = walletNumber.discountMoney;
      await invoice.save();
      res.cookie('completedPayment', true, { maxAge: 60000, httpOnly: false });
      return res.status(200).json({ message: "Invoice state updated to paid",completedPayment:true });
    }
    else {
      return res.status(400).json({ message: "Invoice is not in waiting state" });
    }
  } catch (e) {
    console.error("[ERROR]", e);
    return res.status(500).json({ message: "Internal server error" });
  }
}

const queryBookingHistory = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(403).json({ message: "Missing customer ID" });
  }
  try {
    let bookedRooms = await Invoice.find({ cusID: id });
    let paidRoomsInvoice = bookedRooms.filter((iv) => iv.invoiceState === 'paid');

    if (paidRoomsInvoice.length > 0) {
      let bookingInfo = await Promise.all(
        paidRoomsInvoice.map(async (invoice) => {
          let roomInfo = await Room.findById(invoice.roomID)
          let hotelInfo = await Hotel.findById(invoice.hotelID)
          let cancelInfo = await CancelRequest.find({ invoiceID: invoice._id })
          return {
            invoiceInfo: invoice,
            roomInfo: roomInfo,
            hotelInfo: hotelInfo,
            cancelInfo: cancelInfo
          }
        })
      )
     // console.log(bookingInfo)
      return res.status(200).json({
        data: bookingInfo
      });
    } else {
      return res.status(200).json({ data: bookingInfo });
    }
  } catch (e) {
    return res.status(500).json({ message: "Error in controller", error: e });
  }
};

const cancelBooking = async (req, res) => {
  const { invoiceID } = req.params
  const { countDiffDay, id } = req.body
  //cant check here, check here caused error
  try {
    // còn 1 ngày
    const dayDifference = parseInt(countDiffDay, 10);
    console.log(dayDifference)
    let invoiceMatched = await Invoice.findById(invoiceID)
    let refundCusAmount = invoiceMatched.guestInfo.totalPrice*0.7
    if (dayDifference === 0) {
      let convertDayAcp = moment().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
      let createDoneCancelRequest = await CancelRequest.create({
        isAccept: 'accepted',
        dayAcp: convertDayAcp,
        invoiceID: invoiceID,
        ownerID: invoiceMatched.ownerID,
        cusID: id,
        paymentMethod:invoiceMatched.guestInfo.paymentMethod,
        refundAmount:refundCusAmount
      })
      console.log(createDoneCancelRequest)
      return res.status(200).json({ message: 'Success cancel room', data: createDoneCancelRequest })
    }
    let createWaitingCancelRequest = await CancelRequest.create({
      invoiceID: invoiceID,
      cusID: id,
      ownerID: invoiceMatched.ownerID,
      // day counted til checkin day
      dayDiffFromCheckIn: dayDifference,
      paymentMethod:invoiceMatched.guestInfo.paymentMethod,
      refundAmount:refundCusAmount,
      wowoOrderID:invoiceMatched.wowoOrderID || 0
    })
    return res.status(200).json({ message: 'Waiting cancel room approved', data: createWaitingCancelRequest })
  } catch (e) {
    return res.status(500).json({ message: 'I server in cancel Booking controller' })
  }
}

const getInvoicesWithReceipts = async (req, res) => {
  try {
    const receipt = await Receipt.find().populate("invoiceID");
    res.status(200).json(receipt);
  } catch (e) {
    console.error("Error fetching invoices with receipts:", e);
    res.status(500).json(e);
  }
};

const getInvoicesPaid = async (req, res) => {
  try {
    const receipt = await Invoice.find({ invoiceState: "paid" }).sort({ createDay: -1 }).populate({path:"roomID",select:"roomName"}).populate({path:"cusID",select:"cusName"});;
    res.status(200).json(receipt);
  } catch (e) {
    console.error("Error fetching invoices paid:", e);
    res.status(500).json(e);
  }
};
const getInvoicesWaiting = async (req, res) => {
  try {
    const receipt = await Invoice.find({ invoiceState: "waiting" });
    res.status(200).json(receipt);
  } catch (e) {
    console.error("Error fetching invoices paid:", e);
    res.status(500).json(e);
  }
};

const deleteInvoiceWaiting = async (req, res) => {
  const { listID } = req.body
  console.log("[Delete invoiceWaiting]",listID)
  for (let invoiceID of listID) {
    const invoiceWaiting = await Invoice.findById({ _id: invoiceID })
    if (invoiceWaiting) {
      if (invoiceWaiting.invoiceState === "waiting") {
        await invoiceWaiting.deleteOne();
        console.log("XÓA WAITING")
      }
    }
  }
  return res.json({ status: true, message: "Xóa thành công" })

}

module.exports = {
  bookRoom,
  getInvoicesWithReceipts,
  queryBookingHistory,
  cancelBooking,
  completedTran,
  getInvoicesPaid,
  changeInvoiceState,
  getInvoicesWaiting,
  deleteInvoiceWaiting,
};
