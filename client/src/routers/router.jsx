import React from 'react'
import DashboardView from "../pages/admin/DashboardView";
import HomePage from "../pages/user/HomePage";
import HotelsAdmin from "../pages/admin/Hotels/HotelsAdmin";
import AdminLayout from "../pages/admin/AdminLayout";
import Settings from "../pages/admin/Settings";
import RoomsAdmin from "../pages/admin/Rooms/RoomsAdmin";
import HotelDisplayCompre from "../pages/user/HotelDisplayPage";
import HotelDisplay_HotelTab from "../pages/user/HotelDisplay_HotelTab";
import OwnerLayout from "../pages/owner/OwnerLayout";
import Vouchers from "../pages/owner/Voucher/Vouchers";
import AddVoucher from "../pages/owner/Voucher/AddVoucher";
import Customer from "../pages/admin/Customers/CustomerList";
import AdminVoucher from "../pages/admin/Voucher/AdminVoucher";
import Hotel from "../pages/owner/Hotel/Hotel";
import AboutUs from "../pages/user/AboutUs";
import Room from "../pages/owner/Room/Room";
import Revenue from "../pages/owner/Revenue/Revenue";
import Card from "../pages/owner/Card/Card";
import BookingHistory_BookingTab from "../pages/user/BookingHistory_BookingTab";
import UserInfoCard from "../pages/owner/Profile/profileOwner";
import CommentsPage from "../pages/admin/Rooms/CommentsPage";
import NotFoundPage from "../components/NotFoundPage";
import Login from "@/pages/auth/SignIn";
import LogInOwner from "@/pages/auth/SignInOwner";
import RegisterOwner from "@/pages/auth/RegisterOwner";
import Test from "@/components/Test";
import Register from "@/pages/auth/Register";
import BookedRoom from "@/pages/admin/Rooms/BookedRoom";
import InvoicesList from "@/pages/admin/invoiceAdmin";
import CancelReqAdmin from "@/pages/admin/cancelReq/cancelReqAdmin";

export const routers =  [
  {
    path: "/",
    element: <HomePage/>,
  },
  {
    path: "/admin",
    element: <AdminLayout/>,
    children: [
      {index: true, element: <DashboardView/>},
      {path: "hotel", element: <HotelsAdmin/>},
      {path: "dashboard", element: <DashboardView/>},
      {path: "hotel/:id", element: <HotelDisplay_HotelTab/>},
      {path: "settings", element: <Settings/>},
      {path: "rooms", element: <RoomsAdmin/>},
      {path: "hotel/:id/rooms", element: <RoomsAdmin/>},
      {path: "rooms/bookingRoom", element: <BookedRoom/>},
      {path: "rooms/bookingRoom/:id", element: <BookedRoom/>},
      {path: "customers", element: <Customer/>},
      {path: "requests", element: <CancelReqAdmin/>},
      {path: "vouchers", element: <AdminVoucher/>},
      {path: "invoices", element: <InvoicesList/>},
      {path: "comment/:id", element: <CommentsPage/>},
    ],
  },
  {
    path: "/login",
    element: <Login/>,
  },
  {
    path: "/loginOwner",
    element: <LogInOwner/>,
  },
  {
    path: "/register",
    element: <Register/>,
  },
  {
    path: "/registerOwner",
    element: <RegisterOwner/>,
  },
  {
    path: "/booking",
    element: <HotelDisplayCompre/>,
  },
  {
    path: "/mybooking",
    element: <BookingHistory_BookingTab/>,
  },
  {
    path: "/hotel/:id",
    element: <HotelDisplay_HotelTab/>,
  },
  {
    path: "booking/hotel/:id",
    element: <HotelDisplay_HotelTab/>,
  },
  {
    path: "/owner",
    element: <OwnerLayout/>,
    children: [
      {index: true, element: <Revenue/>},
      {path: "vouchers", element: <Vouchers/>},
      {path: "new-voucher", element: <AddVoucher/>},
      {path: "hotel", element: <Hotel/>},
      {path: "room", element: <Room/>},
      {path: "revenue", element: <Revenue/>},
      {path: "card", element: <Card/>},
      {path: "profile", element: <UserInfoCard/>},
    ],
  },
  {
    path: "/test",
    element: <Test/>,
  },
  {
    path: "*",
    element: <NotFoundPage/>,
  },
  {
    path: "/about-us",
    element: <AboutUs/>,
  },
]