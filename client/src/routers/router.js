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

import RegisterOwner from "../pages/auth/Thy_RegOwner";
import HotelDisplayCompre from "../pages/user/HotelDisplayPage";

import HotelDisplay_HotelTab from "../pages/user/HotelDisplay_HotelTab";
import OwnerLayout from "../pages/owner/OwnerLayout";
import Vouchers from "../pages/owner/Voucher/Vouchers";
import AddVoucher from "../pages/owner/Voucher/AddVoucher";
import Customer from "../pages/admin/Customers/CustomerList"
import cancelReqAdmin from "../pages/admin/cancelReq/cancelReqAdmin";

import UpdateHotel from "../pages/admin/Hotels/UpdateHotel";
import Login from "../pages/auth/Thy_Login";
import Register from "../pages/auth/Thy_Reg";
import LogInOwner from "../pages/auth/Thy_LoginOwner";
import SuccessPayment from "../component/SuccessPayment";
import Test from "../component/Test";
import SSO from '../pages/auth/SSO'
import AdminVoucher from "../pages/admin/AdminVoucher";
import BookingHistory from "../pages/user/BookingHistory";
import Hotel from "../pages/owner/Hotel/Hotel";
import { CreateHotel } from "../pages/admin/Hotels/CreateHotel";
import AboutUs from "../pages/user/AboutUs";
import Room from "../pages/owner/Room/Room";
import invoiceAdmin from"../pages/admin/invoiceAdmin";
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
      {path:"customers", page:Customer},
      {path:"requests",page:cancelReqAdmin},
      {path:"hotel/:id/updateHotel",page:UpdateHotel},
      {path:"vouchers",page:AdminVoucher},
      {path:"invoices",page:invoiceAdmin},
    ],
    isAdmin: true,
    isShowHeader: false,
    isShowFooter: false,
  },
 
  {
    path: "/login",
    page: Login,
    isShowHeader: false,
    isShowFooter: false,
  },
  {
    path: "/loginOwner",
    page: LogInOwner,
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
    path: "/mybooking",
    page: BookingHistory,
    isShowHeader: true,
    isShowFooter: true,
  },
  {
    path: "/booking-success",
    page: SuccessPayment,
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
      { path:"", page:Hotel}, 
      { path: "Vouchers", page: Vouchers},
      { path: "AddVoucher", page: AddVoucher}, 
      { path: "Hotel", page: Hotel}, 
      { path: "Room", page: Room}, 
    
    ],
    isOwner:true,
    isShowHeader: false,
    isShowFooter: false,
  },
  {

    path: "/test",
    page: Test,
    isShowHeader: true,
    isShowFooter: false,
  },
  {

    path: "/sso",
    page: SSO,
    isShowHeader: false,
    isShowFooter: false,
  },
  {

    path: "/about-us",
    page: AboutUs,
    isShowHeader: true,
    isShowFooter: true,
  },
  {

    path: "*",
    page: SSO,
    isShowHeader: false,
    isShowFooter: false,
  },
]


