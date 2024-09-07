import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { routers } from "./routers/router";
import { Fragment } from "react";
import Header from "./partials/Header";
import Footer from "./partials/Footer";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {routers.map((r) => {
            const Page = r.page;
            const Layout = r.isShowHeader ? Header : Fragment;
            const FooterLayout = r.isShowFooter ? Footer : Fragment;
            return (
              <Route
                key={r.path}
                path={r.path}
                element={
                  <Layout>
                    <Page />
                    <FooterLayout></FooterLayout>
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
