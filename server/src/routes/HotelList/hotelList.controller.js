
const { Hotel, Room, Comment } = require("../../models/hotel.model");
const { Invoice } = require("../../models/invoice.model");
const { Owner } = require("../../models/signUp.model");
const dayjs = require("dayjs");
const axios = require('axios')
const isBetween = require("dayjs/plugin/isBetween");
const isSameOrAfter = require("dayjs/plugin/isSameOrAfter")
const isSameOrBefore = require("dayjs/plugin/isSameOrBefore")
dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)
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
      const room = await createdRoom.populate("hotelID")
      const newRoom = {...room,comments:0}
      // Respond with success
      return res.status(201).json({
        status: "OK",
        message: "Room created successfully",
        data: room ,
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
    const room = await Room.findById({ _id: id })

    if (room.hotelID != hotelID) {
      // trừ số lượng trong hotel
      const oldHotel = await Hotel.findById(room.hotelID);
      oldHotel.numberOfRooms = oldHotel.numberOfRooms - 1;
      await oldHotel.save();
      // them vao hotel moi
      const newHotel = await Hotel.findById(hotelID);
      newHotel.numberOfRooms = newHotel.numberOfRooms + 1;
      await newHotel.save();
    }
    room.roomName = roomName
    room.numberOfBeds = numberOfBeds
    room.numberOfRooms = numberOfRooms
    room.typeOfRoom = typeOfRoom
    room.money = money
    room.capacity = capacity
    room.hotelID = hotelID
    room.imgLink = imgLink
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
    const getCountHotel = await Promise.all(
      hotels.map(async (item) => {
        const count = await Invoice.countDocuments({
          hotelID: item._id
        });

        // Thêm thuộc tính revenue vào object hotel
        return { ...item.toObject(), revenue: count };
      })
    );

    // getCountHotel bây giờ là danh sách các khách sạn đã có thuộc tính `revenue`
    return res.status(200).json({ status: "OK", data: getCountHotel });
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
    hotelAmenities
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

    const paymentCard = checkExistedOwnerID.paymentCard

    if (paymentCard.length <= 0) {
      return res.status(400).json({
        status: "BAD",
        message: "Vui lòng đăng ký thẻ trước khi tạo khách sạn",
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
      hotelAmenities: hotelAmenities
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
  const { hotelName, address, city, nation, hotelType, phoneNum, imgLink, hotelAmenities } =
    req.body;

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
    hotel.hotelAmenities = hotelAmenities
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
  const { city, dayStart, dayEnd, people } = req.body;
  console.log('city in be', city)
  if (!city || !dayStart || !dayEnd || !people) {
    return res.status(403).json({ message: "All fields are required" });
  }
  try {
    const start = dayStart;
    const end = dayEnd;
    console.log("Start and end", start, end);

    // handle city
    const hotels = await Hotel.find({ city: city });
    console.log(hotels)
    if (hotels.length === 0) {
      return res.status(400).json({ message: "No hotel in this city" });
    }
    const hotelIDs = hotels.map((h) => h._id);
    const rooms = await Room.find({ hotelID: { $in: hotelIDs } });
    console.log(rooms)
    if (rooms.length === 0) {
      // no room => return null
      return res
        .status(200)
        .json({ message: `Không có phòng khả dụng ở thành phố ${city}` });
    }

    const roomsID = rooms.map((r) => r._id);
    const invoices = await Invoice.find({ roomID: { $in: roomsID } });
    //dayStart and end handle
    const availableRoomDays = [];
    const unavailableRooms = [];

    rooms.forEach((room) => {
      let availableRooms = room.numberOfRooms;
      const roomInvoices = invoices.filter((invoice) =>
        invoice.roomID.equals(room._id)
      );
      // count booked room
      const bookedRooms = roomInvoices.reduce((count, invoice) => {
        const invoiceStart = dayjs(invoice.guestInfo.checkInDay);
        const invoiceEnd = dayjs(invoice.guestInfo.checkOutDay);
        const totalRoomsBooked = invoice.guestInfo.totalRoom || 1
        console.log(`Processing invoice for room ${room._id}`);
        console.log("Invoice check-in and check-out:", invoiceStart, invoiceEnd);
        console.log("Number of rooms booked in this invoice:", totalRoomsBooked);
        const isOverlapping =
          dayjs(start).isBetween(invoiceStart, invoiceEnd, null, "[)") ||
          dayjs(end).isBetween(invoiceStart, invoiceEnd, null, "(]")

        if (isOverlapping) {
          count += totalRoomsBooked
        }
        console.log("count", count);
        return count;
      }, 0);
      console.log(bookedRooms.numberOfRooms)
      const countRoom = availableRooms - bookedRooms;
      if (countRoom > 0) {
        availableRoomDays.push({
          ...room.toObject(),
          countRoom  //return for the countRoom below
        });
      } else {
        unavailableRooms.push({
          ...room.toObject(),
          countRoom: 0
        });
      }
    });

    if (availableRoomDays.length > 0) {
      return res.status(200).json({
        status: "OK",
        roomData: availableRoomDays,
        unavailableRooms: unavailableRooms,
        hotelData: hotels,
        countRoom: availableRoomDays.map(room =>
          ({ hotelID: room.hotelID, roomID: room._id, countRoom: room.countRoom }))
      });
    } else {
      return res.status(200).json({
        message: "No available hotel for the selected dates",
      });
    }
  } catch (e) {
    console.log("Problem in hotel query controller: " + e);
    return res.status(500).json({ message: "Internal server error" });
  }
};
// query ordinate location
const googleGeometrySearch = async (req, res) => {
  try {
    const { city } = req.body;

    const response = await
      axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(city)}&key=${process.env.VITE_API_KEY}`);

    //can use postman 2 see this
    if (response.data && response.data.results.length > 0) {
      const lat = response.data.results[0].geometry.location.lat;
      const lng = response.data.results[0].geometry.location.lng;

      return res.status(200).json({ lat, lng });
    } else {
      return res.status(404).json({ message: 'No results found' });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
}

const deleteHotel = async (req, res) => {
  try {
    const hotel = req.params.id;
    const countRoom = await Room.countDocuments({ hotelID: hotel })
    const countInvoice = await Invoice.countDocuments({ hotelID: hotel })
    if (countRoom > 0) {
      return res.status(400).json({
        message: "Khách sạn đã liên kết tới phòng khác nên không xóa được !",
      });
    }

    if (countInvoice > 0) {
      return res.status(400).json({
        message: "Khách sạn đã liên kết tới đơn đặt phòng khác nên không xóa được !",
      });
    }

    const deletedProduct = await Hotel.findByIdAndDelete(hotel);
    if (!deletedProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    return res.status(200).json({
      message: "",
    });

  } catch (e) {
    console.log("Problem in hotel query controller: " + e);
    return res.status(500).json({ message: "Internal server error" });
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
      const hotel = await Hotel.findById({ _id: roomDelete.hotelID })
      if (hotel) {
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

const getInvoicesOwner = async (req, res) => {
  const { ownerID } = req
  const countHotel = await Hotel.countDocuments({ ownerID: ownerID })
  const countRoom = await Room.countDocuments({ ownerID: ownerID })
  const hotels = await Hotel.find({ ownerID: ownerID })
  const hotelIDs = hotels.map(hotel => hotel._id)
  const invoices = await Invoice.find({
    "hotelID": { $in: hotelIDs }
  }).populate("roomID hotelID cusID")

  const totalPrice = invoices.reduce((acc, item) => {
    return acc + item.guestInfo.totalPrice
  }, 0)

  return res.json(
    {
      status: true,
      invoice: invoices,
      countHotel: countHotel,
      countRoom: countRoom,
      countInvoice: invoices.length,
      totalPrice: totalPrice
    })
}

const commentRoom = async (req, res) => {
  const { ratePoint, content, roomID, invoiceID } = req.body
  const idCus = req.user.id
  if (!ratePoint || !content || !roomID || !invoiceID)
    return res.status(403).json({ message: "Bị mất dữ liệu" })
  if (!idCus)
    return res.status(403).json({ message: "Mất thông tin khách hàng" })

  try {
    const comment = new Comment({
      ratePoint: ratePoint,
      content: content,
      roomID: roomID,
      cusID: idCus,
      invoiceID: invoiceID
    })

    await comment.save()
    return res.status(200).json({ message: "Đánh giá thành công, Cảm ơn bạn đã đánh giá", comment: comment })

  } catch (err) {
    return res.status(500).json({ message: "Lỗi hệ thống", err: err.message })

  }
}

const getCommentCus = async (req, res) => {
  const idCus = req.user.id
  try {
    const comment = await Comment.find({
      cusID: idCus
    })
    return res.status(200).json({ message: comment })

  } catch (err) {
    return res.status(500).json({ message: "Lỗi hệ thống", err: err.message })

  }
}

const getCommentRoom = async (req, res) => {
  const idRoom = req.params.id
  if (!idRoom)
    return res.status(403), json({ message: "Mất dữ liệu" })
  try {
    const comment = await Comment.find({
      roomID: idRoom
    }).populate("cusID")
    return res.status(200).json({ comments: comment })
  } catch (err) {
    return res.status(500).json({ message: "Lỗi hệ thống", err: err.message })

  }

}

const filterRoomDate = async (req, res) => {
  const idOwner = req.ownerID
  const arrayDate = req.body.arrayDate

  if (!idOwner)
    return res.status(403).json({ message: "Mất dữ liệu người dùng" })
  if (!arrayDate)
    return res.status(403).json({ message: "Bị dữ liệu ngày" })
  const startDate = dayjs(arrayDate[0])
  const endDate = dayjs(arrayDate[1])
  try {


    const room = await Room.find({ ownerID: idOwner }).populate("hotelID")
    const hotels = await Hotel.find({ ownerID: idOwner })
    const hotelIDs = hotels.map(hotel => hotel._id)

    // lấy dữ liệu invoice theo room
    const invoices = await Invoice.find({
      "hotelID": { $in: hotelIDs }
    }).populate("roomID hotelID cusID")


    // lọc ra các invoice nằm trong khoản startDate và endDate
    const filterInvoice = invoices.filter(item => {
      const checkInDay = dayjs(item.guestInfo.checkInDay)
      const checkOutDay = dayjs(item.guestInfo.checkOutDay)
      return (
        (checkInDay.isSameOrAfter(startDate) && checkInDay.isSameOrBefore(endDate)) ||
        (checkOutDay.isSameOrAfter(startDate) && checkOutDay.isSameOrBefore(endDate)) ||
        (checkInDay.isBefore(startDate) && checkOutDay.isAfter(endDate)) ||
        (checkInDay.isSameOrBefore(endDate) && checkOutDay.isSameOrAfter(startDate))
      );
    })
    const roomInvoiceCount = filterInvoice.reduce((acc, invoice) => {
      const roomID = invoice.roomID._id;
      acc[roomID] = (acc[roomID] || 0) + invoice.guestInfo.totalRoom;
      return acc;
    }, {});

    const updateRoom = await Promise.all(
      room.map(async (item) => {

        const commentCount = await Comment.countDocuments({
          roomID: item._id
        })
        return ({
          ...item,
          revenue: roomInvoiceCount[item._id] || 0,
          comments: commentCount
        })
      })
    )
    console.log(updateRoom)
    res.json({ message: "test", room: updateRoom })
  } catch (err) {
    return res.status(500).json({ message: err.message })
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
  updateRoom,
  getInvoicesOwner,
  googleGeometrySearch,
  commentRoom,
  getCommentCus,
  getCommentRoom,
  filterRoomDate
};
