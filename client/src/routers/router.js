import DashboardView from "../pages/admin/DashboardView";
import HomePage from "../pages/user/HomePage";

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

];
