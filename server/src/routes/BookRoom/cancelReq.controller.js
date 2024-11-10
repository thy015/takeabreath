

const { CancelRequest, RefundCusMoney}=require("../../models/cancelReq.model");
const { Customer, Owner} = require("../../models/signUp.model");
const {Invoice} = require("../../models/invoice.model");

const handleCancelRoomAccept=async(req,res)=>{
  //chuyển ảo
  const {cancelReqID}=req.params;
  const {adminID}=req.body
  if(!adminID){
    return res.status(403).json({message:'missing variables'})
  }
  try{

    // tim invoice, tim owner => cong tien invoice - 10% hoa hong vao await fund partner
    let cancelReq = await CancelRequest.findById(cancelReqID);
    let matchedPartner = await Owner.findById(cancelReq.ownerID);
    let matchedInvoice = await Invoice.findById(cancelReq.invoiceID);

    if (!cancelReq||!matchedPartner||!matchedInvoice) {
      return res.status(403).json({message: 'Missing variables'});
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
        message:'Succ Acp cancel room',
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
    return res.status(403).json({message:'missing variables'})
  }
  try {
    let cancelReq = await CancelRequest.findById(cancelReqID);
    if (!cancelReq) {
      return res.status(404).json({message: 'Cancellation request not found'});
    }
    cancelReq.isAccept = 'rejected';
    cancelReq.adminID = adminID
    cancelReq.rejectedReason=rejectedReason
    await cancelReq.save();
      return res.status(200).json({message:'Succ cancel req',
      cancelReq:cancelReq,
      })
  }catch(e){
    return res.status(500).json({message:'E in handleroomAcp',e})
  }

}

//get info
const getReqCancelRoomAccepted = async (req, res) => {
  try {
    const reqCancelsAccepted = await CancelRequest.find({ isAccept: "accepted" });
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
    const reqCancelsRejected = await CancelRequest.find({ isAccept: "rejected" });
    res.status(200).json( reqCancelsRejected,
    );
  } catch (e) {
    console.error("Error in getReqCancelRoomRejected:", e);
    res.status(500).json({
      message: "An error occurred while fetching the cancellation requests",
    });
  }
};
const getReqCancelRoomProcess = async (req, res) => {
  try {
    const reqCancelsProcessing = await CancelRequest.find({
      isAccept: "processing",
    });
    res.status(200).json(reqCancelsProcessing);
  } catch (e) {
    console.error("Error in getReqCancelRoomProcess:", e);
    res.status(500).json({
      message: "An error occurred while fetching the cancellation requests",
    });
  }
};
const inactiveCus = async (req, res) => {
  const cusID = req.params.id;
  const { reason } = req.body;

  const cus = await Customer.findById(cusID);
  if (!cus) {
    return res.status(404).json({ message: "Customer not found" });
  }
  if (!reason) {
    return res.status(400).json({ message: "Please provide a reason" });
  }

  try {
    cus.isActive = false;
    cus.reasonInact = reason;
    await cus.save();

    return res.status(200).json({
      status: "OK",
      message: "Inactive customer successfully",
      data: cus,
    });
  } catch (e) {
    console.error("Error in inactivating customer: ", e);
    return res.status(500).json({
      status: "BAD",
      message: "Error in inactivating customer",
      error: e.message,
    });
  }
};

// Activate customer
const activeCus = async (req, res) => {
  const cusID = req.params.id;

  const cus = await Customer.findById(cusID);
  if (!cus) {
    return res.status(404).json({ message: "Customer not found" });
  }

  try {
    cus.isActive = true;
    cus.reasonInact = "";
    await cus.save();

    return res.status(200).json({
      status: "OK",
      message: "Active customer successfully",
      data: cus,
    });
  } catch (e) {
    console.error("Error in activating customer: ", e);
    return res.status(500).json({
      status: "BAD",
      message: "Error in activating customer",
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
