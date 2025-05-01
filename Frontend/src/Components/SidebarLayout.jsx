import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../Styles/layout.css";

const SidebarLayout = () => {
  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default SidebarLayout;
