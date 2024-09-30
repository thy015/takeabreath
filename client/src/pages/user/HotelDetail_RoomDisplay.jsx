import React, { useState } from "react";
import { Card } from "react-bootstrap";
import { Row, Col, Spin, Alert, Button } from "antd";
import { useGet } from "../../hooks/hooks";
import { useParams } from "react-router-dom";

const HotelDetail_RoomDisplay = () => {
  const { id } = useParams();
  
  // State for room count, where room ID is the key
  const [counts, setCounts] = useState({});

  // Fetch room data
  const { data, error, loading } = useGet(
    `http://localhost:4000/api/hotelList/hotel/${id}/room`
  );

  if (loading) {
    return <Spin size="large" style={{ display: "block", margin: "auto" }} />;
  }

  if (error) {
    console.log(data);
    return (
      <Alert
        message="Error"
        description="Failed to load hotel details."
        type="error"
        showIcon
      />
    );
  }

  if (!data) {
    return <Alert message="No hotel data found" type="info" showIcon />;
  }

  // Increment room count
  const increment = (roomID) => {
    setCounts((prevCounts) => ({
      ...prevCounts,
      [roomID]: (prevCounts[roomID] || 0) + 1,
    }));
  };

  // Decrement room count
  const decrement = (roomID) => {
    setCounts((prevCounts) => ({
      ...prevCounts,
      [roomID]: Math.max((prevCounts[roomID] || 0) - 1, 0), 
    }));
  };

  return (
    <div>
      <div className="mt-4">
        {data.map((room) => {
          return (
            // Display room details
            <Row className="border-b mb-4" key={room.id}>
              <Col span={8}>
                <Card className="mb-6">
                  <div>
                    <Card.Img
                      className="object-cover h-full rounded-md shadow-md"
                      src={room.imgLink}
                    />
                  </div>
                </Card>
              </Col>
              {/* Display room info */}
              <Col span={8}>
                <div className="py-4">
                  <h4>{room.roomName}</h4>
                  <ul>
                    <li>Room Type: {room.typeOfRoom}</li>
                    <li>Capacity: {room.capacity}</li>
                    <li>Total Bed: {room.numberOfBeds}</li>
                    <li>Amenities: ....</li>
                  </ul>
                </div>
              </Col>
              {/* Display price and book button */}
              <Col span={8}>
                <div className="w-full h-[90%] p-4 border border-gray-300 shadow-md rounded-lg">
                  {/* Count room */}
                  <div className="flex items-center justify-center space-x-4">
                    <Button
                      disabled={!counts[room._id] || counts[room._id] === 0}
                      onClick={() => decrement(room._id)}
                    >
                      -
                    </Button>
                    <div>{counts[room._id] || 0}</div>
                    <Button onClick={() => increment(room._id)}>+</Button>
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
