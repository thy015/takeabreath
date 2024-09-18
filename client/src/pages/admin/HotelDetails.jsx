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
    <div className="max-w-2xl mx-auto p-6 shadow-lg rounded-lg bg-white">
    <h1 className="text-3xl font-bold mb-4 text-gray-800">{data.hotelName}</h1>
    <img 
      src={data.hotelImg} 
      alt={`Image of ${data.hotelName}`} 
      className="w-full h-auto rounded-lg mb-6" 
    />
    <p className="text-lg text-gray-600 mb-2">
      <span className="font-semibold">Address: </span>{data.address}
    </p>
    <p className="text-lg text-gray-600 mb-2">
      <span className="font-semibold">Rating: </span>{data.rating} / 5
    </p>
    <p className="text-lg text-gray-600">
      <span className="font-semibold">Price: </span>{data.minPrice.toLocaleString()} VND
    </p>
  </div>

  );
};

export default HotelDetail;
