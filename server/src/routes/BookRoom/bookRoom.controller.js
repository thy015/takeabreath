
const { Invoice,Receipt} = require("../../models/invoice.model");
const { Room } = require("../../models/hotel.model");

const bookRoom = async (req, res) => {
  const {idHotel,idCus,idRoom,dataBooking} = req.body;
  try{
    if(!idHotel||!idCus||!idRoom||!dataBooking){
      return res.status(403).json({message:"Missing data"})
    }
    if(dataBooking.paymentMethod==="paypal"){
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
            checkInDay:dataBooking.checkInDay,
            checkOutDay:dataBooking.checkOutDay
          }
      })
      setTimeout(async()=>{
        const updatedInvoice=await Invoice.findById(invoice._id)
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
  const roomMatch=await Room({_id:invoiceID})
  try{
    if(order.status==="COMPLETED"){
      const invoice=await Invoice.findById(invoiceID)
      if(invoice && invoice.invoiceState==="waiting"){
        invoice.invoiceState="paid"
        roomMatch=roomMatch-1
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
