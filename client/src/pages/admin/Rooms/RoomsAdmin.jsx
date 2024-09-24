import React from "react";
import { Row, Col, Spin, Alert } from "antd";
import { useGet } from "../../../hooks/hooks";
import RoomCard from "./RoomCard"; 

const RoomList = () => {
  const { data, error, loading } = useGet("http://localhost:4000/api/roomList/rooms");
  if (loading) {
    return <Spin size="large" style={{ display: "block", margin: "auto" }} />;
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description="Failed to load rooms."
        type="error"
        showIcon
      />
    );
  }

  if (!data || data.length === 0) {
    return <Alert message="No rooms found" type="info" showIcon />;
  }

  return (
    <Row gutter={[16, 16]}>
      {data.map((room) => (
        <Col key={room._id} xs={24} sm={12} md={6}>
          <RoomCard room={room} />
        </Col>
      ))}
    </Row>
  );
};

export default RoomList;
