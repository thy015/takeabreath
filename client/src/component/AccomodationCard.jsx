import React from 'react';
import {Button, Rate } from 'antd';
import { Card } from "react-bootstrap";
// hotel display page
const AccommodationCard = ({ hotel }) => {
  return (
    <div className='w-full'>
    <Card
      title={hotel.hotelName}
      extra={<span>{hotel.rate} Tuyệt hảo</span>}
      style={{ width: 300, marginBottom: '20px' }}
    >
      <p>{hotel.address}</p>
      <p>{hotel.price}</p>
    </Card>
    </div>
  );
};
// homepage display
const PropertyCard = ({ property }) => {
    return (
  
      <Card className="shadow-sm h-full" style={{ borderRadius: "12px" }}>
        <Card.Img
          variant="top"
          src={property.imgLink}
          style={{
            borderRadius: "12px 12px 0 0",
            height: "150px",
            objectFit: "cover",
          }}
        />
        <Card.Body className="h-[210px] flex flex-col flex-grow-1">
          <Card.Title>{property.hotelName}</Card.Title>
          <Card.Text>{property.address}</Card.Text>
          <div className="d-flex align-items-center">
            <div
              style={{
                backgroundColor: "#003580",
                color: "white",
                padding: "0 8px",
                borderRadius: "5px",
                fontWeight: "bold",
              }}
            >
              {property.rate}
            </div>
            <div style={{ marginLeft: "8px" }}>
              {property.numberOfRates} people have rated - {property.hotelType}
            </div>
          </div>
          <div className="mt-3" style={{ fontWeight: "bold", fontSize: "16px" }}>
            Start from {property.minPrice} vnd
          </div>
        </Card.Body>
      </Card>
      
    );
  };
  

export {PropertyCard,AccommodationCard}
