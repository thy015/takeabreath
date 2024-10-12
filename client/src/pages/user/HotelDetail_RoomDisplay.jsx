import React, { useContext, useState } from "react";
import { Card } from "react-bootstrap";
import { Row, Col, Button } from "antd";
import BookingConfirmationForm from "../../component/BookingConfirmationForm"
import { useSelector } from "react-redux";
import { AuthContext } from "../../hooks/auth.context";
import { openNotification } from "../../hooks/notification";
const HotelDetail_RoomDisplay = ({ roomData, hotel }) => {
  // State for room count, where room ID is the key
  const { totalCheckInDay } = useSelector((state) => state.inputDay)
  // State for room count, where room ID is the key
  const [counts, setCounts] = useState({});
  // query room data result

  //open modal : Phuc
  const [isShow, setShow] = useState(false)
  const [roomSelected, setRoomSelected] = useState({})
  const [countRoom, setCountRoom] = useState()
  const [getTotal, setTotal] = useState()
  let totalPrice = []
  //get auth context 
  const { auth } = useContext(AuthContext)
  // Increment room count
  const increment = (roomID) => {
    setCounts((prevCounts) => ({
      ...prevCounts,
      [roomID]: (prevCounts[roomID] || 1) + 1, //if undefined => ini=0
    }));
  };

  // Decrement room count
  const decrement = (roomID) => {
    setCounts((prevCounts) => ({
      ...prevCounts,
      [roomID]: Math.max((prevCounts[roomID] || 1) - 1, 1), //never go below 0, no need just in case
    }));
  };


  // Save total price

  const formatMoney = (money) => {
    return new Intl.NumberFormat('de-DE').format(money)
  }
  return (
    <div>
      <div className="mt-4">
        {roomData.map((room, index) => {
          // room property
          const returnCount = counts[room._id] || 1;
          const countRoomPrice = room.money * returnCount;
          const rangeRoomPrice = countRoomPrice * totalCheckInDay
          const fees = (rangeRoomPrice * 15) / 100;
          totalPrice[room._id] = rangeRoomPrice + fees
          return (
            // Display room details
            <Row className="border-b my-12" key={room.id}>
              <Col span={8}>
                <Card >
                  <div>
                    <Card.Img
                      className="object-cover h-full rounded-md shadow-md"
                      src={room.imgLink}
                    />
                  </div>
                </Card>
                <h5 className="border-none mb-6 mt-2 font-[500]" >{room.roomName}</h5>
              </Col>
              {/* Display room info */}
              <Col span={8}>
                <div className="py-3">

                  <div className="pl-4">
                    <ul className="flex flex-col w-full text-left ">
                      <li>Room Type: {room.typeOfRoom}</li>
                      <li>Capacity: {room.capacity}</li>
                      <li>Total Bed: {room.numberOfBeds}</li>
                      <li>Amenities: ....</li>
                    </ul>
                  </div>
                </div>
              </Col>
              {/* Display price and book button */}
              <Col span={8}>
                <div className="w-full h-95% p-4 border border-gray-300 shadow-md rounded-lg mb-8">
                  {/* Count room */}
                  <div className="flex items-center justify-center space-x-4">
                    <Button
                      disabled={!counts[room._id] || counts[room._id] === 1}
                      onClick={() => decrement(room._id)}
                    >
                      -
                    </Button>
                    <div>{returnCount}</div>
                    <Button
                      onClick={() => increment(room._id)}
                      disabled={counts[room._id] === 5}
                    >
                      +
                    </Button>
                  </div>
                  {/* Price part */}
                  <div>
                    <ul className="flex items-start flex-col border-b">
                      <li className="flex justify-between w-full mb-2 mt-2">
                        <span>Price x {returnCount} room: </span>
                        <span>{formatMoney(countRoomPrice)} VND</span>
                      </li>
                      <li className="flex justify-between w-full mb-2">
                        {/* need handle number of night */}
                        <span>For <span className="text-success">{totalCheckInDay} night </span>: </span>
                        <span>{formatMoney(rangeRoomPrice)} VND</span>
                      </li>
                      <li className="flex justify-between w-full mb-2">
                        <span>Fees and taxes:</span>
                        <span> {formatMoney(fees)} VND</span>
                      </li>
                    </ul>
                    <div className="flex justify-between w-full mt-2">
                      <span className="font-semibold">Total:</span>
                      <span className="text-success"> {formatMoney(rangeRoomPrice + fees)} VND</span>
                    </div>
                    {/* reserve */}
                    <div className="mt-3" >
                      <Button disabled={totalCheckInDay===0}
                        onClick={() => {
                          if(auth.isAuthenticated){
                            setShow(true)
                            setRoomSelected(roomData[index])
                            setCountRoom(counts[roomData[index]._id])
                            setTotal(totalPrice[roomData[index]._id])
                          }else{
                            openNotification(false,"Reserve failed","Please log in or register account !")
                          }
                        }}
                        type='solid'
                        className={`w-full text-white ${totalCheckInDay===0? 'bg-gray-400':'bg-[#1677ff] hover:scale-105'}` }
                      >Reserve
                      </Button>
                      <BookingConfirmationForm isShow={isShow} onCancel={() => setShow(false)} room={roomSelected} hotel={hotel} count={countRoom} totalPrice={getTotal} />

                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          );
        })}
      </div>
    </div>
  );
};

export default HotelDetail_RoomDisplay;
