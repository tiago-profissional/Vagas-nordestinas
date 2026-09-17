import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import AppRoutes from "./AppRoutes.jsx";
import ToastProvider from "./components/ToastProvider.jsx";
import SupportWidget from "./components/support/SupportWidget.jsx";

import "./styles/cores.css";
import "./index.css";
import "./App.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ToastProvider />
    <AppRoutes />
    <SupportWidget />
  </BrowserRouter>
);