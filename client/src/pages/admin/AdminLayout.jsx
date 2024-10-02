// src/layouts/AdminLayout.jsx
import React from 'react';
import Sidebar from '../admin/Sidebar';
import Navbar from '../admin/Navbar';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="flex">
      <div className="basis-[16%] h-[100vh]">
        <Sidebar />
      </div>
      <div className="basis-[100%]  overflow-scroll h-[100vh]">
        <Navbar/>
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
