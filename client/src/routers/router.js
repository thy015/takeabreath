import DashboardView from "../pages/admin/DashboardView";
import HomePage from "../pages/user/HomePage";
import Login from "../pages/login_register/Login";
import Register from "../pages/login_register/Register";
export const routers = [
  {
    path: "/",
    page: HomePage,
    isShowHeader: true,
    isShowFooter: true,
  },
  {
    path: "/Admin",
    page: DashboardView,
    isShowHeader: true,
    isShowFooter: true,
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
