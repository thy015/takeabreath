const service = require("../../services/services");
const { Hotel } = require("../../models/hotel.model");
const createHotel = async (req, res) => {
  try {
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
    } = req.body;
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
    const result = await service.createHotel(req.body, req.ownerID);
    return res.status(201).json(result);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

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

const createRoom = async (req, res) => {
  try {
    const { numberOfBeds, typeOfRoom, money, hotelID, capacity, roomImages } =
      req.body;
    if (!numberOfBeds || !typeOfRoom || !money || !hotelID || !capacity) {
      return res.status(403).json({ message: "Input is required" });
    }
    const result = await service.createRoom(req.body, hotelID);
    return res.status(201).json(result);
  } catch (e) {
    console.error("Error in createRoom controller:", e);
    return res.status(500).json({ message: e.message });
  }
};

const searchHotel = async (req, res) => {
  try {
    const { city } = req.body;
    if (!city) {
      return res.status(403).json({ message: "Input is required" });
    }
    const result = await service.searchHotel(city);
    return res.status(200).json({ status: "OK", data: result });
  } catch (e) {
    console.error("Error in searchHotels controller:", e);
    return res.status(500).json({ message: e.message });
  }
};

module.exports = {
  createHotel,
  createRoom,
  getHotelsByOwner,
  searchHotel,
};
