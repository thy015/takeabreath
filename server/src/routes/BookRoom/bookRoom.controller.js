
const { Invoice,Receipt} = require("../../models/invoice.model");
const { Room, Hotel} = require("../../models/hotel.model");
const timezone =require('dayjs/plugin/timezone')
const dayjs=require('dayjs')
const utc=require('dayjs/plugin/utc')
const {Owner} = require("../../models/signUp.model");
const {OrderResponse, WoWoWallet}=require('@htilssu/wowo')
const axios = require("axios");

dayjs.extend(timezone)
dayjs.extend(utc)

const bookRoom = async (req, res) => {
  const {idHotel,idCus,idRoom,dataBooking} = req.body;
  try{
    if(!idHotel||!idCus||!idRoom||!dataBooking){
      return res.status(403).json({message:"Missing data"})
    }
    const hotel =await Hotel.findById(idHotel)
    const room=await Room.findById(idRoom)
    const idOwner=hotel.ownerID
      // invoice for all
      const convertCheckInDay = dayjs(dataBooking.checkInDay).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
      const convertCheckOutDay=dayjs(dataBooking.checkOutDay).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
      console.log('Convert check in and out day',convertCheckInDay,convertCheckOutDay)
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
          if(dataBooking.paymentMethod==="wowo"){
            console.log('log', [room.roomName,room.money,dataBooking.totalRoom,dataBooking.total])

            const wowoWallet=new WoWoWallet(`${process.env.WOWO_SECRET}`);
            const newOrder={
              money:dataBooking.total,
              serviceName:'Đặt phòng',
              items:[
                {name:room.roomName,amount:dataBooking.totalRoom, unitPrice:room.money}
              ],
              callback:{
                successUrl: `http://localhost:4000/api/booking/change-invoice-state?invoiceID=${invoice._id}`,
                returnUrl: 'http://localhost:3000/mybooking'
              }
            }
            try {
              const orderResponse = await wowoWallet.createOrder(newOrder);
              console.log("Đơn hàng đã được tạo:", orderResponse);
              if(orderResponse.status==='PENDING'){

              }
            } catch (error) {
              console.error("Lỗi khi tạo đơn hàng:", error.message);
            }
          }
      // hủy invoice sau 20p
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
    const hotelMatch=await Hotel.findById(invoice.hotelID)
    const invoiceMatch=await Invoice.findById(invoice)
    const directPartner=await Owner.findById(invoice.ownerID)
    if (!roomMatch ||!hotelMatch||!invoiceMatch) {
      return res.status(404).json({message: "Room not found"});
    }
    const emailData={
      roomName:roomMatch.roomName,
      totalRoom:invoiceMatch.guestInfo.totalRoom,
      hotelLocation:`${hotelMatch.city} - ${hotelMatch.nation}`,
      totalPrice:invoice.guestInfo.totalPrice,
      checkInDay: invoice.guestInfo.checkInDay,
      checkOutDay: invoice.guestInfo.checkOutDay,
      totalStayDay:dayjs(invoice.guestInfo.checkOutDay).diff(dayjs(invoice.guestInfo.checkInDay),'day'),
      paymentMethod:invoice.guestInfo.paymentMethod,
      name:invoice.guestInfo.name,
      email:invoice.guestInfo.email,
      phoneNum:invoice.guestInfo.phone,
      idenCard:invoice.guestInfo.idenCard,
      gender:invoice.guestInfo.gender,
      dob:invoice.guestInfo.dob
    }
    console.log(emailData)
    if(order.status==="COMPLETED"){
      if(invoice && invoice.invoiceState==="waiting"){
        invoice.invoiceState="paid"
        await invoice.save()
        directPartner.awaitFund += invoice.guestInfo.totalPrice
        await directPartner.save()
        await axios.post('http://localhost:4000/api/email/send-email', emailData);
        return res.status(200).json({message:"Payment success"})
      } else if(invoice && invoice.invoiceState==="paid"){
        return res.status(200).json({message:"Payment already success"})
      } else {
        return res.status(404).json({message:"Invoice not found or expired please try again"})
      }
    } //not completed payment
    else{
      return res.status(400).json({message:"Payment failed"})
    }
  }catch(e){
    console.log("[ERROR]",e)
    return res.status(500).json({message:"Internal server error"})
  }
};

const queryBookingHistory = async (req, res) => {
  const id = req.params.id; // Extract cusID from req.params
  if (!id) {
    return res.status(403).json({ message: "Missing customer ID" });
  }
  try {
    const bookedRooms = await Invoice.find({ cusID: id });
    let paidRoomsInvoice=[]
    paidRoomsInvoice = bookedRooms.filter((iv) => iv.invoiceState === 'paid');
    if (paidRoomsInvoice.length > 0) {
      const bookingInfo=await Promise.all(
          paidRoomsInvoice.map(async(invoice)=>{
            const roomInfo=await Room.findById(invoice.roomID)
            const hotelInfo=await Hotel.findById(invoice.hotelID)
            return{
              invoiceInfo:invoice,
              roomInfo:roomInfo,
              hotelInfo:hotelInfo
            }
          })
      )
      return res.status(200).json({
        data:bookingInfo
      });
    } else {
      return res.status(200).json({data:bookingInfo});
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
  queryBookingHistory,
  completedTran,
  getInvoicesPaid,
  getInvoicesWaiting
};
