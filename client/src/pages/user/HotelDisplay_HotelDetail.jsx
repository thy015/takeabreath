import React from 'react'
import {useParams} from 'react-router-dom'
import { useGet } from '../../hooks/hooks';
import { Spin, Alert } from 'antd';
const HotelDisplay_HotelDetail = () => {
    const {id}=useParams();

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
    <div>
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
        {data.minPrice ? data.minPrice.toLocaleString() : 'N/A'} VND
      </p>
      
   </div>
    </div>
  )
}

export default HotelDisplay_HotelDetail
