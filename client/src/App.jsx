import React, {useContext, useEffect, useState} from "react";
import {RouterProvider, Outlet, createBrowserRouter, useLocation} from "react-router-dom";
import axios from "axios";
import {AuthContext} from "./hooks/auth.context";
import {routers} from "./routers/router";
import Header from "@/partials/Header";
import Footer from "@/partials/Footer";
import './index.scss'

function App () {
  const {auth, setAuth} = useContext (AuthContext);
  const [isLoading, setIsLoading] = useState (true);
  const [setRedirectPath] = useState (null);
  const BE_PORT = import.meta.env.VITE_BE_PORT;
  useEffect (() => {
    const loadScript = (src) => {
      return new Promise ((resolve, reject) => {
        const script = document.createElement ("script");
        script.id = "chatbox";
        script.src = src;
        script.onload = () => resolve ();
        script.onerror = () => reject (new Error (`Script load error for ${src}`));
        document.body.appendChild (script);
      });
    };

    const loadScripts = async () => {
      try {
        if (auth?.user?.role === "customer") {
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
  }, [auth?.user?.role]);

  useEffect (() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get (`${BE_PORT}/api/auth/verify`);
        const userRes = response.data.user;
        setAuth ({
          isAuthenticated: true,
          user: {
            id: userRes?.id ?? "",
            email: userRes?.email ?? "",
            name: userRes?.name ?? "",
            role: userRes?.role ?? "",
          },
        });

        // Set redirect path based on user role
        if (userRes?.role === "owner") {
          setRedirectPath ("/owner");
        } else if (userRes?.role === "admin") {
          setRedirectPath ("/admin");
        }
      } catch (err) {
        console.log ("[APP]", err);
        // Redirect to "/" if unauthorized
        if (err.response?.status === 401) {
          setRedirectPath ("/");
        }
        setAuth ({
          isAuthenticated: false,
          user: null,
        });
      } finally {
        setIsLoading (false);
      }
    };

    fetchUser ();
  }, []);

  if (isLoading) {
    return <div>Loading....</div>;
  }

  const Layout = () => {
    const location = useLocation ()
    const noHeaderFooterRoutes = ['/owner', '/admin','/login','/register']

    const shouldHideHeaderFooter = noHeaderFooterRoutes.some ((route) => location.pathname.startsWith (route))

    return (<>
      {!shouldHideHeaderFooter && <Header/>}
      <Outlet/>
      {!shouldHideHeaderFooter && <Footer/>}
    </>)
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
