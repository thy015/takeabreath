import React, { useState, useEffect } from "react";
import { Row, Col, Spin, Alert, Select } from "antd";
import { useGet } from "../../../hooks/hooks";
import RoomCard from "./RoomCard";
import axios from "axios";
import { FaSearch } from "react-icons/fa";

const { Option } = Select;

const RoomList = () => {
  const { data: roomsData, error, loading } = useGet("http://localhost:4000/api/roomList/rooms");
  const [hotelMap, setHotelMap] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState("");

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
    return <Alert message="Error" description="Failed to load rooms." type="error" showIcon />;
  }

  const filteredData = roomsData.filter(room => 
    (hotelMap[room.hotelID] && hotelMap[room.hotelID].toLowerCase().includes(searchTerm.toLowerCase())) ||
    (room.roomName && room.roomName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortHotels = (rooms) => {
    return [...rooms].sort((a, b) => {
      switch (sortKey) {
        case 'Sức chứa':
          return b.capacity - a.capacity;
        case 'numberofbeds':
          return b.numberOfBeds - a.numberOfBeds;
        case 'hotelType':
          return hotelMap[a.hotelID].localeCompare(hotelMap[b.hotelID]);
        default:
          return 0;
      }
    });
  };

  const sortedData = sortHotels(filteredData);

  return (
    <div className="px-[25px] pt-[25px] bg-[#F8F9FC] pb-[40px]">
      <div className="flex justify-between items-center">
        <h1 className="text-[28px] text-left leading-[34px] font-normal text-[#5a5c69] cursor-pointer">
          Tất cả các phòng
        </h1>
        <div className="flex space-x-4 items-center">
          <Select
            placeholder="Lọc dữ liệu"
            onChange={(value) => setSortKey(value)}
            style={{ width: 150, height: 40 }}
            className="mb-2.5"
          >
            <Option value="Sức chứa">Sức chứa</Option>
            <Option value="numberofbeds">Số giường</Option>
            <Option value="hotelType">Khách sạn</Option>
          </Select>
          <div className="relative pb-2.5">
            <FaSearch className="text-[#9c9c9c] absolute top-1/4 left-3" />
            <input
              type="text"
              className="pl-10 bg-[#E7E7E7] h-[40px] text-black outline-none w-[300px] rounded-[5px] placeholder:text-[14px] leading-[20px] font-normal"
              placeholder="Tìm kiếm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      <Row gutter={[16, 16]} className="mt-4">
        {sortedData.map((room) => (
          <Col key={room._id} xs={24} sm={12} md={6}>
            <RoomCard room={room} hotelMap={hotelMap} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default RoomList;
