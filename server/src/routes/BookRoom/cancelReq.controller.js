
const { Owner } = require("../../models/signUp.model");
const { reqCancel}=require("../../models/cancelReq.model");
const reqCancelRoom = async (req, res) => {
  const { receiptID } = req.body;
  const cusID = req.cusID;
  console.log("Customer ID:", cusID);

  try {
    // Validate input
    if (!receiptID || !cusID) {
      return res
        .status(403)
        .json({ status: "BAD", message: "Missing required fields" });
    }

    // Find the receipt
    const foundReceipt = await Receipt.findOne({ _id: receiptID });
    if (!foundReceipt) {
      return res.status(404).json({
        status: "BAD",
        message: "Can't find receipt",
      });
    }

    // Create a new cancellation request
    const newReqCancelRoom = await reqCancel.create({
      dateReq: new Date(),
      cusID: cusID,
      receiptID: receiptID,
    });

    // Respond with success
    return res.status(200).json({
      status: "OK",
      message: "Request to cancel room sent to admin",
      data: newReqCancelRoom,
    });
  } catch (e) {
    console.error("Error in reqCancelRoom:", e);
    return res
      .status(500)
      .json({ message: "Internal server error", error: e.message });
  }
};
//trên fe cho click đồng ý => accept =true
//admin handle hủy phòng. ok => đổi trạng thái req, post qua app khác để hoàn tiền
//ko accept => đổi trạng thái req, trả về cho user

//handle

const handleCancelRoomAccept = async (req, res) => {
  const { reqCancelID } = req.params;
  const { orderId, transactionId } = req.body;
  const adminID = "66f2f413a8711e880bd40fbb";
  const dayAcp = new Date().toISOString(); 
  console.log(reqCancelID, adminID, orderId, transactionId,dayAcp);

  if (!adminID) {
    return res
      .status(403)
      .json({ status: "BAD", message: "Missing required fields" });
  }

  if (!mongoose.Types.ObjectId.isValid(reqCancelID)) {
    console.log("Invalid reqCancelID");
    return res
      .status(400)
      .json({ status: "BAD", message: "Invalid reqCancelID" });
  }

  try {
    const foundReqCancel = await reqCancel.findById(reqCancelID);
    if (!foundReqCancel) {
      return res
        .status(404)
        .json({ status: "BAD", message: "There's no reqCancel" });
    }

    try {
      const refundResponse = await axios.post(
        "https://api.htilssu.com/api/v1/refund",
        {
          orderId: orderId,
          transactionId: transactionId,
        },
        {
          headers: { // Corrected 'Headers' to 'headers'
            "X-Api": "c1f3fe7e4b97d023548d3aa5eaee38993c2849b2a0f5425d72df862f508cfc58",
          },
        }
      );

      console.log("Refund response:", refundResponse.data);

      if (
        refundResponse.status === 200 ||
        refundResponse.status === 201 ||
        refundResponse.status === "OK"
      ) {
        // Update cancellation request status
        foundReqCancel.isAccept = "accepted";
        foundReqCancel.adminID = adminID;
        foundReqCancel.dateAccept = new Date().toISOString(); 
        await foundReqCancel.save();

        return res.status(200).json({
          status: "OK",
          message: "Refund for customer and change status",
          data: refundResponse.data,
        });
      } else {
        return res.status(400).json({
          status: "BAD",
          message: "Refund processing failed",
          data: refundResponse.data,
        });
      }
    } catch (e) {
      console.error("Error in processing refund:", e);
      return res.status(500).json({
        status: "BAD",
        message: "Error in processing refund",
        error: e.response ? JSON.stringify(e.response.data) : e.message,
      });
    }
  } catch (e) {
    console.error("Error in handleCancelRoom:", e);
    return res.status(500).json({
      status: "BAD",
      message: "An error occurred while fetching the cancellation requests",
      error: e.message,
    });
  }
};


const handleCancelRoomReject = async (req, res) => {
  const { reqCancelID } = req.params;
  const { orderId } = req.body;
  const adminID = "66f2f413a8711e880bd40fbb";
  const dayAcp = new Date().toISOString(); 
  console.log(reqCancelID, adminID, orderId, dayAcp); 
  if (!adminID) {
    return res
      .status(403)
      .json({ status: "BAD", message: "Missing required fields" });
  }

  try {
    const foundReqCancel = await reqCancel.findById(reqCancelID);
    if (!foundReqCancel) {
      return res
        .status(404)
        .json({ status: "BAD", message: "There's no reqCancel" });
    }

    try {
      foundReqCancel.isAccept = "rejected";
      foundReqCancel.adminID = adminID; 
      foundReqCancel.dayAcp = dayAcp; 
      await foundReqCancel.save();

      return res.status(200).json({
        status: "OK",
        message: "Not refund money to customer",
        data: foundReqCancel,
      });
    } catch (e) {
      console.error("Error in processing refund where accept == false:", e);
      return res.status(500).json({
        status: "BAD",
        message: "Error in rejecting refund",
        error: e.message,
      });
    }
  } catch (e) {
    console.error("Error in handleCancelRoom:", e);
    return res.status(500).json({
      status: "BAD",
      message: "An error occurred while fetching the cancellation requests",
      error: e.message,
    });
  }
};


//get info
const getReqCancelRoomAccepted = async (req, res) => {
  try {
    const reqCancelsAccepted = await reqCancel.find({ isAccept: "accepted" });
    res.status(200).json(reqCancelsAccepted
    );
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
    const reqCancelsProcessing = await reqCancel.find({
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

module.exports = {
  reqCancelRoom,
  getReqCancelRoomProcess,
  getReqCancelRoomAccepted,
  getReqCancelRoomRejected,
  handleCancelRoomAccept,
  handleCancelRoomReject,
};
