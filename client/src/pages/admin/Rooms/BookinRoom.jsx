import React, { useState } from "react";
import { Table, Button, Alert, Spin, DatePicker } from "antd";
import { useGet } from "../../../hooks/hooks";
import { FaSearch } from "react-icons/fa";
import { InfoCircleOutlined } from "@ant-design/icons";
import {  useParams } from "react-router-dom"; 

const RoomList = () => {
  const{id}=useParams();
  const BE_PORT = import.meta.env.VITE_BE_PORT; 
  const url = id ?  `${BE_PORT}/api/roomList/bookinRoom/${id}`:`${BE_PORT}/api/roomList/bookinRoom`
  const { data: roomsData, error, loading } = useGet(url);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState([null, null]); 

  if (loading) {
    return <Spin size="large" style={{ display: "block", margin: "auto" }} />;
  }

  if (error) {
    return <Alert message="Error" description="Failed to load rooms." type="error" showIcon />;
  }

  const formatData = roomsData.flatMap((room) => 
    room.moreIn4.map((booking) => ({
      key: room.id,  
      roomName: room.roomName,
      hotelName: room.hotelID?.hotelName,
      typeOfRoom: room.typeOfRoom,
      total: booking.total,
      numberOfRooms: room.numberOfRooms,
      capacity: room.capacity,
      numberOfBeds: room.numberOfBeds,
      revenue: room.revenue,
      cusName: booking.cusName,
      checkInDate: booking.checkInDate,
      checkOutDate: booking.checkOutDate,
    }))
  );

  const formatDate = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const filteredData = formatData.filter((room) => {
    const checkOutDate = new Date(room.checkOutDate);
    const formatCheckOut = formatDate(checkOutDate);
    const matchSearch = 
      (room.hotelName && room.hotelName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (room.roomName && room.roomName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (room.cusName && room.cusName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchDate = 
      (dateRange[0] && dateRange[1]) ? 
        (formatCheckOut >= formatDate(dateRange[0]) && formatCheckOut <= formatDate(dateRange[1])) :
        true;

    return matchSearch && matchDate;
  });

  const columns = [
    {
        title: "Tên khách hàng",
        dataIndex: "cusName",
        key: "cusName",
    },
    {
      title: "Tên phòng",
      dataIndex: "roomName",
      key: "roomName",
    },
    {
      title: "Ngày nhận phòng",
      dataIndex: "checkInDate",
      key: "checkInDate",
      render: (text) => new Date(text).toLocaleDateString('vi-VN'),
    },
    {
      title: "Ngày trả phòng",
      dataIndex: "checkOutDate",
      key: "checkOutDate",
      render: (text) => new Date(text).toLocaleDateString('vi-VN'),
    },
    {
      title: "Thuộc khách sạn",
      dataIndex: "hotelName",
      key: "hotelName",
    },
    {
      title: "Loại phòng",
      dataIndex: "typeOfRoom",
      key: "typeOfRoom",
    },
    {
      title: "Tổng cộng",
      dataIndex: "total",
      key: "total",
      render: (text) => text.toLocaleString(),
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
        <Button 
          icon={<InfoCircleOutlined />} 
          className='text-blue-800' 
        />
      ),
    },
  ];

  const dateChange = (dates) => {
    setDateRange(dates ? [dates[0].toDate(), dates[1].toDate()] : [null, null]); 
  };

  return (
    <div className="px-[25px] pt-[25px] bg-[#F8F9FC] pb-[40px] h-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-[28px] text-left leading-[34px] font-normal text-[#5a5c69] cursor-pointer">
        Các phòng đang được đặt {id?" của hotel "+roomsData[0]?.hotelID?.hotelName:""}
        </h1>
        <div className="flex space-x-4 items-center">
        <DatePicker.RangePicker 
            onChange={dateChange} 
            format="DD/MM/YYYY" 
            placeholder={["Từ ngày","Đến ngày"]}
          />
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
      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey="key"
        className="mt-4 border-2 rounded-s"
        pagination={{ pageSize: 5 }}
        scroll={{
          x: 1500,
        }}
      />
    </div>
  );
};

export default RoomList;

