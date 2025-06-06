import React from "react";
import { Carousel, Row, Col, Spin, Alert } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/reset.css"; // Ensure you have antd's CSS
import { useGet } from "../../hooks/hooks";
import { PropertyCard } from "../../component/AccommodationCard";


const PropertyGrid = () => {
  const slides = [];
    const BE_PORT=import.meta.env.VITE_BE_PORT
  const { data, error, loading } = useGet(
      `${BE_PORT}/api/hotelList/hotel`
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
      <Carousel arrows swipeToSlide dotPosition="bottom" dots={{className:'dotsConfig'}}>
        {slides}
      </Carousel>
  );
};

export default PropertyGrid;