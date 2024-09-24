const express = require("express");
const ListRouter = express.Router();
const Customer = require("../../models/customer.model"); 
const { authenToken } = require("../../services/jwt");

ListRouter.get("/customers", async (req, res) => {
    try {
        const customers = await Customer.find(); 
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

module.exports = ListRouter;
