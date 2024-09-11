const services = require("../../services/services");
const { reqCancel } = require("../../models/cancelReq.model");
const reqCancelRoom = async (req, res) => {
  const { receiptID } = req.body;
  const cusID = req.cusID;
  console.log(cusID);
  try {
    if (!receiptID || !cusID) {
      return res
        .status(403)
        .json({ status: "BAD", message: "Missing required fields" });
    }
    const result = await services.reqCancelRoom(receiptID, cusID);
    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "in controller" });
  }
};
const getReqCancelRoomAccepted = async (req, res) => {
  try {
    const reqCancelsAccepted = await reqCancel.find({ isAccept: "accepted" });
    res.status(200).json({
      status: "OK",
      data: reqCancelsAccepted,
    });
  } catch (e) {
    console.error("Error in getReqCancelRoomAccepted:", e);
    res.status(500).json({
      message: "An error occurred while fetching the cancellation requests",
    });
  }
};
const getReqCancelRoomRejected = async (req, res) => {
  try {
    const reqCancelsRejected = await reqCancel.find({ isAccept: "rejected" });
    res.status(200).json({
      status: "OK",
      data: reqCancelsRejected,
    });
  } catch (e) {
    console.error("Error in getReqCancelRoomRejected:", e);
    res.status(500).json({
      message: "An error occurred while fetching the cancellation requests",
    });
  }
};
const getReqCancelRoomProcess = async (req, res) => {
  try {
    const reqCancelsProcessing = await reqCancel.find({
      isAccept: "processing",
    });
    res.status(200).json({
      status: "OK",
      data: reqCancelsProcessing,
    });
  } catch (e) {
    console.error("Error in getReqCancelRoomProcess:", e);
    res.status(500).json({
      message: "An error occurred while fetching the cancellation requests",
    });
  }
};

module.exports = {
  reqCancelRoom,
  getReqCancelRoomProcess,
  getReqCancelRoomAccepted,
  getReqCancelRoomRejected,
};
