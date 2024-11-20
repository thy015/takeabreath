import React, { useState } from "react";
import { Table, Input, Alert, Spin } from "antd";
import { useGet } from "../../../hooks/hooks";
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom"; 
const RoomList = () => {
  const { id } = useParams();
  const BE_PORT = import.meta.env.VITE_BE_PORT;
  const url = id
    ? `${BE_PORT}/api/roomList/hotels/${id}/rooms`
    : `${BE_PORT}/api/roomList/rooms`;
    const a =id? `/admin/rooms/bookinRoom/${id}` :`/admin/rooms/bookinRoom/`
    const { data:roomsData, error, loading } = useGet(url);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate(); 

  if (loading) {
    return <Spin size="large" style={{ display: "block", margin: "auto" }} />;
  }

  if (error) {
    return <Alert message="Error" description="Failed to load rooms." type="error" showIcon />;
  }
  const filteredData = roomsData.filter((room) =>
    (room.hotelID?.hotelName && room.hotelID.hotelName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (room.roomName && room.roomName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const columns = [
    {
      title: "Tên phòng",
      dataIndex: "roomName",
      key: "roomName",
    },
    {
      title: "Thuộc khách sạn",
      dataIndex: ['hotelID', 'hotelName'],
      key: "hotelName",
    },
    {
      title: "Loại phòng",
      dataIndex: "typeOfRoom",
      key: "typeOfRoom",
      sorter: (a, b) => a.typeOfRoom.localeCompare(b.typeOfRoom),
    },
    {
      title: "Giá",
      dataIndex: "money",
      key: "money",
      sorter: (a, b) => a.money - b.money,
      render: (text) => text.toLocaleString(),
    },
    {
      title: "Số lượng phòng",
      dataIndex: "numberOfRooms",
      key: "numberOfRooms",
      sorter: (a, b) => a.numberOfRooms - b.numberOfRooms,
    },
    {
      title: "Sức chứa",
      dataIndex: "capacity",
      key: "capacity",
      sorter: (a, b) => a.capacity - b.capacity,
    },
    {
      title: "Số giường",
      dataIndex: "numberOfBeds",
      key: "numberOfBeds",
      sorter: (a, b) => a.numberOfBeds - b.numberOfBeds,
    },
    {
      title: "Doanh thu",
      dataIndex: "revenue",
      key: "revenue",
      sorter: (a, b) => a.revenue - b.revenue,
      render: (text) => text.toLocaleString(),
    },
    {
      title: "Số lượt đặt",
      dataIndex: "bookin",
      key: "bookin",
      sorter: (a, b) => a.bookin - b.bookin,
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <button
          className="bg-green-700 text-white px-3 py-1 ml-2 rounded hover:bg-green-500"
          onClick={() => navigate(`/admin/comments/${record._id}`)}
        >
          Xem đánh giá
        </button>
      ),
    },
  ];
  

  return (
    <div className="px-[25px] pt-[25px] bg-[#F8F9FC] pb-[40px] h-full">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-[28px] text-left leading-[34px] font-normal text-[#5a5c69] cursor-pointer">
        Tất cả các phòng {id?" của "+roomsData[0]?.hotelID?.hotelName:""}
        </h1>
        <div className="flex space-x-4 items-center">
          <div className="relative">
            <FaSearch className="text-[#9c9c9c] absolute top-1/4 left-3 mt-1" />
            <input
            type="text"
            placeholder="Tìm kiếm"
            className="pl-10 bg-[#E7E7E7] h-[40px] w-[300px] rounded-[5px] text-black"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          </div>
        </div>
      </div>
      <Link to={a} className="no-underline">
      <div className="text-left leading-[34px] text-[#2739ab] hover:text-[#7e8adb]">
        Danh sách các phòng đang được đặt
      </div>
      </Link>
      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey="_id"
        className="mt-3 border-2 rounded-s"
        pagination={{ pageSize: 5 }}
        scroll={{
          x: 1500,
        }}
      />
    </div>
  );
};

export default RoomList;

