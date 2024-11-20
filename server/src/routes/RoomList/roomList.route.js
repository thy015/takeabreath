const express = require("express");
const ListRouter = express.Router();
const Hotel = require("../../models/hotel.model");
const { verifyAdmin } = require("../../middleware/verify");
const { Invoice } = require("../../models/invoice.model");
const moment = require("moment");

ListRouter.get("/rooms",verifyAdmin, async (req, res) => {
  try {
    const rooms = await Hotel.Room.find().populate({path:"hotelID",select:"hotelName"});
    const moreIn4 = await Promise.all(
      rooms.map(async (item) => {
        let count = 0
        let revenuee=0
        const invoices = await Invoice.find({ roomID: item._id })
        invoices.map(invoice => {
          revenuee += invoice.guestInfo.totalPrice
          count++;
        })
        return { ...item.toObject(), revenue: revenuee*0.1, bookin:count  };
      })
    );
    res.status(200).json(moreIn4);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

ListRouter.get("/bookinRoom", verifyAdmin, async (req, res) => {
  try {
    const rooms = await Hotel.Room.find().populate({ path: "hotelID", select: "hotelName" });

    const roomDetails = await Promise.all(
      rooms.map(async (room) => {
        const invoices = await Invoice.find({ roomID: room._id, invoiceState:"paid"});

        if (invoices.length === 0) return null; 

        return {
          ...room.toObject(),
          moreIn4: invoices.map((invoice) => ({
            total:invoice.guestInfo.totalPrice,
            cusName: invoice.guestInfo.name,
            checkInDate: invoice.guestInfo.checkInDay,
            checkOutDate: invoice.guestInfo.checkOutDay,
            createDay:invoice.createDay,
            id:invoice._id,
          })),
        };
      })
    );

    const result = roomDetails.filter((room) => room !== null);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});
ListRouter.get("/bookinRoom/:id", verifyAdmin, async (req, res) => {
  try {
    const currentDate = moment(); 
    const rooms = await Hotel.Room.find({hotelID:req.params.id}).populate({ path: "hotelID", select: "hotelName" });

    const roomDetails = await Promise.all(
      rooms.map(async (room) => {
        const invoices = await Invoice.find({ roomID: room._id, invoiceState:"paid"});

        if (invoices.length === 0) return null; 

        return {
          ...room.toObject(),
          moreIn4: invoices.map((invoice) => ({
            total:invoice.guestInfo.totalPrice,
            cusName: invoice.guestInfo.name,
            checkInDate: invoice.guestInfo.checkInDay,
            checkOutDate: invoice.guestInfo.checkOutDay,
            createDay:invoice.createDay,
            id:invoice._id,
          })),
        };
      })
    );

    const result = roomDetails.filter((room) => room !== null);
    result.forEach((room) => {
      room.moreIn4.sort((a, b) => new Date(a.createDay) - new Date(b.createDay));
    });
    res.status(200).json(result);
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
ListRouter.get("/hotels/:hotelId/rooms",verifyAdmin, async (req, res) => {
  try {
      const rooms = await Hotel.Room.find({ hotelID: req.params.hotelId }).populate({path:"hotelID",select:"hotelName"});
      const moreIn4 = await Promise.all(
        rooms.map(async (item) => {
          let count = 0
          let revenuee=0
          const invoices = await Invoice.find({ roomID: item._id })
          invoices.map(invoice => {
            revenuee += invoice.guestInfo.totalPrice
            count++;
          })
          return { ...item.toObject(), revenue: revenuee*0.1, bookin:count  };
        })
      );
      res.status(200).json(moreIn4);
  } catch (e) {
      res.status(500).json({ message: e.message });
  }
});
module.exports = ListRouter;
