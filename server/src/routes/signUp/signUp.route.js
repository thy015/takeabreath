const express = require("express");
const signUpController = require("./signUp.controller");
const signUpRouter = express.Router();
const {Owner,Customer}=require('../../models/signUp.model');
const { verifyLogin, verifyAdmin } = require("../../services/verify");
// CRUD Owner
signUpRouter.get("/owner", async (req, res) => {
  try {
    const RegOwner = await Owner.find();
    res.status(200).json(RegOwner);
  } catch (e) {
    res.status(500).json(e);
  }
});
signUpRouter.delete('/owner/:id',signUpController.deleteOwner)
signUpRouter.put('/owner/:id',signUpController.updateOwner)

signUpRouter.post("/signUpOwner", signUpController.signUpOwner);
signUpRouter.post("/signInOwner", signUpController.signInOwner);
// CRUD Cus
signUpRouter.get("/customer", async (req, res) => {
  try {
    const RegOwner = await Customer.find();
    res.status(200).json(RegOwner);
  } catch (e) {
    res.status(500).json(e);
  }
});
signUpRouter.delete('/customer/:id',signUpController.deleteCus)
signUpRouter.put('/customer/:id',signUpController.updateCus)

signUpRouter.post("/signInCus", signUpController.loginCustomer);
signUpRouter.post("/signUpCus", signUpController.registerCustomer);
signUpRouter.get('/logout',signUpController.logout)

signUpRouter.get('/verifyAdmin',verifyAdmin,(req,res)=>{
  return res.json(req.user)
})

signUpRouter.get('/verify',verifyLogin,(req,res)=>{
  return res.json(req.user)
})

module.exports = signUpRouter;
