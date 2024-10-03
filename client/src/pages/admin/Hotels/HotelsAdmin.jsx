import React from "react";
import { Row, Col, Spin, Alert, FloatButton } from "antd";
import { Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/reset.css"; 
import { useGet } from "../../../hooks/hooks";
import { Link, useParams } from "react-router-dom";
import { PropertyCard } from "../../../component/AccomodationCard";
import { PlusOutlined } from '@ant-design/icons';
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
    <div>
    <Row gutter={[16, 16]}>
      {data.map((property) => (
        <Col key={property._id} xs={24} sm={12} md={6}>
          <PropertyCard property={property} link_property={`/hotel/${property._id}`} link_button={`/admin/hotel/${property._id}/rooms`} edit={`/admin/hotel/${property._id}/updateHotel`}  showButton={true}/>
        </Col>
      ))}
     
    </Row>
    <FloatButton icon={<PlusOutlined/>} type="primary" href="/admin/hotel/createHotel" />;
    </div>
  );
};

export default PropertyGrid;
