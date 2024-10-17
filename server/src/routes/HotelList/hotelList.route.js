const express = require("express");
const ListRouter = express.Router();
const hotelListController = require("./hotelList.controller");
const {Hotel,Room} = require("../../models/hotel.model");
const { verifyOwner } = require("../../services/verify");

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

//This is the start of swagger docs

/**
 * @swagger
 * components:
 *   schemas:
 *     Hotel:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier for the hotel
 *         hotelName:
 *           type: string
 *           description: The name of the hotel
 *         address:
 *           type: string
 *           description: The address of the hotel
 *         city:
 *           type: string
 *           description: The city where the hotel is located
 *         nation:
 *           type: string
 *           description: The nation where the hotel is located
 *         hotelType:
 *           type: string
 *           description: The type of the hotel (e.g., hotel, motel, etc.)
 *         phoneNum:
 *           type: string
 *           description: The contact phone number for the hotel
 *         imgLink:
 *           type: string
 *           description: A link to an image of the hotel
 *         ownerID:
 *           type: string
 *           description: The ID of the owner of the hotel

 *     Room:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier for the room
 *         numberOfBeds:
 *           type: integer
 *           description: The number of beds in the room
 *         typeOfRoom:
 *           type: string
 *           description: The type of the room (e.g., single, double, suite, etc.)
 *         hotelID:
 *           type: string
 *           description: The ID of the hotel where the room is located
 *         imgLink:
 *           type: string
 *           description: A link to an image of the room
 */

/**
 * @swagger
 * tags:
 *   name: Hotels
 *   description: Hotel management APIs
 */

/**
 * @swagger
 * /api/hotelList/hotel:
 *   get:
 *     summary: Get all hotels
 *     tags: [Hotels]
 *     responses:
 *       200:
 *         description: A list of hotels
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Hotel'
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/hotelList/hotel/{id}:
 *   get:
 *     summary: Get hotel by ID
 *     tags: [Hotels]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the hotel
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Hotel details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hotel'
 *       404:
 *         description: Hotel not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/hotelList/hotel/{id}/room:
 *   get:
 *     summary: Get rooms by hotel ID
 *     tags: [Hotels]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the hotel
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of rooms in the hotel
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Room'
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/hotelList/room:
 *   get:
 *     summary: Get all rooms
 *     tags: [Hotels]
 *     responses:
 *       200:
 *         description: A list of rooms
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Room'
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/hotelList/query:
 *   post:
 *     summary: Search hotels
 *     tags: [Hotels]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               city:
 *                 type: string
 *               dayStart:
 *                 type: string
 *                 format: date
 *               dayEnd:
 *                 type: string
 *                 format: date
 *               people:
 *                 type: integer
 *     responses:
 *       200:
 *         description: List of available hotels
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 roomData:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Room'
 *                 hotelData:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Hotel'
 *       400:
 *         description: Bad Request
 *       403:
 *         description: All fields are required
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/hotelList/createHotel:
 *   post:
 *     summary: Create a new hotel
 *     tags: [Hotels]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hotelName:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               nation:
 *                 type: string
 *               hotelType:
 *                 type: string
 *               phoneNum:
 *                 type: string
 *               imgLink:
 *                 type: string
 *               ownerID:
 *                 type: string
 *     responses:
 *       201:
 *         description: Hotel created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Hotel'
 *       400:
 *         description: All fields are required
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/hotelList/updateHotel/{id}:
 *   post:
 *     summary: Update a hotel
 *     tags: [Hotels]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the hotel
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hotelName:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               nation:
 *                 type: string
 *               hotelType:
 *                 type: string
 *               phoneNum:
 *                 type: string
 *               imgLink:
 *                 type: string
 *     responses:
 *       200:
 *         description: Hotel updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Hotel'
 *       400:
 *         description: All fields are required
 *       404:
 *         description: Hotel not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/hotelList/hotelOwner:
 *   get:
 *     summary: Get hotels owned by the logged-in owner
 *     tags: [Hotels]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of hotels owned by the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Hotel'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/hotelList/createRoom:
 *   post:
 *     summary: Create a new room
 *     tags: [Hotels]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               numberOfBeds:
 *                 type: integer
 *               typeOfRoom:
 *                 type: string
 *               hotelID:
 *                 type: string
 *               imgLink:
 *                 type: string
 *     responses:
 *       201:
 *         description: Room created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Room'
 *       400:
 *         description: All fields are required
 *       500:
 *         description: Internal Server Error
 */
