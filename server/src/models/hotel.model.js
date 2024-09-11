//hotel,room
const mongoose = require("mongoose");
const hotelSchema = new mongoose.Schema({
  address: { type: String, required: true },
  city: { type: String, required: true },
  nation: { type: String, required: true },
  numberOfRooms: { type: Number, required: false, default: 0 },
  hotelName: { type: String, required: true },
  hotelType: { type: String, required: true },
  businessType: { type: String, required: true },
  phoneNum: { type: String, required: true },
  imgLink: { type: String, required: false },
  rate: { type: Number, required: false, default: 0 },
  numberOfRates: { type: Number, required: false, default: 0 },
  ownerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    require: true,
  },
});

const roomSchema = new mongoose.Schema({
  numberOfBeds: { type: Number, required: true },
  roomType: { type: String, required: true },
  roomName: { type: String, required: true },
  price: { type: Number, required: true },
  capacity: { type: Number, required: true },
  revenue: { type: Number, required: false, default: 0 },
  hotelID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
    required: true,
  },
  imgLink: { type: String, required: false },
});

const roomScheduleSchema = new mongoose.Schema({
  roomID: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
  checkInDay: { type: Date, required: true },
  checkOutDay: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  roomState: {
    type: String,
    enum: ["pending", "occupy"], // Allowed values
    default: "pending",
    required: false,
  },
});

const commentSchema = new mongoose.Schema({
  roomID: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
  cusID: { type: String, required: true }, //take from microfe
  ratePoint: { type: Number, enum: [1, 2, 3, 4, 5], required: true },
  content: { type: String, maxlength: 100, required: false },
});
const Hotel = mongoose.model("Hotel", hotelSchema);
const Room = mongoose.model("Room", roomSchema);
const RoomSchedule = mongoose.model("RoomSchedule", roomScheduleSchema);
const Comment = mongoose.model("Comment", commentSchema);
module.exports = {
  Hotel,
  Room,
  RoomSchedule,
  Comment,
};
