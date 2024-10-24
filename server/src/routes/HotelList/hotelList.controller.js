
const { Hotel, Room } = require("../../models/hotel.model");
const { Invoice } = require("../../models/invoice.model");
const { Owner } = require("../../models/signUp.model");
const dayjs = require('dayjs')
const isBetween = require('dayjs/plugin/isBetween')

dayjs.extend(isBetween)


const createRoom = async (req, res) => {
  const { numberOfBeds, numberOfRooms, typeOfRoom, money, hotelID, capacity, imgLink, roomName } = req.body;

  try {
    // Validate input
    if (!numberOfBeds || !typeOfRoom || !money || !hotelID || !capacity || !roomName) {
      return res.status(403).json({ message: "Input is required" });
    }

    // Create the room
    const createdRoom = await Room.create({
      roomName,
      numberOfBeds,
      numberOfRooms,
      typeOfRoom,
      money,
      capacity,
      hotelID,
      imgLink,
      ownerID: req.ownerID
    });

    if (createdRoom) {
      const hotel = await Hotel.findById(createdRoom.hotelID);
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
const updateRoom = async (req, res) => {
  const id = req.params.id
  const { numberOfBeds, numberOfRooms, typeOfRoom, money, hotelID, capacity, imgLink, roomName } = req.body;
  if (!id)
    return res.status(403).json({
      message: "Bị mất id phòng",
    });
  try {
    // Validate input
    if (!numberOfBeds || !typeOfRoom || !money || !hotelID || !capacity || !roomName) {
      return res.status(403).json({ message: "Input is required" });
    }

    // Update room
    const room = await Room.findById({_id:id})

    if(room.hotelID != hotelID){
      // trừ số lượng trong hotel
      const oldHotel = await Hotel.findById(room.hotelID);
      oldHotel.numberOfRooms = oldHotel.numberOfRooms - 1;
      await oldHotel.save();
      // them vao hotel moi
      const newHotel = await Hotel.findById(hotelID);
      newHotel.numberOfRooms = newHotel.numberOfRooms + 1;
      await newHotel.save();
    }
    room.roomName=roomName
    room.numberOfBeds=numberOfBeds
    room.numberOfRooms=numberOfRooms
    room.typeOfRoom=typeOfRoom
    room.money=money
    room.capacity=capacity
    room.hotelID=hotelID
    room.imgLink=imgLink
    await room.save()

    await room.populate("hotelID")
      // Respond with success
      return res.status(201).json({
        status: "OK",
        message: "Room created successfully",
        data: room,
      });
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
      ownerID: ownerID,
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

const updateHotels = async (req, res) => {
  const {
    hotelName,
    address,
    city,
    nation,
    hotelType,
    phoneNum,
    imgLink,
  } = req.body;

  try {

    if (!hotelName || !address || !city || !nation || !hotelType || !phoneNum) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const hotelID = req.params.id;
    const hotel = await Hotel.findById(hotelID);

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }



    hotel.hotelName = hotelName;
    hotel.address = address;
    hotel.city = city;
    hotel.nation = nation;
    hotel.hotelType = hotelType;
    hotel.phoneNum = phoneNum;
    hotel.imgLink = imgLink;

    await hotel.save();

    return res.status(200).json({
      status: "OK",
      message: "Hotel updated successfully",
      data: hotel,
    });
  } catch (error) {
    console.error("Error in updateHotels:", error);
    return res.status(500).json({ message: error.message });
  }
};



const queryHotel = async (req, res) => {
  const { city, dayStart, dayEnd, people } = req.body
  if (!city || !dayStart || !dayEnd || !people) {
    return res.status(403).json({ message: "All fields are required" })
  }
  try {
    // double check
    const start = dayjs(dayStart).format('DD/MM/YYYY')
    const end = dayjs(dayEnd).format('DD/MM/YYYY')


    // handle city
    const hotels = await Hotel.find({ city: city });

    if (hotels.length === 0) {
      return res.status(400).json({ message: 'No hotel in this city' });
    }
    const hotelIDs = hotels.map(h => h._id)
    const rooms = await Room.find({ hotelID: { $in: hotelIDs } })

    if (rooms.length === 0) {
      // no room => return null
      return res.status(200).json({ message: 'No room in this hotel', data: [] });
    }

    const roomsID = rooms.map(r => r._id)
    const invoices = await Invoice.find({ roomID: { $in: roomsID } })
    //dayStart and end handle (filter room not available)

    const availableRooms = rooms.filter(room => {
      const roomInvoices = invoices.filter(invoice => invoice.roomID.equals(room._id));
      return !roomInvoices.some(invoice => {
        const invoiceStart = dayjs(invoice.checkInDay);
        const invoiceEnd = dayjs(invoice.checkOutDay);
        return (
          dayjs(start).isBetween(invoiceStart, invoiceEnd, null, '[)') ||
          dayjs(end).isBetween(invoiceStart, invoiceEnd, null, '(]')
        );
      });
    });

    if (availableRooms.length > 0) {
      return res.status(200).json({
        status: "OK",
        roomData: availableRooms,
        hotelData: hotels,

      });
    } else {
      return res.status(200).json({
        message: 'No available rooms for the selected dates'
      });
    }
  } catch (e) {
    console.log('Problem in hotel query controller: ' + e);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
const deleteHotel = async (req, res) => {
  try {
    const hotel = req.params.id;
    const countRoom = await Room.countDocuments({hotelID:hotel})

    if(countRoom>0){
      return res.status(400).json({
        message: "Khách sạn đã liên kết tới phòng khác nên không xóa được !",
      });
    }
    const deletedProduct = await Hotel.findByIdAndDelete(hotel);
    if (!deletedProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error in delete product:", error);
    return res.status(500).json({ message: error.message });
  }
};

const deleteRoom = async (req, res) => {
  const id = req.params.id
  if (!id)
    return res.status(403).json({
      message: "Bị mất id phòng",
    });
  try {
    const invoice = await Invoice.countDocuments({ roomID: id })

    if (invoice > 0) {
      return res.status(400).json({
        message: "Phòng đã được đặt không thể xóa !",
      });
    }
    const roomDelete = await Room.findByIdAndDelete({ _id: id })
    if (roomDelete) {
      const hotel = await Hotel.findById({_id:roomDelete.hotelID})
      if(hotel){
        hotel.numberOfRooms -= 1
        await hotel.save()
      }
      return res.status(200).json({ messgae: "Xóa phòng thành công !" })
    } else {
      return res.status(400).json({ messgae: "Xóa phòng không thành công !" })
    }
  } catch (er) {
    return res.status(500).json({
      message: er.message,
    });
  }




}
module.exports = {
  createHotel,
  createRoom,
  getHotelsByOwner,
  queryHotel,
  updateHotels,
  deleteHotel,
  deleteRoom,
  updateRoom
};
