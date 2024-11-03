import React, { useState } from "react";
import { Spin, Alert, Table } from "antd";
import { useGet } from "../../hooks/hooks";
import { FaSearch } from "react-icons/fa";
import {ExportToExcel} from './../../component/ExportToExcel'
const InvoicesList = () => {
  const { data, error, loading } = useGet("http://localhost:4000/api/booking/invoicepaid");
  const [searchText, setSearchText] = useState(""); 
  const [fileName,setFileName]=useState("Hóa Đơn");
  if (loading) {
    return <Spin size="large" style={{ display: "block", margin: "auto" }} />;
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description="Failed to load Invoices."
        type="error"
        showIcon
      />
    );
  }

  if (!data || data.length === 0) {
    return <Alert message="No invoice data found" type="info" showIcon />;
  }


  const columns = [
    { title: "Họ Tên", dataIndex: ["guestInfo", "name"], key: "name", width: '20%' },
    { title: "Email", dataIndex: ["guestInfo", "email"], key: "email", width: '25%' },
    { title: "Số Điện Thoại", dataIndex: ["guestInfo", "phone"], key: "phone" },
    { title: "Ngày Check-in", dataIndex: ["guestInfo", "checkInDay"], key: "checkInDay", render: (checkInDay) => new Date(checkInDay).toLocaleDateString('vi-VN') },
    { title: "Ngày Check-out", dataIndex: ["guestInfo", "checkOutDay"], key: "checkOutDay", render: (checkOutDay) => new Date(checkOutDay).toLocaleDateString('vi-VN') },
    { title: "Tổng Giá", dataIndex: ["guestInfo", "totalPrice"], key: "totalPrice", render: (price) => `${price.toLocaleString()} VND` },
    {
      title: "Xuất Hóa Đơn",
      width: '15%',
      render: (text, record) => {
        const formattedData = {
          "Họ Tên": record.guestInfo.name,
          "Email": record.guestInfo.email,
          "Số Điện Thoại": record.guestInfo.phone,
          "Ngày Check-in": new Date(record.guestInfo.checkInDay).toLocaleDateString(),
          "Ngày Check-out": new Date(record.guestInfo.checkOutDay).toLocaleDateString(),
          "Tổng Giá": `${record.guestInfo.totalPrice.toLocaleString()} VND`
        };
        return (
          <ExportToExcel apiData={[formattedData]} fileName={fileName} buttonName={"Tạo Hóa Đơn"} />
        );
      }
    }
    ,
  ];
  
  const formattedData = data
    .map(invoice => ({
      ...invoice,
      key: invoice._id,
    }))
    .filter(invoice => 
      (invoice.guestInfo.name && invoice.guestInfo.name.toLowerCase().includes(searchText.toLowerCase())) ||
      (invoice.guestInfo.email && invoice.guestInfo.email.toLowerCase().includes(searchText.toLowerCase()))
    );

  return (
    <div className="px-[25px] pt-[25px] h-full bg-[#F8F9FC] pb-[40px]">
      <div className="flex justify-between items-center">
        <h1 className="text-[28px] text-left leading-[34px] font-normal text-[#5a5c69] cursor-pointer">
          Tất cả hóa đơn
        </h1>
        <div className="flex mr-2">
        <ExportToExcel apiData={formattedData} fileName={fileName} buttonName={"Xu"} />
        <div className="relative pb-2.5">
          <FaSearch className="text-[#9c9c9c] absolute top-1/4 left-3" />
          <input
            type="text"
            className="pl-10 bg-[#E7E7E7] h-[40px] text-black outline-none w-[300px] rounded-[5px] placeholder:text-[14px] leading-[20px] font-normal"
            placeholder="Tìm kiếm"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)} 
          />
        </div>
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

export default InvoicesList;
