
const { Invoice,Receipt} = require("../../models/invoice.model");
const { Room } = require("../../models/hotel.model");
const timezone =require('dayjs/plugin/timezone')
const dayjs=require('dayjs')
const utc=require('dayjs/plugin/utc')
dayjs.extend(timezone)
dayjs.extend(utc)

const bookRoom = async (req, res) => {
  const {idHotel,idCus,idRoom,dataBooking} = req.body;
  try{
    if(!idHotel||!idCus||!idRoom||!dataBooking){
      return res.status(403).json({message:"Missing data"})
    }
    if(dataBooking.paymentMethod==="paypal"){
      const convertCheckInDay = dayjs(dataBooking.checkInDay).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
      const convertCheckOutDay=dayjs(dataBooking.checkOutDay).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
      console.log('Convert check in and out day',convertCheckInDay,convertCheckOutDay)
      const invoice = await Invoice.create({
        hotelID:idHotel,
        cusID:idCus,
        roomID:idRoom,
        guestInfo:
          {
            name:dataBooking.inputName,
            idenCard:dataBooking.inputIdenCard,
            email:dataBooking.inputEmail,
            phone:dataBooking.inputPhoneNum,
            dob:dataBooking.inputDob,
            gender:dataBooking.inputGender,
            paymentMethod:dataBooking.paymentMethod,
            totalPrice:dataBooking.total,
            totalRoom:dataBooking.totalRoom,
            checkInDay:new Date(convertCheckInDay),
            checkOutDay:new Date(convertCheckOutDay)
          }
      })
      setTimeout(async()=>{
        const updatedInvoice= await Invoice.findById(invoice._id)
        if(updatedInvoice && updatedInvoice.invoiceState==="waiting"){
          await Invoice.findByIdAndDelete(invoice._id)
          console.log(`Invoice ${invoice._id} deleted due to time out`)
        }
      },120000)
      return res.status(200).json(
        {
          status:"OK",
          message:"Invoice created successfully, waiting for payment",
          data:invoice,
          invoiceID:invoice._id
        }) 
    }
  }catch(e){
    console.log("[ERROR]",e)
    return res.status(500).json({message:"Internal server error"})
  }
};
//logic sau khi book thanh cong
const completedTran = async (req, res) => {
  const {order,invoiceID}=req.body
  if(!order||!invoiceID){
    return res.status(403).json({message:"Missing data"})
  }
  console.log(order,invoiceID)
 
  try{
    const invoice = await Invoice.findById(invoiceID);
    if (!invoice) {
      return res.status(404).json({message: "Invoice not found"});
    }
    const roomMatch = await Room.findById(invoice.roomID);
    if (!roomMatch) {
      return res.status(404).json({message: "Room not found"});
    } 
    if(order.status==="COMPLETED"){
      if(invoice && invoice.invoiceState==="waiting"){
        invoice.invoiceState="paid"
        await invoice.save()
        return res.status(200).json({message:"Payment success"})
      } else if(invoice && invoice.invoiceState==="paid"){
        return res.status(200).json({message:"Payment already success"})
      } else {
        return res.status(404).json({message:"Invoice not found or expired please try again"})
      }
    } //not completed payment
    else{
      return res.status(403).json({message:"Payment failed"})
    }
  }catch(e){
    console.log("[ERROR]",e)
    return res.status(500).json({message:"Internal server error"})
  }
};

const getRoomsBookedCustomer = async (req, res) => {
  const cusID = req.params.cusID; // Extract cusID from req.params
  if (!cusID) {
    return res.status(403).json({ message: "Missing customer ID" });
  }
  try {
    const bookedRooms = await Invoice.find({ cusID: cusID });
    const paidRoomsInvoice = bookedRooms.filter((room) => room.isPaid === true);
    const roomIDs = paidRoomsInvoice.map((invoice) => invoice.roomID);

    const paidRooms = await Room.find({ _id: { $in: roomIDs } });
    const receiptIDs = await Receipt.find({ invoiceID: { $in: paidRoomsInvoice.map(inv => inv._id) } });

    if (paidRooms.length > 0) {
      return res.status(200).json({ paidRooms, bookedRooms, receiptIDs });
    } else {
      return res.status(200).json({ message: "There's no room booked successfully" });
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

const getInvoicesPaid = async (req, res) => {
  try {
    const receipt = await Invoice.find({invoiceState:"paid"});
    res.status(200).json(receipt);
  } catch (e) {
    console.error("Error fetching invoices paid:", e);
    res.status(500).json(e);
  }
};
const getInvoicesWaiting = async (req, res) => {
  try {
    const receipt = await Invoice.find({invoiceState:"waiting"});
    res.status(200).json(receipt);
  } catch (e) {
    console.error("Error fetching invoices paid:", e);
    res.status(500).json(e);
  }
};
module.exports = {
  bookRoom,
  getInvoicesWithReceipts,
  getRoomsBookedCustomer,
  completedTran,
  getInvoicesPaid,
  getInvoicesWaiting
};
