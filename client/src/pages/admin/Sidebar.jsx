import React, { useState } from "react";
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
  FaStickyNote,
} from "react-icons/fa";
import "../../App.css";

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState(null);

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  return (
    <div className="bg-[#003580]  h-full">
      <div className="px-[15px] py-[30px] flex items-center justify-center border-b-[1px] border-[#EDEDED]/[0.3]">
        <h1 className="text-white text-[20px] leading-[24px] font-extrabold cursor-pointer">
          TakeABreath
        </h1>
      </div>
      <Link
        to="dashboard"
        className={`no-underline flex items-center gap-[15px] pl-5 py-[10px] w-full border-b-[1px] border-[#EDEDED]/[0.3] cursor-pointer ${
          activeItem === "Dashboard" ? "bg-white text-[#003580]" : "text-white"
        }`}
        onClick={() => handleItemClick("Dashboard")}
      >
        <FaTachometerAlt color={activeItem === "Dashboard" ? "#003580" : "white"} />
        <p className="text-[14px] leading-[20px] font-bold pt-[10px]">Dashboard</p>
      </Link>
      <div className="pt-[15px] border-b-[1px] border-[#EDEDED]/[0.3]">
        <p className="text-[10px] font-extrabold leading-[16px] text-white/[0.4]">MANAGE</p>
        <Link
          to="hotel"
          className={`no-underline flex items-center justify-between pl-5 gap-[10px] py-[10px] w-full cursor-pointer ${
            activeItem === "Hotel" ? "bg-white text-[#003580]" : "text-white"
          }`}
          onClick={() => handleItemClick("Hotel")}
        >
          <div className="flex items-center gap-[10px]">
            <FaHotel color={activeItem === "Hotel" ? "#003580" : "white"} />
            <p className="text-[14px] leading-[20px] font-normal pt-[10px]">Hotels</p>
          </div>
          <FaChevronRight className="pr-2" color={activeItem === "Hotel" ? "#003580" : "white"} />
        </Link>
        <Link
          to="customers"
          className={`no-underline flex items-center pl-5 justify-between gap-[10px] py-[10px] w-full cursor-pointer ${
            activeItem === "Customers" ? "bg-white text-[#003580]" : "text-white"
          }`}
          onClick={() => handleItemClick("Customers")}
        >
          <div className="flex items-center gap-[10px]">
            <FaUser color={activeItem === "Customers" ? "#003580" : "white"} />
            <p className="text-[14px] leading-[20px] pt-[10px] font-normal">Customers</p>
          </div>
          <FaChevronRight className="pr-2" color={activeItem === "Customers" ? "#003580" : "white"} />
        </Link>
        <Link
          to="rooms"
          className={`no-underline flex items-center pl-5 justify-between gap-[10px] py-[10px] w-full cursor-pointer ${
            activeItem === "Rooms" ? "bg-white text-[#003580]" : "text-white"
          }`}
          onClick={() => handleItemClick("Rooms")}
        >
          <div className="flex items-center gap-[10px]">
            <FaRestroom color={activeItem === "Rooms" ? "#003580" : "white"} />
            <p className="text-[14px] leading-[20px] pt-[10px] font-normal">Rooms</p>
          </div>
          <FaChevronRight className="pr-2" color={activeItem === "Rooms" ? "#003580" : "white"} />
        </Link>
        <div
          className={`flex items-center justify-between pl-5 gap-[10px] py-[10px] w-full cursor-pointer ${
            activeItem === "Vouchers" ? "bg-white text-[#003580]" : "text-white"
          }`}
          onClick={() => handleItemClick("Vouchers")}
        >
          <div className="flex items-center gap-[10px]">
            <FaTicketAlt color={activeItem === "Vouchers" ? "#003580" : "white"} />
            <p className="text-[14px] leading-[20px] pt-[10px] font-normal">Vouchers</p>
          </div>
          <FaChevronRight className="pr-2" color={activeItem === "Vouchers" ? "#003580" : "white"} />
        </div>
        <div
          className={`flex items-center justify-between pl-5 gap-[10px] py-[10px] w-full cursor-pointer ${
            activeItem === "Invoices" ? "bg-white text-[#003580]" : "text-white"
          }`}
          onClick={() => handleItemClick("Invoices")}
        >
          <div className="flex items-center gap-[10px]">
            <FaTicketAlt color={activeItem === "Invoices" ? "#003580" : "white"} />
            <p className="text-[14px] leading-[20px] pt-[10px] font-normal">Invoice</p>
          </div>
          <FaChevronRight className="pr-2" color={activeItem === "Invoices" ? "#003580" : "white"} />
        </div>
      </div>
      <div className="pt-[5px] border-b-[1px] border-[#EDEDED]/[0.3]">
        <p className="text-[10px] font-extrabold leading-[16px] text-white/[0.4]">ADDONS</p>
        <Link
          to=""
          className={`no-underline flex items-center pl-5 gap-[10px] py-[10px] w-full cursor-pointer ${
            activeItem === "Pages" ? "bg-white text-[#003580]" : "text-white"
          }`}
          onClick={() => handleItemClick("Pages")}
        >
          <FaStickyNote color={activeItem === "Pages" ? "#003580" : "white"} />
          <p className="text-[14px] leading-[20px] pt-[10px] font-normal">Pages</p>
        </Link>
        <Link
          to="calendar"
          className={`no-underline flex items-center pl-5 gap-[10px] py-[10px] w-full cursor-pointer ${
            activeItem === "Calendar" ? "bg-white text-[#003580]" : "text-white"
          }`}
          onClick={() => handleItemClick("Calendar")}
        >
          <FaCalendar color={activeItem === "Calendar" ? "#003580" : "white"} />
          <p className="text-[14px] leading-[20px] pt-[10px] font-normal">Calendar</p>
        </Link>
        <Link
          to="settings"
          className={`no-underline flex items-center pl-5 gap-[10px] py-[10px] w-full cursor-pointer ${
            activeItem === "Settings" ? "bg-white text-[#003580]" : "text-white"
          }`}
          onClick={() => handleItemClick("Settings")}
        >
          <FaRegSun color={activeItem === "Settings" ? "#003580" : "white"} />
          <p className="text-[14px] leading-[20px] pt-[10px] font-normal">Settings</p>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
