const Account = require("../models/signUp.model");
const Hotel = require("../models/hotel.model");
const dotenv = require("dotenv");
dotenv.config();
const axios = require("axios");
const { generalAccessTokens, refreshAccessTokens } = require("./jwt");
const { Invoice, Receipt } = require("../models/invoice.model");
const { reqCancel, refundMoney } = require("../models/reqCancel.model");
const mongoose = require("mongoose");

async function signUpOwner(newOwner) {
  return new Promise(async (resolve, rejects) => {
    const {
      name,
      passWord,
      email,
      birthDate,
      phoneNum,
      address,
      dueDatePCCC,
      dueDateKD,
    } = newOwner;
    try {
      const checkAccountExisted = await Account.Account.findOne({
        email: email,
      });
      const isAdmin = await Account.Admin.findOne({
        email: email,
      });
      if (checkAccountExisted !== null || isAdmin != null) {
        rejects({
          status: "BAD",
          message: "Email existed",
        });
      }
      const createdOwner = await Account.Account.create({
        name,
        passWord,
        email,
        birthDate,
        phoneNum,
        address,
        dueDatePCCC,
        dueDateKD,
      });
      if (createdOwner) {
        resolve({
          status: "OK",
          message: "Succ",
          data: createdOwner,
        });
      }
    } catch (e) {
      rejects(e);
    }
  });
}
//chung của owner và admin
async function signInOwner(existedOwner) {
  return new Promise(async (resolve, reject) => {
    const { email, passWord } = existedOwner;
    try {
      const foundOwner = await Account.Account.findOne({ email: email });

      if (foundOwner) {
        if (foundOwner.passWord !== passWord) {
          return resolve({
            status: "BAD",
            message: "Wrong password",
          });
        }
        const access_token = await generalAccessTokens({
          id: foundOwner._id,
          isUse: foundOwner.isUse,
        });
        const refresh_token = await refreshAccessTokens({
          id: foundOwner._id,
          isUse: foundOwner.isUse,
        });

        return resolve({
          status: "OK",
          message: "Success log in",
          access_token: access_token,
          // refresh_token: refresh_token,
          ownerID: foundOwner._id,
          isUse: "Owner",
          //owner đi vào trang chủ
          redirect: "/",
        });
      } else {
        const foundAdmin = await Account.Admin.findOne({
          email: email,
          passWord: passWord,
        });

        if (foundAdmin) {
          const access_token = await generalAccessTokens({
            id: foundAdmin._id,
            isUse: foundAdmin.isUse,
          });

          return resolve({
            status: "OK",
            message: "Admin logged in",
            access_token,
            isUse: "Admin",
            //admin đi vào dashboard admin
            redirect: "/Admin",
          });
          //ko tìm thấy admin
        } else {
          return reject({
            status: 404,
            message: "You haven’t registered yet",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
}

//đẩy qua bên khác
async function signInCustomer(existedCustomer) {
  return new Promise(async (resolve, rejects) => {
    const { username, password } = existedCustomer;
    try {
      //bên fe post thẳng vào luồng này của be
      const response = await axios.post(
        "https://api.htilssu.com/api/v1/auth/login",
        {
          username: username,
          password: password,
        }
      );
      if (response.status === 200) {
        const access_token = await generalAccessTokens({
          id: response.data.user.id,
          isUse: "customer",
        });
        resolve({
          status: "OK",
          message: "Successfully signed in as cus",
          userID: response.data.user.id,
          access_token: access_token,
        });
      } else {
        resolve({
          status: "BAD",
          message: "Third-party service auth failed",
        });
      }
    } catch (e) {
      console.log(e);
      rejects(e);
    }
  });
}

//truyền qua token của cus tạo từ signInCus, roomID nhập tay
async function bookRoom(newInvoice, cusID, roomID) {
  return new Promise(async (resolve, reject) => {
    const { paymentMethod } = newInvoice;
    try {
      console.log(`Customer ID extracted from token: ${cusID}`);

      const foundRoom = await Hotel.Room.findById(roomID);
      if (!foundRoom) {
        return reject({
          status: "BAD",
          message: "Room not found",
        });
      }

      const fromHotel = await Hotel.Hotel.find({ _id: foundRoom.hotelID });
      const hotelName = fromHotel.companyName;

      if (!foundRoom.isAvailable) {
        return reject({
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
        resolve({
          status: "OK",
          message: "choose voucher succ",
          data: voucherResponse.data,
          orderID: voucherResponse.data.partNerRequest.OrderID,
        });

        setTimeout(async () => {
          const foundInvoice = await Invoice.findById(invoice._id);
          if (foundInvoice && !foundInvoice.isPaid) {
            await Invoice.findByIdAndDelete(foundInvoice._id);
            console.log(
              `Deleted invoice ${foundInvoice._id} due to overtime process, failed book room`
            );
          }
        }, 1200000); // 20 minutes
      } else {
        reject({
          status: "BAD",
          message: "3rd choose voucher failed",
        });
      }
    } catch (e) {
      console.error("Error in bookRoom:", e);
      reject({
        status: "ERROR",
        message: "Error booking room",
        error: e.message,
      });
    }
  });
}
//k can controller
async function completedTran(req, res) {
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
}
//xuất hóa đơn khi thanh toán thành công
async function createReceipt(invoiceID) {
  try {
    const receipt = await Receipt.create({
      invoiceID,
      createDate: new Date(),
    });
    return receipt;
  } catch (e) {
    console.error("Error in createReceipt:", e);
  }
}

//cus yêu cầu được hủy phòng, gửi đến admin. Dùng id cus, id hóa đơn
async function reqCancelRoom(receiptID, cusID) {
  return new Promise(async (resolve, reject) => {
    try {
      const foundReceipt = await Receipt.findOne({
        _id: receiptID,
      });
      if (!foundReceipt) {
        reject({
          status: "BAD",
          message: "Cant find receipt - promise",
        });
      }
      const newReqCancelRoom = await reqCancel.create({
        dateReq: new Date(),
        cusID: cusID,
        receiptID: receiptID,
      });
      resolve({
        status: "OK",
        message: "Request cancel room sent to admin",
        data: newReqCancelRoom,
      });
    } catch (e) {
      console.error("Error in reqCancelRoom - promise:", e);
      reject(e + `rejects in promise`);
    }
  });
}
//trên fe cho click đồng ý => accept =true
//admin handle hủy phòng. ok => đổi trạng thái req, post qua app khác để hoàn tiền
//ko accept => đổi trạng thái req, trả về cho user

const handleCancelRoomAccept = async (req, res) => {
  const { reqCancelID } = req.params;
  const { orderId, transactionId } = req.body;
  const adminID = req.adminID;

  console.log(reqCancelID, adminID, orderId, transactionId);

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
          Headers: {
            "X-Api":
              "c1f3fe7e4b97d023548d3aa5eaee38993c2849b2a0f5425d72df862f508cfc58",
          },
        }
      );

      console.log("Refund response:", refundResponse.data);

      if (
        refundResponse.status === 200 ||
        refundResponse.status === 201 ||
        refundResponse.status === "OK"
      ) {
        // Cập nhật trạng thái yêu cầu hủy phòng
        foundReqCancel.isAccept = "accepted";
        foundReqCancel.adminID = adminID;
        foundReqCancel.dateAccept = new Date();
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
  const adminID = req.adminID;

  console.log(reqCancelID, adminID, orderId);

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
//truyền token
function createHotel(newHotel, ownerID) {
  return new Promise(async (resolve, rejects) => {
    const {
      address,
      taxCode,
      hotelName,
      nation,
      facilityName,
      businessType,
      scale,
      city,
      hotelPhone,
      hotelImg,
    } = newHotel;

    try {
      const checkExistedOwnerID = await Account.Account.findOne({
        _id: ownerID,
      });
      if (!checkExistedOwnerID) {
        return rejects({
          status: "BAD",
          message: "Owner ID does not exist",
        });
      }

      const createdHotel = await Hotel.Hotel.create({
        address,
        taxCode,
        nation,
        hotelName,
        facilityName,
        businessType,
        scale,
        city,
        hotelPhone,
        hotelImg,
        ownerID,
      });

      if (createdHotel) {
        resolve({
          status: "OK",
          message: "Hotel created successfully",
          data: createdHotel,
        });
      }
    } catch (e) {
      rejects(e);
    }
  });
}

const createRoom = async (newRoom, hotelID) => {
  return new Promise(async (resolve, reject) => {
    const { numberOfBeds, typeOfRoom, money, capacity, roomImages } = newRoom;
    try {
      const createdRoom = await Hotel.Room.create({
        numberOfBeds,
        typeOfRoom,
        money,
        capacity,
        hotelID,
        roomImages,
      });

      if (createdRoom) {
        const hotel = await Hotel.Hotel.findById(hotelID);
        if (hotel) {
          if (hotel.minPrice === 0 || hotel.minPrice > money) {
            hotel.minPrice = money;
            await hotel.save();
          }
          hotel.numberOfRooms = hotel.numberOfRooms + 1;
          await hotel.save();
        }
        resolve({
          status: "OK",
          message: "Room created successfully",
          data: createdRoom,
        });
      }
    } catch (e) {
      console.error("Error in createRoom service:", e);
      reject(e);
    }
  });
};

//chỉ cần truyền token

const searchHotel = async (req, res) => {
  const { city } = req.query;
  try {
    const hotelsInCity = await Hotel.Hotel.find({ city });

    const availableHotels = await Promise.all(
      hotelsInCity.map(async (hotel) => {
        const availableRooms = await Hotel.Room.find({
          hotel: hotel._id,
        });
        if (availableRooms.length > 0) {
          return {
            ...hotel._doc,
            rooms: availableRooms,
          };
        } else {
          return null;
        }
      })
    );

    const filteredHotels = availableHotels.filter((hotel) => hotel !== null);

    return res.status(200).json({
      status: "OK",
      message: "Find Hotel successfully",
      data: filteredHotels,
    });
  } catch (e) {
    console.error("Error searching for hotels:", e);
    return res.status(500).json({
      status: "Error",
      message: "There was an error searching for hotels.",
      error: e.message,
    });
  }
};

module.exports = {
  signUpOwner,
  createHotel,
  signInOwner,
  signInCustomer,
  createRoom,
  bookRoom,
  searchHotel,
  reqCancelRoom,
  handleCancelRoomAccept,
  completedTran,
  handleCancelRoomReject,
};
