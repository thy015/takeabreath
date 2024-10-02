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
  FaReceipt,
} from "react-icons/fa";
import "../../App.css";
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
  const [activeItem, setActiveItem] = useState(null);

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  const manageItems = [
    { label: "Hotels", to: "hotel", icon: FaHotel },
    { label: "Customers", to: "customers", icon: FaUser },
    { label: "Rooms", to: "rooms", icon: FaRestroom },
    { label: "Vouchers", to: "", icon: FaTicketAlt },
    { label: "Invoice", to: "", icon: FaReceipt },
    { label: "Requests", to: "requests", icon: FaHand },
  
  ];

  const addonItems = [
    { label: "Calendar", to: "calendar", icon: FaCalendar },
    { label: "Settings", to: "settings", icon: FaRegSun },
  ];

  return (
    <div className="bg-[#003580] h-full">
      <div className="px-[15px] py-[30px] flex items-center justify-center border-b-[1px] border-[#EDEDED]/[0.3]">
        <h1 className="text-white text-[20px] leading-[24px] font-extrabold cursor-pointer">
          TakeABreath
        </h1>
      </div>
      <SidebarItem
        label="Dashboard"
        to="dashboard"
        icon={FaTachometerAlt}
        active={activeItem === "Dashboard"}
        onClick={() => handleItemClick("Dashboard")}
      />
      <div className="pt-[15px] border-t-[1px] border-[#EDEDED]/[0.3]">
        <p className="text-[10px] font-extrabold leading-[16px] text-white/[0.4]">MANAGE</p>
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
        <p className="text-[10px] font-extrabold leading-[16px] text-white/[0.4]">ADDONS</p>
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
