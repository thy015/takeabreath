const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    cusName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNum: { type: String, required: true },
    password: { type: String, required: true },
    birthday: { type: Date, required: false },
    avatarLink: { type: String, required: false },
});

const Customer = mongoose.model("Customer", customerSchema); 
module.exports = Customer; 
