
const { Hotel } = require("../../models/hotel.model");

const createHotel = async (req, res) => {
  const {
    address,
    taxCode,
    hotelName,
    nation,
    facilityName,
    businessType,
    scale,
    city,
    hotelPhone,
    hotelImg,
  } = req.body;

  try {
    // Validate input
    if (
      !address ||
      !taxCode ||
      !hotelName ||
      !nation ||
      !facilityName ||
      !businessType ||
      !scale ||
      !city ||
      !hotelPhone
    ) {
      return res.status(403).json({ message: "Input is required" });
    }

    // Check if the owner ID exists
    const checkExistedOwnerID = await Account.Account.findOne({
      _id: req.ownerID,
    });
    if (!checkExistedOwnerID) {
      return res.status(400).json({
        status: "BAD",
        message: "Owner ID does not exist",
      });
    }

    // Create the hotel
    const createdHotel = await Hotel.Hotel.create({
      address,
      taxCode,
      nation,
      hotelName,
      facilityName,
      businessType,
      scale,
      city,
      hotelPhone,
      hotelImg,
      ownerID: req.ownerID,
    });

    // Respond with success
    return res.status(201).json({
      status: "OK",
      message: "Hotel created successfully",
      data: createdHotel,
    });
  } catch (e) {
    console.error("Error in createHotel:", e);
    return res.status(500).json({ message: e.message });
  }
};

const createRoom = async (req, res) => {
  const { numberOfBeds, typeOfRoom, money, hotelID, capacity, roomImages } = req.body;

  try {
    // Validate input
    if (!numberOfBeds || !typeOfRoom || !money || !hotelID || !capacity) {
      return res.status(403).json({ message: "Input is required" });
    }

    // Create the room
    const createdRoom = await Hotel.Room.create({
      numberOfBeds,
      typeOfRoom,
      money,
      capacity,
      hotelID,
      roomImages,
    });

    if (createdRoom) {
      const hotel = await Hotel.Hotel.findById(hotelID);
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
    const hotelsInCity = await Hotel.Hotel.find({ city });

    // Find available rooms for each hotel
    const availableHotels = await Promise.all(
      hotelsInCity.map(async (hotel) => {
        const availableRooms = await Hotel.Room.find({ hotel: hotel._id });
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


module.exports = {
  createHotel,
  createRoom,
  getHotelsByOwner,
  searchHotel,
};
