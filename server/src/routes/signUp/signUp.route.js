const express = require("express");
const signUpController = require("./signUp.controller");
const signUpRouter = express.Router();
const Account = require("../../models/signUp.model");

// Owner
signUpRouter.get("/owner", async (req, res) => {
  try {
    const RegOwner = await Account.find();
    res.status(200).json(RegOwner);
  } catch (e) {
    res.status(500).json(e);
  }
});

signUpRouter.post("/signUpOwner", signUpController.signUpOwner);
signUpRouter.post("/signInOwner", signUpController.signInOwner);
// Cus
signUpRouter.post("/signInCus", signUpController.signInCustomer);
signUpRouter.post("/signUpCus", signUpController.signUpCustomer);

module.exports = signUpRouter;
