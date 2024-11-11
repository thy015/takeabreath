import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { routers } from "./routers/router";
import axios from "axios";
import Header from "./partials/Header";
import Footer from "./partials/Footer";
import { Fragment, useContext, useEffect } from "react";
import { AuthContext } from "./hooks/auth.context";

function App() {
    const { auth, setAuth } = useContext(AuthContext);
    axios.defaults.withCredentials = true;

    useEffect(() => {
      const fetchUser = () => {
        axios
          .get("http://localhost:4000/api/auth/verify")
          .then((res) => {
            const userRes = res.data.user;
            setAuth({
              isAuthenticated: true,
              user: {
                id: userRes?.id ?? "",
                email: userRes?.email ?? "",
                name: userRes?.name ??  "",
                  role:userRes?.role ?? ""
              },
            });
          })
          .catch((err) => {
            console.log("[APP]", err);
          });
      };

      fetchUser();
    }, []);

    useEffect(() => {
        const loadScript = (src) => {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = src;
                script.onload = () => resolve();
                script.onerror = () => reject(new Error(`Script load error for ${src}`));
                document.body.appendChild(script);
            });
        };

        const loadScripts = async () => {
            if (auth?.user?.role !== 'admin' && auth?.user?.role !== 'owner') {
                try {
                    await loadScript('https://cdn.botpress.cloud/webchat/v2.2/inject.js');
                    await loadScript('https://files.bpcontent.cloud/2024/11/09/20/20241109202259-FMPWOTKL.js');
                    console.log("Scripts loaded successfully");
                } catch (error) {
                    console.error(error);
                }
            }
        };

        loadScripts();
    }, [auth?.user?.role]);
    return (
        <div className="App">
            <Router>
                <Routes>
                    {routers.map((route) => {
                        if (route.isAdmin) {
                            return (
                                <Route key={route.path} path={route.path} element={<route.page />}>
                                    {route.children &&
                                        route.children.map((child) => (
                                            <Route
                                                key={child.path}
                                                path={child.path}
                                                element={<child.page />}
                                            />
                                        ))}
                                </Route>
                            );
                        }

                        if (route.isOwner) {
                            return (
                                <Route key={route.path}
                                       path={route.path}
                                       element={<route.page />}>
                                    {route.children &&
                                        route.children.map((child) => (
                                            <Route
                                                key={child.path}
                                                path={child.path}
                                                element={<child.page />} />
                                        ))
                                    }
                                </Route>
                            )
                        }
                        // Non-admin routes
                        const Layout = route.isShowHeader ? Header : Fragment;
                        const FooterLayout = route.isShowFooter ? Footer : Fragment;

                        return (
                            <Route
                                key={route.path}
                                path={route.path}
                                element={
                                    <Layout>
                                        <route.page />
                                        <FooterLayout />
                                    </Layout>
                                }
                            />
                        );
                    })}
                </Routes>
            </Router>
        </div>
    );
}

export default App;
