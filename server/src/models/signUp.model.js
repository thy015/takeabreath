const mongoose = require("mongoose");
const ownerSchema = new mongoose.Schema({
  ownerName: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  birthday: { type: String, required: true },
  phoneNum: { type: String, required: true },
  avatarLink: { type: String, required: false },
  regDay: { type: Date, default: Date.now, required: false },
});

const Owner = mongoose.model("Owner", ownerSchema);

//kết nối với db có sẵn chứ ko cho tạo
const Admin = mongoose.connection.collection("admin");

module.exports = {
  Owner,
  Admin,
};
