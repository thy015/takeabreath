import React from "react";
import { Row, Col, Spin, Alert } from "antd";
import { Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/reset.css"; 
import { useGet } from "../../../hooks/hooks";
import { Link, useParams } from "react-router-dom";
import { PropertyCard } from "../../../component/AccomodationCard";

const PropertyGrid = () => {
  const { id } = useParams();
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
          <PropertyCard property={property} link_property={`/hotel/${property._id}`}/>
          <div className="mt-2">
          <Link to={`/admin/hotel/${property._id}/updatehotel`} className="no-underline bg-gray-800 text-white px-4 py-2 mr-2 rounded hover:bg-gray-600 transition duration-300">
        Edit
      </Link>
      <Link to={`/admin/hotel/${property._id}/rooms`} className="no-underline bg-pink-500 text-white px-2 py-2 mr-2 rounded hover:bg-pink-300 transition duration-300">
        Show Rooms
      </Link>
      <Link to={`Rooms`} className="no-underline bg-green-500 text-white px-4 py-2 rounded hover:bg-green-300 transition duration-300">
        Delete
      </Link>
          </div>
        </Col>
      ))}
    </Row>
  );
};

export default PropertyGrid;
