// src/routers/router.js
import DashboardView from "../pages/admin/DashboardView";
import HomePage from "../pages/user/HomePage";

//import Login from "../pages/login_register/Login";
//import Register from "../pages/login_register/Register";

import HotelsAdmin from "../pages/admin/Hotels/HotelsAdmin";
import AdminLayout from "../pages/admin/AdminLayout";
import Calendar from "../pages/admin/Calendar";

import Settings from "../pages/admin/Settings";
import RoomsAdmin from "../pages/admin/Rooms/RoomsAdmin";
import RoomsOfHotel from "../pages/admin/Rooms/RoomsOfHotel"
import Login from "../pages/auth/Login"
import LoginOwner from "../pages/auth/LoginOwner"
import Register from "../pages/auth/Register"
import RegisterOwner from "../pages/auth/RegisterOwner"
import HotelDisplayCompre from "../pages/user/HotelDisplayPage";

import HotelDisplay_HotelTab from "../pages/user/HotelDisplay_HotelTab";
import HotelDisplay_HotelDetail from "../pages/user/HotelDisplay_HotelDetail";
import OwnerLayout from "../pages/owner/OwnerLayout";
import Vouchers from "../pages/owner/Voucher/Vouchers";
import AddVoucher from "../pages/owner/Voucher/AddVoucher";
import AddHotel from "../pages/admin/Hotels/AddHotel";
import Customer from "../pages/admin/Customers/CustomerList"
import cancelReqAdmin from "../pages/admin/cancelReq/cancelReqAdmin";
import Table from "../pages/admin/Table";
import UpdateHotel from "../pages/admin/Hotels/UpdateHotel";
export const routers = [
  {
    path: "/",
    page: HomePage,
    isShowHeader: true,
    isShowFooter: true,
  },
  {
    path: "/admin",
    page: AdminLayout,
    children: [
      { path: "", page: DashboardView  }, 
      { path: "hotel", page: HotelsAdmin },
      { path: "dashboard", page: DashboardView  }, 
      { path: "calendar", page: Calendar  }, 
      { path: "hotel/:id", page: HotelDisplay_HotelTab  }, 
      { path: "settings", page: Settings  }, 
      {path:"rooms", page:RoomsAdmin},
      {path:"hotel/:id/rooms", page:RoomsOfHotel},
{path:"table", page:Table},
      {path:"customers", page:Customer},
      {path:"hotel/createHotel",page:AddHotel},
      {path:"requests",page:cancelReqAdmin},
      {path:"hotel/:id/updateHotel",page:UpdateHotel},
    ],
    isAdmin: true,
    isShowHeader: false,
    isShowFooter: false,
  },
  // {
  //   path: "/Admin",
  //   page: AdminLayout,
  //   isShowHeader: false,
  //   isShowFooter: false,
  // },
  {
    path: "/login",
    page: Login,
    isShowHeader: false,
    isShowFooter: false,
  },
  {
    path: "/loginOwner",
    page: LoginOwner,
    isShowHeader: false,
    isShowFooter: false,
  },
  {
    path: "/register",
    page: Register,
    isShowHeader: false,
    isShowFooter: false,
  },
  {
    path: "/registerOwner",
    page: RegisterOwner,
    isShowHeader: false,
    isShowFooter: false,
  },
  {
    path: "/booking",
    page: HotelDisplayCompre,
    isShowHeader: true,
    isShowFooter: true,
  },
  {
    path: "/hotel/:id",
    page: HotelDisplay_HotelTab,
    isShowHeader: true,
    isShowFooter: true,
  },
  // use for searching
  {

    path: "booking/hotel/:id",
    page: HotelDisplay_HotelTab,
    isShowHeader: true,
    isShowFooter: true,
  },

{
    path: "/owner",
    page: OwnerLayout,
    children:[
      {path:"",page:Vouchers}, 
      { path: "Vouchers", page: Vouchers},
      { path: "AddVoucher", page: AddVoucher}, 
    ],
    isOwner:true,
    isShowHeader: false,
    isShowFooter: false,
  },
];

