
const { Hotel,Room } = require("../../models/hotel.model");
const { Invoice } = require("../../models/invoice.model");
const { Owner } = require("../../models/signUp.model");
const dayjs=require('dayjs')
const isBetween=require('dayjs/plugin/isBetween')

dayjs.extend(isBetween)


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

const queryHotel=async(req,res)=>{
    const {city,dayStart,dayEnd,people}=req.body
    if(!city||!dayStart||!dayEnd||!people){
      return res.status(403).json({message:"All fields are required"})
    }
    try{
      // double check
      const start=dayjs(dayStart).format('DD/MM/YYYY')
      const end=dayjs(dayEnd).format('DD/MM/YYYY')

     
    // handle city
    const hotels = await Hotel.find({ city: city });

    if(hotels.length===0){
      return res.status(400).json({ message: 'No hotel in this city' });
    }
    const hotelIDs=hotels.map(h=>h._id)
    const rooms=await Room.find({hotelID:{$in: hotelIDs}})

    if(rooms.length===0){
      // no room => return null
      return res.status(200).json({ message: 'No room in this hotel', data:[]});
    }

    const roomsID=rooms.map(r=>r._id)
    const invoices=await Invoice.find({roomID:{$in:roomsID}})
    //dayStart and end handle
    const allowedCase=invoices.some(invoice=>{
      const invoiceStart=dayjs(invoice.checkInDay)
      const invoiceEnd=dayjs(invoice.checkOutDay)

      return(
        dayjs(start).isBetween(invoiceStart,invoiceEnd,'[)')||
        dayjs(end).isBetween(invoiceStart,invoiceEnd,'(]')
      )
    })
    // 2 case false => room available
    if(!allowedCase){
      return res.status(200).json({
        status: "OK",
        roomData:rooms,
        hotelData:hotels
      })
    }
    else{
      return res.status(400).json({ message: 'Room is not available' });
    }
    }catch(e){
      console.log('Problem in hotel query controller: ' + e);
      return res.status(500).json({ message: 'Internal server error' });
    }
}
module.exports = {
  createHotel,
  createRoom,
  getHotelsByOwner,
  queryHotel
};
