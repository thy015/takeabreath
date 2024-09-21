// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { routers } from "./routers/router";
import axios from 'axios'
import Header from "./partials/Header";
import Footer from "./partials/Footer";
import { Fragment, useContext, useEffect } from "react";
import { AuthContext } from "./hooks/auth.context";

function App() {
  const{auth,setAuth} = useContext(AuthContext)
  axios.defaults.withCredentials=true
  useEffect(()=>{
    const fetchUser = ()=>{
      axios.get("http://localhost:4000/api/auth/verify")
        .then(res=>{
          const userRes = res.data
          setAuth({
            isAuthenticated:true,
            user :{
              id:userRes.id,
              email: userRes.email,
              name:userRes.name
            }
           
          })
        }).catch(err =>{
          console.log("[APP]",err)
        })
    }

    fetchUser()
  },[])

  return (
    <div className="App">
      <Router>
        <Routes>
          {routers.map((r) => {
            if (r.isAdmin) {
              return (
                <Route
                  key={r.path}
                  path={r.path}
                  element={r.element}
                >
                  {r.children && r.children.map((child) => (
                    <Route
                      key={child.path}
                      path={child.path}
                      element={child.element}
                    />
                  ))}
                </Route>
              );
            }
            const Layout = r.isShowHeader ? Header : Fragment;
            const FooterLayout = r.isShowFooter ? Footer : Fragment;
            return (
              <Route
                key={r.path}
                path={r.path}
                element={
                  <Layout>
                    <r.page />
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
