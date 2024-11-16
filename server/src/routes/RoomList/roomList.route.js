const express = require("express");
const ListRouter = express.Router();
const Hotel = require("../../models/hotel.model");
const { authenToken } = require("../../middleware/jwt");
const { verifyAdmin } = require("../../middleware/verify");


ListRouter.get("/rooms",verifyAdmin, async (req, res) => {
  try {
    const rooms = await Hotel.Room.find().populate({path:"hotelID",select:"hotelName"});
    res.status(200).json(rooms);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

ListRouter.get("/rooms/:_id",verifyAdmin, async (req, res) => {
  try {
    const hotel = await Hotel.Room.findById(req.params._id).populate({path:"hotelID",select:"hotelName"});
    if (!hotel) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
ListRouter.get("/hotels/:hotelId/rooms", async (req, res) => {
  try {
      const rooms = await Hotel.Room.find({ hotelID: req.params.hotelId }).populate({path:"hotelID",select:"hotelName"});
      res.status(200).json(rooms);
  } catch (e) {
      res.status(500).json({ message: e.message });
  }
});

module.exports = ListRouter;
