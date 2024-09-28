
const { Hotel,Room } = require("../../models/hotel.model");
const { Owner } = require("../../models/signUp.model");

const createRoom = async (req, res) => {
  const { numberOfBeds, typeOfRoom, money, hotelID, capacity, roomImages } = req.body;

  try {
    // Validate input
    if (!numberOfBeds || !typeOfRoom || !money || !hotelID || !capacity) {
      return res.status(403).json({ message: "Input is required" });
    }

    // Create the room
    const createdRoom = await Hotel.create({
      numberOfBeds,
      typeOfRoom,
      money,
      capacity,
      hotelID,
      roomImages,
    });

    if (createdRoom) {
      const hotel = await Hotel.findById(hotelID);
      if (hotel) {
        // Update hotel minPrice if necessary
        if (hotel.minPrice === 0 || hotel.minPrice > money) {
          hotel.minPrice = money;
          await hotel.save();
        }
        // Increment the number of rooms
        hotel.numberOfRooms = hotel.numberOfRooms + 1;
        await hotel.save();
      }

      // Respond with success
      return res.status(201).json({
        status: "OK",
        message: "Room created successfully",
        data: createdRoom,
      });
    }
  } catch (e) {
    console.error("Error in createRoom:", e);
    return res.status(500).json({ message: e.message });
  }
};

//get info
const getHotelsByOwner = async (req, res) => {
  try {
    // Fetch hotels by ownerID from the request
    const hotels = await Hotel.find({ ownerID: req.ownerID });
    return res.status(200).json({ status: "OK", data: hotels });
  } catch (e) {
    console.error("Error in getHotelsByOwner:", e);
    return res.status(500).json({ message: e.message });
  }
};

const searchHotel = async (req, res) => {
  const { city } = req.query; // Use req.query to get the city from the query parameters

  try {
    // Validate input
    if (!city) {
      return res.status(403).json({ message: "Input is required" });
    }

    // Find hotels in the specified city
    const hotelsInCity = await Hotel.find({ city });

    // Find available rooms for each hotel
    const availableHotels = await Promise.all(
      hotelsInCity.map(async (hotel) => {
        const availableRooms = await Room.find({ hotel: hotel._id });
        if (availableRooms.length > 0) {
          return {
            ...hotel._doc,
            rooms: availableRooms,
          };
        } else {
          return null;
        }
      })
    );

    // Filter out hotels without available rooms
    const filteredHotels = availableHotels.filter((hotel) => hotel !== null);

    // Respond with the available hotels
    return res.status(200).json({
      status: "OK",
      message: "Find Hotel successfully",
      data: filteredHotels,
    });
  } catch (e) {
    console.error("Error searching for hotels:", e);
    return res.status(500).json({
      status: "Error",
      message: "There was an error searching for hotels.",
      error: e.message,
    });
  }
};
const createHotel = async (req, res) => {
  const {
    hotelName,
    address,
    city,
    nation,
    hotelType,
    phoneNum,
    imgLink,
    ownerID,
  } = req.body;

  try {
    if (
      !hotelName ||
      !address ||
      !city ||
      !nation ||
      !hotelType ||
      !phoneNum ||
      !ownerID
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const checkExistedOwnerID = await Owner.findById(ownerID);
    if (!checkExistedOwnerID) {
      return res.status(400).json({
        status: "BAD",
        message: "Owner ID does not exist",
      });
    }

    const createdHotel = await Hotel.create({
      hotelName,
      address,
      city,
      nation,
      hotelType,
      phoneNum,
      imgLink,
      ownerID: req.ownerID,
    });

    return res.status(201).json({
      status: "OK",
      message: "Hotel created successfully",
      data: createdHotel,
    });
  } catch (error) {
    console.error("Error in createHotel:", error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createHotel,
  createRoom,
  getHotelsByOwner,
  searchHotel,
};
