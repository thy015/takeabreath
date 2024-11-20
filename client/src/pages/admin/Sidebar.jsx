import React, { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaTachometerAlt,
  FaHotel,
  FaUser,
  FaRegSun,
  FaCalendar,
  FaChevronRight,
  FaRestroom,
  FaTicketAlt,
  FaReceipt,
} from "react-icons/fa";
import { FaHand } from "react-icons/fa6";

const SidebarItem = ({ icon: Icon, label, to, active, onClick }) => (
  <Link
    to={to}
    className={`no-underline flex items-center justify-between pl-5 gap-[10px] py-[10px] w-full cursor-pointer ${
      active ? "bg-white text-[#003580]" : "text-white"
    }`}
    onClick={onClick}
  >
    <div className="flex items-center gap-[10px]">
      <Icon color={active ? "#003580" : "white"} />
      <p className="text-[14px] leading-[20px] font-normal pt-[10px]">{label}</p>
    </div>
    <FaChevronRight className="pr-2" color={active ? "#003580" : "white"} />
  </Link>
);

const Sidebar = () => {
  const defaultItem = "Dashboard";
  const [activeItem, setActiveItem] = useState(defaultItem);

  useEffect(() => {
    const ActiveItem = localStorage.getItem("activeItem");
    if (ActiveItem) {
      setActiveItem(ActiveItem);
    }
  }, []);

  const handleItemClick = (item) => {
    setActiveItem(item);
    localStorage.setItem("activeItem", item); 
  };

  const manageItems = [
    { label: "Khách Sạn", to: "hotel", icon: FaHotel },
    { label: "Khách Hàng", to: "customers", icon: FaUser },
    { label: "Phòng", to: "rooms", icon: FaRestroom },
    { label: "Voucher", to: "vouchers", icon: FaTicketAlt },
    { label: "Hóa Đơn", to: "invoices", icon: FaReceipt },
    { label: "Yêu Cầu", to: "requests", icon: FaHand },
  
  ];

  const addonItems = [
    { label: "Cài Đặt", to: "settings", icon: FaRegSun },
  ];

  return (
    <div className="bg-[#003580] h-full">
      <div className="px-[15px] py-[30px] flex items-center justify-center border-b-[1px] border-[#EDEDED]/[0.3]">
        <h1 className="text-white text-[20px] leading-[24px] font-extrabold cursor-pointer">
          TakeABreath
        </h1>
      </div>
      <SidebarItem
        label="Trang Chủ"
        to="dashboard"
        icon={FaTachometerAlt}
        active={activeItem === "Dashboard"}
        onClick={() => handleItemClick("Dashboard")}
      />
      <div className="pt-[15px] border-t-[1px] border-[#EDEDED]/[0.3]">
        <p className="text-[10px] font-extrabold leading-[16px] text-white/[0.4]">QUẢN LÝ</p>
      </div>

      {manageItems.map((item) => (
        <SidebarItem
          key={item.label}
          {...item}
          active={activeItem === item.label}
          onClick={() => handleItemClick(item.label)}
        />
      ))}
      <div className="pt-[5px] border-b-[1px] border-[#EDEDED]/[0.3]">
        <p className="text-[10px] font-extrabold leading-[16px] text-white/[0.4]">TÍNH NĂNG THÊM</p>
      </div>

      {addonItems.map((item) => (
        <SidebarItem
          key={item.label}
          {...item}
          active={activeItem === item.label}
          onClick={() => handleItemClick(item.label)}
        />
      ))}
    </div>
  );
};

export default Sidebar;
