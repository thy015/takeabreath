const mongoose = require('mongoose');

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

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;