import React, {StrictMode} from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./App";
import {Provider} from "react-redux";
import {store} from "./store/redux/store";
import "../src/localData/i18n";
import Loading from "./partials/Loading";

const root = ReactDOM.createRoot (document.getElementById ("root"));
import {Toaster} from "sonner";
import ErrorBoundary from "@/components/ErrorBoundary";
import {AuthWrapper} from "@/hooks/auth.context";

root.render (
  <StrictMode>
    <AuthWrapper>
      <ErrorBoundary>
        <React.Suspense fallback={<Loading/>}>
          <Provider store={store}>
            <Toaster position="top-right" richColors/>
            <App/>
          </Provider>
        </React.Suspense>
      </ErrorBoundary>
    </AuthWrapper>
  </StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
