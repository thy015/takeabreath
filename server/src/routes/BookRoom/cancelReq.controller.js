

const { CancelRequest, RefundCusMoney}=require("../../models/cancelReq.model");
const { Customer, Owner,Admin} = require("../../models/signUp.model");
const {Invoice} = require("../../models/invoice.model");
const mongoose=require('mongoose')
const handleCancelRoomAccept=async(req,res)=>{
  //chuyển ảo
  const {cancelReqID}=req.params;
  const {adminID}=req.body
  if(!adminID){
    return res.status(403).json({message:'Thiếu trường dữ liệu'})
  }
  try{

    // tim invoice, tim owner => cong tien invoice - 10% hoa hong vao await fund partner
    let cancelReq = await CancelRequest.findById(cancelReqID);
    let matchedPartner = await Owner.findById(cancelReq.ownerID);
    let matchedInvoice = await Invoice.findById(cancelReq.invoiceID);

    if (!cancelReq||!matchedPartner||!matchedInvoice) {
      return res.status(403).json({message: 'Thiếu trường dữ liệu'});
    }
    // hoan 70% cho cus
    let refundCusMoney=(matchedInvoice.guestInfo.totalPrice)*0.7
    cancelReq.isAccept = 'accepted';
    cancelReq.adminID = adminID
    cancelReq.refundAmount=refundCusMoney;
    await cancelReq.save();

    // tra lai 10% da lay luc cus dat
    let refundPartnerMoney = (matchedInvoice.guestInfo.totalPrice) * 0.1
      matchedPartner.awaitFund = refundPartnerMoney || 0
      await matchedPartner.save()

      return res.status(200).json({
        success:true,
        message:'Chấp nhận yêu cầu hủy thành công',
        cancelReq:cancelReq,
        matchedInvoice:matchedInvoice,
        matchedPartner:matchedPartner,
      })
  }catch(e){
    return res.status(500).json({message:'E in handleroomAcp',e})
  }
}
const handleCancelRoomReject=async(req,res)=>{
  const {cancelReqID}=req.params;
  const {adminID,rejectedReason}=req.body
  if(!adminID||!rejectedReason){
    return res.status(403).json({message:'Thiếu dữ liệu'})
  }
  try {
    let cancelReq = await CancelRequest.findById(cancelReqID);
    if (!cancelReq) {
      return res.status(404).json({message: 'Không tìm thấy yêu cầu hủy phòng'});
    }
    cancelReq.isAccept = 'rejected';
    cancelReq.adminID = adminID
    cancelReq.rejectedReason=rejectedReason
    await cancelReq.save();
      return res.status(200).json({success:true,message:'Từ chối yêu cầu hủy phòng thành công',
      cancelReq:cancelReq,
      })
  }catch(e){
    return res.status(500).json({message:'E in handleroomAcp',e})
  }

}

//get info
const getReqCancelRoomAccepted = async (req, res) => {
  try {
    const reqCancelsAccepted = await CancelRequest.find({ isAccept: "accepted" }).populate({
      path: 'invoiceID',
      select: 'guestInfo.name guestInfo.idenCard guestInfo.email guestInfo.phone guestInfo.checkInDay guestInfo.checkOutDay totalPrice totalRoom',
    }).populate({
      path:'adminID',
      select:"adminName"
    }).sort({dayReq:-1});
    return res.status(200).json(reqCancelsAccepted);
  } catch (e) {
    console.error("Error in getReqCancelRoomAccepted:", e);
    return res.status(500).json({
      message: "An error occurred while fetching the cancellation requests",
    });
  }
};

const getReqCancelRoomRejected = async (req, res) => {
  try {
    const reqCancelsRejected = await CancelRequest.find({ isAccept: "rejected" }).populate({
      path: 'invoiceID',
      select: 'guestInfo.name guestInfo.idenCard guestInfo.email guestInfo.phone guestInfo.checkInDay guestInfo.checkOutDay totalPrice totalRoom',
    }).populate({
      path:'adminID',
      select:"adminName"
    }).sort({dayReq:-1});;
  
    return res.status(200).json(reqCancelsRejected);
  } catch (e) {
    console.error("Error in getReqCancelRoomRejected:", e);
    return res.status(500).json({
      message: "An error occurred while fetching the cancellation requests",
    });
  }
};

const getReqCancelRoomProcess = async (req, res) => {
  try {
    const reqCancelsProcessing = await CancelRequest.find({ isAccept: "processing" }).populate({
      path: 'invoiceID',
      select: 'guestInfo.name guestInfo.idenCard guestInfo.email guestInfo.phone guestInfo.checkInDay guestInfo.checkOutDay totalPrice totalRoom',
    }).sort({dayReq:-1});
    return res.status(200).json(reqCancelsProcessing);
  } catch (e) {
    console.error("Error in getReqCancelRoomProcess:", e);
    return res.status(500).json({
      message: "An error occurred while fetching the cancellation requests",
    });
  }
};

const inactiveCus = async (req, res) => {
  const cusID = req.params.id;
  const { reason } = req.body;

  const cus = await Customer.findById(cusID);
  if (!cus) {
    return res.status(404).json({ message: "Không tìm thấy khách hàng" });
  }
  if (!reason) {
    return res.status(400).json({ message: "Vui lòng nhập lí do" });
  }

  try {
    cus.isActive = false;
    cus.reasonInact = reason;
    await cus.save();

    return res.status(200).json({
      status: "OK",
      message: "Vô hiệu hóa khách hàng thành công",
      data: cus,
    });
  } catch (e) {
    console.error("Error in inactivating customer: ", e);
    return res.status(500).json({
      status: "BAD",
      message: "Gặp lỗi trong quá trình vô hiệu hóa khách hàng",
      error: e.message,
    });
  }
};

const activeCus = async (req, res) => {
  const cusID = req.params.id;

  const cus = await Customer.findById(cusID);
  if (!cus) {
    return res.status(404).json({ message: "Không tìm thấy khách hàng" });
  }

  try {
    cus.isActive = true;
    cus.reasonInact = "";
    await cus.save();

    return res.status(200).json({
      status: "OK",
      message: "Kích hoạt khách hàng thành công",
      data: cus,
    });
  } catch (e) {
    console.error("Error in activating customer: ", e);
    return res.status(500).json({
      status: "BAD",
      message: "Gặp lỗi trong quá trình kích hoạt tài khoản khách hàng",
      error: e.message,
    });
  }
};

module.exports = {
  getReqCancelRoomProcess,
  getReqCancelRoomAccepted,
  getReqCancelRoomRejected,
  handleCancelRoomAccept,
  handleCancelRoomReject,
  inactiveCus,
  activeCus,
};
