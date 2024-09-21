import React from "react";
import { useParams } from "react-router-dom";
import { useGet } from "../../hooks/hooks";
import { Spin, Alert } from "antd";
//link thu hotel detail voi id hotel http://localhost:3000/admin/hotel/66d73bdb64eccac3d9e9ea7b
const HotelDetail = () => {
  const { id } = useParams();

  const { data, error, loading } = useGet(`http://localhost:4000/api/hotelList/hotel/${id}`);

  if (loading) {
    return <Spin size="large" style={{ display: "block", margin: "auto" }} />;
  }

  if (error) {
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
      <h1>{data.hotelName}</h1>
      <img src={data.hotelImg} alt={data.hotelName} style={{ width: "100%", height: "auto" }} />
      <p>{data.address}</p>
      <p>Rating: {data.rating}</p>
      <p>Price: {data.minPrice} vnd</p>
    </div>
  );
};

export default HotelDetail;
