const mongoose = require("mongoose");
const ownerSchema = new mongoose.Schema({
  ownerName: { type: String, required: true },
  password: { type: String, required: false },
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
      cardWoWoID:{type: Number, required: function () {
        return this.paymentMethod === 'Wowo'
        }},
      cardWoWoBalance:{type: Number,  required: function () {
        return this.paymentMethod === 'Wowo'
        }}
    }
  ],
  awaitFund:{type:Number,required:false,default:0},
  regDay: { type: Date, default: Date.now, required: false },
  ssoID:{type:String,required:false},
});

const Owner = mongoose.model("Owner", ownerSchema);

const customerSchema = new mongoose.Schema({
  cusName: {
    type: String,
    required:false
  },
  email: {
    type: String,
    required: true,
  },
  phoneNum: {
    type: String,
    required:false
  },
  password: {
    type: String,
    required:false
  },
  birthday: {
    type: Date,
    required:false
  },
  isActive:{
    type:Boolean,default:true,required:false
  },
  reasonInact:{
    type:String,required:false
  },
  //SSO đồ án
  ssoID:{type:String,required:false},
});

const admin=new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique:true,
  },
  password:{
    type:String,
    required:true,
  },
adminName:{
  type:String,
  required:true,
},
imgLink: { type: String, required: false },
})
const Admin = mongoose.model("Admin",admin);
const Customer = mongoose.model('Customer', customerSchema);

module.exports = {
  Owner,
  Admin,
  Customer,
};
