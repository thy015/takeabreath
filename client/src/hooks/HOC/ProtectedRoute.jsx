import React from "react";
import { Navigate } from "react-router-dom";
import { openNotification } from "../notification";
import { Spin } from "antd";

const ProtectedRoute = ({ children, user, allowedRoles, isLoading }) => {
    
    if(isLoading){
        return <Spin></Spin>
    }
    // Kiểm tra nếu chưa đăng nhập hoặc không có quyền
    if (!user || !allowedRoles.includes(user.role)) {
        openNotification(false, "Vui lòng đăng nhập với quyền " + allowedRoles)
        return <Navigate to="/" replace />; // Chuyển hướng đến trang login
    }

    return children; // Render component nếu hợp lệ
};

export default ProtectedRoute;
