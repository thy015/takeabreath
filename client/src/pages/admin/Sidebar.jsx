import React from "react";
import { Link } from "react-router-dom";
import {
  FaTachometerAlt,
  FaHotel,
  FaUser,
  FaRegSun,
  FaWrench,
  FaStickyNote,
  FaRegChartBar,
  FaRegCalendarAlt,
  FaChevronRight,
  FaRestroom,
  FaTicketAlt,
  FaCalendar,
} from "react-icons/fa";
import "../../App.css";

const Sidebar = () => {
  return (
    <div className="bg-[#003580] px-[25px] h-full">
      <div className="px-[15px] py-[30px] flex items-center justify-center border-b-[1px] border-[#EDEDED]/[0.3]">
        <h1 className="text-white text-[20px] leading-[24px] font-extrabold cursor-pointer">
          TakeABreath
        </h1>
      </div>
      <Link to="Dashboard" className="no-underline flex items-center gap-[15px] py-[10px] border-b-[1px] border-[#EDEDED]/[0.3] cursor-pointer">
        <FaTachometerAlt color="white" />
        <p className="text-[14px] leading-[20px] font-bold text-white pt-[10px]">Dashboard</p>
      </Link>
      <div className="pt-[15px] border-b-[1px] border-[#EDEDED]/[0.3]">
        <p className="text-[10px] font-extrabold leading-[16px] text-white/[0.4]"> MANAGE</p>
        <Link to="Hotel" className="no-underline flex items-center justify-between gap-[10px] py-[5px] cursor-pointer">
          <div className="flex items-center gap-[10px]">
            <FaHotel color="white" />
            <p className="text-[14px] leading-[20px] font-normal pt-[10px] text-white">Hotels</p>
          </div>
          <FaChevronRight color="white" />
        </Link>
        <Link to="Customers" className="no-underline flex items-center justify-between gap-[10px] py-[5px] cursor-pointer">
          <div className="flex items-center gap-[10px]">
            <FaUser color="white" />
            <p className="text-[14px] leading-[20px] pt-[10px] font-normal text-white">Customers</p>
          </div>
          <FaChevronRight color="white" />
        </Link>
        <Link to="Rooms" className="no-underline flex items-center justify-between gap-[10px] py-[5px] cursor-pointer">
          <div className="flex items-center gap-[10px]">
            <FaRestroom color="white" />
            <p className="text-[14px] leading-[20px] pt-[10px] font-normal text-white">Rooms</p>
          </div>
          <FaChevronRight color="white" />
        </Link>
        <div className="flex items-center justify-between gap-[10px] py-[5px] cursor-pointer">
          <div className="flex items-center gap-[10px]">
            <FaTicketAlt color="white" />
            <p className="text-[14px] leading-[20px] pt-[10px] font-normal text-white">Vouchers</p>
          </div>
          <FaChevronRight color="white" />
        </div>
      </div>
      <div className="pt-[5px] border-b-[1px] border-[#EDEDED]/[0.3]">
        <p className="text-[10px] font-extrabold leading-[16px] text-white/[0.4]"> ADDONS</p>
        <Link to="Pages" className="no-underline flex items-center gap-[10px] py-[5px] cursor-pointer">
          <FaStickyNote color="white" />
          <p className="text-[14px] leading-[20px] pt-[10px] font-normal text-white">Pages</p>
        </Link>
        <Link to="Calendar" className="no-underline flex items-center gap-[10px] py-[5px] cursor-pointer">
          <FaCalendar color="white" />
          <p className="text-[14px] leading-[20px] pt-[10px] font-normal text-white">Calendar</p>
        </Link>
        <Link to="Settings" className="no-underline flex items-center gap-[10px] py-[5px] cursor-pointer">
          <FaRegSun color="white" />
          <p className="text-[14px] leading-[20px] pt-[10px] font-normal text-white">Settings</p>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
