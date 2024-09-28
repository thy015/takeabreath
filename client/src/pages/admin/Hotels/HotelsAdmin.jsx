import React from "react";
import { Row, Col, Spin, Alert } from "antd";
import { Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/reset.css"; 
import { useGet } from "../../../hooks/hooks";
import { Link } from "react-router-dom";

const PropertyCard = ({ property }) => {
  return (
    <Link to={`/Admin/Hotel/${property._id}`} className="no-underline">
      <Card className="shadow-sm h-full mt-1" style={{ borderRadius: "12px" }}>
        <Card.Img
          variant="top"
          src={property.imgLink}
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
    </Link>
  );
};

const PropertyGrid = () => {
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
  return (
    <Row gutter={[16, 16]}>
      {data.map((property, index) => (
        <Col key={property._id} xs={24} sm={12} md={6}>
          <PropertyCard property={property} />
        </Col>
      ))}
     
    </Row>
    
  );
};

export default PropertyGrid;
