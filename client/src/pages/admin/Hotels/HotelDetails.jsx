import React from "react";
import { useParams, Link } from "react-router-dom";
import { useGet } from "../../../hooks/hooks";
import { Spin, Alert } from "antd";

const HotelDetail = () => {
  const { id } = useParams();
  const { data, error, loading } = useGet(`http://localhost:4000/api/hotelList/hotel/${id}`);

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
    <div className="max-w-2xl mx-auto p-6 shadow-lg rounded-lg bg-white">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">{data.hotelName}</h1>
      <img 
        src={data.imgLink} 
        alt={`Image of ${data.hotelName}`} 
        className="w-full h-auto rounded-lg mb-6" 
      />
      <p className="text-lg text-gray-600 mb-2">
        <span className="font-semibold">Address: </span>{data.address}
      </p>
      <p className="text-lg text-gray-600 mb-2">
        <span className="font-semibold">Rating: </span>{data.rate} / 5
      </p>
      <p className="text-lg text-gray-600 mb-4">
        <span className="font-semibold">Price: </span>
        {data.minPrice ? data.minPrice.toLocaleString() : 'vo han'} VND
      </p>
      <div>
      <Link to={`Rooms`} className="no-underline bg-gray-800 text-white px-4 py-2 mr-2 rounded hover:bg-gray-600 transition duration-300">
        Edit
      </Link>
      <Link to={`Rooms`} className="no-underline bg-pink-500 text-white px-4 py-2 mr-2 rounded hover:bg-pink-300 transition duration-300">
        Show Rooms
      </Link>
      <Link to={`Rooms`} className="no-underline bg-green-500 text-white px-4 py-2 rounded hover:bg-green-300 transition duration-300">
        Delete ?
      </Link>
      </div>
    </div>
  );
};

export default HotelDetail;
