// src/routers/router.js
import DashboardView from "../pages/admin/DashboardView";
import HomePage from "../pages/user/HomePage";

//import Login from "../pages/login_register/Login";
//import Register from "../pages/login_register/Register";

import HotelsAdmin from "../pages/admin/Hotels/HotelsAdmin";
import AdminLayout from "../pages/admin/AdminLayout";
import Calendar from "../pages/admin/Calendar";
import HotelDetails from "../pages/admin/Hotels/HotelDetails";
import Settings from "../pages/admin/Settings";
import RoomsAdmin from "../pages/admin/Rooms/RoomsAdmin";
import RoomsOfHotel from "../pages/admin/Rooms/RoomsOfHotel"
import Login from "../pages/auth/Login"
import LoginOwner from "../pages/auth/LoginOwner"
import Register from "../pages/auth/Register"
import RegisterOwner from "../pages/auth/RegisterOwner"
import Customer from "../pages/admin/Customers/CustomersList";
import HotelDisplayCompre from "../pages/user/HotelDisplayPage";
import AddHotel from "../pages/admin/Hotels/AddHotel"
export const routers = [
  {
    path: "/",
    page: HomePage,
    isShowHeader: true,
    isShowFooter: true,
  },
  {
    path: "/Admin",
    page: AdminLayout,
    children: [
      { path: "", page: DashboardView  }, 
      { path: "Hotels", page: HotelsAdmin },
      { path: "Dashboard", page: DashboardView  }, 
      { path: "Calendar", page: Calendar  }, 
      { path: "Hotel/:id", page: HotelDetails  }, 
      { path: "Settings", page: Settings  }, 
      {path:"Rooms", page:RoomsAdmin},
      {path:"Hotel/:id/Rooms", page:RoomsOfHotel},
      {path:"Customers", page:Customer},
      {path:"CreateHotel",page:AddHotel},
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
];
