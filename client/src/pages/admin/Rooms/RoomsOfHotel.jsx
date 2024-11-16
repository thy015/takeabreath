import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Spin, Alert, Table, Input } from "antd";
import { useGet } from "../../../hooks/hooks";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const RoomList = () => {
  const navigate = useNavigate(); 
  const { id } = useParams();
  const BE_PORT = import.meta.env.VITE_BE_PORT;
  const { data, error, loading } = useGet(`${BE_PORT}/api/roomList/hotels/${id}/rooms`);
  const [searchTerm, setSearchTerm] = useState("");

  if (loading) {
    return <Spin size="large" style={{ display: "block", margin: "auto" }} />;
  }

  if (error) {
    return (
      <Alert message="Error" description="Failed to load rooms." type="error" showIcon />
    );
  }

  if (!data || data.length === 0) {
    return <Alert message="No rooms found" type="info" showIcon />;
  }

  const filteredData = data.filter(
    (room) =>
      room.roomName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (room.hotelID?.hotelName &&
        room.hotelID.hotelName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const columns = [
    {
      title: "Tên phòng",
      dataIndex: "roomName",
      key: "roomName",
    },
    {
      title: "Loại phòng",
      dataIndex: "typeOfRoom",
      key: "typeOfRoom",
    },
    {
      title: "Giá",
      dataIndex: "money",
      key: "money",
      render: (text) => text.toLocaleString(),
    },
    {
      title: "Số lượng phòng",
      dataIndex: "numberOfRooms",
      key: "numberOfRooms",
    },
    {
      title: "Sức chứa",
      dataIndex: "capacity",
      key: "capacity",
    },
    {
      title: "Số giường",
      dataIndex: "numberOfBeds",
      key: "numberOfBeds",
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
        <h1 className="text-[28px] text-left leading-[34px] font-normal text-[#5a5c69] mt-1">
          Danh sách phòng của {data[0]?.hotelID?.hotelName}
        </h1>
        <div className="relative">
          <FaSearch className="text-[#9c9c9c] absolute top-3 left-3" />
          <input
            type="text"
            placeholder="Tìm kiếm"
            className="pl-10 bg-[#E7E7E7] h-[40px] w-[300px] rounded-[5px] text-black"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="_id"
        className="mt-4 border-2 rounded-s"
        pagination={{ pageSize: 10 }}
        scroll={{
          x: 1500,
        }}
      />
    </div>
  );
};

export default RoomList;
