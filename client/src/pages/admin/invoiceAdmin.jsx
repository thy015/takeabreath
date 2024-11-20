import React, { useState } from "react";
import { Spin, Alert, Table ,DatePicker} from "antd";
import { useGet } from "../../hooks/hooks";
import { FaSearch } from "react-icons/fa";
import {ExportToExcel} from '../../component/ExportToExcel'
import GeneratePDFButton from "../../component/ExportToPDF";
const InvoicesList = () => {
  const{RangePicker}=DatePicker;
  const BE_PORT=import.meta.env.VITE_BE_PORT
  const { data, error, loading } = useGet(`${BE_PORT}/api/booking/invoicepaid`);
  const [searchText, setSearchText] = useState(""); 
  const [fileName,setFileName]=useState("Hóa Đơn");
  const [selectedDateRange, setSelectedDateRange] = useState([null, null]);
  if (loading) {
    return <Spin size="large" style={{ display: "block", margin: "auto" }} />;
  }
  const handleDateChange = (dates) => {
    setSelectedDateRange(dates ? [dates[0], dates[1]] : [null, null]);
  };
  const isDateInRange = (date) => {
    if (!selectedDateRange[0] || !selectedDateRange[1]) return true;
    const orderDate = new Date(date);
    const startDate = new Date(selectedDateRange[0]);
    const endDate = new Date(selectedDateRange[1]);
    endDate.setHours(23, 59, 59, 999); 
    return orderDate >= startDate && orderDate <= endDate;
  };
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
    { title: "Họ Tên", dataIndex: "guestInfo", key: "name" ,
      render: (guestInfo) => (
        <div className="w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
          {`${guestInfo.name}`}
        </div>
      ),},
    { title: "Email", dataIndex: ["guestInfo", "email"], key: "email" },
    { title: "Số Điện Thoại", dataIndex: ["guestInfo", "phone"], key: "phone" },
    { title: "Ngày Đặt Phòng", dataIndex: "createDay", key: "createDay",render: (checkInDay) => new Date(checkInDay).toLocaleDateString('vi-VN') },
    { title: "Phòng", dataIndex: ["roomID", "roomName"], key: "roomID" },
    { title: "Tổng Số Phòng", dataIndex: ["guestInfo", "totalRoom"], key: "totalRoom" },
    { title: "Ngày Nhận Phòng", dataIndex: ["guestInfo", "checkInDay"], key: "checkInDay", render: (checkInDay) => new Date(checkInDay).toLocaleDateString('vi-VN') },
    { title: "Ngày Trả Phòng", dataIndex: ["guestInfo", "checkOutDay"],key: "checkOutDay", render: (checkOutDay) => new Date(checkOutDay).toLocaleDateString('vi-VN') },
    { title: "Tổng Giá", dataIndex: ["guestInfo", "totalPrice"], key: "totalPrice", render: (price) => `${price.toLocaleString()} VND` },
    {
      title: "Tùy Chọn",
      render: (text, record) => {
        return (
   <GeneratePDFButton invoice={record}/>
        );
      }
    }
    ,
  ];
  const exportData = data.map(invoice => ({
    "Họ Tên": invoice.guestInfo.name,
    "Tên Khách Sạn": invoice.guestInfo.idenCard,
    "Email": invoice.guestInfo.email,
    "Số Điện Thoại": invoice.guestInfo.phone,
    "Ngày Sinh": new Date(invoice.guestInfo.dob).toLocaleDateString(),
    "Giới Tính": invoice.guestInfo.gender,
    "Phương Thức Thanh Toán": invoice.guestInfo.paymentMethod,
    "Ngày Check-in": new Date(invoice.guestInfo.checkInDay).toLocaleDateString(),
    "Ngày Check-out": new Date(invoice.guestInfo.checkOutDay).toLocaleDateString(),
    "Tổng Giá": `${invoice.guestInfo.totalPrice.toLocaleString()} VND`,
    "Tổng Số Phòng": invoice.guestInfo.totalRoom,
    "Trạng Thái Hóa Đơn": invoice.invoiceState
  }));
  
  const formattedData = data
    .map(invoice => ({
      ...invoice,
      key: invoice._id,
    }))
    .filter(invoice => 
      (invoice.guestInfo.name && invoice.guestInfo.name.toLowerCase().includes(searchText.toLowerCase())) ||
      (invoice.guestInfo.email && invoice.guestInfo.email.toLowerCase().includes(searchText.toLowerCase()))
    ).filter(invoice => isDateInRange(invoice.createDay));;;

  return (
    <div className="px-[25px] pt-[25px] h-full bg-[#F8F9FC] pb-[40px]">
      <div className="flex justify-between items-center">
        <h1 className="text-[28px] text-left leading-[34px] font-normal text-[#5a5c69] cursor-pointer">
          Tất cả hóa đơn
        </h1>
        <RangePicker 
  onChange={handleDateChange}
  format="DD/MM/YYYY"
  placeholder={['Từ ngày', 'Đến ngày']} 
  className='h-10'
/>
        <div className="flex gap-2 mt-2">
          <div className="mt-0.5">
<ExportToExcel 
  apiData={exportData} 
  fileName="HoaDon" 
  buttonName="Xuất dữ liệu"
/>
</div>
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
        className="mt-3 border-2 rounded-s"
        columns={columns}
        dataSource={formattedData}
        pagination={{ pageSize: 8 }}
        scroll={{
          x: 1500,
        }}
      />
 
    </div>
  );
};

export default InvoicesList;

