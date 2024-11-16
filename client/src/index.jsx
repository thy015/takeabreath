import React,{StrictMode} from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import { AuthWrapper } from './hooks/auth.context';
import {Provider} from 'react-redux'
import {store} from './hooks/redux/store';
import '../src/localData/i18n'
import Loading from "./partials/Loading";
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthWrapper>
    <StrictMode>
      <React.Suspense fallback={<Loading/>}>
      <Provider store={store}>
      <App />
      </Provider>
      </React.Suspense>
    </StrictMode>
  </AuthWrapper>,

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

