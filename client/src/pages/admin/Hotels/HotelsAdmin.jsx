import React, { useState } from "react";
import { Spin, Alert, Table, Space } from "antd";
import { useGet } from "../../../hooks/hooks";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

const PropertyGrid = () => {
  const BE_PORT = import.meta.env.VITE_BE_PORT;
  const { data, error, loading } = useGet(`${BE_PORT}/api/hotelList/hotelad`);
  const [searchTerm, setSearchTerm] = useState("");

  const displayData = searchTerm
    ? data.filter((property) =>
        property.hotelName &&
        property.hotelName.toLowerCase().includes(searchTerm.toLowerCase())||
        property.hotelType.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : data;

  const columns = [
    {
      title: "Tên Khách Sạn",
      dataIndex: "hotelName",
      key: "hotelName",
      width: 200,
    },
    {
      title: "Thành Phố",
      dataIndex: "city",
      key: "city",
      width: 150,
    },
    {
      title: "Loại",
      dataIndex: "hotelType",
      key: "hotelType",
      width: 150,
      sorter: (a, b) => a.hotelType.localeCompare(b.hotelType),
    },
    {
      title: "Đánh Giá",
      dataIndex: "rate",
      key: "rate",
      width: 100,
      sorter: (a, b) => b.rate - a.rate,
    },
    {
      title: "Lượt Đánh Giá",
      dataIndex: "numberOfRates",
      key: "numberOfRates",
      width: 150,
      sorter: (a, b) => b.numberOfRates - a.numberOfRates,
    },
    {
      title: "Tùy Chọn",
      key: "action",
      width: 150,
      render: (text, record) => (
        <Space size="middle">
          <Link to={`/admin/hotel/${record._id}/rooms`}>
            <button className="bg-blue-800 text-white p-1.5 hover:bg-blue-500">
              Xem phòng
            </button>
          </Link>
        </Space>
      ),
    },
  ];

  if (loading) {
    return <Spin size="large" style={{ display: "block", margin: "auto" }} />;
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description="Lỗi trong quá trình load hotel"
        type="error"
        showIcon
      />
    );
  }

  return (
    <div className="px-[25px] pt-[25px] h-full bg-[#F8F9FC] pb-[40px]">
      <div className="flex justify-between items-center">
        <h1 className="text-[28px] text-left leading-[34px] font-normal text-[#5a5c69] cursor-pointer">
          Hiển thị {displayData.length} trên tổng số {data.length} khách sạn
        </h1>
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
      <Table
        columns={columns}
        dataSource={displayData.map((hotel) => ({
          ...hotel,
          key: hotel._id,
        }))}
        className="mt-4 border-2 rounded-s"
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default PropertyGrid;
