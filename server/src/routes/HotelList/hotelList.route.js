const express = require("express");
const ListRouter = express.Router();
const hotelListController = require("./hotelList.controller");
const {Hotel, Room} = require("../../models/hotel.model");
const { verifyOwner } = require("../../services/verify");
const { authenToken } = require("../../services/jwt");
ListRouter.get("/hotel", async (req, res) => {
  try {
    const createdHotel = await Hotel.find();
    res.status(200).json(createdHotel);
  } catch (e) {
    res.status(500).json(e);
  }
});

ListRouter.get("/hotel/:_id", async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params._id);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// all hotel from owner that logged in
ListRouter.get(
  "/hotelOwner",
  verifyOwner,
  hotelListController.getHotelsByOwner
);

ListRouter.get("/room", async (req, res) => {
  try {
    const { hotelID } = req.query;
    if (!hotelID) {
      return res.status(400).json({ message: "hotelID is required" });
    }

    const rooms = await Room.find({ hotelID: hotelID });
    res.status(200).json(rooms);
  } catch (e) {
    res.status(500).json(e);
  }
});
ListRouter.post("/updateHotel",hotelListController.updateHotels);
ListRouter.post("/createRoom", verifyOwner, hotelListController.createRoom);
ListRouter.post("/createHotel", hotelListController.createHotels);
ListRouter.get("/criteriaSearch", hotelListController.searchHotel);
module.exports = ListRouter;
