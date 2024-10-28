import React from "react";
import { Card } from "react-bootstrap";

const RoomCard = ({ room, hotelMap }) => {
  return (
    <Card className="shadow-sm h-full mt-1" style={{ borderRadius: "12px" }}>
      <Card.Img
        variant="top"
        src={room.imgLink}
        style={{
          borderRadius: "12px 12px 0 0",
          height: "180px",
          objectFit: "cover",
        }}
      />
      <Card.Body className="h-[200px] flex flex-col flex-grow-1">
        <Card.Title>{room.roomName}</Card.Title>
        <Card.Text>Loại phòng: {room.typeOfRoom}</Card.Text>
        <Card.Text>Sức chứa: {room.capacity}</Card.Text>
        <Card.Text>Số giường ngủ: {room.numberOfBeds}</Card.Text>
        <Card.Text className="font-bold">
          Khách sạn: {hotelMap[room.hotelID] || "Unknown Hotel"}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default RoomCard;
