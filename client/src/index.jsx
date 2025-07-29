import React, {StrictMode} from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import {Provider} from "react-redux";
import {persistor, store} from "./store/redux/store";
import "../src/localData/i18n";
import Loading from "./partials/Loading";
import {Toaster} from "sonner";
import ErrorBoundary from "@/components/ErrorBoundary";
import {AuthWrapper} from "@/hooks/auth.context";
import {QueryClientProvider, QueryClient} from "@tanstack/react-query";
import {PersistGate} from "redux-persist/integration/react";

const root = ReactDOM.createRoot (document.getElementById ("root"));
const queryClient = new QueryClient ()

root.render (
  <StrictMode>
    <AuthWrapper>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <React.Suspense fallback={<Loading/>}>
            <Provider store={store}>
              <PersistGate persistor={persistor} loading={null}>
                <Toaster position="top-right" richColors/>
                <App/>
              </PersistGate>
            </Provider>
          </React.Suspense>
        </ErrorBoundary>
      </QueryClientProvider>
    </AuthWrapper>
  </StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
