import React from "react";
import { Spin, Alert, Table } from "antd";
import { useGet } from "../../../hooks/hooks";
import { FaSearch, FaEnvelope, FaRegBell } from "react-icons/fa";
const CustomersList = () => {
  const { data, error, loading } = useGet("http://localhost:4000/api/auth/customer");

  if (loading) {
    return <Spin size="large" style={{ display: "block", margin: "auto" }} />;
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description="Failed to load customers."
        type="error"
        showIcon
      />
    );
  }

  if (!data || data.length === 0) {
    return <Alert message="No customer data found" type="info" showIcon />;
  }

  const columns = [
    { title: "Họ Tên", dataIndex: "cusName", key: "cusName" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Số Điện Thoại", dataIndex: "phoneNum", key: "phoneNum" },
    { title: "Sinh Nhật", dataIndex: "birthday", key: "birthday" }
  ];

  const formattedData = data.map(customer => ({
    ...customer,
    key: customer._id,
    birthday: new Date(customer.birthday).toLocaleDateString() 
  }));

  return (
    <div className="px-[25px] pt-[25px] bg-[#F8F9FC] pb-[40px]">
    <div className="flex justify-between items-center">
  <h1 className="text-[28px] text-left leading-[34px] font-normal text-[#5a5c69] cursor-pointer">
    Tất cả khách hàng
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
    <Table
 className="mt-4 border-2 rounded-s"
      columns={columns}
      dataSource={formattedData}
      pagination={{ pageSize: 10 }} 
    />
    </div>
  );
};

export default CustomersList;
