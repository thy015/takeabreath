//hotel,room
const mongoose = require("mongoose");
// amenities for hotel
const amenitiesEnum = {
  view: ['Beach View', 'Forest View', 'City View', 'Mountain View', 'Pool View', 'Skyline View', 'Garden View'],
  bathroom: ['Bathtub', 'Hair dryer', 'Shower gel', 'Hot water'],
  bedroom: ['Free dryer', 'Hangers', 'Extra pillows and blankets', 'Iron', 'Essentials', 'Crib'],
  entertainment: ['HDTV 50 inch', 'Sound system', 'Exercise equipment', 'Wifi'],
  heatingAndCooling: ['Air conditioning', 'Indoor fireplace', 'Portable fans', 'Heating', 'Central heating', 'Central air conditioning'],
  safety: ['Smoke alarm', 'Fire extinguisher', 'Carbon monoxide alarm', 'First aid kit', 'Exterior security cameras on property'],
  dining: ['Kitchen', 'Refrigerator', 'Microwave', 'Cooking basics', 'Freezer', 'Dishwasher', 'Stove', 'Toaster', 'Oven', 'Rice maker', 'Dining table', 'Hot water kettle'],
  location: ['Near centre', 'In centre', 'Private entrance', 'Crowd', 'Downtown access', 'Near public transportation', 'Shopping district', 'Historic district'],
  outdoor: ['Private pool', 'Shared pool', 'Private patio or balcony', 'Patio or balcony', 'Sun loungers', 'Outdoor dining area', 'Shared backyard', 'Private backyard', 'Shared hot tub', 'Shared sauna', 'Elevator', 'Shared gym in building', 'Free street parking', 'Paid parking on premises'],
  service: ['Luggage dropoff allowed', 'Long term stays allowed', 'Self check-in', 'Keypad', 'Cleaning available during stay', 'Pets allowed', 'Smoking allowed', 'Smart lock']
};

const hotelSchema = new mongoose.Schema({
  hotelName: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  nation: { type: String, required: true },
  hotelType: { type: String, required: true,
    enum:['Hotel','Resort','Apartment','Villa','Cabin','Cottage','Glamping','Guest House','Business','Dorm'] },
  hotelAmenities: {
    view: {
      type: [String],
      validate:{
        validator:function (v){
          return v.every(i =>amenitiesEnum.view.includes(i))
        }
      },
      required: false
    },
    bathroom:{
      type:[String],
      validate:{
        validator:function (v){
          return v.every(i =>amenitiesEnum.bathroom.includes(i))
        }
      },
      required: false
    },
    bedroom:{
      type:[String],
      validate:{
        validator:function (v){
          return v.every(i =>amenitiesEnum.bedroom.includes(i))
        }
      },
      required: false
    },
    entertainment:{
      type:[String],
      validate:{
        validator:function (v){
          return v.every(i=>amenitiesEnum.entertainment.includes(i))
        }
      },
      required: false
    },
    heatingAndCooling:{
      type:[String],
      validate:{
        validator:function (v){
          return v.every(i =>amenitiesEnum.heatingAndCooling.includes(i))
        }
      },
      required:false
},
    safety:{
      type:[String],
      validate:{
        validator:function (v){
          return v.every(i =>amenitiesEnum.safety.includes(i))
        }
      },
      required:false
    },
    dining:{
      type:[String],
      validate:{
        validator:function (v){
          return v.every(i =>amenitiesEnum.dining.includes(i))
        }
      },
      required:false
    },
    location:{
      type:[String],
      validate:{
        validator:function (v){
          return v.every(i =>amenitiesEnum.location.includes(i))
        }
      },
      required:false
    },
    outdoor:{
      type:[String],
      validate:{
        validator:function (v){
          return v.every(i =>amenitiesEnum.outdoor.includes(i))
        }
      },
      required:false
    },
    service:{
      type:[String],
      validate:{
        validator:function (v){
          return v.every(i =>amenitiesEnum.service.includes(i))
        }
      },
      required:false,
    }
  },
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
  typeOfRoom: { type: String, required: true ,
    enum:['Suite','Standard','Deluxe','Family','Honeymoon','Accessible','Presidential','Studio','Queen','Apartment','Twin']},
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
  invoiceID: { type: mongoose.Schema.Types.ObjectId, ref: "Invoice", required: true },
  cusID: {type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true }, 
  createdDay:{type:Date,default:Date.now(),required:false}
});

const Hotel = mongoose.model("Hotel", hotelSchema);
const Room = mongoose.model("Room", roomSchema);
const Comment = mongoose.model("Comment", commentSchema);
module.exports = {
  Hotel,
  Room,
  Comment,
  roomSchema,
  hotelSchema,
  amenitiesEnum
};
