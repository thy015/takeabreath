import React,{StrictMode} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthWrapper } from './hooks/auth.context';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthWrapper>
    <StrictMode>
      <App />
    </StrictMode>
  </AuthWrapper>,

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

