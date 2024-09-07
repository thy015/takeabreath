import React from "react";
import { Carousel, Row, Col, Spin, Alert } from "antd";
import { Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/reset.css"; // Ensure you have antd's CSS
import { useGet } from "../../hooks/hooks";

const PropertyCard = ({ property }) => {
  return (
    <Card className="shadow-sm h-full" style={{ borderRadius: "12px" }}>
      <Card.Img
        variant="top"
        src={property.hotelImg}
        style={{
          borderRadius: "12px 12px 0 0",
          height: "180px",
          objectFit: "cover",
        }}
      />
      <Card.Body className="h-[180px] flex flex-col flex-grow-1">
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
            {property.rating}
          </div>
          <div style={{ marginLeft: "8px" }}>
            {property.numberOfRated} people have rated - {property.businessType}
          </div>
        </div>
        <div className="mt-3" style={{ fontWeight: "bold", fontSize: "16px" }}>
          Start from {property.minPrice} vnd
        </div>
      </Card.Body>
    </Card>
  );
};

const PropertyGrid = () => {
  const slides = [];

  const { data, error, loading } = useGet(
    "http://localhost:4000/api/hotelList/hotel"
  );

  if (loading) {
    return <Spin size="large" style={{ display: "block", margin: "auto" }} />;
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description="Failed to load properties."
        type="error"
        showIcon
      />
    );
  }

  if (!data || data.length === 0) {
    return <Alert message="No hotel data found" type="info" showIcon />;
  }

  // display hotel data 4 slide 1 page
  for (let i = 0; i < data.length; i += 4) {
    slides.push(
      <div key={i}>
        <Row gutter={[16, 16]}>
          {data.slice(i, i + 4).map((property, index) => (
            <Col key={index} xs={24} sm={12} md={6}>
              <PropertyCard property={property} />
            </Col>
          ))}
        </Row>
      </div>
    );
  }

  return (
    <Carousel arrows swipeToSlide>
      {slides}
    </Carousel>
  );
};

export default PropertyGrid;
