import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const DashboardDispatcher = () => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" replace />;

  // Chuyển đổi authorities thành mảng string để dễ kiểm tra
  const roles = (user.authorities || []).map(auth => 
    typeof auth === 'string' ? auth : auth.authority
  );

  if (roles.includes('ROLE_ADMIN')) {
    return <Navigate to="/admin/dashboard" replace />;
  } 
  
  if (roles.includes('ROLE_STAFF')) {
    return <Navigate to="/staff/dashboard" replace />;
  } 
  
  if (roles.includes('ROLE_CUSTOMER')) {
    return <Navigate to="/customer/dashboard" replace />;
  }

  // Nếu không khớp bất kỳ role nào, đưa về trang profile thay vì gây loop
  return <Navigate to="/profile" replace />;
};

export default DashboardDispatcher;
