import React,{useState,useEffect}from "react";
import { useParams, Link } from "react-router-dom";
import { Row, Col, Spin, Alert } from "antd";
import { useGet } from "../../../hooks/hooks";
import RoomCard from "./RoomCard"; 
import { FaSearch } from "react-icons/fa";
const RoomList = () => {
  const { id } = useParams();
  const { data, error, loading } = useGet(`http://localhost:4000/api/roomList/hotels/${id}/rooms`);
  const [hotelMap, setHotelMap] = useState({});
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/hotelList/hotel");
        const map = response.data.reduce((acc, hotel) => {
          acc[hotel._id] = hotel.hotelName;
          return acc;
        }, {});
        setHotelMap(map);
      } catch (error) {
        console.error("Error fetching hotels:", error);
      }
    };

    fetchHotels();
  }, []);
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
    <div className="px-[25px] pt-[25px] bg-[#F8F9FC] pb-[40px]">
    <div className="flex justify-between items-center">
  <h1 className="text-[28px] text-left leading-[34px] font-normal text-[#5a5c69] cursor-pointer">
    Tất cả các phòng
  </h1>
  <div className="relative pb-2.5">
    <FaSearch className="text-[#9c9c9c]  absolute top-1/4 left-3"/>
      <input
        type="text"
        className="pl-10 bg-[#E7E7E7] h-[40px] text-white outline-none w-[300px] rounded-[5px] placeholder:text-[14px] leading-[20px] font-normal"
        placeholder="Tìm kiếm"
      />
    </div>
</div>
    <Row gutter={[16, 16]}>
      {data.map((room) => (
        <Col key={room._id} xs={24} sm={12} md={6}>
          <RoomCard room={room} hotelMap={hotelMap}/>
        </Col>
      ))}
    </Row>
    </div>
  );
};

export default RoomList;
