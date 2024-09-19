// src/routers/router.js
import DashboardView from "../pages/admin/DashboardView";
import HomePage from "../pages/user/HomePage";

import Login from "../pages/login_register/Login";
import Register from "../pages/login_register/Register";

import HotelsAdmin from "../pages/admin/HotelsAdmin";
import AdminLayout from "../pages/admin/AdminLayout";
import Calendar from "../pages/admin/Calendar";
import HotelDetails from "../pages/admin/HotelDetails";
import Settings from "../pages/admin/Settings";
export const routers = [
  {
    path: "/",
    page: HomePage,
    isShowHeader: true,
    isShowFooter: true,
  },
  {
    path: "/Admin",
    element: <AdminLayout />,
    children: [
      { path: "", element: <DashboardView /> }, 
      { path: "HotelsAdmin", element: <HotelsAdmin /> },
      { path: "DashboardView", element: <DashboardView /> }, 
      { path: "Calendar", element: <Calendar /> }, 
      { path: "Hotel/:id", element: <HotelDetails /> }, 
      { path: "Settings", element: <Settings /> }, 
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

];
