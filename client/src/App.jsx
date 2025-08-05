import React, {Suspense, useEffect, useState} from "react";
import {
  RouterProvider,
  Outlet,
  createBrowserRouter,
  useLocation, useNavigate,
} from "react-router-dom";
import axios from "axios";
import {routers} from "./routers/router";
import Header from "@/partials/Header";
import Footer from "@/partials/Footer";
import "./index.css";
import {useDispatch, useSelector} from "react-redux";
import {clearAuthData, setAuthData} from "@/store/redux/auth";
import Loading from "@/partials/Loading";

function App () {
  const auth = useSelector ((state) => state.auth);
  const [isLoading, setIsLoading] = useState (true);
  const dispatch = useDispatch ()
  const BE_PORT = import.meta.env.VITE_BE_PORT;

  useEffect (() => {
    const loadScript = (src) => {
      return new Promise ((resolve, reject) => {
        const script = document.createElement ("script");
        script.id = "chatbox";
        script.src = src;
        script.onload = () => resolve ();
        script.onerror = () =>
          reject (new Error (`Script load error for ${src}`));
        document.body.appendChild (script);
      });
    };

    const loadScripts = async () => {
      try {
        if (auth?.role === "customer" || !auth) {
          console.log ("Load Script");
          await loadScript ("https://cdn.botpress.cloud/webchat/v2.2/inject.js");
          await loadScript (
            "https://files.bpcontent.cloud/2024/11/09/20/20241109202259-FMPWOTKL.js"
          );
          console.log ("Scripts loaded successfully");
        } else {
          const iframeChatbox = document.getElementsByName ("fab");
          iframeChatbox.forEach ((element) => {
            element.style.display = "none";
          });
        }
      } catch (error) {
        console.error (error);
      }
    };

    loadScripts ();
  }, [auth?.role]);

  useEffect (() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get (`${BE_PORT}/api/auth/verify`, {
          withCredentials: true,
        });
        const userRes = response.data.user;

        // Dispatch Redux action to set auth data
        dispatch (
          setAuthData ({
            email: userRes?.email ?? "",
            name: userRes?.name ?? "",
            id: userRes?.id ?? "",
            role: userRes?.role ?? "",
          })
        );
      } catch (err) {
        console.log ("[APP]", err);

        // Clear auth state if unauthorized
        if (err.response?.status === 401) {
          dispatch (clearAuthData ());
        }
      } finally {
        setIsLoading (false);
      }
    };

    fetchUser ();
  }, [dispatch, BE_PORT]);

  if (isLoading) {
    return <div>Loading....</div>;
  }

  const Layout = () => {
    const location = useLocation ();
    const navigate = useNavigate ();
    const noHeaderFooterRoutes = ["/owner", "/admin", "/login", "/register"];

    useEffect (() => {
      // Navigate based on user role after router is ready
      if (auth?.role === "owner") {
        navigate ("/owner");
      } else if (auth?.role === "admin") {
        navigate ("/admin");
      }
    }, [auth?.role, navigate]);

    const shouldHideHeaderFooter = noHeaderFooterRoutes.some ((route) =>
      location.pathname.startsWith (route)
    );

    return (
      <>
        {!shouldHideHeaderFooter && <Header/>}
        <Suspense fallback={<Loading/>}>
          <Outlet/>
        </Suspense>
        {!shouldHideHeaderFooter && <Footer/>}
      </>
    );
  };

  const routerWithLayout = createBrowserRouter ([
    {
      element: <Layout/>,
      children: routers,
    },
  ]);

  return (
    <div className="App">
      <RouterProvider router={routerWithLayout}/>
    </div>
  );
}

export default App;
