import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './assets/css/style.css'
import axios from 'axios';
import { GoogleOAuthProvider } from '@react-oauth/google';

axios.interceptors.request.use(
  (req) => {
      const accessToken = localStorage.getItem("vooshtoken");
      req.headers.Authorization = accessToken;
      return req;
  },
  (err) => {
      return Promise.reject(err);
  }
);

// For POST requests
axios.interceptors.response.use(
  (res) => {
      return res;
  },
  (err) => {
      if (err.response) {
          if (err.response.status === 403) {
              localStorage.removeItem('vooshtoken');
              window.location = '/';
          }
      }
      return Promise.reject(err);
  }
);



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
  // <GoogleOAuthProvider clientId={'415459946998-odt9c679e6b2obf78gqalvaahuclp7vn.apps.googleusercontent.com'}>
  //   <App />
  // </GoogleOAuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
