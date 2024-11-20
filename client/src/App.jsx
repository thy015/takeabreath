import { BrowserRouter as Router, Routes, Route,Navigate } from "react-router-dom";
import "./App.css";
import { routers} from "./routers/router";
import axios from "axios";
import Header from "./partials/Header";
import Footer from "./partials/Footer";
import { Fragment, useContext, useEffect,useState } from "react";
import { AuthContext } from "./hooks/auth.context";
import { openNotification } from "./hooks/notification";

function App() {
    const { auth, setAuth } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);
    axios.defaults.withCredentials = true;
    const BE_PORT=import.meta.env.VITE_BE_PORT
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
                role: userRes?.role ?? ""
              },
            });
            console.log("[USER SSO]",userRes)
          } catch (err) {
            console.log("[APP]", err);
            setAuth({
              isAuthenticated: false,
              user: null
            });
          } finally {
            setIsLoading(false);
          }
        };
      
        fetchUser();
      }, []);
    console.log(auth)
    useEffect(() => {
        const loadScript = (src) => {
            let script
            if (auth?.user?.role === 'customer' ) {
                console.log("Load Script")
                return new Promise((resolve, reject) => {
                    script = document.createElement('script');
                    script.id = "chatbox"
                    script.src = src;
                    script.onload = () => resolve();
                    script.onerror = () => reject(new Error(`Script load error for ${src}`));
                    document.body.appendChild(script);
                });

            } else {
                const iframeChatbox = document.getElementsByName("fab");
                iframeChatbox.forEach(element => {
                    element.style.display = "none";
                });
            }

        };

        const loadScripts = async () => {
            try {
                await loadScript('https://cdn.botpress.cloud/webchat/v2.2/inject.js');
                await loadScript('https://files.bpcontent.cloud/2024/11/09/20/20241109202259-FMPWOTKL.js');

                console.log("Scripts loaded successfully");
            } catch (error) {
                console.error(error);
            }
        };
        loadScripts();
    }, [auth?.user?.role]);
    if (isLoading) {
        return <div></div>;
      }
    return (
        <div className="App">
            <Router>
                <Routes>
                    {routers.map((route) => {
                        if (route.isAdmin) {
                          if (!auth.isAuthenticated || auth?.user?.role !== 'admin') {
                            return (
                              <Route
                                key={route.path}
                                path={route.path}
                                element={<Navigate to="/" replace state={{ from: route.path }} />}
                              />
                            );
                          }
                          return (
                            <Route 
                              key={route.path} 
                              path={route.path} 
                              element={<route.page />}>
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
                            // if (!auth.isAuthenticated || auth?.user?.role !== 'owner') {
                            //     return (
                            //       <Route
                            //         key={route.path}
                            //         path={route.path}
                            //         element={<Navigate to="/" replace state={{ from: route.path }} />}
                            //       />
                            //     );
                            //   }
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