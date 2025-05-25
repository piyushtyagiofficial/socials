// /d:/tyagi/My Projects/socials2.0/client/src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <App />
    <ToastContainer position="top-right" autoClose={3000} />
  </>
);