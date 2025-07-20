import React from "react";
import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
  Outlet,
} from "react-router-dom";
import "./index.scss";
import { routers } from "./routers/router";
import axios from "axios";
import Header from "./partials/Header";
import Footer from "./partials/Footer";
import { Fragment, useContext, useEffect, useState } from "react";
import { AuthContext } from "./hooks/auth.context";

function App() {
  const { auth, setAuth } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  axios.defaults.withCredentials = true;
  const BE_PORT = import.meta.env.VITE_BE_PORT;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${BE_PORT}/api/auth/verify`);
        const userRes = response.data.user;
        setAuth({
          isAuthenticated: true,
          user: {
            id: userRes?.id ?? "",
            email: userRes?.email ?? "",
            name: userRes?.name ?? "",
            role: userRes?.role ?? "",
          },
        });
        console.log("[USER SSO]", userRes);
      } catch (err) {
        console.log("[APP]", err);
        setAuth({
          isAuthenticated: false,
          user: null,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  console.log(auth);

  useEffect(() => {
    const loadScript = (src) => {
      let script;
      if (auth?.user?.role === "customer") {
        console.log("Load Script");
        return new Promise((resolve, reject) => {
          script = document.createElement("script");
          script.id = "chatbox";
          script.src = src;
          script.onload = () => resolve();
          script.onerror = () =>
            reject(new Error(`Script load error for ${src}`));
          document.body.appendChild(script);
        });
      } else {
        const iframeChatbox = document.getElementsByName("fab");
        iframeChatbox.forEach((element) => {
          element.style.display = "none";
        });
      }
    };

    const loadScripts = async () => {
      try {
        await loadScript("https://cdn.botpress.cloud/webchat/v2.2/inject.js");
        await loadScript(
          "https://files.bpcontent.cloud/2024/11/09/20/20241109202259-FMPWOTKL.js"
        );

        console.log("Scripts loaded successfully");
      } catch (error) {
        console.error(error);
      }
    };
    loadScripts();
  }, [auth?.user?.role]);

  if (isLoading) {
    return <div>Loading....</div>;
  }

  // Create route elements with proper structure
  const createRouteElement = (route) => {
    const RouteComponent = route.page;

    // Admin routes with authentication check
    if (route.isAdmin) {
      if (!auth.isAuthenticated || auth?.user?.role !== "admin") {
        return <Navigate to="/" replace state={{ from: route.path }} />;
      }

      return (
        <RouteComponent>
          <Outlet />
        </RouteComponent>
      );
    }

    // Owner routes with authentication check
    if (route.isOwner) {
      // Uncomment the authentication check when ready
      // if (!auth.isAuthenticated || auth?.user?.role !== "owner") {
      //   return <Navigate to="/" replace state={{ from: route.path }} />;
      // }

      return (
        <RouteComponent>
          <Outlet />
        </RouteComponent>
      );
    }

    // Regular routes with header/footer
    const Layout = route.isShowHeader ? Header : Fragment;
    const FooterLayout = route.isShowFooter ? Footer : Fragment;

    return (
      <Layout>
        <RouteComponent />
        <FooterLayout />
      </Layout>
    );
  };

  // Transform router configuration to proper React Router v6 structure
  const transformedRoutes = routers.map((route) => ({
    path: route.path,
    element: createRouteElement(route),
    children: route.children?.map((child) => ({
      path: child.path,
      element: <child.page />,
    })),
  }));

  // Create the router with transformed routes
  const router = createBrowserRouter(transformedRoutes);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
