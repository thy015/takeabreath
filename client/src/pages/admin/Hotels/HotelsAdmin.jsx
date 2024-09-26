import React from "react";
import { Row, Col, Spin, Alert } from "antd";
import { Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/reset.css"; 
import { useGet } from "../../../hooks/hooks";
import { Link } from "react-router-dom";
import { PropertyCard } from "../../../component/AccomodationCard";
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
          <Link to={`/Admin/Hotel/${property._id}`} className="no-underline">
          <PropertyCard property={property} />
          </Link>
        </Col>
      ))}
     
    </Row>
    
  );
};

export default PropertyGrid;
