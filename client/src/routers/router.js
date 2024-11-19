// src/routers/router.js
import DashboardView from "../pages/admin/DashboardView";
import HomePage from "../pages/user/HomePage";
import HotelsAdmin from "../pages/admin/Hotels/HotelsAdmin";
import AdminLayout from "../pages/admin/AdminLayout";


import Settings from "../pages/admin/Settings";
import RoomsAdmin from "../pages/admin/Rooms/RoomsAdmin";

import RegisterOwner from "../pages/auth/Thy_RegOwner";
import HotelDisplayCompre from "../pages/user/HotelDisplayPage";

import HotelDisplay_HotelTab from "../pages/user/HotelDisplay_HotelTab";
import OwnerLayout from "../pages/owner/OwnerLayout";
import Vouchers from "../pages/owner/Voucher/Vouchers";
import AddVoucher from "../pages/owner/Voucher/AddVoucher";
import Customer from "../pages/admin/Customers/CustomerList"
import cancelReqAdmin from "../pages/admin/cancelReq/cancelReqAdmin";

import Login from "../pages/auth/Thy_Login";
import Register from "../pages/auth/Thy_Reg";
import LogInOwner from "../pages/auth/Thy_LoginOwner";
import Test from "../component/Test";
import SSO from '../pages/auth/SSO'
import AdminVoucher from "../pages/admin/Voucher/AdminVoucher";
import BookingHistory from "../pages/user/BookingHistory";
import Hotel from "../pages/owner/Hotel/Hotel";
import AboutUs from "../pages/user/AboutUs";
import Room from "../pages/owner/Room/Room";
import invoiceAdmin from"../pages/admin/invoiceAdmin";
import Revienue from "../pages/owner/Revenue/Revienue";
import Card from "../pages/owner/Card/Card";
import StrictLoginSSO from "../pages/auth/StrictLoginSSO";
import {OggyPartner} from "../pages/owner/OggyPartner/OggyPartner";
import BookingHistory_BookingTab from "../pages/user/BookingHistory_BookingTab";
import YourCancelRequest from "../pages/user/YourCancelRequest";
import UserInfoCard from "../pages/owner/Profile/profileOwner";
import Comment from "../pages/admin/Rooms/CommentsPage"
import CommentsPage from "../pages/admin/Rooms/CommentsPage";
import BookinRoom from "../pages/admin/Rooms/BookinRoom"
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
      { path: "hotel/:id", page: HotelDisplay_HotelTab  }, 
      { path: "settings", page: Settings  }, 
      {path:"rooms", page:RoomsAdmin},
      {path:"hotel/:id/rooms", page:RoomsAdmin},
      {path:"rooms/bookinRoom",page:BookinRoom},
      {path:"rooms/bookinRoom/:id",page:BookinRoom},
      {path:"customers", page:Customer},
      {path:"requests",page:cancelReqAdmin},
      {path:"vouchers",page:AdminVoucher},
      {path:"invoices",page:invoiceAdmin},
      { path: "comments/:id", page: CommentsPage },
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
    //my booking
  {
    path: "/mybooking",
    page: BookingHistory_BookingTab,
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
      { path:"", page:Revienue}, 
      { path: "Vouchers", page: Vouchers},
      { path: "AddVoucher", page: AddVoucher}, 
      { path: "Hotel", page: Hotel}, 
      { path: "Room", page: Room}, 
      { path: "Revenue", page: Revienue}, 
      { path: "Card", page: Card},
      { path: "Profile", page: UserInfoCard},
      {path:'OggyPartner',page:OggyPartner}
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

    path: "*",
    page: SSO,
    isShowHeader: false,
    isShowFooter: false,
  },
  {

    path: "/strict-signin-owner",
    page: StrictLoginSSO,
    isShowHeader: false,
    isShowFooter: false,
  },
  {

    path: "/about-us",
    page: AboutUs,
    isShowHeader: true,
    isShowFooter: true,
  },

]


