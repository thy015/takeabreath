import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const RoomCard = ({ room }) => {
  return (
   
      <Card className="shadow-sm h-full mt-1" style={{ borderRadius: "12px" }}>
        <Card.Img
          variant="top"
          src={room.roomImages} 
          style={{
            borderRadius: "12px 12px 0 0",
            height: "180px",
            objectFit: "cover",
          }}
        />
      
        <Card.Body className="h-[180px] flex flex-col flex-grow-1">
          <Card.Title>{room.roomName}</Card.Title>
          <Card.Text>Type of room: {room.typeOfRoom}</Card.Text>
          <Card.Text>Capacity: {room.capacity}</Card.Text>
          <Card.Text>Beds: {room.numberOfBeds}</Card.Text>
          <div className="mt-3" style={{ fontWeight: "bold", fontSize: "16px" }}>
            Price: {room.money} VND
          </div>
        </Card.Body>
      </Card>
 
  );
};

export default RoomCard;
