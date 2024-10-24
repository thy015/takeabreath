//hotel,room
const mongoose = require("mongoose");
const hotelSchema = new mongoose.Schema({
  hotelName: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  nation: { type: String, required: true },
  hotelType: { type: String, required: true },
  phoneNum: { type: String, required: true },
  imgLink: { type: [String], required: false },
  rate: { type: Number, required: false, default: 0 },
  numberOfRates: { type: Number, required: false, default: 0 },
  numberOfRooms: { type: Number, required: false, default: 0 },
  revenue: { type: Number, required: false, default: 0 },
  ownerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Owner",
    require: true,
  },
});

const roomSchema = new mongoose.Schema({
  roomName: { type: String, required: true },
  numberOfRooms: { type: Number, required: false, default: 0 },
  typeOfRoom: { type: String, required: true },
  capacity: { type: Number, required: true },
  numberOfBeds: { type: Number, required: true },
  money: { type: Number, required: true },
  imgLink: { type:[String], required: false },
  revenue: { type: Number, required: false, default: 0 },
  hotelID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
    required: true,
  },
  ownerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Owner",
    require: false,
  },
});

const commentSchema = new mongoose.Schema({
  ratePoint: { type: Number, enum: [1, 2, 3, 4, 5], required: true },
  content: { type: String, maxlength: 100, required: false },
  roomID: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
  cusID: { type: String, required: true }, 
  createdDay:{type:Date,default:Date.now(),required:false}
});

const Hotel = mongoose.model("Hotel", hotelSchema);
const Room = mongoose.model("Room", roomSchema);
const Comment = mongoose.model("Comment", commentSchema);
module.exports = {
  Hotel,
  Room,
  Comment,
};
