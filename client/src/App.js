// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { routers } from "./routers/router";
import Header from "./partials/Header";
import Footer from "./partials/Footer";
import { Fragment } from "react";

function App() {
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
