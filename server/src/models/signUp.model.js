const mongoose = require("mongoose");
const ownerSchema = new mongoose.Schema({
  ownerName: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  birthday: { type: String, required: false },
  phoneNum: { type: String, required: true },
  idenCard: { type: String, required: true },
  avatarLink: { type: String, required: false },
  idenCard:{type:String,required:true},
  regDay: { type: Date, default: Date.now, required: false },
});

const Owner = mongoose.model("Owner", ownerSchema);

const customerSchema = new mongoose.Schema({
  cusName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phoneNum: {
    type: String,
  },
  password: {
    type: String,
    required: true  
  },
  birthday: {
    type: Date
  },
  isUse: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
  },
  refundAmount: {
    type: Number,
    default: 0
  }
});

//kết nối với db có sẵn chứ ko cho tạo
const Admin = mongoose.connection.collection("admin");
const Customer = mongoose.model('Customer', customerSchema);
module.exports = {
  Owner,
  Admin,
  Customer
};
