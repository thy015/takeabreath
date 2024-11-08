

const { CancelRequest}=require("../../models/cancelReq.model");
const { Customer } = require("../../models/signUp.model");

const handleCancelRoomAccept=async(req,res)=>{
  const {cancelReqID,adminID}=req.params;

}
const handleCancelRoomReject=async(req,res)=>{

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
