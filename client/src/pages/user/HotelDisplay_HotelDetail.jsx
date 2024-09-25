import React from "react";
import { useParams } from "react-router-dom";
import { useGet } from "../../hooks/hooks";
import { Spin, Alert, Row, Col } from "antd";
const HotelDisplay_HotelDetail = () => {
  const { id } = useParams();

  const { data, error, loading } = useGet(
    `http://localhost:4000/api/hotelList/hotel/${id}`
  );

  if (loading) {
    return <Spin size="large" style={{ display: "block", margin: "auto" }} />;
  }

  if (error) {
    console.log(data);
    return (
      <Alert
        message="Error"
        description="Failed to load hotel details."
        type="error"
        showIcon
      />
    );
  }

  if (!data) {
    return <Alert message="No hotel data found" type="info" showIcon />;
  }
  return (
    <div>
      <Row gutter={4}>
        <Col span={18}>
          <div>
            {/* Fake 3 img until group img to a link */}
            <Col span={10}>
              <img
                src={data.imgLink}
                alt={`Image of ${data.hotelName}`}
                className="w-full h-auto rounded-lg mb-6"
              />
            </Col>
            <Col span={10}>
              <img
                src={data.imgLink}
                alt={`Image of ${data.hotelName}`}
                className="w-full h-auto rounded-lg mb-6"
              />
            </Col>
          </div>
        </Col>

        <Col span={6}></Col>
      </Row>
    </div>
  );
};

export default HotelDisplay_HotelDetail;
