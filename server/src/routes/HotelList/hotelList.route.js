const express = require("express");
const ListRouter = express.Router();
const hotelListController = require("./hotelList.controller");
const {Hotel,Room} = require("../../models/hotel.model");
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

ListRouter.get("/hotel/:id", async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

ListRouter.get("/hotel/:id/room", async (req, res) => {
  try {
    const hotelID = req.params.id;
    if (!hotelID) {
      return res.status(400).json({ message: "hotelID is required" });
    }
    const rooms = await Room.find({hotelID:hotelID});
    res.status(200).json(rooms);
  } catch (e) {
    res.status(500).json(e);
  }
});

ListRouter.get('/room',async(req,res)=>{
  try{
    const room= await Room.find()
    res.status(200).json(room)
  }catch(e){
    res.status(500).json(e)
  }
})
// search hotel
ListRouter.post('/query',hotelListController.queryHotel)
ListRouter.post("/createHotel", hotelListController.createHotel);
ListRouter.post("/updateHotel/:id", hotelListController.updateHotels);
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

ListRouter.post("/createRoom", verifyOwner, hotelListController.createRoom);

module.exports = ListRouter;
