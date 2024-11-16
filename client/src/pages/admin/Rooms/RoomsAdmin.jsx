import React, { useState } from "react";
import { Table, Input, Alert, Spin } from "antd";
import { useGet } from "../../../hooks/hooks";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; 

const RoomList = () => {
  const BE_PORT = import.meta.env.VITE_BE_PORT;
  const { data: roomsData, error, loading } = useGet(`${BE_PORT}/api/roomList/rooms`);
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
      title: "Số lượng phòng",
      dataIndex: "numberOfRooms",
      key: "numberOfRooms",
      sorter: (a, b) => b.numberOfRooms - a.numberOfRooms,
    },
    {
      title: "Loại phòng",
      dataIndex: "typeOfRoom",
      key: "typeOfRoom",
    },
    {
      title: "Sức chứa",
      dataIndex: "capacity",
      key: "capacity",
      sorter: (a, b) => b.capacity - a.capacity,
    },
    {
      title: "Số giường",
      dataIndex: "numberOfBeds",
      key: "numberOfBeds",
      sorter: (a, b) => b.numberOfBeds - a.numberOfBeds,
    },
    {
      title: "Giá tiền (VND)",
      dataIndex: "money",
      key: "money",
      render: (money) => money.toLocaleString("vi-VN"),
      sorter: (a, b) => b.money - a.money,
    },
    {
      title: "Tên khách sạn",
      dataIndex: ["hotelID", "hotelName"],
      key: "hotelName",
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <button
          className="bg-green-700 text-white px-3 py-1 ml-2 rounded"
          onClick={() => navigate(`/admin/comments/${record._id}`)} 
        >
          Xem bình luận
        </button>
      ),
    },
  ];

  return (
    <div className="px-[25px] pt-[25px] bg-[#F8F9FC] pb-[40px] h-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-[28px] text-left leading-[34px] font-normal text-[#5a5c69] cursor-pointer">
          Tất cả các phòng
        </h1>
        <div className="flex space-x-4 items-center">
          <div className="relative">
            <FaSearch className="text-[#9c9c9c] absolute top-1/4 left-3" />
            <Input
              type="text"
              className="pl-10 bg-[#E7E7E7] text-black outline-none w-[300px] rounded-[5px] placeholder:text-[14px]"
              placeholder="Tìm kiếm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey="_id"
        className="mt-4 border-2 rounded-s"
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default RoomList;
