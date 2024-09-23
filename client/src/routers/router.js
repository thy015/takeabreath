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
import Register from "../pages/auth/Register"
import RegisterOwner from "../pages/auth/RegisterOwner"
import HotelDisplayCompre from "../pages/user/HotelDisplayPage";
export const routers = [
  {
    path: "/",
    page: HomePage,
    isShowHeader: true,
    isShowFooter: true,
  },
  {
    path: "/Admin",
    element: AdminLayout,
    children: [
      { path: "", element: DashboardView  }, 
      { path: "Hotels", element: HotelsAdmin },
      { path: "Dashboard", element: DashboardView  }, 
      { path: "Calendar", element: Calendar  }, 
      { path: "Hotel/:id", element: HotelDetails  }, 
      { path: "Settings", element: Settings  }, 
      {path:"Rooms", element:RoomsAdmin},
      {path:"Hotel/:id/Rooms", element:RoomsOfHotel},
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
