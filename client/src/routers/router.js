// src/routers/router.js
import DashboardView from "../pages/admin/DashboardView";
import HomePage from "../pages/user/HomePage";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import HotelsAdmin from "../pages/admin/HotelsAdmin";
import AdminLayout from "../pages/admin/AdminLayout";
import Calendar from "../pages/admin/Calendar";
import HotelDetails from "../pages/admin/HotelDetails";
import Settings from "../pages/admin/Settings";
import HotelDisplayCompre from "../pages/user/HotelDisplayPage";
import RegisterOwner from "../pages/auth/RegisterOwner";
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
