const mongoose = require("mongoose");
const ownerSchema = new mongoose.Schema({
  ownerName: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  birthday: { type: String, required: false },
  phoneNum: { type: String, required: true },
  idenCard: { type: String, required: true },
  avatarLink: { type: String, required: false },
  paymentCard:[
    {
      paymentMethod: {type: String, required: true, enum: ['Visa','Paypal','Wowo']},
      cardNumber:{type: String, required: function () {
          return this.paymentMethod === 'Visa'
        }},
      cardCVV:{type: Number,  required: function () {
          return this.paymentMethod === 'Visa'
        }},       //234
      cardExpiration:{type: Date,  required: function () {
          return this.paymentMethod === 'Visa'
        }}, //08/27
    }
  ],
  awaitFund:{type:Number,required:false,default:0},
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
  },
  isActive:{
    type:Boolean,default:true,required:true
  },
  reasonInact:{
    type:String,required:false
  },
});
//SSO
const customerSSOSchema=new mongoose.Schema({
  name:{type:String,required:true},
  email:{type:String,required:true},
  createdAt:{type:Date,required:true},
  ssoID:{type:String,required:true},
})
//kết nối với db có sẵn chứ ko cho tạo
const Admin = mongoose.connection.collection("admin");
const Customer = mongoose.model('Customer', customerSchema);
const CustomerSSO =mongoose.model('sso-customer',customerSSOSchema)

module.exports = {
  Owner,
  Admin,
  Customer,
  CustomerSSO,
};
